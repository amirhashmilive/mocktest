const fs = require('fs');
const path = require('path');

const mdPath = 'C:\\Users\\hashm\\Desktop\\FINAL_50_v4.md';
const content = fs.readFileSync(mdPath, 'utf8');

// Split by question blocks starting with Q.XX or delimiter lines
const rawBlocks = content.split(/={10,}/);

console.log(`Found ${rawBlocks.length} raw blocks`);

const questions = [];

for (let i = 0; i < rawBlocks.length; i++) {
  const block = rawBlocks[i].trim();
  if (!block) continue;
  
  // Look for Q.XX
  const qMatch = block.match(/Q\.(\d+)/);
  if (!qMatch) continue;

  const qNum = parseInt(qMatch[1], 10);
  
  // Extract fields using Regex / line parsing
  let subject = '';
  let topic = '';
  let microTopic = '';
  let qFormat = '';
  let knowledgeType = '';
  let diffLevel = '';
  let explanation = '';
  let eliminationPath = '';
  let source = '';
  let provAnswer = '';

  const getField = (label) => {
    const re = new RegExp(`^${label}:\\s*(.*)$`, 'm');
    const m = block.match(re);
    return m ? m[1].trim() : '';
  };

  subject = getField('Primary Subject');
  topic = getField('Topic');
  microTopic = getField('Micro-topic');
  qFormat = getField('Question Format');
  knowledgeType = getField('Knowledge Type');
  diffLevel = getField('Difficulty Level');
  source = getField('Source');

  // Multi-line fields like Explanation, Elimination Path
  const getMultilineField = (label, nextLabels) => {
    const nextRegexStr = nextLabels.map(l => `^${l}:`).join('|');
    const re = new RegExp(`^${label}(?:\\s*\\(.*?\\))?:\\s*([\\s\\S]*?)(?=${nextRegexStr}|$)`, 'm');
    const m = block.match(re);
    return m ? m[1].trim() : '';
  };

  explanation = getMultilineField('Explanation', ['Elimination Path', 'Grounding', 'PYQ Linkage', 'Source']);
  eliminationPath = getMultilineField('Elimination Path', ['Grounding', 'PYQ Linkage', 'Source']);

  provAnswer = getField('Provisional/Verified Answer') || getField('Provisional Answer') || getField('Answer');

  // Extract correct letter ('a', 'b', 'c', or 'd')
  let correctLetter = 'a';
  const ansLetterMatch = provAnswer.match(/\(([abcd])\)/i) || provAnswer.match(/^([abcd])[\).\s]/i);
  if (ansLetterMatch) {
    correctLetter = ansLetterMatch[1].toLowerCase();
  }

  // Extract Question text & Options
  // Question text is between Q.XX and Options / (a)
  const qTextMatch = block.match(/Q\.\d+\s*([\s\S]*?)(?=\(a\)|Options:|\n\s*\(a\)|Provisional\/Verified Answer:)/i);
  let qText = qMatch ? qTextMatch ? qTextMatch[1].trim() : '' : '';

  // Options parsing
  let optA = '', optB = '', optC = '', optD = '';
  
  const optAMatch = block.match(/\(a\)\s*([\s\S]*?)(?=\(b\))/i);
  const optBMatch = block.match(/\(b\)\s*([\s\S]*?)(?=\(c\))/i);
  const optCMatch = block.match(/\(c\)\s*([\s\S]*?)(?=\(d\))/i);
  const optDMatch = block.match(/\(d\)\s*([\s\S]*?)(?=\n\s*[A-Z][a-zA-Z\s/-]+:|Provisional|Primary Subject|$)/i);

  if (optAMatch) optA = optAMatch[1].trim();
  if (optBMatch) optB = optBMatch[1].trim();
  if (optCMatch) optC = optCMatch[1].trim();
  if (optDMatch) optD = optDMatch[1].trim();

  // Clean trailing lines from option D if any
  optD = optD.replace(/\n\s*(Provisional|Answer-Key|Verification|Primary Subject)[\s\S]*/i, '').trim();

  questions.push({
    num: qNum,
    id: `upsc-a++-${String(qNum).padStart(3, '0')}`,
    category: 'upsc',
    level: 'A++',
    questionText: qText,
    question: qText, // Mockhard engine compatibility
    optionsObj: { a: optA, b: optB, c: optC, d: optD },
    options: [optA, optB, optC, optD], // Mockhard engine compatibility (array)
    correctAnswer: correctLetter,
    correct: ['a', 'b', 'c', 'd'].indexOf(correctLetter), // Mockhard engine compatibility (0-3 index)
    explanation: explanation,
    eliminationPath: eliminationPath,
    source: source,
    difficulty: diffLevel || 'Difficult',
    questionFormat: qFormat,
    knowledgeType: knowledgeType,
    subject: subject || 'General Studies',
    topic: topic,
    microTopic: microTopic,
    tags: ['upsc', (subject || 'general').toLowerCase(), 'level-a++']
  });
}

console.log(`Successfully parsed ${questions.length} questions`);

if (questions.length > 0) {
  console.log('Sample parsed Q1:', JSON.stringify(questions[0], null, 2));
  console.log('Sample parsed Q50:', JSON.stringify(questions[questions.length - 1], null, 2));
}
