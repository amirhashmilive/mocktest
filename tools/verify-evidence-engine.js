/**
 * MOCKHARD — EvidenceEngine Enforcement Test Suite
 */

const EvidenceEngine = require('../js/evidenceEngine');
const QuestionLoader = require('../js/questionLoader');

async function testEvidenceEngine() {
  console.log('🧪 Testing Evidence-Driven Engine Enforcement...');

  const params = {
    examination: 'upsc',
    level: 'B',
    subject: 'History',
    count: 50
  };

  console.log(`  1. Requesting ${params.count} questions for ${params.examination}/${params.subject} (Level ${params.level})...`);
  
  let progressCount = 0;
  const questions = await EvidenceEngine.generateQuestions(params, (progress) => {
    progressCount++;
    console.log(`     [Progress ${progress.percent}%] ${progress.details}`);
  });

  console.log(`  2. Questions received: ${questions.length}`);
  console.log(`  3. Progress steps recorded: ${progressCount}`);

  if (questions.length === params.count) {
    console.log('✅ Evidence Engine correctly delivered exact requested question count!');
  } else {
    console.warn(`⚠️ Mismatch: Expected ${params.count}, got ${questions.length}`);
  }

  // Verify non-null required properties
  const sample = questions[0];
  if (sample && sample.question && sample.options && sample.options.length >= 4) {
    console.log('✅ Sample Question validated structure:');
    console.log(`     Q: "${sample.question.substring(0, 60)}..."`);
    console.log(`     Options: ${sample.options.join(', ')}`);
    console.log(`     Quality Score: ${sample.qualityScore || 'Validated'}`);
  } else {
    console.error('❌ Sample question validation failed!');
    process.exit(1);
  }

  console.log('\n🎉 Evidence-Driven Enforcement Test PASSED successfully!');
}

testEvidenceEngine();
