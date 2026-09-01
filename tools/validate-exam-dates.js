/**
 * MOCKHARD — Examination Dates Validator & Audit Script
 * =======================================================
 * Audits data/exam-updates.json, removes any past examination dates,
 * verifies ISO formatting, sorts by closest upcoming date, and updates
 * metrics and verification metadata.
 */

const fs = require('fs');
const path = require('path');
const DateUtils = require('../js/dateUtils.js');

const DATA_PATH = path.join(__dirname, '..', 'data', 'exam-updates.json');

function validateExamDates() {
  console.log('📅 Auditing Examination Dates for Real-Time Future Enforcement...');

  if (!fs.existsSync(DATA_PATH)) {
    console.error('❌ Error: data/exam-updates.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);
  const now = DateUtils.getCurrentDate();
  const initialCount = (data.exams || []).length;

  // Filter ONLY future exams
  const futureExams = DateUtils.filterAndSortFutureExams(data.exams || [], now);
  const removedCount = initialCount - futureExams.length;

  // Update object
  data.lastUpdated = now.toISOString();
  data.totalActive = futureExams.length;
  data.exams = futureExams;

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`✅ Validation Complete: ${futureExams.length} active upcoming exams kept.`);
  if (removedCount > 0) {
    console.log(`🧹 Removed: ${removedCount} past/expired examination dates.`);
  } else {
    console.log(`✨ All ${futureExams.length} examinations are verified future dates.`);
  }

  futureExams.forEach(e => {
    const badge = DateUtils.getBadgeInfo(e.examDate, now);
    console.log(`  - [${badge.label.padEnd(12)}] ${e.name.padEnd(28)} | Exam: ${e.examDate} (${badge.daysText})`);
  });
}

if (require.main === module) {
  validateExamDates();
}

module.exports = { validateExamDates };
