/**
 * MOCKHARD — Paper Generation Engine
 * ====================================================
 * Generates unique, randomized test paper sets with shuffled
 * question sequence and option orders while preserving grading accuracy.
 */

class PaperEngine {
  constructor(config = {}) {
    this.category = config.category || 'upsc';
    this.level = config.level || 'C';
    this.subject = config.subject || null;
    this.questionCount = config.questionCount || 50;
    this.paperId = config.paperId || this.generatePaperId();
    this.questions = [];
    this.createdAt = config.createdAt || new Date().toISOString();
    this.seed = config.seed || Math.random().toString(36).substring(7);
  }

  generatePaperId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `P-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Generates a brand-new randomized paper
   */
  async generatePaper() {
    console.log(`📄 Generating randomized test paper: ${this.paperId} [Category: ${this.category}, Level: ${this.level}]`);
    
    // Load question pool via QuestionLoader or JSON fetch
    const pool = await this.loadQuestionPool();
    
    // Randomly select specified question count
    const selected = this.selectRandomQuestions(pool, this.questionCount);
    
    // Deep clone questions so we don't mutate global pool in memory
    const cloned = JSON.parse(JSON.stringify(selected));
    
    // Shuffle question order
    this.shuffleArray(cloned);
    
    // Shuffle options for each question & update correct index
    cloned.forEach((q, idx) => {
      q.paperQuestionIndex = idx;
      this.shuffleQuestionOptions(q);
    });
    
    this.questions = cloned;
    return this.questions;
  }

  /**
   * Loads raw question pool
   */
  async loadQuestionPool() {
    if (typeof QuestionLoader !== 'undefined') {
      try {
        const pool = await QuestionLoader.load(this.category, this.level, this.subject);
        if (pool && pool.length > 0) return pool;
      } catch (err) {
        console.warn('QuestionLoader failed, using direct fetch fallback:', err);
      }
    }

    // Direct fetch fallback
    try {
      const levelFile = (this.level || 'C').replace('+', 'plus');
      const url = `data/questions/${this.category}/level-${levelFile}.json`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : data.questions || [];
      }
    } catch (error) {
      console.error('❌ Failed to fetch question pool directly:', error);
    }

    // Window fallback dataset
    if (typeof window !== 'undefined' && window[`${this.category.toUpperCase()}_QUESTIONS`]) {
      return window[`${this.category.toUpperCase()}_QUESTIONS`];
    }
    if (typeof UPSC_QUESTIONS !== 'undefined') return UPSC_QUESTIONS;

    return [];
  }

  /**
   * Randomly selects N questions from pool
   */
  selectRandomQuestions(pool, count) {
    if (!pool || pool.length === 0) return [];
    const shuffled = [...pool];
    this.shuffleArray(shuffled);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Shuffles options of a question while accurately re-mapping the correct answer
   */
  shuffleQuestionOptions(question) {
    if (!question || !question.options) return;

    let optionsArray = [];
    let originalCorrectIdx = 0;

    // Handle array vs object options
    if (Array.isArray(question.options)) {
      optionsArray = [...question.options];
      originalCorrectIdx = typeof question.correct === 'number' ? question.correct : 0;
    } else if (typeof question.options === 'object') {
      const keys = ['a', 'b', 'c', 'd'];
      optionsArray = keys.map(k => question.options[k]);
      if (typeof question.correct === 'string') {
        originalCorrectIdx = keys.indexOf(question.correct.toLowerCase());
        if (originalCorrectIdx === -1) originalCorrectIdx = 0;
      } else {
        originalCorrectIdx = question.correct || 0;
      }
    }

    // Extract text of correct option before shuffle
    const correctText = optionsArray[originalCorrectIdx];

    // Store original details in metadata
    question.originalOptions = [...optionsArray];
    question.originalCorrectIndex = originalCorrectIdx;

    // Create paired array: { text, isCorrect }
    const optionPairs = optionsArray.map((text, idx) => ({
      text,
      isCorrect: idx === originalCorrectIdx
    }));

    // Shuffle option pairs
    this.shuffleArray(optionPairs);

    // Extract new options and find new correct index
    const newOptions = optionPairs.map(p => p.text);
    const newCorrectIdx = optionPairs.findIndex(p => p.isCorrect);

    // Update question object
    question.options = newOptions;
    question.correct = newCorrectIdx >= 0 ? newCorrectIdx : 0;
    question.correctAnswer = newCorrectIdx >= 0 ? newCorrectIdx : 0;
    question.correctText = correctText;
  }

  /**
   * Saves paper to localStorage for persistence & resume
   */
  savePaper() {
    const paperData = {
      paperId: this.paperId,
      category: this.category,
      level: this.level,
      subject: this.subject,
      questionCount: this.questionCount,
      questions: this.questions,
      createdAt: this.createdAt,
      seed: this.seed
    };
    try {
      localStorage.setItem(`paper_${this.paperId}`, JSON.stringify(paperData));
    } catch (e) {
      console.warn('Could not save paper to localStorage:', e);
    }
    return paperData;
  }

  /**
   * Loads paper from localStorage by paperId
   */
  static loadPaper(paperId) {
    if (!paperId) return null;
    try {
      const raw = localStorage.getItem(`paper_${paperId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(`Failed to load paper ${paperId}:`, e);
    }
    return null;
  }
}

if (typeof module !== 'undefined') module.exports = PaperEngine;
