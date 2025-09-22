import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, Legend } from "recharts";

export default function Graphique({ data, metrics, alertZone }) {
const colors = [
    "var(--quaternary)",   
    "var(--terciary)",     
    "var(--primary-dark)", 
    "var(--danger)"        
  ];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            background: "var(--bg--cards)", 
            border: "1px solid var(--line-color)",
            borderRadius: "6px",
            padding: "0.5rem 0.75rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            color: "var(--primary-dark)",
            fontFamily: "var(--font-current)",
            fontSize: "0.85rem"
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: "0.2rem 0" }}>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                  marginRight: 6
                }}
              ></span>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" interval={0} angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {alertZone && (
          <ReferenceArea
            y1={alertZone.min}
            y2={alertZone.max}
            fill="blue"
            fillOpacity={0.1}
          />
        )}

        {metrics.map((metric, index) => (
          <Line
            key={metric}
            type="monotone"
            dataKey={metric}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            name={metric}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
