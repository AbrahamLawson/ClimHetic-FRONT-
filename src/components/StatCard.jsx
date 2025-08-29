import React from "react";
import "../styles/statcard.css";
import { User, HouseWifi, CircleGauge,Siren } from "lucide-react";

export default function StatCard({ value, label, icon, type }) {
  const renderIcon = () => {
    let IconComponent;
    let bgColor = "";
    let iconColor = "";

    switch (icon) {
      case "user":
        IconComponent = User;
        bgColor = "var(--bg--primary-dark)";
        iconColor = "var(--primary-dark)";
        break;
      case "house-wifi":
        IconComponent = HouseWifi;
        bgColor = "var(--bg--terciary)";
        iconColor = "var(--terciary)";
        break;
      case "circle-gauge":
        IconComponent = CircleGauge;
        bgColor = "var(--bg-success)";
        iconColor = "var(--success)";
        break;
        case "siren":
        IconComponent = Siren;
        bgColor = "var(--bg-danger)";
        iconColor = "var(--danger)";
        break;
      default:
        return null;
    }

    return (
      <div className="stat-icon" style={{ backgroundColor: bgColor }}>
        <IconComponent size={24} color={iconColor} />
      </div>
    );
  };

  return (
    <div className="stat-card">
      {renderIcon()}
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}
