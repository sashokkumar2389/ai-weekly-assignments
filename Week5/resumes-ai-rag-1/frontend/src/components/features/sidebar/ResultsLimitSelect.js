import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchStore } from '@/lib/stores/search.store';
import { RESULTS_LIMIT_OPTIONS } from '@/lib/utils/constants';
export function ResultsLimitSelect() {
    const { topK, setTopK } = useSearchStore();
    return (_jsxs(Select, { value: topK.toString(), onValueChange: (value) => setTopK(parseInt(value)), children: [_jsxs(SelectTrigger, { className: "w-full", children: [_jsx("span", { className: "text-sm", children: "Show top " }), _jsx(SelectValue, {}), _jsx("span", { className: "text-sm", children: " results" })] }), _jsx(SelectContent, { children: RESULTS_LIMIT_OPTIONS.map((option) => (_jsxs(SelectItem, { value: option.toString(), children: [option, " results"] }, option))) })] }));
}
//# sourceMappingURL=ResultsLimitSelect.js.map