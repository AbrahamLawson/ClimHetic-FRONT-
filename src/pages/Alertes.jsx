import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import AlertList from "../components/alerts/AlertList";
import AlertModal from "../components/alerts/AlertModal";
import StatCard from "../components/StatCard";
import Searchbar from "../components/Searchbar";
import Filter from "../components/Filter";
import alertService from "../services/alertService";
import "../styles/statcard.css";
import "../styles/global.css";
import "../styles/searchbar.css";
import "../styles/filter.css";

export default function Alertes() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    danger: 0,
    critical: 0,
    warning: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const categories = [
    {
      title: "Type d'alerte",
      options: [
        { label: "Danger", value: "Danger" },
        { label: "Critiques", value: "Critical" },
        { label: "Attention", value: "Warning" },
      ],
    },
  ];

  const chargerAlertes = async () => {
    try {
      setLoading(true);
      const response = await alertService.getAllAlertes();
      
      if (response.success && response.data) {
        setAlerts(response.data.alertes || []);
        setStats(response.data.stats || { total: 0, danger: 0, critical: 0, warning: 0 });
      } else {
        console.warn('Erreur lors du chargement des alertes:', response.error);
        setAlerts([]);
        setStats({ total: 0, danger: 0, critical: 0, warning: 0 });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      setAlerts([]);
      setStats({ total: 0, danger: 0, critical: 0, warning: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      chargerAlertes();
    }
  }, [isAuthenticated]);

  const handleAlertClick = (alert) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a))
    );
    setSelectedAlert(alert);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchSearch =
        alert.room?.toLowerCase().includes(search.toLowerCase()) ||
        alert.title?.toLowerCase().includes(search.toLowerCase()) ||
        alert.recommendation?.toLowerCase().includes(search.toLowerCase());

      const matchType =
        !filters["Type d'alerte"] || filters["Type d'alerte"].length === 0
          ? true
          : filters["Type d'alerte"].includes(alert.type);

      return matchSearch && matchType;
    });
  }, [alerts, search, filters]);


  if (!isAuthenticated) {
    return (
      <main className="page-wrapper" tabIndex={-1}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Accès non autorisé</h1>
          <p>Vous devez être connecté pour voir les alertes.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>
      <div id="main-content" tabIndex={-1}>
        <h1 className="dashboard-title" style={{ marginBottom: "1.5rem" }}>
          Alertes
        </h1>

        <section aria-labelledby="stats-section">
          <h2 id="stats-section" className="visually-hidden">Statistiques</h2>
          <div className="stat-cards-container" style={{ marginBottom: "2rem" }}>
            <StatCard 
              aria-label="Nombre total d'alertes" 
              value={stats.total} 
              label="Alertes" 
              icon="siren" 
            />
            <StatCard 
              aria-label="Alertes danger" 
              value={stats.danger} 
              label="Danger" 
              icon="skull" 
            />
            <StatCard 
              aria-label="Alertes critiques" 
              value={stats.critical} 
              label="Critiques" 
              icon="triangle-exclamation" 
            />
            <StatCard 
              aria-label="Alertes attention" 
              value={stats.warning} 
              label="Attention" 
              icon="triangle-alert" 
            />
          </div>
        </section>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <Searchbar
              placeholder="Rechercher par salle, titre ou recommandation..."
              value={search}
              onChange={setSearch}
            />
          </div>
          
          <div className="filter-sticky">
            <Filter categories={categories} onChange={setFilters} />
          </div>
        </div>

        {/* Liste des alertes */}
        <section aria-labelledby="alerts-section">
          <h2 id="alerts-section" className="visually-hidden">Liste des alertes</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Chargement des alertes...
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Aucune alerte ! Toutes les salles sont conformes.
            </div>
          ) : (
            <AlertList alerts={filteredAlerts} onAlertClick={handleAlertClick} />
          )}
        </section>

        {selectedAlert && (
          <AlertModal alert={selectedAlert} onClose={handleCloseModal} />
        )}
      </div>
    </main>
  );
}