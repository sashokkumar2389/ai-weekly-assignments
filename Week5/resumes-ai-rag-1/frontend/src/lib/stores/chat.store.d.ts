import { Message } from '@/types/chat.types';
interface ChatState {
    messages: Message[];
    addUserMessage: (text: string) => void;
    addBotMessage: (content: React.ReactNode) => void;
    clearMessages: () => void;
    setInitialized: () => void;
    isInitialized: boolean;
}
export declare const useChatStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ChatState>>;
export {};
//# sourceMappingURL=chat.store.d.ts.map