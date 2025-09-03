import React, { useEffect } from "react";
import "../styles/Notification.css";
import { FaCheckCircle, FaUndo, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

function Notification({ message, type, isUndoable, onUndo, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!isUndoable) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration, isUndoable]);

  const getIcon = () => {
    switch(type) {
      case 'error': return <FaTimesCircle className="error-icon" />;
      case 'warning': return <FaInfoCircle className="warning-icon" />;
      case 'info': return <FaInfoCircle className="info-icon" />;
      default: return <FaCheckCircle className="tick-icon" />;
    }
  };

  const notificationClass = `app-notification ${isUndoable ? "undoable" : type}`;

  return (
    <div className={notificationClass}>
      <div className="notification-content">
        {getIcon()}
        <span>{message}</span>
      </div>
      {isUndoable && (
        <button className="undo-btn" onClick={onUndo}>
          <FaUndo /> Undo
        </button>
      )}
      {!isUndoable && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ animationDuration: `${duration}ms` }}></div>
        </div>
      )}
    </div>
  );
}

export default Notification;