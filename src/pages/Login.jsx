// import React, { useState, useContext, useEffect } from "react";
// import { login } from "../api/auth/loginService";
// import { useNavigate, Link } from "react-router-dom";
// import Notification from "../components/Notification";
// import { AuthContext } from "../context/AuthContext";

// function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [notification, setNotification] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   const navigate = useNavigate();
//   const { loginUser } = useContext(AuthContext);

//   useEffect(() => {
//     const savedEmail = localStorage.getItem("rememberEmail");
//     if (savedEmail) {
//       setFormData((prev) => ({ ...prev, email: savedEmail }));
//       setRememberMe(true);
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setNotification({ show: false, message: "", type: "success" });

//     try {
//       const trimmedEmail = formData.email.trim();
//       const response = await login({
//         email: trimmedEmail,
//         password: formData.password,
//       });

//       const token = response.accessToken || response.token;
//       const roleRaw = response.role || "";
//       const email = response.email || trimmedEmail;

//       if (!token || token.split(".").length !== 3) {
//         throw new Error("Server se invalid token mila.");
//       }

//       const role = roleRaw.startsWith("ROLE_")
//         ? roleRaw.toUpperCase()
//         : "ROLE_" + roleRaw.toUpperCase();

//       // Save in context and localStorage
//       loginUser(role, token, email);
//       localStorage.setItem("accessToken", token);
//       localStorage.setItem("userRole", role);
//       localStorage.setItem("userEmail", email);

//       if (rememberMe) localStorage.setItem("rememberEmail", email);
//       else localStorage.removeItem("rememberEmail");

//       setNotification({
//         show: true,
//         message: `Welcome back, ${role === "ROLE_ADMIN" ? "Admin" : "User"}!`,
//         type: "success",
//       });

//       setTimeout(() => {
//         setNotification({ show: false, message: "", type: "success" });
//         if (role === "ROLE_ADMIN") navigate("/admin/dashboard");
//         else navigate("/user/profile");
//       }, 1000);

//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         error.message ||
//         "Galat credentials ya unauthorized access!";
//       setNotification({ show: true, message, type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {notification.show && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification({ ...notification, show: false })}
//         />
//       )}

//       <div className="form-container">
//         <h2>Login</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             autoComplete="username"
//           />

//           <div className="password-container">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               autoComplete="current-password"
//             />
//             <button
//               type="button"
//               className="toggle-password"
//               onClick={() => setShowPassword(!showPassword)}
//               tabIndex={-1}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>

//           <div className="options">
//             <label>
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//               />
//               Remember me
//             </label>

//             <Link to="/user/forgot-password" className="forgot-link">
//               Forgot Password?
//             </Link>
//           </div>

//           <button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="register-link">
//           Don't have an account? <Link to="/user/register">Register here</Link>
//         </p>
//       </div>
//     </>
//   );
// }

// export default Login;

// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { login } from "../api/auth/loginService";
import { useNavigate, Link } from "react-router-dom";
import Notification from "../components/Notification";
import { AuthContext } from "../context/AuthContext";

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

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
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
      const email = trimmedEmail;

      if (!token || token.split(".").length !== 3) {
        throw new Error("Server se invalid token mila.");
      }

      const role = roleRaw.toUpperCase().startsWith("ROLE_")
        ? roleRaw.toUpperCase()
        : "ROLE_" + roleRaw.toUpperCase();

      // Save in context and localStorage
      loginUser(role, token, email);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);

      if (rememberMe) localStorage.setItem("rememberEmail", email);
      else localStorage.removeItem("rememberEmail");

      setNotification({
        show: true,
        message: `Welcome back, ${role === "ROLE_ADMIN" ? "Admin" : "User"}!`,
        type: "success",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
        if (role === "ROLE_ADMIN") navigate("/admin/dashboard");
        else navigate("/user/profile");
      }, 500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Galat credentials ya unauthorized access!";
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

      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
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
            <Link to="/user/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/user/register">Register here</Link>
        </p>
      </div>
    </>
  );
}

export default Login;
