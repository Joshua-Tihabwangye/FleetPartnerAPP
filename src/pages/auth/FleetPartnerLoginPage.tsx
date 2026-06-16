import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../utils/auth";
import { toastManager } from "../../utils/toastManager";
import "./FleetPartnerLoginPage.css";

export default function FleetPartnerLoginPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSignIn = async () => {
    setIsRedirecting(true);
    try {
      await auth.signinRedirect();
    } catch (error) {
      setIsRedirecting(false);
      const message = error instanceof Error ? error.message : "Unable to start sign in.";
      toastManager.show(message, "error");
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

          <div className="fleet-login-form space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Authentication is handled securely by EVzone Accounts. You will be redirected to
              complete sign in.
            </p>

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isRedirecting}
              className="fleet-login-button"
            >
              {isRedirecting ? "Redirecting..." : "Sign in with EVzone Accounts"}
            </button>
          </div>

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
