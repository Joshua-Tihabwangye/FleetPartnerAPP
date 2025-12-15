import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../../components/ui/Modal";
import { toastManager } from "../../../utils/toastManager";

interface Vehicle {
  id: number;
  name: string;
  type: string;
  plate: string;
  pricePerDay: string;
  seats: number;
  range: string;
  features: string[];
  available: boolean;
  image: string;
}

export default function FleetPartnerRentalCatalogPage() {
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [rentalForm, setRentalForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: "",
    endDate: "",
    purpose: ""
  });

  const vehicles: Vehicle[] = [
    {
      id: 1,
      name: "Tesla Model 3",
      type: "Sedan",
      plate: "UAA 123A",
      pricePerDay: "UGX 150,000",
      seats: 5,
      range: "350 km",
      features: ["Auto-pilot", "Premium sound", "Climate control"],
      available: true,
      image: "🚗"
    },
    {
      id: 2,
      name: "Nissan Leaf",
      type: "Hatchback",
      plate: "UAA 124B",
      pricePerDay: "UGX 120,000",
      seats: 5,
      range: "240 km",
      features: ["Eco mode", "Bluetooth", "Backup camera"],
      available: true,
      image: "🚙"
    },
    {
      id: 3,
      name: "BYD E6",
      type: "SUV",
      plate: "UAA 125C",
      pricePerDay: "UGX 180,000",
      seats: 7,
      range: "400 km",
      features: ["Spacious interior", "4WD", "Premium seats"],
      available: true,
      image: "🚐"
    },
    {
      id: 4,
      name: "Toyota Coaster Bus",
      type: "Bus",
      plate: "UAA 300K",
      pricePerDay: "UGX 250,000",
      seats: 30,
      range: "300 km",
      features: ["AC", "Audio system", "Comfortable seating"],
      available: false,
      image: "🚌"
    }
  ];

  const handleRentNow = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowRentalModal(true);
  };

  const handleRentalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedVehicle) return;

    const newRental = {
      id: Date.now(),
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      vehiclePlate: selectedVehicle.plate,
      ...rentalForm, // Use rentalForm here
      status: "active",
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const storedRentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    const updatedRentals = [newRental, ...storedRentals];
    localStorage.setItem("rentals", JSON.stringify(updatedRentals));

    toastManager.show("Vehicle rented successfully!", "success");
    setShowRentalModal(false);
    setSelectedVehicle(null);
    setRentalForm({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      startDate: "",
      endDate: "",
      purpose: ""
    });
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/rentals"
          className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
        >
          ← Back to Rentals Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Rental Catalog</h1>
        <p className="text-sm text-slate-600">Browse and rent vehicles from our fleet</p>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Vehicle Image/Icon */}
            <div className="h-40 bg-gradient-to-br from-ev-green to-emerald-600 flex items-center justify-center text-6xl">
              {vehicle.image}
            </div>

            {/* Vehicle Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{vehicle.name}</h3>
                  <p className="text-sm text-slate-500">{vehicle.type} • {vehicle.plate}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.available
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {vehicle.available ? "Available" : "Rented"}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-ev-green mb-1">{vehicle.pricePerDay}</div>
                <div className="text-xs text-slate-500">per day</div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>👥</span>
                  <span>{vehicle.seats} seats</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>🔋</span>
                  <span>{vehicle.range} range</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-medium text-slate-700 mb-2">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {vehicle.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRentNow(vehicle)}
                disabled={!vehicle.available}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${vehicle.available
                  ? "bg-ev-green text-white hover:bg-ev-green-dark"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {vehicle.available ? "Rent Now" : "Not Available"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rental Modal */}
      <Modal
        isOpen={showRentalModal}
        onClose={() => {
          setShowRentalModal(false);
          setSelectedVehicle(null);
          setRentalForm({
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            startDate: "",
            endDate: "",
            purpose: ""
          });
        }}
        title={`Rent ${selectedVehicle?.name || 'Vehicle'}`}
        size="md"
      >
        <form onSubmit={handleRentalSubmit} className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Selected Vehicle</div>
            <div className="font-semibold text-slate-900">{selectedVehicle?.name}</div>
            <div className="text-sm text-slate-500">{selectedVehicle?.plate}</div>
            <div className="text-lg font-bold text-ev-green mt-2">{selectedVehicle?.pricePerDay}/day</div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Customer Name *</span>
            <input
              type="text"
              value={rentalForm.customerName}
              onChange={(e) => setRentalForm({ ...rentalForm, customerName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              placeholder="e.g., John Doe"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Email *</span>
              <input
                type="email"
                value={rentalForm.customerEmail}
                onChange={(e) => setRentalForm({ ...rentalForm, customerEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                placeholder="email@example.com"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Phone *</span>
              <input
                type="tel"
                value={rentalForm.customerPhone}
                onChange={(e) => setRentalForm({ ...rentalForm, customerPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                placeholder="+256 700 000 000"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Start Date *</span>
              <input
                type="date"
                value={rentalForm.startDate}
                onChange={(e) => setRentalForm({ ...rentalForm, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">End Date *</span>
              <input
                type="date"
                value={rentalForm.endDate}
                onChange={(e) => setRentalForm({ ...rentalForm, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Purpose *</span>
            <textarea
              value={rentalForm.purpose}
              onChange={(e) => setRentalForm({ ...rentalForm, purpose: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              placeholder="Describe the rental purpose..."
              required
            />
          </label>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowRentalModal(false);
                setSelectedVehicle(null);
                setRentalForm({
                  customerName: "",
                  customerEmail: "",
                  customerPhone: "",
                  startDate: "",
                  endDate: "",
                  purpose: ""
                });
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Confirm Rental
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
