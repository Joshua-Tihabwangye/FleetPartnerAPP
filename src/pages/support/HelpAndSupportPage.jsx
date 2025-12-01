import React, { useState } from "react";

export default function HelpAndSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    { id: 1, question: "How do I add a new vehicle?", answer: "Navigate to Vehicles > Add Vehicle and fill in the required information." },
    { id: 2, question: "How do I assign a driver to a vehicle?", answer: "Go to the vehicle detail page and use the Assign Driver option." },
    { id: 3, question: "How do I generate earnings reports?", answer: "Visit the Earnings section and select Statements to view detailed reports." }
  ];

  const supportOptions = [
    { id: 1, title: "Documentation", description: "Browse our comprehensive guides", icon: "📚" },
    { id: 2, title: "Contact support", description: "Get help from our support team", icon: "💬" },
    { id: 3, title: "Video tutorials", description: "Watch step-by-step video guides", icon: "🎥" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
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
    </div>
  );
}
