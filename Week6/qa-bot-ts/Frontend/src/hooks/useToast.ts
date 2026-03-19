import { useCallback } from "react";

interface ToastOptions {
    duration?: number;
}

export const useToast = () => {
    const toast = useCallback((message: string, options?: ToastOptions) => {
        // This is a placeholder. In a real app, you'd integrate with a toast library
        // like sonner or react-hot-toast
        console.log(`Toast: ${message}`);
    }, []);

    return { toast };
};
