# AI Assignment: Generative AI & RAG Pipeline

## Overview

This assignment series demonstrates **Generative AI integration** through three progressive modules:

1. **Week 1:** LangFlow API fundamentals
2. **Week 2:** Data ingestion and vector embeddings pipeline
3. **Week 3:** Retrieval-Augmented Generation (RAG) implementation

---

## Week 1: LangFlow API Project

### Project Overview

This assignment demonstrates how to use **LangFlow APIs** to process input text and generate responses using Groq or LLaMA models. The project includes basic examples for:

- Sending input text to LangFlow
- Tweaking model parameters
- Retrieving and processing outputs

### Installation

```bash
git clone https://github.com/yourusername/langflow-assignment.git
cd langflow-assignment
```

---

## Week 2: Ingestion Pipeline

Build the data ingestion and embedding pipeline for test cases and user stories.

### Setup Steps

1. **Initialize the RAG Application**
   - Setup and open the RAG pipeline application (React + Node.js)

2. **Configure Environment**
   - Set up environment variables:
     - Mistral API key
     - Groq API key
     - MongoDB connection URL

3. **Create Vector Database Structure**
   - Create a MongoDB collection named `testcases`
   - Create the vector index for semantic search

4. **Data Conversion**
   - Upload test case structured data (CSV format)
   - Convert to JSONL file format

5. **Generate & Store Embeddings**
   - Generate vector embeddings using Mistral AI
   - Load embeddings in batch into MongoDB
   - Use the converted JSONL file as input

6. **Verification**
   - Verify vector database and embeddings in MongoDB via UI

---

## Week 3: Retrieval Pipeline

Implement complete RAG pipeline with multiple search and ranking strategies.

### Setup Steps

1. **Add Search Indexes**
   - Add BM25 full-text search index to `testcases` collection

2. **Create User Stories Collection**
   - Follow the ingestion pipeline to create a `userstories` collection in vector database

3. **Run RAG Pipeline Operations**

   Execute the following pipeline steps in sequence:

   - **Query Preprocessing** - Normalize and expand search queries
   - **Vector Search** - Semantic similarity retrieval using embeddings
   - **BM25 Search** - Keyword-based full-text search
   - **Hybrid Search** - Combine vector and BM25 results
   - **Reranking** - AI-powered result ranking refinement
   - **Summarization** - Generate concise summaries of results
   - **Deduplication** - Identify and remove duplicate content
   - **Complete RAG Flow** - End-to-end pipeline orchestration


   ## Week 4: AI Nutri Agent System 

AI Nutri Agent — Automated Food Nutrition Analysis and Tracking System - Web Application design using USDA/Canadian food database implemented as VectorDB. generated using Vibe coding (OpenAI ChatGpt- 5.2)

### Design Guidelines Followed

- Simple architecture
- Small components
- Easy testing
- No microservices
- API-first approach
- DB second
- Web third

---

## Week 5: Resume RAG Agent

### Project Overview

**Resume RAG Agent** is an intelligent **resume search system** using hybrid search with AI-powered ranking. It combines:

- **Vector Search** - Semantic matching using Mistral AI embeddings (1024 dimensions)
- **BM25 Search** - Keyword-based full-text search on skills and experience
- **Hybrid Approach** - Merges both searches with intelligent result ranking
- **LLM Re-ranking** - Groq API provides AI-powered candidate ranking

**Technology Stack:**
- Backend: Node.js + Express + TypeScript
- Database: MongoDB Atlas with vector indexing
- APIs: Mistral (embeddings), Groq (LLM ranking)
- Frontend: React + Vite (optional)

**Key Features:**
- Fast semantic and keyword search
- LLM-powered intelligent re-ranking
- Request tracing and performance logging
- REST API with versioning (/v1/)
- Type-safe TypeScript codebase

### Quick Start

See `Week5/QUICK_START.md` for 5-minute setup instructions.

For complete documentation, refer to:
- `Week5/WEEK5_SUMMARY.md` - Full project overview
- `Week5/ARCHITECTURE_DIAGRAMS.md` - System architecture and diagrams
- `Week5/COMPLETE_CHECKLIST.md` - Setup verification checklist
- `resumes-ai-rag-1/docs/` - Additional technical guides

---

````
