import React from "react";
import "../styles/statcard.css";

export default function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}
