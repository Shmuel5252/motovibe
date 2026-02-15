import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const TOKEN_KEY = "motovibe_token";

export default function ProtectedLayout() {
  const location = useLocation();
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
