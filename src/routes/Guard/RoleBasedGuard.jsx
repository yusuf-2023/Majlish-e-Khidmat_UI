import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

// ==============================|| ROLE BASED GUARD ||============================== //

export default function RoleBasedGuard({ children, roles }) {
  const { role, loading } = useAuth();

  if (loading) return null;
  if (!role) return <Navigate to="/auth/login" replace />;

  const userRole = role.toLowerCase();

  // If no roles are required, allow access
  if (!roles?.length) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (!roles.includes(userRole)) {
    return <Navigate to="/404" replace />;
  }

  // Render children if user has required role
  return <>{children}</>;
}

RoleBasedGuard.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.arrayOf(PropTypes.string),
};
