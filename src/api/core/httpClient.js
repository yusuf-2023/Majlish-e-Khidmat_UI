// import axios from "axios";

// // ---------------- Logout helper ----------------
// const logoutUser = () => {
//   localStorage.removeItem("accessToken");  
//   localStorage.removeItem("userRole");
//   localStorage.removeItem("userEmail");
//   window.location.href = "/login"; // login route
// };

// // ---------------- Base URL ----------------
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

// // ---------------- Public URLs ----------------
// const publicUrls = [
//   "/auth/login",
//   "/auth/admin/login",
//   "/admin/register",
//   "/users/register",
//   "/forgot-password/send-otp",
//   "/forgot-password/verify-otp",
//   "/auth/get-role",
// ];

// // ---------------- Helper to clean URLs ----------------
// const cleanPath = (url) =>
//   url ? url.replace(/\/{2,}/g, "/").replace(/(?<!:)\/\/+/g, "/") : "";

// // ---------------- Axios instance ----------------
// const API = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
// });

// // ---------------- Request interceptor ----------------
// API.interceptors.request.use(
//   (config) => {
//     if (config.url) {
//       config.url = cleanPath(config.url);
//     }

//     const token = localStorage.getItem("accessToken");  

//     const isPublic = publicUrls.some(
//       (url) =>
//         config.url?.startsWith(url) ||
//         config.url?.startsWith(BASE_URL.replace(/\/$/, "") + url)
//     );

//     if (!isPublic && token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ---------------- Response interceptor ----------------
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     // Only logout on 401 (unauthorized) to avoid role mismatch issues on 403
//     if (status === 401) {
//       logoutUser();
//     }

//     const errorMessage =
//       error.response?.data?.message || error.message || "Request failed";
//     console.error("API Error:", errorMessage);

//     return Promise.reject(error.response?.data || error);
//   }
// );

// // ---------------- Export ----------------
// export default API;

// export const jsonHeader = {
//   headers: { "Content-Type": "application/json" },
// };



import axios from "axios";

// ---------------- Logout helper ----------------
const logoutUser = () => {
  localStorage.removeItem("accessToken");  
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  window.location.href = "/login"; // login route
};

// ---------------- Base URL ----------------
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// 🚨 Safety check: Missing VITE_API_URL warning
if (!import.meta.env.VITE_API_URL) {
  console.warn(
    "%c[WARNING] VITE_API_URL is not set in .env file. Using fallback:",
    "color: orange; font-weight: bold;"
  );
  console.warn("Fallback BASE_URL =", BASE_URL);
} else {
  console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
}

// ---------------- Public URLs ----------------
const publicUrls = [
  "/auth/login",
  "/auth/admin/login",
  "/admin/register",
  "/users/register",
  "/forgot-password/send-otp",
  "/forgot-password/verify-otp",
  "/auth/get-role",
];

// ---------------- Helper to clean URLs ----------------
const cleanPath = (url) =>
  url ? url.replace(/\/{2,}/g, "/").replace(/(?<!:)\/\/+/g, "/") : "";

// ---------------- Axios instance ----------------
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ---------------- Request interceptor ----------------
API.interceptors.request.use(
  (config) => {
    if (config.url) {
      config.url = cleanPath(config.url);
    }

    const token = localStorage.getItem("accessToken");  

    const isPublic = publicUrls.some(
      (url) =>
        config.url?.startsWith(url) ||
        config.url?.startsWith(BASE_URL.replace(/\/$/, "") + url)
    );

    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- Response interceptor ----------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Only logout on 401 (unauthorized)
    if (status === 401) {
      logoutUser();
    }

    const errorMessage =
      error.response?.data?.message || error.message || "Request failed";
    console.error("API Error:", errorMessage);

    return Promise.reject(error.response?.data || error);
  }
);

// ---------------- Export ----------------
export default API;

export const jsonHeader = {
  headers: { "Content-Type": "application/json" },
};
