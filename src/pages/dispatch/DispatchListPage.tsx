import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageState from "../../components/ui/PageState";
import { getCachedFleetDispatches, isFleetBackendEnabled, refreshFleetWorkspaceState } from "../../services/api/fleetApi";
import { auth } from "../../utils/auth";

interface Dispatch {
  id: number;
  pickup: string;
  dropoff: string;
  vehicle: string;
  driver: string;
  fare: string;
  status: string;
}

export default function DispatchListPage() {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const canCreateDispatch = auth.hasPermission("dispatch:write");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    if (!isFleetBackendEnabled()) {
      setDispatches([]);
      setLoadError("Backend session required. Sign in to view dispatch operations.");
      setLoading(false);
      return;
    }

    try {
      await refreshFleetWorkspaceState();
    } catch (error) {
      console.warn("Fleet backend dispatch sync failed.", error);
      setLoadError("Failed to refresh dispatches from backend. Showing the last synced cache if available.");
    }

    const storedDispatches = getCachedFleetDispatches() as Dispatch[];
    setDispatches(storedDispatches);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "in-progress": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Dispatches</h1>
          <p className="text-sm text-slate-600">Manage manual dispatch bookings</p>
        </div>
        <Link
          to="/dispatch/new"
          aria-disabled={!canCreateDispatch}
          onClick={(event) => {
            if (!canCreateDispatch) event.preventDefault();
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${canCreateDispatch ? "bg-ev-green text-white hover:bg-ev-green-dark" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
        >
          + New dispatch
        </Link>
      </div>

      {loading ? (
        <PageState kind="loading" title="Loading dispatches" message="Fetching fleet dispatch activity from the backend." />
      ) : loadError && dispatches.length === 0 ? (
        <PageState kind="error" title="Dispatch sync failed" message={loadError} actionLabel="Retry" onAction={() => void load()} />
      ) : dispatches.length === 0 ? (
        <PageState
          kind="empty"
          title="No dispatches yet"
          message="Create your first manual dispatch booking once vehicles and drivers are connected to the backend."
          actionLabel={canCreateDispatch ? "Refresh" : undefined}
          onAction={canCreateDispatch ? () => void load() : undefined}
        />
      ) : (
        <>
          {loadError ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              {loadError}
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dispatches.map((dispatch) => (
              <div
                key={dispatch.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Dispatch #{dispatch.id.toString().slice(-6)}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispatch.status)}`}>
                    {dispatch.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">From:</span>
                    <p className="font-medium text-slate-900">{dispatch.pickup}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">To:</span>
                    <p className="font-medium text-slate-900">{dispatch.dropoff}</p>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-slate-100">
                    <span className="text-slate-500">Fare:</span>
                    <span className="font-semibold text-emerald-600">UGX {parseInt(dispatch.fare).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
