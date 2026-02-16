import React, { useEffect, useState } from "react";
import { createRoute, deleteRoute, listRoutes } from "../../app/api/routesApi.js";
import { Link } from "react-router-dom";



function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : NaN;
}

export default function RoutesList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [routes, setRoutes] = useState([]);

    const [deletingId, setDeletingId] = useState("");


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


    return (
        <div>
            <h1>Routes</h1>

            <h2>Create route</h2>
            <form onSubmit={onCreate} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
                <label>
                    Title
                    <input name="title" value={form.title} onChange={onChange} required />
                </label>

                <label>
                    Start lat
                    <input name="startLat" value={form.startLat} onChange={onChange} required />
                </label>

                <label>
                    Start lng
                    <input name="startLng" value={form.startLng} onChange={onChange} required />
                </label>

                <label>
                    Start label (optional)
                    <input name="startLabel" value={form.startLabel} onChange={onChange} />
                </label>

                <label>
                    End lat
                    <input name="endLat" value={form.endLat} onChange={onChange} required />
                </label>

                <label>
                    End lng
                    <input name="endLng" value={form.endLng} onChange={onChange} required />
                </label>

                <label>
                    End label (optional)
                    <input name="endLabel" value={form.endLabel} onChange={onChange} />
                </label>

                <button type="submit" disabled={creating}>
                    {creating ? "Creating…" : "Create"}
                </button>

                {createError ? <p style={{ color: "crimson" }}>{createError}</p> : null}
            </form>

            <hr />

            {loading ? <div>Loading routes…</div> : null}

            {!loading && error ? (
                <p style={{ color: "crimson" }}>{error}</p>
            ) : null}

            {!loading && !error && routes.length === 0 ? (
                <p>No routes yet.</p>
            ) : null}

            {!loading && !error && routes.length > 0 ? (
                <ul>
                    {routes.map((r) => (
                        <li key={r._id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <Link to={`/routes/${r._id}`}>{r.title ?? "Untitled route"}</Link>


                            <button onClick={() => onDelete(r._id)} disabled={deletingId === r._id}>
                                {deletingId === r._id ? "Deleting…" : "Delete"}
                            </button>
                        </li>
                    ))}
                </ul>

            ) : null}
        </div>
    );
}
