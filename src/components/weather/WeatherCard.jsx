import { useWeatherContext } from "../../contexts/WeatherContext";
import WeatherDisplay from "./WeatherDisplay";
import SearchPanel from "./SearchPanel";
import ConfirmBanner from "./ConfirmBanner";
import "../../styles/weather.css";

export default function WeatherCard({ showControls = false }) {
  const {
    loading, error, weather, lastUpdated,
    place, locLabel, askConfirm, accuracyInfo,
    isSearchOpen,
    openSearch, closeSearch,
    runSearch, confirmPlace, clearPlace,
  } = useWeatherContext();

  if (loading) return <p>Chargement…</p>;

  return (
    <div className="weather-card">
      {showControls && (
        <div className="weather-location-header">
          <div className="weather-location-info">
            <span>Lieu actuel : {locLabel}</span>
            <button onClick={clearPlace} className="btn btn-secondary">
              Réinitialiser
            </button>
          </div>
          <div className="weather-location-actions">
            <button className="btn" onClick={openSearch}>
              Changer de lieu
            </button>
          </div>
        </div>
      )}

      <div className={`weather-content ${showControls ? 'with-controls' : ''}`}>
        <div className="weather-info">
          {askConfirm && (
            <ConfirmBanner
              locLabel={locLabel}
              accuracy={accuracyInfo}
              onConfirm={() => confirmPlace()}
              onSearch={openSearch}
            />
          )}

          {weather && (
            <WeatherDisplay locLabel={locLabel} weather={weather} lastUpdated={lastUpdated} />
          )}

          {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}

          {showControls && place && (
            <div className="weather-cookie-info">
              <span>Lieu mémorisé dans un cookie</span>
              <button onClick={clearPlace} className="btn btn-text">
                Supprimer
              </button>
            </div>
          )}
        </div>

        {showControls && isSearchOpen && (
          <SearchPanel
            onSearch={runSearch}
            onChoose={(p) => confirmPlace(p)}
            onClose={closeSearch}
            hasPlace={!!place}
            onClear={clearPlace}
          />
        )}
      </div>
    </div>
  );
}
