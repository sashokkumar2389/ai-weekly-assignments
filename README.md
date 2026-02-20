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
