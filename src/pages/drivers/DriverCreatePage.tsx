import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";
import { createFleetDriver, isFleetBackendEnabled } from "../../services/api/fleetApi";

export default function DriverCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    address: ""
  });

  const persistLocally = () => {
    const newDriver = {
      id: Date.now(),
      status: "active",
      trips: 0,
      rating: 5.0,
      ...formData
    };
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    existingDrivers.push(newDriver);
    localStorage.setItem("drivers", JSON.stringify(existingDrivers));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFleetBackendEnabled()) {
      try {
        await createFleetDriver({
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          city: "Kampala",
          serviceModes: ["ride"],
        });
      } catch (error) {
        console.warn("Fleet backend create driver failed. Falling back to local mode.", error);
        persistLocally();
      }
    } else {
      persistLocally();
    }

    toastManager.show("Driver created successfully!", "success");
    navigate("/drivers");
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/drivers"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to drivers
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Add new driver</h1>
          <p className="text-sm text-slate-600">Enter driver information to add them to your fleet</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">
                  Full name *
                </span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">
                  Email address *
                </span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">
                  Phone number *
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="+256 700 000 000"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">
                  License number *
                </span>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">
                  License expiry *
                </span>
                <input
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Address</span>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
              />
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Link
                to="/drivers"
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Create driver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
