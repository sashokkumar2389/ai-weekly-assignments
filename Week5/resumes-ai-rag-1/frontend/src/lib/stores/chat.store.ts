import { create } from 'zustand';
import { Message } from '@/types/chat.types';

interface ChatState {
    messages: Message[];
    addUserMessage: (text: string) => void;
    addBotMessage: (content: React.ReactNode) => void;
    clearMessages: () => void;
    setInitialized: () => void;
    isInitialized: boolean;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isInitialized: false,
    addUserMessage: (text) =>
        set((s) => ({
            messages: [
                ...s.messages,
                {
                    id: crypto.randomUUID(),
                    type: 'user',
                    text,
                    timestamp: new Date(),
                },
            ],
        })),
    addBotMessage: (content) =>
        set((s) => ({
            messages: [
                ...s.messages,
                {
                    id: crypto.randomUUID(),
                    type: 'bot',
                    content,
                    timestamp: new Date(),
                },
            ],
        })),
    clearMessages: () => set({ messages: [] }),
    setInitialized: () => set({ isInitialized: true }),
}));
