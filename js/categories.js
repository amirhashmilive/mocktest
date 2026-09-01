/**
 * MOCKHARD — Single Source of Truth for Examination Categories
 * ============================================================
 * Priority Order: Max 12 Featured Cards on Home Page
 * AIIMS NORCET and AIIMS Exams separated.
 */
const CATEGORIES = [
  {
    id: 'upsc',
    name: 'UPSC Civil Services',
    icon: '🏛️',
    desc: 'History, Polity, Economy, Geography, Environment, Science, IR, Society, Art & Culture, Current Affairs',
    papers: '10 Subjects | 4 Papers',
    questions: '50-100 Qs',
    time: '60-120 min',
    negative: 'Yes (-0.66)',
    color: '#0f3460',
    featured: true
  },
  {
    id: 'upsc-mains',
    name: 'UPSC Civil Services Mains',
    icon: '🏛️📝',
    desc: 'Essay, GS I-IV, Optional (48 subjects), Indian Language, English',
    papers: '9 Papers | 1750 Marks',
    questions: '9 Papers',
    time: '3 hrs each',
    negative: 'Descriptive / Essay',
    color: '#0b2545',
    featured: true
  },
  {
    id: 'ugc-net',
    name: 'UGC NET / JRF',
    icon: '🎓',
    desc: 'All 83 Official Subjects — Paper-I (Teaching Aptitude) + Paper-II (Subject)',
    papers: '2 Papers',
    questions: '150 Qs',
    time: '180 min',
    negative: 'No',
    color: '#9d4edd',
    featured: true
  },
  {
    id: 'norcet',
    name: 'AIIMS NORCET',
    icon: '🏥',
    desc: 'Nursing Officer Recruitment Common Eligibility Test (NORCET-10 & NORCET-11 Prelims & Mains)',
    papers: '4 Stage Papers',
    questions: '100 Qs',
    time: '90 min',
    negative: 'Yes (-0.33)',
    color: '#118ab2',
    featured: true
  },
  {
    id: 'aiims-exams',
    name: 'AIIMS Exams',
    icon: '🩺',
    desc: 'INI-SS, INI-CET PG, SRD-CET, Ph.D., Fellowship, B.Sc./M.Sc. Nursing, Allied Health, REGA-2.0 & Scientist-B',
    papers: '17 Exams',
    questions: '100-200 Qs',
    time: '90-180 min',
    negative: 'Yes (-0.33)',
    color: '#0284c7',
    featured: true
  },
  {
    id: 'state-psc',
    name: 'State PSC (BPSC, UPPSC, MPPSC)',
    icon: '🏛️',
    desc: '70th BPSC Prelims, UPPSC PCS, UPPSC RO/ARO & MPPSC State Services',
    papers: '4 Exams',
    questions: '100-150 Qs',
    time: '120 min',
    negative: 'Yes (-0.33)',
    color: '#1b263b',
    featured: true
  },
  {
    id: 'ssc',
    name: 'SSC Exams (CGL, CPO, CHSL, MTS, GD, DP)',
    icon: '📋',
    desc: 'SSC CGL Tier-I/II, CPO SI, CHSL, MTS, SSC GD & Delhi Police',
    papers: '5 Exams',
    questions: '80-200 Qs',
    time: '60-150 min',
    negative: 'Yes (-0.50/-1.0)',
    color: '#e94560',
    featured: true
  },
  {
    id: 'railways',
    name: 'Railways RRB (NTPC, ALP, RPF)',
    icon: '🚂',
    desc: 'RRB NTPC CBT-I/II, RRB ALP/Tech CBT-I & RPF SI / Constable',
    papers: '4 Stages',
    questions: '75-120 Qs',
    time: '60-90 min',
    negative: 'Yes (-0.33)',
    color: '#06d6a0',
    featured: true
  },
  {
    id: 'neet',
    name: 'NEET UG Medical Entrance',
    icon: '🩺',
    desc: 'Full Syllabus Mock (Biology 90 Qs, Physics 45 Qs, Chemistry 45 Qs)',
    papers: '2 Tests',
    questions: '90-180 Qs',
    time: '90-180 min',
    negative: 'Yes (+4/-1)',
    color: '#f0a500',
    featured: true
  },
  {
    id: 'jee',
    name: 'JEE Main & Advanced',
    icon: '⚙️',
    desc: 'JEE Main Paper-1 (Physics, Chem, Math) & JEE Advanced Mock',
    papers: '2 Exams',
    questions: '54-75 Qs',
    time: '180 min',
    negative: 'Yes (+4/-1)',
    color: '#7209b7',
    featured: true
  },
  {
    id: 'gate',
    name: 'GATE & Engineering',
    icon: '🔬',
    desc: 'GATE Full Paper, UPSSSC JE, BSPHCL TG-III & Engineering Foundation',
    papers: '3 Papers',
    questions: '65-100 Qs',
    time: '120-180 min',
    negative: 'Yes (MCQ only)',
    color: '#3a0ca3',
    featured: true
  },
  {
    id: 'defence',
    name: 'Defence Exams (NDA, CDS, CAPF, AFCAT)',
    icon: '🎖️',
    desc: 'NDA Maths/GAT, CDS GK, CAPF AC & AFCAT Online Test',
    papers: '4 Papers',
    questions: '100-150 Qs',
    time: '120-150 min',
    negative: 'Yes (-0.33 to -1.33)',
    color: '#2d6a4f',
    featured: true
  },
  {
    id: 'clat',
    name: 'CLAT UG Law Entrance',
    icon: '⚖️',
    desc: 'Passage-based Legal Reasoning, Logical, English & GK',
    papers: 'UG Paper',
    questions: '120 Qs',
    time: '120 min',
    negative: 'Yes (-0.25)',
    color: '#4cc9f0',
    featured: false
  },
  {
    id: 'cuet',
    name: 'CUET UG Entrance',
    icon: '🎓',
    desc: 'General Knowledge, Mental Ability, Quantitative Aptitude & Domain Mock',
    papers: '2 Tests',
    questions: '50-60 Qs',
    time: '45-60 min',
    negative: 'Yes (+5/-1)',
    color: '#4361ee',
    featured: false
  },
  {
    id: 'board',
    name: 'Board Exams (Class 10 & 12)',
    icon: '📚',
    desc: 'Class 12 Science Mock & Class 10 Board All Subjects',
    papers: 'Varies',
    questions: '80 Qs',
    time: '180 min',
    negative: 'No',
    color: '#f72585',
    featured: false
  },
  {
    id: 'police-state',
    name: 'State Police & State Specific',
    icon: '🚔',
    desc: 'UP SI, Bihar SI / Daroga, Bihar Police, Bihar SSC Inter Level & RO/ARO',
    papers: '4 Papers',
    questions: '100-200 Qs',
    time: '120-180 min',
    negative: 'Varies',
    color: '#d90429',
    featured: false
  },
  {
    id: 'foundation',
    name: 'Foundation Courses & Core Subjects',
    icon: '📖',
    desc: 'NCERT Foundation, World/Indian Map, Biology, Chemistry, History, Polity',
    papers: '4 Courses',
    questions: '75-100 Qs',
    time: '60-90 min',
    negative: 'Yes (-0.25)',
    color: '#38b000',
    featured: false
  },
  {
    id: 'teaching',
    name: 'Teaching Exams (TET / CTET)',
    icon: '🧑‍🏫',
    desc: 'CTET, State TET, BPSC TRE 4.0 (Class 1-5, 6-8, 9-10)',
    papers: '2 Papers',
    questions: '150 Qs',
    time: '150 min',
    negative: 'No',
    color: '#7209b7',
    featured: false
  }
];

if (typeof window !== 'undefined') {
  window.CATEGORIES = CATEGORIES;
}

if (typeof module !== 'undefined') {
  module.exports = CATEGORIES;
}
