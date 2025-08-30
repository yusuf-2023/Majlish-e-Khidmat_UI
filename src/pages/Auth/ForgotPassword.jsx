import { useState } from "react";
import { sendOtp } from "../../api/password/passwordService";
import { useNavigate, useLocation } from "react-router-dom";
import "@/styles/forgetPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes("admin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendOtp(email);
      alert("OTP sent to your email");
      navigate("/auth/verify-otp", {
        state: { email, type: isAdmin ? "admin" : "user" }, // Send type to OTP page
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="password-form-container">
      <h2>{isAdmin ? "Admin" : "User"} Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
