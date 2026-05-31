import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createFleetShuttleRoute } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

export default function ShuttleRouteCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    pickupTime: "",
    dropoffTime: "",
    vehicle: "",
    driver: "",
    capacity: "",
    daysOfWeek: [] as string[],
    stops: [{ name: "", time: "" }],
  });

  const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day) ? prev.daysOfWeek.filter((d) => d !== day) : [...prev.daysOfWeek, day],
    }));
  };

  const addStop = () => setFormData((prev) => ({ ...prev, stops: [...prev.stops, { name: "", time: "" }] }));
  const removeStop = (index: number) => setFormData((prev) => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }));
  const updateStop = (index: number, field: string, value: string) => setFormData((prev) => ({ ...prev, stops: prev.stops.map((stop, i) => (i === index ? { ...stop, [field]: value } : stop)) }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFleetShuttleRoute({
        name: formData.name,
        school: formData.school,
        pickupTime: formData.pickupTime,
        dropoffTime: formData.dropoffTime,
        vehicle: formData.vehicle,
        driver: formData.driver,
        capacity: Number(formData.capacity || 0),
        daysOfWeek: formData.daysOfWeek,
        stops: formData.stops,
        status: "active",
      });
      toastManager.show("Shuttle route created", "success");
      navigate("/school-shuttles/routes");
    } catch (error) {
      console.error("Failed to create route", error);
      toastManager.show("Failed to create shuttle route", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <Link to="/school-shuttles/routes" className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">← Back to Routes</Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Create Shuttle Route</h1>
          <p className="text-sm text-slate-600">Create a backend-authoritative school route</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Route Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700 mb-1 block">Route Name *</span><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
                <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700 mb-1 block">School *</span><input type="text" value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Morning Pickup</span><input type="time" value={formData.pickupTime} onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Afternoon Dropoff</span><input type="time" value={formData.dropoffTime} onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle</span><input type="text" value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Driver</span><input type="text" value={formData.driver} onChange={(e) => setFormData({ ...formData, driver: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Capacity</span><input type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" /></label>
                <div className="block">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Operating Days</span>
                  <div className="flex flex-wrap gap-2">
                    {daysOptions.map((day) => (
                      <label key={day} className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${formData.daysOfWeek.includes(day) ? "bg-ev-green text-white" : "bg-slate-100 text-slate-600"}`}>
                        <input type="checkbox" className="sr-only" checked={formData.daysOfWeek.includes(day)} onChange={() => handleDayToggle(day)} />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Route Stops</h2>
                <button type="button" onClick={addStop} className="text-sm text-ev-green hover:text-ev-green-dark font-medium">+ Add Stop</button>
              </div>
              <div className="space-y-3">
                {formData.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-ev-green text-white text-xs flex items-center justify-center">{index + 1}</span>
                    <input type="text" value={stop.name} onChange={(e) => updateStop(index, "name", e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm" placeholder="Stop location" />
                    <input type="time" value={stop.time} onChange={(e) => updateStop(index, "time", e.target.value)} className="w-28 px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    {formData.stops.length > 1 && <button type="button" onClick={() => removeStop(index)} className="text-red-500">🗑️</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Link to="/school-shuttles/routes" className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60">{saving ? "Creating..." : "Create Route"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
