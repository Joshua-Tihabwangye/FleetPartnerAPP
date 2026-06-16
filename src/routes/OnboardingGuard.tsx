import React from "react";
import { Navigate } from "react-router-dom";
import { auth, useAuthState } from "../utils/auth";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { authState, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="h-8 w-8 border-2 border-ev-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!auth.hasOrganization()) {
    return <Navigate to="/access-denied" replace />;
  }

  if (authState.hasFinishedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
