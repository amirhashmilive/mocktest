// Batch-create comprehensive examination configs for all 16 category suites
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'examination-configs');

const configs = [
  {
    id: "upsc", name: "UPSC Civil Services", icon: "🏛️", color: "#0f3460",
    categoryGroup: "Civil Services",
    description: "GS Paper-I, CSAT Paper-II, Current Affairs, Mini Tests & PYQs",
    papers: [
      { id: "gs1", name: "GS Paper-I (Prelims)", questions: 100, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.66, description: "General Studies (History, Polity, Economy, Geography, Environment, Science)" },
      { id: "csat", name: "CSAT Paper-II", questions: 80, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2.5, negativeMarks: 0.83, qualifying: true, description: "Comprehension, Reasoning, Quantitative Aptitude" },
      { id: "ca", name: "Current Affairs & Test Series", questions: 50, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.66, description: "Monthly & Annual Current Affairs Round-up" },
      { id: "mini", name: "UPSC Mini Practice Test", questions: 30, timeLimit: 30, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.66, description: "Quick daily practice paper" }
    ],
    subjects: [
      { id: "polity", name: "Polity & Governance", weight: 0.20, topics: ["Constitution", "Federalism", "Parliament", "Judiciary"] },
      { id: "history", name: "History & Art", weight: 0.18, topics: ["Ancient", "Medieval", "Modern", "Freedom Struggle"] },
      { id: "geography", name: "Geography & Mapping", weight: 0.16, topics: ["Physical", "Indian", "World Map", "Agriculture"] },
      { id: "economy", name: "Economy", weight: 0.16, topics: ["Macroeconomics", "Banking", "Budget", "Trade"] },
      { id: "environment", name: "Environment", weight: 0.15, topics: ["Biodiversity", "Climate Change", "Laws"] },
      { id: "science", name: "Science & Tech", weight: 0.15, topics: ["Space", "Biotech", "IT", "Defence"] }
    ],
    difficultyDistribution: { easy: 0.15, moderate: 0.55, difficult: 0.30 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "state-psc", name: "State PSC (BPSC, UPPSC, MPPSC)", icon: "🏛️", color: "#1b263b",
    categoryGroup: "Civil Services",
    description: "70th BPSC, UPPSC PCS, UPPSC RO/ARO, MPPSC Prelims & Mains",
    papers: [
      { id: "bpsc", name: "70th BPSC Combined Prelims", questions: 150, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "BPSC Prelims (History, Bihar Special, Science, Current Affairs)" },
      { id: "uppsc", name: "UPPSC PCS GS Paper-I", questions: 150, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1.33, negativeMarks: 0.44, description: "UPPSC General Studies Paper-I" },
      { id: "ro_aro", name: "UPPSC RO / ARO Prelims", questions: 140, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "Review Officer & Assistant Review Officer GS" },
      { id: "mppsc", name: "MPPSC State Service Prelims", questions: 100, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: false, marksPerQuestion: 2, negativeMarks: 0, description: "MPPSC General Studies (MP GK + National)" }
    ],
    subjects: [
      { id: "state_gk", name: "State Specific GK (Bihar/UP/MP)", weight: 0.30, topics: ["State History", "Geography", "Economy", "Schemes"] },
      { id: "history", name: "Indian History", weight: 0.20, topics: ["Ancient", "Medieval", "Modern India"] },
      { id: "polity", name: "Indian Polity", weight: 0.20, topics: ["Constitution", "Panchayati Raj", "State Executive"] },
      { id: "science", name: "General Science", weight: 0.15, topics: ["Physics", "Chemistry", "Biology"] },
      { id: "ca", name: "Current Affairs", weight: 0.15, topics: ["National", "International", "State Events"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.50, difficult: 0.30 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "ssc", name: "SSC Exams (CGL, CPO, CHSL, MTS, GD, Delhi Police)", icon: "📋", color: "#e94560",
    categoryGroup: "Staff Selection",
    description: "SSC CGL Tier-I/II, SSC CPO, CHSL, MTS, SSC GD Constable & Delhi Police",
    papers: [
      { id: "cgl_tier1", name: "SSC CGL Tier-I Exam", questions: 100, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.50, description: "Tier-I Online Exam (25 GA, 25 Quant, 25 English, 25 Reasoning)" },
      { id: "cgl_tier2", name: "SSC CGL Tier-II Paper-I", questions: 150, timeLimit: 150, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 3, negativeMarks: 1.00, description: "Tier-II Math, Reasoning, English, GA & Computer" },
      { id: "cpo", name: "SSC CPO Sub-Inspector Tier-I", questions: 200, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "SSC CPO SI Prelims (50 Qs each in 4 sections)" },
      { id: "chsl", name: "SSC CHSL Tier-I Exam", questions: 100, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.50, description: "Combined Higher Secondary Level Tier-I" },
      { id: "gd_dp", name: "SSC GD Constable & Delhi Police", questions: 80, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.50, description: "General Duty Constable & Delhi Police Exam" }
    ],
    subjects: [
      { id: "quant", name: "Quantitative Aptitude", weight: 0.25, topics: ["Arithmetic", "Algebra", "Geometry", "Trigonometry"] },
      { id: "reasoning", name: "General Intelligence & Reasoning", weight: 0.25, topics: ["Analogies", "Series", "Coding", "Syllogisms"] },
      { id: "english", name: "English Comprehension", weight: 0.25, topics: ["Grammar", "Vocabulary", "Reading Comprehension"] },
      { id: "ga", name: "General Awareness", weight: 0.25, topics: ["Science", "History", "Polity", "Geography", "Current Affairs"] }
    ],
    difficultyDistribution: { easy: 0.25, moderate: 0.50, difficult: 0.25 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "railways", name: "Railways RRB (NTPC, ALP, RPF)", icon: "🚂", color: "#06d6a0",
    categoryGroup: "Railways",
    description: "RRB NTPC CBT-I/II, RRB ALP/Technician & RPF SI / Constable",
    papers: [
      { id: "cbt1", name: "RRB NTPC CBT-I Stage-1", questions: 100, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "First Stage CBT (40 GA, 30 Math, 30 Reasoning)" },
      { id: "cbt2", name: "RRB NTPC CBT-II Stage-2", questions: 120, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "Second Stage CBT (50 GA, 35 Math, 35 Reasoning)" },
      { id: "alp", name: "RRB ALP & Technician CBT-I", questions: 75, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "Assistant Loco Pilot Stage-1 CBT" },
      { id: "rpf", name: "RPF Sub-Inspector & Constable", questions: 120, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "RPF SI & Constable CBT (50 GA, 35 Math, 35 Reasoning)" }
    ],
    subjects: [
      { id: "science", name: "General Science", weight: 0.30, topics: ["Physics", "Chemistry", "Life Sciences"] },
      { id: "math", name: "Mathematics", weight: 0.25, topics: ["Number System", "BODMAS", "Decimals", "Percentages", "Ratio"] },
      { id: "reasoning", name: "General Intelligence & Reasoning", weight: 0.25, topics: ["Venn Diagrams", "Data Sufficiency", "Conclusions"] },
      { id: "ga", name: "General Awareness & Current Affairs", weight: 0.20, topics: ["Railways", "Culture", "Sports", "Personalities"] }
    ],
    difficultyDistribution: { easy: 0.30, moderate: 0.50, difficult: 0.20 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "neet", name: "NEET UG Medical", icon: "🩺", color: "#f0a500",
    categoryGroup: "Medical Entrance",
    description: "Medical Entrance — Physics, Chemistry & Biology (Botany & Zoology)",
    papers: [
      { id: "full", name: "NEET Full Syllabus Mock Paper", questions: 180, timeLimit: 180, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 1, subjectDistribution: { Physics: 45, Chemistry: 45, Biology: 90 }, description: "180 Questions (Botany 45, Zoology 45, Physics 45, Chemistry 45)" },
      { id: "bio_spec", name: "NEET Biology Special Mock", questions: 90, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 1, description: "90 Questions Botany & Zoology Intensive" }
    ],
    subjects: [
      { id: "biology", name: "Biology (Botany & Zoology)", weight: 0.50, topics: ["Cell Biology", "Genetics", "Ecology", "Human Physiology", "Plant Physiology"] },
      { id: "physics", name: "Physics", weight: 0.25, topics: ["Mechanics", "Thermodynamics", "Optics", "Electromagnetism", "Modern Physics"] },
      { id: "chemistry", name: "Chemistry", weight: 0.25, topics: ["Organic", "Inorganic", "Physical Chemistry", "Biomolecules"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.50, difficult: 0.30 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "jee", name: "JEE Main & Advanced", icon: "⚙️", color: "#7209b7",
    categoryGroup: "Engineering Entrance",
    description: "JEE Main Paper-1 & JEE Advanced Mock Test Series",
    papers: [
      { id: "jee_main", name: "JEE Main B.E/B.Tech Paper-1", questions: 75, timeLimit: 180, questionTypes: ["MCQ", "Numerical"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 1, subjectDistribution: { Physics: 25, Chemistry: 25, Mathematics: 25 }, description: "Paper-1 (20 MCQs + 5 Numerical Value Questions per subject)" },
      { id: "jee_adv", name: "JEE Advanced Paper-1 Mock", questions: 54, timeLimit: 180, questionTypes: ["MCQ", "MSQ", "Numerical"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 2, description: "Advanced Level Multi-correct & Integer Type Paper" }
    ],
    subjects: [
      { id: "physics", name: "Physics", weight: 0.33, topics: ["Mechanics", "Electrodynamics", "Optics", "Thermodynamics"] },
      { id: "chemistry", name: "Chemistry", weight: 0.33, topics: ["Organic", "Inorganic", "Physical Chemistry"] },
      { id: "math", name: "Mathematics", weight: 0.34, topics: ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.45, difficult: 0.35 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "cuet", name: "CUET UG Entrance", icon: "🎓", color: "#4361ee",
    categoryGroup: "University Entrance",
    description: "Common University Entrance Test — Language, Domain Subjects & General Test",
    papers: [
      { id: "general_test", name: "CUET General Test", questions: 60, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 5, negativeMarks: 1, description: "General Knowledge, Current Affairs, Mental Ability, Quant" },
      { id: "domain_paper", name: "CUET Domain Subject Paper", questions: 50, timeLimit: 45, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 5, negativeMarks: 1, description: "Core Domain Mock (Attempt 40 out of 50 Questions)" }
    ],
    subjects: [
      { id: "general", name: "General Test", weight: 0.40, topics: ["GK", "Current Affairs", "General Mental Ability", "Numerical Ability"] },
      { id: "language", name: "Language (English/Hindi)", weight: 0.30, topics: ["Reading Comprehension", "Vocabulary", "Literary Aptitude"] },
      { id: "domain", name: "Domain Knowledge", weight: 0.30, topics: ["NCERT Class 12 Syllabus"] }
    ],
    difficultyDistribution: { easy: 0.30, moderate: 0.50, difficult: 0.20 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "gate", name: "GATE & Engineering (JE Civil/Elec/Mech)", icon: "🔬", color: "#3a0ca3",
    categoryGroup: "Engineering & Technical",
    description: "GATE Full Paper, UPSSSC JE, BSPHCL TG-III & Engineering Foundation",
    papers: [
      { id: "gate_full", name: "GATE Full Syllabus Paper", questions: 65, timeLimit: 180, questionTypes: ["MCQ", "MSQ", "NAT"], negativeMarking: true, marksPerQuestion: "1 or 2", negativeMarks: "0.33 or 0.66 for MCQ", description: "65 Questions (10 General Aptitude + 55 Core Engineering & Maths)" },
      { id: "je_civil", name: "JE Civil Engineering Foundation", questions: 100, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "Building Materials, Surveying, Soil Mechanics, Structures" },
      { id: "je_elec", name: "JE Electrical & BSPHCL TG-III", questions: 100, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "Electrical Machines, Power Systems, Basic Electronics" }
    ],
    subjects: [
      { id: "engmath", name: "Engineering Mathematics", weight: 0.25, topics: ["Linear Algebra", "Calculus", "Differential Equations"] },
      { id: "aptitude", name: "General Aptitude", weight: 0.15, topics: ["Verbal Ability", "Numerical Ability"] },
      { id: "core_civil", name: "Civil Engineering", weight: 0.30, topics: ["SOM", "Structures", "Geotech", "Fluid Mechanics"] },
      { id: "core_elec", name: "Electrical & Mech", weight: 0.30, topics: ["Circuit Theory", "Control Systems", "Thermodynamics"] }
    ],
    difficultyDistribution: { easy: 0.15, moderate: 0.45, difficult: 0.40 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "norcet", name: "AIIMS NORCET & Nursing", icon: "💉", color: "#118ab2",
    categoryGroup: "Nursing & Medical",
    description: "Nursing Officer Prelims, Mains & Subject Foundations",
    papers: [
      { id: "prelims", name: "AIIMS NORCET Preliminary Stage", questions: 100, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "Prelims (5 sections × 20 Qs: Nursing Subjects + Aptitude)" },
      { id: "mains", name: "AIIMS NORCET Mains Stage", questions: 100, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "Mains Clinical Scenario & Case-based Questions" }
    ],
    subjects: [
      { id: "fundamentals", name: "Fundamentals of Nursing", weight: 0.25, topics: ["Vital Signs", "Patient Care", "Infection Control"] },
      { id: "medsurg", name: "Medical-Surgical Nursing", weight: 0.30, topics: ["Cardiovascular", "Respiratory", "Neurological"] },
      { id: "community", name: "Community Health", weight: 0.25, topics: ["Epidemiology", "Immunization", "Nutrition"] },
      { id: "pharmacology", name: "Pharmacology & Anatomy", weight: 0.20, topics: ["Drug Classifications", "Pharmacokinetics"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.55, difficult: 0.25 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "clat", name: "CLAT UG Law Entrance", icon: "⚖️", color: "#4cc9f0",
    categoryGroup: "Law Entrance",
    description: "Common Law Admission Test — Legal Reasoning, Logical, English & GK",
    papers: [
      { id: "ug", name: "CLAT UG Full Paper", questions: 120, timeLimit: 120, questionTypes: ["Passage-based MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "Passage-based Comprehension & Critical Reasoning Test" }
    ],
    subjects: [
      { id: "legal", name: "Legal Reasoning", weight: 0.30, topics: ["Constitutional Law", "Contract Law", "Criminal Law", "Torts"] },
      { id: "logical", name: "Logical Reasoning", weight: 0.25, topics: ["Syllogisms", "Analogies", "Assumptions", "Conclusions"] },
      { id: "english", name: "English Language", weight: 0.25, topics: ["Comprehension", "Grammar", "Vocabulary"] },
      { id: "gk", name: "General Knowledge & Current Affairs", weight: 0.20, topics: ["Current Events", "Legal GK", "Static GK"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.50, difficult: 0.30 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "board", name: "Board Examinations (Class 10 & 12)", icon: "📚", color: "#f72585",
    categoryGroup: "School Academic",
    description: "Class 10 & Class 12 Science, Commerce, Social Studies & English",
    papers: [
      { id: "class12", name: "Class 12 Science Mock", questions: 80, timeLimit: 180, questionTypes: ["MCQ", "Case-based"], negativeMarking: false, marksPerQuestion: 1, negativeMarks: 0, description: "Physics, Chemistry, Biology & Mathematics" },
      { id: "class10", name: "Class 10 Board All Subjects", questions: 80, timeLimit: 180, questionTypes: ["MCQ", "Short Answer"], negativeMarking: false, marksPerQuestion: 1, negativeMarks: 0, description: "Science, Mathematics, Social Science & English" }
    ],
    subjects: [
      { id: "science", name: "Science (Phy/Chem/Bio)", weight: 0.30, topics: ["Light", "Electricity", "Chemical Reactions", "Life Processes"] },
      { id: "math", name: "Mathematics", weight: 0.30, topics: ["Algebra", "Geometry", "Trigonometry", "Statistics"] },
      { id: "social", name: "Social Studies", weight: 0.20, topics: ["History", "Geography", "Civics", "Economics"] },
      { id: "english", name: "English Language", weight: 0.20, topics: ["Grammar", "Vocabulary", "Reading"] }
    ],
    difficultyDistribution: { easy: 0.35, moderate: 0.45, difficult: 0.20 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "defence", name: "Defence Exams (NDA, CDS, CAPF, AFCAT, Airforce)", icon: "🎖️", color: "#2d6a4f",
    categoryGroup: "Defence Services",
    description: "NDA Foundation, CDS, CAPF AC, AFCAT & Airforce (X + Y Group)",
    papers: [
      { id: "nda_math", name: "NDA Paper-I Mathematics", questions: 120, timeLimit: 150, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2.5, negativeMarks: 0.83, description: "NDA Paper-I Higher Mathematics (Algebra, Calculus, Trig)" },
      { id: "nda_gat", name: "NDA Paper-II GAT", questions: 150, timeLimit: 150, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 1.33, description: "General Ability Test (English, Physics, Chem, History, Geography, GK)" },
      { id: "cds_gk", name: "CDS General Knowledge", questions: 120, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 0.83, negativeMarks: 0.27, description: "CDS GK Paper (Polity, History, Science, Current Affairs)" },
      { id: "afcat_capf", name: "AFCAT & CAPF AC Paper-I", questions: 100, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 3, negativeMarks: 1.00, description: "General Awareness, Verbal Ability, Reasoning, Military Aptitude" }
    ],
    subjects: [
      { id: "math", name: "Mathematics (Foundation & NDA)", weight: 0.30, topics: ["Algebra", "Trigonometry", "Calculus", "Statistics"] },
      { id: "english", name: "English", weight: 0.25, topics: ["Grammar", "Vocabulary", "Comprehension", "Spotting Errors"] },
      { id: "gk", name: "General Knowledge & Defence", weight: 0.25, topics: ["History", "Geography", "Polity", "Defence Forces"] },
      { id: "science", name: "General Science", weight: 0.20, topics: ["Physics", "Chemistry", "Biology"] }
    ],
    difficultyDistribution: { easy: 0.25, moderate: 0.50, difficult: 0.25 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "banking", name: "Banking Exams (IBPS, SBI, RBI)", icon: "🏦", color: "#0077b6",
    categoryGroup: "Banking & Finance",
    description: "Bank Foundation (Prelims + Mains), SBI PO/Clerk, IBPS PO/Clerk & RBI Grade B",
    papers: [
      { id: "bank_prelims", name: "Bank Prelims Exam (IBPS / SBI)", questions: 100, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "35 Quant, 35 Reasoning, 30 English (Sectional 20 min each)" },
      { id: "bank_mains", name: "Bank Mains Exam (IBPS / SBI PO)", questions: 155, timeLimit: 180, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1.25, negativeMarks: 0.31, description: "Data Analysis, Reasoning, Computer, Banking Awareness, English" },
      { id: "rbi", name: "RBI Grade B Phase-I Exam", questions: 200, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "80 General Awareness, 60 Reasoning, 30 Quant, 30 English" }
    ],
    subjects: [
      { id: "reasoning", name: "Reasoning Ability & Puzzles", weight: 0.30, topics: ["Seating Arrangement", "Puzzles", "Syllogism", "Inequalities"] },
      { id: "quant", name: "Quantitative Aptitude & DI", weight: 0.30, topics: ["Data Interpretation", "Number Series", "Quadratic Equations", "Arithmetic"] },
      { id: "english", name: "English Language", weight: 0.20, topics: ["Reading Comprehension", "Cloze Test", "Error Spotting", "Para Jumbles"] },
      { id: "banking_ga", name: "Banking & Financial Awareness", weight: 0.20, topics: ["RBI Functions", "Banking Terms", "Economy", "Current Affairs"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.50, difficult: 0.30 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "police-state", name: "State Police & State Specific (UP SI, Bihar Police, RO/ARO)", icon: "🚔", color: "#d90429",
    categoryGroup: "State Recruitment",
    description: "UP SI, Bihar SI / Daroga, Bihar Police, Bihar SSC (10+2), UPSSSC & MP Women Supervisor",
    papers: [
      { id: "upsi", name: "UP Police Sub-Inspector (UP SI)", questions: 160, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: false, marksPerQuestion: 2.5, negativeMarks: 0, description: "40 Hindi, 40 Law/Polity/GK, 40 Math, 40 Reasoning" },
      { id: "bihar_si", name: "Bihar SI / Daroga Prelims", questions: 100, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.20, description: "General Knowledge & Current Affairs" },
      { id: "bssc_inter", name: "Bihar SSC (10+2) Inter Level", questions: 150, timeLimit: 135, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 1.00, description: "50 General Studies, 50 General Science & Math, 50 Mental Ability" },
      { id: "mp_supervisor", name: "MP Women Supervisor (महिला सुपरवाइजर)", questions: 200, timeLimit: 180, questionTypes: ["MCQ"], negativeMarking: false, marksPerQuestion: 1, negativeMarks: 0, description: "Child Care, Health, Management & General Knowledge" }
    ],
    subjects: [
      { id: "gk", name: "General Knowledge & Current Affairs", weight: 0.30, topics: ["History", "Polity", "Geography", "State Affairs"] },
      { id: "hindi", name: "General Hindi (सामान्य हिंदी)", weight: 0.25, topics: ["Grammar", "Vocabulary", "Comprehension", "Ras/Chhand/Alankar"] },
      { id: "math_reasoning", name: "Mathematics & Reasoning", weight: 0.25, topics: ["Arithmetic", "Mental Ability", "Logic"] },
      { id: "law_polity", name: "Basic Law & Constitution (मूल विधि)", weight: 0.20, topics: ["IPC", "CRPC", "Human Rights", "Motor Vehicle Act"] }
    ],
    difficultyDistribution: { easy: 0.30, moderate: 0.50, difficult: 0.20 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "foundation", name: "KGS Foundation & Core Subjects (Live + Recorded)", icon: "📖", color: "#38b000",
    categoryGroup: "Foundation Courses",
    description: "NCERT Foundation, World Map 2025, History, Polity, Economy, Geography, Biology, Chemistry & Physics Foundation",
    papers: [
      { id: "ncert", name: "NCERT Foundation Comprehensive Test", questions: 100, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "NCERT Class 6 to 12 Conceptual Master Test" },
      { id: "world_map", name: "World Map & Indian Map Master Test", questions: 75, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "Continents, Oceans, Rivers, Mountains & Geopolitics" },
      { id: "core_science", name: "Science Foundation (Physics, Chem, Bio)", questions: 90, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "Basic to Advanced Core Science Fundamentals" },
      { id: "core_arts", name: "Humanities Foundation (History, Polity, Economy)", questions: 90, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "Core Humanities Conceptual Mastery" }
    ],
    subjects: [
      { id: "history", name: "History Foundation", weight: 0.20, topics: ["Ancient", "Medieval", "Modern", "World History"] },
      { id: "polity", name: "Polity Foundation", weight: 0.20, topics: ["Constitution", "Governance", "Political Theory"] },
      { id: "geography_map", name: "Geography & Map", weight: 0.20, topics: ["World Map", "Indian Map", "Physical Geography"] },
      { id: "economy", name: "Economics Foundation", weight: 0.20, topics: ["Micro", "Macro", "Indian Economy"] },
      { id: "science", name: "Science Foundation (Bio/Chem/Phy)", weight: 0.20, topics: ["Physics", "Chemistry", "Biology"] }
    ],
    difficultyDistribution: { easy: 0.35, moderate: 0.45, difficult: 0.20 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  },
  {
    id: "teaching-net", name: "Teaching & UGC NET (TET, BPSC TRE 4.0, UGC NET)", icon: "🧑‍🏫", color: "#7209b7",
    categoryGroup: "Teaching & Academics",
    description: "UGC NET/JRF Paper-1 & 2, TET (CTET/STET) & BPSC TRE 4.0 (Class 1-5, 6-8, 9-10)",
    papers: [
      { id: "ugc_net_p1", name: "UGC NET / JRF Paper-1", questions: 50, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: false, marksPerQuestion: 2, negativeMarks: 0, description: "Teaching & Research Aptitude, Data Interpretation, Higher Ed" },
      { id: "bpsc_tre", name: "BPSC TRE 4.0 Teacher Exam (Class 1-5 & 6-10)", questions: 150, timeLimit: 150, questionTypes: ["MCQ"], negativeMarking: false, marksPerQuestion: 1, negativeMarks: 0, description: "Language + General Studies + Subject Knowledge" },
      { id: "ctet", name: "TET / CTET Paper-I & II", questions: 150, timeLimit: 150, questionTypes: ["MCQ"], negativeMarking: false, marksPerQuestion: 1, negativeMarks: 0, description: "Child Development, Pedagogy, Language & Mathematics/Science" }
    ],
    subjects: [
      { id: "pedagogy", name: "Child Development & Pedagogy", weight: 0.30, topics: ["Learning Theories", "Inclusive Education", "Assessment"] },
      { id: "teaching_apt", name: "Teaching & Research Aptitude", weight: 0.25, topics: ["Teaching Methods", "Research Ethics", "Communication"] },
      { id: "gs", name: "General Studies & Teacher Subject", weight: 0.25, topics: ["Math", "Science", "Social Science", "GK"] },
      { id: "language", name: "Language Aptitude", weight: 0.20, topics: ["Grammar", "Comprehension", "Pedagogy of Language"] }
    ],
    difficultyDistribution: { easy: 0.25, moderate: 0.50, difficult: 0.25 },
    levels: { C: "Beginner", B: "Intermediate", A: "Advanced", "A+": "Expert", "A++": "Elite" }
  }
];

configs.forEach(cfg => {
  const filePath = path.join(dir, `${cfg.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2), 'utf-8');
  console.log(`✅ ${cfg.id}.json updated with full course matrix.`);
});
console.log(`\n🎉 All ${configs.length} examination configuration suites updated successfully.`);
