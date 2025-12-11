import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../utils/auth";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const authState = auth.getAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (authState.hasFinishedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
