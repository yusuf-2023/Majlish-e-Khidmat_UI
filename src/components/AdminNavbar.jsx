// src/components/AdminNavbar.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

function AdminNavbar() {
  const navigate = useNavigate();
  const { role, logoutUser, adminName, adminImage } = useContext(AuthContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    volunteer: true,
    campaign: false,
    event: false,
    inventory: false,
    management: false
  });

  const isLoggedIn = role === "ADMIN";

  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    navigate("/auth/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) setIsSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${darkMode ? "dark" : ""}`}>
        <div className="navbar-left">
          {isLoggedIn && (
            <div className="sidebar-toggle" onClick={toggleSidebar}>
              &#9776;
            </div>
          )}
          <div className="navbar-logo">
            <Link to="/admin/dashboard" className="logo-link">
              <img src="/WhiteLion1.png" alt="Logo" className="logo-img" />
              <span className="logo-text">Majlish-e-Khidmat</span>
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <ul className="navbar-links">
            {isLoggedIn ? (
              <>
                <li><Link to="/admin/dashboard">Home</Link></li>
                <li><Link to="/admin/campaign/list">Campaigns</Link></li>
                <li><Link to="/admin/events/list">Events</Link></li>
                <li><Link to="/admin/inventory/list">Inventory</Link></li>
                <li><Link to="/admin/feedback/list">Feedback</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/auth/register/user">User Register</Link></li>
                <li><Link to="/auth/login">Login</Link></li>
                <li><Link to="/auth/register/admin">Admin Register</Link></li>
              </>
            )}
          </ul>

          {/* Dark Mode Toggle */}
          <div
            className={`toggle-switch ${darkMode ? "dark" : ""}`}
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
          >
            <div className="toggle-knob">{darkMode ? "🌙" : "☀️"}</div>
          </div>

          {/* Profile */}
          {isLoggedIn && (
            <div className="navbar-profile">
              <div className="profile-avatar" onClick={toggleDropdown}>
                {adminImage ? (
                  <img src={adminImage} alt="Admin" />
                ) : (
                  <div className="avatar-placeholder">{getInitials(adminName)}</div>
                )}
              </div>
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    {adminImage ? (
                      <img src={adminImage} alt="Admin" />
                    ) : (
                      <div className="avatar-placeholder">{getInitials(adminName)}</div>
                    )}
                    <span>{adminName || "Admin"}</span>
                  </div>
                  <Link
                    to="/admin/profile"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Admin Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      {isLoggedIn && (
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h3>Admin Panel</h3>
            <button className="sidebar-close" onClick={closeSidebar}>
              &times;
            </button>
          </div>
          
          <div className="sidebar-content">
            {/* Dashboard */}
            <div className="sidebar-section">
              <Link to="/admin/dashboard" onClick={closeSidebar} className="sidebar-item main-item">
                <span className="sidebar-icon">📊</span>
                <span className="sidebar-text">Admin Dashboard</span>
              </Link>
            </div>

            {/* Management Section */}
            <div className="sidebar-section">
              <div className="sidebar-header-item" onClick={() => toggleSection('management')}>
                <span className="sidebar-icon">👥</span>
                <span className="sidebar-text">User Management</span>
                <span className="sidebar-arrow">
                  {expandedSections.management ? '▼' : '▶'}
                </span>
              </div>
              {expandedSections.management && (
                <div className="sidebar-submenu">
                  <Link to="/admin/manage-users" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">🔧</span>
                    <span className="sidebar-text">Manage Users</span>
                  </Link>
                  <Link to="/admin/donation-dashboard" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">💰</span>
                    <span className="sidebar-text">Donation Dashboard</span>
                  </Link>
                  <Link to="/admin/banks" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">🏦</span>
                    <span className="sidebar-text">Manage Banks</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Volunteer Section */}
            <div className="sidebar-section">
              <div className="sidebar-header-item" onClick={() => toggleSection('volunteer')}>
                <span className="sidebar-icon">🤝</span>
                <span className="sidebar-text">Volunteers</span>
                <span className="sidebar-arrow">
                  {expandedSections.volunteer ? '▼' : '▶'}
                </span>
              </div>
              {expandedSections.volunteer && (
                <div className="sidebar-submenu">
                  <Link to="/admin/volunteers/add" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">➕</span>
                    <span className="sidebar-text">Add Volunteer</span>
                  </Link>
                  <Link to="/admin/volunteers/list" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">📋</span>
                    <span className="sidebar-text">Volunteer List</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Campaign Section */}
            <div className="sidebar-section">
              <div className="sidebar-header-item" onClick={() => toggleSection('campaign')}>
                <span className="sidebar-icon">📢</span>
                <span className="sidebar-text">Campaigns</span>
                <span className="sidebar-arrow">
                  {expandedSections.campaign ? '▼' : '▶'}
                </span>
              </div>
              {expandedSections.campaign && (
                <div className="sidebar-submenu">
                  <Link to="/admin/campaign/form" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">➕</span>
                    <span className="sidebar-text">Create Campaign</span>
                  </Link>
                  <Link to="/admin/campaign/list" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">📋</span>
                    <span className="sidebar-text">Campaign List</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Event Section */}
            <div className="sidebar-section">
              <div className="sidebar-header-item" onClick={() => toggleSection('event')}>
                <span className="sidebar-icon">🎉</span>
                <span className="sidebar-text">Events</span>
                <span className="sidebar-arrow">
                  {expandedSections.event ? '▼' : '▶'}
                </span>
              </div>
              {expandedSections.event && (
                <div className="sidebar-submenu">
                  <Link to="/admin/events/create" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">➕</span>
                    <span className="sidebar-text">Create Event</span>
                  </Link>
                  <Link to="/admin/events/list" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">📋</span>
                    <span className="sidebar-text">Event List</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Inventory Section */}
            <div className="sidebar-section">
              <div className="sidebar-header-item" onClick={() => toggleSection('inventory')}>
                <span className="sidebar-icon">📦</span>
                <span className="sidebar-text">Inventory</span>
                <span className="sidebar-arrow">
                  {expandedSections.inventory ? '▼' : '▶'}
                </span>
              </div>
              {expandedSections.inventory && (
                <div className="sidebar-submenu">
                  <Link to="/admin/inventory/add" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">➕</span>
                    <span className="sidebar-text">Add Inventory</span>
                  </Link>
                  <Link to="/admin/inventory/list" onClick={closeSidebar} className="sidebar-item">
                    <span className="sidebar-icon">📋</span>
                    <span className="sidebar-text">Inventory List</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Feedback Section */}
            <div className="sidebar-section">
              <Link to="/admin/feedback/list" onClick={closeSidebar} className="sidebar-item main-item">
                <span className="sidebar-icon">💬</span>
                <span className="sidebar-text">Feedback</span>
              </Link>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="user-info">
              {adminImage ? (
                <img src={adminImage} alt="Admin" className="sidebar-user-avatar" />
              ) : (
                <div className="sidebar-avatar-placeholder">
                  {getInitials(adminName)}
                </div>
              )}
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">{adminName || "Admin"}</span>
                <span className="sidebar-user-role">Administrator</span>
              </div>
            </div>
            <button onClick={handleLogout} className="sidebar-logout-btn">
              Logout
            </button>
          </div>
        </div>
      )}

      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
}

export default AdminNavbar;