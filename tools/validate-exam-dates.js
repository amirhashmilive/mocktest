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

  try {
    if (!fs.existsSync(DATA_PATH)) {
      throw new Error(`File not found: ${DATA_PATH}`);
    }

    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);

    if (!data || typeof data !== 'object' || !Array.isArray(data.exams)) {
      throw new Error('Invalid data structure in data/exam-updates.json (missing or non-array "exams")');
    }

    const now = DateUtils.getCurrentDate();
    const initialCount = data.exams.length;

    // Filter ONLY future exams
    const futureExams = DateUtils.filterAndSortFutureExams(data.exams, now);
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

    console.log('✅ Validation passed');
    return true;
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    throw error;
  }
}

if (require.main === module) {
  try {
    validateExamDates();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

module.exports = { validateExamDates };
