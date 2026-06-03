import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, BACKEND_FLAG_EVENT, loadBackendRuntimeFlag } from "../services/api/config";
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

    void loadBackendRuntimeFlag(true)
      .catch(() => undefined)
      .finally(syncBackendFlag);

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
    const syncFromRealtime = () => {
      void syncFleetWorkspaceState().catch(() => undefined);
    };
    const fleetEventAliases: Record<string, string[]> = {
      "dispatch.created": ["dispatch.create"],
      "dispatch.updated": ["dispatch.update"],
      "fleet.alert": ["notification.new"],
    };
    const normalizeFleetEvents = (events: string[]) => {
      const normalized = new Set<string>();
      events.forEach((eventName) => {
        if (!eventName) return;
        normalized.add(eventName);
        (fleetEventAliases[eventName] || []).forEach((alias) => normalized.add(alias));
      });
      return Array.from(normalized);
    };

    const defaultSyncEvents = normalizeFleetEvents([
      "dispatch.created",
      "dispatch.updated",
      "dispatch.completed",
      "fleet.alert",
      "notification.new",
    ]);
    let syncEvents = [...defaultSyncEvents];
    let cancelled = false;

    const bootstrapRealtime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/compat/realtime/events`);
        if (response.ok) {
          const payload = await response.json();
          const data = (payload?.data || payload) as { fleet?: { server?: Record<string, string> } };
          const backendEvents = Object.values(data?.fleet?.server || {}).filter(
            (value): value is string => typeof value === "string" && value.length > 0,
          );
          if (backendEvents.length > 0) {
            syncEvents = normalizeFleetEvents([...defaultSyncEvents, ...backendEvents]);
          }
        }
      } catch {
        // Fallback to default event list.
      }

      if (cancelled) return;
      syncEvents.forEach((eventName) => {
        socket.on(eventName, syncFromRealtime);
      });
      socket.connect();
    };

    void bootstrapRealtime();

    return () => {
      cancelled = true;
      syncEvents.forEach((eventName) => {
        socket.off(eventName, syncFromRealtime);
      });
      socket.disconnect();
    };
  }, [fleetBackendEnabled]);

  return null;
}
