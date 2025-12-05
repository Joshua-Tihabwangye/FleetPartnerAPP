// Simple toast manager for app-wide toast notifications
let toastListeners = [];

export const toastManager = {
    show: (message, type = "success") => {
        const toast = {
            id: Date.now() + Math.random(),
            message,
            type
        };
        toastListeners.forEach(listener => listener(toast));
    },

    subscribe: (listener) => {
        toastListeners.push(listener);
        return () => {
            toastListeners = toastListeners.filter(l => l !== listener);
        };
    }
};
