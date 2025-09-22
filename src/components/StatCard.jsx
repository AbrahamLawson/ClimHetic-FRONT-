import React from "react";
import "../styles/statcard.css";
import { User, HouseWifi, CircleGauge, Siren, CircleX, CircleCheck, Skull, TriangleAlert, AlertTriangle, CircleAlert } from "lucide-react";

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
        bgColor = "var(--bg-active)";
        iconColor = "var(--active)";
        break;
      case "siren":
        IconComponent = Siren;
        bgColor = "var(--bg-danger)";
        iconColor = "var(--danger)";
        break;
      case "circle-x":
        IconComponent = CircleX;
        bgColor = "var(--bg-inactive)";
        iconColor = "var(--inactive)";
        break;
      case "circle-check":
        IconComponent = CircleCheck;
        bgColor = "var(--bg-success)";
        iconColor = "var(--success)";
        break;
      case "skull":
        IconComponent = Skull;
        bgColor = "var(--bg-danger-life)";
        iconColor = "var(--danger-life)";
        break;
      case "triangle-exclamation":
        IconComponent = TriangleAlert;
        bgColor = "var(--bg-critical)";
        iconColor = "var(--critical)";
        break;
      case "circle-alert":
        IconComponent = CircleAlert;
        bgColor = "var(--bg-warning)";
        iconColor = "var(--warning)";
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
