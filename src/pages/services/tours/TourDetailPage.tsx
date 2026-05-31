import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createFleetTourMessage, getFleetTourById, listFleetTourMessages } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
};

type Tour = {
  id: string;
  name: string;
  destination: string;
  date: string;
  participants: number;
  vehicle: string;
  status: string;
  description: string;
};

function parseTourNotes(rawNotes: unknown): Partial<Tour> {
  if (typeof rawNotes !== "string") return {};
  try {
    const parsed = JSON.parse(rawNotes) as Record<string, unknown>;
    return {
      description: typeof parsed.description === "string" ? parsed.description : undefined,
      destination: typeof parsed.destination === "string" ? parsed.destination : undefined,
      participants: typeof parsed.participants === "number" ? parsed.participants : undefined,
      date: typeof parsed.date === "string" ? parsed.date : undefined,
      vehicle: typeof parsed.vehicle === "string" ? parsed.vehicle : undefined,
    };
  } catch {
    return {};
  }
}

function normalizeMessage(raw: Record<string, unknown>, index: number): Message {
  const timestampRaw = Number(raw.timestamp ?? raw.createdAt ?? Date.now());
  return {
    id: String(raw.id ?? `message-${index}`),
    sender: String(raw.sender ?? "Fleet Coordinator"),
    text: String(raw.text ?? ""),
    timestamp: new Date(Number.isFinite(timestampRaw) ? timestampRaw : Date.now()).toISOString(),
    isOwn: Boolean(raw.isOwn ?? false),
  };
}

export default function TourDetailPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!tourId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [tourResponse, messagesResponse] = await Promise.all([
          getFleetTourById(tourId),
          listFleetTourMessages(tourId),
        ]);

        const notes = parseTourNotes(tourResponse.notes);
        setTour({
          id: String(tourResponse.id),
          name: tourResponse.customerName || "Untitled tour",
          destination: notes.destination || "Not set",
          date: notes.date || new Date(tourResponse.scheduledAt).toISOString().slice(0, 10),
          participants: notes.participants || 0,
          vehicle: notes.vehicle || tourResponse.assetId || "Unassigned",
          status: tourResponse.status,
          description: notes.description || "No description provided.",
        });
        setMessages(messagesResponse.map((item, idx) => normalizeMessage(item, idx)));
      } catch (error) {
        console.error("Failed to load tour detail", error);
        toastManager.show("Failed to load tour details from backend", "error");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [tourId]);

  const sortedMessages = useMemo(
    () => messages.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [messages],
  );

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tourId || !newMessage.trim()) return;

    setSending(true);
    try {
      const created = await createFleetTourMessage(tourId, {
        sender: "Fleet Coordinator",
        text: newMessage.trim(),
        isOwn: true,
      });
      setMessages((prev) => [...prev, normalizeMessage(created, prev.length)]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send tour message", error);
      toastManager.show("Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50"><div className="text-center py-12 text-slate-600">Loading tour details...</div></div>;
  }

  if (!tour) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
        <div className="text-center py-12">
          <p className="text-slate-700 font-medium">Tour not found</p>
          <Link to="/tours" className="text-sm text-ev-green hover:text-ev-green-dark">Back to tours</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <Link to="/tours" className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">← Back to tours</Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">{tour.name}</h1>
              <p className="text-sm text-slate-600">{tour.destination}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">{tour.status}</span>
              <Link to={`/tours/${tourId}/edit`} className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">Edit Tour</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Tour Details</h2>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-slate-500">Date</dt><dd className="font-medium text-slate-900">{tour.date}</dd></div>
                <div><dt className="text-slate-500">Participants</dt><dd className="font-medium text-slate-900">{tour.participants}</dd></div>
                <div><dt className="text-slate-500">Vehicle</dt><dd className="font-medium text-slate-900">{tour.vehicle}</dd></div>
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{tour.description}</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-[70vh] lg:h-[600px]">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900">Tour Chat</h2>
                <p className="text-xs text-slate-500">Messages are stored through backend `/fleet/tours/:tourId/messages`.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {sortedMessages.length === 0 ? (
                  <div className="text-center py-8 text-slate-500"><p className="text-sm">No messages yet.</p></div>
                ) : (
                  sortedMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-4 py-2 ${message.isOwn ? "bg-ev-green text-white" : "bg-slate-100 text-slate-900"}`}>
                        <div className="text-xs font-medium mb-1 opacity-75">{message.sender}</div>
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-75">{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50">
                <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                  <button type="submit" disabled={sending} className="w-full sm:w-auto px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:opacity-60">
                    {sending ? "Sending..." : "Send"}
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
