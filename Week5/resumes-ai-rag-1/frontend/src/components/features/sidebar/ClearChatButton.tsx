import { Button } from '@/components/ui/button';
import { useChatStore } from '@/lib/stores/chat.store';
import { useSearchStore } from '@/lib/stores/search.store';
import { Trash2 } from 'lucide-react';

export function ClearChatButton() {
    const { clearMessages } = useChatStore();
    const { clearResults } = useSearchStore();

    const handleClear = () => {
        clearMessages();
        clearResults();
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleClear}
            className="w-full gap-2"
            aria-label="Clear chat history"
        >
            <Trash2 className="h-4 w-4" />
            Clear Chat
        </Button>
    );
}
