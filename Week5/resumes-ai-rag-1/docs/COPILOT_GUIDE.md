# Copilot Development Guide – Resume Search RAG System

## Overview

This guide provides Copilot AI (side chat) with context, patterns, and constraints for generating, editing, and debugging code in the Resume Search RAG application. Use this as the authoritative reference when working on any aspect of this codebase.

---

## 1. Project Context & Architecture

### System Purpose
Enterprise-grade resume search API using RAG (Retrieval-Augmented Generation) patterns. The system combines BM25 full-text search, vector similarity search (MongoDB Atlas Vector Search), and LLM re-ranking to deliver high-quality candidate matches.

### Key Constraints
- **Traffic Profile**: Low-moderate traffic (~100s requests/day); quality over speed
- **Latency Target**: P95 ≤ 5 seconds acceptable; synchronous pipeline preferred
- **Orchestration**: Monolithic Node.js + Express app (no microservices)
- **Data Store**: MongoDB (Atlas) with native vector search capability
- **Embedding Model**: Mistral `mistral-embed` (1024 dimensions)
- **LLM Provider**: Groq `meta-llama/llama-4-scout-17b-16e-instruct`

### Architecture Layers

```
API Layer (Express Routes)
  ↓
Service Layer (Business Logic)
  ├── SearchService (orchestrates search pipeline)
  ├── EmbeddingService (Mistral API wrapper)
  ├── LLMService (LLM re-ranking + summarization)
  └── LoggingService (structured JSON logging)
  ↓
Repository Layer (Data Access)
  └── ResumeRepository (MongoDB CRUD + queries)
  ↓
Middleware Layer (Cross-cutting concerns)
  ├── requestIdMiddleware (unique request tracking)
  ├── loggingMiddleware (JSON structured logging)
  ├── errorHandler (global error handling)
  └── payloadLimiter (request/response size limits)
```

---

## 2. Technology Stack & Versions

### Core Dependencies
```json
{
  "express": "^4.18.0",
  "typescript": "^5.0.0",
  "axios": "^1.6.0",
  "mongodb": "^6.0.0"
}
```

### API Clients (Wrappers Required)
- **Mistral API** (embeddings + re-ranking LLM)
  - Endpoint: `https://api.mistral.ai/v1/`
  - Auth: Bearer token in `Authorization` header
  - Rate limit: Handle 429 responses with exponential backoff

- **Groq API** (alternative LLM provider)
  - Endpoint: `https://api.groq.com/openai/v1/`
  - Auth: Bearer token
  - Model: `meta-llama/llama-4-scout-17b-16e-instruct`

- **MongoDB Atlas**
  - Native vector search support
  - BM25 full-text search support
  - Connection: via URI in `.env`

### Environment Variables (Required in `.env`)
```
# API Keys
MISTRAL_API_KEY=<your-mistral-key>
GROQ_API_KEY=<your-groq-key>

# Database
MONGODB_URI=<your-atlas-connection-string>
MONGODB_DB_NAME=resumes
MONGODB_COLLECTION=resumes

# App Config
NODE_ENV=development|production
PORT=3000
LOG_LEVEL=debug|info|warn|error

# Feature Flags
ENABLE_SUMMARIZATION=true
ENABLE_VECTOR_SEARCH=true
ENABLE_BM25_SEARCH=true
FALLBACK_ON_ERROR=true

# Tuning
RERANK_TOP_K=8
EMBEDDING_DIMENSION=1024
MAX_REQUEST_SIZE=5mb
MAX_RESPONSE_SIZE=10mb
```

---

## 3. Code Organization Standards

### File Structure (Follow Strictly)

```
src/
├── app.ts                          # Express app setup, routes registration
├── server.ts                       # HTTP server bootstrap
├── config/
│   ├── env.ts                      # Environment variable parsing/validation
│   └── constants.ts                # App-wide constants, default values
├── routes/
│   ├── health.ts                   # GET /v1/health, /v1/health/db
│   ├── embeddings.ts               # POST /v1/embeddings
│   ├── search.ts                   # POST /v1/search/*, main search endpoints
│   └── index.ts                    # Route registration
├── services/
│   ├── EmbeddingService.ts         # Mistral embedding API wrapper
│   ├── LLMService.ts               # LLM re-ranking, summarization, metadata extraction
│   ├── SearchService.ts            # Search orchestration (hybrid, BM25, vector)
│   └── LoggingService.ts           # Structured logging utility
├── repositories/
│   └── ResumeRepository.ts         # MongoDB CRUD, Atlas Search queries
├── middleware/
│   ├── requestIdMiddleware.ts      # Unique request ID generation
│   ├── loggingMiddleware.ts        # Request/response logging
│   ├── errorHandler.ts             # Global error handler
│   └── payloadLimiter.ts           # Request/response size validation
├── types/
│   ├── index.ts                    # Base types (RequestContext, AppError)
│   ├── resume.ts                   # Resume, ResumeMetadata types
│   ├── search.ts                   # SearchQuery, SearchResult, SearchOptions
│   └── llm.ts                      # RerankRequest, SummaryRequest, LLMResponse
└── utils/
    ├── logger.ts                   # Logger instance + structured logging
    └── helpers.ts                  # Utility functions (retry, validation, etc)
```

### TypeScript Conventions

1. **Type Safety**: Strict mode enabled (`strict: true` in tsconfig.json)
   - All functions must have explicit return types
   - No implicit `any` types
   - Null/undefined handling mandatory

2. **Naming Conventions**:
   - Classes: PascalCase (`EmbeddingService`, `ResumeRepository`)
   - Functions: camelCase (`getEmbedding`, `searchBM25`)
   - Constants: UPPER_SNAKE_CASE (`DEFAULT_TOP_K`, `EMBEDDING_DIMENSION`)
   - Types/Interfaces: PascalCase (`SearchQuery`, `ResumeMetadata`)
   - Private members: prefix with `_` (`_cache`, `_logger`)

3. **Async Patterns**:
   - Prefer `async/await` over `.then()` chains
   - Always define return type on async functions
   - Error handling: prefer explicit `try/catch` blocks
   - Never swallow errors silently

---

## 4. Service Layer Implementation Patterns

### EmbeddingService

**Purpose**: Wrap Mistral embedding API calls with caching, error handling, retry logic.

**Methods**:
```typescript
async generateEmbedding(
  text: string,
  modelName?: string  // default: "mistral-embed"
): Promise<number[]>

async batchGenerateEmbeddings(
  texts: string[],
  modelName?: string
): Promise<number[][]>  // for future use
```

**Requirements**:
- Cache embeddings in-memory (Map) to avoid duplicate calls
- Implement exponential backoff for rate-limit handling (429)
- Timeout: 30 seconds per call
- Error propagation: throw `AppError` with code `EMBEDDING_FAILED`
- Log: model used, input length, dimension returned

**Example**:
```typescript
class EmbeddingService {
  private _cache: Map<string, number[]> = new Map();
  private _logger: any;

  async generateEmbedding(text: string): Promise<number[]> {
    const cacheKey = this._getCacheKey(text);
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey)!;
    }
    
    try {
      const embedding = await this._callMistralAPI(text);
      this._cache.set(cacheKey, embedding);
      return embedding;
    } catch (error) {
      throw new AppError(
        'EMBEDDING_FAILED',
        'Failed to generate embedding',
        500,
        { originalError: error }
      );
    }
  }
}
```

### LLMService

**Purpose**: Orchestrate all LLM interactions (re-ranking, summarization, metadata extraction).

**Methods**:
```typescript
async rerankCandidates(
  query: string,
  candidates: CandidateSnippet[],
  topK: number
): Promise<RerankResult[]>

async summarizeCandidateFit(
  query: string,
  candidate: CandidateSnippet,
  options: { style: 'short' | 'detailed'; maxTokens?: number }
): Promise<string>

async extractMetadata(
  resumeText: string
): Promise<ResumeMetadata>
```

**Requirements**:
- Use prompt templates from `prompts/` directory
- Temperature settings:
  - Re-ranking: 0.3 (deterministic, precise scoring)
  - Summarization: 0.7 (balanced creativity + consistency)
  - Extraction: 0.1 (strict, factual extraction)
- Timeout: 60 seconds for re-ranking (up to 10 candidates), 30 for summarization
- Response validation: validate JSON structure before returning
- Fallback on error: Return reasonable defaults, log error, mark response with `hasError: true`
- Always include `usageTokens` in response for monitoring

**Example**:
```typescript
async rerankCandidates(
  query: string,
  candidates: CandidateSnippet[],
  topK: number
): Promise<RerankResult[]> {
  const prompt = this._buildRerankPrompt(query, candidates, topK);
  
  try {
    const response = await this._callLLM(prompt, {
      temperature: 0.3,
      maxTokens: 2000,
      timeout: 60000
    });
    
    const parsed = JSON.parse(response.content);
    return parsed.slice(0, topK);
  } catch (error) {
    this._logger.error('Rerank failed', { error, query, candidateCount: candidates.length });
    throw new AppError('RERANK_FAILED', 'LLM re-ranking failed', 500);
  }
}
```

### SearchService

**Purpose**: Orchestrate search pipeline (BM25 → vector → merge → rerank → summarize).

**Methods**:
```typescript
async bm25Search(
  query: string,
  filters?: SearchFilters,
  topK: number = 20
): Promise<SearchResult[]>

async vectorSearch(
  query: string,
  filters?: SearchFilters,
  topK: number = 20
): Promise<SearchResult[]>

async hybridSearch(
  query: string,
  filters?: SearchFilters,
  topK?: number
): Promise<HybridSearchResult>

async endToEndSearch(
  query: string,
  filters?: SearchFilters,
  options: SearchOptions
): Promise<EndToEndResult>
```

**Flow for `endToEndSearch` (CRITICAL)**:
1. Validate query (non-empty, ≤ 5000 chars)
2. Generate query embedding via `EmbeddingService`
3. Call `bm25Search` and `vectorSearch` in parallel
4. Merge results, deduplicate by `resumeId`, keep top N
5. Call `LLMService.rerankCandidates` on merged candidates
6. If `options.summarize === true`, call `LLMService.summarizeCandidateFit` for each (or top-K)
7. Return final ranked list with metrics and timings

**Fallback Logic**:
- If re-ranking fails → use hybrid heuristic (BM25 priority + vector)
- If vector search fails → BM25 only, mark `vectorFallback: true`
- If BM25 fails → vector only, mark `bm25Fallback: true`
- If summarization fails → return results without summaries, include warning

**Timing Strategy**:
- Track component timings: `embeddingMs`, `bm25Ms`, `vectorMs`, `rerankMs`, `summarizeMs`
- Return all timings in response

---

## 5. Repository Layer (ResumeRepository)

**Purpose**: Encapsulate all MongoDB operations. Single point of truth for data access.

**Methods** (Implement in this order):
```typescript
async connect(): Promise<void>
async disconnect(): Promise<void>
async getById(resumeId: string): Promise<Resume | null>
async search(query: string, topK: number): Promise<Resume[]>  // BM25
async vectorSearch(embedding: number[], topK: number): Promise<Resume[]>
async getByIds(resumeIds: string[]): Promise<Resume[]>
async healthCheck(): Promise<{ status: 'ok' | 'error'; latencyMs: number }>
```

**MongoDB Indexes** (Atlas Search must be configured):
1. **BM25 Search Index**: On `text`, `skills`, `role`, `experienceSummary`
   - Index name: `bm25_search_index`
   - Enable fuzzy matching

2. **Vector Search Index**: On `embedding`
   - Index name: `vector_search_index`
   - Similarity metric: cosine
   - Dimensions: 1024

**Schema**:
```typescript
interface Resume {
  _id?: ObjectId;
  text: string;              // Full resume text
  embedding?: number[];      // Vector (1024 dims from Mistral)
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  company?: string;
  role?: string;
  education?: string;
  totalExperience?: number;
  relevantExperience?: number;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 6. Middleware Patterns

### Request ID Middleware
- Generate UUID for each request (using `uuid` or crypto)
- Attach to `req.context.requestId`
- Pass to all logging calls
- Include in response header: `X-Request-Id`

### Logging Middleware
- Log all requests in structured JSON format:
  ```json
  {
    "requestId": "...",
    "method": "POST",
    "endpoint": "/v1/search",
    "timestamp": "2025-02-28T...",
    "statusCode": 200,
    "durationMs": 1234,
    "componentTimings": {
      "embeddingMs": 200,
      "bm25Ms": 300,
      "vectorMs": 250,
      "rerankMs": 450,
      "summarizeMs": 0
    }
  }
  ```
- Log at request entry and response exit
- Include error details in logs if status ≥ 400

### Error Handler Middleware
- Catch all unhandled errors
- Standardize error response format:
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "Human-readable message",
      "requestId": "...",
      "timestamp": "..."
    }
  }
  ```
- Never expose internal stack traces in production

### Payload Limiter Middleware
- Enforce max request size (default: 5MB)
- Enforce max response size (default: 10MB)
- Return 413 Payload Too Large if exceeded
- Log oversized requests for monitoring

---

## 7. Type Definitions (Centralize in `src/types/`)

### Core Types
```typescript
// src/types/index.ts
interface RequestContext {
  requestId: string;
  startTime: number;
  userId?: string;
  componentTimings: {
    embeddingMs?: number;
    bm25Ms?: number;
    vectorMs?: number;
    rerankMs?: number;
    summarizeMs?: number;
  };
}

class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message);
  }
}

// src/types/resume.ts
interface Resume {
  _id?: string;
  text: string;
  embedding?: number[];
  name?: string;
  skills?: string[];
  // ... other fields
}

interface ResumeMetadata {
  name: string | null;
  email: string | null;
  skills: string[];
  totalExperienceYears: number | null;
  relevantExperienceYears: number | null;
  currentRole: string | null;
  currentCompany: string | null;
}

// src/types/search.ts
interface SearchQuery {
  query: string;
  topK?: number;
  filters?: Record<string, any>;
}

interface SearchResult {
  resumeId: string;
  score: number;
  snippet?: string;
  metadata?: Partial<ResumeMetadata>;
}

interface SearchOptions {
  summarize?: boolean;
  summaryStyle?: 'short' | 'detailed';
  topKToSummarize?: number;
}

// src/types/llm.ts
interface RerankResult {
  resumeId: string;
  score: number;
  rationale: string;
  keyMatches: string[];
  gaps: string[];
}

interface SummaryRequest {
  query: string;
  candidate: { resumeId: string; snippet: string };
  style: 'short' | 'detailed';
  maxTokens?: number;
}
```

---

## 8. Error Handling & Resilience

### Error Codes (Use Consistently)
```typescript
// Embedding errors
'EMBEDDING_FAILED'
'EMBEDDING_RATE_LIMITED'
'EMBEDDING_TIMEOUT'

// Search errors
'SEARCH_FAILED'
'BM25_FAILED'
'VECTOR_SEARCH_FAILED'
'HYBRID_SEARCH_FAILED'

// LLM errors
'RERANK_FAILED'
'SUMMARIZATION_FAILED'
'METADATA_EXTRACTION_FAILED'
'LLM_RATE_LIMITED'

// Data errors
'RESUME_NOT_FOUND'
'INVALID_QUERY'
'DATABASE_ERROR'

// System errors
'SERVICE_UNAVAILABLE'
'TIMEOUT'
'INVALID_PAYLOAD'
```

### Retry Logic (for transient failures)
- Implement exponential backoff for API calls
- Base delay: 100ms, max retries: 3, max delay: 5s
- Retry on: 429 (rate-limit), 5xx (server error), timeout
- Never retry on: 4xx (client error), validation failure

### Graceful Degradation
- If LLM unavailable: return BM25/vector results with fallback ordering
- If vector search unavailable: use BM25 only
- If BM25 unavailable: use vector only
- Mark response with degradation flag

---

## 9. Testing Patterns (Unit + Integration)

### Unit Test Structure
```typescript
describe('SearchService', () => {
  describe('endToEndSearch', () => {
    it('should return ranked results with timing metrics', async () => {
      // Setup
      // Execute
      // Assert: verify order, scores, included timings
    });

    it('should fallback to BM25 if reranking fails', async () => {
      // Setup: mock LLMService to throw
      // Execute
      // Assert: response marked with fallback flag
    });
  });
});
```

### Integration Test Structure
```typescript
describe('POST /v1/search (e2e)', () => {
  before(async () => {
    // Start server, connect to test DB
  });

  it('should return 200 with valid results', async () => {
    const response = await supertest(app)
      .post('/v1/search')
      .send({ query: 'senior backend engineer' });

    expect(response.status).toBe(200);
    expect(response.body.results).toHaveLength(10);
  });

  it('should return 400 on empty query', async () => {
    const response = await supertest(app)
      .post('/v1/search')
      .send({ query: '' });

    expect(response.status).toBe(400);
  });
});
```

---

## 10. Coding Best Practices (Enforce)

### Validation
- Validate all user input at route handlers
- Use schema validation library (e.g., `zod`, `joi`)
- Return 400 Bad Request with clear error messages

### Logging
- Always log with `requestId` context
- Log at entry and exit of service methods
- Log errors with full error object and context
- Never log PII (name, email, phone) except when necessary for debugging

### Performance
- Monitor API latency (target < 5s P95)
- Log component timings for debugging
- Cache embeddings to avoid duplicate API calls
- Use Promise.all() for parallel operations (BM25 + vector search)

### Security
- Validate API keys from environment at startup
- Don't expose sensitive errors to clients
- Rate-limit external API calls
- Validate all external API responses

### Code Style
- Use ESLint + Prettier (config provided)
- Max line length: 100 characters
- Use descriptive variable names (no abbreviations)
- Add comments for complex logic
- Remove console.log() before committing

---

## 11. Prompt Engineering Guidelines

### Re-ranking Prompt
- Provide clear scoring rubric (0-100 scale)
- Include tiebreaker rules for consistency
- Ask for JSON output with score, rationale, gaps
- Temperature: 0.3 (deterministic)

### Summarization Prompt
- Specify word count or token limits
- Provide output format (plain text, structured, etc)
- Control tone (professional, technical, business-focused)
- Temperature: 0.7 (balanced)

### Metadata Extraction Prompt
- Define each field precisely
- Provide examples of expected output
- Specify null/empty handling rules
- Temperature: 0.1 (strict, factual)

See `prompts/` directory for full prompt templates.

---

## 12. Common Copilot Tasks & Patterns

### Task: "Implement new search endpoint"
1. Define request/response types in `src/types/`
2. Add route handler in `src/routes/search.ts`
3. Add service method in `src/services/SearchService.ts`
4. Add repository queries in `src/repositories/ResumeRepository.ts`
5. Add integration tests
6. Update API documentation

### Task: "Debug slow search response"
1. Check component timings in logs
2. Identify slowest component (embedding, BM25, vector, rerank)
3. Review service method for n+1 queries, missing caches
4. Check MongoDB indexes, Atlas Search config
5. Review API rate limits, quota usage

### Task: "Optimize LLM calls"
1. Add prompt caching if possible
2. Batch requests where viable
3. Reduce token usage (shorter prompts, fewer candidates)
4. Use lower-cost model for non-critical operations
5. Monitor token usage for cost estimation

### Task: "Add fallback logic"
1. Wrap service call in try/catch
2. Provide sensible fallback data
3. Log fallback activation with reason
4. Mark response with fallback flag
5. Return appropriate status code (200 OK with degradation)

---

## 13. Deployment & Configuration

### Local Development Setup
```bash
npm install
cp .env.example .env
# Fill in API keys and MongoDB URI
npm run dev
```

### Production Deployment
- Use `npm run build` to compile TypeScript
- Set `NODE_ENV=production`
- Use managed hosting (AWS ECS, Render, Railway, etc)
- Monitor logs via centralized logging service
- Set up alerts on error rates, latency P95

### Configuration Management
- All config via environment variables (no hardcoded values)
- Validate required env vars at startup
- Log config on startup (mask sensitive values)
- Support feature flags for gradual rollout

---

## 14. Documentation Requirements

For each new feature/endpoint:
1. Update `docs/API_ENDPOINTS.md` with request/response examples
2. Add JSDoc comments to functions (what, why, example)
3. Document error codes and fallback behavior
4. Add examples in README if user-facing

---

## 15. Performance Targets & Monitoring

### Latency Targets
- Embedding generation: < 500ms
- BM25 search: < 300ms
- Vector search (ANN): < 500ms
- LLM re-ranking (8 candidates): < 3s
- Full pipeline (P95): < 5s

### Metrics to Track
- Request count by endpoint
- Latency distribution (p50, p95, p99)
- Error rate by error code
- LLM token usage (cost estimation)
- Cache hit rate (embeddings)
- Fallback activation rate

### Logging Checklist
- ✓ Every request logged with requestId
- ✓ Component timings included
- ✓ Errors logged with context (not just message)
- ✓ No PII in logs unless necessary
- ✓ Structured JSON format (parseable)

---

## 16. Quick Reference

### Environment Variables (Minimal Set)
```bash
MISTRAL_API_KEY=sk-...
GROQ_API_KEY=gsk-...
MONGODB_URI=mongodb+srv://...
PORT=3000
NODE_ENV=development
```

### Key Dependencies
```bash
npm install express axios mongodb uuid dotenv
npm install --save-dev typescript @types/node ts-node
```

### Common Commands
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Run compiled server
npm test            # Run all tests
npm run lint        # Check code style
```

---

## 17. When to Ask Questions

Use Copilot side chat for:
- **Code generation**: "Implement the BM25 search method in SearchService"
- **Refactoring**: "Extract common error handling logic into utility"
- **Debugging**: "Why is the vector search returning 0 results?"
- **Best practices**: "How should I cache embedding results?"
- **Documentation**: "Generate JSDoc for the endToEndSearch method"

**NOT for** (use external resources):
- Architecture redesign questions
- Major infrastructure changes
- Business logic decisions that require stakeholder input

---

## 18. Success Criteria Checklist

For any implementation task:
- [ ] Types defined (no implicit `any`)
- [ ] Error handling with specific error codes
- [ ] Logging at service entry and exit
- [ ] Unit tests (target: 80%+ coverage)
- [ ] Integration tests for endpoints
- [ ] Component timings tracked
- [ ] Fallback logic implemented (if applicable)
- [ ] Performance targets met or documented
- [ ] JSDoc comments added
- [ ] No breaking changes to existing API

---

**Last Updated**: 2025-02-28  
**Version**: 1.0  
**Maintainer**: Development Team