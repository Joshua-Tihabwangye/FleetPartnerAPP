import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function FleetPartnerResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password reset successful. Wire to your auth API.");
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
        <h1 className="text-[18px] font-semibold mb-1">Set new password</h1>
        <p className="text-[12px] text-emerald-100/80 mb-4">
          Enter your new password below. Make sure it&apos;s at least 8 characters long.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
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
            className="w-full rounded-xl bg-ev-green text-ev-slate font-semibold py-2 text-[12px] hover:bg-ev-green-dark focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
          >
            Reset password
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
