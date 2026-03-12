# Resume Search Algorithm - AI RAG Project

## Overview

The Resume Search Algorithm project implements a RAG (Retrieval-Augmented Generation) approach to efficiently search and rank resumes based on user queries. The application is built using Node.js and Express, leveraging MongoDB for data storage and Mistral for embeddings and LLM interactions.

## Features

- **Health Check Endpoints**: Monitor the status of the application and database connectivity.
- **Embedding Generation**: Generate embeddings for resumes and queries using the Mistral API.
- **BM25 Full-Text Search**: MongoDB Atlas Search with BM25 algorithm for relevance-ranked results
- **Vector Search**: Semantic search using embeddings for better matching
- **Hybrid Search**: Combine results from BM25 and vector searches for improved accuracy.
- **LLM Re-Ranking**: Intelligent re-ranking using Groq LLM with professional hiring criteria.
- **Candidate Summarization**: Generate fit summaries using LLM for informed hiring decisions.
- **End-to-End Pipeline**: Complete search pipeline with embedding, indexing, ranking, and optional summarization.

## Key Features

### 🔍 Multi-Method Search
- **BM25**: Full-text search across resume content, skills, roles, and experience
- **Vector**: Semantic similarity matching using 1024-dimensional embeddings
- **Hybrid**: Combined BM25 + vector results for exploration and comparison

### 🤖 LLM-Powered Intelligence
- **Re-Ranking**: Groq LLM (Meta-Llama 70B) ranks candidates on technical fit
- **Scoring Framework**: 0-100 scale with professional tiers (EXCEPTIONAL → POOR)
- **Objective Evaluation**: Evidence-based rationales with gap analysis
- **Summarization**: Auto-generated fit summaries with configurable style and length

### 🚀 Production Ready
- **Fallback Strategy**: Graceful degradation if services unavailable
- **Error Handling**: Comprehensive error handling with fallback methods
- **Caching**: 1-hour embedding cache to reduce API calls
- **Timeouts**: 30-second timeouts on all external API calls
- **Logging**: Detailed metrics including timing and result counts

## Quick Start

### 1. Vector Search
```bash
curl -X POST http://localhost:3000/v1/search/vector \
  -H "Content-Type: application/json" \
  -d '{"query": "senior backend engineer", "topK": 10}'
```

### 2. Hybrid Search (BM25 + Vector)
```bash
curl -X POST http://localhost:3000/v1/search/hybrid \
  -H "Content-Type: application/json" \
  -d '{"query": "python data scientist", "topK": 10}'
```

### 3. End-to-End Pipeline (with LLM Re-Ranking)
```bash
curl -X POST http://localhost:3000/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "senior full-stack engineer",
    "topK": 10,
    "options": {"summarize": true, "summaryStyle": "short"}
  }'
```

**See [VECTOR_HYBRID_RERANK_GUIDE.md](./docs/VECTOR_HYBRID_RERANK_GUIDE.md) for detailed documentation.**

## Project Structure

```
resumes-ai-rag
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── config
│   │   ├── env.ts
│   │   └── constants.ts
│   ├── routes
│   │   ├── health.ts
│   │   ├── embeddings.ts
│   │   ├── search.ts
│   │   └── index.ts
│   ├── services
│   │   ├── EmbeddingService.ts
│   │   ├── LLMService.ts
│   │   ├── SearchService.ts
│   │   └── LoggingService.ts
│   ├── repositories
│   │   └── ResumeRepository.ts
│   ├── middleware
│   │   ├── requestIdMiddleware.ts
│   │   ├── loggingMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── payloadLimiter.ts
│   ├── types
│   │   ├── index.ts
│   │   ├── resume.ts
│   │   ├── search.ts
│   │   └── llm.ts
│   └── utils
│       ├── logger.ts
│       └── helpers.ts
├── prompts
│   ├── rerank.prompt.txt
│   ├── summarize.prompt.txt
│   └── metadata-extraction.prompt.txt
├── docs
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── API_ENDPOINTS.md
│   └── COPILOT_GUIDE.md
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Setup Instructions

1. **Clone the Repository**: 
   ```
   git clone <repository-url>
   cd resumes-ai-rag
   ```

2. **Install Dependencies**: 
   ```
   npm install
   ```

3. **Configure Environment Variables**: 
   Copy `.env.example` to `.env` and fill in the required values.

4. **Run the Application**: 
   ```
   npm start
   ```

5. **Access the API**: 
   The application will be available at `http://localhost:3000/v1`.

## Usage Examples

- **Health Check**: 
   ```
   GET /v1/health
   ```

- **Generate Embedding**: 
   ```
   POST /v1/embeddings
   {
     "input": "Your resume text here"
   }
   ```

- **Search Resumes**: 
   ```
   POST /v1/search
   {
     "query": "senior software engineer",
     "filters": { "minYearsExperience": 5 }
   }
   ```

## Using Copilot Side Chat

To enhance your coding experience, you can use Copilot side chat for:

- **Generating Code**: Ask Copilot to generate specific functions or classes based on your requirements.
- **Editing Code**: Request modifications to existing code snippets or files.
- **Debugging**: Describe issues you're facing, and Copilot can suggest fixes or improvements.

### Example Prompts for Copilot

- "Generate a function to handle resume uploads."
- "Edit the LLMService to include error handling."
- "Debug the SearchService for performance issues."

## Contribution

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.