import React from "react";
import "../../styles/alert.css";
import { Check, TriangleAlert, AlertTriangle, Skull, CircleAlert, CircleX, CircleCheck, Icon } from "lucide-react";

export default function AlertModal({ alert, onClose }) {
  const getStatusConfig = (type) => {
    switch (type) {
      case "Danger":
        return {
          label: "Danger",
          className: "status-danger",
          color: "var(--danger-life)",
          bgColor: "var(--bg-danger-life)",
          Icon: Skull,
        };
      case "Critical":
        return {
          label: "Critiques",
          className: "status-critical",
          color: "var(--critical)",
          bgColor: "var(--bg-critical)",
          Icon: TriangleAlert,
        };
      case "Warning":
        return {
          label: "Attention",
          className: "status-warning",
          color: "var(--warning)",
          bgColor: "var(--bg-warning)",
          Icon: CircleAlert,
        };
      default:
        return {
          label: "Attention",
          className: "status-warning",
          color: "var(--warning)",
          bgColor: "var(--bg-warning)",
          Icon: CircleAlert,
        };
    }
  };

  const statusConfig = getStatusConfig(alert.type);
  const StatusIcon = statusConfig.Icon;


  return (
    <div className="modal-overlay">
      <div className="modal-content" tabIndex={-1} role="dialog" aria-modal="true">
        <h2 className="modal-title">{alert.title}</h2>

        <div className="modal-body">
          <div className="modal-left">
            <span className={`modal-metric text-${alert.type.toLowerCase()}`}>
              {alert.metric}
            </span>
          </div>

          <div className="modal-right">
            <p><strong>Salle :</strong> {alert.room}</p>
            <p><strong>Date :</strong> {alert.date}</p>
            <p><strong>Heure :</strong> {alert.time}</p>
            <p><strong>Capteurs :</strong> {alert.sensors.join(", ")}</p>
            <p><strong>Recommandation :</strong> {alert.recommendation}</p>
          </div>
        </div>

        <div 
          className="modal-status-banner"
          style={{ 
            backgroundColor: statusConfig.bgColor,
            color: statusConfig.color,
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem"
          }}
        >
          <StatusIcon size={16} />
          <span style={{ fontWeight: "600" }}>{statusConfig.label}</span>
        </div>

        <div className="modal-actions centered">
          <button 
            onClick={onClose} 
            className="modal-close-btn" 
            tabIndex={0} 
            aria-label="Fermer"
            style={{
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              fontFamily: "var(--font-current)"
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
