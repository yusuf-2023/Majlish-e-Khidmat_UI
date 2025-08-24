import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { role, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Role normalized hai ("ADMIN" ya "USER"), direct check kar sakte hain
  if (role && allowedRoles.includes(role)) {
    return children;
  }

  // Agar allowedRoles me ADMIN hai, to admin login page pe bhejo
  if (allowedRoles.includes("ADMIN") && location.pathname !== "/admin/login") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Agar allowedRoles me USER hai, to user login page pe bhejo
  if (allowedRoles.includes("USER") && location.pathname !== "/user/login") {
    return <Navigate to="/user/login" replace state={{ from: location }} />;
  }

  // Default fallback: user login page
  return <Navigate to="/user/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
