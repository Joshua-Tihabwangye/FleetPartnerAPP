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
    { type: "page", id: "10", title: "School Shuttles", subtitle: "Shuttle management", link: "/school-shuttles/routes" },
    { type: "page", id: "11", title: "Tours", subtitle: "Tour packages", link: "/tours" },
    { type: "page", id: "12", title: "Ambulance/EMS", subtitle: "Emergency dispatch", link: "/ambulance/dispatch" },
    { type: "page", id: "13", title: "Compliance", subtitle: "Incidents & reports", link: "/compliance" },
    { type: "page", id: "14", title: "Training", subtitle: "Training centre", link: "/training" },
    { type: "driver", id: "d1", title: "John Mukasa", subtitle: "Driver • Active", link: "/drivers/1" },
    { type: "driver", id: "d2", title: "Sarah Namatovu", subtitle: "Driver • Active", link: "/drivers/2" },
    { type: "driver", id: "d3", title: "Peter Ochieng", subtitle: "Driver • On trip", link: "/drivers/3" },
    { type: "vehicle", id: "v1", title: "UAA 123B", subtitle: "Toyota Prius • Online", link: "/vehicles/1" },
    { type: "vehicle", id: "v2", title: "UAB 456C", subtitle: "Nissan Leaf • Online", link: "/vehicles/2" },
    { type: "vehicle", id: "v3", title: "UAC 789D", subtitle: "BYD Atto 3 • Offline", link: "/vehicles/3" },
];

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search logic
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = searchableItems.filter(
            (item) =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.subtitle.toLowerCase().includes(lowerQuery)
        );
        setResults(filtered.slice(0, 10));
        setShowDropdown(true);
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown || results.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            handleSelect(results[selectedIndex]);
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    const handleSelect = (result: SearchResult) => {
        navigate(result.link);
        setQuery("");
        setShowDropdown(false);
    };

    const getTypeIcon = (type: SearchResult["type"]) => {
        switch (type) {
            case "driver": return "👤";
            case "vehicle": return "🚗";
            case "trip": return "📍";
            default: return "📄";
        }
    };

    const getTypeColor = (type: SearchResult["type"]) => {
        switch (type) {
            case "driver": return "bg-blue-100 text-blue-600";
            case "vehicle": return "bg-emerald-100 text-emerald-600";
            case "trip": return "bg-purple-100 text-purple-600";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Inline Search Input */}
            <div className="relative">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
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
                    onFocus={() => query && setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search drivers, vehicles, pages..."
                    className="w-64 lg:w-80 pl-9 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent transition"
                />
            </div>

            {/* Dropdown Results */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden max-h-96 overflow-y-auto">
                    {results.length === 0 ? (
                        <div className="px-4 py-6 text-center text-slate-500 text-sm">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <ul>
                            {results.map((result, index) => (
                                <li key={`${result.type}-${result.id}`}>
                                    <button
                                        onClick={() => handleSelect(result)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${index === selectedIndex ? "bg-slate-100" : "hover:bg-slate-50"
                                            }`}
                                    >
                                        <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm ${getTypeColor(result.type)}`}>
                                            {getTypeIcon(result.type)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-slate-900">{result.title}</div>
                                            <div className="text-xs text-slate-500">{result.subtitle}</div>
                                        </div>
                                        <span className="text-xs text-slate-400 capitalize">{result.type}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {/* Keyboard hint */}
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex gap-4">
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>Esc Close</span>
                    </div>
                </div>
            )}
        </div>
    );
}
