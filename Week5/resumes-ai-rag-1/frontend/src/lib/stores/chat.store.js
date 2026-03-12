import { create } from 'zustand';
export const useChatStore = create((set) => ({
    messages: [],
    isInitialized: false,
    addUserMessage: (text) => set((s) => ({
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
    addBotMessage: (content) => set((s) => ({
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
//# sourceMappingURL=chat.store.js.map