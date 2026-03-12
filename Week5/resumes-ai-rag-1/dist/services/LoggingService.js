"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const logger_1 = require("../utils/logger");
class LoggingService {
    constructor() {
        this.logger = new logger_1.Logger();
    }
    logRequest(req) {
        const logEntry = {
            requestId: req.headers['x-request-id'] || '',
            method: req.method,
            endpoint: req.originalUrl,
            timestamp: new Date().toISOString(),
        };
        this.logger.info('Incoming Request', logEntry);
    }
    logResponse(res, durationMs) {
        const logEntry = {
            requestId: res.getHeader('x-request-id') || '',
            statusCode: res.statusCode,
            durationMs,
            timestamp: new Date().toISOString(),
        };
        this.logger.info('Outgoing Response', logEntry);
    }
    logError(error, requestId) {
        const logEntry = {
            requestId,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        };
        this.logger.error('Error Occurred', logEntry);
    }
}
exports.LoggingService = LoggingService;
