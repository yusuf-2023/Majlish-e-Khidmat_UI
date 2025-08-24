import React, { useState, useEffect } from "react";
import MainRoutes from "./routes/MainRoutes";
import { AuthProvider } from "./context/AuthContext";
// App.js ya index.js mein
import './styles/main.css';
import './styles/layout-system.css';

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthProvider>
      <div className="app-layout">
        <MainRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
    </AuthProvider>
  );
}

export default App;
