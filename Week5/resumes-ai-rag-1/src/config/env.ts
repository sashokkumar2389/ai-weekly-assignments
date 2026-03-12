import dotenv from 'dotenv';

dotenv.config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'resumes',
    MONGODB_COLLECTION: process.env.MONGODB_COLLECTION || 'resumes',
    MONGODB_BM25_INDEX: process.env.MONGODB_BM25_INDEX || 'bm25_index',
    MONGODB_VECTOR_INDEX: process.env.MONGODB_VECTOR_INDEX || 'vector_index',
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || process.env.API_KEY || '',
    MISTRAL_API_URL: process.env.MISTRAL_API_URL || 'https://api.mistral.ai/v1/embeddings',
    MISTRAL_EMBED_MODEL: process.env.MISTRAL_EMBED_MODEL || 'mistral-embed',
    EMBEDDING_TIMEOUT_MS: parseInt(process.env.EMBEDDING_TIMEOUT_MS || '30000', 10),
    EMBEDDING_CACHE_TTL_MS: parseInt(process.env.EMBEDDING_CACHE_TTL_MS || '3600000', 10),
    LLM_MODEL: process.env.LLM_MODEL || 'openai/gpt-oss-120b',
    LLM_API_URL: process.env.LLM_API_URL || 'https://api.groq.com/openai/v1',
    LLM_API_KEY: process.env.LLM_API_KEY || process.env.GROQ_API_KEY || '',
    API_VERSION: process.env.API_VERSION || 'v1',
};

export default env;