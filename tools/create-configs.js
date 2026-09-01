// Batch-create all examination configs
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'examination-configs');

const configs = [
  {
    id: "upsc", name: "UPSC Civil Services", icon: "🏛️", color: "#0f3460",
    description: "General Studies — Indian History, Polity, Geography, Economy & Environment",
    subjects: [
      { id: "polity", name: "Polity & Governance", weight: 0.20, topics: ["Constitution", "Federalism", "Parliament", "Judiciary", "Local Government", "Rights & Duties", "Constitutional Bodies", "Amendments"] },
      { id: "history", name: "History", weight: 0.18, topics: ["Ancient India", "Medieval India", "Modern India", "Freedom Movement", "Post-Independence", "Art & Culture"] },
      { id: "geography", name: "Geography", weight: 0.16, topics: ["Physical Geography", "Indian Geography", "World Geography", "Climate", "Resources", "Agriculture", "Industries"] },
      { id: "economy", name: "Economy", weight: 0.16, topics: ["Macro Economics", "Indian Economy", "Banking & Finance", "Fiscal Policy", "International Trade", "Economic Reforms"] },
      { id: "environment", name: "Environment & Ecology", weight: 0.15, topics: ["Biodiversity", "Climate Change", "Pollution", "Conservation", "Environmental Laws", "International Agreements"] },
      { id: "science", name: "Science & Technology", weight: 0.15, topics: ["Physics", "Chemistry", "Biology", "Space Technology", "Defence Technology", "IT & Emerging Tech"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.15, moderate: 0.55, difficult: 0.30 },
    questionFormats: [
      { type: "statement-3", weight: 0.35 }, { type: "direct", weight: 0.20 }, { type: "statement-2", weight: 0.20 },
      { type: "statement-4", weight: 0.10 }, { type: "matching", weight: 0.05 }, { type: "scenario", weight: 0.05 }, { type: "assertion-reason", weight: 0.05 }
    ],
    negativeMarking: true, negativeMarkValue: 0.33, currentAffairsCutoff: "12months",
    sourceHierarchy: { tier1: ["NCERT", "Laxmikanth", "Spectrum"], tier2: ["Sriram IAS", "Vision IAS"], tier3: ["The Hindu", "Indian Express"], tier4: ["PIB", "PRS Legislative"] },
    levels: {
      "C": { label: "Beginner", description: "Basic facts and direct recognition", targetAudience: "New aspirants" },
      "B": { label: "Intermediate", description: "Conceptual understanding and application", targetAudience: "3-6 months preparation" },
      "A": { label: "Advanced", description: "Analytical, multi-step reasoning", targetAudience: "1+ year preparation" },
      "A+": { label: "Expert", description: "Complex integration, subtle distinctions", targetAudience: "Serious candidates" },
      "A++": { label: "Elite", description: "Research-level, edge cases, deepest mastery", targetAudience: "Toppers-level" }
    }
  },
  {
    id: "ssc", name: "SSC CGL / CHSL", icon: "📋", color: "#e94560",
    description: "General Awareness, Quantitative Aptitude, English Comprehension & Reasoning",
    subjects: [
      { id: "ga", name: "General Awareness", weight: 0.25, topics: ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"] },
      { id: "quant", name: "Quantitative Aptitude", weight: 0.25, topics: ["Arithmetic", "Algebra", "Geometry", "Trigonometry", "Data Interpretation", "Number System"] },
      { id: "english", name: "English", weight: 0.25, topics: ["Grammar", "Vocabulary", "Comprehension", "Idioms", "One-word Substitution", "Error Spotting"] },
      { id: "reasoning", name: "Reasoning", weight: 0.25, topics: ["Analogies", "Series", "Coding-Decoding", "Blood Relations", "Syllogisms", "Arrangements", "Venn Diagrams"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.25, moderate: 0.50, difficult: 0.25 },
    questionFormats: [ { type: "direct", weight: 0.60 }, { type: "statement-2", weight: 0.20 }, { type: "scenario", weight: 0.10 }, { type: "matching", weight: 0.10 } ],
    negativeMarking: true, negativeMarkValue: 0.25, currentAffairsCutoff: "6months",
    sourceHierarchy: { tier1: ["Lucent GK", "RS Aggarwal"], tier2: ["Kiran Publications"], tier3: ["Competition magazines"], tier4: ["News portals"] },
    levels: { "C": { label: "Beginner", description: "Basic facts", targetAudience: "New aspirants" }, "B": { label: "Intermediate", description: "Application", targetAudience: "Regular preparation" }, "A": { label: "Advanced", description: "Complex problems", targetAudience: "Experienced" }, "A+": { label: "Expert", description: "Tricky questions", targetAudience: "Toppers" }, "A++": { label: "Elite", description: "Extreme difficulty", targetAudience: "Elite" } }
  },
  {
    id: "railways", name: "Railways RRB", icon: "🚂", color: "#06d6a0",
    description: "RRB NTPC & Group D — General Science, Math, General Awareness & Reasoning",
    subjects: [
      { id: "science", name: "General Science", weight: 0.25, topics: ["Physics", "Chemistry", "Biology", "Health", "Technology"] },
      { id: "math", name: "Mathematics", weight: 0.25, topics: ["Number System", "Arithmetic", "Algebra", "Geometry", "Mensuration", "Statistics"] },
      { id: "ga", name: "General Awareness", weight: 0.25, topics: ["Indian Railways", "History", "Geography", "Polity", "Economy", "Current Affairs"] },
      { id: "reasoning", name: "Reasoning", weight: 0.25, topics: ["Series", "Coding", "Analogies", "Classification", "Blood Relations", "Direction"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.30, moderate: 0.50, difficult: 0.20 },
    questionFormats: [ { type: "direct", weight: 0.70 }, { type: "statement-2", weight: 0.15 }, { type: "scenario", weight: 0.10 }, { type: "matching", weight: 0.05 } ],
    negativeMarking: true, negativeMarkValue: 0.33, currentAffairsCutoff: "6months",
    sourceHierarchy: { tier1: ["Lucent GK", "RS Aggarwal"], tier2: ["Railway exam books"], tier3: ["NCERT"], tier4: ["News"] },
    levels: { "C": { label: "Beginner", description: "Basic facts", targetAudience: "New" }, "B": { label: "Intermediate", description: "Application", targetAudience: "Regular" }, "A": { label: "Advanced", description: "Complex", targetAudience: "Experienced" }, "A+": { label: "Expert", description: "Tricky", targetAudience: "Toppers" }, "A++": { label: "Elite", description: "Extreme", targetAudience: "Elite" } }
  },
  {
    id: "neet", name: "NEET UG", icon: "🩺", color: "#f0a500",
    description: "Medical Entrance — Biology (Botany & Zoology), Physics & Chemistry",
    subjects: [
      { id: "biology", name: "Biology", weight: 0.50, topics: ["Cell Biology", "Genetics", "Ecology", "Human Physiology", "Plant Physiology", "Diversity", "Reproduction", "Evolution", "Biotechnology"] },
      { id: "physics", name: "Physics", weight: 0.25, topics: ["Mechanics", "Thermodynamics", "Optics", "Electromagnetism", "Modern Physics", "Waves"] },
      { id: "chemistry", name: "Chemistry", weight: 0.25, topics: ["Organic", "Inorganic", "Physical Chemistry", "Biomolecules", "Polymers", "Environmental Chemistry"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.20, moderate: 0.50, difficult: 0.30 },
    questionFormats: [ { type: "direct", weight: 0.40 }, { type: "statement-2", weight: 0.25 }, { type: "statement-3", weight: 0.15 }, { type: "assertion-reason", weight: 0.10 }, { type: "scenario", weight: 0.10 } ],
    negativeMarking: true, negativeMarkValue: 0.25, currentAffairsCutoff: "none",
    sourceHierarchy: { tier1: ["NCERT Biology", "NCERT Physics", "NCERT Chemistry"], tier2: ["Trueman Biology", "DC Pandey"], tier3: ["MTG", "Allen materials"], tier4: ["Research papers"] },
    levels: { "C": { label: "Beginner", description: "NCERT basic", targetAudience: "Class 11 start" }, "B": { label: "Intermediate", description: "NCERT application", targetAudience: "Class 12" }, "A": { label: "Advanced", description: "Multi-concept", targetAudience: "Serious aspirants" }, "A+": { label: "Expert", description: "Integration", targetAudience: "Top rankers" }, "A++": { label: "Elite", description: "Exceptional", targetAudience: "AIR top 100" } }
  },
  {
    id: "norcet", name: "AIIMS NORCET", icon: "💉", color: "#118ab2",
    description: "Nursing Officer — Fundamentals, Med-Surg, Pharmacology & Anatomy",
    subjects: [
      { id: "fundamentals", name: "Fundamentals of Nursing", weight: 0.25, topics: ["Vital Signs", "Patient Care", "Infection Control", "Documentation", "Ethics", "Communication"] },
      { id: "medsurg", name: "Medical-Surgical Nursing", weight: 0.30, topics: ["Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal", "Renal", "Endocrine", "Orthopedic"] },
      { id: "community", name: "Community Health", weight: 0.25, topics: ["Epidemiology", "Immunization", "Nutrition", "MCH", "National Programs", "Biostatistics"] },
      { id: "pharmacology", name: "Pharmacology", weight: 0.20, topics: ["Drug Classifications", "Pharmacokinetics", "Dosage Calculations", "Side Effects", "Drug Interactions", "Emergency Drugs"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.20, moderate: 0.55, difficult: 0.25 },
    questionFormats: [ { type: "direct", weight: 0.50 }, { type: "scenario", weight: 0.25 }, { type: "statement-2", weight: 0.15 }, { type: "matching", weight: 0.10 } ],
    negativeMarking: true, negativeMarkValue: 0.25, currentAffairsCutoff: "none",
    sourceHierarchy: { tier1: ["BT/Brunner Suddarth", "Kozier & Erb"], tier2: ["Park's Community Medicine"], tier3: ["KD Tripathi Pharmacology"], tier4: ["WHO Guidelines"] },
    levels: { "C": { label: "Beginner", description: "Basic nursing", targetAudience: "BSc Nursing students" }, "B": { label: "Intermediate", description: "Clinical application", targetAudience: "Working nurses" }, "A": { label: "Advanced", description: "Complex scenarios", targetAudience: "Experienced" }, "A+": { label: "Expert", description: "Critical thinking", targetAudience: "Senior nurses" }, "A++": { label: "Elite", description: "Research-level", targetAudience: "Specialists" } }
  },
  {
    id: "jee", name: "JEE Main", icon: "⚙️", color: "#7209b7",
    description: "Engineering Entrance — Physics, Chemistry, Mathematics",
    subjects: [
      { id: "physics", name: "Physics", weight: 0.33, topics: ["Mechanics", "Electrodynamics", "Optics", "Thermodynamics", "Modern Physics", "Waves", "Magnetism"] },
      { id: "chemistry", name: "Chemistry", weight: 0.33, topics: ["Organic", "Inorganic", "Physical Chemistry", "Coordination Chemistry", "Electrochemistry"] },
      { id: "math", name: "Mathematics", weight: 0.34, topics: ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry", "Probability", "Vectors", "3D Geometry"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.20, moderate: 0.45, difficult: 0.35 },
    questionFormats: [ { type: "direct", weight: 0.50 }, { type: "scenario", weight: 0.20 }, { type: "statement-2", weight: 0.15 }, { type: "matching", weight: 0.10 }, { type: "assertion-reason", weight: 0.05 } ],
    negativeMarking: true, negativeMarkValue: 0.25, currentAffairsCutoff: "none",
    sourceHierarchy: { tier1: ["NCERT", "HC Verma", "RD Sharma"], tier2: ["DC Pandey", "MS Chauhan"], tier3: ["Cengage", "Arihant"], tier4: ["Previous JEE papers"] },
    levels: { "C": { label: "Beginner", description: "NCERT level", targetAudience: "Class 11" }, "B": { label: "Intermediate", description: "JEE Mains level", targetAudience: "Coaching students" }, "A": { label: "Advanced", description: "JEE Advanced", targetAudience: "Serious aspirants" }, "A+": { label: "Expert", description: "Olympiad", targetAudience: "Top rankers" }, "A++": { label: "Elite", description: "Research-level", targetAudience: "AIR top 100" } }
  },
  {
    id: "gate", name: "GATE Examination", icon: "🔬", color: "#3a0ca3",
    description: "Graduate Aptitude — Engineering Mathematics, Aptitude & Core Concepts",
    subjects: [
      { id: "engmath", name: "Engineering Mathematics", weight: 0.25, topics: ["Linear Algebra", "Calculus", "Differential Equations", "Probability", "Numerical Methods", "Complex Analysis"] },
      { id: "aptitude", name: "General Aptitude", weight: 0.15, topics: ["Verbal Ability", "Numerical Ability", "Data Interpretation", "Logical Reasoning"] },
      { id: "core", name: "Core Engineering", weight: 0.35, topics: ["Data Structures", "Algorithms", "OS", "DBMS", "Computer Networks", "TOC", "Compiler Design"] },
      { id: "digital", name: "Digital Logic", weight: 0.25, topics: ["Boolean Algebra", "Combinational Circuits", "Sequential Circuits", "Number Systems", "Microprocessors"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.15, moderate: 0.45, difficult: 0.40 },
    questionFormats: [ { type: "direct", weight: 0.40 }, { type: "scenario", weight: 0.25 }, { type: "statement-2", weight: 0.15 }, { type: "statement-3", weight: 0.10 }, { type: "matching", weight: 0.10 } ],
    negativeMarking: true, negativeMarkValue: 0.33, currentAffairsCutoff: "none",
    sourceHierarchy: { tier1: ["Cormen CLRS", "Galvin OS"], tier2: ["Navathe DBMS", "Tanenbaum Networks"], tier3: ["GATE previous papers"], tier4: ["Research publications"] },
    levels: { "C": { label: "Beginner", description: "Basic concepts", targetAudience: "Final year students" }, "B": { label: "Intermediate", description: "Application", targetAudience: "GATE aspirants" }, "A": { label: "Advanced", description: "Complex problems", targetAudience: "Serious aspirants" }, "A+": { label: "Expert", description: "Advanced problems", targetAudience: "Top rankers" }, "A++": { label: "Elite", description: "Research-level", targetAudience: "AIR top 100" } }
  },
  {
    id: "clat", name: "CLAT Law Entrance", icon: "⚖️", color: "#4cc9f0",
    description: "Common Law Admission — Legal Aptitude, Logical Reasoning & English",
    subjects: [
      { id: "legal", name: "Legal Reasoning", weight: 0.30, topics: ["Constitutional Law", "Contract Law", "Criminal Law", "Tort Law", "Legal Maxims", "Landmark Cases"] },
      { id: "logical", name: "Logical Reasoning", weight: 0.25, topics: ["Syllogisms", "Analogies", "Assumptions", "Conclusions", "Strengthen/Weaken", "Critical Reasoning"] },
      { id: "english", name: "English", weight: 0.25, topics: ["Comprehension", "Grammar", "Vocabulary", "Para Jumbles", "Cloze Test", "Sentence Correction"] },
      { id: "gk", name: "General Knowledge", weight: 0.20, topics: ["Current Affairs", "Static GK", "Legal GK", "International Affairs"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.20, moderate: 0.50, difficult: 0.30 },
    questionFormats: [ { type: "scenario", weight: 0.35 }, { type: "direct", weight: 0.30 }, { type: "statement-2", weight: 0.20 }, { type: "assertion-reason", weight: 0.10 }, { type: "matching", weight: 0.05 } ],
    negativeMarking: true, negativeMarkValue: 0.25, currentAffairsCutoff: "12months",
    sourceHierarchy: { tier1: ["Bare Acts", "AP Bhardwaj"], tier2: ["Universal's Guide to CLAT"], tier3: ["Legal GK compilations"], tier4: ["SCC Online", "LiveLaw"] },
    levels: { "C": { label: "Beginner", description: "Basic legal concepts", targetAudience: "Class 12" }, "B": { label: "Intermediate", description: "Application", targetAudience: "Coaching students" }, "A": { label: "Advanced", description: "Complex reasoning", targetAudience: "Serious aspirants" }, "A+": { label: "Expert", description: "NLU level", targetAudience: "Top NLU aspirants" }, "A++": { label: "Elite", description: "Supreme Court level", targetAudience: "Top rankers" } }
  },
  {
    id: "board", name: "Board Examinations", icon: "📚", color: "#f72585",
    description: "Class 10 & 12 — Science, Mathematics, Social Studies & English",
    subjects: [
      { id: "science", name: "Science", weight: 0.30, topics: ["Physics", "Chemistry", "Biology", "Environment"] },
      { id: "math", name: "Mathematics", weight: 0.30, topics: ["Algebra", "Geometry", "Trigonometry", "Statistics", "Mensuration", "Number System"] },
      { id: "social", name: "Social Studies", weight: 0.20, topics: ["History", "Geography", "Civics", "Economics"] },
      { id: "english", name: "English", weight: 0.20, topics: ["Grammar", "Vocabulary", "Comprehension", "Writing"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.35, moderate: 0.45, difficult: 0.20 },
    questionFormats: [ { type: "direct", weight: 0.60 }, { type: "statement-2", weight: 0.20 }, { type: "scenario", weight: 0.10 }, { type: "matching", weight: 0.10 } ],
    negativeMarking: false, negativeMarkValue: 0, currentAffairsCutoff: "none",
    sourceHierarchy: { tier1: ["NCERT Textbooks"], tier2: ["RD Sharma", "HC Verma"], tier3: ["Sample papers"], tier4: ["Board previous papers"] },
    levels: { "C": { label: "Beginner", description: "NCERT basic", targetAudience: "Class 10" }, "B": { label: "Intermediate", description: "Board level", targetAudience: "Class 12" }, "A": { label: "Advanced", description: "HOTS questions", targetAudience: "Merit aspirants" }, "A+": { label: "Expert", description: "Competition level", targetAudience: "Scholarship students" }, "A++": { label: "Elite", description: "Olympiad level", targetAudience: "National toppers" } }
  },
  {
    id: "defence", name: "Defence (NDA & CDS)", icon: "🎖️", color: "#2d6a4f",
    description: "National Defence Academy — Mathematics, English, GK & Science",
    subjects: [
      { id: "math", name: "Mathematics", weight: 0.30, topics: ["Algebra", "Trigonometry", "Calculus", "Statistics", "Geometry", "Vectors"] },
      { id: "english", name: "English", weight: 0.25, topics: ["Grammar", "Vocabulary", "Comprehension", "Spotting Errors", "Sentence Improvement"] },
      { id: "gk", name: "General Knowledge", weight: 0.25, topics: ["History", "Geography", "Polity", "Economy", "Defence", "Current Affairs"] },
      { id: "science", name: "Science", weight: 0.20, topics: ["Physics", "Chemistry", "Biology", "Space", "Defence Tech"] }
    ],
    questionCount: 120, timeLimit: 100,
    difficultyDistribution: { easy: 0.25, moderate: 0.50, difficult: 0.25 },
    questionFormats: [ { type: "direct", weight: 0.60 }, { type: "statement-2", weight: 0.20 }, { type: "matching", weight: 0.10 }, { type: "scenario", weight: 0.10 } ],
    negativeMarking: true, negativeMarkValue: 0.33, currentAffairsCutoff: "6months",
    sourceHierarchy: { tier1: ["NCERT", "Pathfinder NDA"], tier2: ["Arihant NDA"], tier3: ["Defence magazines"], tier4: ["PIB Defence"] },
    levels: { "C": { label: "Beginner", description: "Basic concepts", targetAudience: "Class 12 students" }, "B": { label: "Intermediate", description: "NDA level", targetAudience: "Coaching students" }, "A": { label: "Advanced", description: "Complex problems", targetAudience: "Serious aspirants" }, "A+": { label: "Expert", description: "CDS level", targetAudience: "Graduates" }, "A++": { label: "Elite", description: "Extreme difficulty", targetAudience: "Top rankers" } }
  }
];

configs.forEach(cfg => {
  const filePath = path.join(dir, `${cfg.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2), 'utf-8');
  console.log(`✅ ${cfg.id}.json`);
});
console.log(`\n🎉 Created ${configs.length} examination configs.`);
