import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hydrate } from "../state/authStore.js";
import { useAuth } from "../state/useAuth.js";

export default function ProtectedLayout() {
  const location = useLocation();
  const auth = useAuth();

  useEffect(() => {
    hydrate();
  }, []);

  if (auth.status === "unknown") {
    return <div>Loading…</div>;
  }

  if (auth.status !== "authenticated") {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
