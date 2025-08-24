// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/navbar.css";

// function Navbar({ darkMode, toggleDarkMode }) {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("email");
//     localStorage.removeItem("role");
//     navigate("/user/login");
//   };

//   const isLoggedIn = !!localStorage.getItem("token");

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
//               <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
//             </>
//           ) : (
//             <>
//               <li><Link to="/user/register">User Register</Link></li>
//               <li><Link to="/user/login">User Login</Link></li>
//               <li><Link to="/admin/register">Admin Register</Link></li>
//             </>
//           )}
//         </ul>

//         {/* Dark Mode Switch */}
//         <div
//           className={`toggle-switch ${darkMode ? "dark" : ""}`}
//           onClick={toggleDarkMode}
//           title="Toggle Dark Mode"
//         >
//           <div className="toggle-knob">
//             {darkMode ? (
//               // Moon SVG
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 height="16"
//                 width="16"
//                 viewBox="0 0 24 24"
//                 fill="black"
//               >
//                 <path d="M9.37 5.51A7.5 7.5 0 0012 21a7.5 7.5 0 007.5-7.5c0-3.37-2.2-6.2-5.23-7.16a.5.5 0 01-.19-.85 6 6 0 10-4.71 10.12.5.5 0 01.62.77A7.49 7.49 0 009.37 5.51z"/>
//               </svg>
//             ) : (
//               // Sun SVG
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 height="16"
//                 width="16"
//                 viewBox="0 0 24 24"
//                 fill="orange"
//               >
//                 <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8zm10.48 0l1.8-1.79 1.41 1.41-1.79 1.8zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm8-10h3v-1h-3v1zM4 13H1v-1h3v1zm14.24 6.16l1.8 1.79 1.41-1.41-1.79-1.8zm-10.48 0l-1.8 1.79-1.41-1.41 1.79-1.8zM12 6a6 6 0 110 12 6 6 0 010-12z"/>
//               </svg>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;




import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/tokenService";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header className="site-header">
      <nav className="navbar container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src="/WhiteLion1.png" alt="Logo" className="logo-img" />
            <span className="logo-text">MajlisKhidmat</span>
          </Link>
        </div>
        
        <div className="navbar-right">
          <ul className="navbar-links">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/donation" className="nav-link">Donations</Link></li>
            <li><Link to="/volunteer" className="nav-link">Volunteers</Link></li>
            <li><Link to="/campaign" className="nav-link">Campaigns</Link></li>
            <li><Link to="/inventory" className="nav-link">Inventory</Link></li>
            <li><Link to="/feedback" className="nav-link">Feedback</Link></li>
          </ul>
          
          <div className="navbar-actions">
            <button 
              onClick={handleLogout} 
              className="btn btn-logout"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
