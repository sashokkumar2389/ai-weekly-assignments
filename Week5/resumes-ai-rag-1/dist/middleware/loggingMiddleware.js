"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = void 0;
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger();
const loggingMiddleware = (req, res, next) => {
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
exports.loggingMiddleware = loggingMiddleware;
