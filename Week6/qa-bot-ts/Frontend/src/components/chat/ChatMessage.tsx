import { formatTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ChatMessage as IChatMessage } from "@/stores/chatStore";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
    message: IChatMessage;
    children?: React.ReactNode;
}

export const ChatMessage = ({ message, children }: ChatMessageProps) => {
    if (message.role === "user") {
        return (
            <div className="flex justify-end">
                <div className="max-w-xs rounded-lg bg-blue-500 px-4 py-2 text-white lg:max-w-md xl:max-w-lg">
                    <p className="text-sm">{message.content}</p>
                    <span className="mt-1 block text-xs opacity-70">
                        {formatTime(message.timestamp)}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start">
            <div className={cn(
                "max-w-xs rounded-lg px-4 py-2 lg:max-w-md xl:max-w-lg",
                message.isError
                    ? "bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-200"
                    : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            )}>
                {message.isError ? (
                    <p className="text-sm">{message.content}</p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                )}
                <span className="mt-1 block text-xs opacity-70">
                    {formatTime(message.timestamp)}
                </span>
                {children}
            </div>
        </div>
    );
};
