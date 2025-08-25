import { useState, useEffect } from "react";
import { verifyOtpAndResetPassword } from "../api/password/passwordService";
// API call import karo
import { useNavigate, useLocation } from "react-router-dom";
import "@/styles/Login.css";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation se email aur type (admin/user) le lo
  const email = location.state?.email;
  const type = location.state?.type || "user";

  // Agar email nahi milta toh redirect karo ForgotPassword page pe
  useEffect(() => {
    if (!email) {
      navigate(
        type === "admin" ? "/admin/forgot-password" : "/user/forgot-password"
      );
    }
  }, [email, type, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call with email, otp, new password (type is ignored by backend as of now)
      await verifyOtpAndResetPassword(email, otp, newPassword);

      alert("Password reset successfully!");
      // Success pe login page pe bhejo
      navigate(type === "admin" ? "/admin/login" : "/user/login");
    } catch (error) {
      alert(error?.message || "Invalid OTP or error resetting password");
    }
  };

  return (
    <div className="form-container">
      <h2>{type === "admin" ? "Admin" : "User"} Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit">Verify & Reset</button>
      </form>
    </div>
  );
}

export default VerifyOtp;
