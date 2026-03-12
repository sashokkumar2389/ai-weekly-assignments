/**
 * Response Formatter Utility
 * Standardizes API responses across all endpoints
 */

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    details?: string;
    message?: string;
}

export interface SearchResult {
    resume: any;
    [key: string]: any;
}

export interface BM25Response {
    results: SearchResult[];
    query?: string;
    resultCount?: number;
    durationMs?: number;
}

export interface VectorResponse {
    results: SearchResult[];
    query?: string;
    resultCount?: number;
    durationMs?: number;
}

export interface HybridResponse {
    bm25: SearchResult[];
    vector: SearchResult[];
    resultCount?: number;
    durationMs?: number;
}

/**
 * Format BM25 search results
 */
export function formatBM25Response(
    results: any[],
    metadata?: { query?: string; durationMs?: number }
): ApiResponse<BM25Response> {
    return {
        success: true,
        data: {
            results: results.map(resume => ({
                resume: {
                    _id: resume._id,
                    text: resume.text,
                    name: resume.name,
                    email: resume.email,
                    phone: resume.phone,
                    location: resume.location,
                    company: resume.company,
                    role: resume.role,
                    education: resume.education,
                    totalExperience: resume.totalExperience,
                    relevantExperience: resume.relevantExperience,
                    skills: resume.skills,
                    resumeId: resume.resumeId
                }
            })),
            query: metadata?.query,
            resultCount: results.length,
            durationMs: metadata?.durationMs
        }
    };
}

/**
 * Format vector search results
 */
export function formatVectorResponse(
    results: any[],
    metadata?: { query?: string; durationMs?: number }
): ApiResponse<VectorResponse> {
    return {
        success: true,
        data: {
            results: results.map(resume => ({
                resume: {
                    _id: resume._id,
                    text: resume.text,
                    name: resume.name,
                    email: resume.email,
                    phone: resume.phone,
                    location: resume.location,
                    company: resume.company,
                    role: resume.role,
                    education: resume.education,
                    totalExperience: resume.totalExperience,
                    relevantExperience: resume.relevantExperience,
                    skills: resume.skills,
                    resumeId: resume.resumeId,
                    similarityScore: resume.similarityScore
                }
            })),
            query: metadata?.query,
            resultCount: results.length,
            durationMs: metadata?.durationMs
        }
    };
}

/**
 * Format hybrid search results
 */
export function formatHybridResponse(
    bm25Results: any[],
    vectorResults: any[],
    metadata?: { durationMs?: number }
): ApiResponse<HybridResponse> {
    return {
        success: true,
        data: {
            bm25: bm25Results.map(resume => ({
                resume: {
                    _id: resume._id,
                    text: resume.text,
                    name: resume.name,
                    email: resume.email,
                    phone: resume.phone,
                    location: resume.location,
                    company: resume.company,
                    role: resume.role,
                    education: resume.education,
                    totalExperience: resume.totalExperience,
                    relevantExperience: resume.relevantExperience,
                    skills: resume.skills,
                    resumeId: resume.resumeId
                }
            })),
            vector: vectorResults.map(resume => ({
                resume: {
                    _id: resume._id,
                    text: resume.text,
                    name: resume.name,
                    email: resume.email,
                    phone: resume.phone,
                    location: resume.location,
                    company: resume.company,
                    role: resume.role,
                    education: resume.education,
                    totalExperience: resume.totalExperience,
                    relevantExperience: resume.relevantExperience,
                    skills: resume.skills,
                    resumeId: resume.resumeId,
                    similarityScore: resume.similarityScore
                }
            })),
            resultCount: bm25Results.length + vectorResults.length,
            durationMs: metadata?.durationMs
        }
    };
}

/**
 * Format error response
 */
export function formatErrorResponse(
    error: string,
    details?: string
): ApiResponse<null> {
    return {
        success: false,
        error,
        details
    };
}

/**
 * Format success response with generic data
 */
export function formatSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        data,
        message
    };
}
