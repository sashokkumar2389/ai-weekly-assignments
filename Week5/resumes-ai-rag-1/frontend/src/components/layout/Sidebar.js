import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrandAvatar } from '@/components/common/BrandAvatar';
import { SearchModeNav } from '@/components/features/sidebar/SearchModeNav';
import { HybridWeightPanel } from '@/components/features/sidebar/HybridWeightPanel';
import { ResultsLimitSelect } from '@/components/features/sidebar/ResultsLimitSelect';
import { ClearChatButton } from '@/components/features/sidebar/ClearChatButton';
import { useSearchStore } from '@/lib/stores/search.store';
import { AnimatePresence } from 'framer-motion';
export function Sidebar() {
    const { searchType, setSearchType } = useSearchStore();
    return (_jsxs("aside", { className: "w-[260px] shrink-0 bg-bg-surface border-r border-white/[0.07] flex flex-col p-5 gap-4 overflow-y-auto", children: [_jsx(BrandAvatar, {}), _jsx("div", { className: "text-xs font-medium uppercase tracking-widest text-text-muted", children: "Search Mode" }), _jsx(SearchModeNav, { activeMode: searchType, onChange: setSearchType }), _jsx(AnimatePresence, { children: searchType === 'hybrid' && _jsx(HybridWeightPanel, {}) }), _jsx("div", { className: "text-xs font-medium uppercase tracking-widest text-text-muted mt-6", children: "Results Limit" }), _jsx(ResultsLimitSelect, {}), _jsxs("div", { className: "mt-auto flex flex-col gap-2", children: [_jsx(ClearChatButton, {}), _jsx("footer", { className: "text-xs text-text-muted text-center py-2", children: "RecruitBot v2.0" })] })] }));
}
//# sourceMappingURL=Sidebar.js.map