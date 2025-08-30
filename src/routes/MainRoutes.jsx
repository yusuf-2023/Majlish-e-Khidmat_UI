import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthGuard from "./Guard/AuthGuard";
import RoleBasedGuard from "./Guard/RoleBasedGuard";

// Layout
import MainLayout from "../layout/MainLayout";

// Pages & Features
import Home from "../pages/Home";
import UserProfile from "../pages/User/UserProfile";
import ActivityPage from "../pages/ActivityPage";
import DonationForm from "../pages/Donation/DonationForm";
import DonationDashboard from "../pages/Donation/DonationDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminProfile from "../pages/Admin/AdminProfile";
import ManageUsers from "../pages/Admin/ManageUsers";
import AdminBankPage from "../pages/AdminBankPage";
import VolunteerRegister from "../pages/Volunteer/VolunteerRegister";
import VolunteerList from "../pages/Volunteer/VolunteerList";
import CampaignForm from "../pages/Campaign/CampaignForm";
import CampaignList from "../pages/Campaign/CampaignList";
import EventForm from "../pages/Event/EventForm";
import EventList from "../pages/Event/EventList";
import InventoryForm from "../pages/Inventory/InventoryForm";
import InventoryList from "../pages/Inventory/InventoryList";
import FeedbackForm from "../pages/Feedback/FeedbackForm";
import FeedbackList from "../pages/Feedback/FeedbackList";

// Auth Routes
import AuthRoutes from "./AuthRoutes";

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { path: "/", element: <Home /> },
    AuthRoutes, // Auth pages: login, register, forgot-password, verify-otp

    // Admin Routes
    {
      path: "admin",
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={["admin"]}>
            <Outlet />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { path: "", element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "profile", element: <AdminProfile /> },
        { path: "manage-users", element: <ManageUsers /> },
        { path: "donation-dashboard", element: <DonationDashboard /> },
        { path: "banks", element: <AdminBankPage /> },
        { path: "volunteers/add", element: <VolunteerRegister /> },
        { path: "volunteers/list", element: <VolunteerList /> },
        { path: "donation", element: <DonationForm /> },
        { path: "campaign/form", element: <CampaignForm /> },
        { path: "campaign/list", element: <CampaignList /> },
        { path: "events/create", element: <EventForm /> },
        { path: "events/list", element: <EventList /> },
        { path: "inventory/add", element: <InventoryForm /> },
        { path: "inventory/list", element: <InventoryList /> },
        { path: "feedback/list", element: <FeedbackList /> },
      ],
    },

    // User Routes
    {
      path: "user",
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={["user"]}>
            <Outlet />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { path: "", element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <Home /> },
        { path: "profile", element: <UserProfile /> },
        { path: "activities", element: <ActivityPage /> },
        { path: "donation", element: <DonationForm /> },
        { path: "campaign/list", element: <CampaignList /> },
        { path: "events/list", element: <EventList /> },
        { path: "feedback", element: <FeedbackForm /> },
        { path: "volunteers/list", element: <VolunteerList /> },
        { path: "volunteers/add", element: <VolunteerRegister /> },
      ],
    },

    { path: "*", element: <Navigate to="/" replace /> },
  ],
};

export default MainRoutes;
