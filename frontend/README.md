# LLM Lab

An experimental tool for testing how LLM parameters affect response quality. Generate multiple AI responses with different temperature and top_p settings, then compare them side-by-side with quality metrics.

## What it does

- Input a prompt and set parameter ranges
- Generate responses with different parameter combinations
- Analyze responses with custom quality metrics
- Compare results visually
- Export experiments for later

## Tech

Next.js 15, React 19, TypeScript, Tailwind CSS

## Setup

**Requirements:** Node.js v24+

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm start
```

Built for the GAL Challenge
