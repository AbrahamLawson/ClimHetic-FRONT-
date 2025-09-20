import { useState } from "react";
import Searchbar from "../Searchbar";

export default function SearchPanel({ onSearch, onChoose, hasPlace, onClear }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const r = await onSearch(query);
    setResults(r || []);
  }

  return (
    <div className="weather-search">
      <div className="weather-search-container">
        <Searchbar
          placeholder="Ville, adresse… (ex: Saint-Denis)"
          value={query}
          onChange={setQuery}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Rechercher
        </button>
      </div>

      {results.length > 0 && (
        <div className="weather-search-results">
          {results.map((r, i) => (
            <button
              key={`${r.lat}-${r.lon}-${i}`}
              className="weather-location-item"
              onClick={() => onChoose(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
