# Current Task & Status

## Task: Create Separate AIIMS NORCET & AIIMS EXAMS Cards on Home Page with Full Catalogue
- [x] **Separate Home Page Cards (`index.html` & `js/categories.js`):**
  - Card 1: **AIIMS NORCET** (4 Stage Papers, `norcet`)
  - Card 2: **AIIMS EXAMS** (17 Exams, `aiims-exams`)
  - Featured list set to top 12 cards on home page grid.
- [x] **Catalogue Modal Flow (`categories.html`):**
  - Clicking "AIIMS NORCET" opens NORCET exam list (4 exams: NORCET-10 & NORCET-11 Stage I/II).
  - Clicking "AIIMS EXAMS" opens AIIMS exam list (17 exams: INI-SS, INI-CET, SRD-CET, Ph.D., Fellowship, B.Sc./M.Sc. Nursing, Allied Health, REGA-2.0, Scientist-B).
  - Select Exam $\rightarrow$ Select Level $\rightarrow$ Confirm Details $\rightarrow$ Start Test flow verified.
- [x] **Question Banks & Metrics:**
  - 38,257 total questions across 18 categories.
  - Subfolder question banks generated for all 21 AIIMS exams (200+ questions per level).
- [x] **Verification & Audit:**
  - `update-metrics.js`: 38,257 questions across 18 categories ✅
  - `validate-exam-dates.js`: 23 active future exams ✅
  - `test-selection-flow-test.js`: 0 loops across 18 categories ✅
- [x] **Git Commit & Push:** Pushed to `main`.
