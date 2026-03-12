"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = __importDefault(require("../config/env"));
class EmbeddingService {
    constructor() {
        this.apiUrl = env_1.default.MISTRAL_API_URL;
        this.model = env_1.default.MISTRAL_EMBED_MODEL;
        this.apiKey = env_1.default.MISTRAL_API_KEY;
        this.cache = new Map();
        this.timeoutMs = env_1.default.EMBEDDING_TIMEOUT_MS;
        this.cacheTtlMs = env_1.default.EMBEDDING_CACHE_TTL_MS;
    }
    async generateEmbedding(input) {
        if (!input || input.trim().length === 0) {
            throw new Error('Input text cannot be empty');
        }
        if (!this.apiKey) {
            throw new Error('Mistral API key not configured');
        }
        // Check cache
        const cacheKey = `${this.model}:${input}`;
        const cachedEntry = this.cache.get(cacheKey);
        if (cachedEntry && (Date.now() - cachedEntry.timestamp) < this.cacheTtlMs) {
            return cachedEntry.embedding;
        }
        // Call API with timeout
        try {
            const response = await axios_1.default.post(this.apiUrl, {
                model: this.model,
                input: input.trim()
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: this.timeoutMs
            });
            if (!response.data.data || !response.data.data[0] || !response.data.data[0].embedding) {
                throw new Error('Invalid response format from Mistral API');
            }
            const embedding = response.data.data[0].embedding;
            // Cache the result
            this.cache.set(cacheKey, {
                embedding,
                timestamp: Date.now()
            });
            return embedding;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            if (message.includes('timeout') || message.includes('ECONNABORTED')) {
                throw new Error(`Embedding generation timed out after ${this.timeoutMs}ms`);
            }
            if (axios_1.default.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid Mistral API key');
                }
                if (error.response?.status === 429) {
                    throw new Error('Rate limit exceeded. Please retry after a moment');
                }
                if (error.response?.status === 400) {
                    throw new Error(`Invalid request: ${error.response?.data?.message || 'Unknown error'}`);
                }
            }
            throw new Error(`Failed to generate embedding: ${message}`);
        }
    }
    clearCache() {
        this.cache.clear();
    }
    getCacheSize() {
        return this.cache.size;
    }
}
exports.EmbeddingService = EmbeddingService;
