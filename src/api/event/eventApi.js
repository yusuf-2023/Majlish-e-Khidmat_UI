// majlishekhidmat-frontend/src/api/Event/eventApi.js
import axios from "axios";
import { logout, isTokenExpired } from "../token/tokenService"; // path correct karein

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/events`
  : "http://localhost:8080/api/events";

const API = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

// 🔒 Token interceptor
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

// ✅ Event APIs
export const createEvent = async (eventData) =>
  (await API.post("", eventData)).data; // POST /api/events

export const getAllEvents = async () =>
  (await API.get("")).data; // GET /api/events

export const getEventById = async (id) =>
  (await API.get(`/${id}`)).data; // GET /api/events/{id}

export const updateEvent = async (id, eventData) =>
  (await API.put(`/${id}`, eventData)).data; // PUT /api/events/{id}

export const deleteEvent = async (id) =>
  (await API.delete(`/${id}`)).data; // DELETE /api/events/{id}

export default API;
