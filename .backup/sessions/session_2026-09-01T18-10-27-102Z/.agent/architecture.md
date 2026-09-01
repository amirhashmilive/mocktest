# System Architecture — Mockhard Question Bank Engine

## Overview
Mockhard is a client-side, examination-agnostic, evidence-driven examination and mock testing platform built with HTML5, CSS3, Vanilla JS, and static JSON assets.

## Directory Layout
- `/` — Root entry points (`index.html`, `categories.html`, `test.html`, `results.html`, `dashboard.html`, `random.html`, `AGENTS.md`, `.nojekyll`)
- `/css/` — Stylesheets (`style.css`)
- `/js/` — Client-side controllers and 13-stage pipeline engines:
  - `questionLoader.js` — Async JSON question fetcher with caching
  - `rotationEngine.js` — Question rotation and usage tracking via `localStorage`
  - `storage.js` — Persistence for test results, streaks, and in-progress states
  - `timer.js` — Countdown timer module
  - `charts.js` — Canvas chart renderers
  - `app.js` — Global app utilities and navbar
  - `stage0-dataGate.js` to `stage13-audit.js` — 13-stage question intelligence & verification pipeline
- `/data/` — Static data assets:
  - `examination-config.schema.json` — JSON schema for exam configurations
  - `examination-configs/*.json` — 10 examination configurations
  - `manifest.json` — Manifest of generated questions
  - `generation/generation-rules.json` — Stored AI question generation rules
  - `questions/{category}/level-{level}.json` — 50 JSON question bank files (10 categories × 5 levels)
- `/tools/` — Node.js CLI tools (`create-configs.js`, `generate-questions.js`, `verify-pipeline.js`)
- `/.agent/` — Agentic memory and project guidelines

## Data Flow
```
User Selection (Category + Level)
  │
  ▼
QuestionLoader.load(category, level) ──► Fetches data/questions/{cat}/level-{level}.json
  │
  ▼
RotationEngine.select(pool, 120, usedIds) ──► Filters used IDs from localStorage
  │
  ▼
test.html ──► Runs 100-minute timed 120-question test
  │
  ▼
MockStorage.saveTestResult() ──► Saves result to localStorage
  │
  ▼
results.html ──► Renders score, level badge, and subject performance breakdown
```
