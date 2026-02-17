import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../app/api/authApi.js";
import { setAuth } from "../../app/state/authStore.js";

import GlassCard from "../../app/ui/components/GlassCard.jsx";
import ButtonPrimary from "../../app/ui/components/ButtonPrimary.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register({ name, email, password });
      setAuth({ token: data.token, user: data.user });
      // 🔒 no redirect here (layouts handle)
    } catch (err) {
      setError(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mv-auth">
      <div className="mv-auth__brand">
        <span className="mv-logo-dot" aria-hidden="true" />
        <div>
          <div className="mv-auth__title">MotoVibe</div>
          <div className="mv-auth__subtitle mv-muted">Create your rider profile</div>
        </div>
      </div>

      <GlassCard title="Register" subtitle="Get started in 30 seconds">
        <form onSubmit={onSubmit} className="mv-form">
          <div className="mv-field">
            <label className="mv-label">Name</label>
            <input
              className="mv-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </div>

          <div className="mv-field">
            <label className="mv-label">Email</label>
            <input
              className="mv-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="mv-field">
            <label className="mv-label">Password</label>
            <input
              className="mv-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
              placeholder="Create a password"
            />
          </div>

          {error ? <div className="mv-error">{error}</div> : null}

          <div className="mv-auth__actions">
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? "Loading…" : "Create account"}
            </ButtonPrimary>

            <div className="mv-auth__hint mv-muted">
              Already have an account?{" "}
              <Link className="mv-link" to="/auth/login">
                Login
              </Link>
            </div>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
