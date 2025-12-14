import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

export default function RentalBookingCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    vehicle: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    returnLocation: "",
    specialRequests: ""
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Save to localStorage
    const existingRentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    const newRental = {
      id: Date.now(),
      bookingId: `RNT-${String(existingRentals.length + 1).padStart(3, "0")}`,
      ...formData,
      status: "upcoming",
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("rentals", JSON.stringify([...existingRentals, newRental]));

    toastManager.show("Rental booking created successfully!", "success");
    navigate("/rentals");
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/rentals"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to rentals
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Create Rental Booking</h1>
          <p className="text-sm text-slate-600">Create a new car rental booking</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Customer Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Customer Name *</span>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Email *</span>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Phone *</span>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle *</span>
                <select
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  required
                >
                  <option value="">Select vehicle...</option>
                  <option value="UAA 126D">UAA 126D - Tesla Model 3</option>
                  <option value="UAA 127E">UAA 127E - Nissan Leaf</option>
                  <option value="UAA 128F">UAA 128F - BYD E6</option>
                  <option value="UAA 129G">UAA 129G - Toyota Prius</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Start Date *</span>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">End Date *</span>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Pickup Location *</span>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  placeholder="e.g., Entebbe Airport"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Return Location *</span>
                <input
                  type="text"
                  value={formData.returnLocation}
                  onChange={(e) => setFormData({ ...formData, returnLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  placeholder="e.g., Kampala City Center"
                  required
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Special Requests</span>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  placeholder="Any special requests or notes..."
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Link
              to="/rentals"
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

