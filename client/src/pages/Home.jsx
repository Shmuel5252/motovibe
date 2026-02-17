import React, { useEffect } from "react";
import { useAuth } from "../app/state/useAuth.js";
import { hydrate, logout } from "../app/state/authStore.js";

import GlassCard from "../app/ui/components/GlassCard.jsx";
import ButtonPrimary from "../app/ui/components/ButtonPrimary.jsx";
import ButtonDanger from "../app/ui/components/ButtonDanger.jsx";
import StatStrip from "../app/ui/components/StatStrip.jsx";

export default function Home() {
  const auth = useAuth();

  useEffect(() => {
    hydrate();
  }, []);

  const isAuthed = auth.status === "authenticated";

  // UI placeholders (Post-MVP visuals) — no logic changes
  const weeklyStats = [
    { icon: "🪖", value: "12", label: "Rides" },
    { icon: "⏱️", value: "8h 45m", label: "Time" },
    { icon: "📍", value: "265 km", label: "Distance" },
  ];

  return (
    <div className="mv-page">
      <div className="mv-page__title">
        <h1 className="mv-h1">Dashboard</h1>
        <p className="mv-subtitle">Your rides. Your routes. Your vibe.</p>
      </div>

      {/* Active Ride Card (placeholder UI for now) */}
      <GlassCard
        className="mv-card--hero"
        title="Active Ride"
        subtitle={isAuthed ? "Ready when you are" : "Login to start riding"}
        right={<span className="mv-badge mv-badge--teal">Live</span>}
      >
        <div className="mv-hero">
          <div className="mv-timer">00:12:43</div>

          <div className="mv-hero__actions">
            <ButtonPrimary disabled={!isAuthed}>Resume</ButtonPrimary>
            <ButtonDanger disabled={!isAuthed}>End</ButtonDanger>
          </div>
        </div>
      </GlassCard>

      {/* Weekly stats */}
      <div className="mv-section">
        <h2 className="mv-h2">Weekly Stats</h2>
        <StatStrip items={weeklyStats} />
      </div>

      {/* Quick actions */}
      <div className="mv-section">
        <h2 className="mv-h2">Quick Actions</h2>
        <div className="mv-actions">
          <ButtonPrimary disabled={!isAuthed}>Start Ride</ButtonPrimary>
          <button className="mv-btn mv-btn--ghost" type="button" disabled={!isAuthed}>
            Routes
          </button>
          <button className="mv-btn mv-btn--ghost" type="button" disabled={!isAuthed}>
            History
          </button>
        </div>
      </div>

      {/* Popular / Recent routes (placeholder cards) */}
      <div className="mv-section">
        <h2 className="mv-h2">Popular Routes</h2>

        <div className="mv-grid">
          {[
            { title: "Coastal Ride", meta: "42 km • 58 min • Moderate" },
            { title: "Forest Hills", meta: "38 km • 50 min • Easy" },
            { title: "Mountain Pass", meta: "55 km • 1h 15m • Challenging" },
          ].map((r) => (
            <GlassCard key={r.title} className="mv-routeCard">
              <div className="mv-mapPreview" aria-hidden="true">
                <div className="mv-mapPreview__line" />
              </div>

              <div className="mv-routeCard__content">
                <div>
                  <div className="mv-routeCard__title">{r.title}</div>
                  <div className="mv-routeCard__meta mv-muted">{r.meta}</div>
                </div>

                <button className="mv-btn mv-btn--small mv-btn--primarySoft" type="button" disabled={!isAuthed}>
                  View
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Debug section kept (but styled + collapsed) */}
      <GlassCard className="mv-debug" title="Auth Debug" subtitle="Temporary (MVP)">
        <ul className="mv-list">
          <li>
            <b>Status:</b> {auth.status}
          </li>
          <li>
            <b>Has token:</b> {auth.token ? "yes" : "no"}
          </li>
          <li>
            <b>User:</b> {auth.user ? "yes" : "no"}
          </li>
        </ul>

        <div style={{ marginTop: 12 }}>
          <ButtonDanger onClick={logout} disabled={!isAuthed}>
            Logout (debug)
          </ButtonDanger>
        </div>
      </GlassCard>
    </div>
  );
}
