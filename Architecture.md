# Architecture Documentation

This document provides technical guidance for developers working with code in this repository.

## Project Overview

**LLM Lab** - An experimental tool for testing how LLM parameters (temperature, top_p) affect response quality. Built for the GAL Challenge to provide side-by-side comparison of AI responses with custom quality metrics.

**Monorepo Structure:**
- `frontend/` - Next.js 15 app with React 19
- `backend/` - Express.js backend with Prisma ORM

---

## Frontend Development

### Tech Stack
- **Framework:** Next.js 15 (App Router) with React 19
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 3.4 with custom animations
- **UI Components:** Radix UI primitives (dialog, toast, tooltip, slot)
- **Fonts:** Geist Sans/Mono (primary), EB Garamond (serif accents)
- **Icons:** react-icons
- **Notifications:** Sonner toast library
- **State Management:** TanStack Query (React Query) for server state
- **Data Fetching:** Native fetch with Next.js API routes as proxies

### Common Commands

```bash
# Frontend development
cd frontend
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking without emit
```

**Requirements:** Node.js v24+

### Architecture & Code Organization

**Component Structure:**
```
src/components/
├── layout/              # Navbar, Footer - shared layout components
├── landing/             # Landing page hero section and history preview
├── Main/                # Main experiment interface
│   ├── ParameterControls/  # Parameter sliders and controls
│   └── ResponseResults/    # Response cards, metrics display, quality bars
├── providers/           # React context providers
└── ui/                  # Radix-based UI primitives
```

**App Router:**
- `src/app/page.tsx` - Main landing page with hero section
- `src/app/experiments/page.tsx` - Experiment history table
- `src/app/experiment/[id]/page.tsx` - Individual experiment detail view
- `src/app/layout.tsx` - Root layout with font configuration
- `src/app/not-found.tsx` - 404 page
- `src/app/api/*/route.ts` - API proxy routes to backend

**State Management:**
- `SessionContext` - Global session management with UUID generation
- TanStack Query hooks in `src/hooks/`:
  - `useSession` - Session creation and validation
  - `useExperiments` - Experiment mutations and queries
  - `useExport` - Export functionality for JSON/CSV/Markdown

**Custom Tailwind Configuration:**
- Custom animations: `shimmer`, `float`, `float-delayed`, `float-slow`, `float-diagonal`
- Custom color system with CSS variables for theme tokens
- Custom gradients via CSS variables (gradient-primary, gradient-accent, etc.)
- Custom shadows: `cyber`, `neon`, `card`, `glow`
- Font families pre-configured with CSS variable fallbacks

**Design System Notes:**
- Landing page uses premium design with blue gradient backgrounds
- Hero section features floating SVG artifacts (neural network, wrench, flask, gear)
- Primary CTA button has shimmer effect and blurred border overlay
- Typography uses serif (EB Garamond) for headlines, sans (Geist) for body
- Response cards display quality metrics with color-coded bars
- Metrics breakdown shows detailed scores with tooltips

### Key Patterns

**Component Imports:**
- Use `@/` path alias for imports (maps to `src/`)
- UI components from `@/components/ui/`
- Layout components from `@/components/layout/`

**Styling Conventions:**
- Tailwind utility classes preferred over CSS modules
- Use `cn()` helper from `lib/utils` for conditional classes
- Custom animations defined in `tailwind.config.ts` keyframes section

**Accessibility:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- WCAG AA contrast ratios
- Screen reader tested

---

## Backend Development

### Architecture Pattern

**Clean Separation:**
```
routes/ → controllers/ → services/ → database
```

Following clean architecture with:
- `server.service.ts` - Main server orchestration
- `app.ts` - Express app configuration
- Centralized error handling with Pino logging
- Type-safe API responses via `apiResponse.ts` utility
- Context-aware structured logging
- Rate limiting (100 req/15min per IP)

### Tech Stack (Backend)
- **Runtime:** Node.js 24+ with TypeScript (ESM modules)
- **Framework:** Express.js
- **Database:** SQLite with Prisma ORM
- **AI SDK:** Vercel AI SDK (`ai` package) with **Mistral AI provider**
- **Logger:** Pino with pino-pretty
- **Validation:** env-var for environment config, Zod for request validation
- **Development:** tsx for hot reload
- **Deployment:** Docker + Fly.io

### Common Commands

```bash
# Backend development
cd backend
npm install              # Install dependencies (auto-runs prisma generate)
npm run dev              # Start dev server with hot reload (http://localhost:5001)
npm run build            # Compile TypeScript to dist/
npm run start            # Run compiled JS (for local prod testing)
npm run start:prod       # Production start
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking without emit
npx prisma generate      # Regenerate Prisma client after schema changes
npx prisma migrate dev   # Create and apply database migrations
npx prisma studio        # Open Prisma Studio GUI for database inspection
```

**Requirements:** Node.js v24+

### Core Backend Services

**LLMService** (`src/services/LLMService.ts`)
- Integrates Vercel AI SDK with Mistral AI provider
- `generateResponse()` - Single LLM generation with token usage tracking
- `generateBatch()` - Multiple responses with different parameter combinations
- Supports temperature, top_p, max_tokens, top_k, frequency_penalty parameters
- Tracks latency and token usage for each generation

**MetricsService** (`src/services/MetricsService.ts`)
- **Programmatic metrics only - NO LLM-based evaluation**
- Categories: Length, Coherence, Structural, Completeness, Readability
- Metrics breakdown:
  - **Length:** Word count, sentence count, avg words per sentence
  - **Coherence:** Vocabulary richness (unique/total words), sentence variety (stddev)
  - **Structure:** Paragraph count, intro/conclusion detection, list presence
  - **Readability:** Flesch Reading Ease score, avg syllables per word
  - **Completeness:** Proper endings, no mid-sentence cutoffs
  - **Specificity:** Concrete word usage, detail markers
- Overall score uses weighted formula: coherence 30%, structure 25%, completeness 25%, readability 20%

**SessionService** (`src/services/SessionService.ts`)
- Anonymous session management via UUID
- Frontend generates session ID → stores in localStorage
- Backend validates format via `X-Session-ID` header
- No database lookup required - ID used for filtering only
- Privacy-first design - no user accounts or tracking

**ExperimentService** (`src/services/ExperimentService.ts`)
- Database operations for experiments and responses
- Session-based filtering for user privacy
- Supports pagination and sorting
- Export functionality for JSON/CSV/Markdown formats

### Database Schema (Prisma + SQLite)

**Models:**
- `Session` - Stores session UUID and creation timestamp
- `Experiment` - Stores prompt, session ID, and metadata
- `Response` - Stores LLM output, parameters, metrics, token usage

**Relationships:**
- Session → many Experiments
- Experiment → many Responses (typically 2-4 parameter variations)

**Why SQLite?**
- Single file database - easy deployment
- No external server needed
- Fast for read-heavy workloads
- Portable backups
- Perfect for single-instance deployments

### API Routes

- `POST /api/session/create` - Create new anonymous session
- `POST /api/experiments` - Create experiment with multiple LLM responses
- `GET /api/experiments/history` - User's experiment history (session-filtered)
- `GET /api/experiments/:id` - Get specific experiment with all responses
- `POST /api/export/:experimentId` - Export experiment data (supports ?format=json|csv|markdown)
- `GET /health` - Health check endpoint

**Request/Response Pattern:**
- Standardized API responses via `ApiResponseHandler`
- All responses include `success`, `data`, `timestamp`
- Error responses include `error` message with status codes
- Session ID passed via `X-Session-ID` header

### Environment Variables (Backend)

Required:
```bash
NODE_ENV=development
PORT=5001
DATABASE_URL="file:./llmlab.db"
MISTRAL_API_KEY=your_key_here
DEFAULT_MODEL=mistral-small-latest
CORS_ORIGIN=http://localhost:3000
```

Optional:
```bash
LOG_LEVEL=info
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### Error Handling & Logging

- Global error handler middleware catches all unhandled errors
- `asyncHandler` wrapper for route handlers prevents uncaught promise rejections
- Pino structured logging with context (e.g., `createLogger('LLMService')`)
- Log format: `logger.info({ model, temperature }, 'Generating response')`
- Error logs include stack traces in development, sanitized in production

### Frontend-Backend Integration

**Next.js API Routes as Simple Proxies:**
- `frontend/src/app/api/experiments/route.ts` → `backend/api/experiments`
- **No data manipulation** in proxy layer
- Forwards `X-Session-ID` header to backend
- Returns backend response verbatim
- Handles CORS and authentication transparently

---

## Development Workflow

### Starting from Scratch

Full stack development:
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

### Type Checking

Both frontend and backend use `tsc --noEmit` for type checking:
```bash
npm run typecheck
```

### Database Migrations (Backend)

```bash
cd backend
npx prisma migrate dev --name init    # Create migration
npx prisma generate                    # Generate Prisma client
npx prisma studio                      # View data in browser
```

---

## Important Implementation Details

### Quality Metrics Implementation

**All metrics are programmatic** - no LLM calls for evaluation to keep costs low and responses fast.

**Scoring System:**
- Each metric normalized to 0-100 scale
- Overall score is weighted average
- Color-coded display: green (80+), yellow (60-79), red (<60)
- Tooltips explain each metric's meaning

### Session Management Strategy

- **Anonymous by design** - no user accounts
- UUID generated client-side on first visit
- Stored in localStorage (survives page refresh)
- Sent via `X-Session-ID` header with every request
- Backend uses ID to filter experiments - no DB lookup needed
- Export feature allows users to backup data before clearing browser storage

### AI SDK Integration

- Uses Vercel AI SDK for unified LLM interface
- Primary provider: Mistral AI (mistral-small-latest for free tier)
- Uses `generateText()` for non-streaming responses
- Tracks token usage and latency for each generation
- Parameter controls: temperature, top_p, max_tokens, top_k, frequency_penalty

### Parameter Exploration UX

- Dual-range sliders for A/B testing parameters
- Preset configurations for common use cases
- Side-by-side response comparison
- Real-time metrics calculation
- Export results for further analysis

---

## Testing Strategy

### Frontend Testing
- Manual QA on Chrome, Firefox, Safari
- Mobile responsive testing (<768px, 768-1024px, 1024px+)
- Keyboard navigation testing
- Screen reader compatibility (VoiceOver, NVDA)
- Parameter validation edge cases

### Backend Testing
- Health check endpoint verification
- Rate limiting functionality
- Database migration rollback safety
- Error handling for invalid requests
- Token usage tracking accuracy

---

## Deployment

**Frontend (Vercel):**
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- `NEXT_PUBLIC_BACKEND_URL` required for API proxy
- Build command: `npm run build`
- Output directory: `.next`

**Backend (Fly.io):**
- Dockerfile included for containerization
- SQLite file persistence via volume mount
- Set `DATABASE_URL` to `/data/llmlab.db`
- Configure `CORS_ORIGIN` to match frontend domain
- Rate limiting enabled by default (100 req/15min per IP)
- Health check: `GET /health`
- Start script handles Prisma migrations automatically

---

## Code Quality Standards

- **TypeScript:** Strict mode enabled, no `any` types
- **ESLint:** Enforced on all commits
- **Formatting:** Prettier with 2-space indentation
- **Naming:** camelCase for variables/functions, PascalCase for components/classes
- **Comments:** JSDoc for public APIs, inline for complex logic
- **Testing:** Manual QA required before merging to main

---

## Performance Considerations

- TanStack Query caching reduces redundant API calls
- SQLite indexes on session_id and created_at for fast queries
- Metrics calculated synchronously (sub-10ms per response)
- Rate limiting prevents abuse and ensures fair usage
- Frontend code splitting via Next.js automatic optimization

---

## Security & Privacy

- No user authentication required (anonymous by design)
- Session IDs are UUIDs (no PII)
- CORS restricted to frontend domain
- Rate limiting prevents DoS attacks
- Input validation on all API endpoints
- No sensitive data logged
- Export functionality allows users to own their data

---

## References

- Challenge document: `GAL Challenge - AI Response Quality Analyzer.pdf`
- Project estimates: `project-estimates.csv`
- Frontend README: `frontend/README.md`
- Backend README: `backend/README.md`
