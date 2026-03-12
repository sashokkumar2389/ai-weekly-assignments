export const SEARCH_MODES = {
    vector: {
        label: 'Vector Search',
        description: 'Semantic similarity',
        icon: 'search',
        color: 'score-vector',
    },
    bm25: {
        label: 'BM25 Keyword',
        description: 'Exact keyword matching',
        icon: 'type',
        color: 'score-bm25',
    },
    hybrid: {
        label: 'Hybrid Search',
        description: 'Combined results',
        icon: 'network',
        color: 'score-hybrid',
    },
};
export const SEARCH_MODE_COLORS = {
    vector: 'bg-score-vector/10 text-score-vector',
    bm25: 'bg-score-bm25/10 text-score-bm25',
    hybrid: 'bg-score-hybrid/10 text-score-hybrid',
};
export const SUGGESTION_CHIPS = [
    {
        icon: '🔍',
        label: 'Selenium QA 3 yrs',
        query: 'Selenium automation engineer 3 years experience',
    },
    {
        icon: '🐍',
        label: 'Python ML dev',
        query: 'Python developer with machine learning expertise',
    },
    {
        icon: '☁️',
        label: 'Java AWS backend',
        query: 'Java backend developer AWS cloud experience',
    },
    {
        icon: '⚡',
        label: 'Lead QA Cypress',
        query: 'Lead QA engineer with Cypress and CI/CD automation',
    },
];
export const RESULTS_LIMIT_OPTIONS = [3, 5, 10, 20];
export const HYBRID_WEIGHT_PRESETS = [
    { label: '50/50', bm25: 50, vector: 50 },
    { label: '70/30', bm25: 70, vector: 30 },
    { label: '30/70', bm25: 30, vector: 70 },
];
export const SCORE_FORMATTER = (score, precision = 2) => {
    return score.toFixed(precision);
};
export const DURATION_FORMATTER = (ms) => {
    if (ms < 1000)
        return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
};
export const EXPERIENCE_FORMATTER = (years) => {
    if (!years)
        return 'N/A';
    if (years < 1)
        return '< 1 year';
    if (years === 1)
        return '1 year';
    return `${years.toFixed(1)} years`;
};
export const getScoreLabel = (mode) => {
    return mode === 'vector'
        ? 'Similarity'
        : mode === 'bm25'
            ? 'Keyword Score'
            : 'Hybrid Score';
};
export const getScoreColor = (mode) => {
    return mode === 'vector' ? 'text-score-vector' : mode === 'bm25' ? 'text-score-bm25' : 'text-score-hybrid';
};
//# sourceMappingURL=constants.js.map