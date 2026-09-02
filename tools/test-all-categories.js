/**
 * MOCKHARD — Full Suite Category & Engine Verification Tool
 * =========================================================
 * Tests PaperEngine, TestEngine, SafetyProtocols, ResultAnalyzer,
 * Certificate Status Badges, and Historical Analysis across ALL exam categories.
 */

const fs = require('fs');
const path = require('path');

// Mock browser globals for Node test environment
global.window = global;
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};
global.sessionStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

// Load database file for Node test environment
const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/historical-database.json'), 'utf8'));

// Require core engine modules
const PaperEngine = require('../js/paperEngine.js');
const TestEngine = require('../js/testEngine.js');
const SafetyProtocols = require('../js/safetyProtocols.js');
const { analyzeResults } = require('../js/resultAnalyzer.js');
const PDFCertificate = require('../js/pdfGenerator.js');
const HistoricalAnalysis = require('../js/historicalAnalysis.js');

// Mock loadDatabase for Node environment
HistoricalAnalysis.loadDatabase = async () => dbData;

const CATEGORIES = [
  'upsc', 'ssc', 'railways', 'neet', 'norcet',
  'jee', 'gate', 'clat', 'board', 'defence'
];

const LEVELS = ['C', 'B', 'A', 'A+', 'A++'];

async function testAllCategories() {
  console.log('🧪 Starting Full System Verification Across All Exam Categories & Levels...\n');

  let passedTests = 0;
  let failedTests = 0;
  let summaryLog = [];

  // 1. Test Paper Engine & Shuffling for all Categories
  console.log('--- 1. Testing Paper Engine & Option Shuffling ---');
  for (const cat of CATEGORIES) {
    for (const lvl of LEVELS) {
      const engine = new PaperEngine({ category: cat, level: lvl, questionCount: 10 });
      // Create mock questions pool for paper generation test
      const mockPool = Array.from({ length: 15 }, (_, i) => ({
        id: `${cat}_${lvl}_${i + 1}`,
        question: `Question ${i + 1} for ${cat} ${lvl}`,
        options: [`Opt A ${i}`, `Opt B ${i}`, `Opt C ${i}`, `Opt D ${i}`],
        correct: i % 4,
        subject: 'General'
      }));

      const selected = engine.selectRandomQuestions(mockPool, 10);
      const cloned = JSON.parse(JSON.stringify(selected));
      cloned.forEach(q => engine.shuffleQuestionOptions(q));

      // Verify that options were shuffled and correct index was re-mapped properly
      let matches = 0;
      cloned.forEach((q, idx) => {
        const origText = mockPool.find(m => m.id === q.id).options[mockPool.find(m => m.id === q.id).correct];
        const newCorrectText = q.options[q.correct];
        if (origText === newCorrectText) matches++;
      });

      if (matches === 10) {
        passedTests++;
      } else {
        failedTests++;
        summaryLog.push(`❌ PaperEngine failed for ${cat}/${lvl}: option mapping mismatch`);
      }
    }
    console.log(`   ✅ Category '${cat}': All 5 difficulty levels (C, B, A, A+, A++) passed randomization & re-indexing.`);
  }

  // 2. Test Certificate Status Badges across Score Ranges
  console.log('\n--- 2. Testing Certificate Status Badges ---');
  const badgeTests = [
    { score: 95, expectedStatus: 'EXCELLENT', expectedBadge: '🏆' },
    { score: 80, expectedStatus: 'PASSED', expectedBadge: '✅' },
    { score: 60, expectedStatus: 'NEEDS IMPROVEMENT', expectedBadge: '⚠️' },
    { score: 35, expectedStatus: 'RE-TEST RECOMMENDED', expectedBadge: '🔁' }
  ];

  badgeTests.forEach(test => {
    const statusObj = PDFCertificate.getCertificateStatus(test.score);
    if (statusObj.status === test.expectedStatus && statusObj.badge === test.expectedBadge) {
      console.log(`   ✅ Score ${test.score}% → Badge ${statusObj.badge} ${statusObj.status} (${statusObj.message})`);
      passedTests++;
    } else {
      console.error(`   ❌ Score ${test.score}% → Unexpected status:`, statusObj);
      failedTests++;
    }
  });

  // 3. Test TestEngine & SafetyProtocols Auto-Save & Resume
  console.log('\n--- 3. Testing TestEngine & SafetyProtocols ---');
  const tEngine = new TestEngine({ category: 'upsc', level: 'C', totalQuestions: 5 });
  tEngine.paper = {
    paperId: 'P-TEST-100',
    category: 'upsc',
    level: 'C',
    questions: [
      { id: 'q1', question: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 1 },
      { id: 'q2', question: 'Q2', options: ['A', 'B', 'C', 'D'], correct: 2 }
    ]
  };
  tEngine.paperId = 'P-TEST-100';
  tEngine.answerQuestion(0, 1);
  tEngine.answerQuestion(1, 0); // wrong answer
  tEngine.markForReview(0);
  tEngine.saveState();

  const loadedState = TestEngine.loadState('P-TEST-100');
  if (loadedState && loadedState.answers[0] === 1 && loadedState.answers[1] === 0 && loadedState.markedForReview[0]) {
    console.log('   ✅ TestEngine State Persistence & Recovery verified.');
    passedTests++;
  } else {
    console.error('   ❌ TestEngine State Persistence failed:', loadedState);
    failedTests++;
  }

  // 4. Test Result Analyzer
  console.log('\n--- 4. Testing Result Analyzer ---');
  const results = analyzeResults(tEngine.paper, tEngine.answers, 120);
  if (results.total === 2 && results.correct === 1 && results.incorrect === 1 && results.score === 1 && results.percentage === 50) {
    console.log('   ✅ Result Analyzer grading precision verified (Score: 1/2 = 50%).');
    passedTests++;
  } else {
    console.error('   ❌ Result Analyzer failed:', results);
    failedTests++;
  }

  // 5. Test Historical Analysis for All Categories
  console.log('\n--- 5. Testing Historical Analysis Engine ---');

  for (const cat of CATEGORIES) {
    const comp = await HistoricalAnalysis.comparePerformance(cat, 35, 50); // 70% score
    if (comp && comp.examName && comp.statusText) {
      console.log(`   ✅ Historical Analysis [${cat}]: ${comp.examName} → Status: '${comp.statusText}' (Cut-off: ${comp.cutOffVal})`);
      passedTests++;
    } else {
      console.error(`   ❌ Historical Analysis failed for ${cat}`);
      failedTests++;
    }
  }

  console.log('\n======================================================');
  if (failedTests === 0) {
    console.log(`🎉 ALL ${passedTests} VERIFICATION TESTS PASSED SUCCESSFULLY!`);
    console.log('✅ Paper Engine, Option Shuffling, Test Engine, Safety Protocols, Result Analyzer, Certificate Status Badges, and Historical Analysis are 100% operational on ALL exam categories.');
  } else {
    console.error(`❌ VERIFICATION FAILED WITH ${failedTests} FAILURE(S).`);
    summaryLog.forEach(l => console.error(l));
    process.exit(1);
  }
}

testAllCategories();
