/**
 * STAGE 1 — QUESTION EXTRACTOR & PARSER
 * =====================================
 * Converts previous question papers and raw source data into structured intelligence records.
 */
const Extractor = (() => {
  function extractQuestions(paperData, config) {
    const questions = paperData.questions || [];
    return questions.map((raw, idx) => ({
      id: raw.id || `${config.id}_pyq_${idx + 1}`,
      year: raw.year || 2024,
      question: raw.question || raw.q,
      options: raw.options || raw.o,
      correctAnswer: raw.correct !== undefined ? raw.correct : raw.c,
      explanation: raw.explanation || raw.e,
      subject: raw.subject || 'General',
      topic: raw.topic || 'General',
      microTopic: raw.microTopic || raw.topic || 'General',
      knowledgeType: raw.knowledgeType || 'factual', // factual | conceptual | application | analytical
      questionFormat: raw.questionFormat || 'direct',
      difficulty: raw.difficulty || 5,
      trapMechanism: raw.trapMechanism || 'none',
      source: raw.source || 'official_pyq',
      answerKeyAuthority: raw.answerKeyAuthority || 'Official Key'
    }));
  }

  return { extractQuestions };
})();

if (typeof module !== 'undefined') module.exports = Extractor;
