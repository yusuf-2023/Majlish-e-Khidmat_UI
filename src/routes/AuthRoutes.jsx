import React from "react";
import { Navigate } from "react-router-dom";
import GuestGuard from "./Guard/GuestGuard";

import Login from "../pages/Auth/Login";
import AdminRegister from "../pages/Auth/AdminRegister";
import UserRegister from "../pages/Auth/UserRegister";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp";

const AuthRoutes = {
  path: "auth",
  children: [
    { path: "", element: <Navigate to="login" replace /> },
    {
      path: "login",
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      ),
    },
    {
      path: "register/admin",
      element: (
        <GuestGuard>
          <AdminRegister />
        </GuestGuard>
      ),
    },
    {
      path: "register/user",
      element: (
        <GuestGuard>
          <UserRegister />
        </GuestGuard>
      ),
    },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "verify-otp", element: <VerifyOtp /> }, // Common OTP page
  ],
};

export default AuthRoutes;
