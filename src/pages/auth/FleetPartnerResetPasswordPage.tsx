import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../utils/auth";
import { saveAuthPrefill } from "../../utils/authPrefill";

export default function FleetPartnerResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const flowState = (location.state as { email?: string; otp?: string } | null) || null;
  const email = flowState?.email?.trim() || "";
  const otp = flowState?.otp?.trim() || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!otp || !email) {
      setError("Invalid reset session. Please request a new password reset link.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await auth.resetPassword(normalizedEmail, otp, password);
      if (result.reset) {
        saveAuthPrefill({ email: normalizedEmail, identity: normalizedEmail, password });
        navigate("/login", { replace: true });
      } else {
        setError("Password reset failed. Please try again.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Password reset failed.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-black/40 shadow-xl shadow-black/40 p-5 sm:p-6">
        {/* Header omitted for brevity */}
        <h1 className="text-[18px] font-semibold mb-1">Set new password</h1>
        <p className="text-[12px] text-emerald-100/80 mb-4">
          Enter your new password below. Make sure it&apos;s at least 8 characters long.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
          {error && (
            <div className="rounded-xl border border-red-400/50 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
              {error}
            </div>
          )}
          <label className="block space-y-1">
            <span className="text-[11px] text-emerald-100/90">New password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-emerald-500/50 bg-black/40 px-3 py-2 text-[12px] text-slate-50 placeholder:text-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] text-emerald-100/90">Confirm password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-emerald-500/50 bg-black/40 px-3 py-2 text-[12px] text-slate-50 placeholder:text-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-ev-green text-ev-slate font-semibold py-2 text-[12px] hover:bg-ev-green-dark focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>
        <p className="mt-4 text-[11px] text-emerald-100/80 text-center">
          <Link to="/login" className="text-ev-orange hover:text-orange-300">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
