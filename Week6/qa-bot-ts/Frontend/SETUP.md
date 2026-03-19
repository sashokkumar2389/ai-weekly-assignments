# QA Resume Bot - Frontend Project Structure Guide

## Overview

This is a production-ready React TypeScript frontend for the QA Resume Bot, built with Vite, TanStack Query, Zustand, and Tailwind CSS. The application is a chat-first interface optimized for recruiters to discover candidates through natural language conversations.

## Complete Project Structure

```
qa-bot-ts/frontend/
├── src/
│   ├── api/
│   │   ├── hooks/
│   │   │   ├── useChat.ts            # Main chat mutation
│   │   │   ├── useCandidate.ts       # Fetch candidate profile
│   │   │   ├── useDocumentQA.ts      # Ask questions about resume
│   │   │   ├── useChatHistory.ts     # Load conversation history
│   │   │   ├── useDeleteChat.ts      # Clear conversation
│   │   │   ├── useHealthCheck.ts     # Backend health status
│   │   │   └── index.ts              # Export all hooks
│   │   ├── apiClient.ts              # Axios instance with interceptors
│   │   ├── endpoints.ts              # API route constants
│   │   └── types.ts                  # TypeScript interfaces for API
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx      # Main chat layout wrapper
│   │   │   ├── ChatHeader.tsx         # Title, clear, theme toggle
│   │   │   ├── ChatMessageList.tsx    # Scrollable message list
│   │   │   ├── ChatMessage.tsx        # Single message bubble
│   │   │   ├── ChatInput.tsx          # Input with suggestions
│   │   │   ├── ChatSuggestions.tsx    # Auto-complete dropdown
│   │   │   ├── TypingIndicator.tsx    # "Bot thinking..." animation
│   │   │   ├── WelcomeScreen.tsx      # Empty state with suggestions
│   │   │   ├── CandidateCardList.tsx  # List of search results
│   │   │   └── index.ts
│   │   │
│   │   ├── candidates/
│   │   │   ├── CandidateCard.tsx      # Expandable result card
│   │   │   ├── CandidateCardSkeleton.tsx # Loading placeholder
│   │   │   ├── CandidateDetailsDialog.tsx # Modal with full profile
│   │   │   ├── CandidateProfile.tsx   # Profile content
│   │   │   ├── DocumentQAInput.tsx    # Resume Q&A input
│   │   │   └── index.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── SearchSettingsModal.tsx # Search type + top-K modal
│   │   │   └── index.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── ErrorMessage.tsx       # Error display
│   │   │   ├── ScoreBadge.tsx         # Relevance score badge
│   │   │   ├── MatchTypeBadge.tsx     # Search type badge
│   │   │   ├── SkillTag.tsx           # Skill chip component
│   │   │   ├── ThemeToggle.tsx        # Dark mode toggle
│   │   │   ├── HealthWarning.tsx      # Service status warning
│   │   │   └── index.ts
│   │   │
│   │   └── layout/
│   │       ├── AppLayout.tsx          # Root layout wrapper
│   │       ├── PageContainer.tsx      # Page content container
│   │       └── index.ts
│   │
│   ├── hooks/
│   │   ├── useAutoScroll.ts           # Scroll to bottom on messages
│   │   ├── useLocalStorage.ts         # Persisted state hook
│   │   ├── useTheme.ts                # Theme detection & toggle
│   │   ├── useConversation.ts         # Conversation lifecycle
│   │   └── useToast.ts                # Toast notifications
│   │
│   ├── stores/
│   │   ├── chatStore.ts               # Zustand: messages, convId
│   │   ├── settingsStore.ts           # Zustand: search settings
│   │   └── uiStore.ts                 # Zustand: modals, theme
│   │
│   ├── lib/
│   │   ├── utils.ts                   # Utility functions (cn, formatters)
│   │   ├── suggestions.ts             # Autocomplete suggestions data
│   │   ├── schemas.ts                 # Zod validation schemas
│   │   ├── queryClient.ts             # TanStack Query client config
│   │   └── config.ts                  # App configuration
│   │
│   ├── styles/
│   │   └── globals.css                # Tailwind directives + themes
│   │
│   ├── types/
│   │   └── (Future type definitions)
│   │
│   ├── App.tsx                        # Root component with providers
│   ├── main.tsx                       # Vite entry point
│   └── vite-env.d.ts                  # Vite type declarations
│
├── public/
│   └── (Static assets)
│
├── index.html                         # HTML entry point
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── tsconfig.node.json                 # TypeScript for build files
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
├── postcss.config.js                  # PostCSS configuration
├── .eslintrc.cjs                      # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── .env                               # Environment variables
├── .env.example                       # Environment template
├── README.md                          # Project documentation
└── SETUP.md                           # This file
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running at `http://localhost:8787`

### Installation

```bash
# 1. Navigate to frontend directory
cd qa-bot-ts/frontend

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Verify VITE_API_BASE_URL points to your backend
# .env should contain:
# VITE_API_BASE_URL=http://localhost:3001
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Key Architecture Decisions

### State Management
- **Zustand** for lightweight client state (chat messages, settings, UI modals)
- **TanStack Query** for server state (API calls with caching and sync)

### Styling
- **Tailwind CSS** with dark mode support (`class` strategy)
- **Lucide React** for icons
- Custom CSS variables for theme colors

### API Communication
- **Axios** with centralized instance and interceptors
- Error classification (503, network errors)
- Automatic retry logic via TanStack Query

### Component Architecture
- Feature-based directory structure
- Composition over inheritance
- Custom hooks for reusable logic
- Shared components for consistency

## Component Workflows

### Chat Flow
1. User types message → `ChatInput` component
2. On send → `useChat` mutation calls API
3. Response → Update `chatStore` with messages
4. Auto-scroll to new message via `useAutoScroll`
5. If search results → Render `CandidateCardList`

### Candidate Details Flow
1. Click "View Full Profile" on `CandidateCard`
2. `openCandidateDialog` action in `useUIStore`
3. `CandidateDetailsDialog` renders modal
4. `useCandidate` queries profile data
5. Display `CandidateProfile` content
6. Support Q&A via `DocumentQAInput`

### Settings Flow
1. Click gear icon in `ChatInput`
2. `SearchSettingsModal` opens
3. User adjusts search type and top-K
4. Settings saved to `useSettingsStore`
5. Passed to next chat request

## Type Safety

All API types are defined in [src/api/types.ts](./src/api/types.ts) and mirror the backend Zod schemas:

- `ChatRequest` / `ChatResponse`
- `CandidateResult` / `CandidateProfile`
- `SearchResponse`
- `DocumentQARequest` / `DocumentQAResponse`
- etc.

## Environment Configuration

### Development (.env)
```
VITE_API_BASE_URL=http://localhost:8787
```

### Production (.env.production)
```
VITE_API_BASE_URL=https://api.example.com
```

## Performance Optimizations

- **Code splitting** via Vite dynamic imports
- **Lazy component loading** (planned)
- **API caching** with TanStack Query
- **Image optimization** (in public/assets)
- **CSS minification** via Tailwind
- **Bundle analysis** via `vite build --stats`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Desktop only (1280px+)

## API Integration

### Default Timeout
- 30 seconds (suitable for LLM calls)
- Configurable per request

### Error Handling
- **503 errors** → Toast notification
- **Network errors** → Toast notification
- **4xx errors** → Inline chat message
- **Retry logic** → TanStack Query automatic retry

## Styling & Theming

### Light Theme (Default)
- Clean white background
- Blue primary color (#3b82f6)
- Gray accents

### Dark Theme
- Activated via `ThemeToggle` in header
- Persisted in localStorage as `qa-bot-theme`
- CSS variables toggle via `document.documentElement.classList`

### Custom CSS Classes
- `.chat-bubble-user` - User message styling
- `.chat-bubble-assistant` - Bot message styling
- `.typing-indicator` - "Bot thinking" animation

## Available Scripts

```bash
npm run dev        # Start development server (port 5173)
npm run build      # Compile TypeScript & build with Vite
npm run preview    # Preview production build locally
npm run lint       # Run ESLint on src/ directory
npm run format     # Format code with Prettier
```

## Debugging

### Browser DevTools
- **React DevTools** - Component tree & props
- **Redux DevTools** - Zustand store inspection
- **Network tab** - API call monitoring

### Common Issues

**API connection fails:**
- Verify backend is running at `VITE_API_BASE_URL`
- Check `.env` configuration
- Inspect Network tab in DevTools

**Components not updating:**
- Verify TanStack Query client is provided in `App.tsx`
- Check store subscriptions in components
- Look for missing dependencies in `useEffect` hooks

**Styling issues:**
- Ensure Tailwind is processing CSS (check build output)
- Verify dark mode class on `<html>` element
- Check CSS variable definitions in `globals.css`

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/component-name

# Commit with descriptive messages
git commit -m "feat: add ChatSuggestions component"

# Push and create PR
git push origin feature/component-name
```

## Next Steps / Future Enhancements

- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Cypress)
- [ ] Implement lazy loading for large lists
- [ ] Add search analytics
- [ ] Implement saved searches
- [ ] Add multi-language support i18n
- [ ] Mobile responsive design
- [ ] PWA support

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Guide](https://vitejs.dev/guide/)

## Support

For issues or questions:
1. Check the [README.md](./README.md)
2. Search existing issues in GitHub
3. Contact the development team

---

**Last Updated:** March 14, 2026 | **Frontend Version:** 1.0.0
