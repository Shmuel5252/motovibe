import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRoute } from "../../app/api/routesApi.js";

export default function RouteDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [route, setRoute] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getRoute(id);
        const r = data?.route ?? data ?? null;
        if (!cancelled) setRoute(r);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load route");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <h1>Route Details</h1>
      <p>
        <Link to="/routes">← Back to Routes</Link>
      </p>

      {loading ? <div>Loading…</div> : null}
      {!loading && error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {!loading && !error && !route ? <p>Not found.</p> : null}

      {!loading && !error && route ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div><b>Title:</b> {route.title ?? "—"}</div>
          <div><b>Start:</b> {route.start?.lat}, {route.start?.lng}</div>
          <div><b>End:</b> {route.end?.lat}, {route.end?.lng}</div>
          {route.distanceKm != null ? <div><b>Distance:</b> {route.distanceKm} km</div> : null}
          {route.etaMinutes != null ? <div><b>ETA:</b> {route.etaMinutes} min</div> : null}
        </div>
      ) : null}
    </div>
  );
}
