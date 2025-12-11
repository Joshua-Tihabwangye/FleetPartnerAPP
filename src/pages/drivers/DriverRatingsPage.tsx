import React from "react";
import { Link, useParams } from "react-router-dom";

export default function DriverRatingsPage() {
  const { driverId } = useParams();

  const ratings = [
    { id: 1, rating: 5, comment: "Excellent driver, very professional", date: "2024-01-15", trip: "Trip #123" },
    { id: 2, rating: 4, comment: "Good service, arrived on time", date: "2024-01-14", trip: "Trip #122" },
    { id: 3, rating: 5, comment: "Perfect ride, highly recommended", date: "2024-01-13", trip: "Trip #121" }
  ];

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/drivers/${driverId}`}
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to driver profile
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Driver ratings & reviews</h1>
          <p className="text-sm text-slate-600">Customer feedback and ratings for this driver</p>
        </div>

        {/* Overall Rating */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-semibold text-slate-900 mb-1">4.8</div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <div className="text-sm text-slate-600">Based on 142 reviews</div>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 w-8">{stars}⭐</span>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${(stars === 5 ? 80 : stars === 4 ? 15 : 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {ratings.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`text-sm ${i <= review.rating ? "text-yellow-400" : "text-slate-300"}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{review.trip}</span>
                  </div>
                  <div className="text-xs text-slate-500">{review.date}</div>
                </div>
              </div>
              <p className="text-sm text-slate-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
