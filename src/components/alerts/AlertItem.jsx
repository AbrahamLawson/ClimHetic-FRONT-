import React from "react";
import Status from "../Status";

export default function AlertItem({ alert, onClick }) {
  const typeClass = alert.type.toLowerCase(); 
  const readClass = alert.read ? "read" : "unread";

  return (
    <div
      role="alert"
      className={`alert-item alert-${typeClass} ${readClass}`}
      onClick={() => onClick(alert)}
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <div className="alert-left">
        <span className="alert-room">{alert.room}</span>
        <span className={`alert-metric text-${typeClass}`}>{alert.metric}</span>
        <span className="alert-title">
          <Status value={alert.type} />
        </span>
      </div>
      <div className="alert-right">
        <span className="alert-date">{alert.date}</span>
        <span className="alert-time">{alert.time}</span>
      </div>
    </div>
  );
}

