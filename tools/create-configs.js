// Batch-create accurate examination configs for all 10 categories
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'examination-configs');

const configs = [
  {
    id: "upsc", name: "UPSC Civil Services", icon: "🏛️", color: "#0f3460",
    description: "General Studies — Indian History, Polity, Geography, Economy & Environment",
    papers: [
      { id: "gs1", name: "GS Paper-I", questions: 100, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.66, description: "General Studies Paper-1 (History, Polity, Economy, Geography, Environment, Science)" },
      { id: "csat", name: "CSAT Paper-II", questions: 80, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2.5, negativeMarks: 0.83, qualifying: true, description: "Civil Services Aptitude Test (Comprehension, Reasoning, Quantitative)" }
    ],
    subjects: [
      { id: "polity", name: "Polity & Governance", weight: 0.20, topics: ["Constitution", "Federalism", "Parliament", "Judiciary", "Local Government", "Rights & Duties"] },
      { id: "history", name: "History", weight: 0.18, topics: ["Ancient India", "Medieval India", "Modern India", "Freedom Movement", "Art & Culture"] },
      { id: "geography", name: "Geography", weight: 0.16, topics: ["Physical Geography", "Indian Geography", "World Geography", "Climate", "Resources"] },
      { id: "economy", name: "Economy", weight: 0.16, topics: ["Macro Economics", "Indian Economy", "Banking & Finance", "Fiscal Policy"] },
      { id: "environment", name: "Environment & Ecology", weight: 0.15, topics: ["Biodiversity", "Climate Change", "Pollution", "Conservation"] },
      { id: "science", name: "Science & Technology", weight: 0.15, topics: ["Physics", "Chemistry", "Biology", "Space & Defence Tech"] }
    ],
    difficultyDistribution: { easy: 0.15, moderate: 0.55, difficult: 0.30 },
    levels: {
      "C": { label: "Beginner", description: "Basic facts and direct recognition" },
      "B": { label: "Intermediate", description: "Conceptual understanding and application" },
      "A": { label: "Advanced", description: "Analytical, multi-step reasoning" },
      "A+": { label: "Expert", description: "Complex integration, subtle distinctions" },
      "A++": { label: "Elite", description: "Research-level, edge cases, toppers level" }
    }
  },
  {
    id: "ssc", name: "SSC CGL / CHSL", icon: "📋", color: "#e94560",
    description: "General Awareness, Quantitative Aptitude, English Comprehension & Reasoning",
    papers: [
      { id: "tier1", name: "Tier-I Computer Based Test", questions: 100, timeLimit: 60, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2, negativeMarks: 0.50, description: "Tier-I Online Exam (25 GA, 25 Quant, 25 English, 25 Reasoning)" },
      { id: "tier2", name: "Tier-II Paper-I", questions: 150, timeLimit: 150, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 3, negativeMarks: 1.00, description: "Tier-II Mathematical Abilities, Reasoning, English & GA" }
    ],
    subjects: [
      { id: "ga", name: "General Awareness", weight: 0.25, topics: ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"] },
      { id: "quant", name: "Quantitative Aptitude", weight: 0.25, topics: ["Arithmetic", "Algebra", "Geometry", "Trigonometry", "Data Interpretation"] },
      { id: "english", name: "English", weight: 0.25, topics: ["Grammar", "Vocabulary", "Comprehension", "Error Spotting"] },
      { id: "reasoning", name: "Reasoning", weight: 0.25, topics: ["Analogies", "Series", "Coding-Decoding", "Blood Relations", "Syllogisms"] }
    ],
    difficultyDistribution: { easy: 0.25, moderate: 0.50, difficult: 0.25 },
    levels: {
      "C": { label: "Beginner", description: "Basic facts" },
      "B": { label: "Intermediate", description: "Application" },
      "A": { label: "Advanced", description: "Complex problems" },
      "A+": { label: "Expert", description: "Tricky questions" },
      "A++": { label: "Elite", description: "Extreme difficulty" }
    }
  },
  {
    id: "railways", name: "Railways RRB", icon: "🚂", color: "#06d6a0",
    description: "RRB NTPC & Group D — General Science, Math, General Awareness & Reasoning",
    papers: [
      { id: "cbt1", name: "CBT-I Stage-1", questions: 100, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "First Stage Computer Based Test (40 GA, 30 Math, 30 Reasoning)" },
      { id: "cbt2", name: "CBT-II Stage-2", questions: 120, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "Second Stage Computer Based Test (50 GA, 35 Math, 35 Reasoning)" }
    ],
    subjects: [
      { id: "science", name: "General Science", weight: 0.25, topics: ["Physics", "Chemistry", "Biology", "Health"] },
      { id: "math", name: "Mathematics", weight: 0.25, topics: ["Number System", "Arithmetic", "Algebra", "Geometry"] },
      { id: "ga", name: "General Awareness", weight: 0.25, topics: ["Indian Railways", "History", "Geography", "Polity"] },
      { id: "reasoning", name: "Reasoning", weight: 0.25, topics: ["Series", "Coding", "Analogies", "Blood Relations"] }
    ],
    difficultyDistribution: { easy: 0.30, moderate: 0.50, difficult: 0.20 },
    levels: {
      "C": { label: "Beginner", description: "Basic facts" },
      "B": { label: "Intermediate", description: "Application" },
      "A": { label: "Advanced", description: "Complex problems" },
      "A+": { label: "Expert", description: "Tricky questions" },
      "A++": { label: "Elite", description: "Extreme difficulty" }
    }
  },
  {
    id: "neet", name: "NEET UG", icon: "🩺", color: "#f0a500",
    description: "Medical Entrance — Biology (Botany & Zoology), Physics & Chemistry",
    papers: [
      { id: "full", name: "Full Syllabus Mock Paper", questions: 180, timeLimit: 180, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 1, subjectDistribution: { Physics: 45, Chemistry: 45, Biology: 90 }, description: "Full Syllabus Mock (Physics 45 Qs, Chemistry 45 Qs, Biology 90 Qs)" }
    ],
    subjects: [
      { id: "biology", name: "Biology", weight: 0.50, topics: ["Cell Biology", "Genetics", "Ecology", "Human Physiology", "Plant Physiology"] },
      { id: "physics", name: "Physics", weight: 0.25, topics: ["Mechanics", "Thermodynamics", "Optics", "Electromagnetism", "Modern Physics"] },
      { id: "chemistry", name: "Chemistry", weight: 0.25, topics: ["Organic", "Inorganic", "Physical Chemistry", "Biomolecules"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.50, difficult: 0.30 },
    levels: {
      "C": { label: "Beginner", description: "NCERT basic" },
      "B": { label: "Intermediate", description: "NCERT application" },
      "A": { label: "Advanced", description: "Multi-concept" },
      "A+": { label: "Expert", description: "Integration" },
      "A++": { label: "Elite", description: "Exceptional / Rankers" }
    }
  },
  {
    id: "norcet", name: "AIIMS NORCET", icon: "💉", color: "#118ab2",
    description: "Nursing Officer — Fundamentals, Med-Surg, Pharmacology & Anatomy",
    papers: [
      { id: "prelims", name: "Preliminary Stage", questions: 100, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "Prelims (5 sections × 20 Qs each: Nursing + Aptitude)" },
      { id: "mains", name: "Mains Stage", questions: 100, timeLimit: 90, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.33, description: "Mains Clinical Scenario-based Questions" }
    ],
    subjects: [
      { id: "fundamentals", name: "Fundamentals of Nursing", weight: 0.25, topics: ["Vital Signs", "Patient Care", "Infection Control"] },
      { id: "medsurg", name: "Medical-Surgical Nursing", weight: 0.30, topics: ["Cardiovascular", "Respiratory", "Neurological"] },
      { id: "community", name: "Community Health", weight: 0.25, topics: ["Epidemiology", "Immunization", "Nutrition"] },
      { id: "pharmacology", name: "Pharmacology", weight: 0.20, topics: ["Drug Classifications", "Pharmacokinetics", "Dosage Calculations"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.55, difficult: 0.25 },
    levels: {
      "C": { label: "Beginner", description: "Basic nursing" },
      "B": { label: "Intermediate", description: "Clinical application" },
      "A": { label: "Advanced", description: "Complex scenarios" },
      "A+": { label: "Expert", description: "Critical thinking" },
      "A++": { label: "Elite", description: "Research-level" }
    }
  },
  {
    id: "jee", name: "JEE Main", icon: "⚙️", color: "#7209b7",
    description: "Engineering Entrance — Physics, Chemistry, Mathematics",
    papers: [
      { id: "paper1", name: "B.E / B.Tech Paper-1", questions: 75, timeLimit: 180, questionTypes: ["MCQ", "Numerical"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 1, subjectDistribution: { Physics: 25, Chemistry: 25, Mathematics: 25 }, description: "Paper-1 (20 MCQs + 5 Numerical Value Questions per subject)" }
    ],
    subjects: [
      { id: "physics", name: "Physics", weight: 0.33, topics: ["Mechanics", "Electrodynamics", "Optics", "Thermodynamics"] },
      { id: "chemistry", name: "Chemistry", weight: 0.33, topics: ["Organic", "Inorganic", "Physical Chemistry"] },
      { id: "math", name: "Mathematics", weight: 0.34, topics: ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.45, difficult: 0.35 },
    levels: {
      "C": { label: "Beginner", description: "NCERT level" },
      "B": { label: "Intermediate", description: "JEE Mains level" },
      "A": { label: "Advanced", description: "JEE Advanced" },
      "A+": { label: "Expert", description: "Olympiad level" },
      "A++": { label: "Elite", description: "Top 100 AIR rankers" }
    }
  },
  {
    id: "gate", name: "GATE Examination", icon: "🔬", color: "#3a0ca3",
    description: "Graduate Aptitude — Engineering Mathematics, Aptitude & Core Concepts",
    papers: [
      { id: "full", name: "Full Syllabus Paper", questions: 65, timeLimit: 180, questionTypes: ["MCQ", "MSQ", "NAT"], negativeMarking: true, marksPerQuestion: "1 or 2", negativeMarks: "0.33 or 0.66 for MCQ (None for MSQ/NAT)", description: "65 Questions (10 General Aptitude + 55 Core Engineering/Maths)" }
    ],
    subjects: [
      { id: "engmath", name: "Engineering Mathematics", weight: 0.25, topics: ["Linear Algebra", "Calculus", "Differential Equations"] },
      { id: "aptitude", name: "General Aptitude", weight: 0.15, topics: ["Verbal Ability", "Numerical Ability", "Data Interpretation"] },
      { id: "core", name: "Core Engineering", weight: 0.35, topics: ["Data Structures", "Algorithms", "OS", "DBMS", "Networks"] },
      { id: "digital", name: "Digital Logic", weight: 0.25, topics: ["Boolean Algebra", "Combinational Circuits", "Sequential Circuits"] }
    ],
    difficultyDistribution: { easy: 0.15, moderate: 0.45, difficult: 0.40 },
    levels: {
      "C": { label: "Beginner", description: "Basic concepts" },
      "B": { label: "Intermediate", description: "Application" },
      "A": { label: "Advanced", description: "Complex problems" },
      "A+": { label: "Expert", description: "Advanced problems" },
      "A++": { label: "Elite", description: "Research-level" }
    }
  },
  {
    id: "clat", name: "CLAT Law Entrance", icon: "⚖️", color: "#4cc9f0",
    description: "Common Law Admission — Legal Aptitude, Logical Reasoning & English",
    papers: [
      { id: "ug", name: "UG Full Paper", questions: 120, timeLimit: 120, questionTypes: ["Passage-based MCQ"], negativeMarking: true, marksPerQuestion: 1, negativeMarks: 0.25, description: "Passage-based Comprehension & Critical Reasoning Test" }
    ],
    subjects: [
      { id: "legal", name: "Legal Reasoning", weight: 0.30, topics: ["Constitutional Law", "Contract Law", "Criminal Law", "Tort Law"] },
      { id: "logical", name: "Logical Reasoning", weight: 0.25, topics: ["Syllogisms", "Analogies", "Assumptions", "Conclusions"] },
      { id: "english", name: "English", weight: 0.25, topics: ["Comprehension", "Grammar", "Vocabulary", "Para Jumbles"] },
      { id: "gk", name: "General Knowledge", weight: 0.20, topics: ["Current Affairs", "Static GK", "Legal GK"] }
    ],
    difficultyDistribution: { easy: 0.20, moderate: 0.50, difficult: 0.30 },
    levels: {
      "C": { label: "Beginner", description: "Basic legal concepts" },
      "B": { label: "Intermediate", description: "Application" },
      "A": { label: "Advanced", description: "Complex reasoning" },
      "A+": { label: "Expert", description: "NLU level" },
      "A++": { label: "Elite", description: "Top rankers" }
    }
  },
  {
    id: "board", name: "Board Examinations", icon: "📚", color: "#f72585",
    description: "Class 10 & 12 — Science, Mathematics, Social Studies & English",
    papers: [
      { id: "class12", name: "Class 12 Science Mock", questions: 80, timeLimit: 180, questionTypes: ["MCQ", "Case-based"], negativeMarking: false, marksPerQuestion: 1, negativeMarks: 0, description: "Class 12 Comprehensive Science & Mathematics Mock" },
      { id: "class10", name: "Class 10 All Subjects", questions: 80, timeLimit: 180, questionTypes: ["MCQ", "Short Answer"], negativeMarking: false, marksPerQuestion: 1, negativeMarks: 0, description: "Class 10 Board Pattern Mock Test" }
    ],
    subjects: [
      { id: "science", name: "Science", weight: 0.30, topics: ["Physics", "Chemistry", "Biology", "Environment"] },
      { id: "math", name: "Mathematics", weight: 0.30, topics: ["Algebra", "Geometry", "Trigonometry", "Statistics"] },
      { id: "social", name: "Social Studies", weight: 0.20, topics: ["History", "Geography", "Civics", "Economics"] },
      { id: "english", name: "English", weight: 0.20, topics: ["Grammar", "Vocabulary", "Comprehension"] }
    ],
    difficultyDistribution: { easy: 0.35, moderate: 0.45, difficult: 0.20 },
    levels: {
      "C": { label: "Beginner", description: "NCERT basic" },
      "B": { label: "Intermediate", description: "Board level" },
      "A": { label: "Advanced", description: "HOTS questions" },
      "A+": { label: "Expert", description: "Scholarship level" },
      "A++": { label: "Elite", description: "Olympiad level" }
    }
  },
  {
    id: "defence", name: "Defence (NDA & CDS)", icon: "🎖️", color: "#2d6a4f",
    description: "National Defence Academy & Combined Defence Services",
    papers: [
      { id: "nda_math", name: "NDA Paper-I Mathematics", questions: 120, timeLimit: 150, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 2.5, negativeMarks: 0.83, description: "NDA Paper-I Higher Mathematics (Algebra, Calculus, Trigonometry)" },
      { id: "nda_gat", name: "NDA Paper-II GAT", questions: 150, timeLimit: 150, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 4, negativeMarks: 1.33, description: "NDA Paper-II General Ability Test (English, Science, GK)" },
      { id: "cds_gk", name: "CDS General Knowledge", questions: 120, timeLimit: 120, questionTypes: ["MCQ"], negativeMarking: true, marksPerQuestion: 0.83, negativeMarks: 0.27, description: "CDS GK Paper (History, Polity, Science, Current Affairs)" }
    ],
    subjects: [
      { id: "math", name: "Mathematics", weight: 0.30, topics: ["Algebra", "Trigonometry", "Calculus", "Statistics"] },
      { id: "english", name: "English", weight: 0.25, topics: ["Grammar", "Vocabulary", "Comprehension", "Spotting Errors"] },
      { id: "gk", name: "General Knowledge", weight: 0.25, topics: ["History", "Geography", "Polity", "Defence"] },
      { id: "science", name: "Science", weight: 0.20, topics: ["Physics", "Chemistry", "Biology"] }
    ],
    difficultyDistribution: { easy: 0.25, moderate: 0.50, difficult: 0.25 },
    levels: {
      "C": { label: "Beginner", description: "Basic concepts" },
      "B": { label: "Intermediate", description: "NDA level" },
      "A": { label: "Advanced", description: "Complex problems" },
      "A+": { label: "Expert", description: "CDS level" },
      "A++": { label: "Elite", description: "Top rankers" }
    }
  }
];

configs.forEach(cfg => {
  const filePath = path.join(dir, `${cfg.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2), 'utf-8');
  console.log(`✅ ${cfg.id}.json updated with papers configuration.`);
});
console.log(`\n🎉 All ${configs.length} examination configuration files updated successfully.`);
