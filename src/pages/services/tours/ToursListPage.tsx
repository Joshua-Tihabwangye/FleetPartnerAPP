import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listFleetTours } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

type Tour = {
  id: string;
  name: string;
  vehicle: string;
  status: string;
  bookings: number;
  capacity: number;
};

export default function ToursListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const rows = await listFleetTours();
        setTours(
          rows.map((entry, index) => ({
            id: String(entry.id),
            name: entry.customerName || `Tour ${index + 1}`,
            vehicle: entry.assetId || "Unassigned",
            status: entry.status === "pending" ? "scheduled" : entry.status,
            bookings: 0,
            capacity: 20,
          })),
        );
      } catch (error) {
        console.error("Failed to load tours", error);
        toastManager.show("Failed to load tours from backend", "error");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredTours = useMemo(
    () => tours.filter((tour) => tour.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, tours],
  );

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Tours & charters</h1>
          <p className="text-sm text-slate-600">Manage tour packages and charter services</p>
        </div>
        <div className="flex gap-2">
          <Link to="/tours/bookings" className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">View bookings</Link>
          <Link to="/tours/create" className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">+ Create Tour</Link>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tours by name..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading tours...</div>
      ) : filteredTours.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-700 font-medium">No tours found</p>
          <p className="text-sm text-slate-500 mt-1">Create a tour to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTours.map((tour) => (
            <Link key={tour.id} to={`/tours/${tour.id}`} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{tour.name}</h3>
                  <div className="text-sm text-slate-600">Vehicle: {tour.vehicle}</div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${tour.status === "active" ? "bg-emerald-100 text-emerald-700" : tour.status === "scheduled" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}>
                  {tour.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bookings</span>
                  <span className="font-medium text-slate-900">{tour.bookings}/{tour.capacity}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-ev-green h-2 rounded-full" style={{ width: `${(tour.bookings / Math.max(tour.capacity, 1)) * 100}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
