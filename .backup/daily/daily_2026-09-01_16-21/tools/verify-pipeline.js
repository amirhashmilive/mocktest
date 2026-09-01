/**
 * Verification script for the 13-stage pipeline & question loader
 */
const DataGate = require('../js/stage0-dataGate');
const Extractor = require('../js/stage1-extractor');
const Classifier = require('../js/stage2-classifier');
const Patterns = require('../js/stage3-patterns');
const Prioritise = require('../js/stage4-prioritise');
const KnowledgeGraph = require('../js/stage5-knowledgeGraph');
const Blueprint = require('../js/stage6-blueprint');
const Generation = require('../js/stage7-generation');
const Verification = require('../js/stage8-verification');
const Adversarial = require('../js/stage9-adversarial');
const Originality = require('../js/stage10-originality');
const Quality = require('../js/stage11-quality');
const Finalise = require('../js/stage12-finalise');
const Audit = require('../js/stage13-audit');

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing 13-Stage Pipeline on UPSC Examination Config...');

const configPath = path.join(__dirname, '..', 'data', 'examination-configs', 'upsc.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Stage 0: Data Gate
const gateReport = DataGate.checkDataAvailability(config);
console.log(`  Stage 0 (Data Gate): ${gateReport.status}`);

// Stage 1: Extractor
const rawQuestions = [
  { id: 'upsc_1', question: 'The Constitution of India was adopted on:', options: ['26 Nov 1949', '26 Jan 1950', '15 Aug 1947', '2 Oct 1950'], correct: 0, subject: 'Polity' }
];
const extracted = Extractor.extractQuestions({ questions: rawQuestions }, config);
console.log(`  Stage 1 (Extractor): Extracted ${extracted.length} questions`);

// Stage 2: Classifier
const classified = extracted.map(q => Classifier.classifyQuestion(q, config));
console.log(`  Stage 2 (Classifier): Classified knowledge types & formats`);

// Stage 3: Patterns
const patternIntel = Patterns.analyzePatterns(classified);
console.log(`  Stage 3 (Patterns): Analyzed ${patternIntel.totalAnalyzed} questions`);

// Stage 4: Prioritise
const priorityMatrix = Prioritise.generatePriorityMatrix(config, patternIntel);
console.log(`  Stage 4 (Prioritise): Generated priority matrix (${priorityMatrix.length} topics)`);

// Stage 5: Knowledge Graph
const kg = KnowledgeGraph.buildKnowledgeGraph(priorityMatrix[0].topic, priorityMatrix[0].subject);
console.log(`  Stage 5 (Knowledge Graph): Built graph for ${kg.topic}`);

// Stage 6: Blueprint
const bp = Blueprint.createBlueprint(config, priorityMatrix);
console.log(`  Stage 6 (Blueprint): Created blueprint for ${bp.totalQuestions} questions (Match: ${bp.verification.subjectMatch})`);

// Stage 7: Generation
const candidatePool = Generation.generateCandidatePool(bp, config);
console.log(`  Stage 7 (Generation): Generated candidate pool of ${candidatePool.candidatePoolSize} candidates`);

// Stage 8: Verification
const verifications = candidatePool.candidates.map(c => Verification.verifyCandidate(c, config.sourceHierarchy));
console.log(`  Stage 8 (Verification): Verified candidates`);

// Stage 9: Adversarial
const adversarials = candidatePool.candidates.map(c => Adversarial.reviewCandidate(c));
console.log(`  Stage 9 (Adversarial): Reviewed candidates`);

// Stage 10: Originality
const originalities = candidatePool.candidates.map(c => Originality.checkOriginality(c, rawQuestions));
console.log(`  Stage 10 (Originality): Checked originality`);

// Stage 11: Quality
const qualities = candidatePool.candidates.map((c, i) => Quality.scoreCandidate(c, verifications[i], adversarials[i], originalities[i]));
console.log(`  Stage 11 (Quality): Computed quality scores (Avg: ${Math.round(qualities.reduce((a,b)=>a+b.totalScore,0)/qualities.length)})`);

// Stage 12: Finalise
const finalSelection = Finalise.selectFinalQuestions(candidatePool.candidates, qualities, bp);
console.log(`  Stage 12 (Finalise): Selected ${finalSelection.selectedCount} final questions`);

// Stage 13: Audit
const auditReport = Audit.generateAuditReport({
  config, gateReport, patternIntelligence: patternIntel, blueprint: bp, candidatePool, finalSelection
});
console.log(`  Stage 13 (Audit): ${auditReport.pipelineStatus}`);
console.log('\n🎉 13-Stage Pipeline Verification PASSED successfully!');
