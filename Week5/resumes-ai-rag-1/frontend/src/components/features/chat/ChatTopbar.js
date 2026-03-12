import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from '@/components/ui/badge';
import { useSearchStore } from '@/lib/stores/search.store';
export function ChatTopbar() {
    const { searchType } = useSearchStore();
    const modeInfo = {
        vector: { label: 'Vector Search', color: 'vector' },
        bm25: { label: 'BM25 Keyword', color: 'bm25' },
        hybrid: { label: 'Hybrid Search', color: 'hybrid' },
    };
    const info = modeInfo[searchType];
    return (_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-white/[0.07] bg-bg-card", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs", children: "R" }), _jsxs("div", { children: [_jsx("h2", { className: "text-sm font-semibold text-text-primary", children: "RecruitBot" }), _jsx("p", { className: "text-xs text-text-muted", children: "Candidate Discovery" })] })] }), _jsx(Badge, { variant: info.color, children: info.label })] }));
}
//# sourceMappingURL=ChatTopbar.js.map