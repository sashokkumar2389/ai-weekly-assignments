import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { ChatTopbar } from '@/components/features/chat/ChatTopbar';
import { ChatMessages } from '@/components/features/chat/ChatMessages';
import { SuggestionChips } from '@/components/features/chat/SuggestionChips';
import { ChatInputBar } from '@/components/features/chat/ChatInputBar';
import { CandidateModal } from '@/components/features/candidate/CandidateModal';
import { useChatStore } from '@/lib/stores/chat.store';
import { useSearchStore } from '@/lib/stores/search.store';
import { useCandidateModal } from '@/hooks/use-candidate-modal';
import { useSearch } from '@/hooks/use-search';
export function ChatPage() {
    const { messages } = useChatStore();
    const { isSearching } = useSearchStore();
    const { isOpen, candidate, loading, closeModal } = useCandidateModal();
    const { submitQuery } = useSearch();
    const showSuggestions = messages.length === 0 || messages.every((m) => m.type !== 'user');
    return (_jsxs("div", { className: "flex h-screen w-screen bg-bg-base overflow-hidden md:gap-0", children: [_jsx("div", { className: "hidden md:flex flex-col", children: _jsx(Sidebar, {}) }), _jsx(MobileDrawer, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(ChatTopbar, {}), _jsx(ChatMessages, {}), showSuggestions && (_jsx(SuggestionChips, { isVisible: true, onSelect: submitQuery })), _jsx(ChatInputBar, { onSubmit: submitQuery, isLoading: isSearching })] }), _jsx(CandidateModal, { isOpen: isOpen, candidate: candidate, isLoading: loading, onClose: closeModal })] }));
}
//# sourceMappingURL=ChatPage.js.map