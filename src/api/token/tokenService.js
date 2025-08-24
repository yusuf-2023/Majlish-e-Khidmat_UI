
// src/api/tokenService.js
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= tokenData.exp * 1000;
  } catch (err) {
    console.error("Invalid token format:", err);
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
};

export const checkAuth = () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    if (isTokenExpired(token)) { logout(); return false; }
    return true;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};