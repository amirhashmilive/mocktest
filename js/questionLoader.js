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

  async function load(category, level = 'C', subject = null) {
    const levelFile = level.replace('+', 'plus'); // A+ -> Aplus
    let subSlug = subject ? subject.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null;
    if (subSlug === 'all' || subSlug === 'all-subjects') subSlug = null;

    const cacheKey = `${category}_${subSlug || 'all'}_${levelFile}`;
    if (cache[cacheKey]) return cache[cacheKey];

    let url = `data/questions/${category}/level-${levelFile}.json`;
    if ((category === 'upsc' || category === 'upsc-mains') && subSlug) {
      url = `data/questions/${category}/${subSlug}/level-${levelFile}.json`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Fallback: try top-level category level file if subject subfolder file fetch fails
        if (url !== `data/questions/${category}/level-${levelFile}.json`) {
          const fallbackResp = await fetch(`data/questions/${category}/level-${levelFile}.json`);
          if (fallbackResp.ok) {
            const allQ = await fallbackResp.json();
            const filtered = allQ.filter(q => {
              if (!q.subject) return true;
              return q.subject.toLowerCase().includes((subject || '').toLowerCase());
            });
            const finalQ = filtered.length > 0 ? filtered : allQ;
            cache[cacheKey] = finalQ;
            return finalQ;
          }
        }
        throw new Error(`HTTP error ${response.status}`);
      }
      const questions = await response.json();
      cache[cacheKey] = questions;

      // Pass through EvidenceEngine verification pipeline if available
      if (typeof EvidenceEngine !== 'undefined') {
        const validated = await EvidenceEngine.generateQuestions({
          examination: category,
          level,
          subject,
          count: questions.length,
          existingPool: questions
        });
        cache[cacheKey] = validated;
        return validated;
      }

      return questions;
    } catch (err) {
      console.error(`Failed to load question bank for ${category}/${subject || 'all'}/${level}:`, err);
      // Fallback: try loading inline legacy data if window[category] exists
      if (typeof window !== 'undefined' && window[category]) {
        console.warn(`Using legacy window[${category}] data fallback`);
        return window[category];
      }
      return [];
    }
  }

  async function loadWithEvidence(params, onProgress = null) {
    const category = params.category || params.examination || 'upsc';
    const level = params.level || 'C';
    const subject = params.subject || null;
    const count = params.count || 50;

    const rawQuestions = await load(category, level, subject);
    if (typeof EvidenceEngine !== 'undefined') {
      return await EvidenceEngine.generateQuestions({
        examination: category,
        level,
        subject,
        count: count || rawQuestions.length || 50,
        existingPool: rawQuestions
      }, onProgress);
    }
    return rawQuestions;
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
    { id: 'upsc-mains', name: 'UPSC Civil Services Mains' },
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
    { id: 'teaching', name: 'Teaching Exams (CTET, State TET, BPSC TRE 4.0)' },
    { id: 'ugc-net', name: 'UGC NET / JRF (All 83 Subjects)' }
  ];

  function getCategories() {
    return CATEGORIES;
  }

  async function getQuestionsForCategory(category, level = 'C') {
    return await load(category, level);
  }

  return { load, loadWithEvidence, loadManifest, loadExamConfig, getCategories, getQuestionsForCategory };
})();

if (typeof module !== 'undefined') module.exports = QuestionLoader;
