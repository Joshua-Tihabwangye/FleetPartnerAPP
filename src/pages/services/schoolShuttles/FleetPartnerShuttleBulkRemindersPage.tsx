import React, { useState } from "react";
import { toastManager } from "../../../utils/toastManager";

export default function FleetPartnerShuttleBulkRemindersPage() {
  const [formData, setFormData] = useState({
    recipients: "all-parents",
    route: "all",
    messageType: "payment",
    customMessage: ""
  });

  const messageTemplates = {
    payment: "Dear Parent, this is a friendly reminder that your child's shuttle fee for this month is due. Please make payment at your earliest convenience. Thank you.",
    pickup: "Dear Parent, this is a reminder that shuttle pickup will be at the usual time tomorrow. Please ensure your child is ready. Thank you.",
    schedule: "Dear Parent, there has been a change in the shuttle schedule. Please check the updated schedule on the parent portal. Thank you.",
    custom: ""
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastManager.show("Reminders sent successfully!", "success");
    setFormData({
      recipients: "all-parents",
      route: "all",
      messageType: "payment",
      customMessage: ""
    });
  };

  const getMessage = () => {
    return formData.messageType === "custom" ? formData.customMessage : messageTemplates[formData.messageType as keyof typeof messageTemplates];
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Shuttle Bulk Reminders</h1>
          <p className="text-sm text-slate-600">Send mass notifications to parents about payments, schedules, and other updates</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Total Parents</p>
            <p className="text-2xl font-semibold text-slate-900">84</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Active Routes</p>
            <p className="text-2xl font-semibold text-slate-900">6</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Reminders Sent This Month</p>
            <p className="text-2xl font-semibold text-slate-900">142</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Recipients *</span>
                <select
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                  required
                >
                  <option value="all-parents">All Parents</option>
                  <option value="route-specific">Route-Specific Parents</option>
                  <option value="pending-payment">Pending Payments Only</option>
                </select>
              </label>

              {formData.recipients === "route-specific" && (
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1 block">Select Route *</span>
                  <select
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    required
                  >
                    <option value="all">All Routes</option>
                    <option value="route-a">Morning Route A</option>
                    <option value="route-b">Morning Route B</option>
                    <option value="route-c">Afternoon Route A</option>
                  </select>
                </label>
              )}
            </div>

            {/* Message Type */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Message Type *</span>
              <select
                value={formData.messageType}
                onChange={(e) => setFormData({ ...formData, messageType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              >
                <option value="payment">Payment Reminder</option>
                <option value="pickup">Pickup Reminder</option>
                <option value="schedule">Schedule Change</option>
                <option value="custom">Custom Message</option>
              </select>
            </label>

            {/* Message Preview/Custom */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">
                {formData.messageType === "custom" ? "Custom Message *" : "Message Preview"}
              </span>
              {formData.messageType === "custom" ? (
                <textarea
                  value={formData.customMessage}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                  placeholder="Type your custom message here..."
                  required
                />
              ) : (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  {getMessage()}
                </div>
              )}
            </label>

            {/* Estimated Recipients */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">Estimated Recipients</p>
              <p className="text-2xl font-semibold text-blue-700">
                {formData.recipients === "all-parents" ? "84" :
                  formData.recipients === "route-specific" ? "26" :
                    "18"} parents
              </p>
              <p className="text-xs text-blue-700 mt-1">Messages will be sent via SMS and email</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    recipients: "all-parents",
                    route: "all",
                    messageType: "payment",
                    customMessage: ""
                  });
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Send Reminders
              </button>
            </div>
          </form>
        </div>

        {/* Recent Reminders */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Reminders</h2>
          <div className="space-y-3">
            {[
              { date: "2024-01-15", type: "Payment Reminder", recipients: 84, status: "delivered" },
              { date: "2024-01-10", type: "Schedule Change", recipients: 26, status: "delivered" },
              { date: "2024-01-05", type: "Pickup Reminder", recipients: 84, status: "delivered" }
            ].map((reminder, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{reminder.type}</p>
                  <p className="text-xs text-slate-600">{reminder.date} · {reminder.recipients} recipients</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                  {reminder.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
