import React from "react";

export default function AlertItem({ alert, onClick }) {
  const typeClass = alert.type.toLowerCase(); 
  const readClass = alert.read ? "read" : "unread";

  return (
    <div
      className={`alert-item alert-${typeClass} ${readClass}`}
      onClick={() => onClick(alert)}
      style={{ cursor: "pointer" }}
    >
      <div className="alert-left">
        <span className="alert-room">{alert.room}</span>
        <span className={`alert-metric text-${typeClass}`}>{alert.metric}</span>
        <span className={`alert-title bg-${typeClass}`}>{alert.title}</span>
      </div>
      <div className="alert-right">
        <span className="alert-date">{alert.date}</span>
        <span className="alert-time">{alert.time}</span>
      </div>
    </div>
  );
}

