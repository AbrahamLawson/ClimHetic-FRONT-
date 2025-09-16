import "../../../styles/weather.css";

export default function ConfirmBanner({ locLabel, accuracy, onConfirm, onSearch }) {
  return (
    <div className="w-banner">
      <div style={{ marginBottom: 8 }}>
        {`Est-ce que vous êtes bien ici : ${locLabel} ?`}
        {accuracy ? ` (précision ~${accuracy} m)` : ""}
      </div>
      <div className="w-row">
        <button onClick={onConfirm} className="w-btn">Oui, mémoriser</button>
        <button onClick={onSearch} className="w-btn w-btn--ghost">Rechercher manuellement</button>
      </div>
    </div>
  );
}
