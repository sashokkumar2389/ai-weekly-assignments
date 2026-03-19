// API Request/Response Types

export interface SearchRequest {
    query: string;
    searchType: "keyword" | "vector" | "hybrid";
    topK: number;
    filters?: {
        company?: string[];
        skills?: string[];
        location?: string[];
    };
}

export interface ChatRequest {
    message: string;
    conversationId?: string;
    includeHistory?: boolean;
    searchType?: "keyword" | "vector" | "hybrid";
    topK?: number;
}

export interface ChatHistoryRequest {
    conversationId: string;
}

export interface DocumentQARequest {
    candidateId: string;
    question: string;
}

// Response Types

export interface SearchResponse {
    results: CandidateResult[];
    searchType: string;
    resultCount: number;
    duration: number;
}

export interface CandidateResult {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    score: number;
    matchType: "keyword" | "vector" | "hybrid";
    extractedInfo?: {
        skills: string[];
        experience: string;
        specialization: string;
    };
    llmReasoning?: string;
}

export interface ChatResponse {
    conversationId: string;
    response: string;
    searchResults: CandidateResult[];
    messageCount: number;
    searchType: string;
}

export interface CandidateProfile {
    candidate: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        role: string;
        company: string;
        skills: string[];
        experience: string;
        specialization: string;
        resumeContent: string;
        location?: string;
        linkedinProfile?: string;
        education?: string[];
        certifications?: string[];
    };
}

export interface ChatHistoryResponse {
    conversationId: string;
    messages: {
        role: "user" | "assistant";
        content: string;
        timestamp: number;
    }[];
    totalMessages: number;
}

export interface DocumentQAResponse {
    candidateId: string;
    candidateName: string;
    question: string;
    answer: string;
    relevantExcerpts: string[];
}

export interface HealthResponse {
    status: string;
    timestamp: string;
    model: {
        provider: string;
        model: string;
        embeddingProvider: string;
        embeddingModel: string;
    };
    retrievalPipeline: string;
    activeConversations: number;
}

export interface ErrorResponse {
    error: string;
    details?: string;
    traceId?: string;
}
