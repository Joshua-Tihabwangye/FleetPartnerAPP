import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/auth";

export default function FleetPartnerForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await auth.forgotPassword(email);
      // Navigate to OTP verification passing email
      navigate("/auth/verify-otp", { state: { email } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to send reset email. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-black/40 shadow-xl shadow-black/40 p-5 sm:p-6">
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
        <h1 className="text-[18px] font-semibold mb-1">Reset your password</h1>
        <p className="text-[12px] text-emerald-100/80 mb-4">
          Enter your work email and we&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
          {message ? (
            <div className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
              {message}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-xl border border-red-400/50 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
              {error}
            </div>
          ) : null}
          <label className="block space-y-1">
            <span className="text-[11px] text-emerald-100/90">Work email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-emerald-500/50 bg-black/40 px-3 py-2 text-[12px] text-slate-50 placeholder:text-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              placeholder="you@fleet.co"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-ev-green text-ev-slate font-semibold py-2 text-[12px] hover:bg-ev-green-dark focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
          >
            Send reset link
          </button>
        </form>
        <p className="mt-4 text-[11px] text-emerald-100/80 text-center">
          Remember your password?{" "}
          <Link to="/login" className="text-ev-orange hover:text-orange-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
