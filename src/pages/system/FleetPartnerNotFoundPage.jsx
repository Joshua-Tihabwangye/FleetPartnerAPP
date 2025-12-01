import React from "react";
import { Link } from "react-router-dom";

export default function FleetPartnerNotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="max-w-md text-center space-y-3">
        <div className="text-4xl">🛰️</div>
        <h1 className="text-xl font-semibold">We couldn&apos;t find that page</h1>
        <p className="text-sm text-slate-300">
          The link you followed might be broken or the page may have been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-[12px] mt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-ev-green text-ev-slate font-medium hover:bg-ev-green-dark"
          >
            Go to dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-3 py-1.5 rounded-xl border border-slate-500 bg-slate-900 hover:bg-slate-800"
          >
            Back to Fleet Partner home
          </Link>
        </div>
      </div>
    </div>
  );
}
