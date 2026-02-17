import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../state/useAuth.js";
import { logout } from "../state/authStore.js";
import BottomNav from "../ui/components/BottomNav.jsx";

export default function AppShell() {
  const auth = useAuth();
  const isAuthed = auth.status === "authenticated";

  return (
    <div className="mv-app">
      <header className="mv-header">
        <div className="mv-header__brand">
          <span className="mv-logo-dot" aria-hidden="true" />
          <span className="mv-header__title">MotoVibe</span>
        </div>

        <div className="mv-header__actions">
          {isAuthed ? (
            <button className="mv-header__icon" type="button" onClick={logout}>
              Logout
            </button>
          ) : (
            <div className="mv-header__authlinks">
              <Link className="mv-link" to="/auth/login">Login</Link>
              <Link className="mv-link" to="/auth/register">Register</Link>
            </div>
          )}
        </div>
      </header>

      {/* Optional: top links for desktop/testing (keep, but styled). */}
      {isAuthed && (
        <nav className="mv-topnav" aria-label="Top navigation">
          <Link className="mv-link" to="/">Home</Link>
          <Link className="mv-link" to="/routes">Routes</Link>
          <Link className="mv-link" to="/ride/active">Ride</Link>
          <Link className="mv-link" to="/rides/history">History</Link>
        </nav>
      )}

      <main className="mv-main">
        <Outlet />
      </main>

      {isAuthed && <BottomNav />}
    </div>
  );
}
