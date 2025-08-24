// src/api/stats/statsApi.js
import axios from "axios";
import { logout, isTokenExpired } from "../token/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/stats`
  : "http://localhost:8080/api/stats";

const API = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

// Token interceptor (safe check)
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

// Fetch all stats (single endpoint)
export const fetchStats = async () => {
  try {
    const { data } = await API.get("");
    // normalize keys to what frontend expects (fallbacks)
    return {
      activeVolunteers: data.activeVolunteers ?? data.volunteers ?? 0,
      totalUsers: data.totalUsers ?? data.users ?? 0,
      donationsCollected: data.donationsCollected ?? data.donations ?? 0,
      campaigns: data.campaigns ?? 0,
      inventoryItems: data.inventoryItems ?? data.inventory ?? 0,
      feedbacks: data.feedbacks ?? data.feedbackCount ?? 0,
    };
  } catch (err) {
    console.error("Error fetching stats:", err);
    return {
      activeVolunteers: 0,
      totalUsers: 0,
      donationsCollected: 0,
      campaigns: 0,
      inventoryItems: 0,
      feedbacks: 0,
    };
  }
};

export default API;
