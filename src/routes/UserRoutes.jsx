// src/routes/UserRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import ActivityPage from "../pages/ActivityPage";
import UserRegister from "../pages/User/UserRegister";
import Login from "../pages/Login";
import UserProfile from "../pages/User/UserProfile";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";

// Donation
import DonationForm from "../pages/Donation/DonationForm";

// Volunteer
import VolunteerRegister from "../pages/Volunteer/VolunteerRegister"; 
import VolunteerList from "../pages/Volunteer/VolunteerList";         

// Campaign
import CampaignList from "../pages/Campaign/CampaignList";  
import CampaignForm from "../pages/Campaign/CampaignForm";  

// Event

import EventList from "../pages/Event/EventList";
import EventForm from "../pages/Event/EventForm";


// Feedback
import FeedbackForm from "../pages/Feedback/FeedbackForm";

// Private Route
import PrivateRoute from "./PrivateRoute";

function UserRoutes({ darkMode }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/verify-otp" element={<VerifyOtp />} />

      {/* Protected Routes for USER */}
      <Route
        path="/"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <Home darkMode={darkMode} />
          </PrivateRoute>
        }
      />
      <Route
        path="/activities"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <ActivityPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <UserProfile />
          </PrivateRoute>
        }
      />

      {/* Donation */}
      <Route
        path="/donation"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <DonationForm />
          </PrivateRoute>
        }
      />

      {/* Volunteer */}
      <Route
        path="/volunteer/register"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <VolunteerRegister />
          </PrivateRoute>
        }
      />
      <Route
        path="/volunteer/list"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <VolunteerList />
          </PrivateRoute>
        }
      />

      {/* Campaigns */}
      <Route
        path="/campaign/list"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <CampaignList />
          </PrivateRoute>
        }
      />
      <Route
        path="/campaign/form"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <CampaignForm />
          </PrivateRoute>
        }
      />

      {/* Events (USER access) */}
      <Route
        path="/events"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <EventList />
          </PrivateRoute>
        }
      />
      <Route
        path="/events/create"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <EventForm />
          </PrivateRoute>
        }
      />

      {/* Feedback */}
      <Route
        path="/feedback"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <FeedbackForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default UserRoutes;
