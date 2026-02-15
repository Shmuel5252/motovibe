import React, { useEffect } from "react";
import { useAuth } from "../app/state/useAuth.js";
import { hydrate, logout } from "../app/state/authStore.js";

export default function Home() {
  const auth = useAuth();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <div>
      <h1>MotoVibe</h1>

      <h2>Auth Debug</h2>
      <ul>
        <li>
          <b>Status:</b> {auth.status}
        </li>
        <li>
          <b>Has token:</b> {auth.token ? "yes" : "no"}
        </li>
        <li>
          <b>User:</b> {auth.user ? "yes" : "no"}
        </li>
      </ul>

      <button onClick={logout}>Logout (debug)</button>
    </div>
  );
}
