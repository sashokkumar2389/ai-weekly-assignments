# Week 5: Resume RAG Agent - Complete Summary

## 📋 Overview

Week 5 introduces the **Resume RAG Agent** - an enterprise-grade resume search system leveraging Retrieval-Augmented Generation (RAG) with intelligent hybrid search capabilities.

## 🎯 Learning Objectives

- Implement vector embeddings for semantic search
- Build BM25 full-text search indexing
- Create hybrid search combining multiple strategies
- Integrate LLM-powered result re-ranking
- Design scalable RAG-based applications
- Build full-stack applications with React + Node.js

## 🏗️ Architecture Components

### Backend Stack
- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Atlas Vector Search
- **Embeddings:** Mistral AI (1024 dimensions)
- **LLM:** Groq LLaMA for re-ranking & summarization

### Frontend Stack
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS

## 🔍 Search Capabilities

1. **BM25 Full-Text Search**
   - Indexes: skills, job titles, experience, education
   - Keyword-based candidate matching
   - High precision for known terms

2. **Vector Semantic Search**
   - Uses Mistral embeddings (1024 dims)
   - MongoDB Atlas ANN indexing
   - Captures semantic similarity

3. **Hybrid Search**
   - Combines BM25 + Vector results
   - Deduplicates and merges rankings
   - Best of both worlds approach

4. **LLM Re-ranking**
   - Groq LLaMA intelligent ranking
   - Context-aware candidate scoring
   - Configurable top-K re-ranking

## 📦 Project Structure

```
resumes-ai-rag-1/
├── src/
│   ├── server.ts                 # Express server setup
│   ├── app.ts                    # Application initialization
│   ├── config/
│   │   ├── env.ts               # Environment configuration
│   │   └── constants.ts         # App constants
│   ├── services/
│   │   ├── SearchService.ts     # Search orchestration
│   │   ├── EmbeddingService.ts  # Mistral embeddings
│   │   ├── LLMService.ts        # Groq LLM integration
│   │   └── LoggingService.ts    # Request logging
│   ├── routes/
│   │   ├── search.ts            # Search endpoints
│   │   ├── embeddings.ts        # Embedding endpoints
│   │   ├── health.ts            # Health check
│   │   └── index.ts             # Route aggregation
│   ├── repositories/
│   │   └── ResumeRepository.ts  # MongoDB operations
│   ├── middleware/
│   │   ├── errorHandler.ts      # Error handling
│   │   ├── validators.ts        # Request validation
│   │   └── loggingMiddleware.ts # Request logging
│   ├── types/
│   │   ├── resume.ts            # Resume types
│   │   ├── search.ts            # Search types
│   │   └── llm.ts               # LLM types
│   └── utils/
│       ├── helpers.ts           # Utility functions
│       ├── logger.ts            # Logging utilities
│       └── filterConverter.ts   # Filter parsing
├── frontend/                     # React UI
├── prompts/                      # LLM prompt templates
├── docs/                         # Comprehensive documentation
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

## 🚀 Quick Start

### Prerequisites
```bash
Node.js v14+
npm
MongoDB (local or Atlas)
Mistral API key
Groq API key
```

### Setup Steps

1. **Navigate to project**
```bash
cd Week5/resumes-ai-rag-1
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start development server**
```bash
npm run dev
# Server runs on http://localhost:3000
```

## 📡 API Endpoints

### Health & Status
```
GET  /v1/health              # App health check
GET  /v1/health/db           # Database connectivity
```

### Search Operations
```
POST /v1/search/bm25         # BM25 full-text search
POST /v1/search/vector       # Vector semantic search
POST /v1/search/hybrid       # Hybrid search
POST /v1/search/rerank       # LLM re-ranking
POST /v1/search/pipeline     # Complete RAG pipeline
```

### Embeddings
```
POST /v1/embeddings          # Generate embeddings
```

## 🔄 RAG Pipeline Flow

```
Query Input
    ↓
Query Preprocessing (normalization, expansion)
    ↓
┌─→ Vector Search (semantic matching)
│   
└─→ BM25 Search (keyword matching)
    ↓
Hybrid Results Merge (combine & deduplicate)
    ↓
LLM Re-ranking (intelligent scoring)
    ↓
Summarization (generate summaries)
    ↓
Response Output
```

## 📊 MongoDB Schema Example

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "location": "San Francisco, CA",
  "company": "Tech Corp",
  "role": "Senior Engineer",
  "education": "BS Computer Science",
  "total_experience": 8.5,
  "relevant_experience": 6.0,
  "skills": ["Python", "AWS", "Docker", "Kubernetes"],
  "text": "Full resume text content...",
  "embedding": [0.123, 0.456, ...] // 1024-dimensional vector
}
```

## 🧪 Testing

### Using cURL
```bash
# Health check
curl http://localhost:3000/v1/health

# BM25 search
curl -X POST http://localhost:3000/v1/search/bm25 \
  -H "Content-Type: application/json" \
  -d '{"query":"Python developer","limit":10}'

# Vector search
curl -X POST http://localhost:3000/v1/search/vector \
  -H "Content-Type: application/json" \
  -d '{"query":"full-stack engineer","limit":10}'

# Hybrid search
curl -X POST http://localhost:3000/v1/search/hybrid \
  -H "Content-Type: application/json" \
  -d '{"query":"React Node.js developer","limit":10,"rerank":true}'
```

### Using Postman
1. Import provided Postman collection
2. Set environment variables
3. Test individual endpoints
4. Validate response formats

## 📚 Documentation Files

| Document | Purpose |
|----------|---------|
| SETUP.md | Installation & configuration |
| ARCHITECTURE.md | System design & decisions |
| API_ENDPOINTS.md | Complete endpoint documentation |
| VECTOR_SEARCH_SETUP.md | Vector index configuration |
| BM25_IMPLEMENTATION_SUMMARY.md | BM25 search details |
| HYBRID_SEARCH_GUIDE.md | Combining search approaches |
| LLM_RERANKING_GUIDE.md | Re-ranking implementation |
| SUMMARIZATION_GUIDE.md | Summary generation |
| END_TO_END_PIPELINE_GUIDE.md | Complete pipeline execution |

## ⚙️ Environment Configuration

```env
# API Keys
API_KEY=mistral_key_here
LLM_MODEL=groq_model_here
GROQ_API_KEY=groq_key_here

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Server
PORT=3000
LOG_LEVEL=info

# RAG Config
EMBEDDING_DIMENSIONS=1024
MAX_RESULTS=20
SUMMARIZATION_STYLE=short
SUMMARIZATION_MAX_TOKENS=300
```

## 🎓 Key Concepts Covered

1. **Vector Embeddings:** Converting text to semantic vectors
2. **Semantic Search:** Finding similar content by meaning
3. **Full-Text Search:** Keyword-based indexing and search
4. **Hybrid Search:** Combining multiple search strategies
5. **LLM Integration:** Using language models for ranking
6. **MongoDB Atlas:** Vector database setup and querying
7. **API Design:** RESTful endpoint design with versioning
8. **Error Handling:** Graceful degradation and fallbacks
9. **Logging:** Distributed tracing and monitoring
10. **Performance:** Query optimization and caching

## 🚢 Deployment

### Docker Deployment
```bash
docker build -t resume-rag .
docker run -p 3000:3000 resume-rag
```

### Cloud Platforms
- **AWS:** EC2, Lambda, RDS
- **GCP:** Cloud Run, Cloud SQL
- **Azure:** App Service, CosmosDB
- **Heroku:** Simple git deployment

## 📈 Performance Metrics

- **Search Latency:** 1-3 seconds (acceptable for quality)
- **Vector Index:** ANN with configurable accuracy
- **BM25 Scoring:** TF-IDF based ranking
- **Re-ranking:** Top-K LLM scoring
- **Throughput:** Suitable for low-moderate traffic

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Verify URI, check firewall, ensure DB running |
| Embedding API rate limit | Implement caching, check API quota |
| Slow vector search | Verify index creation, optimize batch size |
| LLM timeout | Increase timeout, reduce re-rank top-K |
| High memory usage | Enable query result pagination |

## 🎯 Next Steps

1. Load resume dataset into MongoDB
2. Create vector and BM25 indexes
3. Test all API endpoints
4. Optimize search parameters
5. Integrate React frontend
6. Deploy to production
7. Monitor performance and logs
8. Iterate based on user feedback

## 📝 Additional Resources

- [Mistral AI Documentation](https://docs.mistral.ai)
- [Groq API Documentation](https://console.groq.com)
- [MongoDB Atlas Vector Search](https://www.mongodb.com/docs/atlas/atlas-search/vector-search/)
- [Express.js Guide](https://expressjs.com/)
- [React + Vite](https://vitejs.dev/guide/)

## ✅ Completion Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas set up with collections
- [ ] Vector index created
- [ ] BM25 index created
- [ ] Backend server running
- [ ] API endpoints tested
- [ ] Frontend installed and running
- [ ] Sample queries working
- [ ] Logging configured
- [ ] Performance optimized
- [ ] Documentation reviewed
- [ ] Deployment prepared

---

**Last Updated:** Week 5 RAG Agent
**Status:** Complete Implementation Guide
