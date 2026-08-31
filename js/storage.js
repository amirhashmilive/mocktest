/* ============================================================
   MOCKHARD — localStorage Management
   Handles all persistent state: test history, progress,
   streaks, bookmarks, theme, and in-progress tests.
   ============================================================ */

const MockStorage = (() => {
  // ── Keys ──
  const KEYS = {
    THEME: 'mockhard_theme',
    TESTS: 'mockhard_tests',
    STREAK: 'mockhard_streak',
    IN_PROGRESS: 'mockhard_inProgress',
  };

  // ── Helpers ──
  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('MockStorage: write failed', e);
    }
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  // ────────────────────────────────────────
  // THEME
  // ────────────────────────────────────────
  function getTheme() {
    return get(KEYS.THEME, 'light');
  }

  function setTheme(theme) {
    set(KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
  }

  // ────────────────────────────────────────
  // TEST HISTORY
  // ────────────────────────────────────────
  function getTestHistory(category = null) {
    const tests = get(KEYS.TESTS, []);
    if (category) {
      return tests.filter(t => t.category === category);
    }
    return tests;
  }

  function saveTestResult(result) {
    const tests = get(KEYS.TESTS, []);
    const entry = {
      id: generateId(),
      category: result.category,
      categoryName: result.categoryName || result.category,
      date: new Date().toISOString(),
      score: result.score,
      total: result.total,
      timeTaken: result.timeTaken, // seconds
      answers: result.answers, // { questionIndex: selectedOptionIndex | null }
      bookmarked: result.bookmarked || [],
      mode: result.mode || 'standard', // 'standard' | 'random'
    };
    tests.unshift(entry); // newest first

    // Keep only last 100 tests to avoid storage bloat
    if (tests.length > 100) tests.length = 100;

    set(KEYS.TESTS, tests);
    updateStreak();
    return entry;
  }

  function getTestById(id) {
    const tests = get(KEYS.TESTS, []);
    return tests.find(t => t.id === id) || null;
  }

  function clearTestHistory() {
    set(KEYS.TESTS, []);
  }

  // ────────────────────────────────────────
  // IN-PROGRESS TEST (Auto-save)
  // ────────────────────────────────────────
  function getInProgress() {
    return get(KEYS.IN_PROGRESS, null);
  }

  function saveInProgress(state) {
    set(KEYS.IN_PROGRESS, {
      category: state.category,
      categoryName: state.categoryName || state.category,
      answers: state.answers,
      bookmarked: state.bookmarked || [],
      timeRemaining: state.timeRemaining,
      currentQuestion: state.currentQuestion,
      mode: state.mode || 'standard',
      // For random mode, store the actual question IDs used
      questionIds: state.questionIds || null,
      selectedCategories: state.selectedCategories || null,
      savedAt: new Date().toISOString(),
    });
  }

  function clearInProgress() {
    localStorage.removeItem(KEYS.IN_PROGRESS);
  }

  // ────────────────────────────────────────
  // STREAK TRACKING
  // ────────────────────────────────────────
  function getStreak() {
    return get(KEYS.STREAK, { current: 0, lastDate: null, best: 0 });
  }

  function updateStreak() {
    const streak = getStreak();
    const today = new Date().toISOString().split('T')[0];

    if (streak.lastDate === today) {
      // Already counted today
      return streak;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (streak.lastDate === yesterday) {
      // Consecutive day
      streak.current += 1;
    } else if (streak.lastDate !== today) {
      // Streak broken — reset
      streak.current = 1;
    }

    streak.lastDate = today;
    if (streak.current > streak.best) {
      streak.best = streak.current;
    }

    set(KEYS.STREAK, streak);
    return streak;
  }

  // ────────────────────────────────────────
  // STATISTICS
  // ────────────────────────────────────────
  function getOverallStats() {
    const tests = get(KEYS.TESTS, []);
    if (tests.length === 0) {
      return {
        totalTests: 0,
        avgScore: 0,
        totalQuestions: 0,
        totalTime: 0,
        avgAccuracy: 0,
      };
    }

    const totalTests = tests.length;
    const totalCorrect = tests.reduce((sum, t) => sum + t.score, 0);
    const totalQuestions = tests.reduce((sum, t) => sum + t.total, 0);
    const totalTime = tests.reduce((sum, t) => sum + (t.timeTaken || 0), 0);
    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return {
      totalTests,
      avgScore: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      totalQuestions,
      totalTime,
      avgAccuracy,
    };
  }

  function getCategoryStats() {
    const tests = get(KEYS.TESTS, []);
    const stats = {};

    tests.forEach(t => {
      if (!stats[t.category]) {
        stats[t.category] = {
          category: t.category,
          categoryName: t.categoryName || t.category,
          attempts: 0,
          totalCorrect: 0,
          totalQuestions: 0,
          bestScore: 0,
          totalTime: 0,
        };
      }
      const s = stats[t.category];
      s.attempts += 1;
      s.totalCorrect += t.score;
      s.totalQuestions += t.total;
      s.totalTime += (t.timeTaken || 0);
      const pct = t.total > 0 ? Math.round((t.score / t.total) * 100) : 0;
      if (pct > s.bestScore) s.bestScore = pct;
    });

    // Calculate accuracy for each
    Object.values(stats).forEach(s => {
      s.accuracy = s.totalQuestions > 0 ? Math.round((s.totalCorrect / s.totalQuestions) * 100) : 0;
    });

    return stats;
  }

  function getRecentTests(limit = 10) {
    return get(KEYS.TESTS, []).slice(0, limit);
  }

  function getScoreTrend(limit = 10) {
    const tests = get(KEYS.TESTS, []).slice(0, limit).reverse(); // oldest first for chart
    return tests.map(t => ({
      date: t.date,
      category: t.categoryName || t.category,
      score: t.total > 0 ? Math.round((t.score / t.total) * 100) : 0,
    }));
  }

  function getWeakCategories(topN = 5) {
    const stats = getCategoryStats();
    return Object.values(stats)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, topN);
  }

  // ── Public API ──
  return {
    // Theme
    getTheme,
    setTheme,
    toggleTheme,
    // Test history
    getTestHistory,
    saveTestResult,
    getTestById,
    clearTestHistory,
    // In-progress
    getInProgress,
    saveInProgress,
    clearInProgress,
    // Streak
    getStreak,
    updateStreak,
    // Stats
    getOverallStats,
    getCategoryStats,
    getRecentTests,
    getScoreTrend,
    getWeakCategories,
  };
})();
