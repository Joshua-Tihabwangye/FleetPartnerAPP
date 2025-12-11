// Simple toast manager for app-wide toast notifications

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

type ToastListener = (toast: Toast) => void;

let toastListeners: ToastListener[] = [];

export const toastManager = {
    show: (message: string, type: ToastType = "success"): void => {
        const toast: Toast = {
            id: Date.now() + Math.random(),
            message,
            type
        };
        toastListeners.forEach(listener => listener(toast));
    },

    subscribe: (listener: ToastListener): (() => void) => {
        toastListeners.push(listener);
        return () => {
            toastListeners = toastListeners.filter(l => l !== listener);
        };
    }
};
