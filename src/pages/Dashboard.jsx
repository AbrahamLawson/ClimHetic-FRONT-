// export default function Dashboard() {
//   return <h1>Dashboard</h1>;
// }

import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import SimpleChart from "../components/Graphique";
import Tableau from "../components/Tableau";
import AlertList from "../components/alerts/AlertList";
import AlertModal from "../components/alerts/AlertModal";
import StatCard from "../components/StatCard";
import SectionLoader from "../components/SectionLoader";
import { WeatherProvider } from "../contexts/WeatherContext";
import WeatherCard from "../components/weather/WeatherCard";
import capteurService from "../services/capteurService";
import { getAllUsers } from "../auth";
import "../styles/statcard.css";
import "../styles/global.css";

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const role = !isAuthenticated ? "guest" : (isAdmin ? "admin" : "user");
  
  const [salles, setSalles] = useState([]);
  const [alertesCritiques, setAlertesCritiques] = useState([]);
  const [nombreCapteurs, setNombreCapteurs] = useState(0);
  const [nombreUtilisateurs, setNombreUtilisateurs] = useState(0);
  const [loading, setLoading] = useState(true);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      
      const [capteursResponse, conformiteResponse, usersResponse] = await Promise.all([
        capteurService.getAllCapteurs(),
        capteurService.getConformiteSalles(10),
        getAllUsers()
      ]);
      
      if (capteursResponse.success && capteursResponse.data) {
        const capteurs = capteursResponse.data.capteurs || [];
        setNombreCapteurs(capteurs.length);
      }
      
      if (usersResponse && !usersResponse.error && usersResponse.users) {
        setNombreUtilisateurs(usersResponse.users.length);
      }
      
      if (conformiteResponse.success && conformiteResponse.data) {
        const conformiteData = conformiteResponse.data.salles || [];
        
        const toutesLesSalles = conformiteData.map((item) => {
          const salle = item.salle;
          const moyennes = item.moyennes;
          const detailsVerification = item.details_verification;
          const alertes = item.alertes || [];
          
          let status = "Success";
          
          if (item.statut === 'AUCUNE_DONNEE') {
            status = "Warning"; 
          }
          else if (item.statut === 'SEUILS_NON_DEFINIS') {
            status = "Warning"; 
          }
          else if (item.statut === 'CONFORME') {
            status = "Success"; 
          }
          else if (item.statut === 'NON_CONFORME') {
            if (detailsVerification) {
              const scoreConformite = detailsVerification.score_conformite;
              const niveauConformite = detailsVerification.niveau_conformite;
              const pourcentageConformite = detailsVerification.pourcentage_conformite;
              
              if (niveauConformite === "EXCELLENT" || scoreConformite === 1) {
                status = "Success";
              } else if (niveauConformite === "BON" || scoreConformite === 2) {
                status = "Warning";
              } else if (niveauConformite === "MOYEN" || scoreConformite === 3) {
                status = "Critical";
              } else if (niveauConformite === "MAUVAIS" || scoreConformite === 4) {
                status = "Danger";
              }
            } else {
              status = "Warning";
              console.warn(`Salle ${salle.nom}: NON_CONFORME mais pas de details_verification`);
            }
          }
          
          console.log(`Salle ${salle.nom}: Statut backend=${item.statut}, Statut frontend=${status}`);
          console.log(`  - Details verification:`, detailsVerification);
          console.log(`  - Item complet:`, item);
          
          return {
            id: salle.id,
            salle: salle.nom,
            temperature: moyennes?.moyenne_temperature ? Math.round(moyennes.moyenne_temperature * 10) / 10 : null,
            humidite: moyennes?.moyenne_humidite ? Math.round(moyennes.moyenne_humidite * 10) / 10 : null,
            pression: moyennes?.moyenne_pression ? Math.round(moyennes.moyenne_pression * 10) / 10 : null,
            status: status,
            rawData: {
              statut: item.statut,
              alertes: alertes,
              detailsVerification: detailsVerification,
              moyennes: moyennes,
              capteurs: item.capteurs || [],
              derniereMesureDate: item.derniere_mesure_date
            }
          };
        }).filter((salle) => {
          return salle.temperature !== null || salle.humidite !== null || salle.pression !== null;
        });

        console.log('🔍 Dashboard - Statuts des salles:', toutesLesSalles.map(s => ({nom: s.salle, status: s.status})));
        
        const sallesProblematiques = toutesLesSalles.filter((salle) => salle.status !== "Success");
        
        const alertesGenerees = sallesProblematiques.map((salle) => {
          const rawData = salle.rawData;
          const alertes = rawData.alertes || [];
          const moyennes = rawData.moyennes;
          const capteurs = rawData.capteurs || []; 
          const derniereMesureDate = moyennes?.derniere_mesure_date; 
          
          let type = "Warning";
          let title = "Problème détecté";
          
          if (salle.status === "Danger") {
            type = "Danger";
            title = "Situation critique";
          } else if (salle.status === "Critical") {
            type = "Critical";
            title = "Alerte conformité";
          } else if (salle.status === "Warning") {
            type = "Warning";
            title = "Surveillance requise";
          }
          
          const valeursProblematiques = [];
          
          alertes.forEach(alerte => {
            const tempMatch = alerte.match(/Température.*?(\d+\.?\d*)°C/);
            if (tempMatch) {
              valeursProblematiques.push(`${tempMatch[1]}°C`);
            }
            
            const humMatch = alerte.match(/Humidité.*?(\d+\.?\d*)%/);
            if (humMatch) {
              valeursProblematiques.push(`${humMatch[1]}%`);
            }
            
            const pressMatch = alerte.match(/Pression.*?(\d+\.?\d*)hPa/);
            if (pressMatch) {
              valeursProblematiques.push(`${pressMatch[1]}hPa`);
            }
          });
          
          const valeurs = valeursProblematiques.length > 0 ? valeursProblematiques : [`Statut: ${salle.status}`];
          
          let dateFormatee = new Date().toLocaleDateString('fr-FR');
          let heureFormatee = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          
          if (derniereMesureDate && derniereMesureDate !== '1900-01-01 00:00:00') {
            const dateMesure = new Date(derniereMesureDate);
            dateFormatee = dateMesure.toLocaleDateString('fr-FR');
            heureFormatee = dateMesure.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          }
          
          const capteursStrings = capteurs.length > 0 
            ? (() => {
                const capteursUniques = {};
                capteurs.forEach(capteur => {
                  const nom = capteur.nom;
                  if (!capteursUniques[nom]) {
                    capteursUniques[nom] = [];
                  }
                  capteursUniques[nom].push(capteur.type_capteur);
                });
                
                return Object.keys(capteursUniques).map(nom => {
                  const types = capteursUniques[nom];
                  if (types.length === 1) {
                    return `${nom} (${types[0]})`;
                  } else {
                    return nom;
                  }
                });
              })()
            : [`Statut: ${salle.status}`];
          
          return {
            room: salle.salle,
            title: title,
            metric: valeurs.join(" | "),
            type: type,
            date: dateFormatee, 
            time: heureFormatee, 
            sensors: capteursStrings,
            recommendation: alertes.length > 0 ? alertes.join(" | ") : "Aucune recommandation spécifique", 
            read: false,
            details: {
              statut: rawData.statut,
              score: rawData.detailsVerification?.score_conformite,
              niveau: rawData.detailsVerification?.niveau_conformite,
              pourcentage: rawData.detailsVerification?.pourcentage_conformite
            }
          };
        });
        
        const alertesTriees = alertesGenerees.sort((a, b) => {
          const prioriteNiveau = {
            'Danger': 1,     
            'Critical': 2,     
            'Warning': 3   
          };
          
          const prioriteA = prioriteNiveau[a.type] || 4;
          const prioriteB = prioriteNiveau[b.type] || 4;
          
          if (prioriteA !== prioriteB) {
            return prioriteA - prioriteB; 
          }
          
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB.getTime() - dateA.getTime(); 
        });
        
        const sallesConfortables = toutesLesSalles
          .filter((salle) => salle.status === "Success")
          .map((salle) => ({
            ...salle,
            temperature: salle.temperature !== null ? salle.temperature : 'N/A',
            humidite: salle.humidite !== null ? salle.humidite : 'N/A',
            pression: salle.pression !== null ? salle.pression : 'N/A',
          }));
        
        setSalles(sallesConfortables);
        setAlertesCritiques(alertesTriees);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      chargerDonnees();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);


  const columns = [
    { key: "id", label: "ID" },
    { key: "salle", label: "Salle" },
    { key: "temperature", label: "Température (°C)" },
    { key: "humidite", label: "Humidité (%)" },
    { key: "pression", label: "Pression (hPa)" },
    { key: "status", label: "Statut", type: "status" },
  ];

  const data = salles;


  const graphData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}h`,
    "Bat A": 22 + Math.round(Math.random() * 3),
    "Bat B": 24 + Math.round(Math.random() * 2),
    "Bat C": 23 + Math.round(Math.random() * 2),
  }));

  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleAlertClick = (alert) => {
    setAlertesCritiques((prev) =>
      prev.map((a) => (a === alert ? { ...a, read: true } : a))
    );
    setSelectedAlert(alert);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
  };

const filteredData = data;

  return (

    <main className="page-wrapper fade-in" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>
      <div id="main-content" tabIndex={-1}>
      <h1 className="dashboard-title" style={{ marginBottom: "1.5rem" }}>Dashboard</h1>


      <section className="top-dashboard" aria-label="Statistiques et météo">
        <div className="stats-column" aria-label="Section statistiques">
          <div className="stat-cards-grid fade-in">
            <StatCard value={salles.length + alertesCritiques.length} label="Salles" icon="house-wifi" aria-label="Nombre de salles" />
            {role !== "guest" && (
              <StatCard value={alertesCritiques.length} label="Alertes" icon="siren" aria-label="Nombre d'alertes" />
            )}
            {role === "admin" && (
              <>
                <StatCard value={nombreUtilisateurs} label="Utilisateurs" icon="user" aria-label="Nombre d'utilisateurs" />
                <StatCard value={nombreCapteurs} label="Capteurs" icon="circle-gauge" aria-label="Nombre de capteurs"/>
              </>
            )}
          </div>
        </div>

        <section className="weather-column fade-in" aria-label="Section météo">
          <WeatherProvider>
            <Card title="Météo locale" category="meteo">
              {loading ? (
                <SectionLoader text="Chargement de la météo" />
              ) : ( 
              <WeatherCard />
        )}
            </Card>
          </WeatherProvider>
        </section>
        </section>

    <div className="card-container fade-in">
      <Card title="Données capteurs" category="tableau" aria-labelledby="data-heading" fullWidth>
        {loading ? (
          <SectionLoader text="Chargement des données" />
        ) : (
          <Tableau columns={columns} data={filteredData} aria-label="Tableau des salles" />
        )}
      </Card>
      <Card
        title="Température moyenne par bâtiment (24h)"
        category="graphiques"
        aria-labelledby="data-graphs"
        className="hide-on-mobile"
        >
        {loading ? (
          <SectionLoader text="Chargement des données" />
        ) : ( 
        <SimpleChart
          data={graphData}
          metrics={["Bat A", "Bat B", "Bat C"]}
          alertZone={{ min: 20, max: 25 }}
          aria-label="Graphiques des salles"
          />
          )}
      </Card>

      {role !== "guest" && (
        <Card title="Alertes critiques" category="alertes" aria-labelledby="data-alert">
          {loading ? (
          <SectionLoader text="Chargement des alertes" />
        ) : ( 
          <AlertList alerts={alertesCritiques} onAlertClick={handleAlertClick} />
        )}
        </Card>
      )}

      {selectedAlert && (
        <AlertModal alert={selectedAlert} onClose={handleCloseModal} />
      )}
    </div>

    </div>
    </main>
  );
}
