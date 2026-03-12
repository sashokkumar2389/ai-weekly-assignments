import { useCallback } from 'react';
import { useChatStore } from '@/lib/stores/chat.store';
export function useChat() {
    const { messages, addUserMessage, addBotMessage, clearMessages } = useChatStore();
    const handleAddMessage = useCallback((text) => {
        addUserMessage(text);
    }, [addUserMessage]);
    const handleAddBotMessage = useCallback((content) => {
        addBotMessage(content);
    }, [addBotMessage]);
    const handleClearMessages = useCallback(() => {
        clearMessages();
    }, [clearMessages]);
    return {
        messages,
        addMessage: handleAddMessage,
        addBotMessage: handleAddBotMessage,
        clearMessages: handleClearMessages,
    };
}
//# sourceMappingURL=use-chat.js.map