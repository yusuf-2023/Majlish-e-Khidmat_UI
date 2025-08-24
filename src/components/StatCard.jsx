// src/components/StatCard.jsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/StatCard.css";

function StatCard({ label, value = 0, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Observe when card comes into view
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Count animation
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = Math.max(Math.round(duration / stepTime), 1);
    const increment = value / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(Math.floor(value));
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-number">
        {count}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default StatCard;
