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
    const scrollRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            {messages.length === 0 && <WelcomeMessage />}

            {messages.map((msg) => (
                <div key={msg.id}>
                    {msg.type === 'user' ? (
                        <UserBubble text={msg.text || ''} timestamp={msg.timestamp} />
                    ) : (
                        <BotBubble timestamp={msg.timestamp}>{msg.content}</BotBubble>
                    )}
                </div>
            ))}

            {isSearching && (
                <div className="flex justify-start">
                    <div className="bg-bg-card rounded-lg px-4 py-3">
                        <LoadingDots />
                    </div>
                </div>
            )}

            <div ref={scrollRef} />
        </div>
    );
}
