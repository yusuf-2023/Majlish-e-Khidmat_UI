import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

// Auth guards
const AdminGuard = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return role === "ADMIN" ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

const UserGuard = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return role === "USER" ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

// Route configurations
const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <Home />,
    },
    AuthRoutes,
    // Admin Routes
    {
      path: "admin",
      element: <AdminGuard />,
      children: [
        { path: "", element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "profile", element: <AdminProfile /> },
        { path: "manage-users", element: <ManageUsers /> },
        { path: "donation-dashboard", element: <DonationDashboard /> },
        { path: "banks", element: <AdminBankPage /> },
        { path: "volunteers/add", element: <VolunteerRegister /> },
        { path: "volunteers/list", element: <VolunteerList /> },
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
      element: <UserGuard />,
      children: [
        { path: "", element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <Home /> },
        { path: "profile", element: <UserProfile /> },
        { path: "activities", element: <ActivityPage /> },
        { path: "donation", element: <DonationForm /> },
        { path: "campaign/list", element: <CampaignList /> },
        { path: "events", element: <EventList /> },
        { path: "events/create", element: <EventForm /> },
        { path: "feedback", element: <FeedbackForm /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
};
export default MainRoutes;
