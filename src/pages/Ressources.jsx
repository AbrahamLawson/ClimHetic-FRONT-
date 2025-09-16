import { useAuth } from "../contexts/AuthContext";
import Card from "../components/Card";

import { WeatherProvider, useWeatherContext } from "../features/weather/context/WeatherContext";
import WeatherCard from "../features/weather/WeatherCard";

function WeatherToolbar() {
  const { openSearch, clearPlace, locLabel } = useWeatherContext();

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
      <span style={{ opacity: 0.8 }}>Lieu actuel : {locLabel}</span>
      <button
        onClick={openSearch}
        style={{ padding: "6px 10px", border: "1px solid #444", borderRadius: 8, background: "#2b2b2b", color: "#f0f0f0", cursor: "pointer" }}
      >
        Changer de lieu
      </button>
      <button
        onClick={clearPlace}
        style={{ padding: "6px 10px", border: "1px solid #444", borderRadius: 8, background: "transparent", color: "#f0f0f0", cursor: "pointer" }}
      >
        Réinitialiser
      </button>
    </div>
  );
}

export default function Ressources() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="page-wrapper">
      <h1>Ressources</h1>
      
      <div className="resources-content">
        <div className="resource-section">
          <h2>Documentation</h2>
          <ul>
            <li><a href="#" target="_blank">Guide utilisateur ClimHetic</a></li>
            <li><a href="#" target="_blank">FAQ - Questions fréquentes</a></li>
            <li><a href="#" target="_blank">Tutoriels vidéo</a></li>
          </ul>
        </div>

        <div className="resource-section">
          <h2>Contacts</h2>
          <div className="contact-info">
            <p><strong>Support technique :</strong> support@climhetic.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Horaires :</strong> Lundi - Vendredi | 9h - 18h</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="resource-section">
            <h2>Ressources utilisateur</h2>
            <ul>
              <li><a href="#" target="_blank">Rapports personnalisés</a></li>
              <li><a href="#" target="_blank">Historique des données</a></li>
              <li><a href="#" target="_blank">Paramètres de notification</a></li>
            </ul>
          </div>
        )}

        {isAdmin && (
          <div className="resource-section">
            <h2>Ressources administrateur</h2>
            <ul>
              <li><a href="#" target="_blank">Guide d'administration</a></li>
              <li><a href="#" target="_blank">Configuration système</a></li>
              <li><a href="#" target="_blank">Logs système</a></li>
              <li><a href="#" target="_blank">Sauvegarde et restauration</a></li>
            </ul>
          </div>
        )}
        
        {}
        <div className="resource-section">
          <h2>Météo locale</h2>

          {}
          <WeatherProvider>
            {}
            <WeatherToolbar />

            {}
            <Card title="Météo locale" category="meteo">
              <WeatherCard />
            </Card>
          </WeatherProvider>
        </div>
      </div>
    </div>
  );
}