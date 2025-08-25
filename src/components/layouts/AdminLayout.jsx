import React from 'react';
import { useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'Dashboard';
    if (path === '/admin/profile') return 'Admin Profile';
    if (path === '/admin/stats') return 'Statistics';
    if (path === '/admin/users') return 'Manage Users';
    return 'Admin Panel';
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1>{getPageTitle()}</h1>
          <p className="dashboard-subtitle">
            {location.pathname === '/admin/dashboard' 
              ? 'Overview of system performance and statistics'
              : 'Manage and monitor system activities'}
          </p>
        </div>

        {/* Main Content */}
        <div className="dashboard-content section-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
