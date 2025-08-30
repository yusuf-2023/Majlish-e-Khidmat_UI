// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import "../../styles/Login.css";
import { login } from "../../api/auth/loginService";
import { useNavigate, Link } from "react-router-dom";
import Notification from "../../components/Notification";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [currentHeadline, setCurrentHeadline] = useState(0);

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const headlines = [
    "Welcome to Majlish-e-Khidmat",
    "Your Donation Changes Lives",
    "Give Hope to Those in Need",
    "Together We Can Make a Difference",
    "Every Contribution Matters"
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    // Headline animation interval
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ show: false, message: "", type: "success" });

    try {
      const trimmedEmail = formData.email.trim();
      const response = await login({
        email: trimmedEmail,
        password: formData.password,
      });

      const token = response.accessToken; // Backend JWT
      const roleRaw = response.role || "USER";

      if (!token || token.split(".").length !== 3) {
        throw new Error("Server se invalid token mila.");
      }

      // 🔥 FIXED: Normalize role ek jaisa ho (ADMIN / USER)
      const role = roleRaw.toUpperCase().replace("ROLE_", ""); // "ADMIN" / "USER"

      // Corrected: pass an object to loginUser
      loginUser({
        role,
        accessToken: token,
        name: response.name || "",
        profilePic: response.profilePic || "",
        email: trimmedEmail,
      });

      localStorage.setItem("accessToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", trimmedEmail);

      if (rememberMe) localStorage.setItem("rememberEmail", trimmedEmail);
      else localStorage.removeItem("rememberEmail");

      setNotification({
        show: true,
        message: `Welcome back, ${role === "ADMIN" ? "Admin" : "User"}!`,
        type: "success",
      });

      // 🔥 FIXED: navigate turant karo (setTimeout hata diya)
      if (role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/user/dashboard");

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "unauthorized access!";
      setNotification({ show: true, message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <div className="login-container">
        <div className="login-left">
          <div className="headline-container">
            <h1 className="headline active">{headlines[currentHeadline]}</h1>
          </div>
        </div>
        
        <div className="login-right">
          <div className="form-container">
            <h2>Welcome back</h2>
            <p className="form-subtitle">Please sign in to continue</p>
            <form onSubmit={handleSubmit}>
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
                  autoComplete="username"
                  aria-label="Email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="options">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link to="/auth/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Sign in"}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <p className="register-link">
              Don't have an account?{" "}
              <Link to="/auth/register/user">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
