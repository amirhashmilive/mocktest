#!/usr/bin/env node
/**
 * tools/audit-questions.js
 * ────────────────────────────────────────────────────────────────────
 * End-to-End Question Bank Quality Audit & Standardization Tool
 * 
 * Scans every JSON question file in data/questions/, performs
 * automated quality checks, and generates a comprehensive audit report.
 * 
 * Usage:
 *   node tools/audit-questions.js              # Full audit + report
 *   node tools/audit-questions.js --fix        # Audit + auto-fix issues
 *   node tools/audit-questions.js --report     # Audit + save JSON report
 * ────────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data', 'questions');
const REPORT_FILE = path.resolve(__dirname, '..', 'data', 'audit-report.json');
const LEVELS = ['C', 'B', 'A', 'A+', 'A++'];
const LEVEL_FILE_MAP = { 'C': 'level-C', 'B': 'level-B', 'A': 'level-A', 'A+': 'level-Aplus', 'A++': 'level-Aplusplus' };
const FIX_MODE = process.argv.includes('--fix');
const REPORT_MODE = process.argv.includes('--report') || true; // always generate

// ─── Known metadata prefix patterns to clean ───────────────────────
const METADATA_PATTERNS = [
  /^\[.*?\]\s*/,                                       // [Paper II ...], [Subject Knowledge]
  /^Question\s+\d+\s*[—–-]\s*.+?examination\.?\s*/gi,  // Question 28 — intermediate level question...
  /^In the context of\s+\w[\w\s]*\([\w+]+\s+level\),?\s*/i, // "In the context of Economy (C level),"
  /^Regarding\s+/i,                                     // "Regarding Which body..." → awkward phrasing
];

// ─── Expected difficulty ranges per level ───────────────────────────
const EXPECTED_DIFFICULTY = {
  'C':   { min: 1, max: 3 },
  'B':   { min: 2, max: 4 },
  'A':   { min: 3, max: 6 },
  'A+':  { min: 5, max: 8 },
  'A++': { min: 7, max: 10 },
};

// ─── Audit result containers ────────────────────────────────────────
const auditResults = {
  auditDate: new Date().toISOString().slice(0, 10),
  totalQuestions: 0,
  totalFiles: 0,
  categories: {},
  globalIssues: [],
  duplicates: [],
  summary: {
    totalIssues: 0,
    criticalIssues: 0,
    majorIssues: 0,
    minorIssues: 0,
    autoFixed: 0,
    passed: 0,
  },
};

const allQuestionTexts = new Map(); // for duplicate detection: text → [{cat, level, id}]
let filesModified = 0;

// ─── Helpers ────────────────────────────────────────────────────────

function loadJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function saveJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function severity(type) {
  const critical = ['missing_question', 'missing_options', 'invalid_correct', 'empty_bank', 'no_options_array'];
  const major = ['missing_explanation', 'duplicate', 'metadata_prefix', 'too_few_options', 'question_too_short', 'options_identical'];
  if (critical.includes(type)) return 'critical';
  if (major.includes(type)) return 'major';
  return 'minor';
}

// ─── Core Audit Functions ──────────────────────────────────────────

function auditQuestion(q, cat, level, idx, issues) {
  const qid = q.id || `${cat}_${level}_${idx}`;

  // 1. Missing question text
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length === 0) {
    issues.push({ id: qid, type: 'missing_question', severity: 'critical', detail: 'Question text is empty or missing.' });
    return;
  }

  // 2. Question too short (< 15 chars)
  if (q.question.trim().length < 15) {
    issues.push({ id: qid, type: 'question_too_short', severity: 'major', detail: `Question text is only ${q.question.trim().length} chars.` });
  }

  // 3. Options validation
  if (!Array.isArray(q.options)) {
    issues.push({ id: qid, type: 'no_options_array', severity: 'critical', detail: 'options field is not an array.' });
    return;
  }
  if (q.options.length < 2) {
    issues.push({ id: qid, type: 'too_few_options', severity: 'major', detail: `Only ${q.options.length} option(s).` });
  }

  // 4. Correct answer validation
  if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) {
    issues.push({ id: qid, type: 'invalid_correct', severity: 'critical', detail: `correct=${q.correct} but ${q.options.length} options exist.` });
  }

  // 5. Duplicate / identical options within the same question
  const uniqueOpts = new Set(q.options.map(o => (o || '').trim().toLowerCase()));
  if (uniqueOpts.size < q.options.length) {
    issues.push({ id: qid, type: 'options_identical', severity: 'major', detail: 'Two or more options are identical.' });
  }

  // 6. Missing explanation
  if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length < 5) {
    issues.push({ id: qid, type: 'missing_explanation', severity: 'major', detail: 'Explanation is missing or too short.' });
  }

  // 7. Metadata prefix in question text
  for (const pat of METADATA_PATTERNS) {
    if (pat.test(q.question)) {
      issues.push({ id: qid, type: 'metadata_prefix', severity: 'major', detail: `Question still contains metadata prefix: ${q.question.slice(0, 80)}` });
      break;
    }
  }

  // 8. Level mismatch (difficulty field vs level)
  if (typeof q.difficulty === 'number') {
    const expected = EXPECTED_DIFFICULTY[level];
    if (expected && (q.difficulty < expected.min - 1 || q.difficulty > expected.max + 1)) {
      issues.push({ id: qid, type: 'difficulty_mismatch', severity: 'minor', detail: `difficulty=${q.difficulty} but level=${level} expects ${expected.min}-${expected.max}.` });
    }
  }

  // 9. Missing ID
  if (!q.id || typeof q.id !== 'string') {
    issues.push({ id: qid, type: 'missing_id', severity: 'minor', detail: 'Question has no id field.' });
  }

  // 10. Missing subject
  if (!q.subject || typeof q.subject !== 'string' || q.subject.trim().length === 0) {
    issues.push({ id: qid, type: 'missing_subject', severity: 'minor', detail: 'Subject field is empty.' });
  }

  // 11. Duplicate detection (global)
  const normText = q.question.trim().toLowerCase().replace(/\s+/g, ' ');
  if (allQuestionTexts.has(normText)) {
    const prev = allQuestionTexts.get(normText);
    auditResults.duplicates.push({ questionText: q.question.slice(0, 120), locations: [...prev, { cat, level, id: qid }] });
    issues.push({ id: qid, type: 'duplicate', severity: 'major', detail: `Duplicate of ${prev[0].cat}/${prev[0].level} (${prev[0].id})` });
  } else {
    allQuestionTexts.set(normText, [{ cat, level, id: qid }]);
  }
}

function autoFixQuestion(q, cat, level) {
  let fixed = false;

  // Fix metadata prefixes
  let cleanText = q.question;
  for (const pat of METADATA_PATTERNS) {
    const before = cleanText;
    cleanText = cleanText.replace(pat, '');
    if (cleanText !== before) fixed = true;
  }
  // Capitalize first letter if needed
  if (cleanText.length > 0 && cleanText[0] !== cleanText[0].toUpperCase()) {
    cleanText = cleanText[0].toUpperCase() + cleanText.slice(1);
    fixed = true;
  }
  if (fixed) q.question = cleanText;

  // Ensure level field matches file
  if (q.level !== level) {
    q.level = level;
    fixed = true;
  }

  // Ensure id exists
  if (!q.id) {
    q.id = `${cat}_${(q.subject || 'general').toLowerCase().replace(/\s+/g, '')}_${level.toLowerCase().replace('+', 'plus')}_${Math.floor(Math.random() * 9000 + 1000)}`;
    fixed = true;
  }

  return fixed;
}

// ─── Main Audit Loop ───────────────────────────────────────────────

function runAudit() {
  const categories = fs.readdirSync(DATA_DIR).filter(d => fs.statSync(path.join(DATA_DIR, d)).isDirectory());

  console.log(`\n🔍 MOCKHARD QUESTION BANK AUDIT`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`📂 Scanning ${categories.length} categories in ${DATA_DIR}\n`);

  for (const cat of categories) {
    const catDir = path.join(DATA_DIR, cat);
    const catResult = { total: 0, levels: {}, issues: [], subjects: new Set() };

    for (const level of LEVELS) {
      const fileKey = LEVEL_FILE_MAP[level];
      const filepath = path.join(catDir, `${fileKey}.json`);

      if (!fs.existsSync(filepath)) {
        catResult.issues.push({ id: `${cat}_${level}`, type: 'empty_bank', severity: 'critical', detail: `File ${fileKey}.json missing.` });
        catResult.levels[level] = { count: 0, issues: 1, passed: 0, fileSize: 0 };
        continue;
      }

      const questions = loadJSON(filepath);
      if (!questions || !Array.isArray(questions)) {
        catResult.issues.push({ id: `${cat}_${level}`, type: 'empty_bank', severity: 'critical', detail: `File ${fileKey}.json is invalid JSON or not an array.` });
        catResult.levels[level] = { count: 0, issues: 1, passed: 0, fileSize: 0 };
        continue;
      }

      const levelIssues = [];
      let autoFixCount = 0;

      questions.forEach((q, idx) => {
        auditQuestion(q, cat, level, idx, levelIssues);
        if (q.subject) catResult.subjects.add(q.subject);

        if (FIX_MODE) {
          if (autoFixQuestion(q, cat, level)) autoFixCount++;
        }
      });

      if (FIX_MODE && autoFixCount > 0) {
        saveJSON(filepath, questions);
        filesModified++;
        auditResults.summary.autoFixed += autoFixCount;
      }

      const issueCount = levelIssues.length;
      catResult.levels[level] = {
        count: questions.length,
        issues: issueCount,
        passed: questions.length - issueCount,
        fileSize: fs.statSync(filepath).size,
      };
      catResult.total += questions.length;
      catResult.issues.push(...levelIssues);
      auditResults.totalFiles++;
    }

    // Convert subjects Set to array for JSON
    catResult.subjectList = [...catResult.subjects];
    delete catResult.subjects;

    auditResults.categories[cat] = catResult;
    auditResults.totalQuestions += catResult.total;

    // Print category summary
    const issueCount = catResult.issues.length;
    const icon = issueCount === 0 ? '✅' : issueCount < 10 ? '⚠️' : '❌';
    console.log(`  ${icon} ${cat.padEnd(16)} ${String(catResult.total).padStart(5)} questions, ${String(issueCount).padStart(3)} issues`);
    for (const level of LEVELS) {
      const lv = catResult.levels[level];
      if (lv) {
        const lvIcon = lv.issues === 0 ? '  ✓' : ` ⚠${lv.issues}`;
        console.log(`      ${level.padEnd(4)} ${String(lv.count).padStart(4)} Qs ${lvIcon}`);
      }
    }
  }

  // ─── Summary ───────────────────────────────────────────────────
  let totalIssues = 0, critical = 0, major = 0, minor = 0;
  for (const cat of Object.values(auditResults.categories)) {
    for (const issue of cat.issues) {
      totalIssues++;
      const sev = severity(issue.type);
      if (sev === 'critical') critical++;
      else if (sev === 'major') major++;
      else minor++;
    }
  }

  auditResults.summary.totalIssues = totalIssues;
  auditResults.summary.criticalIssues = critical;
  auditResults.summary.majorIssues = major;
  auditResults.summary.minorIssues = minor;
  auditResults.summary.passed = auditResults.totalQuestions - totalIssues;
  auditResults.summary.duplicateGroups = auditResults.duplicates.length;

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📊 AUDIT SUMMARY`);
  console.log(`${'─'.repeat(60)}`);
  console.log(`  Total Questions:    ${auditResults.totalQuestions.toLocaleString()}`);
  console.log(`  Total Files:        ${auditResults.totalFiles}`);
  console.log(`  Categories:         ${Object.keys(auditResults.categories).length}`);
  console.log(`  ──────────────────────────────`);
  console.log(`  ✅ Passed:           ${auditResults.summary.passed.toLocaleString()}`);
  console.log(`  ❌ Total Issues:     ${totalIssues}`);
  console.log(`     🔴 Critical:      ${critical}`);
  console.log(`     🟠 Major:         ${major}`);
  console.log(`     🟡 Minor:         ${minor}`);
  console.log(`  🔄 Duplicate Groups: ${auditResults.duplicates.length}`);

  if (FIX_MODE) {
    console.log(`  🔧 Auto-Fixed:       ${auditResults.summary.autoFixed} questions in ${filesModified} files`);
  }

  // ─── Issue Breakdown ──────────────────────────────────────────
  const issueCounts = {};
  for (const cat of Object.values(auditResults.categories)) {
    for (const issue of cat.issues) {
      issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
    }
  }
  if (Object.keys(issueCounts).length > 0) {
    console.log(`\n  📋 ISSUE TYPE BREAKDOWN:`);
    for (const [type, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`     ${severity(type) === 'critical' ? '🔴' : severity(type) === 'major' ? '🟠' : '🟡'} ${type.padEnd(25)} ${count}`);
    }
  }

  // ─── Per-Level Summary ────────────────────────────────────────
  console.log(`\n  📊 PER-LEVEL TOTALS:`);
  for (const level of LEVELS) {
    let count = 0;
    for (const cat of Object.values(auditResults.categories)) {
      if (cat.levels[level]) count += cat.levels[level].count;
    }
    console.log(`     ${level.padEnd(4)}  ${String(count).padStart(5)} questions`);
  }

  // ─── Top Duplicate Samples ──────────────────────────────────
  if (auditResults.duplicates.length > 0) {
    console.log(`\n  🔄 DUPLICATE SAMPLES (first 10):`);
    for (const dup of auditResults.duplicates.slice(0, 10)) {
      console.log(`     "${dup.questionText.slice(0, 80)}..."`);
      for (const loc of dup.locations) {
        console.log(`       → ${loc.cat}/${loc.level} (${loc.id})`);
      }
    }
  }

  // ─── Save Report ──────────────────────────────────────────────
  // Trim large issue arrays for the JSON report (keep first 50 per cat)
  const reportCopy = JSON.parse(JSON.stringify(auditResults));
  for (const cat of Object.values(reportCopy.categories)) {
    if (cat.issues.length > 50) {
      cat.issuesTruncated = cat.issues.length;
      cat.issues = cat.issues.slice(0, 50);
    }
  }
  if (reportCopy.duplicates.length > 50) {
    reportCopy.duplicatesTruncated = reportCopy.duplicates.length;
    reportCopy.duplicates = reportCopy.duplicates.slice(0, 50);
  }

  saveJSON(REPORT_FILE, reportCopy);
  console.log(`\n💾 Full audit report saved to ${REPORT_FILE}`);
  console.log(`${'═'.repeat(60)}\n`);
}

// ─── Entry Point ────────────────────────────────────────────────────
runAudit();
