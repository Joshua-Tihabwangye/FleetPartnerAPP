import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

interface Feedback {
  id: number;
  parentName: string;
  studentName: string;
  feedbackType: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
}

export default function ShuttleParentFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    feedbackType: "general",
    rating: 5,
    comment: ""
  });

  // Load feedbacks from localStorage
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("parentFeedbacks") || "[]");
    setFeedbacks(stored);
  }, []);

  const feedbackTypes = [
    { value: "general", label: "General Feedback" },
    { value: "driver", label: "Driver Performance" },
    { value: "vehicle", label: "Vehicle Condition" },
    { value: "punctuality", label: "Punctuality" },
    { value: "safety", label: "Safety Concerns" },
    { value: "communication", label: "Communication" },
    { value: "service", label: "Overall Service" }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFeedback: Feedback = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: "new"
    };
    
    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("parentFeedbacks", JSON.stringify(updated));
    
    toastManager.show("Feedback submitted successfully!", "success");
    setShowAddModal(false);
    setFormData({
      parentName: "",
      studentName: "",
      feedbackType: "general",
      rating: 5,
      comment: ""
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-slate-300 dark:text-slate-600"}>
        ⭐
      </span>
    ));
  };

  const getFeedbackTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      driver: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      vehicle: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
      punctuality: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      safety: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      communication: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
      service: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
    };
    return colors[type] || colors.general;
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/school-shuttles"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block"
          >
            ← Back to dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Parent Feedback & Ratings</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">View and manage parent feedback and ratings</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              + Add Feedback
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 via-slate-400 to-emerald-600 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-white shadow-lg">
            <p className="text-sm text-white/90 mb-1">Total Feedback</p>
            <p className="text-2xl font-semibold text-white">{feedbacks.length}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-white shadow-lg">
            <p className="text-sm text-white/90 mb-1">Average Rating</p>
            <p className="text-2xl font-semibold text-white">
              {feedbacks.length > 0
                ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                : "0.0"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-400 via-orange-400 to-orange-500 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-white shadow-lg">
            <p className="text-sm text-white/90 mb-1">New Feedback</p>
            <p className="text-2xl font-semibold text-white">
              {feedbacks.filter(f => f.status === "new").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 via-slate-400 to-orange-500 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-white shadow-lg">
            <p className="text-sm text-white/90 mb-1">This Month</p>
            <p className="text-2xl font-semibold text-white">
              {feedbacks.filter(f => {
                const feedbackDate = new Date(f.date);
                const now = new Date();
                return feedbackDate.getMonth() === now.getMonth() && feedbackDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">All Feedback</h2>
          {feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 mb-4">No feedback submitted yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Add First Feedback
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFeedbackTypeColor(feedback.feedbackType)}`}>
                          {feedbackTypes.find(t => t.value === feedback.feedbackType)?.label || feedback.feedbackType}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{feedback.date}</span>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {feedback.parentName} - {feedback.studentName}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        {getRatingStars(feedback.rating)}
                        <span className="text-sm text-slate-600 dark:text-slate-400">({feedback.rating}/5)</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{feedback.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Feedback Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Submit Feedback</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Parent Name *</span>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Student Name *</span>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    required
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Feedback Type *</span>
                <select
                  value={formData.feedbackType}
                  onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                  required
                >
                  {feedbackTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Rating *</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className={`text-2xl ${rating <= formData.rating ? "text-yellow-400" : "text-slate-300 dark:text-slate-600"}`}
                    >
                      ⭐
                    </button>
                  ))}
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">({formData.rating}/5)</span>
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Comment *</span>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                  placeholder="Share your feedback..."
                  required
                />
              </label>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

