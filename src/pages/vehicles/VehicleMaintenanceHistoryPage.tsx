import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import { toastManager } from "../../utils/toastManager";
import { isFleetBackendEnabled } from "../../services/api/fleetApi";

interface MaintenanceRecord {
  id: string;
  vehicleId: string | undefined;
  type: string;
  date: string;
  notes: string;
  cost: string;
  status: string;
}

export default function VehicleMaintenanceHistoryPage() {
  const { vehicleId } = useParams();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [newRecord, setNewRecord] = useState({ type: "service", date: "", notes: "", cost: "" });

  useEffect(() => {
    if (isFleetBackendEnabled()) {
      setMaintenance([]);
      return;
    }
    const allRecords: MaintenanceRecord[] = JSON.parse(localStorage.getItem("vehicle_maintenance") || "[]");
    const vehicleRecords = allRecords.filter((r: MaintenanceRecord) => r.vehicleId === vehicleId);
    setMaintenance(vehicleRecords);
  }, [vehicleId]);

  const handleSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFleetBackendEnabled()) {
      toastManager.show("Vehicle maintenance endpoint is pending integration.", "info");
      setShowScheduleModal(false);
      setEditingRecord(null);
      setNewRecord({ type: "service", date: "", notes: "", cost: "" });
      return;
    }

    if (editingRecord) {
      const updatedRecord: MaintenanceRecord = {
        ...editingRecord,
        ...newRecord
      };

      const allRecords = JSON.parse(localStorage.getItem("vehicle_maintenance") || "[]");
      const updatedRecords = allRecords.map((r: MaintenanceRecord) =>
        r.id === editingRecord.id ? updatedRecord : r
      );
      localStorage.setItem("vehicle_maintenance", JSON.stringify(updatedRecords));

      setMaintenance(maintenance.map(r => r.id === editingRecord.id ? updatedRecord : r));
      setEditingRecord(null);
      toastManager.show("Maintenance record updated successfully!", "success");
    } else {
      const record: MaintenanceRecord = {
        id: Date.now().toString(),
        vehicleId,
        status: "scheduled",
        ...newRecord
      };

      const allRecords = JSON.parse(localStorage.getItem("vehicle_maintenance") || "[]");
      const updatedRecords = [...allRecords, record];
      localStorage.setItem("vehicle_maintenance", JSON.stringify(updatedRecords));

      setMaintenance([...maintenance, record]);
      toastManager.show("Maintenance scheduled successfully!", "success");
    }

    setShowScheduleModal(false);
    setNewRecord({ type: "service", date: "", notes: "", cost: "" });
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
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
            {isFleetBackendEnabled() ? "Schedule (API Pending)" : "+ Schedule Maintenance"}
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
                  {record.status === 'scheduled' && (
                    <button
                      onClick={() => {
                        setEditingRecord(record);
                        setNewRecord({
                          type: record.type,
                          date: record.date,
                          notes: record.notes,
                          cost: record.cost
                        });
                        setShowScheduleModal(true);
                      }}
                      className="mt-2 text-xs font-medium text-ev-green hover:text-ev-green-dark underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <Modal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setEditingRecord(null);
            setNewRecord({ type: "service", date: "", notes: "", cost: "" });
          }}
          title={editingRecord ? "Edit Maintenance Schedule" : "Schedule Maintenance"}
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
                onClick={() => {
                  setShowScheduleModal(false);
                  setEditingRecord(null);
                  setNewRecord({ type: "service", date: "", notes: "", cost: "" });
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                {editingRecord ? "Update Schedule" : "Schedule"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
