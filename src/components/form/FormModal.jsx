import { useState } from "react";
import "../../styles/form.css";
import { UserPlus, HouseWifi, CircleGauge, X } from "lucide-react";

export default function FormModal({ title, fields, onSubmit, ctaLabel, icon, submitLabel = "Valider" }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [capteurs, setCapteurs] = useState([]);

  const handleOpen = () => {
    const defaultValues = {};
    fields.forEach(field => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        const defaultValue = typeof field.options[0] === 'object' ? field.options[0].value : field.options[0];
        defaultValues[field.name] = defaultValue;
      }
    });
    setFormData(defaultValues);
    setOpen(true);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCapteur = () => {
    setCapteurs([...capteurs, ""]);
  };

  const handleCapteurChange = (index, value) => {
    const newCapteurs = [...capteurs];
    newCapteurs[index] = value;
    setCapteurs(newCapteurs);
  };

  const handleRemoveCapteur = (index) => {
    const newCapteurs = [...capteurs];
    newCapteurs.splice(index, 1);
    setCapteurs(newCapteurs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = capteurs.length > 0 ? { ...formData, capteurs } : formData;
    onSubmit?.(data);
    setOpen(false);
    setFormData({});
    setCapteurs([]);
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
      <button onClick={handleOpen} className="btn" tabIndex={0}>
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

            <form onSubmit={handleSubmit} className="form-wrapper" role="form" aria-labelledby="modal-title">
              {fields.map((field) => {
                if (field.type === "array") {
                  return (
                    <div key={field.name} className="form-group">
                      <label className="form-label">{field.label}</label>
                      {capteurs.map((capteur, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <input
                            type="text"
                            className="form-input"
                            tabIndex={0}
                            placeholder={field.placeholder}
                            value={capteur}
                            onChange={(e) =>
                              handleCapteurChange(index, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="modal-close"
                            style={{ padding: "0.3rem 0.6rem", margin: 0 }}
                            onClick={() => handleRemoveCapteur(index)}
                            aria-label="Supprimer ce capteur"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        tabIndex={0}
                        type="button"
                        onClick={handleAddCapteur}
                        className="btn-secondary"
                        style={{ marginBottom: 0, marginTop: "0.5rem" }}
                      >
                        + Ajouter un capteur
                      </button>
                    </div>
                  );
                }

                if (field.type === "select") {
                  return (
                    <div key={field.name} className="form-group">
                      <label htmlFor={field.name} className="form-label">{field.label}</label>
                      <select
                        className="form-input"
                        value={formData[field.name] || (typeof field.options[0] === 'object' ? field.options[0].value : field.options[0])}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      >
                        {field.options.map((option) => {
                          const optionValue = typeof option === 'object' ? option.value : option;
                          const optionLabel = typeof option === 'object' ? option.label : 
                            option.charAt(0).toUpperCase() + option.slice(1);
                          
                          return (
                            <option key={optionValue} value={optionValue}>
                              {optionLabel}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={field.name} className="form-group">
                    <label htmlFor={field.name} className="form-label">{field.label}</label>
                    <input
                      type={field.type}
                      className="form-input"
                      tabIndex={0}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                    />
                  </div>
                );
              })}

              <button type="submit" className="form-button" style={{ marginBottom: 0, marginTop: "0.5rem" }} tabIndex={0}>
                {submitLabel}
              </button>
            </form>

            <button
              aria-label="Fermer le formulaire"
              tabIndex={0}
              onClick={() => setOpen(false)}
              className="btn-secondary"
              type="button"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}