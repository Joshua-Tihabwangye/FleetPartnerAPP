import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";
import { auth } from "../../utils/auth";
import { normalizeFleetRegistrationInput } from "../../services/api/validators";
import { saveAuthPrefill } from "../../utils/authPrefill";
import "./FleetPartnerRegistrationPage.css";

export default function FleetPartnerRegistrationPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    registrationNumber: "",
    taxId: "",
    fleetSize: "",
    password: "",
    services: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    let registration;
    try {
      registration = normalizeFleetRegistrationInput({
        ...formData,
        metadata: {
          source: "fleet-partner-registration-page",
        },
      });
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : "Please review the registration form.";
      setSubmitError(message);
      toastManager.show(message, "error");
      setIsSubmitting(false);
      return;
    }

    let authState;
    try {
      authState = await auth.register(registration);
      saveAuthPrefill({ email: registration.email, identity: registration.email, password: registration.password });
    } catch (registrationError) {
      const message =
        registrationError instanceof Error
          ? registrationError.message
          : "Unable to submit registration right now.";
      setSubmitError(message);
      toastManager.show(message, "error");
      setIsSubmitting(false);
      return;
    }

    const successMessage = "Registration successful. You can now sign in with this email and password.";
    setSubmitSuccess(successMessage);
    toastManager.show(successMessage, "success");
    setIsSubmitting(false);
    auth.logout();
    setTimeout(() => navigate("/login"), 800);
  };

  const handleServiceToggle = (service: string) => {
    setSubmitError("");
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service],
    }));
  };

  const services = [
    { id: "ride", label: "Rides", icon: "🚗" },
    { id: "delivery", label: "Delivery", icon: "📦" },
    { id: "rental", label: "Rentals", icon: "🚘" },
    { id: "school_shuttle", label: "School Shuttles", icon: "🚌" },
    { id: "tour", label: "Tours", icon: "🌍" },
    { id: "ambulance", label: "EMS", icon: "🚑" },
  ];

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

          <form onSubmit={handleSubmit} className="fleet-register-form" noValidate>
            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                {submitError}
              </div>
            ) : null}

            {submitSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700" role="status">
                {submitSuccess}
              </div>
            ) : null}
            <label className="form-group">
              <span>Company name</span>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => { setFormData({ ...formData, companyName: e.target.value }); setSubmitError(""); }}
                className="form-control"
                placeholder="Your Fleet Company"
                required
              />
            </label>

            <div className="form-row">
              <label className="form-group">
                <span>Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setSubmitError(""); }}
                  className="form-control"
                  placeholder="you@fleet.co"
                  required
                />
              </label>

              <label className="form-group">
                <span>Phone</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setSubmitError(""); }}
                  className="form-control"
                  placeholder="+256 700..."
                  required
                />
              </label>
            </div>

            <label className="form-group">
              <span>Fleet size</span>
              <select
                value={formData.fleetSize}
                onChange={(e) => { setFormData({ ...formData, fleetSize: e.target.value }); setSubmitError(""); }}
                className="form-control"
                required
              >
                <option value="">Select fleet size</option>
                <option value="1-10">1-10 vehicles</option>
                <option value="11-50">11-50 vehicles</option>
                <option value="51-100">51-100 vehicles</option>
                <option value="100+">100+ vehicles</option>
              </select>
            </label>

            <div className="form-row">
              <label className="form-group">
                <span>Registration number</span>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => { setFormData({ ...formData, registrationNumber: e.target.value }); setSubmitError(""); }}
                  className="form-control"
                  placeholder="Company registration no."
                />
              </label>

              <label className="form-group">
                <span>Tax ID</span>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => { setFormData({ ...formData, taxId: e.target.value }); setSubmitError(""); }}
                  className="form-control"
                  placeholder="Tax identification no."
                />
              </label>
            </div>

            <label className="form-group">
              <span>Password</span>
              <div className="fleet-register-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setSubmitError(""); }}
                  className="form-control"
                  placeholder="Create a secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="fleet-register-password-toggle"
                >
                  <PasswordEyeIcon open={showPassword} />
                </button>
              </div>
            </label>

            <div className="form-group">
              <span>Services you offer</span>
              <div className="service-grid">
                {services.map((service) => {
                  const selected = formData.services.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceToggle(service.id)}
                      className={`service-card${selected ? " selected" : ""}`}
                    >
                      <div className="service-icon">{service.icon}</div>
                      <div className="service-name">{service.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="become-partner-button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Become a Partner"}
            </button>
          </form>

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
