# Week 5: System Architecture & Flow Diagrams

## 🏗️ High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │   React UI       │         │   Postman/cURL   │              │
│  │  (Frontend)      │         │   (Testing)      │              │
│  └─────────┬────────┘         └────────┬─────────┘              │
└────────────┼──────────────────────────┼─────────────────────────┘
             │                          │
             │   HTTP/REST API          │
             ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (Node.js)                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ API Routes & Middleware                                 │   │
│  │  • /v1/health (Health Check)                           │   │
│  │  • /v1/search/bm25 (Full-Text Search)                  │   │
│  │  • /v1/search/vector (Semantic Search)                 │   │
│  │  • /v1/search/hybrid (Combined Search)                 │   │
│  │  • /v1/search/rerank (LLM Re-ranking)                  │   │
│  │  • /v1/embeddings (Embedding Generation)               │   │
│  └────────────┬──────────────────────────────────────────┘   │
│               │                                                 │
│  ┌────────────▼──────────────────────────────────────────┐   │
│  │ Service Layer                                         │   │
│  │  • SearchService (Orchestration)                      │   │
│  │  • EmbeddingService (Mistral Integration)             │   │
│  │  • LLMService (Groq Integration)                      │   │
│  │  • LoggingService (Request Tracing)                   │   │
│  └────────────┬──────────────────────────────────────────┘   │
│               │                                                 │
│  ┌────────────▼──────────────────────────────────────────┐   │
│  │ Repository Layer                                      │   │
│  │  • ResumeRepository (MongoDB CRUD)                    │   │
│  └────────────┬──────────────────────────────────────────┘   │
└────────────┼──────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL APIs                                 │
│  ┌──────────────────┐       ┌──────────────────┐                │
│  │ Mistral AI       │       │ Groq API         │                │
│  │ • Embeddings     │       │ • LLM Inference  │                │
│  │ • 1024 dims      │       │ • Re-ranking     │                │
│  │ • Semantic Vecs  │       │ • Summarization  │                │
│  └──────────────────┘       └──────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
             │
    ┌────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (MongoDB)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ resumes Collection                                       │  │
│  │  • BM25 Full-Text Index                                │  │
│  │  • Vector Index (ANN)                                  │  │
│  │  • Resume Documents with Embeddings                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 RAG Pipeline Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER QUERY INPUT                                              │
│    Example: "Senior QA Engineer with Selenium and Java"         │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. QUERY PREPROCESSING                                           │
│    • Normalize text (lowercase, remove special chars)           │
│    • Expand synonyms (QA → Quality Assurance, tester, etc)     │
│    • Extract keywords (Senior, QA, Selenium, Java)             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│ 3A. VECTOR SEARCH │  │ 3B. BM25 SEARCH │
│                  │  │                  │
│ • Query → Mistral │  │ • Tokenization  │
│   Embedding      │  │ • Full-text idx │
│ • MongoDB Atlas  │  │ • Scoring (TF) │
│   ANN Search     │  │ • Top-K results │
│ • Return top-K   │  │                 │
└────────┬─────────┘  └────────┬────────┘
         │                     │
         │ Vector Results      │ BM25 Results
         │ [candidate_1,       │ [candidate_3,
         │  candidate_2,       │  candidate_1,
         │  ...]               │  ...]
         │                     │
         └─────────────┬───────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. HYBRID RESULTS MERGE                                          │
│    • Combine Vector & BM25 results                              │
│    • Deduplicate candidates                                     │
│    • Merge scoring (weighted average)                           │
│    • Sort by combined score                                     │
│                                                                  │
│    Output: [candidate_1, candidate_2, candidate_3, ...]        │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. LLM RE-RANKING (Optional)                                     │
│    • Send top-K candidates to Groq LLaMA                        │
│    • Context: Query + candidate profiles                        │
│    • Score relevance: 0.0 - 1.0                                 │
│    • Re-order based on intelligent scoring                      │
│                                                                  │
│    Prompt: "Rank these candidates for this role..."             │
│    Response: Ranked list with scores                            │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. SUMMARIZATION (Optional)                                      │
│    • Generate concise candidate summaries                       │
│    • Extract key qualifications                                 │
│    • Highlight matching criteria                                │
│    • Format for UI display                                      │
│                                                                  │
│    Output: Summary text for each result                         │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. DEDUPLICATION & FINAL RANKING                                 │
│    • Remove duplicate candidates                                │
│    • Apply final scores                                         │
│    • Format response JSON                                       │
│                                                                  │
│    Output: Final ranked candidate list                          │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. RESPONSE TO CLIENT                                            │
│                                                                  │
│ {                                                               │
│   "status": "success",                                          │
│   "data": [                                                     │
│     {                                                           │
│       "name": "John Doe",                                       │
│       "role": "QA Engineer",                                    │
│       "score": 0.95,                                            │
│       "summary": "Experienced QA..."                            │
│     },                                                          │
│     ...                                                         │
│   ],                                                            │
│   "metadata": {                                                 │
│     "totalResults": 42,                                         │
│     "executionTime": "1.23s",                                   │
│     "searchMethod": "hybrid"                                    │
│   }                                                             │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Vector Search Process

```
Query: "Python backend engineer"
    │
    ▼
┌────────────────────────────────────┐
│ Mistral Embedding Model            │
│ (mistral-embed)                    │
│                                    │
│ Input: "Python backend engineer"  │
│ Process: Tokenization → Embedding │
│ Output: Vector [0.45, 0.78, ...]  │
│         (1024 dimensions)          │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ MongoDB Atlas Vector Search        │
│                                    │
│ 1. Approximate Nearest Neighbors   │
│    (ANN) fast search               │
│ 2. Returns top-K similar vectors   │
│    from database                   │
│ 3. Optional: Exact re-scoring      │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ Ranked Results (by similarity)     │
│                                    │
│ 1. John (similarity: 0.92)         │
│ 2. Jane (similarity: 0.87)         │
│ 3. Bob (similarity: 0.81)          │
│ ...                                │
└────────────────────────────────────┘
```

---

## 🔤 BM25 Full-Text Search Process

```
Query: "Selenium QA Engineer"
    │
    ▼
┌────────────────────────────────────┐
│ Query Tokenization                 │
│ ["selenium", "qa", "engineer"]    │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ Full-Text Index Lookup             │
│                                    │
│ MongoDB BM25 Index                 │
│ (indexed fields: text, skills,     │
│  role, title, experience summary)  │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ BM25 Scoring (TF-IDF variant)      │
│                                    │
│ For each matching document:        │
│ score = BM25(term, doc, collection)│
│                                    │
│ Factors:                           │
│ • Term frequency in document       │
│ • Inverse document frequency       │
│ • Document length normalization    │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ Ranked Results (by BM25 score)    │
│                                    │
│ 1. Alice - score: 8.5              │
│    (has all 3 terms)               │
│ 2. Bob - score: 6.2                │
│    (has 2 terms)                   │
│ 3. Carol - score: 3.1              │
│    (has 1 term)                    │
│ ...                                │
└────────────────────────────────────┘
```

---

## 🧠 LLM Re-ranking Process

```
Top Candidates from Hybrid Search:
[candidate_1, candidate_2, candidate_3, ...]
    │
    ▼
┌────────────────────────────────────────────────────┐
│ Create LLM Prompt                                  │
│                                                    │
│ System: "You are a recruitment expert..."         │
│                                                    │
│ User:                                              │
│ "Query: Senior QA Engineer with Selenium"         │
│                                                    │
│ Candidates:                                        │
│ 1. Name: John, Skills: [Selenium, Java, ...]     │
│ 2. Name: Jane, Skills: [Python, API, ...]        │
│ 3. ...                                             │
│                                                    │
│ Task: Rank by relevance (0-1 score)"              │
└────────────┬─────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────┐
│ Groq LLaMA LLM Inference                          │
│                                                    │
│ • Send prompt to Groq API                        │
│ • LLaMA model generates ranking                   │
│ • Returns scored candidates                       │
│ • Execution time: ~500-1000ms                    │
└────────────┬─────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────┐
│ LLM Response (Parsed)                             │
│                                                    │
│ 1. John - relevance: 0.98                         │
│    Reasoning: Perfect match for role              │
│ 2. Jane - relevance: 0.75                         │
│    Reasoning: Strong skills, lacks Selenium      │
│ 3. Bob - relevance: 0.42                          │
│    Reasoning: Partial match                       │
│ ...                                                │
└────────────────────────────────────────────────────┘
```

---

## 📈 Request Latency Breakdown

```
User Query
    │
    ├─ Query Preprocessing: 10-20ms
    │
    ├─ Vector Embedding (Mistral): 200-400ms
    │
    ├─ Parallel Execution:
    │  ├─ Vector Search: 50-100ms
    │  └─ BM25 Search: 30-80ms
    │
    ├─ Results Merge: 10-20ms
    │
    ├─ LLM Re-ranking (if enabled): 500-1000ms
    │
    ├─ Summarization (if enabled): 200-500ms
    │
    ├─ Response Formatting: 5-10ms
    │
    └─ Total: 1000-2500ms (1-2.5 seconds)
```

---

## 🗄️ MongoDB Collection Structure

```
db.resumes {
  _id: ObjectId,
  
  # Profile Information
  name: String,
  email: String,
  phone: String,
  location: String,
  
  # Employment Information
  company: String,
  role: String,
  total_experience: Number,
  relevant_experience: Number,
  
  # Education & Skills
  education: String,
  skills: Array<String>,
  
  # Content for Search
  text: String (full resume text),
  
  # AI Features
  embedding: Array<Float> (1024 dimensions),
  metadata: {
    extractedAt: Date,
    updated: Date,
    category: String
  },
  
  # Search Indexes
  BM25 Index: { text: "text", skills: "text", role: "text" }
  Vector Index: { embedding: "2dsphere" }
}
```

---

## 🔌 API Call Sequence Diagram

```
┌────────┐                    ┌──────────┐                ┌─────────┐
│ Client │                    │ Express  │                │MongoDB  │
└───┬────┘                    └────┬─────┘                └────┬────┘
    │                              │                          │
    │ 1. POST /search/hybrid       │                          │
    │────────────────────────────>│                          │
    │                              │                          │
    │                              │ 2. Call SearchService    │
    │                              │                          │
    │                              │ 3. Generate Embeddings   │
    │                              │──────┐ (Mistral API)     │
    │                              │<─────┘                   │
    │                              │                          │
    │                              │ 4. Query Vector Index    │
    │                              │──────────────────────────>│
    │                              │                          │
    │                              │    5. Results (top-K)    │
    │                              │<──────────────────────────│
    │                              │                          │
    │                              │ 6. Query BM25 Index      │
    │                              │──────────────────────────>│
    │                              │                          │
    │                              │    7. Results (top-K)    │
    │                              │<──────────────────────────│
    │                              │                          │
    │                              │ 8. Merge & Re-rank       │
    │                              │ 9. Call Groq LLM API     │
    │                              │──────┐ (if enabled)      │
    │                              │<─────┘                   │
    │                              │                          │
    │   10. Response (JSON)        │                          │
    │<────────────────────────────│                          │
    │                              │                          │
```

---

## 🎯 Data Flow Summary

```
                    Frontend/Client
                          │
                          ▼
                    Express API Layer
                  ┌─────────┬─────────┐
                  ▼         ▼         ▼
            Services    Middleware   Routes
              Layer        Layer     Layer
                  │         │         │
                  └─────────┼─────────┘
                            ▼
                  Repository/Data Layer
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
            MongoDB    Mistral API   Groq API
           (Resumes)  (Embeddings) (LLM Inference)
```

---

## 🚀 Deployment Architecture (Example)

```
┌─────────────────────────────────────────────────────┐
│           AWS/GCP/Azure Cloud Platform              │
│                                                     │
│  ┌──────────────────┐        ┌─────────────┐       │
│  │   Load Balancer  │        │   CDN       │       │
│  └─────────┬────────┘        └──────┬──────┘       │
│            │                        │               │
│  ┌─────────┴──────────────────────┬┘               │
│  │                                 │                │
│  ▼                                 ▼                │
│ ┌──────────────────┐    ┌──────────────────┐      │
│ │  Express API     │    │   React UI       │      │
│ │  Server (Node.js)│    │   (Static Build) │      │
│ │  • Scaling: 2-3  │    │   • CDN Hosted   │      │
│ │  • Replicas      │    │   • S3 Storage   │      │
│ └────────┬─────────┘    └──────────────────┘      │
│          │                                         │
│  ┌───────┴────────────────┐                       │
│  ▼                        ▼                       │
│ ┌──────────────────┐  ┌──────────────────┐       │
│ │  MongoDB Atlas   │  │ Cache (Redis)    │       │
│ │  • Replica Set   │  │ (Optional)       │       │
│ │  • Backups       │  │                  │       │
│ │  • Monitoring    │  │                  │       │
│ └──────────────────┘  └──────────────────┘       │
│                                                   │
│  External APIs (via internet):                    │
│  • Mistral (embeddings)                           │
│  • Groq (LLM inference)                           │
└─────────────────────────────────────────────────┘
```

---

**This architecture enables:**
- ✅ Scalable search operations
- ✅ Fast semantic matching
- ✅ Accurate full-text indexing
- ✅ Intelligent re-ranking
- ✅ High availability
- ✅ Easy monitoring and debugging
