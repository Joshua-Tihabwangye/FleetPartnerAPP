import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../utils/auth";

export default function FleetPartnerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // For testing: accept any email/password
    if (email && password) {
      auth.login(email, password);
      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } else {
      setError("Please enter both email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-lg p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-xl bg-ev-green flex items-center justify-center text-[11px] font-black text-ev-slate">
            EV
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">EVzone Fleet Partner</span>
            <span className="text-[11px] text-emerald-100/90">
              Fleet Partner workspace
            </span>
          </div>
        </div>
        <h1 className="text-[18px] font-semibold mb-1 text-slate-900">Sign in</h1>
        <p className="text-[12px] text-slate-600 mb-4">
          Use your fleet email and password to access the Fleet Partner dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
          {error && (
            <div className="p-2 rounded-lg bg-red-100 border border-red-300 text-red-700 text-[11px]">
              {error}
            </div>
          )}
          <label className="block space-y-1">
            <span className="text-[11px] text-slate-700 font-medium">Work email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
              placeholder="you@fleet.co"
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] text-slate-700 font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </label>
          <p className="text-[10px] text-slate-500 italic">
            For testing: Enter any email and password to login
          </p>
          <div className="flex items-center justify-between text-[11px]">
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" className="h-3 w-3 rounded border border-slate-300" />
              <span>Keep me signed in</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-ev-green hover:text-ev-green-dark"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-ev-green text-ev-slate font-semibold py-2 text-[12px] hover:bg-ev-green-dark focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
          >
            Continue
          </button>
        </form>
        <p className="mt-4 text-[11px] text-slate-600 text-center">
          New fleet?{" "}
          <Link to="/fleet-partner/register" className="text-ev-green hover:text-ev-green-dark font-medium">
            Become a Fleet Partner
          </Link>
        </p>
      </div>
    </div>
  );
}
