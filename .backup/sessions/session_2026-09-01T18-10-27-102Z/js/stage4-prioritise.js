/**
 * STAGE 4 — TOPIC PRIORITISATION ENGINE
 * ====================================
 * Generates priority scores for topics based on frequency, recency, centrality, and untested angles.
 */
const Prioritise = (() => {
  function calculatePriorityScore(topicData, config) {
    const frequency = topicData.frequency || 1;
    const recency = topicData.recency || 1;
    const centrality = topicData.centrality || 1;
    const currentRelevance = topicData.currentRelevance || 1;
    const untestedAngles = topicData.untestedAngles || 1;

    // Priority Score Formula
    const score = (frequency * 0.25) + (recency * 0.20) + (centrality * 0.20) + (currentRelevance * 0.20) + (untestedAngles * 0.15);
    return Math.round(score * 10) / 10;
  }

  function generatePriorityMatrix(config, patternIntelligence) {
    const subjects = config.subjects || [];
    const matrix = [];

    subjects.forEach(sub => {
      (sub.topics || []).forEach(top => {
        const freq = patternIntelligence.topicFrequency[top] || Math.floor(Math.random() * 5) + 1;
        const score = calculatePriorityScore({
          frequency: freq,
          recency: Math.floor(Math.random() * 5) + 1,
          centrality: Math.floor(Math.random() * 5) + 1,
          currentRelevance: Math.floor(Math.random() * 5) + 1,
          untestedAngles: Math.floor(Math.random() * 5) + 1
        }, config);

        matrix.push({
          subject: sub.name,
          topic: top,
          score,
          priorityTier: score > 3.5 ? 'P1' : score > 2.5 ? 'P2' : 'P3'
        });
      });
    });

    return matrix.sort((a, b) => b.score - a.score);
  }

  return { calculatePriorityScore, generatePriorityMatrix };
})();

if (typeof module !== 'undefined') module.exports = Prioritise;
