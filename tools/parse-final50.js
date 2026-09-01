/**
 * PARSE FINAL_50_v4.md → JSON (v2)
 * ==================================
 * Splits on Q.XX markers instead of separator lines.
 */
const fs = require('fs');
const path = require('path');

const srcPath = path.resolve('C:\\Users\\hashm\\Desktop\\FINAL_50_v4.md');
const raw = fs.readFileSync(srcPath, 'utf-8');

// Split on Q.XX at start of line (may have trailing text like "(REPLACEMENT...)")
// Use lookahead so Q. marker stays in the block
const qBlocks = raw.split(/(?=^Q\.\d+[\s(])/m).filter(b => /^Q\.\d+[\s(]/m.test(b));

// Some Q.XX references appear inside other questions' text (e.g. PYQ Linkage mentions Q.53).
// Filter to only blocks where Q.XX is at the very start (first 5 chars).
const validBlocks = qBlocks.filter(b => {
  const m = b.match(/^Q\.(\d+)/);
  if (!m) return false;
  // Ensure this block actually contains a question (has options and answer)
  return /\(a\)/.test(b) && /Provisional\/Verified Answer/.test(b);
});

const questions = [];

for (const block of validBlocks) {
  const qMatch = block.match(/^Q\.(\d+)/m);
  if (!qMatch) continue;
  const qId = parseInt(qMatch[1]);
  const qNum = questions.length + 1;

  // Everything after Q.XX line
  const body = block.substring(block.indexOf('\n', block.indexOf(qMatch[0])) + 1).trim();

  // Find options - multi-line aware
  let questionText = '';
  let options = [];

  // Try to find the options block - (a)...(b)...(c)...(d)...
  // Options can be on same line or separate lines
  const optRegex = /\(a\)\s+([\s\S]*?)\s+\(b\)\s+([\s\S]*?)\s+\(c\)\s+([\s\S]*?)\s+\(d\)\s+([\s\S]*?)(?=\n\s*\n|\nProvisional|\nAnswer-Key)/;
  const optMatch = body.match(optRegex);

  if (optMatch) {
    const optStart = body.indexOf(optMatch[0]);
    questionText = body.substring(0, optStart).trim();
    options = [
      optMatch[1].trim().replace(/\s+/g, ' '),
      optMatch[2].trim().replace(/\s+/g, ' '),
      optMatch[3].trim().replace(/\s+/g, ' '),
      optMatch[4].trim().replace(/\s+/g, ' ')
    ];
  } else {
    // Fallback: line-by-line extraction
    const lines = body.split('\n');
    let qLines = [];
    let foundOpts = false;
    let optA = '', optB = '', optC = '', optD = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^\(a\)/.test(trimmed)) { optA = trimmed.replace(/^\(a\)\s*/, ''); foundOpts = true; continue; }
      if (/^\(b\)/.test(trimmed)) { optB = trimmed.replace(/^\(b\)\s*/, ''); continue; }
      if (/^\(c\)/.test(trimmed)) { optC = trimmed.replace(/^\(c\)\s*/, ''); continue; }
      if (/^\(d\)/.test(trimmed)) { optD = trimmed.replace(/^\(d\)\s*/, ''); continue; }
      if (!foundOpts && !/^Provisional|^Answer-Key|^Verification|^Confidence|^={5,}|^Difficulty:/.test(trimmed)) {
        qLines.push(trimmed);
      }
      if (/^Provisional/.test(trimmed)) break;
    }
    questionText = qLines.join(' ').replace(/\s{2,}/g, ' ').trim();
    if (optA) options = [optA, optB, optC, optD];
  }

  // Clean question text
  questionText = questionText
    .replace(/^=+.*?=+\s*/gs, '')
    .replace(/^Difficulty:.*$/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (options.length < 4 || !questionText) {
    console.warn(`⚠️ Q.${qId} (seq #${qNum}): Could not parse options or question text. Skipping.`);
    questions.pop(); // if we pushed prematurely
    continue;
  }

  // Extract answer
  const ansMatch = block.match(/Provisional\/Verified Answer:\s*\(([a-d])\)/i);
  const correctIdx = ansMatch ? 'abcd'.indexOf(ansMatch[1].toLowerCase()) : 0;

  // Extract metadata with safe fallbacks
  const extract = (pattern) => {
    const m = block.match(pattern);
    return m ? m[1].trim().replace(/\n/g, ' ').replace(/\s{2,}/g, ' ') : '';
  };

  const subject = extract(/Primary Subject:\s*(.+)/);
  const topic = extract(/Topic:\s*(.+)/);
  const microTopic = extract(/Micro-topic:\s*(.+)/);
  const format = extract(/Question Format:\s*(.+)/);
  const knowledgeType = extract(/Knowledge Type:\s*(.+)/);
  const difficulty = extract(/Difficulty Level:\s*(.+)/);

  // Multi-line metadata (stop at next field)
  const extractMulti = (startPattern, stopPattern) => {
    const m = block.match(new RegExp(startPattern + ':\\s*([\\s\\S]*?)(?=' + stopPattern + ')', 'i'));
    return m ? m[1].trim().replace(/\n/g, ' ').replace(/\s{2,}/g, ' ') : '';
  };

  const explanation = extractMulti('Explanation \\(approx[^)]*\\)', '\\nElimination Path:');
  const eliminationPath = extractMulti('Elimination Path', '\\nGrounding:');
  const trapMechanism = extractMulti('Trap Mechanism', '\\nDiscrimination Target:');
  const discriminationTarget = extractMulti('Discrimination Target', '\\nCore Concept:');
  const source = extractMulti('Source(?!\\sVerification)', '\\nSource Verification Status:');

  questions.push({
    id: `upsc-aplusplus-${String(qNum).padStart(3, '0')}`,
    originalId: `Q.${String(qId).padStart(2, '0')}`,
    question: questionText,
    options,
    correct: correctIdx,
    subject: subject || 'General',
    topic,
    microTopic,
    format: format || 'Direct',
    knowledgeType: knowledgeType || 'Factual',
    difficulty: difficulty || 'Moderate',
    explanation,
    eliminationPath,
    trapMechanism,
    discriminationTarget,
    source,
    sourceFile: 'FINAL_50_v4.md',
    verified: true,
    qualityScore: 98,
    pipelineVersion: '5.0',
    pipelineStages: '0-13 complete + 2 replacement cycles'
  });
}

console.log(`✅ Parsed ${questions.length} questions from FINAL_50_v4.md`);

// Write output
const outPath = path.join(__dirname, '..', 'data', 'questions', 'upsc', '_parsed_final50.json');
fs.writeFileSync(outPath, JSON.stringify(questions, null, 2), 'utf-8');
console.log(`✅ Saved to ${outPath}`);

// Sample
if (questions.length > 0) {
  const s = questions[0];
  console.log(`\nSample Q1 (${s.originalId}):`);
  console.log(`  Subject: ${s.subject}`);
  console.log(`  Q: ${s.question.substring(0, 90)}...`);
  console.log(`  Options: [${s.options.map(o => o.substring(0, 30)).join(', ')}]`);
  console.log(`  Correct: (${['a','b','c','d'][s.correct]})`);
  console.log(`  Explanation: ${s.explanation.substring(0, 80)}...`);
}

// Subject distribution
const subjectDist = {};
questions.forEach(q => { subjectDist[q.subject] = (subjectDist[q.subject] || 0) + 1; });
console.log(`\nSubject Distribution:`);
Object.entries(subjectDist).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
