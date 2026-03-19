# QA-Bot TypeScript Backend - System Design Document

**Version:** 2.0 | **Date:** March 14, 2026 | **Status:** Production Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [API Specification](#api-specification)
6. [Search Engines](#search-engines)
7. [Conversational RAG](#conversational-rag)
8. [Memory Management](#memory-management)
9. [LLM Integration](#llm-integration)
10. [Error Handling & Logging](#error-handling--logging)
11. [Configuration & Deployment](#configuration--deployment)
12. [Performance & Scalability](#performance--scalability)

---

## Executive Summary

**QA-Bot** is an intelligent resume search platform built with Express.js, LangChain, and MongoDB Atlas. It enables multi-modal candidate discovery through keyword, vector, and hybrid search capabilities, enhanced with LLM-powered semantic understanding and conversational interaction.

### Key Features

- 🔍 **Multi-Modal Search**: Keyword (BM25), Vector (semantic), Hybrid (weighted combination)
- 💬 **Conversational RAG**: Multi-turn conversations with full chat history and context awareness
- 🧠 **LLM-Powered**: 5+ LLM providers with intelligent re-ranking and semantic extraction
- 🚀 **Scalable Pipeline Architecture**: Modular, testable, production-ready
- 🔐 **Type-Safe**: Full TypeScript with Zod validation schemas
- 📊 **Advanced Filtering**: Smart detection of filter queries with result caching

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Application                      │
│                    (Frontend / Web App)                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────────┐
│                    Express.js Server                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API Routes                         │   │
│  │  /health, /search/resumes, /candidate/:id, /chat    │   │
│  └──────────────────┬──────────────────────────────────┘   │
└───────────────────┬───────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──┐  ┌────▼────┐  ┌──▼──────────┐
│ Pipeline │  │   RAG   │  │   Memory    │
│ Manager  │  │  Chain  │  │   Store     │
└───────┬──┘  └────┬────┘  └──┬──────────┘
        │          │          │
  ┌─────▼──────────▼──────────▼──────┐
  │    Search Engines                │
  │  ┌────────┐ ┌────────┐ ┌──────┐  │
  │  │BM25    │ │Vector  │ │Hybrid│  │
  │  │Engine  │ │Engine  │ │Eng.  │  │
  │  └────┬───┘ └───┬────┘ └──┬───┘  │
  └───────┼────────┼───────────┼──────┘
          │        │           │
  ┌───────▼────────▼───────────▼──────┐
  │         External Services         │
  │  ┌──────────┐  ┌──────────────┐   │
  │  │MongoDB   │  │LLM Providers │   │
  │  │Atlas     │  │(OpenAI, etc) │   │
  │  └──────────┘  └──────────────┘   │
  └──────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js TypeScript | Server runtime with type safety |
| **Framework** | Express.js | HTTP server & routing |
| **AI/ML** | LangChain | LLM chains & orchestration |
| **Database** | MongoDB Atlas | Document storage & vector search |
| **Embeddings** | OpenAI, Mistral, Groq | Text vectorization |
| **LLMs** | GPT-4o, Claude 3.5, Mixtral | Semantic understanding & re-ranking |
| **Validation** | Zod | Schema validation & type inference |
| **Logging** | Console (structured) | Request tracking & debugging |

---

## Core Components

### 1. Server (server.ts)

**Responsibility**: HTTP server initialization and route setup

**Key Responsibilities:**
- Express.js app initialization with middleware
- JSON request parsing (10MB limit)
- Route registration and error handling
- MongoDB connection management
- Retrieval pipeline initialization

**Dependencies:**
- MongoDB client for database connections
- RetrievalPipeline for search orchestration
- LLM model factory
- Conversation memory store

### 2. Retrieval Pipeline

**Responsibility**: Orchestrate multi-modal search engines

**Location:** `src/pipelines/`

**Architecture:**
```
RetrievalPipeline
├── Vector Search Engine
├── Keyword (BM25) Search Engine
├── Hybrid Search Engine
└── LLM Re-Ranker (optional)
```

**Key Methods:**
- `search(query, searchType, topK, traceId)` - Execute search with fallback
- `executeKEYWORDSearch()` - BM25-like matching
- `executeVECTORSearch()` - Semantic similarity search
- `executeHYBRIDSearch()` - Weighted combination (60% vector, 40% keyword)
- `rerankWithLLM()` - Optional semantic re-ranking

**Fallback Logic:**
```
PRIMARY: Try requested search type
IF FAILS → SECONDARY: Try fallback engine
IF FAILS → TERTIARY: Try vector search
IF FAILS → Return empty results with error
```

### 3. Vector Store Manager

**Responsibility**: MongoDB vector search integration

**Location:** `src/lib/vectorstore/`

**Features:**
- Lazy index initialization
- Support for multiple embedding providers
- Configurable distance metrics (cosine, euclidean, dotProduct)
- Pre-computed embeddings stored in MongoDB

**Supported Providers:**
- OpenAI (Recommended: text-embedding-3-small)
- Mistral AI
- Groq
- Custom embeddings (pre-computed)

### 4. Conversational RAG Chain

**Responsibility**: Multi-turn conversation management

**Location:** `src/lib/conversationalRAGChain.ts`

**Components:**
- **Memory Manager**: In-memory chat history storage
- **Chat History**: Full conversation context (user + assistant)
- **Search Results Cache**: Cached results for filtering
- **Conversational Filter**: Detects follow-up queries

**Flow:**
```
1. Receive user message
2. Load conversation history (if exists)
3. Detect if filter query (on cached results)
   └─ If YES: Apply filter to cached results
   └─ If NO: Execute full search
4. Add user message to history
5. Generate LLM response
6. Add assistant response to history
7. Cache search results
8. Return response + results
```

### 5. Conversational Filter

**Responsibility**: Smart filter detection and execution

**Location:** `src/lib/conversationalFilter.ts`

**Filter Keywords:**
- "filter", "only", "show me", "with", "without"
- "from", "in", "at", "company", "location"
- "looking for", "need someone", "prefer"

**Example Queries:**
- "Filter those with React" → Apply skills filter
- "Only from Microsoft" → Apply company filter
- "Without Java experience" → Exclusion filter

### 6. Chat Memory Manager

**Responsibility**: Conversation state and history management

**Location:** `src/lib/memory/`

**Implements:**
- **ChatBuffer**: LangChain's BufferMemory wrapper
- **Message Metadata**: Timestamps, exchange indices
- **Result Caching**: Store last search results
- **History Logging**: Debug conversation state

**Configuration:**
```typescript
{
  memoryKey: "chat_history",        // Variable name in prompts
  maxMessages: 10,                   // Keep last 10 messages (5 exchanges)
  windowSize: 5,                     // Sliding window size
  bufferStrategy: "sliding" | "fixed" // Buffer management
}
```

### 7. LLM Model Factory

**Responsibility**: Pluggable LLM provider management

**Location:** `src/lib/models/index.ts`

**Supported Models:**
```
OpenAI:
  - gpt-4o (latest, most capable)
  - gpt-4o-mini (cost-optimized)

Anthropic:
  - claude-3-5-sonnet (latest Claude)

Groq:
  - mixtral-8x7b-32768 (fast, open-source)

Mistral AI:
  - mistral-large (powerful)
  - mistral-medium (balanced)

Testleaf:
  - Custom proxy provider
```

**Factory Pattern:**
```typescript
const model = createChatModel(); // Uses env: LLM_PROVIDER, MODEL_NAME
// Returns LangChain ChatModel instance
```

---

## Data Flow

### Complete Request Journey

#### 1. Search Request Flow

```
POST /search/resumes
│
├─ Validate request (SearchRequestSchema)
├─ Extract: query, searchType (keyword|vector|hybrid), topK
│
├─ RetrievalPipeline.search()
│  ├─ [KEYWORD] BM25-like MongoDB aggregation
│  ├─ [VECTOR] Vector search via MongoDB Atlas Search
│  ├─ [HYBRID] Combine both with weights (0.6 vector, 0.4 keyword)
│  └─ Fallback: If all fail, return empty results
│
├─ Enrich results: Add MongoDB _id if missing
├─ Score normalization: All scores 0-1 range
├─ Format response: SearchResponse schema
│
└─ Response: { results, searchType, resultCount, duration }
```

#### 2. Conversational Chat Flow

```
POST /chat
│
├─ Validate request (ConversationalQuerySchema)
├─ Extract: message, conversationId (optional)
│
├─ Initialize/load memory manager
├─ Detect: Is this a filter query?
│
├─ IF filter query AND cached results exist:
│  └─ ConversationalFilter.filterResults()
│     ├─ LLM analyzes filter criteria
│     ├─ Apply filters to cached results
│     └─ Return filtered subset + summary
│
├─ ELSE perform full RAG search:
│  ├─ ConversationalRAGChainManager.chat()
│  ├─ Hybrid search with top-10 results
│  ├─ LLM re-ranks results (optional)
│  ├─ Format structured response with reasoning
│  └─ Cache results for potential filtering
│
├─ Save to chat history:
│  ├─ Add user message
│  ├─ Add assistant response
│  └─ Store conversation state
│
└─ Response: { conversationId, response, searchResults, messageCount }
```

#### 3. Candidate Detail Flow

```
GET /candidate/:id
│
├─ Validate MongoDB ObjectId
├─ Query MongoDB for document
├─ Extract structured fields:
│  ├─ Personal: name, email, phone, location
│  ├─ Professional: role, company, skills
│  ├─ Experience: education, certifications
│  └─ Resume: full text content
│
├─ Optional LLM processing:
│  └─ Extract skills, experience level, specializations
│
└─ Response: CandidateProfile schema
```

---

## API Specification

### 1. Health Check

**Endpoint:** `GET /health`

**Purpose:** System status and diagnostics

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-03-14T21:30:00Z",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "embeddingProvider": "openai",
    "embeddingModel": "text-embedding-3-small"
  },
  "retrievalPipeline": "ready",
  "activeConversations": 5
}
```

**Status Codes:**
- `200` - System healthy
- `503` - Retrieval pipeline not initialized

---

### 2. Search Resumes

**Endpoint:** `POST /search/resumes`

**Purpose:** Multi-modal candidate search

**Request Schema:**
```typescript
{
  query: string;              // Search query (required)
  searchType: "keyword" | "vector" | "hybrid";  // Default: "hybrid"
  topK: number;               // Results to return (default: 5, max: 100)
  filters?: {                 // Optional filters
    company?: string[];
    skills?: string[];
    location?: string[];
  }
}
```

**Response Schema:**
```typescript
{
  results: [{
    id: string;              // MongoDB ObjectId
    name: string;
    email: string;
    phoneNumber: string;
    score: number;           // 0-1 normalized score
    matchType: "keyword" | "vector" | "hybrid";
    extractedInfo?: {        // Optional LLM extraction
      skills: string[];
      experience: string;
      specialization: string;
    };
    llmReasoning?: string;   // Why matched this candidate
  }];
  searchType: string;
  resultCount: number;
  duration: number;          // milliseconds
}
```

**Error Responses:**
```json
{
  "error": "Failed to execute search",
  "details": "Vector search failed, falling back to keyword search",
  "traceId": "search_1234567890_abc123"
}
```

**Search Logic:**
- **Keyword**: MongoDB full-text search on name, email, skills, experience
- **Vector**: Cosine similarity on embeddings (requires MongoDB Atlas Search index)
- **Hybrid**: `(vector_score * 0.6) + (keyword_score * 0.4)`

---

### 3. Get Candidate Details

**Endpoint:** `GET /candidate/:id`

**Purpose:** Full candidate profile with resume

**Path Parameters:**
```
:id - MongoDB ObjectId (24-character hex string)
```

**Response Schema:**
```typescript
{
  candidate: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;            // Job title
    company: string;         // Current/last company
    skills: string[];        // Extracted technical skills
    experience: string;      // Years of experience
    specialization: string;  // Primary expertise
    resumeContent: string;   // Full resume text
    
    // Additional fields
    location?: string;
    linkedinProfile?: string;
    education?: string[];
    certifications?: string[];
  }
}
```

**Error Responses:**
```json
{
  "error": "Candidate not found",
  "id": "invalid-id"
}
```

---

### 4. Conversational Chat

**Endpoint:** `POST /chat`

**Purpose:** Multi-turn conversational search with RAG

**Request Schema:**
```typescript
{
  message: string;                    // User query (required)
  conversationId?: string;            // Resume conversation (optional)
  includeHistory?: boolean;           // Return full chat history (default: false)
}
```

**Response Schema:**
```typescript
{
  conversationId: string;             // Unique conversation ID
  response: string;                   // LLM-generated response
  searchResults: [{
    // Same as search results schema
    id: string;
    name: string;
    email: string;
    score: number;
    ...
  }];
  messageCount: number;               // Total messages in conversation
  searchType: string;                 // How results were found
}
```

**Chat Memory:**
- Messages stored in-memory per conversationId
- Max 10 messages (5 exchanges) by default
- Sliding window keeps conversation context focused
- Results cached for filter queries

---

### 5. Get Conversation History

**Endpoint:** `POST /chat/history`

**Purpose:** Retrieve full conversation history

**Request Schema:**
```typescript
{
  conversationId: string;
}
```

**Response Schema:**
```typescript
{
  conversationId: string;
  messages: [{
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }];
  totalMessages: number;
}
```

---

### 6. Delete Conversation

**Endpoint:** `DELETE /chat/:conversationId`

**Purpose:** Clear conversation and its history

**Response:**
```json
{
  "success": true,
  "conversationId": "conv_xxx",
  "messagesDeleted": 8
}
```

---

### 7. Document QA

**Endpoint:** `POST /search/document`

**Purpose:** Q&A on a single resume document

**Request Schema:**
```typescript
{
  candidateId: string;
  question: string;
}
```

**Response Schema:**
```typescript
{
  candidateId: string;
  candidateName: string;
  question: string;
  answer: string;           // LLM-generated answer
  relevantExcerpts: string[]; // Matching resume sections
}
```

---

## Search Engines

### Search Type Comparison

| Feature | Keyword (BM25) | Vector (Semantic) | Hybrid |
|---------|----------------|------------------|--------|
| **Accuracy** | Exact match | Semantic similarity | Best overall |
| **Speed** | ⚡ Fast | ⚡⚡ Medium | ⚡ Fast |
| **Best For** | Specific skills, names | Conceptual queries | General search |
| **Fallback** | Used when vector fails | Used when keyword fails | Primary |
| **Weights** | 40% (in hybrid) | 60% (in hybrid) | 60/40 split |

### Keyword Search (BM25)

**Implementation:** MongoDB full-text search

**Indexed Fields:**
- name (1.0x weight)
- email (0.8x weight)
- skills (1.2x weight)
- experience (1.0x weight)
- role (0.9x weight)

**Query:** "React Playwright QA"

**Results:** Candidates with exact mentions of keywords

### Vector Search (Semantic)

**Implementation:** MongoDB Atlas Vector Search

**Process:**
1. Embed query using configured provider (OpenAI, Mistral, etc.)
2. Find nearest neighbors in vector space (cosine distance)
3. Return top-K results with similarity scores

**Query:** "I need someone who automates web testing"

**Results:** Candidates with semantic match (even if keywords differ)

### Hybrid Search

**Formula:**
```
final_score = (vector_score × 0.6) + (keyword_score × 0.4)
```

**Normalization:**
```
normalized_vector = vector_similarity / max_vector
normalized_keyword = keyword_score / max_keyword
final = (normalized_vector × 0.6) + (normalized_keyword × 0.4)
```

**Benefits:**
- Combines precision (keyword) with semantic understanding (vector)
- Fewer exact-match misses than keyword alone
- Better relevance ranking than vector alone
- Configurable weights for tuning

---

## Conversational RAG

### Architecture

```
User Message
    ↓
[Memory: Load Chat History] ← (previous exchanges)
    ↓
[Intent Detection]
├─ Is this a FILTER query? (detect keywords: "filter", "only", "with")
│  └─ YES → Use cached results
│  └─ NO → Execute full search
    ↓
[Search/Filter]
├─ Option A: LLM-powered filtering on cached results
│  └─ Input: Filter criteria + candidate list
│  └─ Output: Filtered candidates + summary
│
├─ Option B: Full hybrid search
│  ├─ Embed query
│  ├─ Execute vector + keyword search
│  ├─ Combine results (60% vector, 40% keyword)
│  └─ Optional LLM re-ranking
    ↓
[LLM Response Generation]
├─ Prompt: System prompt + chat history + search results
├─ Generate conversational response
├─ Format with reasoning about matches
    ↓
[Memory: Save Exchange]
├─ User message → history
├─ Assistant response → history
├─ Search results → cache
    ↓
Response to Client
```

### Chat Memory Management

**Implementation:** Sliding Window Buffer

**Configuration:**
```typescript
{
  maxMessages: 10,           // Keep last 10 messages
  windowSize: 5,             // Active context window: 5 exchanges
  bufferStrategy: "sliding"  // Remove oldest when max exceeded
}
```

**Example Flow:**
```
Exchange 1: User → "Find React developers"
           Bot → 10 results

Exchange 2: User → "Filter those with 5+ years"
           Bot → Uses cached results, no new search
           Memory: 2 exchanges = 4 messages

Exchange 3: User → "Now show me Kubernetes experts"
           Bot → New search, reset cache
           Memory: 3 exchanges = 6 messages

Exchange 6: User → ...
           Bot → ...
           Memory: MAX REACHED (10 messages = 5 exchanges)
           
Exchange 7: User → ...
           Bot → ...
           Memory: [Removed: Exchanges 1-2], Keep [3-7]
           Memory: Sliding window: 5 most recent exchanges
```

### Result Caching Strategy

**When Caching:**
- After successful hybrid search
- Store full result set (not paginated)

**Cache Usage:**
- Filter queries use cached results (avoid unnecessary embeddings)
- New search queries invalidate cache
- Cache lifetime: Until new search or conversation cleared

**Benefits:**
- Reduces API calls to embedding provider
- Faster filter query response
- Natural conversation flow (filter existing results)

---

## Memory Management

### In-Memory Storage

**Global Conversation Store:**
```typescript
conversationStore: Map<conversationId, ChatMemoryManager>
```

**Per-Conversation State:**
```typescript
{
  conversationId: "conv_123",
  messages: [
    { role: "user", content: "...", timestamp: 1234567890 },
    { role: "assistant", content: "...", timestamp: 1234567891 },
    // ...
  ],
  lastSearchResults: [
    { id, name, email, score, ... },
    // ...
  ],
  metadata: {
    createdAt: timestamp,
    lastAccessedAt: timestamp,
    exchangeCount: 5
  }
}
```

### Memory Characteristics

| Aspect | Details |
|--------|---------|
| **Storage** | In-memory (process RAM) |
| **Persistence** | Lost on server restart ❌ |
| **Scalability** | Limited by available memory |
| **Cost** | No database calls for history ✅ |
| **Speed** | O(1) access, instant response ✅ |

### Cleanup & Lifecycle

**Inactive Conversation Cleanup:**
- Background timer: Every 5 minutes
- Timeout: 1 hour of inactivity
- Action: Delete old conversations from memory

**Example:**
```typescript
// Every 5 minutes, check all conversations
setInterval(() => {
  const now = Date.now();
  for (const [convId, timestamp] of conversationTimestamps) {
    if (now - timestamp > 60 * 60 * 1000) {  // 1 hour
      delete conversations[convId];  // Clean up
    }
  }
}, 5 * 60 * 1000);  // 5 minutes
```

---

## LLM Integration

### Supported Providers

#### 1. OpenAI
```typescript
{
  provider: "openai",
  models: ["gpt-4o", "gpt-4o-mini"],
  embeddings: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: "https://api.openai.com/v1"
}
```

**Strengths:**
- Most capable reasoning (GPT-4o)
- Excellent code understanding
- Wide adoption & documentation

**Cost:** $$$ (higher token prices)

#### 2. Anthropic Claude
```typescript
{
  provider: "anthropic",
  models: ["claude-3-5-sonnet"],
  apiKey: process.env.ANTHROPIC_API_KEY
}
```

**Strengths:**
- Long context window (200K tokens)
- Strong reasoning
- Better for nuanced tasks

**Cost:** $$ (mid-range prices)

#### 3. Groq
```typescript
{
  provider: "groq",
  models: ["mixtral-8x7b-32768"],
  apiKey: process.env.GROQ_API_KEY,
  maxTokens: 32768
}
```

**Strengths:**
- Very fast inference
- Cost-effective
- Open-source model

**Cost:** $ (cheapest)

#### 4. Mistral AI
```typescript
{
  provider: "mistral",
  models: ["mistral-large", "mistral-medium"],
  embeddings: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY
}
```

**Strengths:**
- Fast, efficient models
- Good balance of cost/performance
- Strong on structured tasks

**Cost:** $ (affordable)

#### 5. Testleaf (Custom Proxy)
```typescript
{
  provider: "testleaf",
  apiKey: process.env.TESTLEAF_API_KEY,
  baseUrl: process.env.TESTLEAF_BASE_URL
}
```

**Strengths:**
- Custom proxy for testing
- Flexible configuration
- Organization-specific setup

### Model Selection at Runtime

**Configuration:**
```bash
# Environment variables
LLM_PROVIDER=openai              # or: anthropic, groq, mistral, testleaf
MODEL_NAME=gpt-4o                # or: claude-3-5-sonnet, mixtral-8x7b-32768, etc.
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-small
```

**Usage:**
```typescript
const model = createChatModel();  // Reads from env, returns LangChain ChatModel

// Use in LangChain chains/prompts
const chain = prompt.pipe(model).pipe(parser);
const response = await chain.invoke({ input: "..." });
```

### LLM Use Cases in QA-Bot

#### 1. Conversational Response Generation
- Understand multi-turn context
- Generate natural conversational replies
- Explain why candidates match

#### 2. Semantic Search Re-Ranking
- Analyze search results
- Re-rank based on semantic relevance
- Extract reasoning for matches

#### 3. Information Extraction
- Extract skills from resumes
- Identify company, location, specialization
- Structure unstructured resume text

#### 4. Filter Query Understanding
- Detect filter intent in follow-up queries
- Apply sophisticated filtering rules
- Generate summaries of filtered results

---

## Error Handling & Logging

### Error Categories

#### 1. Validation Errors
```
Cause: Invalid request schema
Response: 400 Bad Request
Example: Missing required field "query"
```

#### 2. Search Failures
```
Cause: All search engines fail
Fallback: Retry with different engine
Response: Empty results + error trace
```

#### 3. Database Errors
```
Cause: MongoDB connection loss
Response: 503 Service Unavailable
Recovery: Auto-reconnect attempt
```

#### 4. LLM Errors
```
Cause: Model API failure, rate limit, timeout
Response: Return best-effort response without LLM enhancement
```

### Request Tracing

**Trace ID Format:** `{operation}_{timestamp}_{random}`

**Example:** `search_1710457800_a1b2c3`

**Logged Info:**
```
[search_1710457800_a1b2c3] === SEARCH REQUEST RECEIVED ===
Timestamp: 2024-03-14T21:30:00Z
Request Body: { query: "...", searchType: "hybrid", topK: 5 }
[search_1710457800_a1b2c3] Request validated
  Query: "React developers"
  Search Type: hybrid
  Top-K: 5
[search_1710457800_a1b2c3] 🔎 Processing with hybrid search...
[search_1710457800_a1b2c3] Search results: 8 candidates
[search_1710457800_a1b2c3] Processing completed in 245ms
[search_1710457800_a1b2c3] Response length: 1234 characters
```

### Structured Logging

**Log Levels:**
- `INFO` - Normal operations
- `WARN` - Fallback/retry scenarios
- `ERROR` - Failures, exceptions
- `DEBUG` - Detailed execution trace (optional)

**Log Format:**
```
[${traceId}] ${operation} - ${status} (${duration}ms)
```

---

## Configuration & Deployment

### Environment Variables

```bash
# LLM Configuration
LLM_PROVIDER=openai                      # openai|anthropic|groq|mistral|testleaf
MODEL_NAME=gpt-4o                        # Model ID
OPENAI_API_KEY=sk-...                    # OpenAI API key
ANTHROPIC_API_KEY=sk-ant-...             # Anthropic API key
GROQ_API_KEY=gsk_...                     # Groq API key
MISTRAL_API_KEY=...                      # Mistral API key

# Embedding Configuration
EMBEDDING_PROVIDER=openai                # openai|mistral
EMBEDDING_MODEL=text-embedding-3-small   # Embedding model

# Database Configuration
MONGODB_URI=mongodb+srv://...            # MongoDB Atlas connection
DB_NAME=qa_bot_db                        # Database name
COLLECTION_NAME=candidates               # Collection name

# Server Configuration
PORT=3001                                # Server port
NODE_ENV=production                      # production|development

# Search Configuration
VECTOR_SEARCH_WEIGHT=0.6                 # Hybrid: 60% vector, 40% keyword
KEYWORD_SEARCH_WEIGHT=0.4
TOP_K_DEFAULT=5                          # Default results
TOP_K_MAX=100                            # Maximum results
```

### Build & Run

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run server
npm start

# Development (watch mode)
npm run dev

# Build production bundle
npm run build
```

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY ./dist ./dist

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["node", "dist/server.js"]
```

---

## Performance & Scalability

### Bottlenecks & Solutions

| Bottleneck | Impact | Solution |
|-----------|--------|----------|
| **Vector embeddings** | Slow (250-500ms per query) | Cache embeddings, use faster model |
| **MongoDB vector search** | Can be slow with large datasets | Create proper indices, pagination |
| **LLM API calls** | Rate limits, latency | Batch requests, use faster model |
| **In-memory conversations** | Memory leaks on long lifetime | Cleanup inactive convos, persistence |
| **Single-instance deployment** | No HA/failover | Use load balancer, multiple instances |

### Performance Metrics

**Typical Response Times (OpenAI GPT-4o):**
- Keyword search: 50-150ms
- Vector search: 300-500ms
- Hybrid search: 400-600ms
- Hybrid + LLM re-rank: 1000-1500ms
- Chat response: 500-2000ms

**Resource Usage:**
- RAM: 150-300MB base + ~5MB per active conversation
- CPU: Low (I/O bound, not compute bound)
- Network: Dependent on embedding/LLM provider

### Scaling Recommendations

#### Horizontal Scaling
1. Multiple server instances behind load balancer
2. Stateless design (conversations in-memory or Redis)
3. Shared MongoDB cluster

#### Vertical Scaling
1. Larger server instances
2. More memory for in-memory storage
3. Higher throughput connection pools

#### Optimization
1. **Caching**: Redis for conversation state
2. **Batch Processing**: Queue search requests
3. **Async Processing**: Move LLM re-ranking to background job
4. **Pagination**: Limit result sets returned
5. **Model Selection**: Use faster, cheaper models (Groq, Mistral)

---

## Future Enhancements

### Short Term (1-2 months)
- ✅ Persistent conversation storage (MongoDB/Redis)
- ✅ Authentication & authorization (JWT/OAuth)
- ✅ Rate limiting & API quotas
- ✅ Monitoring & alerting dashboard
- ✅ Candidate filtering UI enhancement

### Medium Term (3-6 months)
- Multi-language support (translate queries)
- Advanced filters (date range, salary, etc.)
- Saved searches & alerts
- Bulk operations (upload resumes)
- Analytics & reporting

### Long Term (6-12 months)
- Real-time collaboration on searches
- Custom model fine-tuning
- Integration with ATS systems
- Video interview analysis
- Skill gap analysis

---

## References

- **LangChain Docs**: https://python.langchain.com/
- **MongoDB Atlas Search**: https://www.mongodb.com/products/platform/atlas/search
- **OpenAI API**: https://platform.openai.com/docs/
- **Express.js**: https://expressjs.com/
- **Zod Validation**: https://zod.dev/

---

## Document Info

- **Author**: QA-Bot Development Team
- **Last Updated**: March 14, 2026
- **Status**: Production Ready (v2.0)
- **Next Review**: June 14, 2026
