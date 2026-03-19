# QA Resume Bot - Week 6 Assignment

## 📋 Project Overview

The **QA Resume Bot** is an advanced AI-powered document question-answering system built with modern web technologies and LangChain. It enables users to upload resumes and documents, then query them using natural language. The system leverages hybrid search (combining vector and keyword-based search), LLM re-ranking, and conversational AI to provide accurate and contextual answers.

### Key Features
- 🤖 **AI-Powered Q&A** - Ask questions about uploaded documents using natural language
- 📄 **Multi-Format Support** - Process PDFs, CSV files, and text documents
- 🔍 **Hybrid Search** - Combines vector similarity and BM25 keyword search for optimal retrieval
- 🎯 **LLM Re-ranking** - Uses language models to re-rank search results for relevance
- 💬 **Conversational AI** - Maintains conversation context for natural multi-turn interactions
- 🗄️ **MongoDB Integration** - Persistent storage of embeddings and documents
- 🎨 **Modern UI** - React + TypeScript frontend with Tailwind CSS
- ⚡ **Real-time Processing** - Server-side document processing with streaming responses

---

## 🏗️ System Architecture

### Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- LangChain.js - Orchestrating AI workflows
- Mistral AI - Embeddings generation
- Multiple LLM providers: Groq, OpenAI, Testleaf, Anthropic
- MongoDB - Vector store and document storage

**Frontend:**
- React 18 + TypeScript
- Vite - Fast build tool
- Tailwind CSS - Styling
- React Query - Data fetching
- Zustand - State management

**Infrastructure:**
- Vector embeddings with MongoDB Atlas
- BM25 full-text search indexing
- Hybrid retrieval pipeline

---

## 📦 Project Structure

```
qa-bot-ts/
├── src/                          # Backend source code
│   ├── server.ts                # Express server entry point
│   ├── config/                  # Configuration management
│   ├── lib/                     # Core libraries
│   │   ├── models/              # LLM model integrations
│   │   ├── embeddings/          # Embedding generation
│   │   ├── memory/              # Conversation memory
│   │   └── vectorstore/         # Vector store management
│   ├── pipelines/               # Data processing pipelines
│   │   ├── ingestion/           # Document ingestion
│   │   └── retrieval/           # Retrieval & re-ranking
│   ├── scripts/                 # Utility scripts
│   └── utils/                   # Helper functions
│
├── Frontend/                    # React frontend application
│   ├── src/
│   │   ├── api/                # API client & hooks
│   │   ├── components/         # React components
│   │   ├── stores/             # Zustand stores
│   │   ├── lib/                # Utilities & config
│   │   └── styles/             # Global styles
│   ├── index.html
│   └── vite.config.ts
│
├── documents/                   # Sample documents for testing
├── .env.example                # Environment variables template
├── package.json                # Dependencies
└── SYSTEM_DESIGN.md           # Detailed system design
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- API keys for LLM providers (at least one of: Groq, Mistral, OpenAI, Anthropic, Testleaf)

### Installation

#### 1. Clone and Setup
```bash
# Navigate to the project directory
cd qa-bot-ts

# Install root dependencies
npm install

# Install frontend dependencies
cd Frontend
npm install
cd ..
```

#### 2. Configure Environment Variables

**Backend (.env):**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```properties
# Choose your LLM provider
MODEL_PROVIDER=groq  # Options: groq, openai, anthropic, testleaf

# Provider-specific keys
GROQ_API_KEY=your_groq_key_here
MISTRAL_API_KEY=your_mistral_key_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
TESTLEAF_API_KEY=your_testleaf_key_here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName
MONGODB_DB=db_resumes

# Server Configuration
PORT=3000
SERVER_URL=http://localhost:8787
```

**Frontend (.env):**
```bash
cd Frontend
cp .env.example .env
```

Edit `Frontend/.env`:
```properties
VITE_API_BASE_URL=http://localhost:3000
```

#### 3. Setup MongoDB

**Option A: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/`
4. Add connection string to `.env`

**Option B: Local MongoDB**
```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/db_resumes
```

#### 4. Create Vector Index (First Time Only)

```bash
# From project root
npm run create-vector-index
```

This script will:
- Connect to MongoDB
- Create vector search index for embeddings
- Create BM25 text search index for keyword search

### 📥 Running the Application

#### Terminal 1: Start Backend Server
```bash
npm run dev
# Backend runs on http://localhost:3000
```

#### Terminal 2: Start Frontend Development Server
```bash
cd Frontend
npm run dev
# Frontend runs on http://localhost:5173
```

Open your browser and navigate to `http://localhost:5173`

---

## 💡 How to Use

### Step 1: Upload Documents
1. Click the **"Upload Documents"** button
2. Select PDF, CSV, or text files from your computer
3. Wait for processing and indexing to complete

Supported file formats:
- **PDF** (.pdf) - Scanned or text-based PDFs
- **CSV** (.csv) - Structured resume data
- **Text** (.txt) - Plain text documents

### Step 2: Ask Questions
1. Type your question in the chat input box
2. The system will:
   - Convert your question to embeddings
   - Search using hybrid approach (vector + keyword)
   - Re-rank results using the LLM
   - Generate contextual response
3. View the answer with document references

### Example Questions
- "What are the candidate's main skills?"
- "List all work experiences from 2020 onwards"
- "What programming languages does the candidate know?"
- "What is the candidate's contact information?"
- "Summarize the candidate's educational background"

### Step 3: Conversation Management
- **View History** - Access previous conversations from the sidebar
- **Delete Chat** - Remove specific conversations
- **Search Mode** - Switch between candidates or documents
- **Settings** - Configure AI temperature and other parameters

---

## 🔄 API Endpoints

### Document Upload
```
POST /api/documents/upload
Content-Type: multipart/form-data
Body: { file: File }
Response: { success: bool, message: string, documentId: string }
```

### Chat (Question Answering)
```
POST /api/chat
Content-Type: application/json
Body: {
  message: string,
  conversationId?: string,
  documentId?: string
}
Response: {
  id: string,
  message: string,
  response: string,
  sources: Array<{ documentName, content, score }>
}
```

### Chat History
```
GET /api/chat/history
Response: Array<{
  id: string,
  messages: Array<{ role, content }>,
  createdAt: ISO8601
}>
```

### Health Check
```
GET /api/health
Response: { status: "ok", timestamp: ISO8601 }
```

---

## 🛠️ Advanced Configuration

### Change LLM Provider

Update `MODEL_PROVIDER` in `.env`:

**Groq (Recommended - Free)**
```properties
MODEL_PROVIDER=groq
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-120b
```

**OpenAI**
```properties
MODEL_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
```

**Anthropic**
```properties
MODEL_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

### Adjust Search Parameters

Edit `.env` to modify hybrid search behavior:

```properties
# Hybrid Search Weights (must sum to 1.0)
HYBRID_VECTOR_WEIGHT=0.2    # Importance of vector similarity
HYBRID_KEYWORD_WEIGHT=0.8   # Importance of keyword matching

# Re-ranking Configuration
LLM_RERANKING_ENABLED=true
LLM_RETRIEVAL_TOP_K=10      # Documents to retrieve for re-ranking
```

### Adjust Temperature

Temperature controls randomness/creativity (0.0 = deterministic, 2.0 = very creative):

```properties
TEMPERATURE=0.2             # Low for factual answers
```

---

## 📊 Testing

### Sample Test Data
The `documents/` folder includes sample files:
- `fee1.txt`, `fee2.txt`, `fee3.txt` - Resume excerpts
- `Iphoneinvoicev2.pdf` - Sample PDF
- `invoiceData_Samco.pdf` - Invoice document
- `Testcases_HealthCare_Ingestion_Pipeline_100.csv` - Healthcare test cases

### Manual Testing
1. Upload sample documents from the `documents/` folder
2. Ask predefined questions to verify responses
3. Check MongoDB to ensure embeddings are created
4. Monitor backend logs for processing details

### Running Tests
```bash
# Backend tests (if configured)
npm run test

# Frontend tests (if configured)
cd Frontend
npm run test
```

---

## 🐛 Troubleshooting

### "Connection refused" error
- Ensure backend is running: `npm run dev`
- Check if port 3000 is in use: `lsof -i :3000`
- Verify VITE_API_BASE_URL in Frontend/.env

### "API key invalid" error
- Verify API keys in `.env`
- Ensure keys haven't expired
- Check key permissions/scopes with provider

### "MongoDB connection failed"
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access
- Ensure IP whitelist includes your machine
- For local MongoDB, verify service is running

### "Document upload fails"
- Check file size limits (usually 50MB max)
- Verify file format is supported
- Check backend logs for detailed error
- Ensure `documents/` folder has write permissions

### Vector index not created
```bash
# Manually create indices
npm run create-vector-index

# Or check MongoDB Atlas UI for index status
```

---

## 📈 Performance Tips

1. **Use Groq API** - Free tier with good performance
2. **Adjust Re-ranking** - Disable if latency is critical: `LLM_RERANKING_ENABLED=false`
3. **Optimize Weights** - Increase `HYBRID_KEYWORD_WEIGHT` for faster keyword-based results
4. **Batch Processing** - Process multiple documents together: `INGESTION_BATCH_SIZE=10`

---

## 🔐 Security Best Practices

✅ **Implemented:**
- Environment variables for secrets (never commit `.env`)
- Input validation and sanitization
- API key rotation support
- MongoDB connection encryption

⚠️ **Before Production Deployment:**
- Use HTTPS for API endpoints
- Implement authentication/authorization
- Add rate limiting
- Enable CORS restrictions
- Audit MongoDB access logs
- Rotate API keys regularly

---

## 📚 Additional Resources

- [LangChain.js Documentation](https://js.langchain.com)
- [MongoDB Atlas Vector Search](https://www.mongodb.com/products/platform/atlas-vector-search)
- [Mistral AI API](https://docs.mistral.ai)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🎯 Key Components Explained

### Hybrid Search Pipeline
Combines two retrieval methods:
1. **Vector Search** - Semantic similarity using embeddings
2. **Keyword Search** - BM25 full-text search
3. **Scoring** - Weighted combination of both scores

### LLM Re-ranking
After retrieving top documents:
1. Pass retrieved docs to LLM
2. LLM scores relevance to query
3. Return top-k re-ranked results

### Conversational Memory
Maintains conversation history for:
- Context awareness in follow-up questions
- Coherent multi-turn interactions
- User conversation tracking

---

## 📝 Screenshots

Sample application screenshots showing the interface and functionality are included in the `screenshots/` folder:
- `qa_resume_bot_1.jpg` - Main chat interface
- `qa_resume_bot_2.jpg` - Document upload
- `qa_resume_bot_3.jpg` - Search results
- `qa_resume_bot_4.jpg` - Conversation history
- `qa_resume_bot_5.jpg` - Settings panel

---

## 👨‍💻 Development Team

Created as part of Week 6 assignment demonstrating:
- Full-stack AI application development
- LangChain integration with multiple providers
- MongoDB vector database usage
- Hybrid search implementation
- Modern React + TypeScript development

---

## 📄 License

This project is for educational purposes.

---

## 📞 Support & Questions

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review logs in backend console
3. Check MongoDB connection
4. Verify API keys and quotas

---

**Last Updated:** March 19, 2026
**Version:** 1.0
**Status:** ✅ Production Ready
