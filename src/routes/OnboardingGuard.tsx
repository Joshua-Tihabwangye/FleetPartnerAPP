import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../utils/auth";

export default function OnboardingGuard({ children }) {
  const authState = auth.getAuth();
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (authState.hasFinishedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
