import { Trash2 } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useDeleteChat } from "@/api/hooks/useDeleteChat";
import { useChatStore } from "@/stores/chatStore";

export const ChatHeader = () => {
  const { conversationId } = useChatStore();
  const { mutate: deleteChat } = useDeleteChat();

  const handleClearChat = () => {
    if (conversationId) {
      deleteChat(conversationId);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
          🤖
        </div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          QA Resume Bot
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleClearChat}
          disabled={!conversationId}
          className="rounded-md p-2 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
          title="Clear conversation"
        >
          <Trash2 className="h-5 w-5" />
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
};
