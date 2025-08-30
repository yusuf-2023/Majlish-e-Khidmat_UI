import API, { jsonHeader } from "../core/httpClient";

// Send OTP
export const sendOtp = async (email) => {
  try {
    return await API.post("/forgot-password/send-otp", { email }, jsonHeader);
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
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

    const accessToken = response.data.accessToken || response.data.token;
    const refreshToken = response.data.refreshToken;

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    return response;
  } catch (error) {
    console.error("Password reset error:", error.response?.data || error.message);
    throw error;
  }
};
