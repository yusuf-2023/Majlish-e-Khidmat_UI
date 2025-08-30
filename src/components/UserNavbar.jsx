import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as jwtDecode from "jwt-decode";
import clsx from "clsx";
import ReactDOM from "react-dom";
import { AuthContext } from "../context/AuthContext";

import {
  FaBars, FaTimes, FaSun, FaMoon, FaUserCircle, FaDonate,
  FaSignOutAlt, FaTachometerAlt, FaUser, FaHandsHelping,
  FaUsers, FaCalendarAlt, FaChevronRight, FaChevronDown,
  FaPlusCircle, FaComment, FaList, FaBullhorn
} from "react-icons/fa";

import "../styles/navbar.css";

const getInitials = (name) => {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
};

const normalizePic = (pic, baseUrl) => {
  if (!pic) return "/default-avatar.png";
  if (pic.startsWith("http")) return pic;
  return `${baseUrl}/${pic}`;
};

const UserNavbar = () => {
  const navigate = useNavigate();
  const { name: contextName, profilePic, logoutUser } = useContext(AuthContext);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    account: false,
    volunteering: false,
    campaigns: false,
    events: false,
  });

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedName = localStorage.getItem("userName");
    const storedPic = localStorage.getItem("userProfilePic");

    if (token) {
      try {
        const decoded = jwtDecode.default(token);
        setUserName(contextName || storedName || decoded?.name || "User");
        setUserImage(
          normalizePic(contextName ? profilePic : storedPic || decoded?.profileImage, baseUrl)
        );
      } catch {
        setUserName(contextName || storedName || "User");
        setUserImage(normalizePic(profilePic || storedPic, baseUrl));
      }
    } else {
      setUserName(contextName || storedName || null);
      setUserImage(normalizePic(profilePic || storedPic, baseUrl));
    }
  }, [contextName, profilePic]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest(".profile-avatar")) {
        setIsDropdownOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest(".sidebar-toggle")) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUserName(null);
    setUserImage(null);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    navigate("/auth/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const renderSidebar = () => (
    <>
      <div className={clsx("sidebar", { open: isSidebarOpen, dark: darkMode })} ref={sidebarRef}>
        <div className="sidebar-header">
          <h3>User Dashboard</h3>
          <button className="sidebar-close" onClick={closeSidebar}><FaTimes /></button>
        </div>

        <div className="sidebar-content">
          {/* Dashboard */}
          <div className="sidebar-section">
            <Link to="/user/dashboard" onClick={closeSidebar} className="sidebar-item main-item">
              <FaTachometerAlt className="sidebar-icon" />
              <span className="sidebar-text">Dashboard</span>
            </Link>
          </div>

          {/* Account */}
          <div className="sidebar-section">
            <div className="sidebar-header-item" onClick={() => toggleSection("account")}>
              <FaUser className="sidebar-icon" />
              <span className="sidebar-text">Account</span>
              <span className="sidebar-arrow">{expandedSections.account ? <FaChevronDown /> : <FaChevronRight />}</span>
            </div>
            <div className={clsx("sidebar-submenu", { open: expandedSections.account })}>
              <Link to="/user/profile" onClick={closeSidebar} className="sidebar-item">
                <FaUserCircle className="sidebar-icon" />
                <span className="sidebar-text">My Profile</span>
              </Link>
              <Link to="/user/donation" onClick={closeSidebar} className="sidebar-item">
                <FaDonate className="sidebar-icon" />
                <span className="sidebar-text">Donation History</span>
              </Link>
            </div>
          </div>

          {/* Campaigns */}
          <div className="sidebar-section">
            <div className="sidebar-header-item" onClick={() => toggleSection("campaigns")}>
              <FaBullhorn className="sidebar-icon" />
              <span className="sidebar-text">Campaigns</span>
              <span className="sidebar-arrow">{expandedSections.campaigns ? <FaChevronDown /> : <FaChevronRight />}</span>
            </div>
            <div className={clsx("sidebar-submenu", { open: expandedSections.campaigns })}>
              <Link to="/user/campaign/list" onClick={closeSidebar} className="sidebar-item">
                <FaList className="sidebar-icon" />
                <span className="sidebar-text">All Campaigns</span>
              </Link>
            </div>
          </div>

          {/* Volunteering */}
          <div className="sidebar-section">
            <div className="sidebar-header-item" onClick={() => toggleSection("volunteering")}>
              <FaHandsHelping className="sidebar-icon" />
              <span className="sidebar-text">Volunteering</span>
              <span className="sidebar-arrow">{expandedSections.volunteering ? <FaChevronDown /> : <FaChevronRight />}</span>
            </div>
            <div className={clsx("sidebar-submenu", { open: expandedSections.volunteering })}>
              <Link to="/user/volunteers/add" onClick={closeSidebar} className="sidebar-item">
                <FaPlusCircle className="sidebar-icon" />
                <span className="sidebar-text">Register as Volunteer</span>
              </Link>
              <Link to="/user/volunteers/list" onClick={closeSidebar} className="sidebar-item">
                <FaUsers className="sidebar-icon" />
                <span className="sidebar-text">Volunteers List</span>
              </Link>
            </div>
          </div>

          {/* Events */}
          <div className="sidebar-section">
            <div className="sidebar-header-item" onClick={() => toggleSection("events")}>
              <FaCalendarAlt className="sidebar-icon" />
              <span className="sidebar-text">Events</span>
              <span className="sidebar-arrow">{expandedSections.events ? <FaChevronDown /> : <FaChevronRight />}</span>
            </div>
            <div className={clsx("sidebar-submenu", { open: expandedSections.events })}>
              <Link to="/user/events/list" onClick={closeSidebar} className="sidebar-item">
                <FaList className="sidebar-icon" />
                <span className="sidebar-text">Events List</span>
              </Link>
            </div>
          </div>

          {/* Feedback */}
          <div className="sidebar-section">
            <Link to="/user/feedback" onClick={closeSidebar} className="sidebar-item main-item">
              <FaComment className="sidebar-icon" />
              <span className="sidebar-text">Feedback</span>
            </Link>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            {userImage ? (
              <img src={userImage} alt="User" className="sidebar-user-avatar" />
            ) : (
              <div className="sidebar-avatar-placeholder">{getInitials(userName)}</div>
            )}
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{userName || "User"}</span>
              <span className="sidebar-user-role">Member</span>
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
            <div className="sidebar-toggle" onClick={toggleSidebar}><FaBars /></div>
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
                <li><Link to="/">Home</Link></li>
                <li><Link to="/user/campaign/list">Campaigns</Link></li>
                <li><Link to="/user/volunteers/list">Volunteers</Link></li>
              </>
            ) : (
              <li><Link to="/auth/login">Login</Link></li>
            )}
          </ul>

          <div className={clsx("toggle-switch", { dark: darkMode })} onClick={toggleDarkMode} title="Toggle Dark Mode">
            <div className="toggle-knob">{darkMode ? <FaMoon /> : <FaSun />}</div>
          </div>

          {isLoggedIn && (
            <div className="navbar-profile" ref={dropdownRef}>
              <div className="profile-avatar" onClick={toggleDropdown}>
                {userImage ? (
                  <img src={userImage} alt="User" className="navbar-profile-img" />
                ) : (
                  <div className="avatar-placeholder">{getInitials(userName)}</div>
                )}
              </div>
              <div className={clsx("profile-dropdown", { open: isDropdownOpen })}>
                <div className="profile-info">
                  {userImage ? (
                    <img src={userImage} alt="User" className="navbar-profile-img" />
                  ) : (
                    <div className="avatar-placeholder">{getInitials(userName)}</div>
                  )}
                  <span>{userName}</span>
                </div>
                <Link to="/user/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <FaUserCircle /> Edit Profile
                </Link>
                <Link to="/user/donation" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <FaDonate /> Donate
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
};

export default UserNavbar;
