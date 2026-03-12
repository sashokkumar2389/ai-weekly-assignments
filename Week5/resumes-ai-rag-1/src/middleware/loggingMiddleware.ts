import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

const logger = new Logger();

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, url } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const requestId = req.headers['x-request-id'];
        const requestIdValue = Array.isArray(requestId) ? requestId[0] : requestId || 'unknown';

        logger.info('HTTP Request', {
            requestId: requestIdValue,
            method,
            url,
            statusCode: res.statusCode,
            durationMs: duration,
        });
    });

    next();
};