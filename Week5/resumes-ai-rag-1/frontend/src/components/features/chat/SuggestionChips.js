import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { SUGGESTION_CHIPS } from '@/lib/utils/constants';
export function SuggestionChips({ onSelect }) {
    return (_jsx("div", { className: "grid grid-cols-1 gap-2 md:grid-cols-2", children: SUGGESTION_CHIPS.map((chip, idx) => (_jsxs(Button, { variant: "secondary", size: "sm", onClick: () => onSelect(chip.query), className: "justify-start h-auto py-3 px-4 text-left", children: [_jsx("span", { className: "mr-2 text-lg", children: chip.icon }), _jsx("span", { className: "text-xs font-medium", children: chip.label })] }, idx))) }));
}
//# sourceMappingURL=SuggestionChips.js.map