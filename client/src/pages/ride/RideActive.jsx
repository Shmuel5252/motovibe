import React, { useEffect, useMemo, useState } from "react";
import { getActiveRide, startRide, stopRide } from "../../app/api/ridesApi.js";
import { listRoutes } from "../../app/api/routesApi.js";

import GlassCard from "../../app/ui/components/GlassCard.jsx";
import ButtonPrimary from "../../app/ui/components/ButtonPrimary.jsx";
import ButtonDanger from "../../app/ui/components/ButtonDanger.jsx";
import StatStrip from "../../app/ui/components/StatStrip.jsx";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatHMS(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
}

export default function RideActive() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [active, setActive] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState("");

  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);

  const [now, setNow] = useState(Date.now());

  async function refreshActive() {
    const data = await getActiveRide();
    setActive(data.ride);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const [activeData, routesData] = await Promise.all([getActiveRide(), listRoutes()]);
        const items = Array.isArray(routesData) ? routesData : (routesData?.routes ?? []);

        if (cancelled) return;
        setActive(activeData.ride);
        setRoutes(items);
        setRouteId(items[0]?._id ?? "");
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load ride data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Timer tick only when active ride exists
  useEffect(() => {
    if (!active?.startedAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active?.startedAt]);

  async function onStart(e) {
    e.preventDefault();
    if (!routeId) {
      setError("Pick a route first");
      return;
    }

    setStarting(true);
    setError("");
    try {
      await startRide(routeId);
      await refreshActive();
    } catch (err) {
      setError(err.message || "Failed to start ride");
    } finally {
      setStarting(false);
    }
  }

  async function onStop() {
    setStopping(true);
    setError("");
    try {
      await stopRide();
      await refreshActive();
    } catch (err) {
      setError(err.message || "Failed to stop ride");
    } finally {
      setStopping(false);
    }
  }

  const startedAtMs = useMemo(() => {
    const d = active?.startedAt ? new Date(active.startedAt).getTime() : null;
    return Number.isFinite(d) ? d : null;
  }, [active?.startedAt]);

  const elapsedMs = startedAtMs ? now - startedAtMs : 0;
  const timerText = startedAtMs ? formatHMS(elapsedMs) : "00:00:00";

  const routeTitle = active?.routeSnapshot?.title ?? "—";

  // UI placeholders for live stats (we're not changing server payload now)
  const stats = [
    { icon: "📍", value: active?.routeSnapshot?.distanceKm != null ? `${Number(active.routeSnapshot.distanceKm).toFixed(1)} km` : "-- km", label: "Distance" },
    { icon: "⏱️", value: timerText, label: "Duration" },
    { icon: "⚡", value: "-- km/h", label: "Avg speed" },
  ];

  if (loading) return <div className="mv-muted">Loading…</div>;

  return (
    <div className="mv-page">
      <div className="mv-page__title">
        <h1 className="mv-h1">Ride</h1>
        <p className="mv-subtitle">Focus mode. Minimal UI. Premium feel.</p>
      </div>

      {error ? <div className="mv-error">{error}</div> : null}

      {active ? (
        <div className="mv-ride">
          {/* Background map placeholder (visual only) */}
          <div className="mv-ride__bg" aria-hidden="true">
            <div className="mv-ride__bgLine" />
          </div>

          <GlassCard
            className="mv-rideCard"
            title="Active Ride"
            subtitle={routeTitle}
            right={<span className="mv-badge mv-badge--teal">LIVE</span>}
          >
            <div className="mv-rideCard__timer">{timerText}</div>

            <div style={{ marginTop: 12 }}>
              <StatStrip items={stats} />
            </div>

            <div className="mv-rideCard__actions">
              <ButtonDanger onClick={onStop} disabled={stopping}>
                {stopping ? "Stopping…" : "Stop ride"}
              </ButtonDanger>
            </div>

            <div className="mv-muted" style={{ marginTop: 10, fontSize: 12 }}>
              Started: {active.startedAt ? new Date(active.startedAt).toLocaleString() : "—"}
            </div>
          </GlassCard>
        </div>
      ) : (
        <GlassCard title="No active ride" subtitle="Start a ride from one of your routes">
          {routes.length === 0 ? (
            <div className="mv-muted">Create a route first.</div>
          ) : (
            <form onSubmit={onStart} className="mv-form">
              <div className="mv-field">
                <label className="mv-label">Choose route</label>
                <select
                  className="mv-select"
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                >
                  {routes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title ?? "Untitled route"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mv-form__actions">
                <ButtonPrimary type="submit" disabled={starting}>
                  {starting ? "Starting…" : "Start ride"}
                </ButtonPrimary>
                <div className="mv-muted" style={{ fontSize: 12 }}>
                  Tip: You can also start from Routes list.
                </div>
              </div>
            </form>
          )}
        </GlassCard>
      )}
    </div>
  );
}
