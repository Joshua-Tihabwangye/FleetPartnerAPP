import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Modal from "../../../components/ui/Modal";
import { toastManager } from "../../../utils/toastManager";
import {
  getCachedFleetRentals,
  isFleetBackendEnabled,
  refreshFleetWorkspaceState,
} from "../../../services/api/fleetApi";

type RentalDetail = {
  id: string | number;
  backendId?: string;
  bookingId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    plate: string;
    model: string;
    type: string;
  };
  rental: {
    startDate: string;
    endDate: string;
    pickupLocation: string;
    returnLocation: string;
    duration: string;
  };
  pricing: {
    dailyRate: number;
    days: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  status: string;
};

type CachedRental = {
  id?: string | number;
  backendId?: string;
  bookingId?: string;
  customerName?: string;
  vehicleName?: string;
  vehiclePlate?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

function parseDateAsDay(value: string): Date {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function formatDurationDays(startDate: string, endDate: string): string {
  const start = parseDateAsDay(startDate).getTime();
  const end = parseDateAsDay(endDate).getTime();
  const diffDays = Math.max(1, Math.round((end - start) / (24 * 60 * 60 * 1000)) + 1);
  return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
}

function buildPricing(startDate: string, endDate: string) {
  const days = Math.max(1, Number(formatDurationDays(startDate, endDate).split(" ")[0]));
  const dailyRate = 250000;
  const subtotal = dailyRate * days;
  const tax = Math.round(subtotal * 0.18);
  return {
    dailyRate,
    days,
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

function mapCachedRentalToDetail(source: CachedRental): RentalDetail {
  const startDate = source.startDate || new Date().toISOString().split("T")[0];
  const endDate = source.endDate || startDate;
  return {
    id: source.id || source.backendId || source.bookingId || "rental",
    backendId: source.backendId,
    bookingId: source.bookingId || source.backendId || String(source.id || "RNT-UNKNOWN"),
    customer: {
      name: source.customerName || "Unknown customer",
      email: "not-provided@fleet.local",
      phone: "Not provided",
    },
    vehicle: {
      plate: source.vehiclePlate || "-",
      model: source.vehicleName || "Fleet vehicle",
      type: "Rental vehicle",
    },
    rental: {
      startDate,
      endDate,
      pickupLocation: "Fleet branch",
      returnLocation: "Fleet branch",
      duration: formatDurationDays(startDate, endDate),
    },
    pricing: buildPricing(startDate, endDate),
    status: source.status || "pending",
  };
}

function findRentalByRouteId(items: CachedRental[], routeId: string): CachedRental | null {
  const normalizedRouteId = routeId.trim();
  return (
    items.find((item) => String(item.backendId || "") === normalizedRouteId) ||
    items.find((item) => String(item.id || "") === normalizedRouteId) ||
    items.find((item) => String(item.bookingId || "") === normalizedRouteId) ||
    null
  );
}

export default function RentalBookingDetailPage() {
  const { rentalId } = useParams();
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rental, setRental] = useState<RentalDetail | null>(null);

  useEffect(() => {
    const routeId = String(rentalId || "").trim();
    if (!routeId) {
      setLoadError("Missing rental identifier.");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setLoadError(null);

      if (isFleetBackendEnabled()) {
        try {
          await refreshFleetWorkspaceState();
        } catch (error) {
          console.warn("Fleet backend rental detail sync failed.", error);
        }

        const cached = getCachedFleetRentals() as CachedRental[];
        const found = findRentalByRouteId(cached, routeId);
        if (!found) {
          setRental(null);
          setLoadError("Rental booking was not found in backend-synced data.");
          setLoading(false);
          return;
        }

        setRental(mapCachedRentalToDetail(found));
        setLoading(false);
        return;
      }

      const storedRentals = JSON.parse(localStorage.getItem("rentals") || "[]") as CachedRental[];
      const foundLocal = findRentalByRouteId(storedRentals, routeId);
      if (!foundLocal) {
        setRental(null);
        setLoadError("Rental booking not found.");
        setLoading(false);
        return;
      }

      setRental(mapCachedRentalToDetail(foundLocal));
      setLoading(false);
    };

    void load();
  }, [rentalId]);

  const normalizedStatus = useMemo(() => rental?.status?.toLowerCase() || "pending", [rental?.status]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading rental booking...</div>;
  }

  if (!rental) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
        <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-red-600 mb-4">{loadError || "Rental booking not found."}</p>
          <Link
            to="/rentals"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to rentals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
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
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${normalizedStatus === "active" ? "bg-emerald-100 text-emerald-700" :
                normalizedStatus === "completed" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                {normalizedStatus.toUpperCase()}
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
      </div>

      <Modal
        isOpen={showModifyModal}
        onClose={() => setShowModifyModal(false)}
        title="Modify Rental Booking"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toastManager.show("Rental booking modify endpoint is pending integration.", "info");
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
                toastManager.show("Rental cancellation endpoint is pending integration.", "info");
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
