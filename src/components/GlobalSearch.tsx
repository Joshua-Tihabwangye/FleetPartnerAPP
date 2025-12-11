import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
    type: "driver" | "vehicle" | "trip" | "page";
    id: string;
    title: string;
    subtitle: string;
    link: string;
}

// Mock search data - in production, this would search real data
const searchableItems: SearchResult[] = [
    { type: "page", id: "1", title: "Dashboard", subtitle: "Overview", link: "/dashboard" },
    { type: "page", id: "2", title: "Live Fleet Map", subtitle: "Real-time tracking", link: "/live-map" },
    { type: "page", id: "3", title: "Drivers", subtitle: "Driver management", link: "/drivers" },
    { type: "page", id: "4", title: "Vehicles", subtitle: "Vehicle management", link: "/vehicles" },
    { type: "page", id: "5", title: "Trips", subtitle: "Trips & deliveries", link: "/trips" },
    { type: "page", id: "6", title: "Earnings", subtitle: "Revenue & payouts", link: "/earnings" },
    { type: "page", id: "7", title: "Rentals", subtitle: "Car rental management", link: "/rentals" },
    { type: "page", id: "8", title: "Settings", subtitle: "Account settings", link: "/settings/profile" },
    { type: "page", id: "9", title: "Help & Support", subtitle: "Get help", link: "/help" },
    { type: "driver", id: "d1", title: "John Mukasa", subtitle: "Driver • Active", link: "/drivers/1" },
    { type: "driver", id: "d2", title: "Sarah Namatovu", subtitle: "Driver • Active", link: "/drivers/2" },
    { type: "vehicle", id: "v1", title: "UAA 123B", subtitle: "Toyota Prius • Online", link: "/vehicles/1" },
    { type: "vehicle", id: "v2", title: "UAB 456C", subtitle: "Nissan Leaf • Online", link: "/vehicles/2" },
];

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search logic
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = searchableItems.filter(
            (item) =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.subtitle.toLowerCase().includes(lowerQuery)
        );
        setResults(filtered.slice(0, 8));
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        navigate(result.link);
        setIsOpen(false);
        setQuery("");
    };

    const getTypeIcon = (type: SearchResult["type"]) => {
        switch (type) {
            case "driver": return "👤";
            case "vehicle": return "🚗";
            case "trip": return "📍";
            default: return "📄";
        }
    };

    return (
        <>
            {/* Search Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-500 hover:border-slate-400 hover:text-slate-600 transition min-w-[200px]"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <span>Search...</span>
                <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">⌘K</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[15vh]">
                    <div
                        ref={containerRef}
                        className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search drivers, vehicles, pages..."
                                className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200"
                            >
                                ESC
                            </button>
                        </div>

                        {/* Results */}
                        <div className="max-h-80 overflow-y-auto">
                            {query === "" ? (
                                <div className="px-4 py-6 text-center text-slate-500 text-sm">
                                    Start typing to search...
                                </div>
                            ) : results.length === 0 ? (
                                <div className="px-4 py-6 text-center text-slate-500 text-sm">
                                    No results found for "{query}"
                                </div>
                            ) : (
                                <ul>
                                    {results.map((result) => (
                                        <li key={`${result.type}-${result.id}`}>
                                            <button
                                                onClick={() => handleSelect(result)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition"
                                            >
                                                <span className="text-lg">{getTypeIcon(result.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-slate-900">{result.title}</div>
                                                    <div className="text-xs text-slate-500">{result.subtitle}</div>
                                                </div>
                                                <span className="text-xs text-slate-400">→</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer Hint */}
                        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex gap-4">
                            <span>↑↓ Navigate</span>
                            <span>↵ Select</span>
                            <span>ESC Close</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
