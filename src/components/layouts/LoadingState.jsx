import React from 'react';
import AdminLayout from './AdminLayout';

const LoadingState = () => (
  <AdminLayout>
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Loading dashboard data...</p>
    </div>
  </AdminLayout>
);

const ErrorState = ({ message }) => (
  <AdminLayout>
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <p>{message}</p>
    </div>
  </AdminLayout>
);

export { LoadingState, ErrorState };
