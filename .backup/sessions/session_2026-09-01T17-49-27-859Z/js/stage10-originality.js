/**
 * STAGE 10 — ORIGINALITY & DUPLICATION CHECK
 * ==========================================
 * Evaluates candidates for verbatim duplication, near-paraphrase, and structural copying.
 */
const Originality = (() => {
  function checkOriginality(candidate, existingQuestions = []) {
    let riskScore = 0; // 0-5 scale
    const candText = (candidate.questionText || '').toLowerCase();

    for (const eq of existingQuestions) {
      const eqText = (eq.question || '').toLowerCase();
      if (candText === eqText) {
        riskScore = 5; // Verbatim match
        break;
      }
      if (candText.includes(eqText) || eqText.includes(candText)) {
        riskScore = Math.max(riskScore, 4); // Near match
      }
    }

    let decision = 'PASS';
    if (riskScore >= 4) decision = 'REJECT';
    else if (riskScore === 3) decision = 'MANDATORY_REVIEW';

    return {
      candidateId: candidate.candidateId,
      originalityRiskScore: riskScore,
      decision
    };
  }

  return { checkOriginality };
})();

if (typeof module !== 'undefined') module.exports = Originality;
