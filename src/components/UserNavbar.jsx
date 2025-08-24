// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/navbar.css";

// function UserNavbar({ darkMode, toggleDarkMode }) {
//   const navigate = useNavigate();
//   const [userEmail, setUserEmail] = useState("");

//   // JWT token se email nikalne ka helper
//   const getEmailFromToken = (token) => {
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.sub || "";  // usually email or user id is in 'sub'
//     } catch {
//       return "";
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       const email = getEmailFromToken(token);
//       setUserEmail(email);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userEmail");
//     navigate("/login");  // common login route
//   };

//   const isLoggedIn = !!localStorage.getItem("accessToken");

//   return (
//     <nav className={`navbar ${darkMode ? "dark" : ""}`}>
//       <div className="navbar-logo">Majlish-E-Khidmat</div>

//       <div className="navbar-right">
//         <ul className="navbar-links">
//           {isLoggedIn ? (
//             <>
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/activities">Activities</Link></li>
//               <li><Link to="/user/profile">Profile</Link></li>
//               <li style={{ color: "white", padding: "0 10px", alignSelf: "center" }}>
//                 {userEmail ? `Welcome, ${userEmail}` : ""}
//               </li>
//               <li>
//                 <button onClick={handleLogout} className="logout-btn">Logout</button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li><Link to="/user/register">User Register</Link></li>
//               <li><Link to="/login">Login</Link></li>
//               <li><Link to="/admin/register">Admin Register</Link></li>
//             </>
//           )}
//         </ul>

//         {/* Dark Mode Toggle */}
//         <div
//           className={`toggle-switch ${darkMode ? "dark" : ""}`}
//           onClick={toggleDarkMode}
//           title="Toggle Dark Mode"
//           style={{ cursor: "pointer" }}
//         >
//           <div className="toggle-knob">
//             {darkMode ? (
//               <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="black">
//                 <path d="M9.37 5.51A7.5 7.5 0 0012 21a7.5 7.5 0 007.5-7.5c0-3.37-2.2-6.2-5.23-7.16a.5.5 0 01-.19-.85 6 6 0 10-4.71 10.12.5.5 0 01.62.77A7.49 7.49 0 009.37 5.51z"/>
//               </svg>
//             ) : (
//               <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="orange">
//                 <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8zm10.48 0l1.8-1.79 1.41 1.41-1.79 1.8zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm8-10h3v-1h-3v1zM4 13H1v-1h3v1zm14.24 6.16l1.8 1.79 1.41-1.41-1.79-1.8zm-10.48 0l-1.8 1.79-1.41-1.41 1.79-1.8zM12 6a6 6 0 110 12 6 6 0 010-12z"/>
//               </svg>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default UserNavbar;




// //ye kam kar rha hai 
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// import "../styles/navbar.css";

// function UserNavbar({ darkMode, toggleDarkMode }) {
//   const navigate = useNavigate();
//   const [userEmail, setUserEmail] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       try {
        
//         const decoded = jwtDecode(token); // ✅ decode token
//         setUserEmail(decoded.sub || decoded.email || "");
//       } catch (error) {
//         console.error("Invalid JWT Token", error);
//         setUserEmail("");
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userEmail");
//     navigate("/login");
//   };

//   const isLoggedIn = !!localStorage.getItem("accessToken");

//   return (
//     <nav className={`navbar ${darkMode ? "dark" : ""}`}>
//       <div className="navbar-logo">Majlish-E-Khidmat</div>

//       <div className="navbar-right">
//         <ul className="navbar-links">
//           {isLoggedIn ? (
//             <>
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/activities">Activities</Link></li>
//               <li><Link to="/user/profile">Profile</Link></li>
//               <li style={{ color: "white", padding: "0 10px", alignSelf: "center" }}>
//                 {userEmail && `Welcome, ${userEmail}`}
//               </li>
//               <li>
//                 <button onClick={handleLogout} className="logout-btn">Logout</button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li><Link to="/user/register">User Register</Link></li>
//               <li><Link to="/login">Login</Link></li>
//               <li><Link to="/admin/register">Admin Register</Link></li>
//             </>
//           )}
//         </ul>

//         {/* Dark Mode Toggle */}
//         <div
//           className={`toggle-switch ${darkMode ? "dark" : ""}`}
//           onClick={toggleDarkMode}
//           title="Toggle Dark Mode"
//           style={{ cursor: "pointer" }}
//         >
//           <div className="toggle-knob">
//             {darkMode ? (
//               <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="black">
//                 <path d="M9.37 5.51A7.5 7.5 0 0012 21a7.5 7.5 0 007.5-7.5c0-3.37-2.2-6.2-5.23-7.16a.5.5 0 01-.19-.85 6 6 0 10-4.71 10.12.5.5 0 01.62.77A7.49 7.49 0 009.37 5.51z"/>
//               </svg>
//             ) : (
//               <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="orange">
//                 <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8zm10.48 0l1.8-1.79 1.41 1.41-1.79 1.8zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm8-10h3v-1h-3v1zM4 13H1v-1h3v1zm14.24 6.16l1.8 1.79 1.41-1.41-1.79-1.8zm-10.48 0l-1.8 1.79-1.41-1.41 1.79-1.8zM12 6a6 6 0 110 12 6 6 0 010-12z"/>
//               </svg>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default UserNavbar;



// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import "../styles/navbar.css";

// function UserNavbar({ darkMode, toggleDarkMode }) {
//   const navigate = useNavigate();
//   const [userEmail, setUserEmail] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token); // ✅ decode token
//         setUserEmail(decoded.sub || decoded.email || "");
//       } catch (error) {
//         console.error("Invalid JWT Token", error);
//         setUserEmail("");
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userEmail");
//     navigate("/login");
//   };

//   const isLoggedIn = !!localStorage.getItem("accessToken");

//   return (
//     <nav className={`navbar ${darkMode ? "dark" : ""}`}>
//       <div className="navbar-logo">Majlish-E-Khidmat</div>

//       <div className="navbar-right">
//         <ul className="navbar-links">
//           {isLoggedIn ? (
//             <>
//               {/* User-specific links */}
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/activities">Activities</Link></li>
//               <li><Link to="/donation">Donations</Link></li>
//               <li><Link to="/volunteer">Volunteers</Link></li>
//               <li><Link to="/campaign">Campaigns</Link></li>
//               <li><Link to="/inventory">Inventory</Link></li>
//               <li><Link to="/feedback">Feedback</Link></li>
//               <li><Link to="/user/profile">Profile</Link></li>

//               {/* Welcome Email */}
//               <li style={{ color: "white", padding: "0 10px", alignSelf: "center" }}>
//                 {userEmail && `Welcome, ${userEmail}`}
//               </li>

//               {/* Logout button */}
//               <li>
//                 <button onClick={handleLogout} className="logout-btn">Logout</button>
//               </li>
//             </>
//           ) : (
//             <>
//               {/* Logged out links */}
//               <li><Link to="/user/register">User Register</Link></li>
//               <li><Link to="/login">User Login</Link></li>
//               <li><Link to="/admin/register">Admin Register</Link></li>
//             </>
//           )}
//         </ul>

//         {/* Dark Mode Toggle */}
//         <div
//           className={`toggle-switch ${darkMode ? "dark" : ""}`}
//           onClick={toggleDarkMode}
//           title="Toggle Dark Mode"
//           style={{ cursor: "pointer" }}
//         >
//           <div className="toggle-knob">
//             {darkMode ? (
//               <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="black">
//                 <path d="M9.37 5.51A7.5 7.5 0 0012 21a7.5 7.5 0 007.5-7.5c0-3.37-2.2-6.2-5.23-7.16a.5.5 0 01-.19-.85 6 6 0 10-4.71 10.12.5.5 0 01.62.77A7.49 7.49 0 009.37 5.51z"/>
//               </svg>
//             ) : (
//               <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="orange">
//                 <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8zm10.48 0l1.8-1.79 1.41 1.41-1.79 1.8zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm8-10h3v-1h-3v1zM4 13H1v-1h3v1zm14.24 6.16l1.8 1.79 1.41-1.41-1.79-1.8zm-10.48 0l-1.8 1.79-1.41-1.41 1.79-1.8zM12 6a6 6 0 110 12 6 6 0 010-12z"/>
//               </svg>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default UserNavbar;






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
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
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
                <li><Link to="/">Home</Link></li>
                <li><Link to="/admin/features">Features</Link></li>
                <li><Link to="/admin/about">About</Link></li>
                <li><Link to="/admin/contact">Contact</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/user/register">User Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/admin/register">Admin Register</Link></li>
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
                <div className="avatar-placeholder">{getInitials(userName)}</div>
              )}
            </div>
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  {userImage ? (
                    <img src={userImage} alt="User" />
                  ) : (
                    <div className="avatar-placeholder">{getInitials(userName)}</div>
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
              <Link to="/volunteer/register" onClick={() => setIsSidebarOpen(false)}>
                ✍️ Volunteer Register
              </Link>
            </li>

            <li>
              <Link to="/volunteer/list" onClick={() => setIsSidebarOpen(false)}>
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
                <Link to="/campaign/form" onClick={() => setIsSidebarOpen(false)}>
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
