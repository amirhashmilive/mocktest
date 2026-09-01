/**
 * STAGE 11 — COMPREHENSIVE QUALITY SCORING
 * ========================================
 * Evaluates candidate across 8 quality dimensions for a 100-point composite score.
 * Decision: 85+ Accept, 75-84 Review, <75 Reject.
 */
const Quality = (() => {
  function scoreCandidate(candidate, verificationResult, adversarialResult, originalityResult) {
    let score = 0;

    // 1. Factual accuracy (25)
    score += verificationResult.status === 'VERIFIED' ? 25 : 10;
    // 2. Exam authenticity (20)
    score += candidate.subject ? 20 : 10;
    // 3. Conceptual depth (15)
    score += candidate.discriminationTarget ? 15 : 8;
    // 4. Distractor quality (15)
    score += (adversarialResult.distractorQualityRating || 3) * 3;
    // 5. Elimination value (10)
    score += candidate.format === 'statement-2' || candidate.format === 'statement-3' ? 10 : 7;
    // 6. Originality (5)
    score += originalityResult.originalityRiskScore <= 2 ? 5 : 1;
    // 7. Source reliability (5)
    score += verificationResult.checks.tier1SourceVerified ? 5 : 2;
    // 8. Language clarity (5)
    score += adversarialResult.flaws.length === 0 ? 5 : 2;

    let decision = 'REJECT';
    if (score >= 85) decision = 'ACCEPT';
    else if (score >= 75) decision = 'REVIEW';

    return {
      candidateId: candidate.candidateId,
      totalScore: score,
      decision,
      breakdown: {
        accuracy: verificationResult.status === 'VERIFIED' ? 25 : 10,
        authenticity: candidate.subject ? 20 : 10,
        conceptualDepth: candidate.discriminationTarget ? 15 : 8,
        distractors: (adversarialResult.distractorQualityRating || 3) * 3,
        eliminationValue: candidate.format === 'statement-2' || candidate.format === 'statement-3' ? 10 : 7,
        originality: originalityResult.originalityRiskScore <= 2 ? 5 : 1,
        sourceReliability: verificationResult.checks.tier1SourceVerified ? 5 : 2,
        clarity: adversarialResult.flaws.length === 0 ? 5 : 2
      }
    };
  }

  return { scoreCandidate };
})();

if (typeof module !== 'undefined') module.exports = Quality;
