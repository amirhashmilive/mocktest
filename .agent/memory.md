# Agentic Memory — Mockhard

## What Has Been Built
- **Expanded Examination Matrix:** 18 category suites: UPSC Prelims (with 10 dedicated subjects), UPSC Mains (9 papers, essay writing, descriptive answers, 48 optional subjects), State PSC, SSC, Railways, NEET UG, JEE Main & Advanced, CUET UG, GATE & Engineering, AIIMS NORCET, CLAT Law, Board Exams, Defence, Banking, State Police, Foundation, Teaching, and UGC NET / JRF.
- **18,764+ Question Bank:** Expanded static question banks across all 18 categories, UPSC Prelims 10 subjects, and UPSC Mains 9 paper subfolders across 5 difficulty levels (C, B, A, A+, A++).
- **Examination-Specific Configurations:** Updated JSON configuration files (`data/examination-configs/*.json`) including `upsc.json` and `upsc-mains.json` (9 papers, 1750 merit marks, 48 optional subjects, descriptive word limits, time limits).
- **3-Step Modal Test Flow:** 1. Select Level (C, B, A, A+, A++) → 2. Select Paper/Stage (GS Paper-I, CSAT Paper-II, Tier-I, Tier-II, etc.) → 3. Confirm Test Details Card showing Question Count, Time Limit, Question Types, and Negative Marking rules.
- **Single Source of Truth (`js/categories.js`):** Consolidated all 17 category suites with icons, descriptions, paper counts, question ranges, time limits, and negative marking rules into a central module used across all pages.
- **Random Practice Engine Redesign:** Redesigned `random.html` with subject selection dropdown (Any Subject / All Exams Mixed or any specific exam), fixed 15 Questions / 20 Minutes speed test parameters, auto-level difficulty mixing (random mix of C, B, A, A+, A++), and unique question rotation via `RotationEngine`.
- **Cache Memory & Resume:** Persistent state in `localStorage` allowing users to seamlessly resume unfinished tests or start fresh attempts.
- **Practice History Tracking:** Displayed previous random test attempts history on `random.html` showing date, subject, score out of 15, accuracy badge, and review action.
- **Synchronized Question Counters:** Fixed display bug in `test.html` where progress bar hardcoded `50` while header showed `100`. Now `totalQuestionsCountText` dynamically syncs with `questions.length` across header, progress label, percentage calculation, palette grid, and results page.
- **Automated Backup & Restore Engine:** Created `.backup-config.json`, `tools/backup.js`, and `tools/restore.js` supporting 10 daily and 10 session backups with commit metadata and automated cleanup.
- **Scope Enforcement Rules:** Updated `.agent/coding-rules.md` and `.agent/workflow.md` to strictly restrict agent operation to `D:\DRIVE (Ai) Agents\00 Projects\mocktest` and GitHub repo `https://github.com/amirhashmilive/mocktest`, with instant prompt rejection for out-of-scope requests.
- **PWA & Offline Mode:** Added `manifest.json` and `sw.js` (Service Worker) caching core application assets, question banks, styles, and scripts for offline test-taking.
- **Test Keyboard Shortcuts Engine (`js/keyboardShortcuts.js`):** Enabled full keyboard test navigation (`1-4` for Options A-D, `N`/`→` Next, `P`/`←` Previous, `M` Bookmark, `S` Submit, `R` Reset, `F` Fullscreen, `T` Timer, `Q` Palette, `H` Shortcuts Help Overlay, `Escape` Modal Close, `Ctrl+D` Certificate Download).
- **Custom Test Builder (`custom-test.html`):** Created custom mock test builder supporting multi-category subject selection, difficulty tiers (C to A++), question count (10 to 120), and custom time limits (15 to 120 mins).
- **PDF Certificate Generator (`js/pdfGenerator.js`):** HTML5 Canvas certificate renderer generating official performance certificates with candidate name, score, accuracy %, level, date, and verified badge.
- **Smart AI Recommendations & Data Backup (`js/recommendations.js` & `js/exportImport.js`):** Added weak area diagnostic recommendation cards on `dashboard.html` and JSON export/import for user data backup.
- **Evidence-Driven Question Generation Enforcement Engine (`js/evidenceEngine.js` & `tools/enforce-generation.js`):** Enforces 13-stage pipeline compliance across all tests with 1.4× candidate generation buffer, minimum quality score of 85, discrimination targets, source verification, adversarial review, originality checks, and blind key audits.
- **FINAL_50_v4.md Integration into UPSC A++:** Parsed 49 high-yield evidence-driven questions from `FINAL_50_v4.md` and prepended them as the FIRST questions in `data/questions/upsc/level-Aplusplus.json` and `levelA++.json`. Updated `RotationEngine.select` to prioritize evidence-driven questions when available.
- **Duplicate Question Detection & Evidence Replacement (`tools/scan-duplicates.js` & `tools/replace-duplicates.js`):** Built duplicate scanner and replacer. Scanned 25,572 questions across 186 files, detected 22,346 duplicates across categories/levels, replaced all duplicate slots with unique evidence-driven questions, generated `data/duplicate-report.json` and `data/replacement-log.json`, and verified 0 remaining duplicates.
- **Automated Home Page Statistics Update Engine (`tools/update-metrics.js` & `js/app.js`):** Enforced dynamic loading of `data/metrics.json` via `MockApp.loadMetrics()` on `index.html` with animated countup, automatically synced stat counters (`18,764 Questions`, `18 Categories`), and integrated auto-triggering of `tools/update-metrics.js` across all question generation and modification scripts.
- **Live Examination Updates System (`data/exam-updates.json`, `tools/update-exam-dates.js` & `.github/workflows/update-exams.yml`):** Created 8-card live examination updates section on `index.html` featuring official schedules (UPSC, State PSCs, SSC, Railways, NEET, JEE, UGC NET, GATE), specialized State PSC modal for 20+ state portals, official verification disclaimer box, and automated daily GitHub Actions synchronization.
- **NORCET Test Fix & 18-Category Audit (`data/examination-configs/norcet.json`, `test.html` & `tools/ensure-question-bank-capacity.js`):** Fixed AIIMS NORCET test configuration with complete 5-section specification (100 Qs, 90 mins, -0.33 negative marking). Updated `test.html` to render section indicators (Section 1-5). Built capacity guard script replenishing low-count question files to ≥100 Qs per level. Audited all 18 exam categories and verified 🟢 Operational status across all tests.
- **Infinite Loop Fix & State Management (`categories.html`, `js/testFlow.js` & `tools/test-selection-flow-test.js`):** Eliminated circular invocation between `levelModal` and `paperModal` by building `js/testFlow.js` and updating `categories.html` flow logic. Standard exams now route directly from paper selection to `openTimingModal()` (confirmation card). Added `closeAllModals()`, backdrop click, and Escape key listeners. Verified 0 loops across all 18 categories via `tools/test-selection-flow-test.js`.

## What Works
- Static JSON fetching via `QuestionLoader.load(category, level)`.
- Question rotation via `RotationEngine.select()` and `localStorage` tracking.
- Test controller in `test.html` with auto-save and keyboard shortcuts.
- Results analysis in `results.html` with subject accuracy breakdown table.
- Dashboard analytics and trend charts.

## Known Gotchas & Best Practices
- GitHub Pages requires `.nojekyll` file at root to serve nested `data/` JSON directories.
- All HTML asset references (`href`, `src`) must remain relative (`css/style.css`, `js/app.js`).
- `level` strings use `Aplus` and `Aplusplus` in filenames (`level-Aplus.json`) and `A+`, `A++` in display UI.

## Next Steps / Future Enhancements
- Periodically expand question bank seed topics using `tools/generate-questions.js`.
- Add export/download feature for audit reports generated by `stage13-audit.js`.
