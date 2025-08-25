// src/pages/Admin/AdminRegister.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        navigate("/auth/login"); // <- single login page route
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
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
          <ul className="banner-points">
            <li>Manage users and roles</li>
            <li>Oversee campaigns and events</li>
            <li>Track donations and inventory</li>
          </ul>
        </div>

        <div className="admin-register-form-container">
          <h2>Create Admin Account</h2>
          <p className="form-subtitle">
            Set up an account to manage the platform
          </p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                placeholder="Optional"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
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
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
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

            <div className="options" style={{ marginTop: 6 }}>
              <label>
                <input type="checkbox" required /> I agree to the Terms
              </label>
            </div>

            <button type="submit">Create admin account</button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <p className="register-link">
            Already have an account? <Link to="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default AdminRegister;
