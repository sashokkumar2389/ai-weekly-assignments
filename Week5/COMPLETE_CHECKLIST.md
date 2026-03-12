# Week 5: Resume RAG Agent - Complete Checklist

## ✅ Pre-Setup Requirements

- [ ] Node.js v14+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] MongoDB account (local or Atlas)
- [ ] Mistral AI API account with API key
- [ ] Groq API account with API key
- [ ] Git installed for version control
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command line access

---

## 🔧 Environment Setup

### Phase 1: Initial Configuration

- [ ] Navigate to `Week5/resumes-ai-rag-1/` directory
- [ ] Run `npm install` successfully
- [ ] Create `.env` file from `.env.example`
- [ ] Add Mistral API key to `.env`
- [ ] Add Groq API key to `.env`
- [ ] Verify no syntax errors in `.env`

### Phase 2: Database Setup

- [ ] MongoDB Atlas account created (or local MongoDB running)
- [ ] Database connection string obtained
- [ ] Database name decided (e.g., `resume_rag`)
- [ ] Add MONGODB_URI to `.env`
- [ ] Test connection: `npm run dev` starts without DB errors
- [ ] Create `resumes` collection in MongoDB

### Phase 3: API Configuration

- [ ] Mistral API endpoint configured
- [ ] Groq API endpoint configured
- [ ] Verify API keys are valid (not expired)
- [ ] Check API rate limits and quotas
- [ ] Test API connectivity in logs

---

## 🚀 Development Environment

### Backend Setup

- [ ] `npm run dev` starts server successfully
- [ ] Server running on port 3000 (or configured port)
- [ ] No TypeScript compilation errors
- [ ] All middleware loaded without errors
- [ ] Database connection established

### Testing Connectivity

- [ ] Health check endpoint responds: `curl http://localhost:3000/v1/health`
- [ ] Response includes status "ok" or "success"
- [ ] Database health check passes: `curl http://localhost:3000/v1/health/db`
- [ ] No 500 errors in console

---

## 🔍 Vector Search Setup

### MongoDB Vector Index

- [ ] Navigate to MongoDB Atlas dashboard
- [ ] Go to Cluster > Collections > resumes
- [ ] Create vector search index named `vector_index`
- [ ] Index field: `embedding` (Array of Numbers)
- [ ] Dimensions: 1024
- [ ] Similarity metric: cosine
- [ ] Wait for index creation (~5 minutes)

### Testing Vector Search

- [ ] Test embedding generation: `npm run test:embeddings` (if available)
- [ ] Upload sample resumes with embeddings
- [ ] Test vector search endpoint:
  ```bash
  curl -X POST http://localhost:3000/v1/search/vector \
    -H "Content-Type: application/json" \
    -d '{"query":"Python developer","limit":5}'
  ```
- [ ] Response includes candidates with similarity scores
- [ ] Scores are between 0 and 1

---

## 🔤 BM25 Full-Text Search Setup

### MongoDB Text Index

- [ ] In MongoDB Atlas, create text index on `resumes` collection
- [ ] Fields indexed: text, skills, role, education, company
- [ ] Run in MongoDB shell:
  ```javascript
  db.resumes.createIndex({ 
    text: "text", 
    skills: "text", 
    role: "text", 
    education: "text",
    company: "text"
  })
  ```
- [ ] Index creation verified in MongoDB UI

### Testing BM25 Search

- [ ] Test BM25 endpoint:
  ```bash
  curl -X POST http://localhost:3000/v1/search/bm25 \
    -H "Content-Type: application/json" \
    -d '{"query":"Selenium Java","limit":5}'
  ```
- [ ] Returns candidates matching keywords
- [ ] Results include relevance scores
- [ ] No database errors in logs

---

## 🎯 Hybrid Search Testing

### Combined Search

- [ ] Test hybrid endpoint:
  ```bash
  curl -X POST http://localhost:3000/v1/search/hybrid \
    -H "Content-Type: application/json" \
    -d '{"query":"React Node.js developer","limit":5,"rerank":false}'
  ```
- [ ] Returns results from both searches
- [ ] Results are deduplicated
- [ ] Scores are combined appropriately

### With Re-ranking

- [ ] Enable re-ranking in request:
  ```bash
  curl -X POST http://localhost:3000/v1/search/hybrid \
    -H "Content-Type: application/json" \
    -d '{"query":"Senior Engineer","limit":5,"rerank":true}'
  ```
- [ ] Groq API is called for re-ranking
- [ ] Results are re-ordered by LLM score
- [ ] Response time includes LLM latency (~1-2 seconds)

---

## 🧠 LLM Re-ranking Configuration

### Groq API Setup

- [ ] Groq API key verified and valid
- [ ] LLM model specified (e.g., meta-llama/llama-2-70b)
- [ ] Model availability confirmed
- [ ] API rate limits sufficient for testing

### Re-ranking Testing

- [ ] Create test request with `enableReranking: true`
- [ ] Monitor API response time
- [ ] Verify re-ranked results make sense
- [ ] Check Groq API logs for successful requests
- [ ] Compare re-ranked vs. non-re-ranked results

---

## 📝 Data Import & Management

### Resume Data Loading

- [ ] Resume data prepared (CSV, JSON, or JSONL format)
- [ ] Data includes: name, email, phone, location, company, role, education, experience, skills, full text
- [ ] Sample data set created (minimum 10-20 resumes)
- [ ] Data imported into MongoDB:
  ```bash
  mongoimport --uri "mongodb://..." --collection resumes --file data.json
  ```
- [ ] Verify data in MongoDB (count documents, sample records)

### Embedding Generation

- [ ] Test embedding endpoint with sample text
- [ ] Embeddings have 1024 dimensions
- [ ] All resumes have embeddings generated
- [ ] Vector index updated with embeddings

### Data Verification

- [ ] At least 10 resumes in database
- [ ] All documents have required fields
- [ ] Embeddings populated for all documents
- [ ] Indexes created and active

---

## 🧪 API Testing

### Endpoint Testing Checklist

- [ ] `GET /v1/health` - returns 200
- [ ] `GET /v1/health/db` - DB connectivity OK
- [ ] `POST /v1/search/bm25` - returns candidates
- [ ] `POST /v1/search/vector` - returns candidates
- [ ] `POST /v1/search/hybrid` - returns candidates
- [ ] `POST /v1/search/rerank` - returns re-ranked candidates
- [ ] `POST /v1/embeddings` - returns embeddings array

### Response Validation

- [ ] All responses have correct HTTP status codes
- [ ] JSON responses properly formatted
- [ ] Include required fields (status, data, metadata)
- [ ] Error responses include helpful messages
- [ ] Latency metrics included in responses

### Error Handling

- [ ] Invalid query parameters handled gracefully
- [ ] Missing required fields return 400 error
- [ ] Database errors return 500 with message
- [ ] API errors return appropriate status codes
- [ ] No unhandled exceptions in logs

---

## 🎨 Frontend Setup (Optional)

### React Application

- [ ] Navigate to `frontend/` directory
- [ ] Run `npm install`
- [ ] Copy `.env.development` to `.env`
- [ ] Update API endpoint (http://localhost:3000)
- [ ] Run `npm run dev`
- [ ] React app running on http://localhost:5173

### Frontend Testing

- [ ] Landing page loads without errors
- [ ] Search form is visible and functional
- [ ] Can enter search query
- [ ] Results display properly
- [ ] Loading indicators work during search
- [ ] Error messages display correctly

### Backend Integration

- [ ] Frontend successfully calls backend API
- [ ] API responses displayed in UI
- [ ] Candidate results show all fields
- [ ] Relevance scores visible
- [ ] No CORS errors in console

---

## 📊 Performance Testing

### Latency Measurement

- [ ] Vector search: < 500ms
- [ ] BM25 search: < 200ms
- [ ] Hybrid search: < 700ms
- [ ] Re-ranking: 1-2 seconds (acceptable)
- [ ] Total pipeline: 1.5-3 seconds

### Load Testing (Optional)

- [ ] Single request works
- [ ] Multiple concurrent requests handled
- [ ] Server doesn't crash under load
- [ ] Memory usage reasonable
- [ ] No memory leaks detected

### Database Performance

- [ ] Vector index queries fast
- [ ] BM25 index queries fast
- [ ] No slow queries in MongoDB logs
- [ ] Connection pool working properly

---

## 📝 Logging & Monitoring

### Logging Configuration

- [ ] LOG_LEVEL set appropriately (info for prod, debug for dev)
- [ ] Logs output to console
- [ ] Logs include timestamps
- [ ] Request IDs visible in logs
- [ ] Error stack traces included

### Request Tracing

- [ ] Each request has unique ID
- [ ] Request ID persisted through pipeline
- [ ] Timing metrics for each stage
- [ ] Database query logs visible (if enabled)
- [ ] API call logs recorded

---

## 🔐 Security & Configuration

### Environment Configuration

- [ ] All sensitive keys in `.env` file
- [ ] `.env` file excluded from git (.gitignore)
- [ ] No API keys committed to repository
- [ ] Port configuration customizable
- [ ] Proper CORS headers configured

### API Security

- [ ] Payload size limits enforced
- [ ] Request validation in place
- [ ] Input sanitization working
- [ ] SQL injection prevention (if applicable)
- [ ] No sensitive data in logs

---

## 📚 Documentation Review

- [ ] README.md reviewed and understood
- [ ] QUICK_START.md walkthrough completed
- [ ] ARCHITECTURE.md architectural overview studied
- [ ] API_ENDPOINTS.md endpoints understood
- [ ] SETUP.md installation steps followed
- [ ] Relevant guides read (Vector, BM25, Hybrid, etc.)

---

## 🚀 Production Readiness

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Code compiled successfully
- [ ] Environment variables for production configured
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Error tracking (Sentry, etc.) set up

### Deployment Options

- [ ] Containerization (Docker) ready
- [ ] Environment-specific configs created
- [ ] Deployment scripts prepared
- [ ] Rollback plan documented
- [ ] Performance benchmarks recorded

### Hosting Platform Selection

- [ ] Hosting platform chosen (AWS, GCP, Azure, Heroku, etc.)
- [ ] Account created and access granted
- [ ] CI/CD pipeline configured (optional)
- [ ] Database replication/backup set up
- [ ] Monitoring and alerts configured

---

## 🎓 Learning Verification

### Concepts Understood

- [ ] Vector embeddings and semantic search
- [ ] BM25 full-text search indexing
- [ ] Hybrid search combining multiple strategies
- [ ] LLM integration for re-ranking
- [ ] MongoDB Atlas vector search
- [ ] Express.js REST API design
- [ ] Node.js service architecture
- [ ] TypeScript type safety
- [ ] Request/response handling
- [ ] Error handling and logging

### Skills Demonstrated

- [ ] Set up full-stack Node.js application
- [ ] Integrated multiple external APIs
- [ ] Designed scalable database schema
- [ ] Implemented search algorithms
- [ ] Built REST API endpoints
- [ ] Tested application thoroughly
- [ ] Documented code and architecture
- [ ] Deployed to production (or ready to)

---

## 🎯 Final Verification

### Complete End-to-End Test

```bash
# 1. Start server
npm run dev

# 2. Test health
curl http://localhost:3000/v1/health

# 3. Test search
curl -X POST http://localhost:3000/v1/search/hybrid \
  -H "Content-Type: application/json" \
  -d '{"query":"test query","limit":5,"rerank":true}'

# 4. Verify response
# Should contain: status, data (candidates), metadata
```

### Completion Items

- [ ] All above checks completed ✓
- [ ] Application functioning correctly ✓
- [ ] Search results relevant ✓
- [ ] Performance acceptable ✓
- [ ] Documentation complete ✓
- [ ] Ready for deployment ✓

---

## 📋 Weekly Deliverables

### Code Deliverables

- [ ] Backend API (Express + TypeScript)
- [ ] Frontend UI (React + Vite)
- [ ] Database schema (MongoDB)
- [ ] Search implementations (Vector, BM25, Hybrid)
- [ ] LLM integrations (Mistral, Groq)
- [ ] Tests and validation

### Documentation Deliverables

- [ ] README with project overview
- [ ] SETUP instructions
- [ ] ARCHITECTURE documentation
- [ ] API endpoint documentation
- [ ] Implementation guides (Vector, BM25, Hybrid, etc.)
- [ ] Troubleshooting guide
- [ ] Deployment guide

### Demonstration Items

- [ ] Live API endpoints working
- [ ] Search results accurate and relevant
- [ ] Performance metrics acceptable
- [ ] Error handling functional
- [ ] Logging and monitoring active

---

## 🎉 Week 5 Completion Criteria

- [ ] All setup steps completed
- [ ] All API endpoints working
- [ ] Search functionality tested and verified
- [ ] Frontend integrated (optional but recommended)
- [ ] Documentation complete and comprehensive
- [ ] Performance acceptable for use case
- [ ] Ready for production deployment (or educational use)

---

**Congratulations on completing Week 5! 🎊**

Next steps:
1. Deploy to production environment
2. Load real resume dataset
3. Optimize based on actual usage patterns
4. Add additional features (filtering, saved searches, etc.)
5. Monitor and improve performance

---

*Checkmark ✓ each item as you complete it to track your progress!*
