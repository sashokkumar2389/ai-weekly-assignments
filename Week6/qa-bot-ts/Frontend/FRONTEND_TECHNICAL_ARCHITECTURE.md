# QA Resume Bot — Frontend Technical Architecture

**Version:** 1.0 | **Date:** March 15, 2026 | **Status:** Approved for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Design Decisions Registry](#design-decisions-registry)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Architecture Overview](#architecture-overview)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [API Integration Layer](#api-integration-layer)
9. [Routing](#routing)
10. [Theming & Design System](#theming--design-system)
11. [Implementation Phases](#implementation-phases)
12. [Phase 1: Project Scaffolding & Foundation](#phase-1-project-scaffolding--foundation)
13. [Phase 2: Core Chat Interface](#phase-2-core-chat-interface)
14. [Phase 3: Search Integration & Results Rendering](#phase-3-search-integration--results-rendering)
15. [Phase 4: Candidate Details & Document QA](#phase-4-candidate-details--document-qa)
16. [Phase 5: Settings, Suggestions & Polish](#phase-5-settings-suggestions--polish)
17. [Phase 6: Theme Toggle & Session Persistence](#phase-6-theme-toggle--session-persistence)
18. [Component Specifications](#component-specifications)
19. [Data Flow Diagrams](#data-flow-diagrams)
20. [Error Handling Strategy](#error-handling-strategy)
21. [Performance Considerations](#performance-considerations)
22. [Future Enhancements](#future-enhancements)

---

## Executive Summary

QA Resume Bot Frontend is a **chat-first, single-page application** built with React, TypeScript, and Vite. It serves as the intelligent interface for an AI-powered resume search platform, enabling Recruiters and Hiring Managers to discover candidates through natural language conversations.

The frontend consumes a backend API powered by Express.js, LangChain, and MongoDB Atlas, supporting keyword (BM25), vector (semantic), and hybrid search modes with conversational RAG (Retrieval-Augmented Generation) and multi-turn chat memory.

### Key Architectural Principles

- **Chat-first UX**: The conversational interface is the primary canvas; all search results, candidate profiles, and interactions flow through the chat
- **Dual-persona design**: Optimized for both Recruiters (speed, scanning) and Hiring Managers (depth, analysis)
- **Desktop-only**: Optimized for 1280px+ screens
- **Lightweight & fast**: Vite + shadcn/ui + Tailwind CSS for minimal bundle size and instant HMR
- **Type-safe end-to-end**: Full TypeScript with Zod validation mirroring the backend schemas

---

## Design Decisions Registry

| # | Category | Approved Decision | Confidence |
|---|----------|-------------------|------------|
| 1 | Primary User | Recruiter + Hiring Manager (dual persona) | ✅ |
| 2 | Navigation Model | Chat-first with inline search results | ✅ |
| 3 | Search Results Display | Detailed expandable cards inline in chat | ✅ |
| 4 | Candidate Detail View | CandidateDetailsDialog modal component | ✅ |
| 5 | Conversation Management | Single active conversation + Clear Chat button | ✅ |
| 6 | Search Settings | Modal with search type selector + Top-K dropdown (max 10) | ✅ |
| 7 | UI Component Library | shadcn/ui + Tailwind CSS | ✅ |
| 8 | State Management | TanStack Query (server) + Zustand (client) | ✅ |
| 9 | Chat Message Rendering | Full markdown via react-markdown | ✅ |
| 10 | Chat Input | Enhanced textarea with suggestions (location, experience) | ✅ |
| 11 | Loading States | Typing indicator + skeleton placeholder cards | ✅ |
| 12 | Error Handling | Inline chat errors + toast for critical errors | ✅ |
| 13 | Device Support | Desktop only (1280px+) | ✅ |
| 14 | Authentication | None (initial build) | ✅ |
| 15 | Routing | Minimal React Router (extensible) | ✅ |
| 16 | HTTP Client | Axios with centralized apiClient instance | ✅ |
| 17 | Testing | Deferred (architecture supports future testing) | ✅ |
| 18 | Build Tool | Vite | ✅ |
| 19 | Session Persistence | localStorage for conversationId | ✅ |
| 20 | Theme | Light default + dark mode toggle (localStorage persisted) | ✅ |

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Build** | Vite | ^5.x | Dev server, HMR, production bundling |
| **Framework** | React | ^18.x | UI component framework |
| **Language** | TypeScript | ^5.x | Type safety |
| **Styling** | Tailwind CSS | ^3.x | Utility-first CSS |
| **Components** | shadcn/ui | latest | UI component primitives (Radix-based) |
| **State (server)** | TanStack Query | ^5.x | API caching, server state |
| **State (client)** | Zustand | ^4.x | Client-side state management |
| **HTTP Client** | Axios | ^1.x | API communication |
| **Routing** | React Router | ^6.x | Client-side routing |
| **Markdown** | react-markdown | ^9.x | LLM response rendering |
| **Validation** | Zod | ^3.x | Request/response schema validation |
| **Icons** | Lucide React | latest | Icon library (shadcn/ui default) |

### Dev Dependencies

| Tool | Purpose |
|------|---------|
| PostCSS | Tailwind CSS processing |
| Autoprefixer | CSS vendor prefixing |
| ESLint | Code linting |
| Prettier | Code formatting |
| @types/react | React type definitions |

---

## Project Structure

```
qa-resume-bot-frontend/
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── api/
│   │   ├── apiClient.ts              # Axios instance & interceptors
│   │   ├── endpoints.ts              # API endpoint constants
│   │   ├── types.ts                  # API request/response TypeScript types
│   │   └── hooks/
│   │       ├── useSearchResumes.ts   # TanStack Query: POST /search/resumes
│   │       ├── useChat.ts           # TanStack Query: POST /chat
│   │       ├── useChatHistory.ts    # TanStack Query: POST /chat/history
│   │       ├── useDeleteChat.ts     # TanStack Query: DELETE /chat/:id
│   │       ├── useCandidate.ts      # TanStack Query: GET /candidate/:id
│   │       ├── useDocumentQA.ts     # TanStack Query: POST /search/document
│   │       └── useHealthCheck.ts    # TanStack Query: GET /health
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx         # Main chat layout wrapper
│   │   │   ├── ChatHeader.tsx            # Header: title, clear chat, theme toggle
│   │   │   ├── ChatMessageList.tsx       # Scrollable message list
│   │   │   ├── ChatMessage.tsx           # Single message bubble (user/assistant)
│   │   │   ├── ChatInput.tsx             # Enhanced textarea with suggestions
│   │   │   ├── ChatSuggestions.tsx       # Auto-complete suggestion dropdown
│   │   │   ├── TypingIndicator.tsx       # "Bot is thinking..." animation
│   │   │   └── WelcomeScreen.tsx         # Initial empty state with prompts
│   │   ├── candidates/
│   │   │   ├── CandidateCard.tsx         # Expandable candidate result card
│   │   │   ├── CandidateCardSkeleton.tsx # Skeleton loading placeholder
│   │   │   ├── CandidateCardList.tsx     # List of candidate cards in chat
│   │   │   ├── CandidateDetailsDialog.tsx # Full profile modal
│   │   │   ├── CandidateProfile.tsx      # Profile content within modal
│   │   │   └── DocumentQAInput.tsx       # Mini Q&A input inside modal
│   │   ├── settings/
│   │   │   ├── SearchSettingsModal.tsx   # Search type + Top-K modal
│   │   │   ├── SearchTypeSelector.tsx   # Keyword/Vector/Hybrid selector
│   │   │   └── TopKSelector.tsx         # Top-K dropdown (1-10)
│   │   ├── shared/
│   │   │   ├── ErrorMessage.tsx         # Inline error bubble for chat
│   │   │   ├── ToastProvider.tsx        # Toast notification container
│   │   │   ├── ScoreBadge.tsx           # Score visualization (0-1)
│   │   │   ├── MatchTypeBadge.tsx       # keyword/vector/hybrid badge
│   │   │   ├── SkillTag.tsx             # Skill chip/tag component
│   │   │   └── ThemeToggle.tsx          # Sun/moon dark mode toggle
│   │   └── layout/
│   │       ├── AppLayout.tsx            # Root layout wrapper
│   │       └── PageContainer.tsx        # Page content container
│   ├── hooks/
│   │   ├── useConversation.ts           # Conversation lifecycle management
│   │   ├── useAutoScroll.ts             # Auto-scroll chat to bottom
│   │   ├── useLocalStorage.ts           # localStorage read/write hook
│   │   └── useTheme.ts                  # Theme detection & toggle hook
│   ├── stores/
│   │   ├── chatStore.ts                 # Zustand: conversation state
│   │   ├── settingsStore.ts             # Zustand: search settings state
│   │   └── uiStore.ts                   # Zustand: UI state (modals, panels)
│   ├── lib/
│   │   ├── utils.ts                     # Utility functions (cn, formatters)
│   │   ├── constants.ts                 # App-wide constants
│   │   ├── suggestions.ts              # Suggestion data (locations, experience)
│   │   └── schemas.ts                   # Zod validation schemas
│   ├── styles/
│   │   └── globals.css                  # Tailwind directives & CSS variables
│   ├── App.tsx                          # Root component with providers
│   ├── main.tsx                         # Vite entry point
│   └── vite-env.d.ts                    # Vite type declarations
├── components.json                       # shadcn/ui configuration
├── tailwind.config.ts                    # Tailwind CSS configuration
├── postcss.config.js                     # PostCSS configuration
├── tsconfig.json                         # TypeScript configuration
├── vite.config.ts                        # Vite configuration
├── package.json
├── .env                                  # Environment variables
├── .env.example                          # Env template
├── .eslintrc.cjs                         # ESLint configuration
├── .prettierrc                           # Prettier configuration
└── README.md
```

---

## Architecture Overview

### High-Level Frontend Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Browser (Desktop 1280px+)             │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    App.tsx                           │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  Providers: QueryClient, Zustand, Router,    │   │  │
│  │  │             Theme, Toast                      │   │  │
│  │  └──────────────┬───────────────────────────────┘   │  │
│  │                 │                                    │  │
│  │  ┌──────────────▼───────────────────────────────┐   │  │
│  │  │            AppLayout.tsx                      │   │  │
│  │  │  ┌──────────────────────────────────────┐    │   │  │
│  │  │  │         ChatContainer.tsx             │    │   │  │
│  │  │  │  ┌────────────────────────────────┐   │    │   │  │
│  │  │  │  │       ChatHeader.tsx            │   │    │   │  │
│  │  │  │  │  [Logo] [Title] [Clear] [Theme] │   │    │   │  │
│  │  │  │  └────────────────────────────────┘   │    │   │  │
│  │  │  │  ┌────────────────────────────────┐   │    │   │  │
│  │  │  │  │     ChatMessageList.tsx         │   │    │   │  │
│  │  │  │  │  ┌──────────────────────────┐  │   │    │   │  │
│  │  │  │  │  │  WelcomeScreen (empty)   │  │   │    │   │  │
│  │  │  │  │  │  OR                      │  │   │    │   │  │
│  │  │  │  │  │  ChatMessage (user)      │  │   │    │   │  │
│  │  │  │  │  │  ChatMessage (assistant) │  │   │    │   │  │
│  │  │  │  │  │  CandidateCardList       │  │   │    │   │  │
│  │  │  │  │  │    └─ CandidateCard ×N   │  │   │    │   │  │
│  │  │  │  │  │  TypingIndicator         │  │   │    │   │  │
│  │  │  │  │  │  ErrorMessage            │  │   │    │   │  │
│  │  │  │  │  └──────────────────────────┘  │   │    │   │  │
│  │  │  │  └────────────────────────────────┘   │    │   │  │
│  │  │  │  ┌────────────────────────────────┐   │    │   │  │
│  │  │  │  │       ChatInput.tsx            │   │    │   │  │
│  │  │  │  │  [⚙️] [textarea ▾] [Send ➤]   │   │    │   │  │
│  │  │  │  │  ChatSuggestions (dropdown)    │   │    │   │  │
│  │  │  │  └────────────────────────────────┘   │    │   │  │
│  │  │  └──────────────────────────────────────┘    │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Overlay Components ────────────────────────────────┐  │
│  │  SearchSettingsModal.tsx     (search type + top-K)  │  │
│  │  CandidateDetailsDialog.tsx  (full profile + Q&A)   │  │
��  │  ToastProvider.tsx           (critical error toasts) │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌───────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Components  │◄───►│   Zustand    │     │  TanStack Query │
│               │     │   Stores     │     │                 │
│  ChatInput    │     │              │     │  useChat()      │
│  ChatMessage  │     │ chatStore    │     │  useSearch()    │
│  CandidateCard│     │  - convId    │     │  useCandidate() │
│  Settings     │     │  - messages  │     │  useDocQA()     │
│               │     │              │     │                 │
│               │     │ settingsStore│     │  Cache Layer    │
│               │     │  - searchType│     │  - Auto refetch │
│               │     │  - topK      │     │  - Deduplication│
│               │     │              │     │  - Retry logic  │
│               │     │ uiStore      │     │                 │
│               │     │  - modals    │     │                 │
└───────┬───────┘     └──────────────┘     └────────┬────────┘
        │                                           │
        │              ┌──────────────┐             │
        └─────────────►│  apiClient   │◄────────────┘
                       │  (Axios)     │
                       │              │
                       │ Interceptors │
                       │ Error mapping│
                       │ Timeouts     │
                       └──────┬───────┘
                              │ HTTP/REST
                       ┌──────▼───────┐
                       │   Backend    │
                       │  Express.js  │
                       │  API Server  │
                       └──────────────┘
```

---

## Component Architecture

### Component Hierarchy

```
App.tsx
├── QueryClientProvider (TanStack Query)
├── BrowserRouter (React Router)
├── ToastProvider (shadcn/ui Toaster)
└── AppLayout.tsx
    └── Route: "/" → ChatContainer.tsx
        ├── ChatHeader.tsx
        │   ├── Logo + Title ("QA Resume Bot")
        │   ├── ClearChatButton
        │   └── ThemeToggle (sun/moon)
        ├── ChatMessageList.tsx
        │   ├── WelcomeScreen.tsx (when no messages)
        │   │   ├── Welcome text
        │   │   └── Suggested starter queries
        │   ├── ChatMessage.tsx (role: "user")
        │   │   └── Plain text bubble (right-aligned)
        │   ├── ChatMessage.tsx (role: "assistant")
        │   │   ├── Markdown rendered content (left-aligned)
        │   │   └── CandidateCardList.tsx (if search results)
        │   │       ├── CandidateCard.tsx (expandable)
        │   │       │   ├── Header: name, role, score badge, match type
        │   │       │   ├── Collapsed: top skills, company, location
        │   │       │   ├── Expanded: full extractedInfo, llmReasoning
        │   │       │   └── Action: "View Full Profile" → opens modal
        │   │       └── CandidateCardSkeleton.tsx (loading state)
        │   ├── TypingIndicator.tsx (during API call)
        │   └── ErrorMessage.tsx (inline errors)
        └── ChatInput.tsx
            ├── SettingsIcon (⚙️) → opens SearchSettingsModal
            ├── Textarea (auto-expanding, Shift+Enter for newline)
            ├── ChatSuggestions.tsx (dropdown above input)
            │   ├── Location suggestions
            │   ├── Experience suggestions
            │   └── Query starter suggestions
            └── SendButton (➤) with loading state

--- Overlay Components (portaled) ---

SearchSettingsModal.tsx
├── SearchTypeSelector.tsx
│   └── Radio group: Keyword | Vector | Hybrid (default)
└── TopKSelector.tsx
    └── Dropdown: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (default: 5)

CandidateDetailsDialog.tsx
├── CandidateProfile.tsx
│   ├── Header: name, email, phone, location
│   ├── Professional: role, company, experience
│   ├── Skills: tag cloud
│   ├── Education & Certifications
│   ├── LinkedIn profile link
│   └── Full resume content (scrollable)
└── DocumentQAInput.tsx
    ├── Question input field
    ├── Ask button
    └── Answer display area
```

---

## State Management

### Zustand Stores

#### 1. chatStore.ts

```typescript
interface ChatState {
  // Conversation
  conversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;

  // Cached search results (mirrors backend cache)
  lastSearchResults: CandidateResult[];

  // Actions
  setConversationId: (id: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setLastSearchResults: (results: CandidateResult[]) => void;
  clearChat: () => void;
}

interface ChatMessage {
  id: string;               // Frontend-generated UUID
  role: "user" | "assistant";
  content: string;          // Text content (markdown for assistant)
  timestamp: number;
  searchResults?: CandidateResult[];  // Attached search results
  isError?: boolean;        // Error message flag
}
```

#### 2. settingsStore.ts

```typescript
interface SettingsState {
  searchType: "keyword" | "vector" | "hybrid";
  topK: number;  // 1-10

  // Actions
  setSearchType: (type: "keyword" | "vector" | "hybrid") => void;
  setTopK: (k: number) => void;
  resetDefaults: () => void;
}

// Defaults
const DEFAULT_SEARCH_TYPE = "hybrid";
const DEFAULT_TOP_K = 5;
```

#### 3. uiStore.ts

```typescript
interface UIState {
  // Modal states
  isSettingsModalOpen: boolean;
  isCandidateDialogOpen: boolean;
  selectedCandidateId: string | null;

  // Theme
  theme: "light" | "dark";

  // Actions
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  openCandidateDialog: (candidateId: string) => void;
  closeCandidateDialog: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}
```

### TanStack Query Hooks

#### useChat (Primary)

```typescript
// POST /chat
const useChat = () => {
  return useMutation({
    mutationFn: (params: {
      message: string;
      conversationId?: string;
    }) => chatApi.sendMessage(params),
    onSuccess: (data) => {
      // Update chatStore with response
      // Cache search results in store
      // Save conversationId to localStorage
    },
    onError: (error) => {
      // Add error message to chat
      // Show toast for critical errors
    },
  });
};
```

#### useCandidate

```typescript
// GET /candidate/:id
const useCandidate = (candidateId: string) => {
  return useQuery({
    queryKey: ["candidate", candidateId],
    queryFn: () => candidateApi.getById(candidateId),
    enabled: !!candidateId,
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
  });
};
```

#### useDocumentQA

```typescript
// POST /search/document
const useDocumentQA = () => {
  return useMutation({
    mutationFn: (params: {
      candidateId: string;
      question: string;
    }) => documentApi.askQuestion(params),
  });
};
```

#### useChatHistory

```typescript
// POST /chat/history
const useChatHistory = (conversationId: string) => {
  return useQuery({
    queryKey: ["chatHistory", conversationId],
    queryFn: () => chatApi.getHistory(conversationId),
    enabled: !!conversationId,
  });
};
```

#### useDeleteChat

```typescript
// DELETE /chat/:conversationId
const useDeleteChat = () => {
  return useMutation({
    mutationFn: (conversationId: string) =>
      chatApi.deleteConversation(conversationId),
    onSuccess: () => {
      // Clear chatStore
      // Remove conversationId from localStorage
    },
  });
};
```

#### useHealthCheck

```typescript
// GET /health
const useHealthCheck = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => healthApi.check(),
    refetchInterval: 30 * 1000,  // Poll every 30 seconds
    retry: 3,
  });
};
```

---

## API Integration Layer

### apiClient.ts

```typescript
import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,  // 30 second default (LLM calls can be slow)
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error classification
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 503) {
      // Critical: Show toast notification
      showCriticalToast("Service unavailable. Please try again later.");
    }
    if (!error.response) {
      // Network error: Show toast
      showCriticalToast("Network connection lost. Check your connection.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### endpoints.ts

```typescript
export const ENDPOINTS = {
  HEALTH:          "/health",
  SEARCH_RESUMES:  "/search/resumes",
  CANDIDATE:       "/candidate",        // + /:id
  CHAT:            "/chat",
  CHAT_HISTORY:    "/chat/history",
  CHAT_DELETE:     "/chat",             // DELETE + /:conversationId
  DOCUMENT_QA:     "/search/document",
} as const;
```

### types.ts (API Types)

```typescript
// ── Request Types ──

export interface SearchRequest {
  query: string;
  searchType: "keyword" | "vector" | "hybrid";
  topK: number;
  filters?: {
    company?: string[];
    skills?: string[];
    location?: string[];
  };
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  includeHistory?: boolean;
}

export interface ChatHistoryRequest {
  conversationId: string;
}

export interface DocumentQARequest {
  candidateId: string;
  question: string;
}

// ── Response Types ──

export interface SearchResponse {
  results: CandidateResult[];
  searchType: string;
  resultCount: number;
  duration: number;
}

export interface CandidateResult {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  score: number;
  matchType: "keyword" | "vector" | "hybrid";
  extractedInfo?: {
    skills: string[];
    experience: string;
    specialization: string;
  };
  llmReasoning?: string;
}

export interface ChatResponse {
  conversationId: string;
  response: string;
  searchResults: CandidateResult[];
  messageCount: number;
  searchType: string;
}

export interface CandidateProfile {
  candidate: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    company: string;
    skills: string[];
    experience: string;
    specialization: string;
    resumeContent: string;
    location?: string;
    linkedinProfile?: string;
    education?: string[];
    certifications?: string[];
  };
}

export interface ChatHistoryResponse {
  conversationId: string;
  messages: {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }[];
  totalMessages: number;
}

export interface DocumentQAResponse {
  candidateId: string;
  candidateName: string;
  question: string;
  answer: string;
  relevantExcerpts: string[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  model: {
    provider: string;
    model: string;
    embeddingProvider: string;
    embeddingModel: string;
  };
  retrievalPipeline: string;
  activeConversations: number;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  traceId?: string;
}
```

---

## Routing

### Route Configuration

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<ChatContainer />} />
              {/* Future routes */}
              {/* <Route path="/analytics" element={<Analytics />} /> */}
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
            </Routes>
          </AppLayout>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

---

## Theming & Design System

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
export default {
  darkMode: "class",  // Toggle via .dark class on <html>
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        // Chat-specific colors
        chat: {
          user: "#eff6ff",        // Light blue bubble
          assistant: "#f8fafc",   // Light gray bubble
          userDark: "#1e3a5f",
          assistantDark: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      maxWidth: {
        chat: "900px",  // Max chat container width
      },
      animation: {
        "typing-dot": "typingDot 1.4s infinite",
      },
    },
  },
};
```

### CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light theme (default) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }

  .dark {
    /* Dark theme */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --border: 217.2 32.6% 17.5%;
  }
}
```

### Theme Toggle Implementation

```typescript
// hooks/useTheme.ts
export const useTheme = () => {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    const stored = localStorage.getItem("qa-bot-theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("qa-bot-theme", theme);
  }, [theme]);

  return { theme, toggleTheme: () => setTheme(theme === "light" ? "dark" : "light") };
};
```

---

## Implementation Phases

### Overview

The implementation is divided into **6 sequential phases**, each building on the previous. Each phase produces a working, demonstrable increment.

```
Phase 1: Project Scaffolding & Foundation          [Days 1-2]
Phase 2: Core Chat Interface                       [Days 3-5]
Phase 3: Search Integration & Results Rendering    [Days 6-8]
Phase 4: Candidate Details & Document QA           [Days 9-10]
Phase 5: Settings, Suggestions & Polish            [Days 11-12]
Phase 6: Theme Toggle & Session Persistence        [Days 13-14]
```

---

## Phase 1: Project Scaffolding & Foundation

### Objective
Set up the complete project infrastructure with all dependencies, configurations, and foundational code.

### Tasks

#### 1.1 Initialize Vite + React + TypeScript Project
```bash
npm create vite@latest qa-resume-bot-frontend -- --template react-ts
cd qa-resume-bot-frontend
npm install
```

#### 1.2 Install Dependencies
```bash
# Core
npm install react-router-dom axios zustand @tanstack/react-query zod

# UI
npm install tailwindcss postcss autoprefixer
npm install react-markdown remark-gfm
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge

# shadcn/ui setup
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input dialog dropdown-menu
npx shadcn-ui@latest add card badge separator scroll-area
npx shadcn-ui@latest add toast radio-group select textarea
```

#### 1.3 Configure Tailwind CSS
- Set up `tailwind.config.ts` with brand colors, fonts, custom animations
- Configure `globals.css` with light/dark theme CSS variables
- Set `darkMode: "class"` for toggle support

#### 1.4 Set Up Project Structure
- Create all directories as defined in Project Structure
- Create placeholder files for all components

#### 1.5 Configure API Layer
- Create `apiClient.ts` with Axios instance, base URL, interceptors
- Create `endpoints.ts` with all API endpoint constants
- Create `types.ts` with all TypeScript interfaces (mirroring backend Zod schemas)
- Create `schemas.ts` with Zod validation schemas for frontend

#### 1.6 Set Up State Management
- Create `chatStore.ts`, `settingsStore.ts`, `uiStore.ts` Zustand stores
- Configure TanStack Query client with default retry/stale settings

#### 1.7 Configure Routing
- Set up React Router with `AppLayout` wrapper
- Single route: `/` → `ChatContainer`

#### 1.8 Environment Configuration
- Create `.env` with `VITE_API_BASE_URL=http://localhost:3001`
- Create `.env.example` as template

### Deliverable
- Project runs with `npm run dev`
- Empty chat layout renders at `localhost:5173`
- API client configured and ready
- All stores initialized with defaults

---

## Phase 2: Core Chat Interface

### Objective
Build the complete chat UI with message rendering, input handling, and auto-scrolling.

### Tasks

#### 2.1 ChatContainer.tsx
- Full-height container with flex column layout
- Houses ChatHeader, ChatMessageList, ChatInput
- Max width: 900px, centered
- Background: theme-aware (light/dark)

#### 2.2 ChatHeader.tsx
- Left: Logo + "QA Resume Bot" title
- Right: Clear Chat button (trash icon) + placeholder for theme toggle
- Clear Chat: Calls `useDeleteChat`, clears `chatStore`, removes localStorage

#### 2.3 WelcomeScreen.tsx
- Displayed when `messages.length === 0`
- Large centered bot icon/logo
- Welcome text: "Hi! I'm QA Resume Bot. Ask me to find candidates."
- 4-6 suggested starter queries as clickable chips:
  - "Find React developers with 5+ years experience"
  - "Show me QA engineers skilled in Playwright"
  - "Search for DevOps engineers in San Francisco"
  - "Find full-stack developers at Microsoft"
- Clicking a chip populates the input and sends the message

#### 2.4 ChatMessageList.tsx
- Scrollable container (`overflow-y-auto`) with `scroll-area` from shadcn/ui
- Renders array of `ChatMessage` components
- Auto-scrolls to bottom on new messages (via `useAutoScroll` hook)
- Padding and spacing between messages

#### 2.5 ChatMessage.tsx
- **User messages**: Right-aligned, blue/brand background, plain text
- **Assistant messages**: Left-aligned, gray/white background, rendered via `react-markdown` with `remark-gfm` for tables/lists
- Timestamp display (relative: "2 min ago")
- Avatar: User icon (right) / Bot icon (left)

#### 2.6 ChatInput.tsx
- Auto-expanding textarea (1-4 lines)
- Enter to send, Shift+Enter for new line
- Send button with arrow icon, disabled when empty or loading
- Settings gear icon on the left side of input bar
- Placeholder text: "Ask me to find candidates..."

#### 2.7 TypingIndicator.tsx
- Three animated dots in a bot message bubble
- Text: "QA Bot is thinking..."
- Shown when `chatStore.isLoading === true`

#### 2.8 useAutoScroll Hook
- Ref-based scroll to bottom
- Triggers on new message added to `chatStore.messages`
- Smooth scroll behavior

### Deliverable
- Fully functional chat UI with message display
- User can type messages and see them appear (no API calls yet)
- Welcome screen with starter suggestions
- Auto-scroll working
- Typing indicator animates

---

## Phase 3: Search Integration & Results Rendering

### Objective
Connect the chat to the backend API and render search results as expandable candidate cards.

### Tasks

#### 3.1 useChat Hook Implementation
- TanStack Query `useMutation` wrapping `POST /chat`
- Sends: `{ message, conversationId }` (conversationId from chatStore)
- On success:
  - Add user message to chatStore
  - Add assistant response (with searchResults) to chatStore
  - Update `conversationId` in chatStore + localStorage
  - Cache `lastSearchResults` in chatStore
- On error:
  - Add inline error message to chat
  - Show toast for 503/network errors

#### 3.2 Connect ChatInput to useChat
- On send: Call `useChat.mutate()` with message text
- Set `isLoading: true` in chatStore (shows TypingIndicator)
- Disable input during loading
- Clear input on successful send

#### 3.3 CandidateCard.tsx
- **Collapsed state** (default):
  - Name (bold), Role @ Company
  - ScoreBadge (color-coded: green >0.8, yellow >0.5, red <0.5)
  - MatchTypeBadge (keyword/vector/hybrid with distinct colors)
  - Top 3 skills as SkillTag chips
  - Expand/collapse chevron
- **Expanded state**:
  - All skills as SkillTag chips
  - Experience level
  - Specialization
  - LLM reasoning text (italic, muted)
  - "View Full Profile" button → opens CandidateDetailsDialog
- Smooth expand/collapse animation (height transition)

#### 3.4 CandidateCardList.tsx
- Renders array of CandidateCard components
- Attached to assistant messages that have `searchResults`
- Header: "Found {n} candidates" with result count
- Cards stacked vertically with gap

#### 3.5 CandidateCardSkeleton.tsx
- Shimmer/pulse animation placeholder
- Same dimensions as CandidateCard collapsed state
- Shown during loading (before results arrive)
- 3-5 skeleton cards displayed by default

#### 3.6 ScoreBadge.tsx
- Circular or pill badge showing score (e.g., "0.92")
- Color: Green (≥0.8), Yellow (≥0.5), Red (<0.5)
- Tooltip: "Relevance score: 0.92"

#### 3.7 MatchTypeBadge.tsx
- Small pill badge: "Keyword" / "Vector" / "Hybrid"
- Distinct colors per type (blue/purple/green)

#### 3.8 SkillTag.tsx
- Small chip/tag for individual skills
- Consistent styling, truncated if too many

#### 3.9 ErrorMessage.tsx (Inline)
- Styled as a chat message bubble with warning/error theme
- Red/amber border and icon
- Retry button (re-sends the last user message)
- Used for: search failures, fallback warnings, empty results

### Deliverable
- Full end-to-end flow: Type query → API call → Render results
- Expandable candidate cards with all fields
- Loading skeletons during API calls
- Error handling with inline messages and toasts
- Score and match type badges

---

## Phase 4: Candidate Details & Document QA

### Objective
Implement the CandidateDetailsDialog modal and Document Q&A functionality.

### Tasks

#### 4.1 CandidateDetailsDialog.tsx
- shadcn/ui `Dialog` component (modal overlay)
- Triggered by "View Full Profile" button on CandidateCard
- Opens `uiStore.isCandidateDialogOpen` and sets `selectedCandidateId`
- Fetches full profile via `useCandidate(selectedCandidateId)`
- Large modal: ~70% viewport width, ~80% viewport height
- Scrollable content area
- Close button (X) in top-right corner

#### 4.2 useCandidate Hook
- TanStack Query `useQuery` wrapping `GET /candidate/:id`
- Enabled only when `candidateId` is truthy
- 5-minute stale time (cache profile data)
- Loading state: Skeleton inside modal

#### 4.3 CandidateProfile.tsx
- Rendered inside CandidateDetailsDialog
- **Header section**: Name (large), Role @ Company, Location
- **Contact section**: Email (mailto link), Phone, LinkedIn (external link)
- **Skills section**: Full skill tag cloud
- **Experience section**: Years of experience, specialization
- **Education section**: List of education entries
- **Certifications section**: List of certifications
- **Resume section**: Full resume text in a scrollable, formatted block
  - Monospace font for raw resume text
  - Collapsible/expandable for long resumes

#### 4.4 DocumentQAInput.tsx
- Positioned at the bottom of the CandidateDetailsDialog modal
- Fixed footer within the modal (doesn't scroll away)
- Text input: "Ask a question about this candidate's resume..."
- Ask button with loading state
- Answer display: Below the input, styled as a Q&A block
- Uses `useDocumentQA` mutation

#### 4.5 useDocumentQA Hook
- TanStack Query `useMutation` wrapping `POST /search/document`
- Sends: `{ candidateId, question }`
- Displays: `answer` text + `relevantExcerpts` as highlighted sections
- Error handling: Inline error below the input

### Deliverable
- Click "View Full Profile" → Modal opens with full candidate data
- All profile fields rendered with proper formatting
- Document Q&A: Ask questions, get LLM answers with excerpts
- Modal is scrollable and closeable
- Loading states within modal

---

## Phase 5: Settings, Suggestions & Polish

### Objective
Implement the search settings modal, chat input suggestions, and UI polish.

### Tasks

#### 5.1 SearchSettingsModal.tsx
- shadcn/ui `Dialog` component
- Triggered by gear icon (⚙️) in ChatInput
- Opens `uiStore.isSettingsModalOpen`

#### 5.2 SearchTypeSelector.tsx
- shadcn/ui `RadioGroup` with three options:
  - **Keyword** — "Exact text matching (BM25)"
  - **Vector** — "Semantic similarity search"
  - **Hybrid** — "Combined search (recommended)" ← default
- Each option has label + description text
- Selection updates `settingsStore.searchType`

#### 5.3 TopKSelector.tsx
- shadcn/ui `Select` dropdown
- Options: 1 through 10 (default: 5)
- Label: "Number of results"
- Selection updates `settingsStore.topK`

#### 5.4 Settings Persistence
- Settings saved to `settingsStore` (Zustand)
- Sent with every `POST /chat` request as additional context
- "Apply" button closes modal and applies settings
- "Reset Defaults" button restores hybrid + top-5

#### 5.5 ChatSuggestions.tsx
- Dropdown/popover that appears above the ChatInput
- Triggered by typing patterns:
  - Typing "in " or "from " → Show **location suggestions**
    - Major cities: San Francisco, New York, London, Bangalore, etc.
    - Countries: USA, India, UK, Germany, etc.
  - Typing a number or "year" → Show **experience suggestions**
    - "with 1+ years experience"
    - "with 3-5 years experience"
    - "with 5+ years experience"
    - "with 10+ years experience"
  - Empty input (on focus) → Show **query starters**
    - "Find candidates skilled in..."
    - "Show me developers with experience in..."
    - "Search for engineers from..."
- Click suggestion → Insert into textarea at cursor position
- Keyboard navigation: Arrow keys + Enter to select
- Dismiss: Escape key or click outside

#### 5.6 Suggestion Data
```typescript
// lib/suggestions.ts
export const LOCATION_SUGGESTIONS = [
  "San Francisco", "New York", "Seattle", "Austin", "Chicago",
  "London", "Berlin", "Toronto", "Bangalore", "Singapore",
  "Remote", "USA", "India", "UK", "Germany", "Canada",
];

export const EXPERIENCE_SUGGESTIONS = [
  "with 1+ years experience",
  "with 2-3 years experience",
  "with 3-5 years experience",
  "with 5+ years experience",
  "with 7+ years experience",
  "with 10+ years experience",
  "entry level",
  "senior level",
  "lead/principal level",
];

export const QUERY_STARTERS = [
  "Find React developers",
  "Show me QA engineers skilled in Playwright",
  "Search for DevOps engineers",
  "Find full-stack developers",
  "Show me candidates with Python experience",
  "Find automation testers",
];
```

#### 5.7 UI Polish
- Consistent spacing and padding throughout
- Hover states on all interactive elements
- Focus rings for keyboard accessibility
- Smooth transitions for expand/collapse, modal open/close
- Proper z-index layering for modals and toasts

### Deliverable
- Settings modal with search type and top-K selection
- Auto-complete suggestions in chat input
- All interactive elements polished and consistent
- Keyboard navigation support for suggestions

---

## Phase 6: Theme Toggle & Session Persistence

### Objective
Implement dark mode toggle and conversation persistence across browser refreshes.

### Tasks

#### 6.1 ThemeToggle.tsx
- Sun icon (light mode) / Moon icon (dark mode)
- Placed in ChatHeader, right side
- Toggles `document.documentElement.classList` between "" and "dark"
- Persists preference to `localStorage` key: `qa-bot-theme`
- On initial load: Check localStorage, then system preference (`prefers-color-scheme`)

#### 6.2 useTheme Hook
- Reads theme from localStorage on mount
- Falls back to system preference
- Updates Zustand `uiStore.theme`
- Syncs DOM class and localStorage on change

#### 6.3 Dark Mode Styles
- All shadcn/ui components support dark mode via CSS variables (configured in Phase 1)
- Chat bubbles: Adjusted colors for dark background
- Candidate cards: Dark card backgrounds with light text
- Modals: Dark backgrounds with proper contrast
- Input areas: Dark backgrounds with visible borders
- Skeleton loaders: Adjusted shimmer colors

#### 6.4 Conversation Persistence (localStorage)
- **On new conversation**: `localStorage.setItem("qa-bot-conversationId", id)`
- **On page load**:
  1. Read `conversationId` from localStorage
  2. If exists: Call `POST /chat/history` to load messages
  3. If backend returns error (conversation expired): Clear localStorage, start fresh
  4. If no stored ID: Show WelcomeScreen
- **On Clear Chat**:
  1. Call `DELETE /chat/:conversationId`
  2. `localStorage.removeItem("qa-bot-conversationId")`
  3. Reset chatStore
  4. Show WelcomeScreen

#### 6.5 useConversation Hook
```typescript
const useConversation = () => {
  const { conversationId, setConversationId, setMessages, clearChat } = useChatStore();
  const { data: history, error } = useChatHistory(
    localStorage.getItem("qa-bot-conversationId") || ""
  );

  useEffect(() => {
    // On mount: Restore conversation from localStorage
    const storedId = localStorage.getItem("qa-bot-conversationId");
    if (storedId) {
      setConversationId(storedId);
    }
  }, []);

  useEffect(() => {
    // When history loads: Populate messages
    if (history?.messages) {
      setMessages(history.messages.map(msg => ({
        id: crypto.randomUUID(),
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })));
    }
  }, [history]);

  useEffect(() => {
    // If history fetch fails: Conversation expired
    if (error) {
      localStorage.removeItem("qa-bot-conversationId");
      clearChat();
    }
  }, [error]);

  return { conversationId };
};
```

#### 6.6 Health Check Integration
- `useHealthCheck` polls `GET /health` every 30 seconds
- If unhealthy: Show a subtle banner at the top of ChatContainer
  - "⚠️ Backend service is temporarily unavailable"
  - Non-blocking, dismissible
- If healthy: Hide banner

#### 6.7 Final Polish & Optimization
- Verify all loading states work correctly
- Verify all error scenarios (network loss, 503, empty results, invalid conversation)
- Verify theme toggle applies consistently across all components
- Verify localStorage persistence works across refresh/close/reopen
- Code cleanup: Remove console.logs, unused imports
- Bundle size check: `npm run build` and review output

### Deliverable
- Dark mode toggle working with localStorage persistence
- Conversation survives browser refresh via localStorage + history API
- Health check monitoring with status banner
- All edge cases handled gracefully
- Production-ready build

---

## Component Specifications

### ChatContainer.tsx — Detailed Spec

```
┌────────────────────────────────────────────┐
│  ChatHeader                                │
│  [🤖 QA Resume Bot]        [🗑️] [🌙/☀️]  │
├────────────────────────────────────────────┤
│                                            │
│  ChatMessageList (scrollable)              │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │  [Welcome Screen / Messages]         │  │
│  │                                      │  │
│  │  ┌─────────────────────────────┐     │  │
│  │  │ 👤 User: Find React devs   │──┐  │  │
│  │  └─────────────────────────────┘  │  │  │
│  │                                   │  │  │
│  │  ┌─────────────────────────────┐  │  │  │
│  │  │ 🤖 Bot: I found 5 React... │  │  │  │
│  │  │                             │  │  │  │
│  │  │ ┌─ CandidateCard ────────┐  │  │  │  │
│  │  │ │ John Doe | Sr Dev      │  │  │  │  │
│  │  │ │ Score: 0.95 | Hybrid   │  │  │  │  │
│  │  │ │ [React] [Node] [AWS]   │  │  │  │  │
│  │  │ │ ▼ Expand for details   │  │  │  │  │
│  │  │ └────────────────────────┘  │  │  │  │
│  │  │ ┌─ CandidateCard ────────┐  │  │  │  │
│  │  │ │ Jane Smith | QA Lead   │  │  │  │  │
│  │  │ │ Score: 0.87 | Vector   │  │  │  │  │
│  │  │ │ [React] [Playwright]   │  │  │  │  │
│  │  │ └────────────────────────┘  │  │  │  │
│  │  └─────────────────────────────┘  │  │  │
│  │                                      │  │
│  │  ┌─────────────────────────────┐     │  │
│  │  │ 🤖 ● ● ● Thinking...      │     │  │
│  │  └─────────────────────────────┘     │  │
│  └──────────────────────────────────────┘  │
│                                            │
├────────────────────────────────────────────┤
│  ChatInput                                 │
│  [⚙️] [Type your message...        ] [➤]  │
│  ┌──────────────────────────────────────┐  │
│  │ Suggestions: San Francisco | NYC ... │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### CandidateDetailsDialog — Detailed Spec

```
┌──────────────────────────────────────────────────────┐
│  CandidateDetailsDialog (Modal - 70% width)     [X] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌── Header ──────────────────────────────────────┐  │
│  │  👤 John Doe                                   │  │
│  │  Senior React Developer @ Microsoft            │  │
│  │  📍 San Francisco, CA                          │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌── Contact ─────────────────────────────────────┐  │
│  │  ✉️ john.doe@email.com  📞 +1-555-1234        │  │
│  │  🔗 linkedin.com/in/johndoe                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌── Skills ──────────────────────────────────────┐  │
│  │  [React] [TypeScript] [Node.js] [AWS] [Docker] │  │
│  │  [GraphQL] [PostgreSQL] [CI/CD] [Jest]         │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌── Experience ──────────────────────────────────┐  │
│  │  Experience: 8 years                           │  │
│  │  Specialization: Frontend Architecture         │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌── Education ───────────────────────────────────┐  │
│  │  • MS Computer Science, Stanford University    │  │
│  │  • BS Software Engineering, UC Berkeley        │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌── Certifications ─────────────────────────────┐  │
│  │  • AWS Solutions Architect                     │  │
│  │  • Google Cloud Professional                   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌── Resume Content (collapsible) ────────────────┐  │
│  │  ▼ View Full Resume                            │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │ Full resume text displayed here...       │  │  │
│  │  │ (scrollable, monospace font)             │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
├──────────────────────────────────────────────────────┤
│  ┌── Document Q&A (fixed footer) ─────────────────┐  │
│  │  [Ask about this candidate's resume...   ] [Ask]│  │
│  │                                                 │  │
│  │  Q: What frameworks has this candidate used?    │  │
│  │  A: Based on the resume, John has extensive...  │  │
│  │  Relevant: "Led migration from Angular to..."   │  │
│  └─────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Flow 1: User Sends a Message

```
User types message → Clicks Send / p