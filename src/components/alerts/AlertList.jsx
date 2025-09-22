import React, { useState, useEffect } from "react";
import AlertItem from "./AlertItem";
import AlertModal from "./AlertModal";
import "../../styles/alert.css";

export default function AlertList({ alerts, onAlertClick, selectedAlert }) {
  const [modalAlert, setModalAlert] = useState(null);

  useEffect(() => {
    if (selectedAlert) {
      setModalAlert(selectedAlert);
    }
  }, [selectedAlert]);

  const alertList = alerts || [];

  const handleClick = (alert) => {
    if (onAlertClick) {
      onAlertClick(alert);
    } else {
      setModalAlert(alert);
    }
  };

  return (
    <div className="alert-list" role="list">
      {alertList.map((alert, idx) => (
        <AlertItem key={idx} alert={alert} onClick={() => handleClick(alert)} />
      ))}

      {!onAlertClick && modalAlert && (
        <AlertModal alert={modalAlert} onClose={() => setModalAlert(null)} />
      )}
    </div>
  );
}
