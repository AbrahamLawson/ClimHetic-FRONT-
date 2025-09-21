import { useAuth } from "../contexts/AuthContext";
import { WeatherProvider } from "../contexts/WeatherContext";
import WeatherCard from "../components/weather/WeatherCard";
import WeatherToolbar from "../components/weather/WeatherToolbar";

export default function Parametres() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="page-wrapper">
      <h1>Paramètres</h1>
      
      <div className="settings-container">
        <section className="settings-section" aria-labelledby="weather-config-title">
          <h2>Configuration météo</h2>
          <WeatherProvider>
            <div className="weather-card-container">
              <WeatherCard showControls={true} />
            </div>
          </WeatherProvider>
        </section>
      </div>
    </div>
  );
}