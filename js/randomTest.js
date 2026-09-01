/**
 * MOCKHARD — Random Practice Test Module
 * =====================================
 * Controller script for random test configuration & execution.
 */

const RandomTestConfig = {
  subjects: [
    { id: 'all', name: '🎲 All Subjects Mixed (Random from all exams)' },
    { id: 'upsc', name: '🏛️ UPSC Civil Services' },
    { id: 'upsc-mains', name: '🏛️📝 UPSC Civil Services Mains' },
    { id: 'ugc-net', name: '🎓 UGC NET / JRF' },
    { id: 'norcet', name: '🏥 AIIMS NORCET' },
    { id: 'aiims-exams', name: '🩺 AIIMS Exams' },
    { id: 'state-psc', name: '🏛️ State PSC (BPSC, UPPSC, MPPSC)' },
    { id: 'ssc', name: '📋 SSC Exams (CGL, CPO, CHSL, MTS, GD)' },
    { id: 'railways', name: '🚂 Railways RRB (NTPC, ALP, RPF)' },
    { id: 'neet', name: '🩺 NEET UG Medical Entrance' },
    { id: 'jee', name: '⚙️ JEE Main & Advanced' },
    { id: 'gate', name: '🔬 GATE & Engineering' },
    { id: 'defence', name: '🎖️ Defence Exams (NDA, CDS, CAPF, AFCAT)' },
    { id: 'clat', name: '⚖️ CLAT UG Law Entrance' },
    { id: 'cuet', name: '🎓 CUET UG Entrance' },
    { id: 'board', name: '📚 Board Exams (Class 10 & 12)' },
    { id: 'police-state', name: '🚔 State Police & State Specific' },
    { id: 'foundation', name: '📖 Foundation Courses & Core Subjects' },
    { id: 'teaching', name: '🧑‍🏫 Teaching Exams (TET / CTET)' }
  ],
  levels: ['mixed', 'C', 'B', 'A', 'Aplus', 'Aplusplus'],
  questionCounts: [15, 25, 50],
  timeLimits: [20, 30, 60]
};

const RandomTest = (() => {
  function init() {
    console.log('🎲 Initializing Random Test Module...');
  }

  function start(subjectId, level, count, time) {
    if (typeof MockStorage !== 'undefined') {
      MockStorage.clearInProgress();
    }
    const levelParam = level === 'mixed' ? 'mixed' : level;
    window.location.href = `test.html?mode=random&category=${subjectId}&count=${count}&time=${time}&level=${levelParam}`;
  }

  return { config: RandomTestConfig, init, start };
})();

if (typeof module !== 'undefined') {
  module.exports = { RandomTestConfig, RandomTest };
}
