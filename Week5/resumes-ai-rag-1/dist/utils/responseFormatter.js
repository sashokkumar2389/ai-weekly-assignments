"use strict";
/**
 * Response Formatter Utility
 * Standardizes API responses across all endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBM25Response = formatBM25Response;
exports.formatVectorResponse = formatVectorResponse;
exports.formatHybridResponse = formatHybridResponse;
exports.formatErrorResponse = formatErrorResponse;
exports.formatSuccessResponse = formatSuccessResponse;
/**
 * Format BM25 search results
 */
function formatBM25Response(results, metadata) {
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
function formatVectorResponse(results, metadata) {
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
function formatHybridResponse(bm25Results, vectorResults, metadata) {
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
function formatErrorResponse(error, details) {
    return {
        success: false,
        error,
        details
    };
}
/**
 * Format success response with generic data
 */
function formatSuccessResponse(data, message) {
    return {
        success: true,
        data,
        message
    };
}
