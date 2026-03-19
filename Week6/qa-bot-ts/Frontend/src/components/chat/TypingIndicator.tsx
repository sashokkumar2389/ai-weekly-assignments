interface TypingIndicatorProps {
    className?: string;
}

export const TypingIndicator = ({ className }: TypingIndicatorProps) => {
    return (
        <div className={`flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800 ${className}`}>
            <span className="text-sm text-gray-700 dark:text-gray-300">🤖 Bot is thinking</span>
            <div className="flex gap-1">
                <span className="typing-dot" style={{ animationDelay: "0s" }}></span>
                <span className="typing-dot" style={{ animationDelay: "0.2s" }}></span>
                <span className="typing-dot" style={{ animationDelay: "0.4s" }}></span>
            </div>
        </div>
    );
};
