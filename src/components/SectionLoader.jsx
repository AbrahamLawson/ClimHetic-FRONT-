import React from "react";
import "../styles/sectionloader.css"; 
export default function SectionLoader({ text = "Chargement…", size = 40 }) {
  return (
    <div className="section-loader" role="status" aria-live="polite">
      <svg
        className="spinner-svg"
        viewBox="0 0 50 50"
        width={size}
        height={size}
        aria-hidden="true"
      >
        <circle
          className="spinner-track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
        />
        <circle
          className="spinner-path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <div className="loading-text">{text}</div>
    </div>
  );
}
