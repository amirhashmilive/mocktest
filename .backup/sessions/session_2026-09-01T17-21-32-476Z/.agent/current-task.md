# Current Task & Status

## Task: Add UGC NET as Separate Examination Category
- [x] Create `data/examination-configs/ugc-net.json` with all 83 official subjects and Paper-I/Paper-II/Full Test structure.
- [x] Separate UGC NET from "Teaching & UGC NET" — rename old category to `teaching` (CTET, TET, BPSC TRE 4.0).
- [x] Add `ugc-net` as new top-level category in `js/categories.js`.
- [x] Update `js/questionLoader.js` with teaching + ugc-net entries.
- [x] Update `tools/create-configs.js` with separate teaching and ugc-net configurations.
- [x] Rename `data/examination-configs/teaching-net.json` → `teaching.json` and rewrite without UGC NET.
- [x] Rename `data/questions/teaching-net/` → `data/questions/teaching/` and bulk-replace internal references.
- [x] Create `data/questions/ugc-net/` with 400 questions (80 per level × 5 levels) covering Paper-I topics.
- [x] Update `data/manifest.json` with teaching + ugc-net entries.
- [x] Update `test.html` category list for random/mixed tests.
- [x] Update `tools/generate-questions.js` category list.
- [x] Update agentic memory `.agent/memory.md` & `.agent/current-task.md`.
- [x] Run `tools/update-metrics.js`, backup, commit, and push.
