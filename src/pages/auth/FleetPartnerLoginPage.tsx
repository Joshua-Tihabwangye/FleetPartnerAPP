import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../utils/auth";
import { clearAuthPrefillPassword, readAuthPrefill, saveAuthPrefill } from "../../utils/authPrefill";
import "./FleetPartnerLoginPage.css";

export default function FleetPartnerLoginPage() {
  const prefill = React.useMemo(() => readAuthPrefill(), []);
  const [email, setEmail] = useState(prefill.email || prefill.identity || "");
  const [password, setPassword] = useState(prefill.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (email && password) {
      try {
        const normalizedEmail = email.trim().toLowerCase();
        const authState = await auth.login(normalizedEmail, password);
        saveAuthPrefill({ email: normalizedEmail, identity: normalizedEmail });
        clearAuthPrefillPassword();
        const from =
          location.state?.from?.pathname
          || (authState.hasFinishedOnboarding ? "/dashboard" : "/setup/fleet-partner-profile");
        navigate(from, { replace: true });
      } catch (loginError) {
        const message =
          loginError instanceof Error ? loginError.message : "Unable to sign in. Please try again.";
        setError(message);
      }
    } else {
      setError("Please enter both email and password");
    }
  };

  return (
    <div className="fleet-login-page">
      <main className="fleet-login-shell">
        <section className="fleet-login-left">
          <div className="fleet-login-brand">
            <div className="fleet-login-logo-icon">EV</div>
            <div>
              <h2>EVZone</h2>
              <p>Fleet Partner</p>
            </div>
          </div>

          <div className="fleet-login-hero-copy">
            <h1>
              Grow your fleet with <span>EVZone</span>
            </h1>
            <p>
              Register your fleet and manage rides, drivers, and services from one platform.
            </p>
          </div>

          <div className="fleet-login-feature-row">
            <div className="fleet-login-feature">
              <div className="fleet-login-feature-icon">🚘</div>
              <span>Smart Rides</span>
            </div>
            <div className="fleet-login-feature">
              <div className="fleet-login-feature-icon">⚡</div>
              <span>Electric Future</span>
            </div>
            <div className="fleet-login-feature">
              <div className="fleet-login-feature-icon">🌿</div>
              <span>Sustainable Tomorrow</span>
            </div>
          </div>

          <div className="fleet-login-illustration-wrap">
            <img
              src="/Fleet1.png"
              alt="EV car charging illustration"
              className="fleet-login-illustration"
            />
          </div>
        </section>

        <div className="fleet-login-divider" />

        <section className="fleet-login-right">
          <Link to="/" className="fleet-login-backlink">
            ← Back to Home
          </Link>

          <h1 className="fleet-login-title">Welcome back</h1>
          <p className="fleet-login-subtitle">Sign in to access your fleet dashboard</p>

          <form onSubmit={handleSubmit} className="fleet-login-form">
            {error ? <div className="fleet-login-error">{error}</div> : null}

            <label className="fleet-login-form-group">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fleet-login-control"
                placeholder="you@company.com"
                required
              />
            </label>

            <label className="fleet-login-form-group">
              <span>Password</span>
              <div className="fleet-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="fleet-login-control"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="fleet-password-toggle"
                >
                  <PasswordEyeIcon open={showPassword} />
                </button>
              </div>
            </label>

            <div className="fleet-login-row">
              <label className="fleet-login-remember">
                <input type="checkbox" />
                <span>Keep me signed in</span>
              </label>
              <Link to="/forgot-password" className="fleet-login-forgot">
                Forgot password?
              </Link>
            </div>

            <p className="fleet-login-dev-note">For testing: Enter any email and password to login.</p>

            <button type="submit" className="fleet-login-button">
              Sign in
            </button>
          </form>

          <p className="fleet-login-signup-text">
            New to EVzone?{" "}
            <Link to="/fleet-partner/register" className="fleet-login-signup-link">
              Become a Fleet Partner
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

function PasswordEyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path
          d="M12 5c-5 0-8.7 3.1-10 7 .5 1.5 1.4 2.9 2.5 4M12 19c5 0 8.7-3.1 10-7-.5-1.5-1.4-2.9-2.5-4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 5C7 5 3.3 8.1 2 12c1.3 3.9 5 7 10 7s8.7-3.1 10-7c-1.3-3.9-5-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
