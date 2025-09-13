import "../styles/tableau.css";
import Status from "./Status";

export default function Tableau({ columns, data, onRowClick }) {
  return (
    <div className="tableau-wrapper">
      <table className="tableau">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={onRowClick ? "clickable-row" : ""}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => {
                if (col.type === "status") {
                  return (
                    <td key={col.key} className="status-cell">
                      <Status value={row[col.key]} />
                    </td>
                  );
                }
                if (col.key === "actions" && typeof col.render === "function") {
                  return <td key={col.key}>{col.render(row)}</td>;
                }
                return <td key={col.key}>{row[col.key]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
