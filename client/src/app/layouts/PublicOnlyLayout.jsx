import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const TOKEN_KEY = "motovibe_token";

export default function PublicOnlyLayout() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    return <Navigate to="/routes" replace />;
  }

  return <Outlet />;
}
