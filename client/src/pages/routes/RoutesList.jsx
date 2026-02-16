import React, { useEffect, useState } from "react";
import { listRoutes } from "../../app/api/routesApi.js";

export default function RoutesList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");

      try {
        const data = await listRoutes();

        const items = Array.isArray(data) ? data : (data?.routes ?? []);
        if (!cancelled) setRoutes(items);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load routes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div>Loading routes…</div>;

  if (error) {
    return (
      <div>
        <h1>Routes</h1>
        <p style={{ color: "crimson" }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Routes</h1>

      {routes.length === 0 ? (
        <p>No routes yet.</p>
      ) : (
        <ul>
          {routes.map((r) => (
            <li key={r._id}>
              <b>{r.name ?? "Untitled route"}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
