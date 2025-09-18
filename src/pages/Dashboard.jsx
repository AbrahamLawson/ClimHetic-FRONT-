// export default function Dashboard() {
//   return <h1>Dashboard</h1>;
// }

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import SimpleChart from "../components/Graphique";
import Tableau from "../components/Tableau";
import AlertList from "../components/alerts/AlertList";
import AlertModal from "../components/alerts/AlertModal";
import StatCard from "../components/StatCard";
import capteurService from "../services/capteurService";
import "../styles/statcard.css";
import "../styles/global.css";

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const role = !isAuthenticated ? "guest" : (isAdmin ? "admin" : "user");
  
  const [salles, setSalles] = useState([]);
  const [alertesCritiques, setAlertesCritiques] = useState([]);
  const [nombreCapteurs, setNombreCapteurs] = useState(0);
  const [loading, setLoading] = useState(true);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      
      const [capteursResponse, conformiteResponse] = await Promise.all([
        capteurService.getAllCapteurs(),
        capteurService.getConformiteSalles(10) 
      ]);
      
      if (capteursResponse.success && capteursResponse.data) {
        const capteurs = capteursResponse.data.capteurs || [];
        setNombreCapteurs(capteurs.length);
      }
      
      if (conformiteResponse.success && conformiteResponse.data) {
        const conformiteData = conformiteResponse.data.salles || [];
        
        const toutesLesSalles = conformiteData.map((item) => {
          const salle = item.salle;
          const moyennes = item.moyennes;
          const detailsVerification = item.details_verification;
          const alertes = item.alertes || [];
          
          let status = "Confortable";
          
          if (item.statut === 'AUCUNE_DONNEE') {
            status = "Attention"; 
          }
          else if (item.statut === 'SEUILS_NON_DEFINIS') {
            status = "Attention"; 
          }
          else if (item.statut === 'CONFORME') {
            status = "Confortable"; 
          }
          else if (item.statut === 'NON_CONFORME') {
            if (detailsVerification) {
              const scoreConformite = detailsVerification.score_conformite;
              const niveauConformite = detailsVerification.niveau_conformite;
              const pourcentageConformite = detailsVerification.pourcentage_conformite;
              
              if (niveauConformite === "EXCELLENT" || scoreConformite === 1) {
                status = "Confortable";
              } else if (niveauConformite === "BON" || scoreConformite === 2) {
                status = "Attention";
              } else if (niveauConformite === "MOYEN" || scoreConformite === 3) {
                status = "Alerte";
              } else if (niveauConformite === "MAUVAIS" || scoreConformite === 4) {
                status = "Danger";
              }
            } else {
              status = "Attention";
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

        const sallesConfortables = toutesLesSalles
          .filter((salle) => salle.status === "Confortable")
          .map((salle) => ({
            ...salle,
            temperature: salle.temperature !== null ? salle.temperature : 'N/A',
            humidite: salle.humidite !== null ? salle.humidite : 'N/A',
            pression: salle.pression !== null ? salle.pression : 'N/A',
          }));

        const sallesProblematiques = toutesLesSalles.filter((salle) => salle.status !== "Confortable");
        
        const alertesGenerees = sallesProblematiques.map((salle) => {
          const rawData = salle.rawData;
          const alertes = rawData.alertes || [];
          const moyennes = rawData.moyennes;
          const capteurs = rawData.capteurs || []; 
          const derniereMesureDate = rawData.derniereMesureDate; 
          
          let type = "Warning";
          let title = "Problème détecté";
          
          if (salle.status === "Danger") {
            type = "Danger";
            title = "Situation critique";
          } else if (salle.status === "Alerte") {
            type = "Warning";
            title = "Alerte conformité";
          } else if (salle.status === "Attention") {
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
          
          if (derniereMesureDate) {
            const dateMesure = new Date(derniereMesureDate);
            dateFormatee = dateMesure.toLocaleDateString('fr-FR');
            heureFormatee = dateMesure.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          }
          
          return {
            room: salle.salle,
            title: title,
            metric: valeurs.join(" | "),
            type: type,
            date: dateFormatee, 
            time: heureFormatee, 
            sensors: capteurs.length > 0 ? capteurs : [`Statut: ${salle.status}`],
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
            'Alerte': 2,     
            'Attention': 3   
          };
          
          const niveauA = a.title.includes('critique') ? 'Danger' : 
                         a.title.includes('Alerte') ? 'Alerte' : 'Attention';
          const niveauB = b.title.includes('critique') ? 'Danger' : 
                         b.title.includes('Alerte') ? 'Alerte' : 'Attention';
          
          const prioriteA = prioriteNiveau[niveauA] || 4;
          const prioriteB = prioriteNiveau[niveauB] || 4;
          
          if (prioriteA !== prioriteB) {
            return prioriteA - prioriteB; 
          }
          
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB.getTime() - dateA.getTime(); 
        });
        
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

    <main className="page-wrapper" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>
      <div id="main-content" tabIndex={-1}>
      <h1 className="dashboard-title" style={{ marginBottom: "1.5rem" }}>Dashboard</h1>
    <div className="card-container">
      <section className="statistics-section">
      <div className="stat-cards-container" aria-label="Section statistiques">
        <StatCard value={salles.length} label="Salles" icon="house-wifi" aria-label="Nombre de salles"/>
        {role !== "guest" && (
          <StatCard value={alertesCritiques.length} label="Alertes" icon="siren" aria-label="Nombre d'alertes" />
        )}
        {role === "admin" && (
          <>
            <StatCard value={45} label="Utilisateurs" icon="user" aria-label="Nombre d'utilisateurs"/>
            <StatCard value={nombreCapteurs} label="Capteurs" icon="circle-gauge" aria-label="Nombre de capteurs"/>
          </>
        )}
      </div>
      </section>

      <Card title="Données capteurs" category="tableau" aria-labelledby="data-heading" fullWidth>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Chargement des données...
          </div>
        ) : (
          <Tableau columns={columns} data={filteredData} aria-label="Tableau des salles" />
        )}
      </Card>
      <Card
        title="Température moyenne par bâtiment (H24 fictif)"
        category="graphiques"
        aria-labelledby="data-graphs"
        >
        <SimpleChart
          data={graphData}
          metrics={["Bat A", "Bat B", "Bat C"]}
          alertZone={{ min: 20, max: 25 }}
          aria-label="Graphiques des salles"
          />
      </Card>

      {role !== "guest" && (
        <Card title="Alertes critiques" category="alertes" aria-labelledby="data-alert">
          <AlertList alerts={alertesCritiques} onAlertClick={handleAlertClick} />
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