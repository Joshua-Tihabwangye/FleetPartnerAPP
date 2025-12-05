import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../utils/auth";
import { useTheme } from "../../context/ThemeContext";

export default function FleetPartnerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email && password) {
      auth.login(email, password);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } else {
      setError("Please enter both email and password");
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Left Side - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
        {/* Blurry gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-ev-green/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px]" />
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
              <span className="text-6xl">🚗</span>
              <span className="text-6xl">⚡</span>
              <span className="text-6xl">🌱</span>
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Power Your Fleet with <span className="text-ev-green">Clean Energy</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Manage your entire electric fleet from one dashboard. Rides, deliveries, rentals, shuttles, and more.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-ev-green">500+</div>
                <div className="text-slate-400">Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ev-green">1.2K+</div>
                <div className="text-slate-400">Drivers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ev-green">99.9%</div>
                <div className="text-slate-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="w-full max-w-md">
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
            <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome back</h1>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Sign in to access your fleet dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <label className="block">
                <span className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent transition ${isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  placeholder="you@company.com"
                  required
                />
              </label>

              <label className="block">
                <span className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent transition ${isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  placeholder="••••••••"
                  required
                />
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-ev-green focus:ring-ev-green" />
                  Keep me signed in
                </label>
                <Link to="/forgot-password" className="text-ev-green hover:text-ev-green-dark font-medium">
                  Forgot password?
                </Link>
              </div>

              <p className={`text-xs rounded-lg p-2.5 ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                💡 For testing: Enter any email and password to login
              </p>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-ev-green to-orange-500 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-emerald-500/25"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                New to EVzone?{" "}
                <Link to="/fleet-partner/register" className="text-ev-green hover:text-ev-green-dark font-medium">
                  Become a Fleet Partner
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
