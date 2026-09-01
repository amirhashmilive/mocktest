/**
 * QUESTION LOADER
 * ===============
 * Async fetcher for category and level JSON question files with caching.
 */
const QuestionLoader = (() => {
  const cache = {};
  let manifestCache = null;

  async function loadManifest() {
    if (manifestCache) return manifestCache;
    try {
      const response = await fetch('data/manifest.json');
      if (!response.ok) throw new Error(`Manifest fetch failed: ${response.status}`);
      manifestCache = await response.json();
      return manifestCache;
    } catch (err) {
      console.warn('Could not load manifest.json, using fallback:', err);
      return null;
    }
  }

  async function load(category, level = 'C') {
    const key = `${category}_${level}`;
    if (cache[key]) return cache[key];

    const levelFile = level.replace('+', 'plus'); // A+ -> Aplus
    const url = `data/questions/${category}/level-${levelFile}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const questions = await response.json();
      cache[key] = questions;
      return questions;
    } catch (err) {
      console.error(`Failed to load question bank for ${category}/${level}:`, err);
      // Fallback: try loading inline legacy data if window[category] exists
      if (typeof window !== 'undefined' && window[category]) {
        console.warn(`Using legacy window[${category}] data fallback`);
        return window[category];
      }
      return [];
    }
  }

  async function loadExamConfig(examId) {
    try {
      const response = await fetch(`data/examination-configs/${examId}.json`);
      if (!response.ok) throw new Error(`Config fetch failed: ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn(`Could not load exam config for ${examId}:`, err);
      return null;
    }
  }

  const CATEGORIES = [
    { id: 'upsc', name: 'UPSC Civil Services' },
    { id: 'ssc', name: 'SSC CGL / CHSL' },
    { id: 'railways', name: 'Railways RRB' },
    { id: 'neet', name: 'NEET UG' },
    { id: 'norcet', name: 'AIIMS NORCET' },
    { id: 'jee', name: 'JEE Main' },
    { id: 'gate', name: 'GATE Exam' },
    { id: 'clat', name: 'CLAT Law' },
    { id: 'board', name: 'Board Examinations' },
    { id: 'defence', name: 'Defence (NDA/CDS)' }
  ];

  function getCategories() {
    return CATEGORIES;
  }

  async function getQuestionsForCategory(category, level = 'C') {
    return await load(category, level);
  }

  return { load, loadManifest, loadExamConfig, getCategories, getQuestionsForCategory };
})();

if (typeof module !== 'undefined') module.exports = QuestionLoader;
