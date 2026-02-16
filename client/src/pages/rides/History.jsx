import React, { useEffect, useState } from "react";
import { getRideHistory } from "../../app/api/ridesApi.js";

export default function History() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [rides, setRides] = useState([]);

    const totalRides = rides.length;
    const totalSeconds = rides.reduce((sum, r) => sum + (r.durationSeconds ?? 0), 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    const avgSeconds = totalRides ? Math.round(totalSeconds / totalRides) : 0;


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

    if (loading) return <div>Loading…</div>;

    return (
        <div>
            <h1>Ride History</h1>

            <div style={{ marginBottom: 12 }}>
                <b>Stats:</b>{" "}
                {totalRides} rides • {totalSeconds}s (~{totalMinutes}m) • avg {avgSeconds}s
            </div>


            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            {!error && rides.length === 0 ? <p>No rides yet.</p> : null}

            {!error && rides.length > 0 ? (
                <ul>
                    {rides.map((r) => (
                        <li key={r._id}>
                            <b>{r.routeSnapshot?.title ?? "Ride"}</b>{" "}
                            — {r.durationSeconds ?? 0}s
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
