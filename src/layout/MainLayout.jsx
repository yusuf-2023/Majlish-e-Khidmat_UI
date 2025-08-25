import React from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, useLoaderData } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const { role } = useAuth();
  const { darkMode } = useLoaderData();

  return (
    <div
      className={`app-layout ${role?.toLowerCase() || "public"}-theme ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <Header darkMode={darkMode} />
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
