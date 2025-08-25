import React from "react";
import { Navigate } from "react-router-dom";
import GuestGuard from "./Guard/GuestGuard";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login";
import AdminRegister from "../pages/Auth/AdminRegister";
import UserRegister from "../pages/Auth/UserRegister";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp";

const AuthRoutes = {
  path: "auth",
  element: <AuthLayout />,
  children: [
    {
      path: "",
      element: <Navigate to="login" replace />,
    },
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
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "verify-otp",
      element: <VerifyOtp />,
    },
  ],
};

export default AuthRoutes;
