import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { norms } from "../utils/norms";
import "../styles/gauge.css";

export default function Gauge({ metric, value }) {
  if (!norms[metric]) return null; 

  const { min, max, stops, colors, unit } = norms[metric];

  return (
    <div className="gauge-wrapper">
      <ReactSpeedometer
        value={value}
        minValue={min}
        maxValue={max}
        segments={stops.length - 1}
        customSegmentStops={stops}
        segmentColors={colors}
        needleColor="#345243"
        currentValueText={`${value}${unit}`}
        textColor="Var(--gauge--text)"
        height={200}
        width={300}
      />
    </div>
  );
}
