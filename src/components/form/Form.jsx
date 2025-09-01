import "../../styles/form.css";

export default function Form({ fields, onSubmit, submitLabel = "Valider" }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit?.(data);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {fields.map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name} className="form-label">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              className="form-select"
              defaultValue=""
            >
              <option value="" disabled>
                -- Choisir --
              </option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              className="form-input"
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
        </div>
      ))}

      <button type="submit" className="form-button">
        {submitLabel}
      </button>
    </form>
  );
}
