import axios from "axios";

const API_BASE_ADMIN = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/admin`
  : "http://localhost:8080/api/admin";

const API_BASE_AUTH = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/auth`
  : "http://localhost:8080/api/auth";

const getToken = () => localStorage.getItem("accessToken")?.trim() || null;

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic GET, DELETE
const requestAdmin = async (method, url, data = null, params = {}) => {
  try {
    const response = await axios({ method, url: `${API_BASE_ADMIN}${url}`, data, params, headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Request failed";
    throw new Error(msg);
  }
};

// =================== Auth APIs ===================
export const adminLogin = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE_AUTH}/admin/login`, credentials);
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Login failed. Check credentials.";
    throw new Error(msg);
  }
};

export const adminRegister = async (adminData, file = null) => {
  try {
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(adminData)], { type: "application/json" }));
    if (file) formData.append("file", file);

    const res = await axios.post(`${API_BASE_ADMIN}/register`, formData, { headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" } });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.response?.data?.message || "Registration failed";
    throw new Error(msg);
  }
};

// =================== Admin CRUD ===================
export const getAllAdmins = () => requestAdmin("get", "/all");
export const getAdminProfile = () => requestAdmin("get", "/profile");

// ===== UPDATE PROFILE (JSON) =====
export const updateAdminProfile = async (adminData) => {
  try {
    const res = await axios.put(`${API_BASE_ADMIN}/update`, adminData, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Update failed";
    throw new Error(msg);
  }
};

// Profile pic upload separately
export const uploadAdminProfilePic = async (file) => {
  if (!file) throw new Error("No file selected");
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(`${API_BASE_ADMIN}/upload-profile-pic`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Upload failed";
    throw new Error(msg);
  }
};

export const deleteAdminProfile = () => requestAdmin("delete", "/delete");
export const adminLogout = () => localStorage.removeItem("accessToken");

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