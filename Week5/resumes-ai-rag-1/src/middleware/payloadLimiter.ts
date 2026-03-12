import { Request, Response, NextFunction } from 'express';

export const payloadLimiter = (req: Request, res: Response, next: NextFunction) => {
    const maxPayloadSize = 1 * 1024 * 1024; // 1 MB limit

    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxPayloadSize) {
        return res.status(413).json({ error: 'Payload too large' });
    }

    next();
};