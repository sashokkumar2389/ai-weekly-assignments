import { useChatStore } from "@/stores/chatStore";
import { useChatHistory } from "@/api/hooks/useChatHistory";
import { useEffect } from "react";

export const useConversation = () => {
    const { conversationId, setConversationId, setMessages, clearChat } =
        useChatStore();
    const storedConvId = localStorage.getItem("qa-bot-conversationId");
    const { data: history, error } = useChatHistory(storedConvId || "");

    useEffect(() => {
        const stored = localStorage.getItem("qa-bot-conversationId");
        if (stored) {
            setConversationId(stored);
        }
    }, [setConversationId]);

    useEffect(() => {
        if (history?.messages) {
            const messages = history.messages.map((msg) => ({
                id: crypto.randomUUID(),
                role: msg.role as "user" | "assistant",
                content: msg.content,
                timestamp: msg.timestamp,
            }));
            setMessages(messages);
        }
    }, [history, setMessages]);

    useEffect(() => {
        if (error) {
            localStorage.removeItem("qa-bot-conversationId");
            clearChat();
        }
    }, [error, clearChat]);

    return { conversationId };
};
