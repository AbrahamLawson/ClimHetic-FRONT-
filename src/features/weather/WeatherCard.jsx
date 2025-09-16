import { useWeatherContext } from "./context/WeatherContext";
import WeatherDisplay from "./components/WeatherDisplay";
import SearchPanel from "./components/SearchPanel";
import ConfirmBanner from "./components/ConfirmBanner";
import "../../styles/weather.css";

export default function WeatherCard() {
  const {
    loading, error, weather, lastUpdated,
    place, locLabel, askConfirm, accuracyInfo,
    isSearchOpen,
    openSearch, closeSearch,
    runSearch, confirmPlace, clearPlace,
  } = useWeatherContext();

  if (loading) return <p>Chargement…</p>;

  return (
    <div>
      {}
      {askConfirm && (
        <ConfirmBanner
          locLabel={locLabel}
          accuracy={accuracyInfo}
          onConfirm={() => confirmPlace()}
          onSearch={openSearch}
        />
      )}

      {}
      {weather && (
        <WeatherDisplay locLabel={locLabel} weather={weather} lastUpdated={lastUpdated} />
      )}

      {}
      {isSearchOpen && (
        <SearchPanel
          onSearch={runSearch}
          onChoose={(p) => confirmPlace(p)}
          onClose={closeSearch}
          hasPlace={!!place}
          onClear={clearPlace}
        />
      )}

      {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
    </div>
  );
}
