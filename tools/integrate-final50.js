/**
 * MOCKHARD — Integrate FINAL_50_v4.md into UPSC Level A++
 * =================================────────────────=======
 * Prepends the evidence-driven questions from FINAL_50_v4.md
 * to data/questions/upsc/level-Aplusplus.json as the FIRST questions.
 */
const fs = require('fs');
const path = require('path');

const parsedPath = path.join(__dirname, '..', 'data', 'questions', 'upsc', '_parsed_final50.json');
const targetPath = path.join(__dirname, '..', 'data', 'questions', 'upsc', 'level-Aplusplus.json');
const targetAliasPath = path.join(__dirname, '..', 'data', 'questions', 'upsc', 'levelA++.json');

if (!fs.existsSync(parsedPath)) {
  console.error('❌ Parsed questions file not found. Run parse-final50.js first.');
  process.exit(1);
}

const parsedQuestions = JSON.parse(fs.readFileSync(parsedPath, 'utf-8'));
let existingQuestions = [];

if (fs.existsSync(targetPath)) {
  existingQuestions = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
}

console.log(`Loaded ${parsedQuestions.length} evidence questions and ${existingQuestions.length} existing UPSC A++ questions.`);

// Format parsed questions for level-Aplusplus.json
const evidenceFormatted = parsedQuestions.map((q, idx) => ({
  id: `upsc-a++-${String(idx + 1).padStart(3, '0')}`,
  subject: q.subject,
  topic: q.topic,
  microTopic: q.microTopic,
  level: 'Aplusplus',
  question: q.question,
  options: q.options,
  correct: q.correct,
  explanation: q.explanation,
  eliminationPath: q.eliminationPath,
  trapMechanism: q.trapMechanism,
  discriminationTarget: q.discriminationTarget,
  source: 'FINAL_50_v4.md',
  sourceFile: 'FINAL_50_v4.md',
  verified: true,
  qualityScore: q.qualityScore || 98,
  tags: ['upsc', 'aplusplus', 'evidence-driven', 'final-50']
}));

// Filter existing questions to avoid duplicates of the newly prepended IDs
const filteredExisting = existingQuestions.filter(q => !q.id.startsWith('upsc-a++-'));

// Combine: Evidence-driven questions FIRST, then remaining questions
const combined = [...evidenceFormatted, ...filteredExisting];

fs.writeFileSync(targetPath, JSON.stringify(combined, null, 2), 'utf-8');
console.log(`✅ Saved ${combined.length} questions to ${targetPath} (First ${evidenceFormatted.length} are from FINAL_50_v4.md)`);

// Also save to levelA++.json alias for system compatibility
fs.writeFileSync(targetAliasPath, JSON.stringify(combined, null, 2), 'utf-8');
console.log(`✅ Saved alias copy to ${targetAliasPath}`);
