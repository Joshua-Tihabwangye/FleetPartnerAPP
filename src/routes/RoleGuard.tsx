import React from "react";
import { Navigate } from "react-router-dom";
import { auth, type FleetBackendRole, useAuthState } from "../utils/auth";

interface RoleGuardProps {
  allowedRoles?: FleetBackendRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { authState, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="h-8 w-8 border-2 border-ev-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!allowedRoles || allowedRoles.length === 0) return children;

  if (!authState.isAuthenticated || !authState.user) {
    return <Navigate to="/access-denied" replace />;
  }

  const granted = new Set(auth.getUserRoles());
  const isAllowed = allowedRoles.some((role) => granted.has(role));

  if (!isAllowed) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
