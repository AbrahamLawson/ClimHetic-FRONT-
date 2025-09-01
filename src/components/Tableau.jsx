import "../styles/tableau.css";

export default function Tableau({ columns, data }) {
  return (
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
          <tr key={rowIndex}>
            {columns.map((col) => {
              if (col.type === "status") {
                return (
                  <td key={col.key} className="status-cell">
                    <span className={`bg-${row[col.key].toLowerCase()}`}>
                      {row[col.key]}
                    </span>
                  </td>
                );
              }
              return <td key={col.key}>{row[col.key]}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
