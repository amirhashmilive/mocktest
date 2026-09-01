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
    { id: 'state-psc', name: 'State PSC (BPSC, UPPSC, MPPSC)' },
    { id: 'ssc', name: 'SSC Exams (CGL, CPO, CHSL, MTS, GD, Delhi Police)' },
    { id: 'railways', name: 'Railways RRB (NTPC, ALP, RPF)' },
    { id: 'neet', name: 'NEET UG Medical' },
    { id: 'jee', name: 'JEE Main & Advanced' },
    { id: 'cuet', name: 'CUET UG Entrance' },
    { id: 'gate', name: 'GATE & Engineering (JE Civil/Elec/Mech)' },
    { id: 'norcet', name: 'AIIMS NORCET & Nursing' },
    { id: 'clat', name: 'CLAT UG Law Entrance' },
    { id: 'board', name: 'Board Examinations (Class 10 & 12)' },
    { id: 'defence', name: 'Defence Exams (NDA, CDS, CAPF, AFCAT, Airforce)' },
    { id: 'banking', name: 'Banking Exams (IBPS, SBI, RBI)' },
    { id: 'police-state', name: 'State Police & State Specific (UP SI, Bihar Police, RO/ARO)' },
    { id: 'foundation', name: 'Foundation & Core Subjects (Live + Recorded)' },
    { id: 'teaching-net', name: 'Teaching & UGC NET (TET, BPSC TRE 4.0, UGC NET)' }
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
