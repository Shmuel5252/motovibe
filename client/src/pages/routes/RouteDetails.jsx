import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRoute } from "../../app/api/routesApi.js";

import GlassCard from "../../app/ui/components/GlassCard.jsx";
import StatStrip from "../../app/ui/components/StatStrip.jsx";
import ButtonPrimary from "../../app/ui/components/ButtonPrimary.jsx";

function fmtNum(n, suffix = "") {
  const x = Number(n);
  return Number.isFinite(x) ? `${x}${suffix}` : "--";
}

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

  const title = route?.title ?? "Untitled route";
  const fromLabel = route?.start?.label || "Start";
  const toLabel = route?.end?.label || "End";

  const stats = [
    { icon: "📍", value: route?.distanceKm != null ? `${Number(route.distanceKm).toFixed(1)} km` : "-- km", label: "Distance" },
    { icon: "⏱️", value: route?.etaMinutes != null ? `${Math.round(Number(route.etaMinutes))} min` : "-- min", label: "ETA" },
    { icon: "🔒", value: route?.visibility ?? "—", label: "Visibility" },
  ];

  return (
    <div className="mv-page">
      <div className="mv-page__title">
        <h1 className="mv-h1">Route Details</h1>
        <p className="mv-subtitle">Preview and stats (Map is placeholder for now).</p>
      </div>

      <div className="mv-row">
        <Link className="mv-btn mv-btn--ghost mv-btn--small" to="/routes">
          ← Back
        </Link>

        {/* UI-only placeholder: Start Ride wiring will come when we style Ride flow */}
        <ButtonPrimary type="button" disabled>
          Start Ride
        </ButtonPrimary>
      </div>

      {loading ? <div className="mv-muted">Loading…</div> : null}
      {!loading && error ? <div className="mv-error">{error}</div> : null}
      {!loading && !error && !route ? <div className="mv-muted">Not found.</div> : null}

      {!loading && !error && route ? (
        <>
          <GlassCard className="mv-detailsHero" title={title} subtitle={`${fromLabel} → ${toLabel}`}>
            <div className="mv-mapPreview mv-mapPreview--big" aria-hidden="true">
              <div className="mv-mapPreview__line" />
              <div className="mv-mapPreview__pins">
                <span className="mv-pin mv-pin--start" title="Start" />
                <span className="mv-pin mv-pin--end" title="End" />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <StatStrip items={stats} />
            </div>
          </GlassCard>

          <div className="mv-grid">
            <GlassCard title="Start" subtitle={fromLabel}>
              <div className="mv-kv">
                <div className="mv-kv__k">Lat</div>
                <div className="mv-kv__v">{fmtNum(route?.start?.lat)}</div>
              </div>
              <div className="mv-kv">
                <div className="mv-kv__k">Lng</div>
                <div className="mv-kv__v">{fmtNum(route?.start?.lng)}</div>
              </div>
            </GlassCard>

            <GlassCard title="End" subtitle={toLabel}>
              <div className="mv-kv">
                <div className="mv-kv__k">Lat</div>
                <div className="mv-kv__v">{fmtNum(route?.end?.lat)}</div>
              </div>
              <div className="mv-kv">
                <div className="mv-kv__k">Lng</div>
                <div className="mv-kv__v">{fmtNum(route?.end?.lng)}</div>
              </div>
            </GlassCard>
          </div>
        </>
      ) : null}
    </div>
  );
}
