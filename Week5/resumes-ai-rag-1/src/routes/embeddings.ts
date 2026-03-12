import { Router, Request, Response } from 'express';
import { EmbeddingService } from '../services/EmbeddingService';
import { validateEmbeddingRequest } from '../middleware/validators';
import { measureTime, getErrorMessage } from '../utils/requestHandler';
import env from '../config/env';

const router = Router();
const embeddingService = new EmbeddingService();

// POST /v1/embeddings
router.post('/', validateEmbeddingRequest, async (req: Request, res: Response) => {
    const { input } = req.body;

    try {
        const { result: embedding, durationMs } = await measureTime(
            () => embeddingService.generateEmbedding(input)
        );

        res.status(200).json({
            embedding,
            model: env.MISTRAL_EMBED_MODEL,
            dimensions: embedding.length,
            durationMs
        });
    } catch (error) {
        const message = getErrorMessage(error);

        if (message.includes('rate limit')) {
            res.status(429).json({
                error: message,
                code: 'RATE_LIMITED'
            });
        } else if (message.includes('timeout')) {
            res.status(504).json({
                error: message,
                code: 'TIMEOUT'
            });
        } else if (message.includes('Invalid API key')) {
            res.status(401).json({
                error: 'Authentication failed',
                code: 'AUTH_ERROR'
            });
        } else {
            res.status(500).json({
                error: message || 'Failed to generate embedding',
                code: 'EMBEDDING_ERROR'
            });
        }
    }
});

export default router;