// src/api/dashboard/dashboardApi.js
import axios from "axios";
import { logout, isTokenExpired } from "../token/tokenService"; // tokenService ke path ko check kare

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:8080/api";

// Axios instance with token interceptor
const API = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    if (isTokenExpired(token)) {
      logout();
      throw new Error("Token expired");
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ✅ Dashboard APIs (Get total counts)
export const getTotalUsers = async () => (await API.get("/users/count")).data;
export const getTotalVolunteers = async () => (await API.get("/volunteers/count")).data;
export const getTotalCampaigns = async () => (await API.get("/campaigns/count")).data;
export const getTotalInventory = async () => (await API.get("/inventory/count")).data;
export const getTotalFeedback = async () => (await API.get("/feedback/count")).data;

export default API;
