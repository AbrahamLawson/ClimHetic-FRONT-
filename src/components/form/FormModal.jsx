import { useState } from "react";
import Form from "./Form";
import "../../styles/form.css";

import { UserPlus, HouseWifi, CircleGauge } from "lucide-react";

export default function FormModal({ title, fields, onSubmit, ctaLabel, icon }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data) => {
    onSubmit?.(data);
    setOpen(false);
  };

  let IconComponent = null;
  let bgColor = "";
  let iconColor = "";

  switch (icon) {
    case "user-plus":
      IconComponent = UserPlus;
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
    default:
      IconComponent = null;
  }

  return (
    <div>
      <button onClick={() => setOpen(true)} className="form-button">
        {ctaLabel}
      </button>

      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header-wrapper">
              {IconComponent && (
                <span
                  className="modal-icon"
                  style={{ backgroundColor: bgColor, color: iconColor }}
                >
                  <IconComponent size={20} />
                </span>
              )}
              <h2 className="modal-header">{title}</h2>
            </div>

            <Form fields={fields} onSubmit={handleSubmit} />

            <button onClick={() => setOpen(false)} className="modal-close">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
