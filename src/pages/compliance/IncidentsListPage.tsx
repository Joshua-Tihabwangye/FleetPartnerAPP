import React, { useState } from "react";
import Modal from "../../components/ui/Modal";
import { toastManager } from "../../utils/toastManager";

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
  const [reportForm, setReportForm] = useState({
    type: "",
    vehicle: "",
    driver: "",
    severity: "",
    description: ""
  });

  // Load incidents on mount
  React.useEffect(() => {
    const storedIncidents: Incident[] = JSON.parse(localStorage.getItem("incidents") || "[]");
    if (storedIncidents.length === 0) {
      // Initialize with mock data if empty
      const mockIncidents: Incident[] = [
        { id: 1, incidentId: "INC-001", type: "Accident", vehicle: "UAA 123A", driver: "John Doe", date: "2024-01-15", severity: "minor", status: "resolved" },
        { id: 2, incidentId: "INC-002", type: "Traffic violation", vehicle: "UAA 124B", driver: "Jane Smith", date: "2024-01-14", severity: "low", status: "pending" },
        { id: 3, incidentId: "INC-003", type: "Vehicle breakdown", vehicle: "UAA 125C", driver: "Mike Johnson", date: "2024-01-13", severity: "medium", status: "investigating" }
      ];
      localStorage.setItem("incidents", JSON.stringify(mockIncidents));
      setIncidents(mockIncidents);
    } else {
      setIncidents(storedIncidents);
    }
  }, []);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const newIncident = {
      id: Date.now(),
      incidentId: `INC-${String(incidents.length + 1).padStart(3, '0')}`,
      ...reportForm,
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    };

    const updatedIncidents = [newIncident, ...incidents];
    setIncidents(updatedIncidents);
    localStorage.setItem("incidents", JSON.stringify(updatedIncidents));

    toastManager.show("Incident reported successfully!", "success");
    setShowReportModal(false);
    setReportForm({ type: "", vehicle: "", driver: "", severity: "", description: "" });
  };

  const filteredIncidents = incidents.filter(incident => {
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
      {/* Header */}
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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search incidents by ID, type, vehicle..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Incident ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-slate-500">
                    No incidents found matching your search.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{incident.incidentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {incident.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {incident.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {incident.driver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${incident.severity === "minor" || incident.severity === "low"
                          ? "bg-yellow-100 text-yellow-700"
                          : incident.severity === "medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${incident.status === "resolved"
                          ? "bg-emerald-100 text-emerald-700"
                          : incident.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {incident.date}
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Incident Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportForm({ type: "", vehicle: "", driver: "", severity: "", description: "" });
        }}
        title="Report New Incident"
        size="md"
      >
        <form
          onSubmit={handleReportSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Incident Type *</span>
              <select
                value={reportForm.type}
                onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              >
                <option value="">Select type...</option>
                <option value="accident">Accident</option>
                <option value="violation">Traffic Violation</option>
                <option value="breakdown">Vehicle Breakdown</option>
                <option value="theft">Theft/Vandalism</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Severity *</span>
              <select
                value={reportForm.severity}
                onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              >
                <option value="">Select severity...</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="minor">Minor</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle *</span>
              <select
                value={reportForm.vehicle}
                onChange={(e) => setReportForm({ ...reportForm, vehicle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              >
                <option value="">Select vehicle...</option>
                <option value="UAA 123A">UAA 123A - Tesla Model 3</option>
                <option value="UAA 124B">UAA 124B - Nissan Leaf</option>
                <option value="UAA 125C">UAA 125C - BYD E6</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Driver *</span>
              <select
                value={reportForm.driver}
                onChange={(e) => setReportForm({ ...reportForm, driver: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              >
                <option value="">Select driver...</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Mike Johnson">Mike Johnson</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Description *</span>
            <textarea
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              placeholder="Provide detailed description of the incident..."
              required
            />
          </label>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowReportModal(false);
                setReportForm({ type: "", vehicle: "", driver: "", severity: "", description: "" });
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Submit Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
