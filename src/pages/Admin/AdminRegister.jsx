// src/pages/Admin/AdminRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminRegister } from "../../api/admin/adminApi";
import "../../styles/AdminRegister.css";
import Notification from "../../components/Notification";

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    role: "ADMIN",
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // DOB format validation (optional)
      const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (formData.dob && !dobRegex.test(formData.dob)) {
        setError("Invalid date format. Please use YYYY-MM-DD.");
        return;
      }

      // Call API to register admin
      await adminRegister(formData);

      setNotificationMsg(`${formData.role} registered successfully!`);
      setShowNotification(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        role: "ADMIN",
      });

      // Redirect to **single login page** after 2 seconds
      setTimeout(() => {
        setShowNotification(false);
        navigate("/login"); // <- single login page route
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || err.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      {showNotification && (
        <Notification
          message={notificationMsg}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="admin-register-wrapper">
        <div className="admin-register-banner">
          <h1>Welcome Admin</h1>
          <p>Create an admin account to manage the system efficiently.</p>
        </div>

        <div className="admin-register-form-container">
          <h2>Create Admin Account</h2>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
                <option value="MODERATOR">Moderator</option>
              </select>
            </div>

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminRegister;
