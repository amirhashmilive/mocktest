# Workflow & Operation Guidelines

## Development Workflow
1. **Question Generation / Updates:**
   - To update or generate question banks:
     ```bash
     node tools/generate-questions.js
     node tools/generate-questions.js --validate
     ```
2. **Pipeline Verification:**
   - Run verification tests on the 13-stage evidence engine:
     ```bash
     node tools/verify-pipeline.js
     ```
3. **Deployment Workflow:**
   - Verify local relative asset paths (`css/style.css`, `js/*.js`).
   - Ensure `.nojekyll` exists at root.
   - Git stage, commit, and push to `origin/main` for GitHub Pages automatic deployment.
