import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/users`
  : "http://localhost:8080/api/users";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Clean double slashes
API.interceptors.request.use(
  (config) => {
    if (config.url) config.url = config.url.replace(/\/{2,}/g, "/");
    return config;
  },
  (error) => Promise.reject(error)
);



export const registerUser = async (userData) => (await API.post("/register", userData)).data;
export const getAllUsers = async () => {
  const token = localStorage.getItem("accessToken");
  return (await API.get("/all", { headers: { Authorization: `Bearer ${token}` } })).data;
};



export const getUserProfile = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  return (await API.get("/profile", { headers: { Authorization: `Bearer ${token}` } })).data;
};



export const updateUserProfile = async (data) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  return (await API.put("/update", data, { headers: { Authorization: `Bearer ${token}` } })).data;
};



export const deleteUserProfile = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  return (await API.delete("/delete", { headers: { Authorization: `Bearer ${token}` } })).data;
};



export const uploadUserProfilePic = async (file) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");
  const formData = new FormData();
  formData.append("file", file);
  return (await API.post("/upload-profile-pic", formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  })).data;
};

export default API;
