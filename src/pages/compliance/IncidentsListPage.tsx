import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import PageState from "../../components/ui/PageState";
import { toastManager } from "../../utils/toastManager";
import {
  createFallbackFleetComplianceIncident,
  createFleetComplianceIncident,
  getCachedFleetDrivers,
  getCachedFleetIncidents,
  getCachedFleetVehicles,
  isFleetBackendEnabled,
  listFleetComplianceIncidents,
  refreshFleetWorkspaceState,
} from "../../services/api/fleetApi";

interface Incident {
  id: number;
  incidentId: string;
  type: string;
  vehicle: string;
  driver: string;
  date: string;
  severity: string;
  status: string;
  description?: string;
}

export default function IncidentsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<string[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: "",
    vehicle: "",
    driver: "",
    severity: "",
    description: "",
  });

  const syncIncidentsFromBackend = useCallback(async () => {
    await refreshFleetWorkspaceState();
    setAvailableVehicles(
      (getCachedFleetVehicles() as any[])
        .map((item) => String(item.plate || item.vehiclePlate || "").trim())
        .filter((item) => item.length > 0),
    );
    setAvailableDrivers(
      (getCachedFleetDrivers() as any[])
        .map((item) => String(item.name || item.fullName || "").trim())
        .filter((item) => item.length > 0),
    );
    const backend = await listFleetComplianceIncidents();
    const mapped: Incident[] = backend.map((item, index) => ({
      id: index + 1,
      incidentId: item.id,
      type: item.category,
      vehicle: "Unassigned",
      driver: "Unassigned",
      date: new Date(item.createdAt).toISOString().split("T")[0] || "",
      severity: item.severity,
      status: item.status,
      description: item.description,
    }));
    setIncidents(mapped);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    setAvailableVehicles(
      Array.from(
        new Set(
          (getCachedFleetVehicles() as any[])
            .map((item) => String(item.plate || item.vehiclePlate || "").trim())
            .filter((item) => item.length > 0),
        ),
      ),
    );
    setAvailableDrivers(
      Array.from(
        new Set(
          (getCachedFleetDrivers() as any[])
            .map((item) => String(item.name || item.fullName || "").trim())
            .filter((item) => item.length > 0),
        ),
      ),
    );

    if (isFleetBackendEnabled()) {
      try {
        await syncIncidentsFromBackend();
        setLoading(false);
        return;
      } catch (error) {
        console.warn("Failed to load incidents from backend.", error);
        setLoadError("Failed to load incidents from backend. Showing the last synced cache if available.");
      }
    }

    setIncidents(getCachedFleetIncidents() as Incident[]);
    setLoading(false);
  }, [syncIncidentsFromBackend]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        category: reportForm.type || "General",
        severity: (reportForm.severity || "medium") as "low" | "medium" | "high" | "critical",
        description: reportForm.description || `${reportForm.type || "Incident"} reported from fleet console.`,
      };

      if (isFleetBackendEnabled()) {
        await createFleetComplianceIncident(payload);
        await syncIncidentsFromBackend();
      } else {
        createFallbackFleetComplianceIncident({
          ...payload,
          vehicle: reportForm.vehicle || "Unassigned",
          driver: reportForm.driver || "Unassigned",
        });
        setIncidents(getCachedFleetIncidents() as Incident[]);
      }

      toastManager.show("Incident reported successfully!", "success");
      setShowReportModal(false);
      setReportForm({ type: "", vehicle: "", driver: "", severity: "", description: "" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Incident submission failed.";
      toastManager.show(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIncidents = incidents.filter((incident) => {
    const query = searchQuery.toLowerCase();
    return (
      incident.incidentId.toLowerCase().includes(query) ||
      incident.type.toLowerCase().includes(query) ||
      incident.vehicle.toLowerCase().includes(query) ||
      incident.driver.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Incidents</h1>
          <p className="text-sm text-slate-600">Track and manage fleet incidents and safety issues</p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
        >
          + Report incident
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search incidents by ID, type, vehicle..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {loading ? (
        <PageState kind="loading" title="Loading incidents" message="Fetching compliance incidents from the backend." />
      ) : loadError && incidents.length === 0 ? (
        <PageState kind="error" title="Incident sync failed" message={loadError} actionLabel="Retry" onAction={() => void load()} />
      ) : filteredIncidents.length === 0 ? (
        <PageState
          kind="empty"
          title="No incidents found"
          message="Report a new incident or sync the backend workspace to populate this register."
          actionLabel="Refresh"
          onAction={() => void load()}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loadError ? (
            <div className="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              {loadError}
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Incident ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-slate-900">{incident.incidentId}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{incident.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{incident.vehicle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{incident.driver}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${incident.severity === "minor" || incident.severity === "low"
                        ? "bg-yellow-100 text-yellow-700"
                        : incident.severity === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                        }`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${incident.status === "resolved"
                        ? "bg-emerald-100 text-emerald-700"
                        : incident.status === "investigating"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                        }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{incident.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report new incident" size="md">
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Type *</span>
            <select
              value={reportForm.type}
              onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
              required
            >
              <option value="">Select type</option>
              <option value="Accident">Accident</option>
              <option value="Traffic violation">Traffic violation</option>
              <option value="Vehicle breakdown">Vehicle breakdown</option>
              <option value="Safety complaint">Safety complaint</option>
            </select>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle</span>
              <select
                value={reportForm.vehicle}
                onChange={(e) => setReportForm({ ...reportForm, vehicle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
              >
                <option value="">Select vehicle</option>
                {availableVehicles.map((vehicle) => <option key={vehicle} value={vehicle}>{vehicle}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Driver</span>
              <select
                value={reportForm.driver}
                onChange={(e) => setReportForm({ ...reportForm, driver: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
              >
                <option value="">Select driver</option>
                {availableDrivers.map((driver) => <option key={driver} value={driver}>{driver}</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Severity *</span>
            <select
              value={reportForm.severity}
              onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
              required
            >
              <option value="">Select severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Description</span>
            <textarea
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
              placeholder="Describe what happened"
            />
          </label>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {submitting ? "Submitting..." : "Report incident"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
