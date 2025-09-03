import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainRoutes from "./routes/MainRoutes";
import AuthProvider from './context/AuthContext';
import MainLayout from "./layout/MainLayout";
import "./styles/main.css";
import "./styles/layout-system.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: MainRoutes.children,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;