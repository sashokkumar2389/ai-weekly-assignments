# QA Resume Bot Frontend - Installation & Deployment Guide

## ✅ Project Generation Complete

All necessary files have been generated for a production-ready React TypeScript frontend for the QA Resume Bot. The project follows the technical architecture with proper file structure, component organization, and best practices.

## 📋 What's Been Generated

### Core Structure ✓
- ✅ API Layer (axios client, endpoints, types, hooks)
- ✅ State Management (Zustand stores for chat, settings, UI)
- ✅ Custom Hooks (auto-scroll, localStorage, theme, conversation)
- ✅ Chat Components (container, header, input, messages, welcome)
- ✅ Candidate Components (cards, profile, dialog, document QA)
- ✅ Settings Components (search settings modal)
- ✅ Shared Components (badges, tags, theme toggle, warnings)
- ✅ Layout Components (app layout, page container)
- ✅ Utilities & Constants (formatters, suggestions, schemas)
- ✅ Configuration Files (vite, tailwind, postcss, eslint, prettier)

### Total Files Created
- **Component Files:** 21
- **Hook Files:** 5
- **Store Files:** 3
- **API Files:** 8
- **Utility Files:** 4
- **Configuration Files:** 10
- **Documentation Files:** 3

**Total: 54 files**

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd /Users/macbook/AI_workspace/qa-bot-ts/frontend
npm install
```

This will install all required dependencies:
- React 18, React DOM, React Router
- Vite (build tool)
- TypeScript
- Tailwind CSS, PostCSS, Autoprefixer
- TanStack Query (React Query)
- Zustand
- Axios
- React Markdown
- Lucide React (icons)
- Zod (validation)
- ESLint, Prettier

### Step 2: Configure Environment

The `.env` file is already created with default values:

```bash
VITE_API_BASE_URL=http://localhost:8787
```

Update if your backend runs on a different port.

### Step 3: Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:5173**

## 📁 Project File Structure

```
frontend/
├── src/
│   ├── api/                    # API client & queries
│   ├── components/             # React components
│   │   ├── chat/              # Chat interface
│   │   ├── candidates/        # Candidate views
│   │   ├── settings/          # Settings modal
│   │   ├── shared/            # Reusable components
│   │   └── layout/            # Layout components
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand state stores
│   ├── lib/                   # Utilities & config
│   ├── styles/                # Global CSS & Tailwind
│   ├── App.tsx                # Root component
│   └── main.tsx               # Entry point
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── tailwind.config.js         # Tailwind config
├── .env                       # Environment variables
└── README.md                  # Project docs
```

## 🔧 Available npm Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Production
npm run build        # Build for production (creates /dist)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint on src/ files
npm run format       # Format code with Prettier
```

## 🎨 Key Technologies

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first styling with dark mode
- **TanStack Query 5** - Server state management with caching
- **Zustand 4** - Lightweight client state management
- **Axios 1** - HTTP client
- **React Router 6** - Client-side routing

## 📦 Backend Requirements

The frontend expects a backend API running at `VITE_API_BASE_URL` (default: `http://localhost:8787`) with the following endpoints:

### Required Endpoints

```
POST   /chat                    # Send message, get response
POST   /chat/history           # Load conversation history
DELETE /chat/:conversationId   # Delete conversation
GET    /health                 # Health check
GET    /candidate/:id          # Get candidate profile
POST   /search/document        # Ask Q&A about resume
POST   /search/resumes         # Search candidates
```

## 🎯 Core Features Implemented

### Chat Interface ✓
- Real-time messaging
- Typing indicator
- Auto-scroll to latest message
- Message persistence via localStorage
- Welcome screen with suggestions

### Search Results ✓
- Expandable candidate cards
- Score badges (green/yellow/red)
- Match type badges (keyword/vector/hybrid)
- Skill tags
- Expandable details with LLM reasoning

### Candidate Details ✓
- Full profile modal
- Contact information
- Skills cloud
- Experience & specialization
- Education & certifications
- Resume viewer
- Document Q&A interface

### Settings ✓
- Search type selector (keyword/vector/hybrid)
- Results count slider (1-10)
- Settings persistence

### UI/UX ✓
- Light/dark theme toggle
- Theme persistence in localStorage
- Responsive layout (desktop-optimized 1280px+)
- Smooth animations and transitions
- Keyboard support (Shift+Enter for newline, etc.)

## 🔐 Type Safety

The entire codebase is **100% TypeScript** with:
- Strict mode enabled
- Type definitions for all API responses
- Zod schema validation
- Component prop types
- Store state types

## 🌙 Theme Support

### Light Mode (Default)
- Clean white background
- Blue primary (#3b82f6)
- Gray accents

### Dark Mode
- Toggle via sun/moon icon in header
- Persisted in localStorage
- All components support dark colors
- Smooth transition animations

To customize colors:
1. Edit `tailwind.config.js` for theme colors
2. Edit `src/styles/globals.css` for CSS variables

## 📱 Responsive Design

- Desktop-optimized (1280px+)
- Mobile support (future enhancement)
- Max content width: 900px (chat)
- Flexible grid layouts

## 🧪 Testing Capabilities

The architecture supports future testing with:
- Component unit tests (Jest + React Testing Library)
- Integration tests
- E2E tests (Cypress)

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This generates optimized production build in `/dist`:
- TypeScript compiled to JavaScript
- Bundled with Rollup
- CSS minified
- Assets optimized
- Source maps excluded

### Deploy to Hosting

The `/dist` folder can be deployed to:
- Vercel (recommended for React apps)
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any static hosting service

### Docker Deployment (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV VITE_API_BASE_URL=http://api:3001
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔍 Development Workflow

### Making Changes

1. **Edit component** → Changes auto-reload via HMR (Hot Module Replacement)
2. **TypeScript errors** → Visible in console instantly
3. **ESLint warnings** → Shown in editor and console
4. **Tailwind classes** → Processed on-the-fly

### Adding New Components

```bash
# Create component directory
mkdir src/components/myfeature

# Create component file
touch src/components/myfeature/MyComponent.tsx
touch src/components/myfeature/index.ts
```

### Adding New API Endpoint

```bash
# Create hook in
touch src/api/hooks/useMyEndpoint.ts

# Export from
src/api/hooks/index.ts
```

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### CORS Errors
- Verify backend allows requests from frontend origin
- Check `VITE_API_BASE_URL` in `.env`

### Tailwind Styles Not Applying
```bash
# Restart dev server
npm run dev

# Clear node_modules and reinstall
rm -rf node_modules && npm install
```

### Dark Mode Not Working
- Check if `.dark` class is on `<html>` element
- Verify Tailwind config has `darkMode: "class"`

## 📚 Documentation Files

- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Detailed setup guide
- Architecture documented in [FRONTEND_TECHNICAL_ARCHITECTURE.md](../Frontend/FRONTEND_TECHNICAL_ARCHITECTURE.md)

## 🎓 Learning Resources

- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite:** https://vitejs.dev/guide/
- **TanStack Query:** https://tanstack.com/query/latest
- **Zustand:** https://github.com/pmndrs/zustand

## ✨ Next Steps

1. ✅ **Install dependencies:** `npm install`
2. ✅ **Start dev server:** `npm run dev`
3. ✅ **Open browser:** http://localhost:5173
4. ✅ **Start chatting!** Test with your backend

## 🎉 Ready to Go!

Your QA Resume Bot frontend is now fully scaffolded and ready for development. All components follow React best practices, TypeScript strictness, and the technical architecture.

**Happy coding! 🚀**

---

For questions or issues, refer to:
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [README.md](./README.md) - Project documentation
- Source code comments and JSDoc

**Generated:** March 14, 2026 | **Frontend Version:** 1.0.0
