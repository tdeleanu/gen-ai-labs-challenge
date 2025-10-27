# LLM Lab

**GAL Challenge Submission**

This project implements an experimental tool for analyzing how LLM parameters (temperature, top_p) affect response quality. Users can set parameter ranges, generate multiple AI responses with different configurations, and compare results using programmatic quality metrics.

## What This Does

A full-stack app that:
- Takes your prompt and parameter ranges (temperature, top_p, max tokens)
- Generates 4 different AI responses using random combinations
- Shows them side-by-side in a 2x2 grid with quality scores
- Helps you figure out which settings work best

Stack: Next.js 15, Express.js, Mistral AI, SQLite.

## How It Works

Pretty straightforward:
1. Set your parameter ranges with sliders
2. Backend picks 4 random combinations within those ranges
3. Hits Mistral API in parallel for all responses at once
4. Calculates quality scores using algorithms (no AI-judging-AI here)
5. Shows everything side-by-side so you can compare

## Quality Metrics

All metrics are programmatic—no LLM calls, just math. Each response gets scored on:

- **Length** - Word/sentence counts, how much meat there is
- **Coherence** - Vocabulary richness, sentence variety
- **Structure** - Paragraphs, has intro/conclusion, uses lists
- **Completeness** - Ends properly, no weird cutoffs

Scores are normalized to 0-1 and averaged with weights.

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, TanStack Query, Tailwind CSS
**Backend:** Express.js, TypeScript, Prisma, SQLite, Vercel AI SDK
**AI:** Mistral AI (`mistral-small-latest`)

## Project Organization

This is structured as a monorepo (sort of) with frontend and backend in separate folders. Makes it faster to navigate and easier to read during development.

```
gal-challenge-local/
├── frontend/          # Next.js app
├── backend/           # Express API
└── README.md          # You are here
```

**Note:** In a real production scenario, these would be two separate GitHub repos with their own CI/CD pipelines. Combined them here for the challenge to move faster and keep things simple.

## Getting Started

Setup instructions are in each folder:
- **Frontend setup:** `frontend/README.md`
- **Backend setup:** `backend/README.md`

## Design Choices

**Anonymous Sessions** - No login needed, just a UUID in localStorage. Privacy-first.

**Programmatic Metrics** - Fast and free. Using algorithms instead of another LLM call keeps costs down.

**Parallel Generation** - All 4 responses at once. Takes ~8 seconds instead of 30+.

**SQLite** - Single file database. Simple, portable, no server setup needed.

**Next.js Proxy Layer** - Frontend never talks to backend directly. Cleaner architecture.

## LLM Parameters

Originally planned to include `presencePenalty` and `frequencyPenalty` for fine-tuning repetition. Turns out Mistral's free model doesn't support them—the API just ignores them and throws warnings.

So the app sticks to what works: **temperature**, **top_p**, and **max tokens**.

## Demo Video

 https://youtu.be/KLRNkOMLWUQ

---

Built for the GAL Challenge.
