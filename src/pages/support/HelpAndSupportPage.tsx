import React, { useState } from "react";
import Modal from "../../components/ui/Modal";
import { toastManager } from "../../utils/toastManager";

type SupportAction = "documentation" | "email" | "videos";

interface SupportOption {
  id: number;
  title: string;
  description: string;
  icon: string;
  action: SupportAction;
}

export default function HelpAndSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqs = [
    { id: 1, question: "How do I add a new vehicle?", answer: "Navigate to Vehicles > Add Vehicle and fill in the required information." },
    { id: 2, question: "How do I assign a driver to a vehicle?", answer: "Go to the vehicle detail page and use the Assign Driver option." },
    { id: 3, question: "How do I generate earnings reports?", answer: "Visit the Earnings section and select Statements to view detailed reports." }
  ];

  const supportOptions: SupportOption[] = [
    { id: 1, title: "Documentation", description: "Browse our comprehensive guides", icon: "📚", action: "documentation" },
    { id: 2, title: "Contact support", description: "Get help from our support team", icon: "💬", action: "email" },
    { id: 3, title: "Video tutorials", description: "Watch step-by-step video guides", icon: "🎥", action: "videos" }
  ];

  const handleSupportCardClick = (action: SupportAction) => {
    if (action === "email") {
      setShowEmailModal(true);
    } else if (action === "documentation") {
      toastManager.show("Documentation coming soon!", "info");
    } else if (action === "videos") {
      toastManager.show("Video tutorials coming soon!", "info");
    }
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const supportRequest = {
      id: Date.now(),
      ...emailForm,
      createdAt: new Date().toISOString(),
      status: "sent"
    };

    // Save to localStorage
    const storedRequests = JSON.parse(localStorage.getItem("support_messages") || "[]");
    const updatedRequests = [supportRequest, ...storedRequests];
    localStorage.setItem("support_messages", JSON.stringify(updatedRequests));

    toastManager.show("Support request submitted successfully! We'll get back to you soon.", "success");
    setShowEmailModal(false);
    setEmailForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Help & support</h1>
          <p className="text-sm text-slate-600">Find answers and get help with Fleet Partner</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
          />
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {supportOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSupportCardClick(option.action)}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all cursor-pointer"
            >
              <div className="text-3xl mb-3">{option.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{option.title}</h3>
              <p className="text-sm text-slate-600">{option.description}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="pb-4 border-b border-slate-100 last:border-0">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Contact Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setEmailForm({ name: "", email: "", subject: "", message: "" });
        }}
        title="Contact Support"
        size="md"
      >
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Your Name *</span>
            <input
              type="text"
              value={emailForm.name}
              onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              placeholder="e.g., John Doe"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Email Address *</span>
            <input
              type="email"
              value={emailForm.email}
              onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              placeholder="your.email@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Subject *</span>
            <input
              type="text"
              value={emailForm.subject}
              onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              placeholder="Brief description of your issue"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Message *</span>
            <textarea
              value={emailForm.message}
              onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              placeholder="Describe your issue or question in detail..."
              required
            />
          </label>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEmailModal(false);
                setEmailForm({ name: "", email: "", subject: "", message: "" });
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Send Message
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
