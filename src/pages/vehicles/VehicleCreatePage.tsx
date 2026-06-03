import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";
import {
  createFallbackFleetVehicle,
  createFleetVehicle,
  isFleetBackendEnabled,
} from "../../services/api/fleetApi";

interface VehicleFormData {
  plateNumber: string;
  make: string;
  model: string;
  year: string;
  color: string;
  vehicleType: string;
  vin: string;
  registrationExpiry: string;
}

export default function VehicleCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>({
    plateNumber: "",
    make: "",
    model: "",
    year: "",
    color: "",
    vehicleType: "",
    vin: "",
    registrationExpiry: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        plate: formData.plateNumber.trim(),
        type: formData.vehicleType,
        status: "active" as const,
      };

      if (isFleetBackendEnabled()) {
        await createFleetVehicle(payload);
      } else {
        createFallbackFleetVehicle({
          ...payload,
          color: formData.color.trim(),
          vin: formData.vin.trim(),
          registrationExpiry: formData.registrationExpiry,
        });
      }

      toastManager.show("Vehicle created successfully!", "success");
      navigate("/vehicles");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create vehicle.";
      toastManager.show(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <Link
            to="/vehicles"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to vehicles
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Add new vehicle</h1>
          <p className="text-sm text-slate-600">Enter vehicle information to add it to your fleet</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">License plate *</span>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="UAA 123A"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle type *</span>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  required
                >
                  <option value="">Select type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                  <option value="bus">Bus</option>
                  <option value="motorcycle">Motorcycle</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Make *</span>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="Tesla"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Model *</span>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="Model 3"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Year *</span>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="2023"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Color</span>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="White"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">VIN</span>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="Vehicle identification number"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Registration expiry</span>
                <input
                  type="date"
                  value={formData.registrationExpiry}
                  onChange={(e) => setFormData({ ...formData, registrationExpiry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Link
                to="/vehicles"
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {submitting ? "Creating..." : "Create vehicle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
