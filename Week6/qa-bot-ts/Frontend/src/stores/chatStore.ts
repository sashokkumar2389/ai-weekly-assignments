import { create } from "zustand";
import { CandidateResult } from "@/api/types";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
    searchResults?: CandidateResult[];
    isError?: boolean;
}

interface ChatState {
    conversationId: string | null;
    messages: ChatMessage[];
    isLoading: boolean;
    lastSearchResults: CandidateResult[];

    setConversationId: (id: string | null) => void;
    addMessage: (message: ChatMessage) => void;
    setMessages: (messages: ChatMessage[]) => void;
    setLoading: (loading: boolean) => void;
    setLastSearchResults: (results: CandidateResult[]) => void;
    clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    conversationId: null,
    messages: [],
    isLoading: false,
    lastSearchResults: [],

    setConversationId: (id) => set({ conversationId: id }),
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    setMessages: (messages) => set({ messages }),
    setLoading: (loading) => set({ isLoading: loading }),
    setLastSearchResults: (results) => set({ lastSearchResults: results }),
    clearChat: () =>
        set({ messages: [], conversationId: null, lastSearchResults: [] }),
}));
