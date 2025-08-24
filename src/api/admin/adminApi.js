import axios from "axios";

// Base URLs
const API_BASE_ADMIN = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/admin`
  : "http://localhost:8080/api/admin";

const API_BASE_AUTH = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/auth`
  : "http://localhost:8080/api/auth";

// Safely get token from localStorage
const getToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  return token.trim();
};

// Generate Authorization headers
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic admin API request
const requestAdmin = async (method, url, data = null, params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_ADMIN}${url}`,
      data,
      params,
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data?.message || error.message || "Request failed";
    console.error(`Admin API Error [${method.toUpperCase()} ${url}]:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Auth APIs
export const adminLogin = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE_AUTH}/admin/login`, credentials);
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Login failed. Check credentials.";
    throw new Error(msg);
  }
};

export const adminRegister = async (adminData) => {
  try {
    const res = await axios.post(`${API_BASE_ADMIN}/register`, adminData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.response?.data?.message || "Registration failed. Try again.";
    throw new Error(msg);
  }
};

// Admin CRUD
export const getAllAdmins = () => requestAdmin("get", "/all");
export const getAdminProfile = () => requestAdmin("get", "/profile");
export const updateAdminProfile = (data) => requestAdmin("put", "/update", data);
export const deleteAdminProfile = () => requestAdmin("delete", "/delete");

// Password
export const forgotPassword = (email) => requestAdmin("post", "/forgot-password", { email });
export const resetPassword = (token, newPassword) =>
  requestAdmin("post", "/reset-password", { token, newPassword });

// Logout
export const adminLogout = () => localStorage.removeItem("accessToken");

// Check if admin token is valid
export const isAdminAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Upload profile picture
export const uploadAdminProfilePic = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_ADMIN}/upload-profile-pic`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.response?.data?.message || "Upload failed";
    throw new Error(msg);
  }
};
