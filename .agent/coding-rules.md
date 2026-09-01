# Coding Rules & Conventions

## Principles
1. **Vanilla Architecture:** Use standard HTML, CSS, and JS. Do not introduce heavy external frameworks or build step dependencies.
2. **Relative Paths:** Always use relative paths (`css/style.css`, `js/app.js`, `data/...`) to maintain GitHub Pages compatibility.
3. **Evidence-Driven Question Pipeline:** All question generation must adhere to the 13-stage pipeline (Data Gate → Extractor → Classifier → Patterns → Prioritise → Knowledge Graph → Blueprint → Generation → Verification → Adversarial → Originality → Quality → Finalise → Audit).
4. **Offline Generation:** Question JSON files are generated offline via Node.js scripts and committed as static JSON assets.
5. **Level & Timing Standard:**
   - 5 Levels: C (Beginner), B (Intermediate), A (Advanced), A+ (Expert), A++ (Elite).
   - Test standard: 120 questions per test, 100 minutes (6000 seconds) timer.
6. **Backward Compatibility:** Maintain legacy `localStorage` keys and fallbacks in `MockStorage`.
