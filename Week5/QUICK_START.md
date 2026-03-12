# Week 5: Quick Start Guide - Resume RAG Agent

## 🚀 5-Minute Setup

### 1. Navigate to Project
```bash
cd /Users/macbook/workspace/ai-weekly-assignments/Week5/resumes-ai-rag-1
```

### 2. Install & Configure
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your keys:
# - MISTRAL API_KEY
# - GROQ_API_KEY  
# - MONGODB_URI
nano .env
```

### 3. Start Server
```bash
npm run dev
```

✅ **Server running at:** http://localhost:3000

---

## 📡 Test Endpoints (Copy & Paste)

### Health Check
```bash
curl http://localhost:3000/v1/health
```

### BM25 Search
```bash
curl -X POST http://localhost:3000/v1/search/bm25 \
  -H "Content-Type: application/json" \
  -d '{"query":"Selenium Java QA Engineer","limit":5}'
```

### Vector Search
```bash
curl -X POST http://localhost:3000/v1/search/vector \
  -H "Content-Type: application/json" \
  -d '{"query":"automated testing framework","limit":5}'
```

### Hybrid Search (BM25 + Vector)
```bash
curl -X POST http://localhost:3000/v1/search/hybrid \
  -H "Content-Type: application/json" \
  -d '{"query":"Python backend developer","limit":5,"rerank":true}'
```

### Full RAG Pipeline
```bash
curl -X POST http://localhost:3000/v1/search/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "query":"Senior full-stack engineer",
    "limit":10,
    "enableReranking":true,
    "enableSummarization":true
  }'
```

---

## 🎯 Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm test` | Run tests |

---

## 📊 Expected Response Format

```json
{
  "status": "success",
  "data": [
    {
      "_id": "resume_id",
      "name": "John Doe",
      "role": "QA Engineer",
      "skills": ["Selenium", "Java", "TestNG"],
      "experience": 5.5,
      "relevanceScore": 0.92,
      "summary": "Experienced QA automation engineer..."
    }
  ],
  "metadata": {
    "totalResults": 1,
    "executionTime": "1.23s",
    "searchMethod": "hybrid"
  }
}
```

---

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Try different port
PORT=3001 npm run dev
```

### MongoDB Connection Error
```bash
# Verify connection string in .env
# Format: mongodb+srv://username:password@cluster.mongodb.net/dbname

# Test connection with mongosh
mongosh "your_mongodb_uri"
```

### API Keys Not Working
```bash
# Verify keys in .env file
# Check for leading/trailing spaces
# Confirm API quotas not exceeded
```

---

## 📁 Project Structure (Key Files)

```
resumes-ai-rag-1/
├── src/
│   ├── server.ts              ← Main entry point
│   ├── services/
│   │   ├── SearchService.ts   ← Search orchestration
│   │   ├── EmbeddingService.ts ← Mistral integration
│   │   └── LLMService.ts      ← Groq integration
│   └── routes/
│       ├── search.ts          ← Search endpoints
│       └── embeddings.ts      ← Embedding endpoints
├── frontend/                  ← React UI (optional)
├── docs/                      ← Full documentation
└── .env                       ← Your config (CREATE THIS)
```

---

## 🎓 Learning Path

1. **Start Here:** Review SETUP.md in docs/
2. **Understand Architecture:** Read ARCHITECTURE.md
3. **Explore Endpoints:** Test with cURL or Postman
4. **Deep Dive:** Read specific implementation guides
5. **Integrate Frontend:** Run React app
6. **Deploy:** Choose hosting platform

---

## 📚 Key Documentation Files

| File | Read When |
|------|-----------|
| SETUP.md | Setting up environment |
| ARCHITECTURE.md | Understanding design |
| API_ENDPOINTS.md | Integrating with frontend |
| VECTOR_SEARCH_SETUP.md | Configuring embeddings |
| HYBRID_SEARCH_GUIDE.md | Combining search methods |
| LLM_RERANKING_GUIDE.md | Tuning result ranking |

---

## 🎯 Common Tasks

### Load Resume Data
```bash
# Place resumes in JSONL format:
# {"name":"John","skills":["Python"],"text":"..."}

# Import via API or directly to MongoDB
mongoimport --uri "your_mongodb_uri" --collection resumes --file resumes.jsonl --jsonArray
```

### Create Indexes
```javascript
// Run in MongoDB shell
db.resumes.createIndex({ text: "text" })  // BM25
db.resumes.createIndex({ embedding: "2dsphere" })  // Vector
```

### Test with Postman
1. Import: `docs/Postman_Collection.json`
2. Set variables: API_KEY, GROQ_KEY, MONGODB_URI
3. Run collection tests

---

## ✅ Verification Checklist

- [ ] Node.js & npm installed (`node -v`, `npm -v`)
- [ ] `.env` file created with valid keys
- [ ] `npm install` completed
- [ ] `npm run dev` starts without errors
- [ ] `curl http://localhost:3000/v1/health` returns success
- [ ] MongoDB connection working
- [ ] Can search resumes successfully

---

## 🚀 Next Level

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

### Production Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting

# Or use Docker
docker build -t resume-rag .
docker run -p 3000:3000 -e MONGODB_URI="..." resume-rag
```

### Performance Optimization
- Enable query caching
- Tune batch sizes
- Optimize vector index parameters
- Implement pagination

---

## 📞 Support Resources

- **API Docs:** `docs/API_ENDPOINTS.md`
- **Error Handling:** `docs/SETUP.md` (Troubleshooting section)
- **Architecture Questions:** `docs/ARCHITECTURE.md`
- **Integration:** `docs/END_TO_END_PIPELINE_GUIDE.md`

---

## 💡 Pro Tips

1. **Use environment variables** for all sensitive config
2. **Enable request logging** for debugging (LOG_LEVEL=debug)
3. **Paginate large result sets** to reduce memory usage
4. **Cache embedding results** for repeated queries
5. **Monitor API rate limits** on Mistral and Groq
6. **Test with small dataset** before production scale
7. **Review logs regularly** for performance insights

---

**Ready to go!** Start with `npm run dev` 🎉
