"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmbeddingRequest = exports.validateSummarizeRequest = exports.validateSearchQuery = void 0;
/**
 * Validate search query request
 * Ensures query is provided and is a non-empty string
 */
const validateSearchQuery = (req, res, next) => {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        res.status(400).json({
            error: 'Invalid search query',
            message: 'query must be a non-empty string'
        });
        return;
    }
    if (query.length > 5000) {
        res.status(400).json({
            error: 'Query too long',
            message: 'query must be less than 5000 characters'
        });
        return;
    }
    next();
};
exports.validateSearchQuery = validateSearchQuery;
/**
 * Validate summarization request
 * Ensures required fields are present
 */
const validateSummarizeRequest = (req, res, next) => {
    const { query, candidate, style } = req.body;
    if (!query || typeof query !== 'string') {
        res.status(400).json({
            error: 'Invalid query',
            message: 'query must be a non-empty string'
        });
        return;
    }
    if (!candidate || typeof candidate !== 'object') {
        res.status(400).json({
            error: 'Invalid candidate',
            message: 'candidate must be an object'
        });
        return;
    }
    // Trim and validate style if provided
    if (style) {
        const trimmedStyle = String(style).trim().toLowerCase();
        if (!['short', 'detailed'].includes(trimmedStyle)) {
            res.status(400).json({
                error: 'Invalid style',
                message: 'style must be either "short" or "detailed"'
            });
            return;
        }
        // Update request body with trimmed style for consistency
        req.body.style = trimmedStyle;
    }
    next();
};
exports.validateSummarizeRequest = validateSummarizeRequest;
/**
 * Validate embedding request
 * Ensures input is provided and within size limits
 */
const validateEmbeddingRequest = (req, res, next) => {
    const { input, model } = req.body;
    const MAX_INPUT_LENGTH = 8000; // Mistral limit
    if (!input) {
        res.status(400).json({
            error: 'Missing required field: input',
            code: 'INVALID_REQUEST'
        });
        return;
    }
    if (typeof input !== 'string') {
        res.status(400).json({
            error: 'Field "input" must be a string',
            code: 'INVALID_REQUEST'
        });
        return;
    }
    if (input.trim().length === 0) {
        res.status(400).json({
            error: 'Input text cannot be empty',
            code: 'INVALID_REQUEST'
        });
        return;
    }
    if (input.length > MAX_INPUT_LENGTH) {
        res.status(400).json({
            error: `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`,
            code: 'INVALID_REQUEST'
        });
        return;
    }
    if (model && typeof model !== 'string') {
        res.status(400).json({
            error: 'Field "model" must be a string',
            code: 'INVALID_REQUEST'
        });
        return;
    }
    next();
};
exports.validateEmbeddingRequest = validateEmbeddingRequest;
