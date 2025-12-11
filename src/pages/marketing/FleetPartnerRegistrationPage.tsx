import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";
import { useTheme } from "../../context/ThemeContext";

export default function FleetPartnerRegistrationPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    fleetSize: "",
    services: []
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastManager.show("Registration submitted successfully! We'll contact you shortly.", "success");
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleServiceToggle = (service) => {
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
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Left Side - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 relative overflow-hidden">
        {/* Blurry gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-32 right-20 w-72 h-72 bg-orange-500/25 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-32 left-20 w-64 h-64 bg-ev-green/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-600/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
          <div className="text-center max-w-md">
            {/* Logo */}
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-ev-green flex items-center justify-center text-xl font-black">
                EV
              </div>
              <span className="text-2xl font-bold">EVzone Fleet Partner</span>
            </div>

            {/* Icons */}
            <div className="flex justify-center gap-6 mb-8">
              <span className="text-6xl">🚙</span>
              <span className="text-6xl">⚡</span>
              <span className="text-6xl">🌱</span>
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-ev-green to-orange-400">Green Revolution</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Partner with us to electrify your fleet and contribute to a sustainable future.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">📊</span>
                <span className="text-sm">Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">💰</span>
                <span className="text-sm">Automated Payouts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">📍</span>
                <span className="text-sm">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">🎓</span>
                <span className="text-sm">Driver Training</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="w-full max-w-md py-8">
          {/* Back to Home */}
          <Link
            to="/"
            className={`inline-flex items-center gap-1 text-sm mb-6 transition group ${isDark ? 'text-slate-400 hover:text-ev-green' : 'text-slate-600 hover:text-ev-green'}`}
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Back to Home
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl bg-ev-green flex items-center justify-center text-sm font-black text-white">
              EV
            </div>
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>EVzone Fleet Partner</span>
          </div>

          {/* Form Card */}
          <div className={`rounded-2xl shadow-xl p-8 ${isDark ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200/50'}`}>
            <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Become a Fleet Partner</h1>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Register your fleet and start managing everything from one platform
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Company name</span>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent transition ${isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  placeholder="Your Fleet Company"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent transition ${isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                      }`}
                    placeholder="you@fleet.co"
                    required
                  />
                </label>

                <label className="block">
                  <span className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent transition ${isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                      }`}
                    placeholder="+256 700..."
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Fleet size</span>
                <select
                  value={formData.fleetSize}
                  onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent transition ${isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  required
                >
                  <option value="">Select fleet size</option>
                  <option value="1-10">1-10 vehicles</option>
                  <option value="11-50">11-50 vehicles</option>
                  <option value="51-100">51-100 vehicles</option>
                  <option value="100+">100+ vehicles</option>
                </select>
              </label>

              <div>
                <span className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Services you offer</span>
                <div className="grid grid-cols-3 gap-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceToggle(service.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${formData.services.includes(service.id)
                        ? "bg-gradient-to-br from-ev-green to-orange-500 border-ev-green text-white shadow-lg shadow-emerald-500/20"
                        : isDark
                          ? "bg-slate-700 border-slate-600 text-slate-300 hover:border-ev-green"
                          : "bg-white border-slate-200 text-slate-600 hover:border-ev-green"
                        }`}
                    >
                      <div className="text-xl mb-1">{service.icon}</div>
                      <div className="text-xs font-medium">{service.id}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-ev-green to-orange-500 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-emerald-500/25"
              >
                Become a Partner
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Already a partner?{" "}
                <Link to="/login" className="text-ev-green hover:text-ev-green-dark font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
