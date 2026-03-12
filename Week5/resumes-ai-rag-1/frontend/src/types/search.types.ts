export type SearchMode = 'vector' | 'bm25' | 'hybrid';

export interface SearchRequest {
    query: string;
    searchType: 'vector' | 'keyword' | 'hybrid';
    topK: number;
    bm25Weight?: number;
    vectorWeight?: number;
}

export interface SearchResult {
    candidateId?: string;
    resumeId: string;
    _id?: string;
    name?: string;
    score: number;
    tier: string;
    rationale: string;
    keyMatches: string[];
    gaps: string[];
    recommendations: string;
    email?: string;
    phoneNumber?: string;
    experienceYears?: number;
    content?: string;
    snippet?: string;
    sources: {
        bm25: { score: number };
        vector: { score: number };
    };
}

export interface SearchResponse {
    ok: boolean;
    query: string;
    counts: {
        bm25: number;
        vector: number;
        merged: number;
    };
    rerankUsed: boolean;
    componentTimings: {
        bm25Ms: number;
        vectorMs: number;
        rerankMs: number;
    };
    results: SearchResult[];
}
