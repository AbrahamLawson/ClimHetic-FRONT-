import { useWeatherContext } from "../context/WeatherContext";
import "../../../styles/weather.css";

export default function WeatherControls() {
  const { openSearch, clearPlace } = useWeatherContext();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button className="w-btn w-btn--ghost" onClick={openSearch}>Rechercher à nouveau</button>
      <button className="w-btn" onClick={openSearch}>Changer de lieu</button>
      <button className="w-btn w-btn--ghost" onClick={clearPlace}>Réinitialiser</button>
    </div>
  );
}
