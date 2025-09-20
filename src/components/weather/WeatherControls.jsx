import { useWeatherContext } from "../../contexts/WeatherContext";
import "../../../styles/weather.css";

export default function WeatherControls() {
  const { openSearch, clearPlace } = useWeatherContext();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button className="btn" onClick={openSearch}>Rechercher à nouveau</button>
      <button className="btn" onClick={openSearch}>Changer de lieu</button>
      <button className="btn btn-secondary" onClick={clearPlace}>Réinitialiser</button>
    </div>
  );
}
