/**
 * STAGE 9 — ADVERSARIAL REVIEW ENGINE
 * ===================================
 * Acts as a hostile reviewer searching for shortcuts, giveaways ("always", "never"),
 * formatting imbalances, and unintended ambiguities.
 */
const Adversarial = (() => {
  function reviewCandidate(candidate) {
    const qText = (candidate.questionText || '').toLowerCase();
    const flaws = [];

    // Check for extreme qualifiers
    if (qText.includes('always') || qText.includes('never') || qText.includes('only')) {
      flaws.push({ type: 'qualifier_clue', description: 'Question contains extreme qualifier clue' });
    }

    // Check option length symmetry
    const optLengths = (candidate.options || []).map(o => o.length);
    const maxLen = Math.max(...optLengths, 0);
    const minLen = Math.min(...optLengths, 0);
    if (maxLen > minLen * 3 && minLen > 0) {
      flaws.push({ type: 'length_asymmetry', description: 'One option is substantially longer than others' });
    }

    const distractorQualityRating = flaws.length === 0 ? 5 : flaws.length === 1 ? 3 : 1;

    return {
      candidateId: candidate.candidateId,
      status: flaws.length === 0 ? 'PASSED_ADVERSARIAL' : 'FLAGGED_WITH_FLAWS',
      flaws,
      distractorQualityRating
    };
  }

  return { reviewCandidate };
})();

if (typeof module !== 'undefined') module.exports = Adversarial;
