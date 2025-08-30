import { useState, useEffect } from "react";
import { verifyOtpAndResetPassword } from "../../api/password/passwordService";
import { useNavigate, useLocation } from "react-router-dom";
import "@/styles/forgetPassword.css";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const type = location.state?.type || "user";

  // Agar email missing hai toh Forgot Password page pe redirect karo
  useEffect(() => {
    if (!email) {
      navigate("/auth/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtpAndResetPassword(email, otp, newPassword);
      alert("Password reset successfully!");
      navigate("/auth/login"); // Login page pe redirect
    } catch (error) {
      alert(error?.response?.data?.message || "Invalid OTP or error resetting password");
    }
  };

  return (
    <div className="password-form-container">
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
