import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageState from "../../../components/ui/PageState";
import {
  getCachedFleetRentals,
  isFleetBackendEnabled,
  listFleetRentals,
  refreshFleetWorkspaceState,
} from "../../../services/api/fleetApi";

interface Rental {
  id: number | string;
  backendId?: string;
  bookingId: string;
  customerName: string;
  vehicleName?: string;
  vehiclePlate: string;
  status: string;
  startDate: string;
  endDate: string;
}

export default function RentalsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    if (isFleetBackendEnabled()) {
      try {
        await refreshFleetWorkspaceState();
        const backendRentals = await listFleetRentals();
        const mapped: Rental[] = backendRentals.map((item, index) => ({
          id: index + 1,
          backendId: item.id,
          bookingId: item.id,
          customerName: item.customerName,
          vehicleName: item.assetId || "Fleet vehicle",
          vehiclePlate: item.assetId || "-",
          status: item.status,
          startDate: new Date(item.scheduledAt).toISOString().slice(0, 10),
          endDate: new Date(item.scheduledAt).toISOString().slice(0, 10),
        }));
        setRentals(mapped);
        setLoading(false);
        return;
      } catch (error) {
        console.warn("Fleet backend rentals fetch failed. Using cached rentals.", error);
        setLoadError("Failed to refresh rentals from backend. Showing the last synced cache if available.");
      }
    }

    setRentals(getCachedFleetRentals() as Rental[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredRentals = rentals.filter((rental) => {
    const query = searchQuery.toLowerCase();
    return (
      (rental.bookingId && rental.bookingId.toLowerCase().includes(query)) ||
      (rental.customerName && rental.customerName.toLowerCase().includes(query)) ||
      (rental.vehiclePlate && rental.vehiclePlate.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Rental bookings</h1>
          <p className="text-sm text-slate-600">Manage car rental bookings and reservations</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/rentals/bookings/create"
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
          >
            + New Booking
          </Link>
          <Link
            to="/rentals/catalog"
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
          >
            Catalog
          </Link>
          <Link
            to="/settings/rentals"
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
          >
            Settings
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bookings by ID, customer, vehicle..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {loading ? (
        <PageState kind="loading" title="Loading rentals" message="Fetching rental bookings from the backend." />
      ) : loadError && rentals.length === 0 ? (
        <PageState kind="error" title="Rental sync failed" message={loadError} actionLabel="Retry" onAction={() => void load()} />
      ) : filteredRentals.length === 0 ? (
        <PageState
          kind="empty"
          title="No rentals found"
          message="Create a rental booking or sync the backend workspace to populate this list."
          actionLabel="Refresh"
          onAction={() => void load()}
        />
      ) : (
        <>
          {loadError ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              {loadError}
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRentals.map((rental) => (
              <Link
                key={rental.id}
                to={`/rentals/${rental.backendId || rental.id}`}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-lg font-semibold text-slate-900 mb-1">{rental.bookingId || `RNT-${rental.id}`}</div>
                    <div className="text-sm text-slate-600">{rental.customerName}</div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${rental.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : rental.status === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {rental.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vehicle</span>
                    <span className="font-medium text-slate-900">{rental.vehicleName || rental.vehiclePlate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Plate</span>
                    <span className="font-medium text-slate-900">{rental.vehiclePlate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Start date</span>
                    <span className="font-medium text-slate-900">{rental.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">End date</span>
                    <span className="font-medium text-slate-900">{rental.endDate}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
