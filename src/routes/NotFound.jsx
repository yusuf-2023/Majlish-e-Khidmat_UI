import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// ==============================|| 404 - NOT FOUND ||============================== //

const NotFound = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { state, pathname } = useLocation();
  const requestedPath = state?.from?.pathname || pathname;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          textAlign: "center",
          background: "rgba(255,255,255,0.9)",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 12,
            background: "linear-gradient(45deg,#16a34a,#22c55e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </div>
        <h2 style={{ margin: 0, marginBottom: 8, color: "#111827" }}>
          Sorry, page not found!
        </h2>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>
          We couldn&apos;t find the page you&apos;re looking for. Please check
          the URL or go back.
        </p>

        {requestedPath !== "/not-found" && (
          <div
            style={{
              margin: "12px 0",
              padding: 12,
              border: "1px solid #fecaca",
              background: "#fee2e2",
              borderRadius: 8,
              color: "#991b1b",
            }}
          >
            Requested path: {requestedPath}
          </div>
        )}

        <div style={{ height: 1, background: "#e5e7eb", margin: "16px 0" }} />

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleGoBack}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #16a34a",
              background: "transparent",
              color: "#16a34a",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>

          <RouterLink
            to={role ? "/" : "/auth/login"}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              background: "#16a34a",
              color: "white",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {role ? "Home" : "Login"}
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

// Optional: place an illustration here if desired
