/**
 * STAGE 7 — CANDIDATE GENERATION ENGINE
 * =====================================
 * Generates an expanded candidate pool (e.g. 140 candidates for 120-question test)
 * based on discrimination targets and blueprint requirements.
 */
const Generation = (() => {
  function generateCandidatePool(blueprint, config) {
    const targetCount = blueprint.totalQuestions;
    const poolSize = Math.ceil(targetCount * 1.25); // 25% surplus for candidate pool
    const candidates = [];

    const subjects = Object.keys(blueprint.subjectAllocation);
    
    for (let i = 0; i < poolSize; i++) {
      const subject = subjects[i % subjects.length];
      const format = i % 2 === 0 ? 'statement-2' : 'direct';
      
      candidates.push({
        candidateId: `cand_${config.id}_${i + 1}`,
        subject: subject,
        discriminationTarget: `Distinguish core ${subject} concept from adjacent misconceptions`,
        format: format,
        difficulty: (i % 3 === 0) ? 'difficult' : (i % 2 === 0) ? 'moderate' : 'easy',
        questionText: `Candidate Question ${i + 1} for ${subject}`,
        options: [`Option A`, `Option B`, `Option C`, `Option D`],
        correctAnswer: 0,
        explanation: `Detailed explanation for Candidate Question ${i + 1}`,
        sourceAttribution: config.sourceHierarchy?.tier1?.[0] || 'NCERT'
      });
    }

    return {
      requestedTarget: targetCount,
      candidatePoolSize: candidates.length,
      candidates
    };
  }

  return { generateCandidatePool };
})();

if (typeof module !== 'undefined') module.exports = Generation;
