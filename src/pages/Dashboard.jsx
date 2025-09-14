// export default function Dashboard() {
//   return <h1>Dashboard</h1>;
// }

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import SimpleChart from "../components/Graphique";
import Tableau from "../components/Tableau";
import AlertList from "../components/alerts/AlertList";
import AlertModal from "../components/alerts/AlertModal";
import StatCard from "../components/StatCard";
import "../styles/statcard.css";
import "../styles/global.css";

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // Détermine le rôle basé sur l'utilisateur connecté
  const role = !isAuthenticated ? "guest" : (isAdmin ? "admin" : "user");
  // Colonnes et data pour le tableau
  const columns = [
    { key: "id", label: "ID" },
    { key: "salle", label: "Salle" },
    { key: "temperature", label: "Température (°C)" },
    { key: "humidite", label: "Humidité (%)" },
    { key: "pression", label: "Pression (hPa)" },
    { key: "accelerometre", label: "Accéléromètre" },
    { key: "status", label: "Etat", type: "status" },
  ];

  // Génère data fictive pour le tableau
  const data = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    salle: `Salle ${i + 1}`,
    temperature: 19 + Math.floor(Math.random() * 10),
    humidite: 40 + Math.floor(Math.random() * 30),
    pression: 1010 + Math.floor(Math.random() * 10),
    accelerometre: Math.floor(Math.random() * 5),
    status: i % 5 === 0 ? "Warning" : "Success",
  }));

  // data fictives H24 pour le graphique principal
  const graphData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}h`,
    "Bat A": 22 + Math.round(Math.random() * 3),
    "Bat B": 24 + Math.round(Math.random() * 2),
    "Bat C": 23 + Math.round(Math.random() * 2),
  }));

  // fake données alertes à remplacer par nos vraies alertes
  const [alerts, setAlerts] = useState([
    {
      room: "Salle 101",
      title: "Température haute",
      metric: "28°C",
      type: "Warning",
      date: "27/08/2025",
      time: "14:32",
      sensors: ["AOER20", "O3R3N", "2E2NN"],
      recommendation: "Éteignez le chauffage et ouvrez les fenêtres",
      read: false,
    },
    {
      room: "Salle 202",
      title: "Humidité critique",
      metric: "85%",
      type: "Danger",
      date: "27/08/2025",
      time: "15:10",
      sensors: ["HUMID-22", "SENSX-9"],
      recommendation: "Activez la ventilation",
      read: true,
    },
    {
      room: "Salle 303",
      title: "Ventilation faible",
      metric: "12%",
      type: "Warning",
      date: "27/08/2025",
      time: "15:45",
      sensors: ["VENTO-1", "AIRFLOW-7"],
      recommendation: "Vérifiez le système de ventilation",
      read: true,
    },
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleAlertClick = (alert) => {
    setAlerts((prev) =>
      prev.map((a) => (a === alert ? { ...a, read: true } : a))
    );
    setSelectedAlert(alert);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
  };

 
const filteredData = data.filter((d) => d.status === "Success");

  return (
    <div className="page-wrapper">
      <h1 className="dashboard-title" style={{ marginBottom: "1.5rem" }}>Dashboard</h1>
    <div className="card-container">
{/* A FAIRE : changer la logique de recup des statcard avec les réelles datas */}
      <div className="stat-cards-container">
        <StatCard value={3} label="Salles" icon="house-wifi" />
        {role !== "guest" && (
          <StatCard value={alerts.length} label="Alertes" icon="siren" />
        )}
        {role === "admin" && (
          <>
            <StatCard value={45} label="Utilisateurs" icon="user" />
            <StatCard value={12} label="Capteurs" icon="circle-gauge" />
          </>
        )}
      </div>

      <Card title="Données capteurs" category="tableau" fullWidth>
        <Tableau columns={columns} data={filteredData} />
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
          <AlertList alerts={alerts} onAlertClick={handleAlertClick} />
        </Card>
      )}

      {selectedAlert && (
        <AlertModal alert={selectedAlert} onClose={handleCloseModal} />
      )}
    </div>
    </div>
  );
}