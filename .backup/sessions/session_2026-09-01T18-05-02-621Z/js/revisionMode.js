/**
 * MOCKHARD — Revision Mode & Spaced Repetition Engine
 * ===================================================
 */

const RevisionMode = (() => {
  const REVISION_KEY = 'mockhard_revision';

  function getRevisionBank() {
    try {
      const raw = localStorage.getItem(REVISION_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function addQuestionsToRevision(questions, userAnswers, category, level) {
    const bank = getRevisionBank();
    const existingMap = new Map(bank.map(q => [q.id || q.question, q]));

    questions.forEach((q, idx) => {
      const userChoice = userAnswers[idx];
      const isCorrect = (userChoice === q.correct);

      if (!isCorrect && userChoice !== undefined && userChoice !== null) {
        const id = q.id || `${category}_${level}_${idx}_${q.question.substring(0, 10)}`;
        if (!existingMap.has(id)) {
          const entry = {
            ...q,
            id: id,
            category: category,
            level: level,
            wrongCount: 1,
            lastReviewed: new Date().toISOString(),
            nextReview: new Date(Date.now() + 86400000).toISOString() // 1 day
          };
          existingMap.set(id, entry);
        } else {
          const existing = existingMap.get(id);
          existing.wrongCount = (existing.wrongCount || 1) + 1;
          existing.lastReviewed = new Date().toISOString();
        }
      }
    });

    const updatedBank = Array.from(existingMap.values());
    localStorage.setItem(REVISION_KEY, JSON.stringify(updatedBank));
    return updatedBank;
  }

  function removeQuestion(id) {
    let bank = getRevisionBank();
    bank = bank.filter(q => q.id !== id);
    localStorage.setItem(REVISION_KEY, JSON.stringify(bank));
    return bank;
  }

  return {
    getRevisionBank,
    addQuestionsToRevision,
    removeQuestion
  };
})();
