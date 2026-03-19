import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import { ChatHistoryResponse } from "../types";

export const useChatHistory = (conversationId: string) => {
    return useQuery({
        queryKey: ["chatHistory", conversationId],
        queryFn: async () => {
            const response = await apiClient.post<ChatHistoryResponse>(
                ENDPOINTS.CHAT_HISTORY,
                {
                    conversationId,
                }
            );
            return response.data;
        },
        enabled: !!conversationId,
    });
};
