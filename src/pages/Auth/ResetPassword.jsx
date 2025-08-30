import { useState } from "react";
import { verifyOtpAndResetPassword } from "../../api/password/passwordService"; // Use verifyOtpAndResetPassword to match backend
import { useNavigate, useLocation } from "react-router-dom";
import "@/styles/forgetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const type = location.state?.type || "user";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Since backend expects OTP for reset, this direct reset might not work without OTP
      // Consider prompting user to enter OTP instead, or remove this component
      alert("Please use Verify OTP page to reset your password.");
      navigate(
        type === "admin" ? "/admin/forgot-password" : "/user/forgot-password"
      );
    } catch {
      alert("Error resetting password");
    }
  };

  return (
    <div className="password-form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
}

export default ResetPassword;
