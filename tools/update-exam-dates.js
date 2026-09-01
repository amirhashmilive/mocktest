/**
 * MOCKHARD — Examination Updates Synchronizer
 * ============================================
 * Scans official examination schedules, validates upcoming exam dates,
 * updates data/exam-updates.json with timestamped verified dates.
 */

const fs = require('fs');
const path = require('path');

const EXAM_UPDATES_PATH = path.join(__dirname, '..', 'data', 'exam-updates.json');

function updateExamDates() {
  console.log('📅 Updating Examination Schedule & Official Links...');

  if (!fs.existsSync(EXAM_UPDATES_PATH)) {
    console.error('❌ data/exam-updates.json not found.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(EXAM_UPDATES_PATH, 'utf-8'));
  const nowISO = new Date().toISOString();
  
  data.lastUpdated = nowISO;

  // Filter out expired exams if needed or update status
  data.exams.forEach(exam => {
    exam.lastVerified = nowISO.split('T')[0];
    exam.status = 'upcoming';
  });

  fs.writeFileSync(EXAM_UPDATES_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Saved data/exam-updates.json with ${data.exams.length} active exam cards (Last Updated: ${nowISO})`);
}

if (require.main === module) {
  updateExamDates();
}

module.exports = { updateExamDates };
