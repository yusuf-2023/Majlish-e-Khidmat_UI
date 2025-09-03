import React, { createContext, useState, useEffect } from "react";
import { getAdminProfile } from "../api/admin/adminApi";
import { getUserProfile } from "../api/user/userApi";
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("userRole") || null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Added for AdminProfile
  const [adminName, setAdminName] = useState("");
  const [adminImage, setAdminImage] = useState("");

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

  const updateUserProfile = (profile, savedRole, token) => {
    try {
      const decoded = jwtDecode(token);
      const username = decoded.sub || decoded.username;
      
      if (profile && username) {
        const userObj = {
          id: profile.id,
          name: profile.name || "",
          profilePic: normalizePic(profile.profilePic || profile.profileImage),
          email: profile.email || "",
          username: username,
        };
        setUser(userObj);
        setRole(savedRole);

        // ✅ For AdminProfile usage
        if (savedRole === "ADMIN") {
          setAdminName(userObj.name);
          setAdminImage(userObj.profilePic);
        }
        
        localStorage.setItem("userName", userObj.name);
        localStorage.setItem("userProfilePic", userObj.profilePic);
        localStorage.setItem("userEmail", userObj.email);
        localStorage.setItem("userRole", savedRole);
        console.log("AuthContext: User profile loaded successfully", userObj);
      } else {
        throw new Error("User profile or username missing from token.");
      }
    } catch (error) {
      console.error("Failed to update user profile:", error);
      logoutUser();
    }
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
        let res;
        if (savedRole === "ADMIN") {
          res = await getAdminProfile();
        } else if (savedRole === "USER") {
          res = await getUserProfile();
        } else {
          setLoading(false);
          return;
        }

        const profile = res?.data?.data || res?.data || res;
        updateUserProfile(profile, savedRole, token);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        logoutUser();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const loginUser = (data) => {
    if (!data) return;
    const normRole = normalizeRole(data.role);
    setRole(normRole);

    const token = data.accessToken || localStorage.getItem("accessToken");
    const decoded = jwtDecode(token);
    const username = decoded.sub || decoded.username;

    const userObj = {
      id: data.id,
      name: data.name || "",
      profilePic: normalizePic(data.profilePic),
      email: data.email || "",
      username: username,
    };
    setUser(userObj);

    // ✅ Admin data set
    if (normRole === "ADMIN") {
      setAdminName(userObj.name);
      setAdminImage(userObj.profilePic);
    }

    localStorage.setItem("accessToken", token || "");
    localStorage.setItem("userRole", normRole || "");
    localStorage.setItem("userName", userObj.name || "");
    localStorage.setItem("userProfilePic", userObj.profilePic);
    localStorage.setItem("userEmail", userObj.email);
    console.log("AuthContext: User logged in successfully", userObj);
  };

  const logoutUser = () => {
    setRole(null);
    setUser(null);
    setAdminName("");
    setAdminImage("");
    localStorage.clear();
    console.log("AuthContext: User logged out");
  };

  const contextValue = {
    role,
    user,
    loading,
    loginUser,
    logoutUser,
    adminName,
    setAdminName,
    adminImage,
    setAdminImage,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
