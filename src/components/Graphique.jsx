import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, Legend } from "recharts";

export default function Graphique({ data, metrics, alertZone }) {
  const colors = ['#007EA7', '#1F3A93', '#4E148C','#FF6B6B'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" interval={0} angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend />

        {alertZone && (
          <ReferenceArea y1={alertZone.min} y2={alertZone.max} fill="blue" fillOpacity={0.1} />
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
