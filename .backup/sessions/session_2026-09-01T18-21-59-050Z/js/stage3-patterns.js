/**
 * STAGE 3 — PATTERN INTELLIGENCE
 * ==============================
 * Analyzes recurring topics, concepts, option ecosystems, and trend velocity.
 */
const Patterns = (() => {
  function analyzePatterns(classifiedQuestions) {
    const topicFrequency = {};
    const conceptRecurrence = {};
    const distractorEcosystem = {};

    classifiedQuestions.forEach(q => {
      const topic = q.topic || 'General';
      topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;

      // Extract key terms for concept recurrence
      const words = (q.question || '').toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
      words.forEach(w => {
        if (!['which', 'following', 'statement', 'correct', 'consider', 'about'].includes(w)) {
          conceptRecurrence[w] = (conceptRecurrence[w] || 0) + 1;
        }
      });

      // Track distractors
      (q.options || []).forEach((opt, idx) => {
        if (idx !== q.correctAnswer) {
          distractorEcosystem[opt] = (distractorEcosystem[opt] || 0) + 1;
        }
      });
    });

    return {
      totalAnalyzed: classifiedQuestions.length,
      topicFrequency,
      topConcepts: Object.entries(conceptRecurrence)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([concept, count]) => ({ concept, count })),
      recycledDistractors: Object.entries(distractorEcosystem)
        .filter(([, count]) => count > 1)
        .map(([distractor, count]) => ({ distractor, count }))
    };
  }

  return { analyzePatterns };
})();

if (typeof module !== 'undefined') module.exports = Patterns;
