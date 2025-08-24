import axios from "axios";
import { logout, isTokenExpired } from "./token/tokenService";

// ✅ Base URL setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/inventory`
  : "http://localhost:8080/api/inventory";

// ✅ Axios instance
const API = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

// ✅ Token interceptor
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

// ✅ Inventory APIs
export const addInventoryItem = async (item) =>
  (await API.post("/", item)).data;

export const getAllInventoryItems = async () =>
  (await API.get("/")).data; // 🔥 renamed function

export const getInventoryById = async (id) =>
  (await API.get(`/${id}`)).data;

export const updateInventoryItem = async (id, item) =>
  (await API.put(`/${id}`, item)).data;

export const deleteInventoryItem = async (id) =>
  (await API.delete(`/${id}`)).data;

export default API;
