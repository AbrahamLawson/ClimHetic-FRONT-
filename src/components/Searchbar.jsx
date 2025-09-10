import { Search } from "lucide-react";
import "../styles/searchbar.css";

export default function Searchbar({ placeholder = "Rechercher...", value, onChange }) {
  return (
    <div className="searchbar-container">
      <span className="searchbar-icon">
        <Search size={18} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="searchbar-input"
      />
    </div>
  );
}
