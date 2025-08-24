// src/api/logout.js

export const logoutUser = () => {
  const role = localStorage.getItem("userRole");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");

  if (role === "ROLE_ADMIN") {
    window.location.href = "/admin/login";
  } else {
    window.location.href = "/user/login";
  }
};
