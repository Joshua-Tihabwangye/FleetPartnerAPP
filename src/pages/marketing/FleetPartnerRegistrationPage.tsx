import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../utils/auth";
import { toastManager } from "../../utils/toastManager";
import "./FleetPartnerRegistrationPage.css";

export default function FleetPartnerRegistrationPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSignUp = async () => {
    setIsRedirecting(true);
    try {
      await auth.signinRedirect({ screen_hint: "signup" });
    } catch (error) {
      setIsRedirecting(false);
      const message = error instanceof Error ? error.message : "Unable to start registration.";
      toastManager.show(message, "error");
    }
  };

  return (
    <div className="fleet-register-page">
      <main className="fleet-register-shell">
        <section className="fleet-register-left">
          <div className="fleet-brand">
            <div className="fleet-logo-icon">EV</div>
            <div>
              <h2>EVZone</h2>
              <p>Fleet Partner</p>
            </div>
          </div>

          <div className="fleet-hero-copy">
            <h1>
              Grow your fleet with <span>EVZone</span>
            </h1>
            <p>
              Register your fleet and manage rides, drivers, and services from one platform.
            </p>
          </div>

          <div className="fleet-feature-row">
            <div className="fleet-feature">
              <div className="fleet-feature-icon">🚘</div>
              <span>Smart Rides</span>
            </div>
            <div className="fleet-feature">
              <div className="fleet-feature-icon">⚡</div>
              <span>Electric Future</span>
            </div>
            <div className="fleet-feature">
              <div className="fleet-feature-icon">🌿</div>
              <span>Sustainable Tomorrow</span>
            </div>
          </div>

          <div className="fleet-illustration-wrap">
            <img
              src="/Fleet1.png"
              alt="EV car charging illustration"
              className="fleet-illustration"
            />
          </div>
        </section>

        <div className="fleet-register-divider" />

        <section className="fleet-register-right">
          <Link to="/" className="fleet-register-backlink">
            ← Back to Home
          </Link>

          <h1 className="form-title">Become a Fleet Partner</h1>
          <p className="form-subtitle">
            Register your fleet and start managing everything from one platform
          </p>

          <div className="fleet-register-form space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Fleet Partner registration is handled securely by EVzone Accounts. You will be
              redirected to complete registration.
            </p>

            <button
              type="button"
              onClick={handleSignUp}
              disabled={isRedirecting}
              className="become-partner-button"
            >
              {isRedirecting ? "Redirecting..." : "Continue with EVzone Accounts"}
            </button>
          </div>

          <p className="form-signin-text">
            Already a partner?{" "}
            <Link to="/login" className="form-signin-link">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
