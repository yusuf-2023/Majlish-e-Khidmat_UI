import React, { createContext, useState, useEffect } from "react";
import { getAdminProfile } from "../api/admin/adminApi";
import { getUserProfile } from "../api/user/userApi"; // User API import

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("userRole") || null);
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [profilePic, setProfilePic] = useState(localStorage.getItem("userProfilePic") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const normalizeRole = (rawRole) => {
    if (!rawRole) return null;
    const upper = rawRole.toUpperCase();
    if (upper === "ROLE_ADMIN" || upper === "ADMIN") return "ADMIN";
    if (upper === "ROLE_USER" || upper === "USER") return "USER";
    return upper;
  };

  const normalizePic = (pic) => {
    if (!pic) return "";
    if (pic.startsWith("http")) return pic;
    return `${baseUrl}/${pic}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      const savedRole = normalizeRole(localStorage.getItem("userRole"));

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        if (savedRole === "ADMIN") {
          const res = await getAdminProfile();
          const profile = res?.data?.data || res?.data || (Array.isArray(res.data) ? res.data[0] : res.data);
          if (profile) {
            setName(profile.name || "");
            setProfilePic(normalizePic(profile.profilePic));
            setEmail(profile.email || "");
            localStorage.setItem("userName", profile.name || "");
            localStorage.setItem("userProfilePic", normalizePic(profile.profilePic));
            localStorage.setItem("userEmail", profile.email || "");
          }
        } else if (savedRole === "USER") {
          const res = await getUserProfile();
          const profile = res?.data?.data || res?.data || res;
          if (profile) {
            setName(profile.name || "");
            setProfilePic(normalizePic(profile.profilePic));
            setEmail(profile.email || "");
            localStorage.setItem("userName", profile.name || "");
            localStorage.setItem("userProfilePic", normalizePic(profile.profilePic));
            localStorage.setItem("userEmail", profile.email || "");
          }
        }
        setRole(savedRole);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        localStorage.clear();
        setRole(null);
        setName("");
        setProfilePic("");
        setEmail("");
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const loginUser = (data) => {
    if (!data) return;
    const normRole = normalizeRole(data.role);
    setRole(normRole);
    setName(data.name || "");
    setProfilePic(normalizePic(data.profilePic));
    setEmail(data.email || "");

    localStorage.setItem("accessToken", data.accessToken || "");
    localStorage.setItem("userRole", normRole || "");
    localStorage.setItem("userName", data.name || "");
    localStorage.setItem("userProfilePic", normalizePic(data.profilePic));
    localStorage.setItem("userEmail", data.email || "");

    setLoading(false);
  };

  const logoutUser = () => {
    setRole(null);
    setName("");
    setProfilePic("");
    setEmail("");
    localStorage.clear();
  };

  const contextValue = {
    role,
    name,
    profilePic,
    email,
    loading,
    loginUser,
    logoutUser,
    setName,
    setProfilePic,
    setEmail,
    setAdminName: setName,
    setAdminImage: setProfilePic
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
