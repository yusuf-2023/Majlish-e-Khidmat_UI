import API, { jsonHeader } from "../core/httpClient";


// Send OTP for forgot password
export const sendOtp = async (email) => {
  try {
    return await API.post("/forgot-password/send-otp", { email }, jsonHeader);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// Verify OTP and reset password
export const verifyOtpAndResetPassword = async (email, otp, newPassword) => {
  try {
    const response = await API.post(
      "/forgot-password/verify-otp",
      { email, otp, newPassword },
      jsonHeader
    );

    // Update tokens if returned
    const accessToken = response.data.accessToken || response.data.token;
    if (accessToken) {
      localStorage.setItem("token", accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};
