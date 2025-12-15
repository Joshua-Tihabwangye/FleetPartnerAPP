import React from "react";
import { useParams, Link } from "react-router-dom";

export default function TourBookingDetailPage() {
  const { bookingId } = useParams();

  // Mock booking data - in real app, fetch from API
  const booking = {
    id: Number(bookingId),
    bookingId: "TUR-001",
    customerName: "Michael Anderson",
    customerEmail: "michael.anderson@example.com",
    customerPhone: "+256 700 123 456",
    tourName: "Murchison Falls Safari - 3 Days",
    startDate: "2024-02-01",
    endDate: "2024-02-03",
    guests: 4,
    totalAmount: 2800000,
    status: "confirmed",
    vehicle: "UAA 450T (Safari Van)",
    driver: "John Mukasa",
    pickupLocation: "Kampala City Center",
    notes: "Customer prefers early morning pickup",
    createdAt: "2024-01-15",
    paymentStatus: "paid"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
      case "pending": return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "in-progress": return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "completed": return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
      case "cancelled": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default: return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/tours/bookings"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block"
          >
            ← Back to bookings
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Tour Booking Details</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Booking ID: {booking.bookingId}</p>
            </div>
            <Link
              to="/tours"
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
            {booking.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Information */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Booking Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Tour Package</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.tourName}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Booking ID</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.bookingId}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Start Date</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {new Date(booking.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">End Date</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {new Date(booking.endDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Number of Guests</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.guests} guests</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Payment Status</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1 capitalize">{booking.paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Name</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.customerName}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Email</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.customerEmail}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Phone</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Notes</h2>
                <p className="text-slate-700 dark:text-slate-300">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    UGX {booking.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Total</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      UGX {booking.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle & Driver */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Assigned Resources</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Vehicle</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.vehicle}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Driver</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.driver}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Pickup Location</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">{booking.pickupLocation}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Actions</h2>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">
                  Edit Booking
                </button>
                <button className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600">
                  Send Confirmation
                </button>
                <button className="w-full px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-slate-700 text-red-700 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20">
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

