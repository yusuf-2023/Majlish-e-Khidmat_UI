import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <Link to="/" className="sidebar-link">
                <span className="sidebar-icon">📊</span>
                <span className="sidebar-text">Dashboard</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/donation" className="sidebar-link">
                <span className="sidebar-icon">💰</span>
                <span className="sidebar-text">Donations</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/volunteer" className="sidebar-link">
                <span className="sidebar-icon">🤝</span>
                <span className="sidebar-text">Volunteers</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/campaign" className="sidebar-link">
                <span className="sidebar-icon">📢</span>
                <span className="sidebar-text">Campaigns</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/inventory" className="sidebar-link">
                <span className="sidebar-icon">📦</span>
                <span className="sidebar-text">Inventory</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/feedback" className="sidebar-link">
                <span className="sidebar-icon">💬</span>
                <span className="sidebar-text">Feedback</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
