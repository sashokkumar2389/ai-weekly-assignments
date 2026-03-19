import { useRef, useState } from "react";
import { Settings } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { ChatSuggestions } from "./ChatSuggestions";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { openSettingsModal } = useUIStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
      setShowSuggestions(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleSelect = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <ChatSuggestions
        inputValue={message}
        onSelect={handleSelect}
        isOpen={showSuggestions}
      />
      <div className="flex gap-2">
        <button
          onClick={openSettingsModal}
          className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Search settings"
        >
          <Settings className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setShowSuggestions(false)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to find candidates..."
            className={cn(
              "w-full resize-none rounded-md border border-gray-300 bg-white p-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400",
              "min-h-[40px] max-h-[120px]"
            )}
            rows={1}
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className={cn(
            "flex items-center justify-center rounded-md px-4 py-2 font-semibold text-white",
            message.trim() && !isLoading
              ? "bg-blue-500 hover:bg-blue-600"
              : "cursor-not-allowed bg-gray-300 dark:bg-gray-700"
          )}
        >
          ➤
        </button>
      </div>
    </div>
  );
};
