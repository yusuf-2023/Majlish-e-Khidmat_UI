import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeRole = (rawRole) => {
    if (!rawRole) return null;
    const upper = rawRole.toUpperCase();
    if (upper === "ROLE_ADMIN") return "ADMIN";
    if (upper === "ROLE_USER") return "USER";
    return upper;
  };

  const loginUser = (rawRole, jwtToken, userEmail) => {
    const normRole = normalizeRole(rawRole);

    setRole(normRole);
    setToken(jwtToken);
    setEmail(userEmail);

    localStorage.setItem("accessToken", jwtToken);
    localStorage.setItem("userRole", normRole);
    localStorage.setItem("userEmail", userEmail);
  };

  const logoutUser = () => {
    setRole(null);
    setToken(null);
    setEmail(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedRole = localStorage.getItem("userRole");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedToken && savedRole) {
      try {
        const decoded = jwtDecode(savedToken);

        

        // Token expiration check
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          logoutUser();
        } else {
          setToken(savedToken);
          setRole(normalizeRole(savedRole));
          setEmail(savedEmail);
        }
      } catch (err) {
        console.error("Invalid token in localStorage:", err);
        logoutUser();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ role, token, email, loginUser, logoutUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
