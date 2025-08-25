import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "../styles/auth.css";

const AuthLayout = () => {
  const location = useLocation();
  const isRegister = location.pathname.includes("/auth/register");
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/" className="logo-link">
          <img src="/WhiteLion1.png" alt="Logo" className="logo-img" />
          <span className="logo-text">Majlish-e-Khidmat</span>
        </Link>
      </div>  
      <div className={`auth-card ${isRegister ? "wide" : ""}`}>
        <Outlet />
      </div>
      <div className="auth-footer-note">© {new Date().getFullYear()} Majlish-e-Khidmat</div>
    </div>
  );
};

export default AuthLayout;


