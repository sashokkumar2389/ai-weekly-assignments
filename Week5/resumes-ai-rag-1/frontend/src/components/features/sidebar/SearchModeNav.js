import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SEARCH_MODES } from '@/lib/utils/constants';
import { Check } from 'lucide-react';
export function SearchModeNav({ activeMode, onChange }) {
    const modes = ['vector', 'bm25', 'hybrid'];
    return (_jsx("div", { className: "space-y-2", children: modes.map((mode) => {
            const config = SEARCH_MODES[mode];
            const isActive = activeMode === mode;
            return (_jsx("button", { onClick: () => onChange(mode), className: `w-full text-left p-3 rounded-md border transition-all ${isActive
                    ? 'bg-indigo-500/12 border-indigo-400/30'
                    : 'bg-transparent border-white/[0.07] hover:bg-white/[0.02]'}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-medium text-text-primary", children: config.label }), _jsx("p", { className: "text-xs text-text-muted", children: config.description })] }), isActive && (_jsx(Check, { className: "h-4 w-4 text-primary flex-shrink-0 mt-0.5" }))] }) }, mode));
        }) }));
}
//# sourceMappingURL=SearchModeNav.js.map