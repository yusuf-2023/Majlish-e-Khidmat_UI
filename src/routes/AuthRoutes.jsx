import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminRegister from "../pages/Admin/AdminRegister";
import UserRegister from "../pages/User/UserRegister";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";

const AuthRoutes = {
  path: "auth",
  children: [
    {
      path: "",
      element: <Navigate to="login" replace />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register/admin",
      element: <AdminRegister />,
    },
    {
      path: "register/user",
      element: <UserRegister />,
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
