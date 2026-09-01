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

## SCOPE ENFORCEMENT

### Allowed Scope
- Project: Mockhard Website
- Local Folder: D:\DRIVE (Ai) Agents\00 Projects\mocktest
- GitHub Repo: https://github.com/amirhashmilive/mocktest
- Files: Any file within the mocktest folder

### Rejection Rules
The agent MUST reject any prompt that:
1. References a different project or website
2. References a different local folder
3. References a different GitHub repository
4. Is unrelated to the mocktest/Mockhard project
5. Attempts to modify files outside the mocktest folder

### Rejection Response
Always respond with a clear rejection message explaining why the prompt was rejected:

❌ PROMPT REJECTED

Reason: This prompt is not related to the Mockhard website project.

Scope: I am only authorized to work on the Mockhard website
at: D:\DRIVE (Ai) Agents\00 Projects\mocktest
Repo: https://github.com/amirhashmilive/mocktest

Please provide a prompt related to the Mockhard website project.
