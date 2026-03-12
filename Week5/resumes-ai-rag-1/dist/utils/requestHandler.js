"use strict";
/**
 * Request Handler Utilities
 * Reduces boilerplate in route handlers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = getErrorMessage;
exports.validateAndRespond = validateAndRespond;
exports.asyncHandler = asyncHandler;
exports.measureTime = measureTime;
const filterConverter_1 = require("./filterConverter");
const responseFormatter_1 = require("./responseFormatter");
/**
 * Extract error message from error object
 */
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    if (typeof error === 'string')
        return error;
    return String(error);
}
/**
 * Validate filters and return early if invalid
 */
function validateAndRespond(filters, res) {
    if (!filters)
        return true;
    const validation = (0, filterConverter_1.validateFilters)(filters);
    if (!validation.valid) {
        res.status(400).json((0, responseFormatter_1.formatErrorResponse)('Invalid filters', validation.errors.join('; ')));
        return false;
    }
    return true;
}
/**
 * Wrap async route handler to reduce boilerplate
 */
function asyncHandler(fn) {
    return async (req, res) => {
        try {
            await fn(req, res);
        }
        catch (error) {
            const message = getErrorMessage(error);
            res.status(500).json((0, responseFormatter_1.formatErrorResponse)('Request failed', message));
        }
    };
}
/**
 * Measure execution time of async function
 */
async function measureTime(fn) {
    const startTime = Date.now();
    const result = await fn();
    const durationMs = Date.now() - startTime;
    return { result, durationMs };
}
