import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications, Notification } from "../context/NotificationsContext";

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getTypeColor = (type: Notification["type"]) => {
        switch (type) {
            case "success": return "bg-emerald-100 text-emerald-600";
            case "warning": return "bg-orange-100 text-orange-600";
            case "error": return "bg-red-100 text-red-600";
            default: return "bg-blue-100 text-blue-600";
        }
    };

    const getTypeIcon = (type: Notification["type"]) => {
        switch (type) {
            case "success": return "✓";
            case "warning": return "⚠";
            case "error": return "✕";
            default: return "ℹ";
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Notifications"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-ev-green hover:text-ev-green-dark font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-slate-500 text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition ${!notification.read ? "bg-blue-50/50" : ""
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${getTypeColor(notification.type)}`}>
                                            {getTypeIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm ${!notification.read ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                                                    {notification.title}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeNotification(notification.id);
                                                    }}
                                                    className="text-slate-400 hover:text-red-500 text-xs"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{formatTime(notification.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                            <button
                                onClick={() => {
                                    navigate("/settings/activity-log");
                                    setIsOpen(false);
                                }}
                                className="w-full text-center text-xs text-ev-green hover:text-ev-green-dark font-medium py-1"
                            >
                                View all activity →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
