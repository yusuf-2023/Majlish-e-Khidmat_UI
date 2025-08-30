import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainRoutes from "./routes/MainRoutes";
import AuthProvider from "./context/AuthContext"; // Correct AuthProvider import
import MainLayout from "./layout/MainLayout"; // Import layout directly
import "./styles/main.css";
import "./styles/layout-system.css";

function App() {
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

  const router = createBrowserRouter([
    {
      ...MainRoutes,
      element: <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
