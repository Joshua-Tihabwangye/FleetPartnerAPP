import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createFleetShuttleTrip } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

export default function ShuttleTripCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    routeId: "",
    vehicleId: "",
    driverId: "",
    date: new Date().toISOString().split("T")[0],
    time: "07:00",
    type: "pickup",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFleetShuttleTrip({
        routeId: formData.routeId,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        type: formData.type,
        scheduledAt: new Date(`${formData.date}T${formData.time}:00`).getTime(),
      });
      toastManager.show("Trip scheduled", "success");
      navigate("/school-shuttles/calendar");
    } catch (error) {
      console.error("Failed to schedule shuttle trip", error);
      toastManager.show("Failed to schedule trip", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <Link to="/school-shuttles/calendar" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition mb-2 inline-block">← Back to Calendar</Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Schedule New Trip</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Route ID</label>
                <input required value={formData.routeId} onChange={(e) => setFormData({ ...formData, routeId: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Trip Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  <option value="pickup">Morning Pickup</option>
                  <option value="dropoff">Afternoon Dropoff</option>
                  <option value="field_trip">Field Trip</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Time</label>
                <input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vehicle ID</label>
                <input required value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Driver ID</label>
                <input required value={formData.driverId} onChange={(e) => setFormData({ ...formData, driverId: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/school-shuttles/calendar")} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-ev-green text-white font-medium hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 disabled:opacity-60">{saving ? "Scheduling..." : "Schedule Trip"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
