import { useState } from "react";
import "../../../styles/weather.css";

export default function SearchPanel({ onSearch, onChoose, onClose, hasPlace, onClear }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const r = await onSearch(query);
    setResults(r || []);
  }

  return (
    <div className="w-panel">
      <div className="w-panel__header">
        <strong>Recherche de lieu</strong>
        <button onClick={onClose} className="w-btn w-btn--ghost">Fermer</button>
      </div>

      <div className="w-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ville, adresse… (ex: Saint-Denis)"
          className="w-input"
        />
        <button onClick={handleSearch} className="w-btn">Rechercher</button>
      </div>

      {!!results.length && (
        <ul className="w-results">
          {results.map((r, i) => (
            <li key={`${r.lat}-${r.lon}-${i}`} className="w-result" onClick={() => onChoose(r)} title="Choisir ce lieu">
              {r.label}
            </li>
          ))}
        </ul>
      )}

      {hasPlace && (
        <div className="w-footnote">
          Lieu mémorisé dans un cookie • <button onClick={onClear} className="w-link">supprimer</button>
        </div>
      )}
    </div>
  );
}
