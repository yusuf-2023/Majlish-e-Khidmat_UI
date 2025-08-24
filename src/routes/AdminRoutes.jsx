// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminProfile from "../pages/Admin/AdminProfile";
import ManageUsers from "../pages/Admin/ManageUsers";

// Home & Bank & Donation
import Home from "../pages/Home";  
import AdminBankPage from "../pages/AdminBankPage";
import DonationDashboard from "../pages/Donation/DonationDashboard";

// Volunteer
import VolunteerRegister from "../pages/Volunteer/VolunteerRegister"; 

import VolunteerList from "../pages/Volunteer/VolunteerList"; 

// Campaign
import CampaignForm from "../pages/Campaign/CampaignForm";      
import CampaignList from "../pages/Campaign/CampaignList";      

// Event
import EventForm from "../pages/Event/EventForm";
import EventList from "../pages/Event/EventList";

// Inventory
import InventoryForm from "../pages/Inventory/InventoryForm";   
import InventoryList from "../pages/Inventory/InventoryList";   

// Feedback
import FeedbackList from "../pages/Feedback/FeedbackList";   

import AdminRoute from "./AdminRoute";

function AdminRoutes({ darkMode, toggleDarkMode }) {
  return (
    <Routes>
      {/* Admin Pages */}
      <Route path="dashboard" element={<AdminRoute><AdminDashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />
      <Route path="profile" element={<AdminRoute><AdminProfile darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />
      <Route path="manage-users" element={<AdminRoute><ManageUsers darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />

      {/* Home & Donation */}
      <Route path="home" element={<AdminRoute><Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />
      <Route path="donation-dashboard" element={<AdminRoute><DonationDashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />
      <Route path="banks" element={<AdminRoute><AdminBankPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />

      {/* Volunteer */}
      <Route path="volunteers/add" element={<AdminRoute><VolunteerRegister darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />
      <Route path="volunteers/list" element={<AdminRoute><VolunteerList darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />

      {/* Campaign */}
      <Route path="campaign/form" element={<AdminRoute><CampaignForm darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />
      <Route path="campaign/list" element={<AdminRoute><CampaignList darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />

      {/* Event */}
      <Route path="events/create" element={<AdminRoute><EventForm darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />
      <Route path="events/list" element={<AdminRoute><EventList darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />

      {/* Inventory */}
      <Route path="inventory/add" element={<AdminRoute><InventoryForm darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />
      <Route path="inventory/list" element={<AdminRoute><InventoryList darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />

      {/* Feedback */}
      <Route path="feedback/list" element={<AdminRoute><FeedbackList darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></AdminRoute>} />

      {/* Default redirect */}
      <Route path="" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
