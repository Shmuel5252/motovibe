import React, { useEffect, useState } from "react";
import GlassCard from "../../app/ui/components/GlassCard.jsx";
import ButtonPrimary from "../../app/ui/components/ButtonPrimary.jsx";
import ButtonDanger from "../../app/ui/components/ButtonDanger.jsx";
import { createBike, listBikes } from "../../app/api/bikesApi.js";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

export default function Bike() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bikes, setBikes] = useState([]);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [form, setForm] = useState({
    name: "",
    make: "",
    model: "",
    year: "",
    odometer: "",
  });

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await listBikes();
      setBikes(data?.bikes ?? []);
    } catch (err) {
      setError(err.message || "Failed to load bikes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onCreate(e) {
    e.preventDefault();
    setCreateError("");

    if (!form.name || form.name.trim().length < 2) {
      setCreateError("Name must be at least 2 characters");
      return;
    }

    const year = form.year ? toNumber(form.year) : NaN;
    if (form.year && !Number.isFinite(year)) {
      setCreateError("Year must be a number");
      return;
    }

    const odometer = form.odometer ? toNumber(form.odometer) : NaN;
    if (form.odometer && !Number.isFinite(odometer)) {
      setCreateError("Odometer must be a number");
      return;
    }

    const payload = {
      name: form.name.trim(),
      make: form.make?.trim() || undefined,
      model: form.model?.trim() || undefined,
      year: form.year ? Math.round(year) : undefined,
      currentOdometerKm: form.odometer ? odometer : undefined,
    };

    setCreating(true);
    try {
      await createBike(payload);
      setForm({ name: "", make: "", model: "", year: "", odometer: "" });
      await refresh();
    } catch (err) {
      setCreateError(err.message || "Failed to create bike");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mv-page">
      <div className="mv-page__title">
        <h1 className="mv-h1">Garage</h1>
        <p className="mv-subtitle">Your bikes and maintenance status.</p>
      </div>

      <GlassCard title="Add Bike" subtitle="This will be used for maintenance alerts later">
        <form onSubmit={onCreate} className="mv-form">
          <label className="mv-field">
            <span className="mv-field__label">Name *</span>
            <input className="mv-input" name="name" value={form.name} onChange={onChange} required />
          </label>

          <div className="mv-grid2">
            <label className="mv-field">
              <span className="mv-field__label">Make</span>
              <input className="mv-input" name="make" value={form.make} onChange={onChange} />
            </label>

            <label className="mv-field">
              <span className="mv-field__label">Model</span>
              <input className="mv-input" name="model" value={form.model} onChange={onChange} />
            </label>
          </div>

          <div className="mv-grid2">
            <label className="mv-field">
              <span className="mv-field__label">Year</span>
              <input className="mv-input" name="year" value={form.year} onChange={onChange} inputMode="numeric" />
            </label>

            <label className="mv-field">
              <span className="mv-field__label">Odometer (km)</span>
              <input className="mv-input" name="odometer" value={form.odometer} onChange={onChange} inputMode="numeric" />
            </label>
          </div>

          <div className="mv-row" style={{ marginTop: 10 }}>
            <ButtonPrimary type="submit" disabled={creating}>
              {creating ? "Saving…" : "Save Bike"}
            </ButtonPrimary>
          </div>

          {createError ? <p className="mv-error">{createError}</p> : null}
        </form>
      </GlassCard>

      <div className="mv-section">
        <h2 className="mv-h2">My Bikes</h2>

        {loading ? <div className="mv-muted">Loading…</div> : null}
        {!loading && error ? <p className="mv-error">{error}</p> : null}

        {!loading && !error && bikes.length === 0 ? (
          <GlassCard>
            <div className="mv-muted">No bikes yet. Add your first bike above.</div>
          </GlassCard>
        ) : null}

        {!loading && !error && bikes.length > 0 ? (
          <div className="mv-grid">
            {bikes.map((b) => (
              <GlassCard key={b._id} className="mv-bikeCard" title={b.name} subtitle={`${b.make ?? "—"} ${b.model ?? ""}`.trim()}>
                <div className="mv-kv">
                  <div className="mv-kv__item">
                    <div className="mv-kv__label mv-muted">Odometer</div>
                    <div className="mv-kv__value">{b.currentOdometerKm ?? 0} km</div>
                  </div>
                  <div className="mv-kv__item">
                    <div className="mv-kv__label mv-muted">Year</div>
                    <div className="mv-kv__value">{b.year ?? "—"}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <ButtonDanger type="button" disabled title="Delete later (Post-MVP polish)">
                    Delete (later)
                  </ButtonDanger>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
