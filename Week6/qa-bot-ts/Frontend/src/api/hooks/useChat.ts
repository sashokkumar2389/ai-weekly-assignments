import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import { ChatRequest, ChatResponse } from "../types";
import { useChatStore } from "@/stores/chatStore";

export const useChat = () => {
    const {
        setMessages,
        addMessage,
        setLoading,
        setConversationId,
        setLastSearchResults,
    } = useChatStore();

    return useMutation({
        mutationFn: async (params: ChatRequest) => {
            const response = await apiClient.post<ChatResponse>(
                ENDPOINTS.CHAT,
                params
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Add user message to chat
            addMessage({
                id: crypto.randomUUID(),
                role: "user",
                content: variables.message,
                timestamp: Date.now(),
            });

            // Add assistant response
            addMessage({
                id: crypto.randomUUID(),
                role: "assistant",
                content: data.response,
                timestamp: Date.now(),
                searchResults: data.searchResults,
            });

            // Update conversation ID and persist
            setConversationId(data.conversationId);
            localStorage.setItem("qa-bot-conversationId", data.conversationId);

            // Cache search results
            setLastSearchResults(data.searchResults);
            setLoading(false);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.error ||
                error?.message ||
                "Failed to send message";

            // Add error message to chat
            addMessage({
                id: crypto.randomUUID(),
                role: "assistant",
                content: `Error: ${errorMessage}`,
                timestamp: Date.now(),
                isError: true,
            });

            setLoading(false);
        },
    });
};
