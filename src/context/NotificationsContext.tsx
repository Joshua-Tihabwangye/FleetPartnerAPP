import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "error";
    timestamp: string;
    read: boolean;
    link?: string;
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    removeNotification: (id: number) => void;
    clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
    children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        try {
            const stored = localStorage.getItem("notifications");
            return stored ? JSON.parse(stored) : getDefaultNotifications();
        } catch {
            return getDefaultNotifications();
        }
    });

    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
        setNotifications((prev) => [
            {
                ...notification,
                id: Date.now(),
                timestamp: new Date().toISOString(),
                read: false,
            },
            ...prev.slice(0, 49), // Keep max 50
        ]);
    }, []);

    const markAsRead = useCallback((id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                removeNotification,
                clearAll,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationsProvider");
    }
    return context;
}

function getDefaultNotifications(): Notification[] {
    return [
        {
            id: 1,
            title: "Vehicle Maintenance Due",
            message: "UAA 123B requires scheduled service in 3 days",
            type: "warning",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            read: false,
            link: "/vehicles",
        },
        {
            id: 2,
            title: "Driver License Expiring",
            message: "John Mukasa's license expires in 7 days",
            type: "warning",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            read: false,
            link: "/drivers",
        },
        {
            id: 3,
            title: "Payout Approved",
            message: "Weekly payout of UGX 2.5M processed successfully",
            type: "success",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            read: true,
            link: "/earnings/payouts",
        },
        {
            id: 4,
            title: "New Trip Booking",
            message: "Corporate booking for 5 vehicles confirmed",
            type: "info",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
            read: true,
            link: "/trips",
        },
    ];
}
