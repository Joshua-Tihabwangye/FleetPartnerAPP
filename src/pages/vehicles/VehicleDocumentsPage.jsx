import React from "react";
import { Link, useParams } from "react-router-dom";

export default function VehicleDocumentsPage() {
  const { vehicleId } = useParams();

  const documents = [
    { id: 1, name: "Registration certificate", type: "PDF", uploadDate: "2024-01-01", expiryDate: "2025-12-31" },
    { id: 2, name: "Insurance certificate", type: "PDF", uploadDate: "2024-01-01", expiryDate: "2024-12-31" },
    { id: 3, name: "Inspection report", type: "PDF", uploadDate: "2024-01-10", expiryDate: null }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/vehicles/${vehicleId}`}
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to vehicle
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Vehicle documents</h1>
              <p className="text-sm text-slate-600">Manage all documents for this vehicle</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">
              + Upload document
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{doc.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Type: {doc.type}</span>
                      <span>Uploaded: {doc.uploadDate}</span>
                      {doc.expiryDate && <span>Expires: {doc.expiryDate}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                    View
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
