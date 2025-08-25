import { useState, useEffect } from "react";
import { registerUser } from "../../api/user/userApi";
import "../../styles/UserRegister.css";
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import {
  FaHandsHelping,
  FaUtensils,
  FaBook,
  FaMedkit,
  FaUsers,
  FaRegSmile,
} from "react-icons/fa";

function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ===== Topics with icons =====
  const topics = [
    { icon: <FaHandsHelping />, text: "Helping Orphans" },
    { icon: <FaUtensils />, text: "Food & Clothes Distribution" },
    { icon: <FaBook />, text: "Educational Support" },
    { icon: <FaMedkit />, text: "Medical Aid" },
    { icon: <FaUsers />, text: "Community Welfare" },
    { icon: <FaRegSmile />, text: "Disaster Relief" },
  ];

  const [currentTopic, setCurrentTopic] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopic((prev) => (prev + 1) % topics.length);
    }, 3000); // 3s per topic
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, Email, and Password are required.");
      return;
    }

    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (formData.dob && !dobRegex.test(formData.dob)) {
      setError("Invalid date format. Please use YYYY-MM-DD.");
      return;
    }

    try {
      await registerUser(formData);

      setNotificationMsg(`Welcome ${formData.name}, registration successful!`);
      setShowNotification(true);

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
      });

      setTimeout(() => {
        setShowNotification(false);
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("User registration failed:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
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

      <div className="user-register-wrapper">
        <div className="user-register-left">
          {/* Smoke Particles */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="smoke-particle"></div>
          ))}

          {/* Animated Topic */}
          <div className="animated-topic">
            <span className="topic-icon">{topics[currentTopic].icon}</span>
            <span className="topic-text">{topics[currentTopic].text}</span>
          </div>
        </div>

        <div className="user-register-right">
          <div className="user-register-form">
            <h2>Create Account</h2>
            <p className="form-subtitle">Join Majlish-e-Khidmat to continue</p>
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
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="options">
                <label>
                  <input type="checkbox" required /> I agree to the Terms
                </label>
              </div>

              <button type="submit">Create account</button>
            </form>

            <p className="register-link">
              Already have an account?{" "}
              <Link to="/auth/login">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRegister;
