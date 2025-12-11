import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export default function TourDetailPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Load tour data and messages
  React.useEffect(() => {
    if (!tourId) return;
    const storedMessages = JSON.parse(localStorage.getItem(`tour_chat_${tourId}`) || "[]");
    setMessages(storedMessages);
  }, [tourId]);

  const tour = {
    id: tourId,
    name: "Kampala City Tour",
    destination: "Kampala, Uganda",
    date: "2024-02-15",
    duration: "8 hours",
    participants: 12,
    vehicle: "UAA 300K - Toyota Coaster Bus",
    driver: "David Mukasa",
    status: "upcoming",
    description: "Explore the vibrant city of Kampala with visits to historical sites, cultural centers, and local markets."
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: "Fleet Coordinator",
      text: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`tour_chat_${tourId}`, JSON.stringify(updatedMessages));
    setNewMessage("");
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/tours"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-2 inline-block"
          >
            ← Back to tours
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">{tour.name}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{tour.destination}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${tour.status === "upcoming"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : tour.status === "active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
            >
              {tour.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tour Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tour Details</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Date</dt>
                  <dd className="text-sm font-medium text-slate-900 dark:text-slate-200">{tour.date}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Duration</dt>
                  <dd className="text-sm font-medium text-slate-900 dark:text-slate-200">{tour.duration}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Participants</dt>
                  <dd className="text-sm font-medium text-slate-900 dark:text-slate-200">{tour.participants} people</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Vehicle</dt>
                  <dd className="text-sm font-medium text-slate-900 dark:text-slate-200">{tour.vehicle}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Driver</dt>
                  <dd className="text-sm font-medium text-slate-900 dark:text-slate-200">{tour.driver}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Description</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tour.description}</p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tour Chat</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Communicate with tour participants and coordinators</p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${message.isOwn
                          ? "bg-ev-green text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                          }`}
                      >
                        <div className="text-xs font-medium mb-1 opacity-75">
                          {message.sender}
                        </div>
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent dark:text-white dark:placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
