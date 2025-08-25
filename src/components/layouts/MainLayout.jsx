import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminNavbar from "../AdminNavbar";
import UserNavbar from "../UserNavbar";
import Footer from "../Footer";

const MainLayout = () => {
  const { role } = useAuth();
  const location = useLocation();

  // Don't show layout for login page
  if (location.pathname === "/login") {
    return <Outlet />;
  }

  return (
    <>
      {/* Navbar based on role */}
      {role === "ADMIN" ? <AdminNavbar /> : <UserNavbar />}

      <main className="main-content">
        <div className="container section-lg">
          <Outlet />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
