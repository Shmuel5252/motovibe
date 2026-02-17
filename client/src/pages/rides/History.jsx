import React, { useEffect, useMemo, useState } from "react";
import { getRideHistory } from "../../app/api/ridesApi.js";

import GlassCard from "../../app/ui/components/GlassCard.jsx";
import StatStrip from "../../app/ui/components/StatStrip.jsx";

function fmtDuration(seconds) {
  const s = Number(seconds);
  if (!Number.isFinite(s) || s < 0) return "--";
  const mm = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  if (mm < 60) return `${mm}m ${ss}s`;
  const hh = Math.floor(mm / 60);
  const rem = mm % 60;
  return `${hh}h ${rem}m`;
}

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d.toLocaleString() : "—";
}

export default function History() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rides, setRides] = useState([]);

  const totalRides = rides.length;
  const totalSeconds = rides.reduce((sum, r) => sum + (r.durationSeconds ?? 0), 0);
  const totalMinutes = Math.round(totalSeconds / 60);
  const avgSeconds = totalRides ? Math.round(totalSeconds / totalRides) : 0;

  const stats = useMemo(() => ([
    { icon: "🧾", value: String(totalRides), label: "Rides" },
    { icon: "⏱️", value: `${totalMinutes} min`, label: "Total time" },
    { icon: "📈", value: fmtDuration(avgSeconds), label: "Avg ride" },
  ]), [totalRides, totalMinutes, avgSeconds]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getRideHistory();
        if (!cancelled) setRides(data.rides ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="mv-muted">Loading…</div>;

  return (
    <div className="mv-page">
      <div className="mv-page__title">
        <h1 className="mv-h1">History</h1>
        <p className="mv-subtitle">Your past rides, summarized and clean.</p>
      </div>

      <div className="mv-section">
        <h2 className="mv-h2">Summary</h2>
        <StatStrip items={stats} />
      </div>

      {error ? <div className="mv-error">{error}</div> : null}

      {!error && rides.length === 0 ? (
        <div className="mv-muted">No rides yet.</div>
      ) : null}

      {!error && rides.length > 0 ? (
        <div className="mv-grid">
          {rides.map((r) => {
            const title = r.routeSnapshot?.title ?? "Ride";
            const duration = fmtDuration(r.durationSeconds ?? 0);

            // common fields (depends on server payload)
            const startedAt = r.startedAt || r.startTime || r.createdAt || null;

            return (
              <GlassCard key={r._id} className="mv-historyCard">
                <div className="mv-mapPreview mv-mapPreview--history" aria-hidden="true">
                  <div className="mv-mapPreview__line" />
                </div>

                <div className="mv-historyCard__content">
                  <div className="mv-historyCard__left">
                    <div className="mv-historyCard__title">{title}</div>
                    <div className="mv-historyCard__meta mv-muted">
                      {fmtDate(startedAt)} · {duration}
                    </div>
                  </div>

                  <div className="mv-historyCard__right">
                    <span className="mv-badge mv-badge--soft">Done</span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
