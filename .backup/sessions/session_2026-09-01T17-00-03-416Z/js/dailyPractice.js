/**
 * MOCKHARD — Daily Practice & Streak Tracker
 * ==========================================
 */

const DailyPractice = (() => {
  const DAILY_KEY = 'mockhard_daily_practice';

  function getDailyState() {
    try {
      const raw = localStorage.getItem(DAILY_KEY);
      const today = new Date().toISOString().split('T')[0];
      let data = raw ? JSON.parse(raw) : null;

      if (!data || data.date !== today) {
        data = {
          date: today,
          goal: (data && data.goal) || 10,
          completedCount: 0,
          history: (data && data.history) || {}
        };
      }
      return data;
    } catch (e) {
      return { date: new Date().toISOString().split('T')[0], goal: 10, completedCount: 0, history: {} };
    }
  }

  function saveDailyState(state) {
    localStorage.setItem(DAILY_KEY, JSON.stringify(state));
  }

  function incrementDailyCount(count = 1) {
    const state = getDailyState();
    state.completedCount += count;
    state.history[state.date] = state.completedCount;
    saveDailyState(state);
    return state;
  }

  function setDailyGoal(goal) {
    const state = getDailyState();
    state.goal = parseInt(goal) || 10;
    saveDailyState(state);
    return state;
  }

  return {
    getDailyState,
    incrementDailyCount,
    setDailyGoal
  };
})();
