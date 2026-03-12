import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '@/lib/utils/formatters';
export function ResultSummary({ resultCount, searchType, duration, query, }) {
    const modeLabels = {
        vector: 'Vector Search',
        bm25: 'BM25 Keyword',
        hybrid: 'Hybrid Search',
    };
    return (_jsxs("div", { className: "text-xs text-text-muted space-y-2", children: [_jsxs("p", { children: ["Found ", _jsx("span", { className: "text-text-primary font-semibold", children: resultCount }), " candidate", resultCount !== 1 ? 's' : '', " \u00B7", _jsx(Badge, { variant: searchType, className: "ml-2 inline", children: modeLabels[searchType] }), ' ', "\u00B7 ", formatDuration(duration)] }), _jsxs("p", { className: "text-text-muted italic", children: ["Query: \"", query, "\""] })] }));
}
//# sourceMappingURL=ResultSummary.js.map