import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage = ({
  message,
  onRetry,
  className,
}: ErrorMessageProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-red-300 bg-red-50 p-3 text-red-900 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-semibold text-red-700 hover:text-red-800 dark:text-red-200 dark:hover:text-red-100"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
