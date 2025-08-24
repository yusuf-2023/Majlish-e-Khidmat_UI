import axios from "axios"; // 👈 Missing import (important!)
import { logout, isTokenExpired } from "./token/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/feedbacks`
  : "http://localhost:8080/api/feedbacks";

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

// ✅ Notice no extra slash
export const submitFeedback = async (feedback) =>
  (await API.post("", feedback)).data;

export const getAllFeedback = async () =>
  (await API.get("")).data;

export const getFeedbackById = async (id) =>
  (await API.get(`/${id}`)).data;

export const updateFeedback = async (id, feedback) =>
  (await API.put(`/${id}`, feedback)).data;

export const deleteFeedback = async (id) =>
  (await API.delete(`/${id}`)).data;

export default API;
