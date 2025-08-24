import axios from "axios";

const API_BASE =
  typeof process !== "undefined" && process.env.REACT_APP_API_BASE_URL
    ? `${process.env.REACT_APP_API_BASE_URL}/api/admin/users`
    : "http://localhost:8080/api/admin/users";

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
 
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all users (Admin only)
export const getAllUsers = () =>
  axios
    .get(`${API_BASE}/all`, {
      headers: getAuthHeaders(),
    })
    .then((res) => res.data);

// Update user details by email (Admin only)
export const updateUser = (email, data) =>
  axios
    .put(`${API_BASE}/update/${encodeURIComponent(email)}`, data, {
      headers: getAuthHeaders(),
    })
    .then((res) => res.data);

// Delete user by email (Admin only)
export const deleteUser = (email) =>
  axios
    .delete(`${API_BASE}/delete/${encodeURIComponent(email)}`, {
      headers: getAuthHeaders(),
    })
    .then((res) => res.data);

// Block or unblock user (Admin only)
export const blockUser = (email, block) =>
  axios
    .put(
      `${API_BASE}/block/${encodeURIComponent(email)}`,
      null,
      {
        params: { block },
        headers: getAuthHeaders(),
      }
    )
    .then((res) => res.data);
