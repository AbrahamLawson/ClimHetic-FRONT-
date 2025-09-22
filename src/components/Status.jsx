import React from "react";
import { Check, TriangleAlert, AlertTriangle, Skull, CircleAlert, CircleX, CircleCheck } from "lucide-react";
import "../styles/status.css";

const statusConfig = {  
  Danger: {
    label: "Danger",
    className: "status-danger",
    Icon: Skull,
  },
  Critical: {
    label: "Critiques",
    className: "status-critical",
    Icon: TriangleAlert,
  },
  Alerte: {
    label: "Alerte",
    className: "status-alert",
    Icon: AlertTriangle,
  },
  Success: {
    label: "Confortable",
    className: "status-success",
    Icon: Check,
  },
  Warning: {
    label: "Attention",
    className: "status-warning",
    Icon: CircleAlert,
  },
  Active: {
    label: "Actif",
    className: "status-active",
    Icon: CircleCheck,
  },
  Inactive: {
    label: "Inactif",
    className: "status-inactive",
    Icon: CircleX,
  },
};

export default function Status({ value }) {
  const config = statusConfig[value] || {};
  const Icon = config.Icon;
  return (
    <span className={`status-badge ${config.className || ""}`}>
      {Icon && <Icon size={16} className="status-icon" />}
      <span className="status-label">{config.label || value}</span>
    </span>
  );
}