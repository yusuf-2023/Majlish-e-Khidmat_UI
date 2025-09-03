// src/layout/MainLayout.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const { role } = useAuth();

  // Dark mode state ab MainLayout ke andar hai
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`app-layout ${role?.toLowerCase() || "public"}-theme ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="main-content">
        <div>
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;