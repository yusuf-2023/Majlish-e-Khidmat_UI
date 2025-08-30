import axios from "axios";

// -----------------------------------------------------------
//  Axios Instance and Base URL Configuration
// -----------------------------------------------------------

// API_BASE_URL ko environment variables se uthaye ya default local URL set karein
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api/users` 
  : "http://localhost:8080/api/users";

// Axios instance create karein with base URL and timeout
const API = axios.create({
  // Yahan galti theek ki gayi hai: API_BASE_BASE_URL ko API_BASE_URL se badal diya gaya hai
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor jo double slashes ko remove karta hai
API.interceptors.request.use(
  (config) => {
    if (config.url) config.url = config.url.replace(/\/{2,}/g, "/");
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------------
//  API Functions for User Management
// -----------------------------------------------------------

// Naya user register karne ke liye
export const registerUser = async (userData) => (await API.post("/register", userData)).data;

// Sabhi users ki list laane ke liye
export const getAllUsers = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  return (await API.get("/all", { headers: { Authorization: `Bearer ${token}` } })).data;
};

// Logged-in user ki profile details laane ke liye
export const getUserProfile = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  return (await API.get("/profile", { headers: { Authorization: `Bearer ${token}` } })).data;
};

// Logged-in user ki profile update karne ke liye
export const updateUserProfile = async (data) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  return (await API.put("/update", data, { headers: { Authorization: `Bearer ${token}` } })).data;
};

// Kisi specific user ko delete karne ke liye (Corrected Function)
// Ab yeh function userId ko as a parameter accept karta hai
export const deleteUserProfile = async (userId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  // Yahan URL ko dynamic banaya gaya hai, jismein userId shamil hai
  return (await API.delete(`/${userId}`, { headers: { Authorization: `Bearer ${token}` } })).data;
};

// Profile picture upload karne ke liye
export const uploadUserProfilePic = async (file) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  const formData = new FormData();
  formData.append("file", file);
  return (await API.post("/upload-profile-pic", formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  })).data;
};

export default API;
