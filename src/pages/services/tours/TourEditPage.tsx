import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFleetTourById, patchFleetTour } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

type TourForm = {
  name: string;
  description: string;
  destination: string;
  vehicle: string;
  participants: string;
  date: string;
  status: string;
};

function parseNotes(rawNotes: unknown): Partial<TourForm> {
  if (typeof rawNotes !== "string") return {};
  try {
    const parsed = JSON.parse(rawNotes) as Record<string, unknown>;
    return {
      description: typeof parsed.description === "string" ? parsed.description : undefined,
      destination: typeof parsed.destination === "string" ? parsed.destination : undefined,
      participants: typeof parsed.participants === "number" ? String(parsed.participants) : undefined,
      date: typeof parsed.date === "string" ? parsed.date : undefined,
      vehicle: typeof parsed.vehicle === "string" ? parsed.vehicle : undefined,
    };
  } catch {
    return {};
  }
}

export default function TourEditPage() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<TourForm>({
    name: "",
    description: "",
    destination: "",
    vehicle: "",
    participants: "",
    date: new Date().toISOString().slice(0, 10),
    status: "pending",
  });

  useEffect(() => {
    const load = async () => {
      if (!tourId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getFleetTourById(tourId);
        const notes = parseNotes(response.notes);
        setFormData({
          name: response.customerName || "",
          description: notes.description || "",
          destination: notes.destination || "",
          vehicle: notes.vehicle || response.assetId || "",
          participants: notes.participants || "",
          date: notes.date || new Date(response.scheduledAt).toISOString().slice(0, 10),
          status: response.status,
        });
      } catch (error) {
        console.error("Failed to load tour", error);
        toastManager.show("Failed to load tour", "error");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tourId) return;

    setSaving(true);
    try {
      await patchFleetTour(tourId, {
        customerName: formData.name,
        assetId: formData.vehicle || undefined,
        scheduledAt: new Date(`${formData.date}T08:00:00`).getTime(),
        status: formData.status,
        notes: JSON.stringify({
          description: formData.description,
          destination: formData.destination,
          participants: Number(formData.participants || 0),
          date: formData.date,
          vehicle: formData.vehicle,
        }),
      });
      toastManager.show("Tour updated successfully", "success");
      navigate(`/tours/${tourId}`);
    } catch (error) {
      console.error("Failed to update tour", error);
      toastManager.show("Failed to update tour", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50"><div className="text-center py-12 text-slate-600">Loading tour...</div></div>;
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to={`/tours/${tourId}`} className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">← Back to tour details</Link>
          <h1 className="text-2xl font-semibold text-slate-900">Edit Tour</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Tour Name *</span>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Date</span>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Status</span>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle ID</span>
              <input type="text" value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Participants</span>
              <input type="number" min={0} value={formData.participants} onChange={(e) => setFormData({ ...formData, participants: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Destination</span>
            <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Description</span>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Link to={`/tours/${tourId}`} className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
