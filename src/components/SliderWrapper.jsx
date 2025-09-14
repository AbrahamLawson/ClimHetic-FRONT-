import React, { useState } from "react";
import "../styles/slider.css";

export default function SliderWrapper({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = React.Children.count(children);

  const prev = () => setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  const next = () => setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));

  return (
    <div className="slider-container">
      <button className="slider-arrow left" onClick={prev}>
        &#8249;
      </button>
      <div className="slider-wrapper">
        {React.Children.map(children, (child, index) => (
          <div className={`slider-item ${index === currentIndex ? "active" : ""}`}>
            {child}
          </div>
        ))}
      </div>
      <button className="slider-arrow right" onClick={next}>
        &#8250;
      </button>
    </div>
  );
}
