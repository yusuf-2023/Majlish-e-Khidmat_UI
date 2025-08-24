import React, { useEffect } from "react";
import "../styles/Notification.css";
import { FaCheckCircle } from "react-icons/fa";

function Notification({ message, onClose, duration = 2000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="app-notification">
      <FaCheckCircle className="tick-icon" />
      <span>{message}</span>
      <div className="progress-bar"></div>
    </div>
  );
}

export default Notification;
