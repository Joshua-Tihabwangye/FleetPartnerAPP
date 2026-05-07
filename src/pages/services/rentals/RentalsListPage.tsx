import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Rental {
  id: number;
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

  // Load rentals from localStorage
  React.useEffect(() => {
    const storedRentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    if (storedRentals.length === 0) {
      // Initialize with mock data if empty
      const mockRentals: Rental[] = [
        { id: 1, bookingId: "RNT-001", customerName: "John Customer", vehicleName: "Tesla Model 3", vehiclePlate: "UAA 123A", status: "active", startDate: "2024-01-15", endDate: "2024-01-20" },
        { id: 2, bookingId: "RNT-002", customerName: "Jane Client", vehicleName: "Nissan Leaf", vehiclePlate: "UAA 124B", status: "upcoming", startDate: "2024-01-18", endDate: "2024-01-25" },
        { id: 3, bookingId: "RNT-003", customerName: "Mike User", vehicleName: "BYD E6", vehiclePlate: "UAA 125C", status: "completed", startDate: "2024-01-10", endDate: "2024-01-14" }
      ];
      localStorage.setItem("rentals", JSON.stringify(mockRentals));
      setRentals(mockRentals);
    } else {
      setRentals(storedRentals);
    }
  }, []);

  const filteredRentals = rentals.filter(rental => {
    const query = searchQuery.toLowerCase();
    return (
      (rental.bookingId && rental.bookingId.toLowerCase().includes(query)) ||
      (rental.customerName && rental.customerName.toLowerCase().includes(query)) ||
      (rental.vehiclePlate && rental.vehiclePlate.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bookings by ID, customer, vehicle..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {/* Rentals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRentals.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-500">
            No rentals found. Visit the catalog to rent a vehicle.
          </div>
        ) : (
          filteredRentals.map((rental) => (
            <Link
              key={rental.id}
              to={`/rentals/${rental.id}`}
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
          ))
        )}
      </div>
    </div>
  );
}
