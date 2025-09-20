import React from "react";
import "../../styles/alert.css";
import Status from "../Status";

export default function AlertModal({ alert, onClose }) {
  const typeClass = alert.type.toLowerCase();

  return (
    <div className="modal-overlay">
      <div className="modal-content" tabIndex={-1} role="dialog" aria-modal="true">
        <h2 className="modal-title centered">{alert.title}</h2>

        <div className="modal-body">
          <div className="modal-left">
            <span className={`alert-metric text-${typeClass} modal-metric`}>
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
        <Status value={alert.type} />
        <div className="modal-actions centered">
          <button onClick={onClose} className="modal-close" tabIndex={0} aria-label="Fermer">Fermer</button>
        </div>
      </div>
    </div>
  );
}
