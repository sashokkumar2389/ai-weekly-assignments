export interface Resume {
    _id: string;
    text: string;
    embedding: number[];
    name: string;
    email: string;
    phone: string | null;
    location: string;
    company: string;
    role: string;
    education: string;
    total_Experience: number;
    relevant_Experience: number;
    skills: string[];
}

export interface SearchQuery {
    query: string;
    topK?: number;
    filters?: {
        minYearsExperience?: number;
        [key: string]: any;
    };
}

export interface RerankRequest {
    query: string;
    candidates: Array<{
        resumeId: string;
        snippet: string;
    }>;
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