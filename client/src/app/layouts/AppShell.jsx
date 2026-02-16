import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../state/useAuth.js";
import { logout } from "../state/authStore.js";

export default function AppShell() {
  const auth = useAuth();

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <Link to="/">Home</Link>

        {auth.status === "authenticated" ? (
          <>
            <Link to="/routes">Routes</Link>
            <Link to="/ride/active">Ride Active</Link>
            <Link to="/rides/history">History</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/register">Register</Link>
          </>
        )}
      </nav>

      <hr style={{ marginBottom: 12 }} />

      <Outlet />
    </div>
  );
}
