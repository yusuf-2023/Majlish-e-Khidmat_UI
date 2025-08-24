// // import React from "react";
// // import { Navigate } from "react-router-dom";

// // const AdminRoute = ({ children }) => {
// //   const userRole = localStorage.getItem("userRole");

// //   if (userRole && userRole.toUpperCase() === "ROLE_ADMIN") {
// //     return children;
// //   } else {
// //     return <Navigate to="/admin/login" replace />;
// //   }
// // };

// // export default AdminRoute;





// // // majlishekhidmat-frontend\src\routes\AdminRoute.jsx
// // import React, { useContext } from "react";
// // import { Navigate } from "react-router-dom";
// // import { AuthContext } from "../context/AuthContext";

// // const AdminRoute = ({ children }) => {
// //   const { role, loading } = useContext(AuthContext);

// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (role !== "ADMIN") {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return children;
// // };

// // export default AdminRoute;




//ye kam kar rha hai
// // majlishekhidmat-frontend/src/routes/AdminRoute.jsx
// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const AdminRoute = ({ children }) => {
//   const { role, loading } = useContext(AuthContext);

//   // Jab tak role loading me hai, wait karo
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Agar role null hai ya ADMIN nahi hai to redirect karo
//   if (!role || role !== "ADMIN") {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default AdminRoute;





// src/routes/AdminRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { role, loading } = useContext(AuthContext);

  // Jab tak role loading me hai, wait karo
  if (loading) {
    return <div>Loading...</div>;
  }

  // Agar role null hai ya ADMIN nahi hai to redirect karo
  if (!role || role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
