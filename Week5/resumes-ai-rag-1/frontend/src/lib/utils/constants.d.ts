import { SearchMode } from '@/types/search.types';
export declare const SEARCH_MODES: {
    vector: {
        label: string;
        description: string;
        icon: string;
        color: string;
    };
    bm25: {
        label: string;
        description: string;
        icon: string;
        color: string;
    };
    hybrid: {
        label: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare const SEARCH_MODE_COLORS: Record<SearchMode, string>;
export declare const SUGGESTION_CHIPS: {
    icon: string;
    label: string;
    query: string;
}[];
export declare const RESULTS_LIMIT_OPTIONS: number[];
export declare const HYBRID_WEIGHT_PRESETS: {
    label: string;
    bm25: number;
    vector: number;
}[];
export declare const SCORE_FORMATTER: (score: number, precision?: number) => string;
export declare const DURATION_FORMATTER: (ms: number) => string;
export declare const EXPERIENCE_FORMATTER: (years: number | undefined) => string;
export declare const getScoreLabel: (mode: SearchMode) => string;
export declare const getScoreColor: (mode: SearchMode) => string;
//# sourceMappingURL=constants.d.ts.map