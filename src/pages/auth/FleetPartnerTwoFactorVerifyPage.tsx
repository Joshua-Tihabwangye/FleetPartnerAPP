import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function FleetPartnerTwoFactorVerifyPage() {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("2FA verification successful. Wire to your auth API.");
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
        <div className="text-3xl mb-3 text-center">🔐</div>
        <h1 className="text-[18px] font-semibold mb-1 text-center">Two-factor authentication</h1>
        <p className="text-[12px] text-emerald-100/80 mb-4 text-center">
          Enter the 6-digit code from your authenticator app to complete sign in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
          <label className="block space-y-1">
            <span className="text-[11px] text-emerald-100/90">Verification code</span>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-xl border border-emerald-500/50 bg-black/40 px-3 py-2 text-[12px] text-slate-50 placeholder:text-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/80 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-ev-green text-ev-slate font-semibold py-2 text-[12px] hover:bg-ev-green-dark focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
          >
            Verify and continue
          </button>
        </form>
        <p className="mt-4 text-[11px] text-emerald-100/80 text-center">
          Having trouble?{" "}
          <Link to="/login" className="text-ev-orange hover:text-orange-300">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
