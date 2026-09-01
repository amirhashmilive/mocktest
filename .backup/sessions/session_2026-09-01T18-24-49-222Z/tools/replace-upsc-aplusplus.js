#!/usr/bin/env node
/**
 * tools/replace-upsc-aplusplus.js
 * ────────────────────────────────────────────────────────────────────
 * Replaces the UPSC A++ level question bank with the 50 evidence-driven
 * verified questions parsed from C:\Users\hashm\Desktop\FINAL_50_v4.md.
 * ────────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

const MD_PATH = 'C:\\Users\\hashm\\Desktop\\FINAL_50_v4.md';
const TARGET_DIR = path.resolve(__dirname, '..', 'data', 'questions', 'upsc');
const TARGET_FILE = path.join(TARGET_DIR, 'level-Aplusplus.json');
const TARGET_FILE_ALT = path.join(TARGET_DIR, 'levelA++.json');
const BACKUP_FILE = path.join(TARGET_DIR, 'level-Aplusplus.backup.json');
const BACKUP_FILE_ALT = path.join(TARGET_DIR, 'levelA++.backup.json');

console.log(`\n🚀 UPSC A++ QUESTION BANK REPLACEMENT PROCESS`);
console.log(`${'═'.repeat(60)}`);

// 1. Read source file
if (!fs.existsSync(MD_PATH)) {
  console.error(`❌ Source file not found at ${MD_PATH}`);
  process.exit(1);
}
const rawText = fs.readFileSync(MD_PATH, 'utf8');

// 2. Parse questions
const blocks = rawText.split(/(?:={50,}|-{50,})/);
const questions = [];
let indexCount = 0;

for (let block of blocks) {
  block = block.trim();
  if (!block) continue;

  const qMatch = block.match(/Q\.(\d+)/);
  if (!qMatch) continue;

  indexCount++;
  const idStr = `upsc-a++-${String(indexCount).padStart(3, '0')}`;

  function extractSection(headerName, possibleNextHeaders) {
    const nextPattern = possibleNextHeaders.map(h => h.replace(/([.*+?^${}()|[\]\\])/g, '\\$1')).join('|');
    const regex = new RegExp(`(?:^|\\n)${headerName}(?:\\s*\\([^\\)]*\\))?:\\s*([\\s\\S]*?)(?=\\n(?:${nextPattern})(?:\\s*\\([^\\)]*\\))?:|$)`, 'i');
    const m = block.match(regex);
    if (!m) return '';
    return m[1].replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const allHeaders = [
    'Provisional/Verified Answer', 'Answer-Key Authority', 'Verification Status', 'Confidence',
    'Primary Subject', 'Secondary Subject', 'Topic', 'Micro-topic', 'Question Format', 'Knowledge Type',
    'Difficulty Level', 'Information Stability', 'Trap Mechanism', 'Discrimination Target', 'Core Concept',
    'Explanation', 'Elimination Path', 'Grounding', 'PYQ Linkage', 'Source', 'Source Verification Status',
    'Information Valid As Of', 'Explanation Verification'
  ];

  // Question Text
  let questionText = '';
  const qTextMatch = block.match(/Q\.\d+.*?\n+([\s\S]*?)(?=\n\s*\(a\)|Options:|\n\s*Provisional)/i);
  if (qTextMatch) {
    questionText = qTextMatch[1].trim();
    questionText = questionText.replace(/^\(REPLACEMENT for Q\.\d+.*?\)\s*/gi, '').trim();
  }

  // Options
  let optA = '', optB = '', optC = '', optD = '';
  const optAMatch = block.match(/\(a\)\s*([\s\S]*?)(?=\(b\))/i);
  const optBMatch = block.match(/\(b\)\s*([\s\S]*?)(?=\(c\))/i);
  const optCMatch = block.match(/\(c\)\s*([\s\S]*?)(?=\(d\))/i);
  const optDMatch = block.match(/\(d\)\s*([\s\S]*?)(?=\n\s*(?:Provisional|Answer-Key|Verification|Primary Subject)|$)/i);

  if (optAMatch) optA = optAMatch[1].replace(/\s+/g, ' ').trim();
  if (optBMatch) optB = optBMatch[1].replace(/\s+/g, ' ').trim();
  if (optCMatch) optC = optCMatch[1].replace(/\s+/g, ' ').trim();
  if (optDMatch) optD = optDMatch[1].replace(/\s+/g, ' ').trim();

  // Correct Answer
  const provAns = extractSection('Provisional/Verified Answer', allHeaders);
  let correctAnswer = 'a';
  const letterMatch = provAns.match(/\(([abcd])\)/i) || provAns.match(/^([abcd])[\).\s]/i);
  if (letterMatch) {
    correctAnswer = letterMatch[1].toLowerCase();
  }

  const subject = extractSection('Primary Subject', allHeaders) || 'General Studies';
  const topic = extractSection('Topic', allHeaders);
  const microTopic = extractSection('Micro-topic', allHeaders);
  const questionFormat = extractSection('Question Format', allHeaders);
  const knowledgeType = extractSection('Knowledge Type', allHeaders);
  const difficulty = extractSection('Difficulty Level', allHeaders) || 'Difficult';
  const explanation = extractSection('Explanation', allHeaders);
  const eliminationPath = extractSection('Elimination Path', allHeaders);
  const source = extractSection('Source', allHeaders);

  const qObj = {
    id: idStr,
    category: 'upsc',
    level: 'A++',
    questionText: questionText,
    question: questionText,
    options: {
      a: optA,
      b: optB,
      c: optC,
      d: optD
    },
    optionsArray: [optA, optB, optC, optD],
    correctAnswer: correctAnswer,
    correct: ['a', 'b', 'c', 'd'].indexOf(correctAnswer),
    explanation: explanation,
    eliminationPath: eliminationPath,
    source: source,
    difficulty: difficulty,
    questionFormat: questionFormat,
    knowledgeType: knowledgeType,
    subject: subject,
    topic: topic,
    microTopic: microTopic,
    tags: ['upsc', subject.toLowerCase().replace(/[^a-z0-9]/g, ''), 'level-a++']
  };

  // Attach array methods for dual object/array access
  const optionsArr = [optA, optB, optC, optD];
  optionsArr.a = optA;
  optionsArr.b = optB;
  optionsArr.c = optC;
  optionsArr.d = optD;
  qObj.options = optionsArr;

  questions.push(qObj);
}

console.log(`✅ Parsed ${questions.length} questions from ${MD_PATH}`);

// 3. Backup existing file
if (fs.existsSync(TARGET_FILE)) {
  fs.copyFileSync(TARGET_FILE, BACKUP_FILE);
  fs.copyFileSync(TARGET_FILE, BACKUP_FILE_ALT);
  console.log(`📦 Created backup at ${BACKUP_FILE}`);
  console.log(`📦 Created backup at ${BACKUP_FILE_ALT}`);
}

// 4. Save new question bank
fs.writeFileSync(TARGET_FILE, JSON.stringify(questions, null, 2) + '\n', 'utf8');
fs.writeFileSync(TARGET_FILE_ALT, JSON.stringify(questions, null, 2) + '\n', 'utf8');
console.log(`💾 Saved 50 new UPSC A++ questions to ${TARGET_FILE}`);
console.log(`💾 Saved 50 new UPSC A++ questions to ${TARGET_FILE_ALT}`);

console.log(`${'═'.repeat(60)}\n`);
