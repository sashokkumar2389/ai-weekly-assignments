# API Endpoints Documentation

## Health Check Endpoints

### 1. Health Check
- **Endpoint:** `GET /v1/health`
- **Description:** Checks the application status, database connectivity, and configuration sanity.
- **Response:**
  - Status: 200 OK
  - Body:
    ```json
    {
      "status": "healthy",
      "version": "1.0.0",
      "uptime": "24h",
      "db": {
        "status": "connected",
        "latency": "20ms"
      }
    }
    ```

### 2. MongoDB Connectivity Check
- **Endpoint:** `GET /v1/health/db`
- **Description:** Pings MongoDB and returns latency and status.
- **Response:**
  - Status: 200 OK
  - Body:
    ```json
    {
      "status": "connected",
      "latency": "15ms"
    }
    ```

## Embedding Endpoints

### 3. Mistral Embedding API
- **Endpoint:** `POST /v1/embeddings`
- **Description:** Generates embeddings for the provided input text.
- **Request Body:**
  ```json
  {
    "model": "mistral-embed",
    "input": "search text or resume content"
  }
  ```
- **Response:**
  - Status: 200 OK
  - Body:
    ```json
    {
      "embedding": [0.1, 0.2, ...],
      "model": "mistral-embed"
    }
    ```

## Search Endpoints

### 4. BM25 Search Endpoint
- **Endpoint:** `POST /v1/search/bm25`
- **Description:** Performs a BM25 search across resumes.
- **Request Body:**
  ```json
  {
    "query": "senior node.js backend engineer",
    "topK": 20,
    "filters": { "minYearsExperience": 5 }
  }
  ```
- **Response:**
  - Status: 200 OK
  - Body:
    ```json
    {
      "results": [
        {
          "resumeId": "...",
          "score": 1.5,
          "snippet": "..."
        }
      ]
    }
    ```

### 5. Vector Search Endpoint
- **Endpoint:** `POST /v1/search/vector`
- **Description:** Performs a vector search using embeddings.
- **Request Body:** Same as BM25 search.
- **Response:** Similar structure as BM25 search.

### 6. Hybrid Search Endpoint
- **Endpoint:** `POST /v1/search/hybrid`
- **Description:** Executes both BM25 and vector searches in parallel.
- **Response:**
  - Status: 200 OK
  - Body:
    ```json
    {
      "bm25Results": [...],
      "vectorResults": [...]
    }
    ```

### 7. LLM Re-Ranking Endpoint
- **Endpoint:** `POST /v1/search/rerank`
- **Description:** Re-ranks candidates based on LLM scoring.
- **Request Body:**
  ```json
  {
    "query": "senior node.js backend engineer with MongoDB experience",
    "candidates": [{ "resumeId": "...", "snippet": "..." }],
    "topK": 30
  }
  ```
- **Response:**
  - Status: 200 OK
  - Body:
    ```json
    {
      "rankedCandidates": [...]
    }
    ```

### 8. Summarization Endpoint
- **Endpoint:** `POST /v1/search/summarize`
- **Description:** Summarizes the fit of a candidate for a given role.
- **Request Body:**
  ```json
  {
    "query": "role description or JD",
    "candidate": { "resumeId": "...", "snippet": "..." },
    "style": "short|detailed",
    "maxTokens": 300
  }
  ```
- **Response:**
  - Status: 200 OK
  - Body:
    ```json
    {
      "summary": "..."
    }
    ```

### 9. End-to-End Resume Search Pipeline
- **Endpoint:** `POST /v1/search`
- **Description:** Orchestrates the full search pipeline.
- **Request Body:**
  ```json
  {
    "query": "senior node.js backend engineer",
    "filters": { "minYearsExperience": 5 },
    "options": { "summarize": true }
  }
  ```
- **Response:**
  - Status: 200 OK
  - Body:
    ```json
    {
      "finalResults": [...],
      "summaries": [...]
    }
    ```