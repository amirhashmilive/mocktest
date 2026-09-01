# Agentic Memory — Mockhard

## What Has Been Built
- **Expanded Examination Matrix:** 17 category suites: UPSC, State PSC, SSC, Railways, NEET UG, JEE Main & Advanced, CUET UG, GATE & Engineering, AIIMS NORCET, CLAT Law, Board Exams, Defence (NDA, CDS, CAPF, AFCAT, Airforce), Banking (IBPS, SBI, RBI), State Police & Specific, Foundation & Core Subjects, Teaching Exams (CTET, State TET, BPSC TRE 4.0), and **UGC NET / JRF** (dedicated category with all 83 official subjects, Paper-I & Paper-II).
- **13,660+ Question Bank:** Expanded static question banks across 85 JSON files (17 categories × 5 difficulty levels) including 400 UGC NET Paper-I questions.
- **Examination-Specific Configurations:** Updated all 16 JSON configuration files (`data/examination-configs/*.json`) with accurate paper stages, question counts, time limits, question types, and negative marking rules.
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
- **UGC NET 4-Step Subject Selection Flow:** Implemented interactive 4-step modal flow for UGC NET (`js/ugc-net.js`): 1. Searchable Subject Selection (all 83 official subjects) → 2. Level Selection (C to A++) → 3. Paper Selection (Paper-I 50Q/60m, Paper-II 100Q/120m, Full Test 150Q/180m) → 4. Timing & Subject Parameter Confirmation Card. Test header and saved results dynamically reflect the chosen subject.

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
