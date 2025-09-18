import { useState } from "react";
import "../styles/filter.css";

export default function Filter({ categories, onChange }) {
  const [selectedValues, setSelectedValues] = useState({});

  const handleToggle = (category, value) => {
    const currentValues = selectedValues[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const updated = { ...selectedValues, [category]: newValues };
    setSelectedValues(updated);
    onChange?.(updated);
  };

  const handleReset = (category) => {
    const updated = { ...selectedValues, [category]: [] };
    setSelectedValues(updated);
    onChange?.(updated);
  };

  return (
    <div className="filter-bar">
      {categories.map((cat) => (
        <div key={cat.title} className="filter-dropdown">
          <button className="filter-trigger">
            {cat.title}
            <span className="chevron">▼</span>
          </button>

          <div className="filter-menu">
            <div className="filter-options">
              {cat.options.map((opt) => (
                <label key={opt.value} className="filter-option">
                  <input
                    type="checkbox"
                    tabIndex={0}
                    checked={(selectedValues[cat.title] || []).includes(opt.value)}
                    onChange={() => handleToggle(cat.title, opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <button
              className="filter-reset"
              onClick={() => handleReset(cat.title)}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
