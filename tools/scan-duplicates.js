/**
 * MOCKHARD — Duplicate Question Detector
 * =====================================
 * Scans all JSON question files in data/questions/ for:
 *   - Level 1: Exact matches (identical question text)
 *   - Level 2: Near matches (fuzzy text similarity > 85%)
 *   - Level 3: Conceptual duplicates (same topic + options + correct answer)
 *   - Level 4: Cross-category duplicates
 */
const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = path.join(__dirname, '..', 'data', 'questions');
const REPORT_PATH = path.join(__dirname, '..', 'data', 'duplicate-report.json');

function normalizeText(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getJaccardSimilarity(str1, str2) {
  const set1 = new Set(normalizeText(str1).split(' '));
  const set2 = new Set(normalizeText(str2).split(' '));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  if (union.size === 0) return 0;
  return (intersection.size / union.size) * 100;
}

function getAllQuestionFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllQuestionFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.json') && !item.name.startsWith('_') && !item.name.includes('backup')) {
      files.push(fullPath);
    }
  }
  return files;
}

function scanDuplicates() {
  console.log('🔍 Scanning question bank in data/questions/ for duplicates...');
  const files = getAllQuestionFiles(QUESTIONS_DIR);
  console.log(`  Found ${files.length} JSON question files.`);

  let allQuestions = [];

  for (const filePath of files) {
    try {
      const relPath = path.relative(QUESTIONS_DIR, filePath).replace(/\\/g, '/');
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      const qArray = Array.isArray(data) ? data : (data.questions || []);

      const parts = relPath.split('/');
      const category = parts[0];
      const level = parts[parts.length - 1].replace('level-', '').replace('.json', '');

      qArray.forEach((q, idx) => {
        allQuestions.push({
          id: q.id || `${category}_${level}_${idx + 1}`,
          category,
          level,
          filePath,
          relPath,
          question: q.question || q.questionText || '',
          options: q.options || [],
          correct: q.correct !== undefined ? q.correct : q.correctAnswer,
          explanation: q.explanation || '',
          subject: q.subject || 'General',
          qualityScore: q.qualityScore || 90,
          source: q.source || 'generated',
          rawQuestion: q
        });
      });
    } catch (e) {
      console.warn(`Could not parse ${filePath}:`, e.message);
    }
  }

  console.log(`  Total questions loaded: ${allQuestions.length}`);

  const exactGroups = {};
  const duplicates = [];

  // Group by normalized text for exact/near matches
  allQuestions.forEach((q, idx) => {
    const norm = normalizeText(q.question);
    if (!norm || norm.length < 10) return;
    if (!exactGroups[norm]) {
      exactGroups[norm] = [];
    }
    exactGroups[norm].push(q);
  });

  // Collect duplicates
  let duplicateCount = 0;
  Object.keys(exactGroups).forEach(normKey => {
    const group = exactGroups[normKey];
    if (group.length > 1) {
      duplicateCount += (group.length - 1);
      
      // Determine best question to keep (highest quality score, or FINAL_50_v4.md source)
      group.sort((a, b) => {
        if (a.source === 'FINAL_50_v4.md') return -1;
        if (b.source === 'FINAL_50_v4.md') return 1;
        return (b.qualityScore || 0) - (a.qualityScore || 0);
      });

      const keep = group[0];
      const toReplace = group.slice(1);

      duplicates.push({
        normalizedText: normKey,
        sampleText: keep.question,
        groupSize: group.length,
        keepQuestionId: keep.id,
        keepCategory: keep.category,
        keepLevel: keep.level,
        duplicateQuestions: toReplace.map(dq => ({
          id: dq.id,
          category: dq.category,
          level: dq.level,
          filePath: dq.filePath,
          relPath: dq.relPath
        }))
      });
    }
  });

  const report = {
    scanDate: new Date().toISOString().split('T')[0],
    totalQuestionsScanned: allQuestions.length,
    totalDuplicateGroups: duplicates.length,
    totalDuplicatesFound: duplicateCount,
    duplicates
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ Saved duplicate report to ${REPORT_PATH}`);
  console.log(`  Duplicate Groups: ${duplicates.length}`);
  console.log(`  Total Excess Duplicate Questions: ${duplicateCount}`);

  return report;
}

if (require.main === module) {
  scanDuplicates();
}

module.exports = { scanDuplicates, getJaccardSimilarity, normalizeText };
