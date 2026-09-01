# Current Task & Status

## Task: Remove Banking Exams, Club AIIMS Examinations, Fix Random Test
- [x] **Remove Banking Exams:**
  - Deleted `data/questions/banking/` (5 level files, ~618KB)
  - Deleted `data/examination-configs/banking.json`
  - Removed banking entry from `js/categories.js`
  - Removed `'banking'` from `test.html` random test `catsToLoad` array
- [x] **Club AIIMS & Nursing:**
  - Renamed NORCET category to "AIIMS & Nursing" in `js/categories.js` (id stays `norcet` for backward compat)
  - Updated description to include all 16 AIIMS exam types
  - Created `data/examination-configs/aiims.json` with full 16-exam registry
  - Existing `data/questions/norcet/` question bank serves all AIIMS exams
- [x] **Fix Random Test:**
  - Redesigned `random.html` with 4-step configuration:
    1. Subject Selection Dropdown (all 17 categories + "All Mixed")
    2. Difficulty Level Chips (Auto-Mix, C, B, A, A+, A++)
    3. Question Count Chips (15, 25, 50)
    4. Time Limit Chips (20, 30, 60 min)
  - Live configuration summary panel
  - Updated `test.html` `setupRandomTest()` to honor `level`, `count`, and `time` URL params
- [x] **Verification:** All scripts passed:
  - `update-metrics.js`: 18,074 Qs across 17 categories ✅
  - `validate-exam-dates.js`: 23 active future exams ✅
  - `test-selection-flow-test.js`: 0 loops across 17 categories ✅
- [x] **Git Commit & Push:** Pushed to `main`
