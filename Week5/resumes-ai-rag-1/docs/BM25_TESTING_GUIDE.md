# BM25 Search Testing Guide

This guide explains how to test the `/v1/search/bm25` endpoint after setting up MongoDB Atlas Search.

## Prerequisites

1. **MongoDB Atlas Search Index Created**: Follow [ATLAS_SEARCH_SETUP.md](./ATLAS_SEARCH_SETUP.md) to create the BM25 search index
2. **Server Running**: `npm run dev` (server should be listening on port 3000)
3. **Sample Data**: Make sure your `resumes` collection has at least some documents with resume data

## Endpoint Details

**URL**: `POST /v1/search/bm25`

**Request Body**:
```json
{
  "query": "search terms here",
  "topK": 20,
  "filters": {}
}
```

**Response**:
```json
{
  "method": "bm25",
  "query": "search terms here",
  "resultCount": 5,
  "results": [
    {
      "_id": "...",
      "text": "...",
      "skills": "...",
      "role": "...",
      ...
    }
  ]
}
```

## Testing Steps

### Step 1: Check Server Health

```bash
curl http://localhost:3000/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Step 2: Inspect Collection State

```bash
curl http://localhost:3000/v1/health/diagnostics
```

Expected response shows:
- `documentCount`: Number of resumes in collection
- `indexes`: Should list `bm25_search_index` if Atlas Search is configured
- `sampleDocument`: Structure of a resume document

### Step 3: Test BM25 Search

```bash
curl -X POST http://localhost:3000/v1/search/bm25 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "java spring boot",
    "topK": 10,
    "filters": {}
  }'
```

Example response (with mock data):
```json
{
  "method": "bm25",
  "query": "java spring boot",
  "resultCount": 3,
  "results": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "text": "Senior Backend Engineer with 5+ years building Spring Boot REST APIs in Java...",
      "skills": "Java, Spring Boot, Microservices, REST APIs, SQL",
      "role": "Senior Backend Engineer",
      "company": "TechCorp Inc",
      "email": "engineer@example.com",
      "experienceSummary": "Expert in cloud-native Java development"
    }
  ]
}
```

## Search Examples

### 1. Search for Specific Technology Stack

```bash
curl -X POST http://localhost:3000/v1/search/bm25 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "python django postgresql",
    "topK": 20,
    "filters": {}
  }'
```

### 2. Search with Location Filter

```bash
curl -X POST http://localhost:3000/v1/search/bm25 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "full stack javascript react node",
    "topK": 15,
    "filters": {
      "location": "San Francisco, CA"
    }
  }'
```

### 3. Search for Job Role

```bash
curl -X POST http://localhost:3000/v1/search/bm25 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "senior architect cloud",
    "topK": 10,
    "filters": {}
  }'
```

### 4. Complex Query with Multiple Keywords

```bash
curl -X POST http://localhost:3000/v1/search/bm25 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "kubernetes docker microservices distributed systems",
    "topK": 25,
    "filters": {}
  }'
```

## Debugging with Debug Endpoint

If BM25 search isn't returning results as expected, use the debug endpoint:

```bash
curl -X POST http://localhost:3000/v1/search/debug \
  -H "Content-Type: application/json" \
  -d '{
    "query": "java spring",
    "topK": 10
  }'
```

Response format:
```json
{
  "query": "java spring",
  "topK": 10,
  "methods": {
    "bm25": {
      "status": "success",
      "resultCount": 5
    },
    "simple": {
      "status": "success",
      "resultCount": 8
    },
    "vector": {
      "status": "failed",
      "error": "Vector index not configured"
    }
  }
}
```

## Fallback Behavior

The BM25 endpoint has automatic fallback:

1. **Primary**: Uses MongoDB Atlas Search BM25 algorithm (if index exists)
2. **Fallback 1**: Uses simple regex-based search (always available)
3. **Error**: Returns error message with suggestion

## Common Issues and Solutions

### Issue 1: "search not found"
**Cause**: MongoDB Atlas Search index hasn't been created yet
**Solution**: Follow Step 1-2 in [ATLAS_SEARCH_SETUP.md](./ATLAS_SEARCH_SETUP.md) to create the index

### Issue 2: Empty results
**Possible Causes**:
- Collection is empty (no resume documents)
- No documents match the search terms
- Index hasn't finished building

**Solution**:
1. Run `/v1/health/diagnostics` to check collection size
2. Use `/debug` endpoint to test all search methods
3. Insert sample resume data into the collection

### Issue 3: Slow searches
**Cause**: Atlas Search index is still building or not optimized

**Solution**:
1. Wait for index to fully build (check MongoDB Atlas console)
2. Check that the index uses proper analyzer
3. Try shorter search queries first

### Issue 4: Wrong MongoDB URI
**Cause**: MongoDB connection string is incorrect

**Solution**:
1. Verify `MONGODB_URI` in `.env`
2. Test connection: `curl http://localhost:3000/v1/health/db`
3. Check credentials and network access

## Performance Tips

1. **Use specific queries**: "java spring boot" performs better than just "java"
2. **Limit topK**: Start with topK=10, increase only if needed
3. **Add filters**: Filtering narrows search space for faster results
4. **Monitor logs**: Check server logs for search timing information

## Next Steps

After BM25 is working:
1. Test vector search endpoint (requires embeddings configured)
2. Try hybrid search combining BM25 + vector results
3. Implement re-ranking with LLM
4. Test end-to-end search pipeline
