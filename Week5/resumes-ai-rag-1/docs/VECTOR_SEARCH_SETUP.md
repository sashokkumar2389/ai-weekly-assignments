# MongoDB Atlas Vector Search Configuration

This guide explains how to set up MongoDB Atlas Vector Search for semantic similarity matching in the Resume Search application.

## Overview

Vector search enables semantic similarity matching by comparing embeddings, complementing full-text search (BM25). Using cosine similarity, it finds resumes semantically similar to your query, not just keyword matches.

## Prerequisites

- MongoDB Atlas cluster (M10 or higher - vector search requires paid tier)
- Collection: `db_resumes.resumes`
- Mistral embeddings configured (1024 dimensions)
- Access to MongoDB Atlas console

## Step 1: Create Vector Search Index in MongoDB Atlas

### Using MongoDB Atlas Console

1. **Navigate to Search**
   - Go to your MongoDB Atlas cluster
   - Select the **Search** tab (not Search Indexes, but the main Search section)
   - Click **Create Search Index**

2. **Choose Index Type**
   - Select **JSON Editor**
   - Choose collection: `db_resumes.resumes`

3. **Paste Configuration**
```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "type": "vector",
        "dimensions": 1024,
        "similarity": "cosine"
      }
    }
  }
}
```

4. **Set Index Name**
   - Index name: `vector_index_resume`
   - This matches `MONGODB_VECTOR_INDEX` in `.env`

5. **Create Index**
   - Click **Create Index**
   - Wait for status to change from "Building" to "Active" (may take 5-10 minutes)

## Index Configuration Explained

### Field: `embedding`
- **type**: `vector` - Specifies this is a vector field
- **dimensions**: `1024` - Must match Mistral Embed output (1024 dimensions)
- **similarity**: `cosine` - Uses cosine similarity for ranking (values 0-1, higher = more similar)

### Other Configuration Options

| Option | Purpose |
|--------|---------|
| `similarity: "cosine"` | Cosine similarity (recommended) |
| `similarity: "euclidean"` | Euclidean distance (alternative) |
| `similarity: "dotProduct"` | Dot product similarity (for normalized vectors) |

## Step 2: Verify Index Creation

Check that the index is built and ready:

```bash
curl http://localhost:3000/v1/health/diagnostics
```

Should show `vector_index_resume` in the indexes list.

## Step 3: Test Vector Search

### Basic Test
```bash
curl -X POST http://localhost:3000/v1/search/vector \
  -H "Content-Type: application/json" \
  -d '{
    "query": "senior backend engineer with microservices experience",
    "topK": 10,
    "filters": {}
  }'
```

### Response Format
```json
{
  "method": "vector",
  "query": "senior backend engineer with microservices experience",
  "resultCount": 8,
  "durationMs": 1234,
  "results": [
    {
      "_id": "507f...",
      "resumeId": "507f...",
      "text": "Engineer with 8 years building microservices...",
      "name": "John Doe",
      "role": "Principal Engineer",
      "company": "TechCorp",
      "similarityScore": 0.92
    }
  ]
}
```

## How It Works

### Vector Search Pipeline

```
1. User Query
   ↓
2. Generate Embedding (Mistral API)
   - Text → 1024-dimensional vector
   - Result cached for 1 hour
   ↓
3. MongoDB Vector Search
   - Use $search aggregation with cosmosSearch
   - Find top K most similar vectors (cosine similarity)
   - Return resumes sorted by similarity
   ↓
4. Apply Filters (optional)
   - Filter by location, experience, etc.
   ↓
5. Return Results
   - Ranked by semantic similarity score
```

### Similarity Score Interpretation
- **0.95-1.0**: Extremely similar (same domain/role/skills)
- **0.85-0.95**: Very similar (closely related)
- **0.75-0.85**: Similar (some alignment)
- **0.60-0.75**: Somewhat related
- **Below 0.60**: Weakly related

## Hybrid Search (BM25 + Vector)

For best results, use hybrid search combining both methods:

```bash
curl -X POST http://localhost:3000/v1/search/hybrid \
  -H "Content-Type: application/json" \
  -d '{
    "query": "python data scientist",
    "topK": 10,
    "filters": {}
  }'
```

**Why both?**
- **BM25**: Keyword matching (exact terms)
- **Vector**: Semantic similarity (meaning)
- **Hybrid**: Gets both exact and semantic matches
- **LLM Re-ranking**: Final intelligent ranking

## Configuration in Code

### Environment Variables (`.env`)
```dotenv
MONGODB_VECTOR_INDEX=vector_index_resume
MISTRAL_API_KEY=your_api_key
MISTRAL_API_URL=https://api.mistral.ai/v1/embeddings
MISTRAL_EMBED_MODEL=mistral-embed
EMBEDDING_CACHE_TTL_MS=3600000
```

### SearchService Integration
The `SearchService` automatically:
1. Generates query embedding via `EmbeddingService`
2. Calls `ResumeRepository.vectorSearch(embedding)`
3. Returns results sorted by similarity
4. Handles embedding cache and timeout

## Performance Considerations

### Latency Breakdown
- **Embedding generation**: 200-400ms (cached: <1ms)
- **Vector search (top 10)**: 100-300ms
- **Total**: 200-700ms (much faster than LLM re-ranking)

### Optimization Tips
1. **Use embedding cache** - Query embeddings cached for 1 hour
2. **Limit topK** - Searching for top 100 slower than top 10
3. **Add filters early** - Narrow result set before scoring
4. **Monitor index status** - Full index build improves performance

## Comparison with BM25

| Aspect | BM25 | Vector Search |
|--------|------|---------------|
| **Matching** | Keyword exact match | Semantic similarity |
| **Query Examples** | "java spring boot" | "experienced backend engineer" |
| **False Negatives** | High (misses synonyms) | Low (finds semantic matches) |
| **Latency** | 100-300ms | 100-300ms |
| **Index Size** | Small | Medium (1024 dims × 94 docs) |
| **Best For** | Known job titles, skills | Description-based matching |

## Troubleshooting

### Vector Index Not Found
**Error:** `search not found` or `no such index`

**Solution:**
1. Check index exists in MongoDB Atlas console
2. Verify index name matches `MONGODB_VECTOR_INDEX` in `.env`
3. Confirm index status is "Active"
4. Wait if index is still building

### Empty Results from Vector Search
**Cause:** Collection lacks `embedding` vectors

**Solution:**
1. Check documents have `embedding` field (can be empty array `[]`)
2. Use `/v1/embeddings` endpoint to generate embeddings
3. Verify at least some documents exist in collection

### Similarity Scores All One Value
**Cause:** All resumes have same or very similar embeddings

**Solution:**
1. Ensure documents are diverse (different roles, skills)
2. Check Mistral API is generating unique embeddings
3. Test with `/v1/embeddings` endpoint directly

### Slow Vector Search
**Cause:** Index still building or large topK value

**Solution:**
1. Check index build progress (may take 5-10 minutes)
2. Reduce `topK` parameter (try topK=5 instead of 100)
3. Check cluster performance metrics
4. Consider M20+ tier for faster searches

## Advanced: Custom Similarity Algorithm

To adjust similarity weighting, modify the aggregation pipeline in `ResumeRepository.ts`:

```typescript
// Current: Cosine similarity
// Modified: Could add field boosting, relevance scoring, etc.
const pipeline = [
  {
    $search: {
      cosmosSearch: {
        vector: embedding,
        k: topK
      },
      returnStoredSource: true
    }
  },
  // Add boosting for certain fields
  { $addFields: {
      boostedScore: {
        $add: [
          { $meta: 'searchScore' },
          { $cond: [{ $eq: ['$role', 'Senior Engineer'] }, 0.1, 0] }
        ]
      }
    }
  },
  { $project: { similarityScore: '$boostedScore', document: '$$ROOT' } }
];
```

## Integration Examples

### 1. Vector Search Only
```bash
curl -X POST http://localhost:3000/v1/search/vector \
  -H "Content-Type: application/json" \
  -d '{"query": "backend engineer", "topK": 5}'
```

### 2. Hybrid Search (BM25 + Vector)
```bash
curl -X POST http://localhost:3000/v1/search/hybrid \
  -H "Content-Type: application/json" \
  -d '{"query": "python machine learning", "topK": 10}'
```

### 3. Full Pipeline (with LLM Re-ranking)
```bash
curl -X POST http://localhost:3000/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "senior distributed systems engineer",
    "topK": 10,
    "options": {
      "summarize": true,
      "summaryStyle": "short"
    }
  }'
```

## References

- [MongoDB Atlas Vector Search](https://docs.mongodb.com/manual/reference/operator/aggregation/search/)
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
- [Mistral Embeddings API](https://docs.mistral.ai/capabilities/embeddings/)
- [Vector Database Best Practices](https://www.mongodb.com/docs/atlas/atlas-search/vector-search-stage/)
