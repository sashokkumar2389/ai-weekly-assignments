export interface RerankRequest {
    query: string;
    candidates: Array<{
        resumeId: string;
        snippet: string;
    }>;
    topK?: number;
}

export interface RerankResponse {
    rankedCandidates: Array<{
        resumeId: string;
        score: number;
    }>;
}

export interface RerankOptions {
    topK?: number;
}

export interface SummarizeRequest {
    query: string;
    candidate: {
        resumeId: string;
        snippet: string;
    };
    style?: "short" | "detailed";
    maxTokens?: number;
}

export interface SummarizeResponse {
    summary: string;
}

export interface SummarizeOptions {
    style?: "short" | "detailed";
    maxTokens?: number;
}

export interface MetadataExtractionRequest {
    rawText: string;
}

export interface MetadataExtractionResponse {
    skills: string[];
    jobTitles: string[];
    experienceSummary: string;
}

export type LLMResponse = RerankResponse | SummarizeResponse | MetadataExtractionResponse;