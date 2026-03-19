import { useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useChat } from "@/api/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { SearchSettingsModal } from "@/components/settings/SearchSettingsModal";
import { CandidateDetailsDialog } from "@/components/candidates/CandidateDetailsDialog";

export const ChatContainer = () => {
  const { messages, isLoading, setLoading } = useChatStore();
  const { searchType, topK, hybridVectorWeight } = useSettingsStore();
  const { mutate: sendMessage } = useChat();
  const [showHealthWarning, setShowHealthWarning] = useState(false);

  const handleSendMessage = (message: string) => {
    setLoading(true);
    sendMessage({
      message,
      searchType,
      topK,
      hybridVectorWeight,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
      {showHealthWarning && (
        <div className="bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          ⚠️ Backend service is temporarily unavailable
          <button
            onClick={() => setShowHealthWarning(false)}
            className="ml-2 font-semibold hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}
      <ChatHeader />
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        onWelcomeSuggestionClick={handleSendMessage}
      />
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      <SearchSettingsModal />
      <CandidateDetailsDialog />
    </div>
  );
};
