import React from 'react';

const DashboardStats = ({ stats, darkMode }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Admins</h3>
        <div className="stat-value">{stats.totalAdmins || 0}</div>
        <p className="stat-label">Active administrators</p>
      </div>

      <div className="stat-card">
        <h3>Total Users</h3>
        <div className="stat-value">{stats.totalUsers || 0}</div>
        <p className="stat-label">Registered users</p>
      </div>

      <div className="stat-card">
        <h3>Active Volunteers</h3>
        <div className="stat-value">{stats.volunteers || 0}</div>
        <p className="stat-label">Current volunteers</p>
      </div>

      <div className="stat-card">
        <h3>Total Donations</h3>
        <div className="stat-value">{stats.donations || 0}</div>
        <p className="stat-label">Donations received</p>
      </div>

      <div className="stat-card">
        <h3>Active Campaigns</h3>
        <div className="stat-value">{stats.campaigns || 0}</div>
        <p className="stat-label">Running campaigns</p>
      </div>

      <div className="stat-card">
        <h3>Total Events</h3>
        <div className="stat-value">{stats.events || 0}</div>
        <p className="stat-label">Events organized</p>
      </div>
    </div>
  );
};

export default DashboardStats;
