# RecruitBot Frontend

Modern, enterprise-grade React frontend for the RecruitBot resume search platform.

## Tech Stack

- **React 18** + **TypeScript** - Type-safe component development
- **Vite** - Lightning-fast bundler and dev server
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client with interceptors
- **React Hook Form + Zod** - Form handling and validation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn/ui primitives
│   ├── layout/             # Main layout components
│   ├── common/             # Reusable common components
│   └── features/           # Feature-specific components
│       ├── sidebar/
│       ├── chat/
│       ├── results/
│       └── candidate/
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api/               # API client and services
│   ├── stores/            # Zustand stores
│   └── utils/             # Helper functions
├── types/                 # TypeScript type definitions
├── config/                # Configuration files
├── pages/                 # Page components
├── App.tsx                # Root component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Environment Variables

```bash
# .env.development / .env.production
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=RecruitBot
VITE_ENABLE_MOCK=false
```

## Key Features

### Search Modes
- **Vector Search**: AI-powered semantic similarity
- **BM25 Keyword**: Fast exact keyword matching
- **Hybrid Search**: Combined with customizable weights

### UI Components
- Responsive sidebar with search configuration
- Chat-style interface for query interactions
- Result cards with ranking and scoring
- Full-screen candidate profile modals
- Mobile-optimized drawer navigation

### State Management
- Search configuration (mode, weights, topK)
- Chat message history
- UI state (mobile detection, modal open/close)
- Loading and error states

### Accessibility
- Full keyboard navigation
- ARIA labels on all interactive elements
- Focus management in modals
- Screen reader announcements
- WCAG 2.1 AA compliance

## API Integration

### POST /search
Execute a search query with configurable parameters

```typescript
{
  query: string;
  searchType: 'vector' | 'keyword' | 'hybrid';
  topK: number;
  bm25Weight?: number;
  vectorWeight?: number;
}
```

### GET /candidate/:id
Fetch a complete candidate profile for the modal

## Deployment

### Vercel
```bash
# Push to GitHub and connect repository to Vercel
# Environment variables in Vercel dashboard:
VITE_API_BASE_URL=https://your-backend.com
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Lighthouse**: ≥85% (Performance + Accessibility)
- **Build time**: < 5s
- **Bundle size**: < 400KB (gzipped)
- **First contentful paint**: < 1.5s

## Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode
- Pre-commit hooks (optional)

## Testing

```bash
npm run test              # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -am 'feat: description'`
3. Run linter: `npm run lint`
4. Format code: `npm run format`
5. Push and create pull request

## License

Proprietary - RecruitBot © 2024
