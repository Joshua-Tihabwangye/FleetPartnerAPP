import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
}

export default function ProtectedRoute({ children, requireOnboardingComplete = true }: ProtectedRouteProps) {
  const location = useLocation();
  const authState = auth.getAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireOnboardingComplete && !authState.hasFinishedOnboarding) {
    return <Navigate to="/setup/fleet-partner-profile" replace />;
  }

  return children;
}
