const fs = require('fs');
const path = require('path');

const mdPath = 'C:\\Users\\hashm\\Desktop\\FINAL_50_v4.md';
const rawText = fs.readFileSync(mdPath, 'utf8');

// Split into blocks by question separator line (----------------------- or =======================)
const blocks = rawText.split(/(?:={50,}|-{50,})/);

console.log(`Found ${blocks.length} total blocks`);

const parsedQuestions = [];
let indexCount = 0;

for (let block of blocks) {
  block = block.trim();
  if (!block) continue;

  // Check if block contains Q.XX
  const qMatch = block.match(/Q\.(\d+)/);
  if (!qMatch) continue;

  indexCount++;
  const idStr = `upsc-a++-${String(indexCount).padStart(3, '0')}`;

  // Helper to extract text section between a header label and next known header labels
  function extractSection(headerName, possibleNextHeaders) {
    const nextPattern = possibleNextHeaders.map(h => h.replace(/([.*+?^${}()|[\]\\])/g, '\\$1')).join('|');
    // Match line starting with HeaderName (case insensitive, allowing optional (approx...) suffix)
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

  // Extract Question text & Options
  let questionText = '';
  // Match after Q.XX line (which may contain replacement notes) up to (a)
  const qTextMatch = block.match(/Q\.\d+.*?\n+([\s\S]*?)(?=\n\s*\(a\)|Options:|\n\s*Provisional)/i);
  if (qTextMatch) {
    questionText = qTextMatch[1].trim();
    // Clean any residual replacement notes
    questionText = questionText.replace(/^\(REPLACEMENT for Q\.\d+.*?\)\s*/gi, '').trim();
  }

  // Extract Options
  let optA = '', optB = '', optC = '', optD = '';

  const optAMatch = block.match(/\(a\)\s*([\s\S]*?)(?=\(b\))/i);
  const optBMatch = block.match(/\(b\)\s*([\s\S]*?)(?=\(c\))/i);
  const optCMatch = block.match(/\(c\)\s*([\s\S]*?)(?=\(d\))/i);
  const optDMatch = block.match(/\(d\)\s*([\s\S]*?)(?=\n\s*(?:Provisional|Answer-Key|Verification|Primary Subject)|$)/i);

  if (optAMatch) optA = optAMatch[1].replace(/\s+/g, ' ').trim();
  if (optBMatch) optB = optBMatch[1].replace(/\s+/g, ' ').trim();
  if (optCMatch) optC = optCMatch[1].replace(/\s+/g, ' ').trim();
  if (optDMatch) optD = optDMatch[1].replace(/\s+/g, ' ').trim();

  // Extract Answer
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
    question: questionText, // Engine standard
    options: {
      a: optA,
      b: optB,
      c: optC,
      d: optD
    },
    // Array options for Mockhard engine compatibility
    optionsArray: [optA, optB, optC, optD],
    correctAnswer: correctAnswer,
    correct: ['a', 'b', 'c', 'd'].indexOf(correctAnswer), // 0-3 index
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

  // For 100% full compatibility, options property can be an Array with properties .a, .b, .c, .d attached
  const optionsArr = [optA, optB, optC, optD];
  optionsArr.a = optA;
  optionsArr.b = optB;
  optionsArr.c = optC;
  optionsArr.d = optD;
  qObj.options = optionsArr;

  parsedQuestions.push(qObj);
}

console.log(`Parsed exactly ${parsedQuestions.length} questions.`);
console.log('\n--- SAMPLE QUESTION 1 ---');
console.log(JSON.stringify(parsedQuestions[0], null, 2));

console.log('\n--- SAMPLE QUESTION 50 ---');
console.log(JSON.stringify(parsedQuestions[parsedQuestions.length - 1], null, 2));

// Save JSON output to check
fs.writeFileSync('tools/parsed_50_sample.json', JSON.stringify(parsedQuestions, null, 2));
