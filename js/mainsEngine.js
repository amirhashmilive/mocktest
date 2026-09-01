/**
 * MOCKHARD — Mains Engine
 * =======================
 * Handles UPSC Mains descriptive/essay test logic:
 *   - Loading questions from paper-specific JSON files
 *   - Word count tracking
 *   - Answer state management
 *   - Submission and scoring
 */
const MainsEngine = (() => {
  let questions = [];
  let answers = {};
  let paperConfig = null;
  let examConfig = null;

  async function init(params) {
    const { category, level, paperIdx, paperId, optional } = params;
    examConfig = await QuestionLoader.loadExamConfig(category);
    if (!examConfig) {
      console.error('Failed to load exam config for', category);
      return { questions: [], paper: null };
    }

    const papers = examConfig.papers || [];
    paperConfig = papers[parseInt(paperIdx)] || papers[0];

    // Load questions from paper subfolder
    const levelFile = level.replace(/\+/g, 'plus');
    const paperSlug = paperId || paperConfig.id;
    const url = `data/questions/${category}/${paperSlug}/level-${levelFile}.json`;

    try {
      const resp = await fetch(url);
      if (resp.ok) {
        questions = await resp.json();
      } else {
        // Fallback to top-level combined file
        const fallbackResp = await fetch(`data/questions/${category}/level-${levelFile}.json`);
        if (fallbackResp.ok) {
          const allQ = await fallbackResp.json();
          questions = allQ.filter(q => q.paperId === paperSlug);
          if (questions.length === 0) questions = allQ.slice(0, paperConfig.questions || 20);
        }
      }
    } catch (err) {
      console.error('Failed to load mains questions:', err);
      questions = [];
    }

    // Limit to paper question count
    const maxQs = paperConfig.questions || 20;
    if (questions.length > maxQs) {
      questions = RotationEngine.shuffle(questions).slice(0, maxQs);
    }

    // Initialize empty answers
    answers = {};
    questions.forEach((q, i) => {
      answers[i] = '';
    });

    return { questions, paper: paperConfig };
  }

  function saveAnswer(index, text) {
    answers[index] = text;
  }

  function getAnswer(index) {
    return answers[index] || '';
  }

  function getWordCount(text) {
    if (!text || text.trim().length === 0) return 0;
    return text.trim().split(/\s+/).length;
  }

  function getAllAnswers() {
    return { ...answers };
  }

  function getQuestions() {
    return questions;
  }

  function getPaperConfig() {
    return paperConfig;
  }

  function getExamConfig() {
    return examConfig;
  }

  function calculateResults() {
    let attempted = 0;
    let totalWordCount = 0;

    questions.forEach((q, i) => {
      const ans = answers[i] || '';
      if (ans.trim().length > 0) {
        attempted++;
        totalWordCount += getWordCount(ans);
      }
    });

    return {
      total: questions.length,
      attempted,
      unattempted: questions.length - attempted,
      totalWordCount,
      avgWordCount: attempted > 0 ? Math.round(totalWordCount / attempted) : 0,
      paper: paperConfig,
      answers: { ...answers },
      questions: [...questions]
    };
  }

  return {
    init,
    saveAnswer,
    getAnswer,
    getWordCount,
    getAllAnswers,
    getQuestions,
    getPaperConfig,
    getExamConfig,
    calculateResults
  };
})();

if (typeof module !== 'undefined') module.exports = MainsEngine;
