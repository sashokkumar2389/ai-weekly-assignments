import { useCallback } from 'react';
import { useChatStore } from '@/lib/stores/chat.store';

export function useChat() {
    const { messages, addUserMessage, addBotMessage, clearMessages } = useChatStore();

    const handleAddMessage = useCallback(
        (text: string) => {
            addUserMessage(text);
        },
        [addUserMessage]
    );

    const handleAddBotMessage = useCallback(
        (content: React.ReactNode) => {
            addBotMessage(content);
        },
        [addBotMessage]
    );

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
