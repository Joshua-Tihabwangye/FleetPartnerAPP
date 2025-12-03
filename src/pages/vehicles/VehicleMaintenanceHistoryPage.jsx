import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import { toastManager } from "../../utils/toastManager";

export default function VehicleMaintenanceHistoryPage() {
  const { vehicleId } = useParams();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [maintenance, setMaintenance] = useState([]);
  const [newRecord, setNewRecord] = useState({ type: "service", date: "", notes: "", cost: "" });

  useEffect(() => {
    const allRecords = JSON.parse(localStorage.getItem("vehicle_maintenance") || "[]");
    const vehicleRecords = allRecords.filter(r => r.vehicleId === vehicleId);
    setMaintenance(vehicleRecords);
  }, [vehicleId]);

  const handleSchedule = (e) => {
    e.preventDefault();
    const record = {
      id: Date.now().toString(),
      vehicleId,
      status: "scheduled",
      ...newRecord
    };

    const allRecords = JSON.parse(localStorage.getItem("vehicle_maintenance") || "[]");
    const updatedRecords = [...allRecords, record];
    localStorage.setItem("vehicle_maintenance", JSON.stringify(updatedRecords));

    setMaintenance([...maintenance, record]);
    setShowScheduleModal(false);
    setNewRecord({ type: "service", date: "", notes: "", cost: "" });
    toastManager.show("Maintenance scheduled successfully!", "success");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to={`/vehicles/${vehicleId}`}
              className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
            >
              ← Back to vehicle
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Maintenance History</h1>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
          >
            + Schedule Maintenance
          </button>
        </div>

        <div className="space-y-4">
          {maintenance.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              No maintenance records found. Schedule maintenance to track service history.
            </div>
          ) : (
            maintenance.map((record) => (
              <div key={record.id} className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 capitalize">{record.type.replace('-', ' ')}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${record.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {record.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{record.notes}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{record.date}</div>
                  {record.cost && <div className="text-sm text-slate-500">UGX {parseInt(record.cost).toLocaleString()}</div>}
                </div>
              </div>
            ))
          )}
        </div>

        <Modal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          title="Schedule Maintenance"
          size="md"
        >
          <form onSubmit={handleSchedule} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Service Type *</span>
              <select
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              >
                <option value="service">Regular Service</option>
                <option value="repair">Repair</option>
                <option value="inspection">Inspection</option>
                <option value="tire-change">Tire Change</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Date *</span>
              <input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Estimated Cost</span>
              <input
                type="number"
                value={newRecord.cost}
                onChange={(e) => setNewRecord({ ...newRecord, cost: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                placeholder="UGX"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Notes</span>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                placeholder="Describe required service..."
              />
            </label>
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Schedule
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
