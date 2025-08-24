import axios from "axios";
import { logout, isTokenExpired } from "../token/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/volunteers`
    : "http://localhost:8080/api/volunteers";

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

export const registerVolunteer = async (formData) =>
    (await API.post("/register", formData, { headers: { "Content-Type": "multipart/form-data" } })).data;

export const createVolunteer = async (dto) =>
    (await API.post("", dto)).data;

export const getAllVolunteers = async () =>
    (await API.get("")).data;

export const getVolunteerById = async (id) =>
    (await API.get(`/${id}`)).data;

export const updateVolunteer = async (id, formData) =>
    (await API.put(`/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })).data;

export const deleteVolunteer = async (id) =>
    (await API.delete(`/${id}`)).data;

export default API;
