import { Request, Response } from 'express';
import { Logger } from '../utils/logger';

export class LoggingService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    logRequest(req: Request): void {
        const logEntry = {
            requestId: req.headers['x-request-id'] || '',
            method: req.method,
            endpoint: req.originalUrl,
            timestamp: new Date().toISOString(),
        };
        this.logger.info('Incoming Request', logEntry);
    }

    logResponse(res: Response, durationMs: number): void {
        const logEntry = {
            requestId: res.getHeader('x-request-id') || '',
            statusCode: res.statusCode,
            durationMs,
            timestamp: new Date().toISOString(),
        };
        this.logger.info('Outgoing Response', logEntry);
    }

    logError(error: Error, requestId: string): void {
        const logEntry = {
            requestId,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        };
        this.logger.error('Error Occurred', logEntry);
    }
}