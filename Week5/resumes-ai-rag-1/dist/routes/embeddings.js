"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmbeddingService_1 = require("../services/EmbeddingService");
const validators_1 = require("../middleware/validators");
const requestHandler_1 = require("../utils/requestHandler");
const env_1 = __importDefault(require("../config/env"));
const router = (0, express_1.Router)();
const embeddingService = new EmbeddingService_1.EmbeddingService();
// POST /v1/embeddings
router.post('/', validators_1.validateEmbeddingRequest, async (req, res) => {
    const { input } = req.body;
    try {
        const { result: embedding, durationMs } = await (0, requestHandler_1.measureTime)(() => embeddingService.generateEmbedding(input));
        res.status(200).json({
            embedding,
            model: env_1.default.MISTRAL_EMBED_MODEL,
            dimensions: embedding.length,
            durationMs
        });
    }
    catch (error) {
        const message = (0, requestHandler_1.getErrorMessage)(error);
        if (message.includes('rate limit')) {
            res.status(429).json({
                error: message,
                code: 'RATE_LIMITED'
            });
        }
        else if (message.includes('timeout')) {
            res.status(504).json({
                error: message,
                code: 'TIMEOUT'
            });
        }
        else if (message.includes('Invalid API key')) {
            res.status(401).json({
                error: 'Authentication failed',
                code: 'AUTH_ERROR'
            });
        }
        else {
            res.status(500).json({
                error: message || 'Failed to generate embedding',
                code: 'EMBEDDING_ERROR'
            });
        }
    }
});
exports.default = router;
