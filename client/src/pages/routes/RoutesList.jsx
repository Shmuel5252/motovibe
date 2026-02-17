import React, { useEffect, useState } from "react";
import { createRoute, deleteRoute, listRoutes } from "../../app/api/routesApi.js";
import { Link } from "react-router-dom";
import { startRide } from "../../app/api/ridesApi.js";

import GlassCard from "../../app/ui/components/GlassCard.jsx";
import ButtonPrimary from "../../app/ui/components/ButtonPrimary.jsx";
import ButtonDanger from "../../app/ui/components/ButtonDanger.jsx";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function routeMeta(r) {
  const fromLabel = r?.start?.label || "Start";
  const toLabel = r?.end?.label || "End";
  const distance = Number.isFinite(Number(r?.distanceKm)) ? `${Number(r.distanceKm).toFixed(1)} km` : "-- km";
  const eta = Number.isFinite(Number(r?.etaMinutes)) ? `${Math.round(Number(r.etaMinutes))} min` : "-- min";
  return { fromLabel, toLabel, distance, eta };
}

export default function RoutesList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [routes, setRoutes] = useState([]);
  const [deletingId, setDeletingId] = useState("");

  const [startRideMsg, setStartRideMsg] = useState("");
  const [startingId, setStartingId] = useState("");

  const [form, setForm] = useState({
    title: "",
    startLat: "",
    startLng: "",
    endLat: "",
    endLng: "",
    startLabel: "",
    endLabel: "",
  });

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      const data = await listRoutes();
      const items = Array.isArray(data) ? data : (data?.routes ?? []);
      setRoutes(items);
    } catch (err) {
      setError(err.message || "Failed to load routes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await listRoutes();
        const items = Array.isArray(data) ? data : (data?.routes ?? []);
        if (!cancelled) setRoutes(items);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load routes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onCreate(e) {
    e.preventDefault();
    setCreateError("");
    setStartRideMsg("");

    const startLat = toNumber(form.startLat);
    const startLng = toNumber(form.startLng);
    const endLat = toNumber(form.endLat);
    const endLng = toNumber(form.endLng);

    if (!form.title || form.title.trim().length < 2) {
      setCreateError("Title must be at least 2 characters");
      return;
    }

    if (!Number.isFinite(startLat) || !Number.isFinite(startLng)) {
      setCreateError("Start lat/lng must be valid numbers");
      return;
    }

    if (!Number.isFinite(endLat) || !Number.isFinite(endLng)) {
      setCreateError("End lat/lng must be valid numbers");
      return;
    }

    const payload = {
      title: form.title.trim(),
      start: { lat: startLat, lng: startLng, label: form.startLabel?.trim() || undefined },
      end: { lat: endLat, lng: endLng, label: form.endLabel?.trim() || undefined },
    };

    setCreating(true);
    try {
      await createRoute(payload);

      setForm({
        title: "",
        startLat: "",
        startLng: "",
        endLat: "",
        endLng: "",
        startLabel: "",
        endLabel: "",
      });

      await refresh();
    } catch (err) {
      setCreateError(err.message || "Failed to create route");
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id) {
    setError("");
    setCreateError("");
    setStartRideMsg("");
    setDeletingId(id);

    try {
      await deleteRoute(id);
      await refresh();
    } catch (err) {
      setError(err.message || "Failed to delete route");
    } finally {
      setDeletingId("");
    }
  }

  async function onStartRide(id) {
    setError("");
    setCreateError("");
    setStartRideMsg("");
    setStartingId(id);

    try {
      await startRide(id);
      setStartRideMsg("Ride started. Go to Ride Active.");
    } catch (err) {
      setError(err.message || "Failed to start ride");
    } finally {
      setStartingId("");
    }
  }

  const busy = creating || deletingId !== "";

  return (
    <div className="mv-page">
      <div className="mv-page__title">
        <h1 className="mv-h1">Routes</h1>
        <p className="mv-subtitle">Manage your routes. Start a ride in one tap.</p>
      </div>

      {startRideMsg ? (
        <GlassCard className="mv-info" title="Ride started" subtitle={startRideMsg} right={<Link className="mv-link" to="/ride/active">Open</Link>}>
          <div className="mv-muted">You can continue from the Ride tab anytime.</div>
        </GlassCard>
      ) : null}

      {/* Create Route */}
      <GlassCard title="Create route" subtitle="Coordinates + optional labels (MVP)">
        <form onSubmit={onCreate} className="mv-form">
          <div className="mv-field">
            <label className="mv-label">Title</label>
            <input className="mv-input" name="title" value={form.title} onChange={onChange} required />
          </div>

          <div className="mv-grid2">
            <div className="mv-field">
              <label className="mv-label">Start lat</label>
              <input className="mv-input" name="startLat" value={form.startLat} onChange={onChange} required />
            </div>

            <div className="mv-field">
              <label className="mv-label">Start lng</label>
              <input className="mv-input" name="startLng" value={form.startLng} onChange={onChange} required />
            </div>
          </div>

          <div className="mv-field">
            <label className="mv-label">Start label (optional)</label>
            <input className="mv-input" name="startLabel" value={form.startLabel} onChange={onChange} />
          </div>

          <div className="mv-grid2">
            <div className="mv-field">
              <label className="mv-label">End lat</label>
              <input className="mv-input" name="endLat" value={form.endLat} onChange={onChange} required />
            </div>

            <div className="mv-field">
              <label className="mv-label">End lng</label>
              <input className="mv-input" name="endLng" value={form.endLng} onChange={onChange} required />
            </div>
          </div>

          <div className="mv-field">
            <label className="mv-label">End label (optional)</label>
            <input className="mv-input" name="endLabel" value={form.endLabel} onChange={onChange} />
          </div>

          <div className="mv-form__actions">
            <ButtonPrimary type="submit" disabled={creating || deletingId !== ""}>
              {creating ? "Creating…" : "Create"}
            </ButtonPrimary>
            <div className="mv-form__hint mv-muted">
              {createError ? <span className="mv-error">{createError}</span> : "Tip: Add labels for nicer cards."}
            </div>
          </div>
        </form>
      </GlassCard>

      {/* Routes list */}
      <div className="mv-section">
        <h2 className="mv-h2">Your routes</h2>

        {loading ? <div className="mv-muted">Loading routes…</div> : null}

        {!loading && error ? (
          <div className="mv-error">{error}</div>
        ) : null}

        {!loading && !error && routes.length === 0 ? (
          <div className="mv-muted">No routes yet. Create your first route above.</div>
        ) : null}

        {!loading && !error && routes.length > 0 ? (
          <div className="mv-grid">
            {routes.map((r) => {
              const meta = routeMeta(r);
              const isDeleting = deletingId === r._id;
              const isStarting = startingId === r._id;

              return (
                <GlassCard key={r._id} className="mv-routeCard">
                  <div className="mv-mapPreview" aria-hidden="true">
                    <div className="mv-mapPreview__line" />
                  </div>

                  <div className="mv-routeCard__content">
                    <div className="mv-routeCard__left">
                      <Link className="mv-routeCard__title mv-link" to={`/routes/${r._id}`}>
                        {r.title ?? "Untitled route"}
                      </Link>

                      <div className="mv-routeCard__meta mv-muted">
                        {meta.fromLabel} → {meta.toLabel} · {meta.distance} · {meta.eta}
                      </div>
                    </div>

                    <div className="mv-routeCard__actions">
                      <Link className="mv-btn mv-btn--small mv-btn--primarySoft" to={`/routes/${r._id}`}>
                        View
                      </Link>

                      <button
                        className="mv-btn mv-btn--small mv-btn--ghost"
                        type="button"
                        onClick={() => onStartRide(r._id)}
                        disabled={isStarting || busy}
                      >
                        {isStarting ? "Starting…" : "Start"}
                      </button>

                      <button
                        className="mv-btn mv-btn--small mv-btn--dangerSoft"
                        type="button"
                        onClick={() => onDelete(r._id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
