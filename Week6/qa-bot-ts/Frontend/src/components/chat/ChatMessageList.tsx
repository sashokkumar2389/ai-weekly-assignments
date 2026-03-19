import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ChatMessage as IChatMessage } from "@/stores/chatStore";
import { ChatMessage } from "./ChatMessage";
import { CandidateCardList } from "./CandidateCardList";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeScreen } from "./WelcomeScreen";

interface ChatMessageListProps {
  messages: IChatMessage[];
  isLoading: boolean;
  onWelcomeSuggestionClick: (suggestion: string) => void;
}

export const ChatMessageList = ({
  messages,
  isLoading,
  onWelcomeSuggestionClick,
}: ChatMessageListProps) => {
  const ref = useAutoScroll([messages, isLoading]);

  return (
    <div
      ref={ref}
      className="flex-1 space-y-4 overflow-y-auto p-4 dark:bg-gray-900"
    >
      {messages.length === 0 ? (
        <WelcomeScreen onSuggestClick={onWelcomeSuggestionClick} />
      ) : (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message}>
            {message.searchResults && message.searchResults.length > 0 && (
              <CandidateCardList candidates={message.searchResults} />
            )}
          </ChatMessage>
        ))
      )}
      {isLoading && <TypingIndicator />}
    </div>
  );
};
