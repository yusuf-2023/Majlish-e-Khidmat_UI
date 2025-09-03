import React, { useState, useEffect } from "react";
import "../../styles/Loader.css";

const Loader = ({ text = "Loading..." }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < 100) {
          return prevCount + 1;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 25); // Speed of counting

    return () => clearInterval(interval);
  }, []);

  const dots = Array.from({ length: 15 }, (_, i) => ( // Reduced dots for smaller circle
    <div key={i} className="dot" style={{ animationDelay: `${i * 0.05}s` }}></div>
  ));

  return (
    <div className="extraordinary-loader-container">
      <div className="dot-circle-wrapper"> {/* New wrapper for circle and text */}
        <div className="dot-circle-container">
          {dots}
        </div>
        <div className="counter-text">
          <p>{count}%</p>
        </div>
      </div>
      <span className="outside-loading-text">{text}</span> {/* Loading text outside the circle */}
    </div>
  );
};

export default Loader;