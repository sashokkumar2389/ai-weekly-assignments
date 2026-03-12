export interface SearchQuery {
    query: string;
    topK?: number;
    filters?: {
        minYearsExperience?: number;
        [key: string]: any; // Additional filters can be added as needed
    };
}

export interface SearchResult {
    resumeId: string;
    snippet: string;
    score: number; // Score from the search algorithm
}

export interface HybridSearchResult {
    bm25Results: SearchResult[];
    vectorResults: SearchResult[];
}

export interface RerankRequest {
    query: string;
    candidates: SearchResult[];
    topK?: number;
}

export interface SummarizeRequest {
    query: string;
    candidate: SearchResult;
    style?: "short" | "detailed";
    maxTokens?: number;
}