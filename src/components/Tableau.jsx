import "../styles/tableau.css";
import Status from "./Status";

export default function Tableau({ columns, data, onRowClick }) {
  return (
    <div className="tableau-wrapper">
      <table className="tableau">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className || ''}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              tabIndex={0}
              className={onRowClick ? "clickable-row" : ""}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => {
                const cellClassName = col.className || '';
                if (col.type === "status") {
                  return (
                    <td key={col.key} className={`status-cell ${cellClassName}`}>
                      <Status value={row[col.key]} />
                    </td>
                  );
                }
                if (typeof col.render === "function") {
                  return <td key={col.key} className={cellClassName}>{col.render(row[col.key], row)}</td>;
                }
                return <td key={col.key} className={cellClassName}>{row[col.key]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
