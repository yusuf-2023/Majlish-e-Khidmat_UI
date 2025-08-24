import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import UserNavbar from "../components/UserNavbar";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import Home from "../pages/Home"; // Imported Home page for the main route
import VolunteerList from "../pages/Volunteer/VolunteerList";// ✅ Added this import

import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

import Login from "../pages/Login";
import AdminRegister from "../pages/Admin/AdminRegister";
import UserRegister from "../pages/User/UserRegister";
import UserProfile from "../pages/User/UserProfile";
import VolunteerRegister from "../pages/Volunteer/VolunteerRegister"; 

import { AuthContext } from "../context/AuthContext";

function MainRoutes({ darkMode, toggleDarkMode }) {
  const { role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="app-layout">
        <div className="container">
          <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - var(--header-height))" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar based on role */}
      {role === "ADMIN" ? (
        <AdminNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      ) : (
        <UserNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}

      <main className="main-content">
        <div className="container section-lg">
          <Routes>
            {/* Main home route - added for public access */}
            <Route path="/" element={<Home darkMode={darkMode} />} />

            {/* Public routes */}
            <Route path="/login" element={<Login darkMode={darkMode} />} />
            <Route path="/admin/register" element={<AdminRegister darkMode={darkMode} />} />
            <Route path="/user/register" element={<UserRegister darkMode={darkMode} />} />
            <Route path="/volunteer/register" element={<VolunteerRegister darkMode={darkMode} />} />
            <Route path="/volunteers" element={<VolunteerList darkMode={darkMode} />} />

            {/* Admin private routes */}
            {role === "ADMIN" && (
              <Route
                path="/admin/*"
                element={<AdminRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
              />
            )}

            {/* User private routes */}
            {role === "USER" && (
              <>
                <Route path="/user/profile" element={<UserProfile darkMode={darkMode} />} />
                <Route path="/*" element={<UserRoutes darkMode={darkMode} />} />
              </>
            )}

            {/* Fallback route */}
            <Route
              path="*"
              element={
                role === "ADMIN" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : role === "USER" ? (
                  <Navigate to="/user/profile" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </>
  );
}

export default MainRoutes;