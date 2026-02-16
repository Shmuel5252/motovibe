import React, { useEffect, useState } from "react";
import { getActiveRide, startRide, stopRide } from "../../app/api/ridesApi.js";
import { listRoutes } from "../../app/api/routesApi.js";

export default function RideActive() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [active, setActive] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState("");

  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);

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
        const [activeData, routesData] = await Promise.all([
          getActiveRide(),
          listRoutes(),
        ]);

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

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h1>Ride Active</h1>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {active ? (
        <div>
          <h2>Active ride</h2>
          <ul>
            <li><b>Route:</b> {active.routeSnapshot?.title ?? "—"}</li>
            <li><b>Started:</b> {active.startedAt ? new Date(active.startedAt).toLocaleString() : "—"}</li>
          </ul>

          <button onClick={onStop} disabled={stopping}>
            {stopping ? "Stopping…" : "Stop ride"}
          </button>
        </div>
      ) : (
        <div>
          <h2>No active ride</h2>

          {routes.length === 0 ? (
            <p>Create a route first.</p>
          ) : (
            <form onSubmit={onStart} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
              <label>
                Choose route
                <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                  {routes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title ?? "Untitled route"}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" disabled={starting}>
                {starting ? "Starting…" : "Start ride"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
