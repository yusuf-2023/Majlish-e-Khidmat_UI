import axios from "axios";
import { logout, isTokenExpired } from "./token/tokenService";

// Base Axios instance
const API = axios.create({ baseURL: "http://localhost:8080/api", timeout: 10000 });

// JWT Interceptor
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

// =====================
// Admin API Methods
// =====================
export const createBank = async (dto, adminName) => {
  const res = await API.post(`/admin/banks?adminName=${adminName}`, dto);
  return res.data;
};

export const updateBank = async (id, dto) => {
  const res = await API.put(`/admin/banks/${id}`, dto);
  return res.data;
};

export const deleteBank = async (id) => {
  const res = await API.delete(`/admin/banks/${id}`);
  return res.data;
};

// =====================
// Shared Routes (USER + ADMIN)
// =====================
export const listAllBanks = async () => {
  const res = await API.get("/admin/banks/list"); // Admin view
  return res.data;
};

export const listActiveBanks = async () => {
  const res = await API.get("/banks/active"); // ✅ USER + ADMIN
  return res.data;
};

// Default export
export default {
  createBank,
  updateBank,
  deleteBank,
  listAllBanks,
  listActiveBanks,
};
