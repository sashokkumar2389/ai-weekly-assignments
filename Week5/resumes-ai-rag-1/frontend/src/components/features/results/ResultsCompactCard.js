import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
const getTierEmoji = (tier) => {
    switch (tier.toUpperCase()) {
        case 'EXCEPTIONAL':
            return '🌟';
        case 'STRONG':
            return '✨';
        case 'GOOD':
            return '👍';
        default:
            return '•';
    }
};
const getRecommendationText = (recommendation) => {
    if (recommendation.toLowerCase().includes('strong')) {
        return '✅ Strong interview candidate';
    }
    if (recommendation.toLowerCase().includes('worth')) {
        return '✅ Worth considering';
    }
    if (recommendation.toLowerCase().includes('screening')) {
        return '✅ Requires screening call';
    }
    return `✅ ${recommendation}`;
};
const searchTypeLabels = {
    vector: 'Vector',
    bm25: 'BM25',
    hybrid: 'Hybrid',
};
export function ResultsCompactCard({ results, query, searchType, duration, rerankUsed, }) {
    const totalTime = duration;
    const displayResults = results.slice(0, 5);
    return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: _jsx(Card, { className: "overflow-hidden border border-white/[0.08] bg-gradient-to-br from-background to-background/50", children: _jsxs("div", { className: "p-6 space-y-0", children: [_jsx("div", { className: "pb-4 mb-4 border-b border-white/[0.08]", children: _jsxs("h3", { className: "text-base font-semibold text-text-primary", children: ["\uD83D\uDD0D \"", query, "\" - ", results.length, " Results Found"] }) }), _jsx("div", { className: "space-y-2", children: displayResults.map((result, idx) => {
                            const emoji = getTierEmoji(result.tier);
                            const isPrimary = idx === 0;
                            return (_jsxs("div", { className: `text-sm transition-colors px-3 py-2 rounded ${isPrimary
                                    ? 'bg-white/[0.05] border border-primary/20'
                                    : 'hover:bg-white/[0.02]'}`, children: [_jsxs("div", { className: "flex items-start gap-2 mb-1", children: [_jsx("span", { className: "text-base flex-shrink-0 mt-0.5", children: emoji }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "font-medium text-text-primary", children: ["#", idx + 1] }), _jsxs("span", { className: "text-primary font-semibold", children: ["[", result.score, "]"] }), _jsx("span", { className: "text-xs uppercase tracking-wide text-text-muted", children: result.tier })] }), _jsx("p", { className: "text-xs text-text-muted mt-1 line-clamp-1", children: result.keyMatches.join(' • ') })] })] }), _jsx("div", { className: "text-xs text-green-400 ml-7", children: getRecommendationText(result.recommendations) })] }, result.resumeId || idx));
                        }) }), _jsx("div", { className: "pt-4 mt-4 border-t border-white/[0.08]", children: _jsxs("div", { className: "text-xs text-text-muted flex items-center justify-between", children: [_jsxs("span", { children: ["\u23F1\uFE0F ", searchTypeLabels[searchType], " \u00B7 ", Math.round(totalTime), "ms"] }), _jsx("span", { children: rerankUsed ? '🤖 AI Reranked ✓' : '' })] }) })] }) }) }));
}
//# sourceMappingURL=ResultsCompactCard.js.map