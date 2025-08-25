import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const { role } = useAuth();
  const { darkMode } = useLoaderData();
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  return (
    <div
      className={`app-layout ${role?.toLowerCase() || "public"}-theme ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {!isAuthRoute && <Header darkMode={darkMode} />}
      <main className="main-content">
        <div>
          <Outlet />
        </div>
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  );
};

export default MainLayout;
