import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createFleetTour } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

export default function TourCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vehicle: "",
    capacity: "",
    departureTime: "",
    departureLocation: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFleetTour({
        customerName: formData.name,
        assetId: formData.vehicle || undefined,
        scheduledAt: Date.now(),
        notes: JSON.stringify({
          description: formData.description,
          capacity: formData.capacity,
          departureTime: formData.departureTime,
          departureLocation: formData.departureLocation,
        }),
      });
      toastManager.show("Tour created successfully", "success");
      navigate("/tours");
    } catch (error) {
      console.error("Failed to create tour", error);
      toastManager.show("Failed to create tour", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <Link to="/tours" className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">← Back to Tours</Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Create New Tour</h1>
          <p className="text-sm text-slate-600">Create a backend-authoritative tour record</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Tour Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Tour Name *</span>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Description</span>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle ID</span>
                <input type="text" value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" placeholder="Optional backend vehicle id" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Capacity</span>
                <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" min="1" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Departure Time</span>
                <input type="time" value={formData.departureTime} onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Departure Location</span>
                <input type="text" value={formData.departureLocation} onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Link to="/tours" className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60">
              {saving ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
