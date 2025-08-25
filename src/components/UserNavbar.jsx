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

  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "User Name");
        setUserImage(decoded.profileImage || null);
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      setUserName(null);
      setUserImage(null);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    setUserImage(null);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    navigate("/auth/login");
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
              </>
            ) : (
              <>
                <li>
                  <Link to="/auth/login">Login</Link>
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
                  to="/user/donation"
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
              <Link
                to="/user/activities"
                onClick={() => setIsSidebarOpen(false)}
              >
                📋 Activities
              </Link>
            </li>
            <li>
              <Link to="/user/donation" onClick={() => setIsSidebarOpen(false)}>
                💰 Donate
              </Link>
            </li>

            <li>
              <Link
                to="/admin/volunteers/add"
                onClick={() => setIsSidebarOpen(false)}
              >
                ✍️ Volunteer Register
              </Link>
            </li>

            <li>
              <Link
                to="/admin/volunteers/list"
                onClick={() => setIsSidebarOpen(false)}
              >
                🤝 Volunteer List
              </Link>
            </li>

            <li>
              <Link
                to="/user/campaign/list"
                onClick={() => setIsSidebarOpen(false)}
              >
                🎯 Campaigns
              </Link>
            </li>

            <li>
              <Link to="/user/feedback" onClick={() => setIsSidebarOpen(false)}>
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
