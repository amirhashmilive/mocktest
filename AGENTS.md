# Mockhard — Agentic Instructions & Architecture Overview

## Project Overview
Mockhard is a multi-level, examination-agnostic mock test platform covering 10 major Indian competitive examinations with 5 difficulty levels (C, B, A, A+, A++), 120 questions per test, and a 100-minute timer.

## Core Features
1. **10 Exam Categories:** UPSC, SSC, Railways, NEET, AIIMS NORCET, JEE, GATE, CLAT, Board, Defence.
2. **5 Difficulty Levels:** C (Beginner), B (Intermediate), A (Advanced), A+ (Expert), A++ (Elite).
3. **120 Questions & 100 Minutes:** Standard full test format across all exams and levels.
4. **7,260 Question Bank:** Stored as static JSON files in `data/questions/`.
5. **13-Stage Pipeline:** Evidence-driven question generation, verification, and audit engine.
6. **Agentic Memory Structure:** Persisted in `/.agent/` folder.

## File Structure
```
mocktest/
├── index.html               # Homepage with categories & level stats
├── categories.html          # Exam list with Level Selection Modal
├── test.html                # 120-question, 100-min test controller
├── results.html             # Detailed score & subject breakdown
├── dashboard.html           # History & analytics dashboard
├── random.html              # Custom mixed or single-exam practice
├── AGENTS.md                # Agent overview & guidelines
├── .nojekyll                # GitHub Pages static asset bypass
├── .agent/                  # Agentic memory files
│   ├── architecture.md
│   ├── workflow.md
│   ├── coding-rules.md
│   ├── current-task.md
│   └── memory.md
├── css/
│   └── style.css            # Unified design system
├── js/
│   ├── app.js               # Global UI utilities
│   ├── questionLoader.js    # Async JSON fetcher
│   ├── rotationEngine.js    # Rotation & usage tracking
│   ├── storage.js           # LocalStorage state management
│   ├── timer.js             # Countdown timer engine
│   ├── mainsEngine.js       # UPSC Mains descriptive test engine
│   └── stage0-dataGate.js .. stage13-audit.js
├── data/
│   ├── examination-configs/ # Exam JSON configurations (incl. upsc-mains.json)
│   ├── generation/          # Generation rules JSON
│   ├── questions/           # Question JSON files (18 cats × 5 levels)
│   │   ├── upsc/            # UPSC Prelims (10 subject subfolders)
│   │   ├── upsc-mains/      # UPSC Mains (9 paper subfolders)
│   │   └── ...              # Other categories
│   └── manifest.json        # Index of all question files
└── tools/
    ├── create-configs.js    # Generates exam configs
    ├── generate-questions.js# Generates question JSON files
    ├── generate-upsc-mains-questions.js # Generates UPSC Mains question banks
    └── verify-pipeline.js   # Pipeline test suite
```

## How to Run & Maintain
- **Test Locally:** Serve directory via any HTTP server (e.g., `python -m http.server 8000` or VS Code Live Server).
- **Validate Questions:** Run `node tools/generate-questions.js --validate`.
- **Test Pipeline:** Run `node tools/verify-pipeline.js`.
