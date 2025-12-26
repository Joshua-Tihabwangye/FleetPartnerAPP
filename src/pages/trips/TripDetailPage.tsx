import React from "react";
import { Link, useParams } from "react-router-dom";

interface TimelineStep {
  id: string;
  label: string;
  status: "completed" | "current" | "pending" | "cancelled";
  timestamp?: string;
}

export default function TripDetailPage() {
  const { tripId } = useParams();

  // Mock trip data
  const trip = {
    id: tripId,
    tripId: `TR-00${tripId}`,
    status: "completed",
    driver: "John Doe",
    driverPhone: "+256 700 000 001",
    vehicle: "UAA 123A",
    vehicleModel: "Tesla Model 3",
    pickup: "Garden City Mall, Kampala",
    dropoff: "Entebbe International Airport",
    distance: "42.5 km",
    duration: "1h 15m",
    date: "2024-01-15",
    serviceType: "ride",
    customer: {
      name: "Sarah Johnson",
      phone: "+256 755 123 456",
    },
    // Payment details
    payment: {
      fare: 45000,
      platformFee: 4500,
      partnerPayout: 40500,
      status: "paid" as "pending" | "paid" | "disputed",
    },
    // Timeline
    timeline: [
      { id: "created", label: "Created", status: "completed", timestamp: "14:25" },
      { id: "assigned", label: "Assigned", status: "completed", timestamp: "14:26" },
      { id: "accepted", label: "Accepted", status: "completed", timestamp: "14:27" },
      { id: "arrived", label: "Arrived at pickup", status: "completed", timestamp: "14:32" },
      { id: "started", label: "Trip started", status: "completed", timestamp: "14:35" },
      { id: "completed", label: "Completed", status: "completed", timestamp: "15:50" },
    ] as TimelineStep[],
  };

  const paymentStatusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    disputed: "bg-red-100 text-red-700 border-red-200",
  };

  const serviceIcons: Record<string, string> = {
    ride: "🚗",
    delivery: "📦",
    shuttle: "🚌",
    ems: "🚑",
    tour: "🌍",
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/trips"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-flex items-center gap-1"
          >
            ← Back to trips
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-slate-900">Trip #{tripId}</h1>
                <span className="text-xl">{serviceIcons[trip.serviceType]}</span>
              </div>
              <p className="text-sm text-slate-600">Trip details and information</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-700">
              Completed
            </span>
          </div>
        </div>

        {/* Trip Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Trip Timeline</h2>
          <div className="relative">
            <div className="flex items-center justify-between">
              {trip.timeline.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  {/* Connector line */}
                  {idx > 0 && (
                    <div
                      className={`absolute h-1 ${step.status === 'completed' ? 'bg-ev-green' : 'bg-slate-200'}`}
                      style={{
                        left: `${(idx - 0.5) * (100 / trip.timeline.length)}%`,
                        width: `${100 / trip.timeline.length}%`,
                        top: '14px'
                      }}
                    />
                  )}
                  {/* Step circle */}
                  <div
                    className={`relative z-10 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${step.status === 'completed'
                        ? 'bg-ev-green text-white'
                        : step.status === 'current'
                          ? 'bg-blue-500 text-white animate-pulse'
                          : step.status === 'cancelled'
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-200 text-slate-400'
                      }`}
                  >
                    {step.status === 'completed' ? '✓' : step.status === 'cancelled' ? '✕' : idx + 1}
                  </div>
                  {/* Label */}
                  <div className="mt-2 text-center">
                    <div className="text-xs font-medium text-slate-700">{step.label}</div>
                    {step.timestamp && (
                      <div className="text-[10px] text-slate-400">{step.timestamp}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Trip Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Trip Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Driver</dt>
                <dd className="text-sm font-medium text-slate-900">{trip.driver}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Driver Phone</dt>
                <dd className="text-sm font-medium text-slate-900">{trip.driverPhone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Vehicle</dt>
                <dd className="text-sm font-medium text-slate-900">{trip.vehicle} ({trip.vehicleModel})</dd>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <dt className="text-sm text-slate-500 mb-1">Pickup location</dt>
                <dd className="text-sm font-medium text-slate-900">📍 {trip.pickup}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500 mb-1">Drop-off location</dt>
                <dd className="text-sm font-medium text-slate-900">📍 {trip.dropoff}</dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <dt className="text-sm text-slate-500">Distance</dt>
                <dd className="text-sm font-medium text-slate-900">{trip.distance}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Duration</dt>
                <dd className="text-sm font-medium text-slate-900">{trip.duration}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Date & time</dt>
                <dd className="text-sm font-medium text-slate-900">{trip.date} 14:30</dd>
              </div>
            </dl>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${paymentStatusStyles[trip.payment.status]}`}>
                {trip.payment.status.charAt(0).toUpperCase() + trip.payment.status.slice(1)}
              </span>
            </div>
            <dl className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <dt className="text-sm text-slate-500">Total Fare</dt>
                <dd className="text-sm font-bold text-slate-900">UGX {trip.payment.fare.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <dt className="text-sm text-slate-500">Platform Fee (10%)</dt>
                <dd className="text-sm font-medium text-red-600">- UGX {trip.payment.platformFee.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between py-3 bg-emerald-50 rounded-lg px-3 -mx-3">
                <dt className="text-sm font-semibold text-emerald-700">Partner Payout</dt>
                <dd className="text-lg font-bold text-emerald-700">UGX {trip.payment.partnerPayout.toLocaleString()}</dd>
              </div>
            </dl>

            {/* Customer Info */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Customer</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">{trip.customer.name}</div>
                  <div className="text-xs text-slate-500">{trip.customer.phone}</div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                    📞
                  </button>
                  <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                    💬
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route Map */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Route</h2>
          <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Grid lines to simulate map */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* Start and end markers */}
            <div className="absolute left-1/4 top-1/3 flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-ev-green text-white flex items-center justify-center text-sm font-bold shadow-lg">A</div>
              <div className="mt-1 px-2 py-1 bg-white rounded text-[10px] font-medium shadow-sm">Pickup</div>
            </div>
            <div className="absolute right-1/4 bottom-1/3 flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">B</div>
              <div className="mt-1 px-2 py-1 bg-white rounded text-[10px] font-medium shadow-sm">Drop-off</div>
            </div>

            {/* Dotted line between points */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <path
                d="M 25% 33% Q 50% 50% 75% 66%"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="8 4"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
            Download Receipt
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}
