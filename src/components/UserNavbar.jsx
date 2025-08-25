import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/navbar.css";

function UserNavbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState(null);

  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "User Name");
        setUserImage(decoded.profileImage || null);
        setRole(decoded.role || "user");
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      setUserName(null);
      setUserImage(null);
      setRole(null);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    setUserImage(null);
    setRole(null);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    navigate("/user/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
                  <Link to="/admin/features">Features</Link>
                </li>
                <li>
                  <Link to="/admin/about">About</Link>
                </li>
                <li>
                  <Link to="/admin/contact">Contact</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/user/register">User Register</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/admin/register">Admin Register</Link>
                </li>
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
        </div>

        {/* Profile Dropdown */}
        {isLoggedIn && (
          <div className="navbar-profile">
            <div className="profile-avatar" onClick={toggleDropdown}>
              {userImage ? (
                <img src={userImage} alt="User" />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials(userName)}
                </div>
              )}
            </div>
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  {userImage ? (
                    <img src={userImage} alt="User" />
                  ) : (
                    <div className="avatar-placeholder">
                      {getInitials(userName)}
                    </div>
                  )}
                  <span>{userName}</span>
                </div>
                <Link
                  to="/user/profile"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Edit Profile
                </Link>
                <Link
                  to="/donation"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Donate
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Sidebar */}
      {isLoggedIn && (
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/activities" onClick={() => setIsSidebarOpen(false)}>
                📋 Activities
              </Link>
            </li>
            <li>
              <Link to="/donation" onClick={() => setIsSidebarOpen(false)}>
                💰 Donate
              </Link>
            </li>

            <li>
              <Link
                to="/volunteer/register"
                onClick={() => setIsSidebarOpen(false)}
              >
                ✍️ Volunteer Register
              </Link>
            </li>

            <li>
              <Link
                to="/volunteer/list"
                onClick={() => setIsSidebarOpen(false)}
              >
                🤝 Volunteer List
              </Link>
            </li>

            <li>
              <Link to="/campaign/list" onClick={() => setIsSidebarOpen(false)}>
                🎯 Campaigns
              </Link>
            </li>
            {role === "admin" && (
              <li>
                <Link
                  to="/campaign/form"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  📝 Create Campaign
                </Link>
              </li>
            )}

            <li>
              <Link to="/feedback" onClick={() => setIsSidebarOpen(false)}>
                💬 Feedback
              </Link>
            </li>
          </ul>
        </div>
      )}
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}

export default UserNavbar;
