// export default function Alertes() {
//   return <h1>Alertes</h1>;
// }

import { useState } from "react";
import AlertList from "../components/alerts/AlertList";
import AlertModal from "../components/alerts/AlertModal";
import StatCard from "../components/StatCard";
import Filter from "../components/Filter";
import "../styles/statcard.css";
import "../styles/alert.css";

export default function Alertes() {
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
    const categories=[
          {
            title: "État",
            options: [
              { value: "Warning", label: "Attention" },
              { value: "Danger", label: "Danger" },
            ],
          },
        ];

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filters, setFilters] = useState({});

  const handleAlertClick = (alert) => {
    setAlerts((prev) =>
      prev.map((a) => (a === alert ? { ...a, read: true } : a))
    );
    setSelectedAlert(alert);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filters["État"]?.length) {
      return filters["État"].includes(a.type);
    }
    return true;
  });

  return (
    <main className="page-wrapper" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>
      <div id="main-content" tabIndex={-1}>
      <h1 className="page-title" style={{ marginBottom: "1.5rem" }}>
        Alertes
      </h1>
    <section aria-labelledby="stats-section">
      <h2 id="stats-section" className="visually-hidden">Statistiques</h2>
      <div className="stat-cards-container" style={{ marginBottom: "2rem" }}>
        <StatCard aria-label="Informations nombre d'alertes" value={alerts.length} label="Alertes" icon="siren" />
      </div>
    </section>
    <section aria-labelledby="filter-section">
      <h2 id="search-section" className="visually-hidden">Filtres</h2>
      <div className="filter-sticky" style={{ marginBottom: "1.5rem" }}>
      <Filter 
      aria-label="Filtrer des alertes" 
      categories={categories} 
      onChange={setFilters}
      />
      </div>
    </section>
      <AlertList alerts={filteredAlerts} onAlertClick={handleAlertClick} />

      {selectedAlert && (
        <AlertModal alert={selectedAlert} onClose={handleCloseModal} />
      )}
      </div>
    </main>
  );
}
