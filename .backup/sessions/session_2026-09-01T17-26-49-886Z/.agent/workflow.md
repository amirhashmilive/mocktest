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
3. **Backup & Restore Workflow:**
   - Run session backup before/after major updates:
     ```bash
     node tools/backup.js --type=session --description="Description of update"
     ```
   - Run daily backup at end of daily session:
     ```bash
     node tools/backup.js --type=daily --description="End of day backup"
     ```
   - List and restore backups:
     ```bash
     node tools/restore.js --list
     node tools/restore.js --latest
     node tools/restore.js --backup=[backupId]
     ```
4. **Deployment Workflow:**
   - Verify local relative asset paths (`css/style.css`, `js/*.js`).
   - Ensure `.nojekyll` exists at root.
   - Run `node tools/update-metrics.js`.
   - Git stage, commit, and push to `origin/main` for GitHub Pages automatic deployment.
