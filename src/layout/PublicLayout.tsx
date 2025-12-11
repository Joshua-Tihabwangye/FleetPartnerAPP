import React from "react";
import { Outlet } from "react-router-dom";

// PublicLayout - minimal wrapper, pages manage their own headers
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
