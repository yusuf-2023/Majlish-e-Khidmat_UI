import React from "react";
import { useAuth } from "../hooks/useAuth";
import AdminNavbar from "../components/AdminNavbar";
import UserNavbar from "../components/UserNavbar";

const Header = () => {
  const { role } = useAuth();

  return role === "ADMIN" ? <AdminNavbar /> : <UserNavbar />;
};

export default Header;
