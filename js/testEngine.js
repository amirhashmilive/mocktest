/**
 * MOCKHARD — Advanced Test Engine
 * ====================================================
 * Manages test execution state, active question navigation,
 * user response tracking, bookmarks, progress metrics, and state persistence.
 */

class TestEngine {
  constructor(config = {}) {
    this.paperId = config.paperId || null;
    this.category = config.category || 'upsc';
    this.level = config.level || 'C';
    this.subject = config.subject || null;
    this.totalQuestions = config.totalQuestions || 50;
    this.timeLimit = config.timeLimit || 100; // in minutes
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.markedForReview = {};
    this.timeSpent = 0; // seconds
    this.isPaused = false;
    this.paper = null;
    this.startTime = Date.now();
  }

  /**
   * Initializes test engine: resumes saved state if paperId provided or creates new paper
   */
  async initialize() {
    // 1. Try resuming existing paper state
    if (this.paperId) {
      const savedState = TestEngine.loadState(this.paperId);
      const savedPaper = (typeof PaperEngine !== 'undefined') ? PaperEngine.loadPaper(this.paperId) : null;

      if (savedState && savedPaper) {
        this.paper = savedPaper;
        this.category = savedState.category || this.category;
        this.level = savedState.level || this.level;
        this.subject = savedState.subject || this.subject;
        this.currentQuestionIndex = savedState.currentQuestionIndex || 0;
        this.answers = savedState.answers || {};
        this.markedForReview = savedState.markedForReview || {};
        this.timeSpent = savedState.timeSpent || 0;
        console.log(`🔄 Resumed test state for paper ${this.paperId} at question ${this.currentQuestionIndex + 1}`);
        return true;
      }
    }

    // 2. Generate new paper if no active paper loaded
    if (typeof PaperEngine !== 'undefined') {
      const engine = new PaperEngine({
        category: this.category,
        level: this.level,
        subject: this.subject,
        questionCount: this.totalQuestions
      });

      const questions = await engine.generatePaper();
      engine.savePaper();

      this.paper = {
        paperId: engine.paperId,
        category: engine.category,
        level: engine.level,
        subject: engine.subject,
        questions: questions
      };
      this.paperId = engine.paperId;
    } else {
      console.error('PaperEngine is not defined!');
    }

    this.saveState();
    return true;
  }

  /**
   * Returns current active question object
   */
  getCurrentQuestion() {
    if (!this.paper || !this.paper.questions || this.paper.questions.length === 0) {
      return null;
    }
    return this.paper.questions[this.currentQuestionIndex] || null;
  }

  /**
   * Returns total count of questions in paper
   */
  getQuestionCount() {
    return (this.paper && this.paper.questions) ? this.paper.questions.length : 0;
  }

  /**
   * Records candidate answer for question at index
   */
  answerQuestion(index, answerIdx) {
    if (answerIdx === null || answerIdx === undefined) {
      delete this.answers[index];
    } else {
      this.answers[index] = answerIdx;
    }
    this.saveState();
  }

  /**
   * Toggles bookmark / review status for question at index
   */
  markForReview(index) {
    this.markedForReview[index] = !this.markedForReview[index];
    this.saveState();
    return !!this.markedForReview[index];
  }

  /**
   * Navigates to next question
   */
  goToNext() {
    if (this.currentQuestionIndex < this.getQuestionCount() - 1) {
      this.currentQuestionIndex++;
      this.saveState();
      return true;
    }
    return false;
  }

  /**
   * Navigates to previous question
   */
  goToPrevious() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.saveState();
      return true;
    }
    return false;
  }

  /**
   * Jumps to specific question index
   */
  jumpToQuestion(index) {
    if (index >= 0 && index < this.getQuestionCount()) {
      this.currentQuestionIndex = index;
      this.saveState();
      return true;
    }
    return false;
  }

  /**
   * Returns progress stats
   */
  getProgress() {
    const answered = Object.keys(this.answers).length;
    const total = this.getQuestionCount();
    const bookmarked = Object.values(this.markedForReview).filter(Boolean).length;
    return {
      answered,
      total,
      unanswered: total - answered,
      bookmarked,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0
    };
  }

  /**
   * Calculates final test result metrics
   */
  getResults() {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const questionResults = [];

    const questions = (this.paper && this.paper.questions) ? this.paper.questions : [];

    questions.forEach((q, idx) => {
      const uAnswer = this.answers[idx];
      const isAnswered = uAnswer !== undefined && uAnswer !== null;

      // Handle correct index matching
      const cAnswer = (q.correct !== undefined) ? q.correct : q.correctAnswer;
      const isCorrect = isAnswered && Number(uAnswer) === Number(cAnswer);

      if (isAnswered) {
        if (isCorrect) correct++;
        else incorrect++;
      } else {
        unanswered++;
      }

      questionResults.push({
        index: idx,
        question: q,
        userAnswer: isAnswered ? uAnswer : null,
        correctAnswer: cAnswer,
        isCorrect: isCorrect,
        isAnswered: isAnswered
      });
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      paperId: this.paperId,
      category: this.category,
      level: this.level,
      total,
      correct,
      incorrect,
      unanswered,
      score: correct,
      percentage,
      timeTaken: this.timeSpent,
      questionResults,
      questions,
      answers: this.answers,
      bookmarked: Object.keys(this.markedForReview).filter(k => this.markedForReview[k]).map(Number),
      date: new Date().toISOString()
    };
  }

  /**
   * Saves test state to localStorage & sessionStorage
   */
  saveState() {
    if (!this.paperId) return;

    const state = {
      paperId: this.paperId,
      category: this.category,
      level: this.level,
      subject: this.subject,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      markedForReview: this.markedForReview,
      timeSpent: this.timeSpent,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`test_state_${this.paperId}`, JSON.stringify(state));
      sessionStorage.setItem('currentPaperId', this.paperId);
    } catch (e) {
      console.warn('Failed to save test_state:', e);
    }
  }

  /**
   * Loads test state by paperId
   */
  static loadState(paperId) {
    if (!paperId) return null;
    try {
      const raw = localStorage.getItem(`test_state_${paperId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(`Failed to load test_state for ${paperId}:`, e);
    }
    return null;
  }

  /**
   * Clears saved state upon submission or reset
   */
  clearState() {
    if (this.paperId) {
      try {
        localStorage.removeItem(`test_state_${this.paperId}`);
        localStorage.removeItem(`paper_${this.paperId}`);
        sessionStorage.removeItem('currentPaperId');
      } catch (e) {
        console.warn('Failed to clear test state:', e);
      }
    }
  }
}

if (typeof module !== 'undefined') module.exports = TestEngine;
