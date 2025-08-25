import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }) {
  const { role, loading } = useAuth();
  const location = useLocation();

  // Get returnTo from query parameters
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo");
  const redirectPath = returnTo ? decodeURIComponent(returnTo) : "/dashboard";

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

  // Redirect to dashboard if authenticated
  if (role) return <Navigate to={redirectPath} replace />;

  return children;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};
