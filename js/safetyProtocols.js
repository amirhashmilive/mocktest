/**
 * MOCKHARD — Safety & Recovery Protocols Engine
 * ====================================================
 * Handles periodic auto-saving, seamless page refresh recovery,
 * crash restoration, and cleanup of stale/expired paper states.
 */

const SafetyProtocols = (() => {
  let autoSaveInterval = null;

  /**
   * Starts periodic auto-save interval (every 30s)
   */
  function startAutoSave(testEngine) {
    stopAutoSave();
    if (!testEngine) return;

    autoSaveInterval = setInterval(() => {
      try {
        testEngine.saveState();
        console.log(`💾 SafetyProtocols: Auto-saved state for paper ${testEngine.paperId}`);
      } catch (err) {
        console.warn('SafetyProtocols auto-save error:', err);
      }
    }, 30000); // 30 seconds
  }

  /**
   * Stops active auto-save interval
   */
  function stopAutoSave() {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
      autoSaveInterval = null;
    }
  }

  /**
   * Handles page refresh by looking up active paper ID from sessionStorage
   */
  function handleRefresh() {
    try {
      const paperId = sessionStorage.getItem('currentPaperId');
      if (paperId && typeof TestEngine !== 'undefined') {
        const savedState = TestEngine.loadState(paperId);
        if (savedState) return savedState;
      }
    } catch (e) {
      console.warn('SafetyProtocols handleRefresh failed:', e);
    }
    return null;
  }

  /**
   * Scans localStorage for un-submitted test states in case of browser crash
   */
  function handleCrashRecovery() {
    try {
      const keys = Object.keys(localStorage);
      const testStateKeys = keys.filter(k => k.startsWith('test_state_'));

      if (testStateKeys.length === 0) return null;

      let latestState = null;
      let latestTimestamp = 0;

      testStateKeys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data && data.savedAt) {
            const ts = new Date(data.savedAt).getTime();
            if (ts > latestTimestamp) {
              latestTimestamp = ts;
              latestState = data;
            }
          }
        } catch (e) {}
      });

      return latestState;
    } catch (err) {
      console.warn('SafetyProtocols crash recovery check failed:', err);
      return null;
    }
  }

  /**
   * Resumes test state & paper object by paperId
   */
  function resumeTest(paperId) {
    if (!paperId) return null;
    const state = (typeof TestEngine !== 'undefined') ? TestEngine.loadState(paperId) : null;
    const paper = (typeof PaperEngine !== 'undefined') ? PaperEngine.loadPaper(paperId) : null;

    if (state && paper) {
      return { state, paper };
    }
    return null;
  }

  /**
   * Cleans up expired paper & state entries older than 24 hours (86,400,000 ms)
   */
  function clearExpiredStates() {
    let count = 0;
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      const maxAgeMs = 86400000; // 24 hours

      keys.forEach(key => {
        if (key.startsWith('test_state_') || key.startsWith('paper_')) {
          try {
            const raw = localStorage.getItem(key);
            const data = JSON.parse(raw);
            const timestamp = data.savedAt || data.createdAt;
            if (timestamp) {
              const age = now - new Date(timestamp).getTime();
              if (age > maxAgeMs) {
                localStorage.removeItem(key);
                count++;
              }
            } else {
              localStorage.removeItem(key);
              count++;
            }
          } catch (e) {
            localStorage.removeItem(key);
            count++;
          }
        }
      });
      console.log(`🧹 SafetyProtocols: Cleansed ${count} expired test state(s).`);
    } catch (err) {
      console.warn('Error clearing expired states:', err);
    }
    return count;
  }

  return {
    startAutoSave,
    stopAutoSave,
    handleRefresh,
    handleCrashRecovery,
    resumeTest,
    clearExpiredStates
  };
})();

if (typeof module !== 'undefined') module.exports = SafetyProtocols;
