import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../utils/auth";

export default function RoleGuard({ allowedRoles, children }) {
  if (!allowedRoles || allowedRoles.length === 0) return children;
  
  const user = auth.getUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }
  return children;
}
