// src/api/auth/loginService.js
import API, { jsonHeader } from "../core/httpClient";

// JWT Base64 decoder helper
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

// Backend se email ke hisaab se role get karo
export const getRoleByEmail = async (email) => {
  try {
    const res = await API.get(`/auth/get-role?email=${encodeURIComponent(email)}`);
    let role = res.data.role || "USER";
    if (!role.startsWith("ROLE_")) role = "ROLE_" + role.toUpperCase();
    return role;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};

// Login user/admin
export const login = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email and password are required");

  // Step 1: Role fetch karo
  const role = await getRoleByEmail(email);
  if (!role) throw new Error("Email not registered");

  // Step 2: Endpoint decide
  const endpoint = role === "ROLE_ADMIN" ? "/auth/admin/login" : "/auth/login";

  // Step 3: Login request
  const res = await API.post(endpoint, { email, password }, { headers: { ...jsonHeader, "Content-Type": "application/json" } });

  // Step 4: Token fetch
  const token = res.data.accessToken || res.data.token;
  if (!token) throw new Error("No token received from server");

  // Step 5: LocalStorage save
  localStorage.setItem("accessToken", token);
  localStorage.setItem("userRole", role);
  localStorage.setItem("userEmail", email);

  return { accessToken: token, role };
};

// Logout helper
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
};

// JWT token valid hai ya nahi check karo
export const checkAuth = () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
};
