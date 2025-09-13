import React from "react";
import { Check, TriangleAlert, Skull } from "lucide-react";
import "../styles/status.css";

const statusConfig = {
  Success: {
    label: "Confortable",
    className: "status-success",
    Icon: Check,
  },
  Warning: {
    label: "Attention",
    className: "status-warning",
    Icon: TriangleAlert,
  },
  Danger: {
    label: "Danger",
    className: "status-danger",
    Icon: Skull,
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