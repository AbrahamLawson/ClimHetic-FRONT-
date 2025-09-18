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
  
  // Détermine le rôle basé sur l'utilisateur connecté
  const role = !isAuthenticated ? "guest" : (isAdmin ? "admin" : "user");
  
  // États pour les vraies données
  const [salles, setSalles] = useState([]);
  const [alertesCritiques, setAlertesCritiques] = useState([]);
  const [nombreCapteurs, setNombreCapteurs] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les données
  const chargerDonnees = async () => {
    try {
      setLoading(true);
      
      // Utiliser uniquement verifier_conformite_salles du backend
      const [capteursResponse, conformiteResponse] = await Promise.all([
        capteurService.getAllCapteurs(),
        capteurService.getConformiteSalles(10) // Appelle verifier_conformite_salles avec limit=10
      ]);
      
      // Nombre de capteurs
      if (capteursResponse.success && capteursResponse.data) {
        const capteurs = capteursResponse.data.capteurs || [];
        setNombreCapteurs(capteurs.length);
      }
      
      // Données des salles avec vraies moyennes
      if (conformiteResponse.success && conformiteResponse.data) {
        const conformiteData = conformiteResponse.data.salles || [];
        
        // Transformer toutes les salles d'abord
        const toutesLesSalles = conformiteData.map((item) => {
          const salle = item.salle;
          const moyennes = item.moyennes;
          const detailsVerification = item.details_verification;
          const alertes = item.alertes || [];
          
          // Utiliser directement la méthode verifier_conformite_salles pour déterminer le statut
          let status = "Confortable"; // Par défaut
          
          // Cas 1: Aucune donnée disponible
          if (item.statut === 'AUCUNE_DONNEE') {
            status = "Attention"; // Pas de données de capteurs
          }
          // Cas 2: Seuils de conformité non définis
          else if (item.statut === 'SEUILS_NON_DEFINIS') {
            status = "Attention"; // Configuration manquante
          }
          // Cas 3: Salle conforme selon les seuils
          else if (item.statut === 'CONFORME') {
            status = "Confortable"; // Tout est dans les normes
          }
          // Cas 4: Salle non conforme - utiliser le score de conformité calculé
          else if (item.statut === 'NON_CONFORME') {
            if (detailsVerification) {
              const scoreConformite = detailsVerification.score_conformite;
              const niveauConformite = detailsVerification.niveau_conformite;
              const pourcentageConformite = detailsVerification.pourcentage_conformite;
              
              // Utiliser le score et le niveau calculés par verifier_seuils()
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
              // Si pas de details_verification mais statut NON_CONFORME, c'est au minimum une Attention
              status = "Attention";
              console.warn(`Salle ${salle.nom}: NON_CONFORME mais pas de details_verification`);
            }
          }
          
          // Log détaillé pour débugger
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
            // Données brutes pour les alertes
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
          // Filtrer les salles qui ont au moins une valeur non nulle
          return salle.temperature !== null || salle.humidite !== null || salle.pression !== null;
        });

        // Séparer les salles confortables pour le tableau
        const sallesConfortables = toutesLesSalles
          .filter((salle) => salle.status === "Confortable")
          .map((salle) => ({
            ...salle,
            temperature: salle.temperature !== null ? salle.temperature : 'N/A',
            humidite: salle.humidite !== null ? salle.humidite : 'N/A',
            pression: salle.pression !== null ? salle.pression : 'N/A',
          }));

        // Créer les alertes critiques à partir des salles non-confortables
        const sallesProblematiques = toutesLesSalles.filter((salle) => salle.status !== "Confortable");
        
        const alertesGenerees = sallesProblematiques.map((salle) => {
          const rawData = salle.rawData;
          const alertes = rawData.alertes || [];
          const moyennes = rawData.moyennes;
          const capteurs = rawData.capteurs || []; // Noms des capteurs depuis le backend
          const derniereMesureDate = rawData.derniereMesureDate; // Date de dernière mesure
          
          // Déterminer le type d'alerte selon le statut
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
          
          // Extraire uniquement les valeurs problématiques depuis les alertes du backend
          const valeursProblematiques = [];
          
          alertes.forEach(alerte => {
            // Extraire la valeur de température problématique
            const tempMatch = alerte.match(/Température.*?(\d+\.?\d*)°C/);
            if (tempMatch) {
              valeursProblematiques.push(`${tempMatch[1]}°C`);
            }
            
            // Extraire la valeur d'humidité problématique
            const humMatch = alerte.match(/Humidité.*?(\d+\.?\d*)%/);
            if (humMatch) {
              valeursProblematiques.push(`${humMatch[1]}%`);
            }
            
            // Extraire la valeur de pression problématique
            const pressMatch = alerte.match(/Pression.*?(\d+\.?\d*)hPa/);
            if (pressMatch) {
              valeursProblematiques.push(`${pressMatch[1]}hPa`);
            }
          });
          
          // Si aucune valeur problématique trouvée, afficher un message générique
          const valeurs = valeursProblematiques.length > 0 ? valeursProblematiques : [`Statut: ${salle.status}`];
          
          // Formater la date de dernière mesure ou utiliser la date actuelle si pas disponible
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
            date: dateFormatee, // Date de dernière mesure des capteurs
            time: heureFormatee, // Heure de dernière mesure des capteurs
            sensors: capteurs.length > 0 ? capteurs : [`Statut: ${salle.status}`], // Utiliser les vrais noms des capteurs
            recommendation: alertes.length > 0 ? alertes.join(" | ") : "Aucune recommandation spécifique", // Utiliser toutes les alertes du backend
            read: false,
            details: {
              statut: rawData.statut,
              score: rawData.detailsVerification?.score_conformite,
              niveau: rawData.detailsVerification?.niveau_conformite,
              pourcentage: rawData.detailsVerification?.pourcentage_conformite
            }
          };
        });
        
        // Trier les alertes par niveau de criticité puis par date récente
        const alertesTriees = alertesGenerees.sort((a, b) => {
          // Définir l'ordre de priorité des niveaux d'alerte
          const prioriteNiveau = {
            'Danger': 1,     // Plus critique
            'Alerte': 2,     // Moyennement critique
            'Attention': 3   // Moins critique
          };
          
          // Récupérer le niveau depuis le titre de l'alerte
          const niveauA = a.title.includes('critique') ? 'Danger' : 
                         a.title.includes('Alerte') ? 'Alerte' : 'Attention';
          const niveauB = b.title.includes('critique') ? 'Danger' : 
                         b.title.includes('Alerte') ? 'Alerte' : 'Attention';
          
          const prioriteA = prioriteNiveau[niveauA] || 4;
          const prioriteB = prioriteNiveau[niveauB] || 4;
          
          // Trier d'abord par niveau de criticité
          if (prioriteA !== prioriteB) {
            return prioriteA - prioriteB; // Danger (1) avant Alerte (2) avant Attention (3)
          }
          
          // Si même niveau, trier par date (plus récente en premier)
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB.getTime() - dateA.getTime(); // Date plus récente en premier
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

  // Charger les données au montage
  useEffect(() => {
    chargerDonnees();
  }, []);

  // Colonnes et data pour le tableau
  const columns = [
    { key: "id", label: "ID" },
    { key: "salle", label: "Salle" },
    { key: "temperature", label: "Température (°C)" },
    { key: "humidite", label: "Humidité (%)" },
    { key: "pression", label: "Pression (hPa)" },
    { key: "status", label: "Statut", type: "status" },
  ];

  // Utiliser directement les vraies données
  const data = salles;

  // data fictives H24 pour le graphique principal
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

 
// Afficher toutes les données (pas seulement les "Success")
const filteredData = data;

  return (
    <div className="page-wrapper">
      <h1 className="dashboard-title">Dashboard</h1>
      
      
    <div className="card-container">
{/* A FAIRE : changer la logique de recup des statcard avec les réelles datas */}
      <div className="stat-cards-container">
        <StatCard value={salles.length} label="Salles" icon="house-wifi" />
        {role !== "guest" && (
          <StatCard value={alertesCritiques.length} label="Alertes" icon="siren" />
        )}
        {role === "admin" && (
          <>
            <StatCard value={45} label="Utilisateurs" icon="user" />
            <StatCard value={nombreCapteurs} label="Capteurs" icon="circle-gauge" />
          </>
        )}
      </div>

      <Card title="Données capteurs" category="tableau" fullWidth>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Chargement des données...
          </div>
        ) : (
          <Tableau columns={columns} data={filteredData} />
        )}
      </Card>

      <Card
        title="Température moyenne par bâtiment (H24 fictif)"
        category="graphiques"
      >
        <SimpleChart
          data={graphData}
          metrics={["Bat A", "Bat B", "Bat C"]}
          alertZone={{ min: 20, max: 25 }}
        />
      </Card>

      {role !== "guest" && (
        <Card title="Alertes critiques" category="alertes">
          <AlertList alerts={alertesCritiques} onAlertClick={handleAlertClick} />
        </Card>
      )}

      {selectedAlert && (
        <AlertModal alert={selectedAlert} onClose={handleCloseModal} />
      )}
    </div>
    </div>
  );
}