import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

export default function TourEditPage() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Kampala City Tour",
    description: "Explore the vibrant city of Kampala with visits to historical sites, cultural centers, and local markets.",
    vehicle: "UAA 123A",
    driver: "David Mukasa",
    capacity: "20",
    price: "150000",
    duration: "8 hours",
    route: "Kampala City Center → Independence Monument → Kasubi Tombs → Namugongo Martyrs Shrine",
    departureTime: "08:00",
    departureLocation: "Kampala Serena Hotel"
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastManager.show("Tour updated successfully!", "success");
    navigate(`/tours/${tourId}`);
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/tours/${tourId}`}
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to tour details
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">Edit Tour</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Tour Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Tour Name *</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  required
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Description</span>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
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
                  <option value="UAA 123A">UAA 123A - Tesla Model X</option>
                  <option value="UAA 124B">UAA 124B - BYD e6</option>
                  <option value="UAA 125C">UAA 125C - Toyota Hiace EV</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Driver *</span>
                <select
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  required
                >
                  <option value="David Mukasa">David Mukasa</option>
                  <option value="John Mukasa">John Mukasa</option>
                  <option value="Sarah Nakato">Sarah Nakato</option>
                  <option value="Peter Ochieng">Peter Ochieng</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Capacity (passengers) *</span>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  min="1"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Price (UGX) *</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  min="0"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Duration</span>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Departure Time</span>
                <input
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Departure Location</span>
                <input
                  type="text"
                  value={formData.departureLocation}
                  onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Route / Itinerary</span>
                <textarea
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Link
              to={`/tours/${tourId}`}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

