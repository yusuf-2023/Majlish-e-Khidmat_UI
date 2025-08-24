import axios from "axios";
import { logout, isTokenExpired } from "../token/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`
  : "http://localhost:8080/api/campaigns";

const API = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

// Token interceptor
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

// ✅ Campaign APIs
export const createCampaign = async (campaign) => (await API.post("", campaign)).data;
export const getAllCampaigns = async () => (await API.get("")).data;
export const getCampaignById = async (id) => (await API.get(`/${id}`)).data;
export const updateCampaign = async (id, campaign) => (await API.put(`/${id}`, campaign)).data;
export const deleteCampaign = async (id) => (await API.delete(`/${id}`)).data;

export default API;
