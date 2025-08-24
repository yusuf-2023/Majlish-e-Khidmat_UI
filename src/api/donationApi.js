import axios from "axios";
import { logout, isTokenExpired } from "../api/token/tokenService";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

// JWT Interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    if (isTokenExpired(token)) {
      logout();
      throw new Error("Token expired");
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Create Razorpay / Gateway Order
export const createOrder = async ({ accountId, amount, donorName, method }) => {
  if (!accountId || !amount || !donorName) {
    throw new Error("Account ID, donor name and amount are required");
  }
  try {
    const { data } = await API.post("/donations/order", { accountId, amount, donorName, method });
    return data;
  } catch (err) {
    console.error("Create Order Error: ", err);
    if (err.response && err.response.data?.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Failed to create order. Try again later.");
    }
  }
};

// Verify Payment
export const verifyPayment = async ({ donationId, razorpayPaymentId, razorpayOrderId, razorpaySignature }) => {
  if (!donationId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    throw new Error("Missing payment details");
  }
  try {
    const { data } = await API.post("/donations/verify", { donationId, razorpayPaymentId, razorpayOrderId, razorpaySignature });
    return data;
  } catch (err) {
    console.error("Verify Payment Error: ", err);
    if (err.response && err.response.data?.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Payment verification failed. Try again.");
    }
  }
};

// List All Donations - FIXED FUNCTION
export const listAllDonations = async () => {
  try {
    const { data } = await API.get("/donations");
    console.log("API Response:", data); // Debug log to see actual response
    
    // Map the response data to match your frontend expectations
    return data.map(d => ({
      id: d.id,
      donorName: d.donorName || "Anonymous",
      email: d.email || "N/A",
      amount: d.amount || 0,
      // Fix the nested object access - check the actual response structure
      bankName: d.targetAccount?.bankName || d.bankName || null,
      upiId: d.targetAccount?.upiId || d.upiId || null,
      gateway: d.targetAccount?.gateway || d.gateway || null,
      method: d.method || "Unknown",
      createdAt: d.createdAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("List Donations Error: ", err);
    
    // Add better error logging
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      
      if (err.response.status === 401) {
        logout();
        throw new Error("Authentication failed. Please login again.");
      } else if (err.response.status === 403) {
        throw new Error("You don't have permission to view donations.");
      } else if (err.response.status === 404) {
        throw new Error("Donations endpoint not found.");
      }
    } else if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    } else if (err.message === "Network Error") {
      throw new Error("Cannot connect to server. Please check your connection.");
    }
    
    throw new Error("Failed to fetch donations. Please try again later.");
  }
};

// Default export
export default { createOrder, verifyPayment, listAllDonations };