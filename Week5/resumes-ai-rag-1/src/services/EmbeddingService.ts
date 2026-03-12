import axios from 'axios';
import env from '../config/env';

interface CacheEntry {
    embedding: number[];
    timestamp: number;
}

export class EmbeddingService {
    private apiUrl: string;
    private model: string;
    private apiKey: string;
    private cache: Map<string, CacheEntry>;
    private timeoutMs: number;
    private cacheTtlMs: number;

    constructor() {
        this.apiUrl = env.MISTRAL_API_URL;
        this.model = env.MISTRAL_EMBED_MODEL;
        this.apiKey = env.MISTRAL_API_KEY;
        this.cache = new Map();
        this.timeoutMs = env.EMBEDDING_TIMEOUT_MS;
        this.cacheTtlMs = env.EMBEDDING_CACHE_TTL_MS;
    }

    public async generateEmbedding(input: string): Promise<number[]> {
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
            const response = await axios.post(this.apiUrl,
                {
                    model: this.model,
                    input: input.trim()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: this.timeoutMs
                }
            );

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
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';

            if (message.includes('timeout') || message.includes('ECONNABORTED')) {
                throw new Error(`Embedding generation timed out after ${this.timeoutMs}ms`);
            }

            if (axios.isAxiosError(error)) {
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

    public clearCache(): void {
        this.cache.clear();
    }

    public getCacheSize(): number {
        return this.cache.size;
    }
}