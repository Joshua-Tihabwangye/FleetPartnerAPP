import { toastManager } from "./toastManager";

export interface ActivityLogEntry {
    id: number;
    timestamp: string;
    action: string;
    category: "driver" | "vehicle" | "trip" | "payout" | "settings" | "system";
    user: string;
    details: string;
}

class ActivityLogger {
    private storageKey = "activity_log";
    private maxEntries = 500;

    log(
        action: string,
        category: ActivityLogEntry["category"],
        details: string = "",
        user: string = "System"
    ): void {
        const entries = this.getAll();
        const newEntry: ActivityLogEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action,
            category,
            user,
            details,
        };

        entries.unshift(newEntry);

        // Keep only last maxEntries
        if (entries.length > this.maxEntries) {
            entries.splice(this.maxEntries);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(entries));
    }

    getAll(): ActivityLogEntry[] {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || "[]");
        } catch {
            return [];
        }
    }

    getByCategory(category: ActivityLogEntry["category"]): ActivityLogEntry[] {
        return this.getAll().filter((entry) => entry.category === category);
    }

    getRecent(count: number = 20): ActivityLogEntry[] {
        return this.getAll().slice(0, count);
    }

    clear(): void {
        localStorage.removeItem(this.storageKey);
        toastManager.show("Activity log cleared", "info");
    }
}

export const activityLogger = new ActivityLogger();
