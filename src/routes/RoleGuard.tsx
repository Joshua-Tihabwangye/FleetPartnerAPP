import React from "react";
import { Navigate } from "react-router-dom";
import { auth, type FleetBackendRole } from "../utils/auth";

interface RoleGuardProps {
  allowedRoles?: FleetBackendRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  if (!allowedRoles || allowedRoles.length === 0) return children;

  const user = auth.getUser();
  if (!user) {
    return <Navigate to="/access-denied" replace />;
  }

  const granted = new Set(auth.getUserRoles());
  const isAllowed = allowedRoles.some((role) => granted.has(role));

  if (!isAllowed) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
