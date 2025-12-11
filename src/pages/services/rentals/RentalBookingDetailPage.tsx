import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Modal from "../../../components/ui/Modal";
import { toastManager } from "../../../utils/toastManager";

export default function RentalBookingDetailPage() {
  const { rentalId } = useParams();
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock data for demonstration
  const rental = {
    id: rentalId,
    bookingId: `RNT${(rentalId || "").toString().padStart(5, '0')}`,
    customer: {
      name: "Sarah Williams",
      email: "sarah.w@email.com",
      phone: "+256 700 123 456"
    },
    vehicle: {
      plate: "UAA 789X",
      model: "Tesla Model S",
      type: "Premium Sedan"
    },
    rental: {
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      pickupLocation: "Entebbe Airport",
      returnLocation: "Kampala City Center",
      duration: "5 days"
    },
    pricing: {
      dailyRate: 250000,
      days: 5,
      subtotal: 1250000,
      tax: 180000,
      total: 1430000
    },
    status: "active"
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Rental Booking {rental.bookingId}
              </h1>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${rental.status === "active" ? "bg-emerald-100 text-emerald-700" :
                rental.status === "completed" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                {rental.status.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModifyModal(true)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Modify
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">Name</span>
                <p className="font-medium text-slate-900">{rental.customer.name}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Email</span>
                <p className="font-medium text-slate-900">{rental.customer.email}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Phone</span>
                <p className="font-medium text-slate-900">{rental.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Vehicle Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">License Plate</span>
                <p className="font-medium text-slate-900">{rental.vehicle.plate}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Model</span>
                <p className="font-medium text-slate-900">{rental.vehicle.model}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Type</span>
                <p className="font-medium text-slate-900">{rental.vehicle.type}</p>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Rental Period</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">Duration</span>
                <p className="font-medium text-slate-900">{rental.rental.duration}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-slate-500">Start Date</span>
                  <p className="font-medium text-slate-900">{rental.rental.startDate}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">End Date</span>
                  <p className="font-medium text-slate-900">{rental.rental.endDate}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-500">Pickup Location</span>
                <p className="font-medium text-slate-900">{rental.rental.pickupLocation}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Return Location</span>
                <p className="font-medium text-slate-900">{rental.rental.returnLocation}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Daily Rate</span>
                <span className="font-medium text-slate-900">UGX {rental.pricing.dailyRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Days</span>
                <span className="font-medium text-slate-900">{rental.pricing.days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">UGX {rental.pricing.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Tax (VAT)</span>
                <span className="font-medium text-slate-900">UGX {rental.pricing.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="text-sm font-semibold text-slate-900">Total Amount</span>
                <span className="text-lg font-bold text-emerald-600">UGX {rental.pricing.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Rental Timeline</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">✓</div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Booking Confirmed</p>
                <p className="text-sm text-slate-600">January 10, 2024 at 10:30 AM</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">↻</div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Rental Active</p>
                <p className="text-sm text-slate-600">Vehicle picked up on January 15, 2024</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold">○</div>
              <div className="flex-1">
                <p className="font-medium text-slate-500">Expected Return</p>
                <p className="text-sm text-slate-600">January 20, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modify Rental Modal */}
      <Modal
        isOpen={showModifyModal}
        onClose={() => setShowModifyModal(false)}
        title="Modify Rental Booking"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toastManager.show("Rental booking modified successfully!", "success");
            setShowModifyModal(false);
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">New End Date *</span>
            <input
              type="date"
              defaultValue={rental.rental.endDate}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Return Location</span>
            <input
              type="text"
              defaultValue={rental.rental.returnLocation}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
            />
          </label>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => setShowModifyModal(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Rental Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Rental Booking"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to cancel rental booking <span className="font-semibold">{rental.bookingId}</span>?
            This action cannot be undone.
          </p>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">
              ⚠️ Cancellation fees may apply based on the cancellation policy.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Keep Booking
            </button>
            <button
              onClick={() => {
                toastManager.show("Rental booking cancelled", "info");
                setShowCancelModal(false);
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
