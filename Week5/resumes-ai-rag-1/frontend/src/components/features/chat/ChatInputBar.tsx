import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputBarProps {
    onSubmit: (query: string) => void;
    isLoading: boolean;
}

export function ChatInputBar({ onSubmit, isLoading }: ChatInputBarProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState('');

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '10px';
            const scrollHeight = Math.min(textareaRef.current.scrollHeight, 168);
            textareaRef.current.style.height = scrollHeight + 'px';
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    const handleSubmit = () => {
        const trimmed = value.trim();
        if (trimmed && !isLoading) {
            onSubmit(trimmed);
            setValue('');
            if (textareaRef.current) {
                textareaRef.current.style.height = '10px';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t border-white/[0.07] bg-bg-surface p-4 space-y-3">
            <div className="flex gap-2">
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search candidates... (Shift+Enter for new line)"
                    className="resize-none"
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!value.trim() || isLoading}
                    size="icon"
                    className="flex-shrink-0 h-10 w-10"
                    aria-label="Send message"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
            <p className="text-xs text-text-muted text-center">
                Press Enter to search · Shift+Enter for new line
            </p>
        </div>
    );
}
