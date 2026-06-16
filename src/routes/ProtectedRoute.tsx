import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth, useAuthState } from "../utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
}

export default function ProtectedRoute({ children, requireOnboardingComplete = true }: ProtectedRouteProps) {
  const location = useLocation();
  const { authState, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="h-8 w-8 border-2 border-ev-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!auth.hasOrganization()) {
    return <Navigate to="/access-denied" replace />;
  }

  if (!auth.hasSelectedOrganization()) {
    return <Navigate to="/switch-organisation" replace />;
  }

  if (requireOnboardingComplete && !authState.hasFinishedOnboarding) {
    return <Navigate to="/setup/fleet-partner-profile" replace />;
  }

  return children;
}
