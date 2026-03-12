"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadLimiter = void 0;
const payloadLimiter = (req, res, next) => {
    const maxPayloadSize = 1 * 1024 * 1024; // 1 MB limit
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxPayloadSize) {
        return res.status(413).json({ error: 'Payload too large' });
    }
    next();
};
exports.payloadLimiter = payloadLimiter;
