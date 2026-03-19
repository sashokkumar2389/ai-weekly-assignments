import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import { useChatStore } from "@/stores/chatStore";

export const useDeleteChat = () => {
    const { clearChat, setConversationId } = useChatStore();

    return useMutation({
        mutationFn: async (conversationId: string) => {
            const response = await apiClient.delete(
                `${ENDPOINTS.CHAT_DELETE}/${conversationId}`
            );
            return response.data;
        },
        onSuccess: () => {
            clearChat();
            setConversationId(null);
            localStorage.removeItem("qa-bot-conversationId");
        },
    });
};
