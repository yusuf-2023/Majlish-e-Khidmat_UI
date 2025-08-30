// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { logout } from "../api/tokenService";
// import "../styles/Navbar.css";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/auth/login");
//   };

//   return (
//     <header className="site-header">
//       <nav className="navbar container">
//         <div className="navbar-left">
//           <Link to="/" className="navbar-logo">
//             <img src="/WhiteLion1.png" alt="Logo" className="logo-img" />
//             <span className="logo-text">MajlisKhidmat</span>
//           </Link>
//         </div>
        
//         <div className="navbar-right">
//           <ul className="navbar-links">
//             <li><Link to="/" className="nav-link">Home</Link></li>
//             <li><Link to="/user/donation" className="nav-link">Donations</Link></li>
//             <li><Link to="/admin/volunteers/list" className="nav-link">Volunteers</Link></li>
//             <li><Link to="/user/campaign/list" className="nav-link">Campaigns</Link></li>
//             <li><Link to="/admin/inventory/list" className="nav-link">Inventory</Link></li>
//             <li><Link to="/user/feedback" className="nav-link">Feedback</Link></li>
//           </ul>
          
//           <div className="navbar-actions">
//             <Link to="/auth/login" className="btn btn-login" aria-label="Login">Login</Link>
//             <Link to="/auth/register/user" className="btn btn-primary" aria-label="Register">Register</Link>
//             <button 
//               onClick={handleLogout} 
//               className="btn btn-logout"
//               aria-label="Logout"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
