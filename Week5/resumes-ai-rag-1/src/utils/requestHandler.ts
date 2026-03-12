/**
 * Request Handler Utilities
 * Reduces boilerplate in route handlers
 */

import { Request, Response } from 'express';
import { validateFilters } from './filterConverter';
import { formatErrorResponse } from './responseFormatter';

/**
 * Extract error message from error object
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return String(error);
}

/**
 * Validate filters and return early if invalid
 */
export function validateAndRespond(filters: any, res: Response): boolean {
    if (!filters) return true;

    const validation = validateFilters(filters);
    if (!validation.valid) {
        res.status(400).json(formatErrorResponse('Invalid filters', validation.errors.join('; ')));
        return false;
    }
    return true;
}

/**
 * Wrap async route handler to reduce boilerplate
 */
export function asyncHandler(
    fn: (req: Request, res: Response) => Promise<void>
): (req: Request, res: Response) => Promise<void> {
    return async (req: Request, res: Response) => {
        try {
            await fn(req, res);
        } catch (error) {
            const message = getErrorMessage(error);
            res.status(500).json(formatErrorResponse('Request failed', message));
        }
    };
}

/**
 * Measure execution time of async function
 */
export async function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
    const startTime = Date.now();
    const result = await fn();
    const durationMs = Date.now() - startTime;
    return { result, durationMs };
}
