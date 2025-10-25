# LLM Lab Backend

API server for the LLM Lab experiment tool. Handles session management, LLM response generation, quality metrics calculation, and data persistence.

## What it does (will do)

**Implemented:**
- ✅ Anonymous session management
- ✅ SQLite database with Prisma ORM
- ✅ Health check endpoint
- ✅ Structured logging with Pino
- ✅ Type-safe environment config

**Coming soon:**
- Generate multiple LLM responses with different parameters
- Calculate quality metrics (length, coherence, structure, completeness, readability)
- Store experiments and responses in database
- Export experiments to JSON/CSV
- Session-based data filtering

## Tech

Node.js 24+, TypeScript, Express.js, Prisma, SQLite, Pino, Mistral AI SDK

## Setup

**Requirements:** Node.js v24+

```bash
# Install dependencies (auto-runs prisma generate)
npm install

# Create .env file
cp .env.example .env

# Add your Mistral API key to .env
MISTRAL_API_KEY=your_key_here

# Run database migrations
npx prisma migrate dev

# Start dev server with hot reload
npm run dev
```

Server runs on http://localhost:5001

## Database

```bash
# Create migration after schema changes
npx prisma migrate dev --name migration_name

# Regenerate Prisma client
npx prisma generate

# View database in GUI
npx prisma studio
```

## API Endpoints

**Sessions:**
- `POST /api/session/create` - Create new session
- `GET /api/session/validate/:id` - Validate session

**Health:**
- `GET /health` - Health check

**Coming soon:**
- `POST /api/experiments` - Create experiment with responses
- `GET /api/experiments/history` - Get user's experiments
- `GET /api/experiments/:id` - Get specific experiment
- `POST /api/export/:id` - Export experiment data

## Build

```bash
# Compile TypeScript
npm run build

# Run production build
npm run start:prod
```

Built for the GAL Challenge
