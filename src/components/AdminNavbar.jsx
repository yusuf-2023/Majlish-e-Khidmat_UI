/* eslint-disable react-refresh/only-export-components */
import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import ReactDOM from "react-dom";
import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaUserCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsersCog,
  FaUserEdit,
  FaChartLine,
  FaUniversity,
  FaHandsHelping,
  FaUserPlus,
  FaList,
  FaBullhorn,
  FaPlusCircle,
  FaCalendarAlt,
  FaBoxes,
  FaComments,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

const getInitials = (name) => {
  if (!name) return "A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

function AdminNavbar() {
  const navigate = useNavigate();
  const { role, logoutUser, name, profilePic } = useContext(AuthContext); // updated names

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    management: false,
    volunteer: false,
    campaign: false,
    event: false,
    inventory: false,
  });

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const isLoggedIn = role === "ADMIN";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".profile-avatar")
      ) {
        setIsDropdownOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderSidebar = () => (
    <>
      <div
        className={clsx("sidebar", { open: isSidebarOpen, dark: darkMode })}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <button className="sidebar-close" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Dashboard */}
          <div className="sidebar-section">
            <Link
              to="/admin/dashboard"
              onClick={closeSidebar}
              className="sidebar-item main-item"
            >
              <FaTachometerAlt className="sidebar-icon" />
              <span className="sidebar-text">Admin Dashboard</span>
            </Link>
          </div>

          {/* Management Section */}
          <div className="sidebar-section">
            <div
              className="sidebar-header-item"
              onClick={() => toggleSection("management")}
            >
              <FaUsersCog className="sidebar-icon" />
              <span className="sidebar-text">User Management</span>
              <span className="sidebar-arrow">
                {expandedSections.management ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </span>
            </div>
            <div
              className={clsx("sidebar-submenu", {
                open: expandedSections.management,
              })}
            >
              <Link
                to="/admin/manage-users"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaUserEdit className="sidebar-icon" />
                <span className="sidebar-text">Manage Users</span>
              </Link>
              <Link
                to="/admin/donation-dashboard"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaChartLine className="sidebar-icon" />
                <span className="sidebar-text">Donation Dashboard</span>
              </Link>
              <Link
                to="/admin/banks"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaUniversity className="sidebar-icon" />
                <span className="sidebar-text">Manage Banks</span>
              </Link>
            </div>
          </div>

          {/* Volunteer Section */}
          <div className="sidebar-section">
            <div
              className="sidebar-header-item"
              onClick={() => toggleSection("volunteer")}
            >
              <FaHandsHelping className="sidebar-icon" />
              <span className="sidebar-text">Volunteers</span>
              <span className="sidebar-arrow">
                {expandedSections.volunteer ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </span>
            </div>
            <div
              className={clsx("sidebar-submenu", {
                open: expandedSections.volunteer,
              })}
            >
              <Link
                to="/admin/volunteers/add"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaUserPlus className="sidebar-icon" />
                <span className="sidebar-text">Add Volunteer</span>
              </Link>
              <Link
                to="/admin/volunteers/list"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaList className="sidebar-icon" />
                <span className="sidebar-text">Volunteer List</span>
              </Link>
            </div>
          </div>

          {/* Campaign Section */}
          <div className="sidebar-section">
            <div
              className="sidebar-header-item"
              onClick={() => toggleSection("campaign")}
            >
              <FaBullhorn className="sidebar-icon" />
              <span className="sidebar-text">Campaigns</span>
              <span className="sidebar-arrow">
                {expandedSections.campaign ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </span>
            </div>
            <div
              className={clsx("sidebar-submenu", {
                open: expandedSections.campaign,
              })}
            >
              <Link
                to="/admin/campaign/form"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaPlusCircle className="sidebar-icon" />
                <span className="sidebar-text">Create Campaign</span>
              </Link>
              <Link
                to="/admin/campaign/list"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaList className="sidebar-icon" />
                <span className="sidebar-text">Campaign List</span>
              </Link>
            </div>
          </div>

          {/* Event Section */}
          <div className="sidebar-section">
            <div
              className="sidebar-header-item"
              onClick={() => toggleSection("event")}
            >
              <FaCalendarAlt className="sidebar-icon" />
              <span className="sidebar-text">Events</span>
              <span className="sidebar-arrow">
                {expandedSections.event ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </span>
            </div>
            <div
              className={clsx("sidebar-submenu", {
                open: expandedSections.event,
              })}
            >
              <Link
                to="/admin/events/create"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaPlusCircle className="sidebar-icon" />
                <span className="sidebar-text">Create Event</span>
              </Link>
              <Link
                to="/admin/events/list"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaList className="sidebar-icon" />
                <span className="sidebar-text">Event List</span>
              </Link>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="sidebar-section">
            <div
              className="sidebar-header-item"
              onClick={() => toggleSection("inventory")}
            >
              <FaBoxes className="sidebar-icon" />
              <span className="sidebar-text">Inventory</span>
              <span className="sidebar-arrow">
                {expandedSections.inventory ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </span>
            </div>
            <div
              className={clsx("sidebar-submenu", {
                open: expandedSections.inventory,
              })}
            >
              <Link
                to="/admin/inventory/add"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaPlusCircle className="sidebar-icon" />
                <span className="sidebar-text">Add Inventory</span>
              </Link>
              <Link
                to="/admin/inventory/list"
                onClick={closeSidebar}
                className="sidebar-item"
              >
                <FaList className="sidebar-icon" />
                <span className="sidebar-text">Inventory List</span>
              </Link>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="sidebar-section">
            <Link
              to="/admin/feedback/list"
              onClick={closeSidebar}
              className="sidebar-item main-item"
            >
              <FaComments className="sidebar-icon" />
              <span className="sidebar-text">Feedback</span>
            </Link>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Admin"
                className="sidebar-user-avatar"
              />
            ) : (
              <div className="sidebar-avatar-placeholder">
                {getInitials(name)}
              </div>
            )}
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{name || "Admin"}</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );

  return (
    <>
      <nav className={clsx("navbar", { dark: darkMode })}>
        <div className="navbar-left">
          {isLoggedIn && (
            <div className="sidebar-toggle" onClick={toggleSidebar}>
              <FaBars />
            </div>
          )}
          <div className="navbar-logo">
            <Link to="/" className="logo-link">
              <img src="/WhiteLion1.png" alt="Logo" className="logo-img" />
              <span className="logo-text">Majlish-e-Khidmat</span>
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <ul className="navbar-links">
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/admin/campaign/list">Campaigns</Link>
                </li>
                <li>
                  <Link to="/admin/events/list">Events</Link>
                </li>
                <li>
                  <Link to="/admin/inventory/list">Inventory</Link>
                </li>
                <li>
                  <Link to="/admin/feedback/list">Feedback</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/auth/login">Login</Link>
                </li>
              </>
            )}
          </ul>

          <div
            className={clsx("toggle-switch", { dark: darkMode })}
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
          >
            <div className="toggle-knob">{darkMode ? <FaMoon /> : <FaSun />}</div>
          </div>

          {isLoggedIn && (
            <div className="navbar-profile" ref={dropdownRef}>
              <div className="profile-avatar" onClick={toggleDropdown}>
                {profilePic ? (
                  <img src={profilePic} alt="Admin" />
                ) : (
                  <div className="avatar-placeholder">{getInitials(name)}</div>
                )}
              </div>
              <div className={clsx("profile-dropdown", { open: isDropdownOpen })}>
                <div className="profile-info">
                  {profilePic ? (
                    <img src={profilePic} alt="Admin" />
                  ) : (
                    <div className="avatar-placeholder">{getInitials(name)}</div>
                  )}
                  <span>{name || "Admin"}</span>
                </div>
                <Link
                  to="/admin/profile"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaUserCog /> Admin Profile
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {isLoggedIn && ReactDOM.createPortal(renderSidebar(), document.body)}
    </>
  );
}

export default AdminNavbar;
