import { AlertCircle } from "lucide-react";

interface HealthWarningProps {
    onDismiss: () => void;
}

export const HealthWarning = ({ onDismiss }: HealthWarningProps) => {
    return (
        <div className="flex items-center justify-between bg-amber-50 px-4 py-3 text-SM text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>⚠️ Backend service is temporarily unavailable</span>
            </div>
            <button
                onClick={onDismiss}
                className="font-semibold hover:opacity-75"
            >
                Dismiss
            </button>
        </div>
    );
};
