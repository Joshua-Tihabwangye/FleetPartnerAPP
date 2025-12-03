import { useState, useEffect } from "react";
import { toastManager } from "../utils/toastManager";

export function useToast() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const unsubscribe = toastManager.subscribe((toast) => {
            setToasts(prev => [...prev, toast]);
        });

        return unsubscribe;
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, removeToast };
}
