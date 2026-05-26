import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";
import { auth } from "../../utils/auth";
import "./FleetPartnerRegistrationPage.css";

export default function FleetPartnerRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    fleetSize: "",
    password: "",
    services: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await auth.register({
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        fleetSize: formData.fleetSize,
        services: formData.services,
        password: formData.password,
      });
    } catch (registrationError) {
      const message =
        registrationError instanceof Error
          ? registrationError.message
          : "Unable to submit registration right now.";
      toastManager.show(message, "error");
      return;
    }

    toastManager.show("Registration successful. You can now sign in with this email and password.", "success");
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const services = [
    { id: "Rides", icon: "🚗" },
    { id: "Delivery", icon: "📦" },
    { id: "Rentals", icon: "🚘" },
    { id: "School Shuttles", icon: "🚌" },
    { id: "Tours", icon: "🌍" },
    { id: "EMS", icon: "🚑" }
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

          <form onSubmit={handleSubmit} className="fleet-register-form">
            <label className="form-group">
              <span>Company name</span>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
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

            <label className="form-group">
              <span>Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-control"
                placeholder="Enter any password for development"
                required
              />
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
                      <div className="service-name">{service.id}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="become-partner-button">
              Become a Partner
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
