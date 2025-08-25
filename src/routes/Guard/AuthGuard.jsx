import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }) {
  const { role, loading } = useAuth();
  const location = useLocation();

  // Show loader while authentication is being initialized
  if (loading) {
    return (
      <div
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!role) {
    const currentPath = `${location.pathname}${location.search}`;
    const encodedReturnTo = encodeURIComponent(currentPath);
    return <Navigate to={`/auth/login?returnTo=${encodedReturnTo}`} replace />;
  }

  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
