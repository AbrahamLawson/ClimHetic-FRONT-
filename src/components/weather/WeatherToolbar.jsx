import { useWeatherContext } from "../../contexts/WeatherContext";

export default function WeatherToolbar() {
  const { openSearch, clearPlace, locLabel } = useWeatherContext();

  return (
    <div className="weather-toolbar">
      <span className="weather-location">Lieu actuel : {locLabel}</span>
      <div className="weather-actions">
        <button
          className="btn"
          onClick={openSearch}
        >
          Changer de lieu
        </button>
        <button
          onClick={clearPlace}
          className="btn btn-secondary"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}