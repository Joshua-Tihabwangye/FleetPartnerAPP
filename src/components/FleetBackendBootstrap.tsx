import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BACKEND_FLAG_EVENT } from "../services/api/config";
import { auth } from "../utils/auth";
import {
  createFleetSocket,
  isFleetBackendEnabled,
  syncFleetWorkspaceState,
} from "../services/api/fleetApi";

export default function FleetBackendBootstrap() {
  const location = useLocation();
  const [fleetBackendEnabled, setFleetBackendEnabled] = useState(() => isFleetBackendEnabled());

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncBackendFlag = () => {
      setFleetBackendEnabled(isFleetBackendEnabled());
    };

    window.addEventListener(BACKEND_FLAG_EVENT, syncBackendFlag as EventListener);
    syncBackendFlag();

    return () => {
      window.removeEventListener(BACKEND_FLAG_EVENT, syncBackendFlag as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!fleetBackendEnabled || !auth.isAuthenticated()) {
      return;
    }

    void syncFleetWorkspaceState().catch((error) => {
      console.warn("Fleet backend sync failed. Keeping current local storage state.", error);
    });
  }, [fleetBackendEnabled, location.pathname]);

  useEffect(() => {
    if (!fleetBackendEnabled || !auth.isAuthenticated()) {
      return;
    }

    const socket = createFleetSocket();
    socket.connect();

    socket.on("notification.new", () => {
      void syncFleetWorkspaceState().catch(() => undefined);
    });

    return () => {
      socket.disconnect();
    };
  }, [fleetBackendEnabled]);

  return null;
}
