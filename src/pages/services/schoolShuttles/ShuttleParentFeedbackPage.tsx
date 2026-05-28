import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createFleetShuttleFeedback, listFleetShuttleFeedback } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

type Feedback = {
  id: string;
  parentName: string;
  studentName: string;
  feedbackType: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
};

function normalizeFeedback(raw: Record<string, unknown>, index: number): Feedback {
  return {
    id: String(raw.id ?? `feedback-${index + 1}`),
    parentName: String(raw.parentName ?? "Unknown"),
    studentName: String(raw.studentName ?? "Unknown"),
    feedbackType: String(raw.feedbackType ?? "general"),
    rating: Number(raw.rating ?? 0),
    comment: String(raw.comment ?? ""),
    date: String(raw.date ?? new Date().toISOString().slice(0, 10)),
    status: String(raw.status ?? "new"),
  };
}

export default function ShuttleParentFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ parentName: "", studentName: "", feedbackType: "general", rating: 5, comment: "" });

  const feedbackTypes = useMemo(
    () => [
      { value: "general", label: "General Feedback" },
      { value: "driver", label: "Driver Performance" },
      { value: "vehicle", label: "Vehicle Condition" },
      { value: "punctuality", label: "Punctuality" },
      { value: "safety", label: "Safety Concerns" },
      { value: "communication", label: "Communication" },
      { value: "service", label: "Overall Service" },
    ],
    [],
  );

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const rows = await listFleetShuttleFeedback();
      setFeedbacks(rows.map((entry, index) => normalizeFeedback(entry, index)));
    } catch (error) {
      console.error("Failed to load shuttle feedback", error);
      toastManager.show("Failed to load feedback from backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFleetShuttleFeedback({
        ...formData,
        date: new Date().toISOString().slice(0, 10),
        status: "new",
      });
      toastManager.show("Feedback submitted successfully", "success");
      setShowAddModal(false);
      setFormData({ parentName: "", studentName: "", feedbackType: "general", rating: 5, comment: "" });
      await loadFeedback();
    } catch (error) {
      console.error("Failed to create feedback", error);
      toastManager.show("Failed to submit feedback", "error");
    } finally {
      setSaving(false);
    }
  };

  const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : "0.0";

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full">
        <div className="mb-6">
          <Link to="/school-shuttles" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block">← Back to dashboard</Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Parent Feedback & Ratings</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">View and manage parent feedback from backend records</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">+ Add Feedback</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500 mb-1">Total Feedback</p><p className="text-2xl font-semibold text-slate-900">{feedbacks.length}</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500 mb-1">Average Rating</p><p className="text-2xl font-semibold text-slate-900">{avgRating}</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500 mb-1">New Feedback</p><p className="text-2xl font-semibold text-slate-900">{feedbacks.filter((f) => f.status === "new").length}</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500 mb-1">This Month</p><p className="text-2xl font-semibold text-slate-900">{feedbacks.filter((f) => new Date(f.date).getMonth() === new Date().getMonth()).length}</p></div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">All Feedback</h2>
          {loading ? (
            <div className="py-8 text-center text-slate-600">Loading feedback...</div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12"><p className="text-slate-600 dark:text-slate-400 mb-4">No feedback submitted yet</p></div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">{feedbackTypes.find((t) => t.value === feedback.feedbackType)?.label || feedback.feedbackType}</span>
                    <span className="text-xs text-slate-500">{feedback.date}</span>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{feedback.parentName} - {feedback.studentName}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{feedback.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Submit Feedback</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Parent Name *</span><input type="text" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Student Name *</span><input type="text" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              </div>
              <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Feedback Type *</span><select value={formData.feedbackType} onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm">{feedbackTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Rating *</span><input type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Comment *</span><textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <div className="flex gap-2 pt-2"><button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm">Cancel</button><button type="submit" disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm disabled:opacity-60">{saving ? "Submitting..." : "Submit Feedback"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
