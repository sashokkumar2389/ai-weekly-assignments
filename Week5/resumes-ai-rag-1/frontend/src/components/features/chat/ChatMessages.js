import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/stores/chat.store';
import { useSearchStore } from '@/lib/stores/search.store';
import { UserBubble } from './UserBubble';
import { BotBubble } from './BotBubble';
import { WelcomeMessage } from './WelcomeMessage';
import { LoadingDots } from '@/components/common/LoadingDots';
export function ChatMessages() {
    const { messages, isInitialized, setInitialized } = useChatStore();
    const { isSearching } = useSearchStore();
    const scrollRef = useRef(null);
    useEffect(() => {
        if (!isInitialized && messages.length === 0) {
            setInitialized();
        }
    }, [isInitialized, messages.length, setInitialized]);
    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
    }, [messages, isSearching]);
    return (_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 flex flex-col", children: [messages.length === 0 && _jsx(WelcomeMessage, {}), messages.map((msg) => (_jsx("div", { children: msg.type === 'user' ? (_jsx(UserBubble, { text: msg.text || '', timestamp: msg.timestamp })) : (_jsx(BotBubble, { timestamp: msg.timestamp, children: msg.content })) }, msg.id))), isSearching && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-bg-card rounded-lg px-4 py-3", children: _jsx(LoadingDots, {}) }) })), _jsx("div", { ref: scrollRef })] }));
}
//# sourceMappingURL=ChatMessages.js.map