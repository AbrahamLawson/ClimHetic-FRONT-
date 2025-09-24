import "../styles/card.css";
import { useNavigate } from "react-router-dom";

export default function Card({ title, children, fullWidth = false, category, to, className = "" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <div
      className={`card ${fullWidth ? "card-full" : "card-half"} ${category ? `card-${category}` : ""} ${className}`}
      onClick={handleClick}
      style={{ cursor: to ? "pointer" : "default" }}
      role={to ? "button" : undefined}
      tabIndex={to ? 0 : undefined}
      onKeyDown={e => {
        if (to && (e.key === "Enter" || e.key === " ")) handleClick();
      }}
    >
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-content">{children}</div>
    </div>
  );
}
