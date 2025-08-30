import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = ({ darkMode, toggleDarkMode }) => {
  const { role } = useAuth(); // ✅ Safe inside AuthProvider

  return (
    <div
      className={`app-layout ${role?.toLowerCase() || "public"}-theme ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {/* Always show Header on all pages */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="main-content">
        <div>
          <Outlet />
        </div>
      </main>
      
      {/* Always show Footer on all pages */}
      <Footer />
    </div>
  );
};

export default MainLayout;
