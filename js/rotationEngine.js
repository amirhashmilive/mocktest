/**
 * ROTATION ENGINE
 * ===============
 * Handles question selection, shuffling, and rotation tracking via localStorage.
 */
const RotationEngine = (() => {
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getUsedIds(category, level = 'C') {
    try {
      const key = `mockhard_used_${category}_${level}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      return [];
    }
  }

  function recordUsedIds(category, level = 'C', ids = []) {
    try {
      const key = `mockhard_used_${category}_${level}`;
      const existing = getUsedIds(category, level);
      const combined = [...new Set([...existing, ...ids])];
      // Keep last 500 to prevent localStorage bloat
      const trimmed = combined.slice(-500);
      localStorage.setItem(key, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Failed to save used question IDs to localStorage:', e);
    }
  }

  function select(pool, count = 120, usedIds = []) {
    if (!pool || pool.length === 0) return [];
    if (pool.length <= count) return shuffle(pool);

    // Prioritize evidence-driven questions (e.g. FINAL_50_v4.md)
    const evidencePool = pool.filter(q => q.source === 'FINAL_50_v4.md' || q.sourceFile === 'FINAL_50_v4.md');
    const normalPool = pool.filter(q => q.source !== 'FINAL_50_v4.md' && q.sourceFile !== 'FINAL_50_v4.md');

    if (evidencePool.length > 0) {
      const freshEvidence = evidencePool.filter(q => !usedIds.includes(q.id));
      const usedEvidence = evidencePool.filter(q => usedIds.includes(q.id));
      
      const selectedEvidence = freshEvidence.length > 0 ? shuffle(freshEvidence) : shuffle(usedEvidence);
      
      if (selectedEvidence.length >= count) {
        return selectedEvidence.slice(0, count);
      }
      
      const remainingCount = count - selectedEvidence.length;
      const normalSelected = select(normalPool, remainingCount, usedIds);
      return [...selectedEvidence, ...normalSelected];
    }

    const fresh = pool.filter(q => !usedIds.includes(q.id));
    const used = pool.filter(q => usedIds.includes(q.id));

    let selected = [];
    if (fresh.length >= count) {
      selected = shuffle(fresh).slice(0, count);
    } else {
      const needed = count - fresh.length;
      selected = [...shuffle(fresh), ...shuffle(used).slice(0, needed)];
      selected = shuffle(selected);
    }
    return selected;
  }

  return { shuffle, select, getUsedIds, recordUsedIds };
})();

if (typeof module !== 'undefined') module.exports = RotationEngine;
