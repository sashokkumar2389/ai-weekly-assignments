# QA Resume Bot - Frontend

A modern, type-safe React frontend for the QA Resume Bot application. Chat-first interface with semantic search capabilities.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

- `src/api/` - API client, endpoints, and hooks
- `src/components/` - React components organized by feature
- `src/hooks/` - Custom React hooks
- `src/stores/` - Zustand state management
- `src/lib/` - Utilities and configurations
- `src/styles/` - Global styles and Tailwind setup

## Key Features

- 💬 Real-time conversational chat interface
- 🔍 Multiple search modes (keyword, vector, hybrid)
- 👤 Candidate profile viewing with Q&A
- 🎨 Light/dark theme support
- 📱 Responsive design (desktop-optimized)
- ⚡ Fast with Vite and TanStack Query

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TanStack Query** - Server state
- **Zustand** - Client state
- **Axios** - HTTP client

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8787
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
