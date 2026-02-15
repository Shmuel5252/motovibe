import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { hydrate } from "../state/authStore.js";
import { useAuth } from "../state/useAuth.js";

export default function PublicOnlyLayout() {
  const auth = useAuth();

  useEffect(() => {
    hydrate();
  }, []);

  if (auth.status === "unknown") {
    return <div>Loading…</div>;
  }

  if (auth.status === "authenticated") {
    return <Navigate to="/routes" replace />;
  }

  return <Outlet />;
}
