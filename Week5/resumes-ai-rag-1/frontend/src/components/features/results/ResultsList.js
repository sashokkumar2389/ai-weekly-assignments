import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResultSummary } from './ResultSummary';
import { ResultCard } from './ResultCard';
import { EmptyState } from '@/components/common/EmptyState';
export function ResultsList({ results, searchType, duration, query, onSelectCandidate, }) {
    if (!results || results.length === 0) {
        return _jsx(EmptyState, {});
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(ResultSummary, { resultCount: results.length, searchType: searchType, duration: duration, query: query }), _jsx("div", { className: "space-y-3", children: results.map((result, idx) => (_jsx(ResultCard, { result: result, rank: idx + 1, searchType: searchType, onSelect: onSelectCandidate }, result.candidateId || result.resumeId || idx))) })] }));
}
//# sourceMappingURL=ResultsList.js.map