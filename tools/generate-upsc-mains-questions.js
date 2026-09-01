/**
 * MOCKHARD — UPSC Mains Question Generator
 * ========================================
 * Generates descriptive question banks across all 9 UPSC Mains papers and 5 difficulty levels:
 * 1. essay
 * 2. gs-1
 * 3. gs-2
 * 4. gs-3
 * 5. gs-4
 * 6. optional-1
 * 7. optional-2
 * 8. language
 * 9. english
 */

const fs = require('fs');
const path = require('path');

const BASE_MAINS_DIR = path.join(__dirname, '..', 'data', 'questions', 'upsc-mains');

const PAPERS = [
  { id: 'essay', name: 'Paper I: Essay', type: 'Essay Writing', marksPerQ: 125, wordLimit: 1200 },
  { id: 'gs-1', name: 'Paper II: General Studies I', type: 'Descriptive', marksPerQ: 15, wordLimit: 250 },
  { id: 'gs-2', name: 'Paper III: General Studies II', type: 'Descriptive', marksPerQ: 15, wordLimit: 250 },
  { id: 'gs-3', name: 'Paper IV: General Studies III', type: 'Descriptive', marksPerQ: 15, wordLimit: 250 },
  { id: 'gs-4', name: 'Paper V: General Studies IV', type: 'Case Study', marksPerQ: 20, wordLimit: 300 },
  { id: 'optional-1', name: 'Paper VI: Optional Paper I', type: 'Descriptive', marksPerQ: 20, wordLimit: 300 },
  { id: 'optional-2', name: 'Paper VII: Optional Paper II', type: 'Descriptive', marksPerQ: 20, wordLimit: 300 },
  { id: 'language', name: 'Paper A: Indian Language', type: 'Descriptive', marksPerQ: 30, wordLimit: 400 },
  { id: 'english', name: 'Paper B: English', type: 'Descriptive', marksPerQ: 30, wordLimit: 400 }
];

const LEVELS = ['C', 'B', 'A', 'Aplus', 'Aplusplus'];

// Sample descriptive seeds per paper
const PAPER_SEEDS = {
  essay: [
    {
      q: "Section A Topic: 'Technology is a double-edged sword — it empowers humanity while simultaneously isolating individuals.' Discuss with examples from the Indian context.",
      section: "Section A (Philosophical & Societal)",
      guidelines: "Discuss technological growth (UPI, AI, Space) vs digital divide, social isolation, and mental health. Conclude with a balanced ethical perspective.",
      wordLimit: 1200,
      marks: 125
    },
    {
      q: "Section B Topic: 'Economic growth without social justice is unsustainable.' Evaluate in light of India's development trajectory.",
      section: "Section B (Economy & Social Development)",
      guidelines: "Address GDP growth vs Gini coefficient inequality, PM-Gati Shakti, inclusive growth initiatives, and human capital development.",
      wordLimit: 1200,
      marks: 125
    },
    {
      q: "Section A Topic: 'Wisdom finds truth in quietude, while ignorance makes noise.' Critically analyze this philosophical proposition.",
      section: "Section A (Philosophical & Societal)",
      guidelines: "Explore philosophical traditions, ancient Indian values (Mouna, Dhyana), modern social media outrage, and thoughtful governance.",
      wordLimit: 1200,
      marks: 125
    },
    {
      q: "Section B Topic: 'Climate change is not merely an environmental issue; it is a fundamental challenge to human rights and global security.'",
      section: "Section B (Environment & Global Affairs)",
      guidelines: "Examine climate refugees, island nations, India's Panchamrit targets, loss and damage funds, and ecological justice.",
      wordLimit: 1200,
      marks: 125
    }
  ],
  'gs-1': [
    {
      q: "Evaluate the significance of the Chola naval expeditions in extending Indian cultural and economic influence to Southeast Asia during the 10th and 11th centuries.",
      subject: "History & Art",
      wordLimit: 250,
      marks: 15,
      explanation: "Discuss Rajendra Chola's Sri Vijaya campaign, maritime trade routes, dissemination of temple architecture, and Sanskrit/Tamil inscriptions."
    },
    {
      q: "Examine the impact of the Industrial Revolution on Indian traditional handicrafts and rural cottage industries during British colonial rule.",
      subject: "History",
      wordLimit: 250,
      marks: 15,
      explanation: "Highlight de-industrialization, one-way free trade policy, loss of royal patronage, and ruralization of craftsmen."
    },
    {
      q: "Discuss the factors responsible for the origin and intensification of Western Disturbances and their significance for winter agriculture in Northern India.",
      subject: "Geography",
      wordLimit: 250,
      marks: 15,
      explanation: "Explain subtropical westerly jet stream, Mediterranean moisture origin, impact on Rabi crops (wheat, mustard), and snowfall in Himalayas."
    },
    {
      q: "Analyze the changing dynamics of the Indian family system under the influence of urbanization, industrialization, and modern communication technology.",
      subject: "Society",
      wordLimit: 250,
      marks: 15,
      explanation: "Discuss transition from joint to nuclear/neolocal families, care for elderly, women's financial autonomy, and virtual social ties."
    }
  ],
  'gs-2': [
    {
      q: "Discuss the constitutional status and discretionary powers of the Governor of an Indian State. How has judicial intervention helped in minimizing the misuse of Article 356?",
      subject: "Polity & Constitution",
      wordLimit: 250,
      marks: 15,
      explanation: "Cite S.R. Bommai v. Union of India (1994), Sarkaria Commission guidelines, and judicial review of President's Rule proclamations."
    },
    {
      q: "Critically evaluate the role of E-Governance initiatives like Digital India in promoting transparency and reducing corruption in public service delivery.",
      subject: "Governance",
      wordLimit: 250,
      marks: 15,
      explanation: "Examine Direct Benefit Transfer (DBT), DigiLocker, UMANG app, land records digitization, and remaining challenges in digital literacy."
    },
    {
      q: "The Quad (Quadrilateral Security Dialogue) has evolved into a key pillar of India's Indo-Pacific strategy. Examine its strategic significance and key challenges.",
      subject: "International Relations",
      wordLimit: 250,
      marks: 15,
      explanation: "Detail maritime security, resilient supply chains, vaccine diplomacy, infrastructure development, and managing relations with China."
    },
    {
      q: "Assess the role of Self-Help Groups (SHGs) under the Deendayal Antyodaya Yojana-NRLM in empowering rural women and bolstering micro-entrepreneurship.",
      subject: "Social Justice",
      wordLimit: 250,
      marks: 15,
      explanation: "Analyze financial inclusion, bank linkage programs, social capital creation, Lakhpati Didi initiative, and market linkage bottlenecks."
    }
  ],
  'gs-3': [
    {
      q: "Discuss the challenges posed by Deepfakes and AI-driven misinformation to national security and democratic integrity. Suggest policy and technological countermeasures.",
      subject: "Technology & Security",
      wordLimit: 250,
      marks: 15,
      explanation: "Address synthetic media risks, election integrity, IT Rules amendments, digital watermarking, and public awareness campaigns."
    },
    {
      q: "Analyze the mandate and achievements of India's Production Linked Incentive (PLI) scheme in boosting domestic manufacturing and reducing import dependence.",
      subject: "Economic Development",
      wordLimit: 250,
      marks: 15,
      explanation: "Detail coverage across 14 sectors (electronics, pharma, solar PV), capex generation, value addition challenges, and global supply chain integration."
    },
    {
      q: "Examine the significance of the National Green Hydrogen Mission in achieving India's Panchamrit climate goals and decarbonizing hard-to-abate sectors.",
      subject: "Environment & Energy",
      wordLimit: 250,
      marks: 15,
      explanation: "Discuss green hydrogen vs grey/blue hydrogen, electrolyser manufacturing, SIGHT program, steel/refinery decarbonization, and cost barriers."
    },
    {
      q: "Evaluate the disaster management framework in India under the Disaster Management Act, 2005 with special reference to early warning systems for cyclones.",
      subject: "Disaster Management",
      wordLimit: 250,
      marks: 15,
      explanation: "Highlight NDMA/SDMA structure, IMD's Doppler radar network, Odisha model of zero-casualty management during Cyclone Biparjoy/Fani."
    }
  ],
  'gs-4': [
    {
      q: "Case Study: You are the District Magistrate of a flood-affected district. Local influential leaders demand priority relief distribution to their supporters ahead of vulnerable tribal hamlets. (i) Identify the ethical dilemmas involved. (ii) Outline your step-by-step course of action.",
      subject: "Ethics & Case Studies",
      wordLimit: 300,
      marks: 20,
      explanation: "Dilemmas: Duty vs Political Pressure, Impartiality vs Equity. Action: Objective vulnerability assessment, GPS tracking of relief, transparent communication."
    },
    {
      q: "Differentiate between 'Ethical Altruism' and 'Duty-based Deontology'. How can a public servant cultivate emotional intelligence to handle workplace conflict effectively?",
      subject: "Ethics & Integrity",
      wordLimit: 250,
      marks: 15,
      explanation: "Contrast Kantian categorical imperative with altruistic outcomes. Explain Goleman's 5 components of EI: self-awareness, empathy, social skills."
    },
    {
      q: "Case Study: An whistleblower inside a municipal corporation uncovers large-scale embezzlement in streetlight procurement involving senior officials. (i) What structural protections exist for whistleblowers in India? (ii) What measures would you take to safeguard evidence and protect the informant?",
      subject: "Ethics & Integrity",
      wordLimit: 300,
      marks: 20,
      explanation: "Analyze Whistleblowers Protection Act, 2014, CVC guidelines, secure digital channels, independent inquiry committee, and witness protection."
    }
  ],
  'optional-1': [
    {
      q: "Examine the core principles of Administrative Theory propounded by Max Weber. Critically evaluate the relevance of bureaucratic model in contemporary governance.",
      subject: "Optional Paper I (Public Administration / Political Science)",
      wordLimit: 300,
      marks: 20,
      explanation: "Discuss legal-rational authority, hierarchy, impersonality, red tape criticisms, and transition towards New Public Governance."
    },
    {
      q: "Critically evaluate the Ricardian Theory of Comparative Advantage. How far does the Heckscher-Ohlin model explain modern international trade flows?",
      subject: "Optional Paper I (Economics / Commerce)",
      wordLimit: 300,
      marks: 20,
      explanation: "Contrast labor productivity differences with factor endowment ratios. Address Leontief Paradox and intra-industry trade."
    }
  ],
  'optional-2': [
    {
      q: "Analyze the impact of land reforms on agrarian social structure in post-independence India. Why did land ceiling legislations meet with limited success?",
      subject: "Optional Paper II (Sociology / Geography / Economics)",
      wordLimit: 300,
      marks: 20,
      explanation: "Examine benami transfers, lack of land records, political resistance, tenancy reforms success in West Bengal (Operation Barga) and Kerala."
    },
    {
      q: "Discuss the evolution of Indian foreign policy from Non-Alignment Movement (NAM) to Multi-Alignment in the 21st century.",
      subject: "Optional Paper II (Political Science & International Relations)",
      wordLimit: 300,
      marks: 20,
      explanation: "Analyze strategic autonomy, strategic partnerships with US, Russia, Quad, BRICS, SCO, and issue-based alignment."
    }
  ],
  language: [
    {
      q: "Read the given Indian language passage carefully and write a precise summary in your own words (Précis Writing). Also translate the highlighted passage into English.",
      subject: "Indian Language (Qualifying)",
      wordLimit: 400,
      marks: 30,
      explanation: "Evaluates comprehension, precise writing, grammar, and translation capability in chosen 22nd Schedule language."
    }
  ],
  english: [
    {
      q: "Write a short essay (approx 300 words) on 'The Role of Digital Literacy in Empowering Rural India'. Ensure grammatical accuracy, clear structure, and formal tone.",
      subject: "English (Qualifying)",
      wordLimit: 300,
      marks: 30,
      explanation: "Evaluates English language proficiency, vocabulary, coherence, paragraph structure, and grammatical accuracy."
    }
  ]
};

function generateMainsQuestions(paperObj, level) {
  const seeds = PAPER_SEEDS[paperObj.id] || PAPER_SEEDS['gs-1'];
  const questions = [];
  let counter = 1;

  const qCountMap = {
    essay: 2,
    'gs-1': 20,
    'gs-2': 20,
    'gs-3': 20,
    'gs-4': 20,
    'optional-1': 20,
    'optional-2': 20,
    language: 10,
    english: 10
  };

  const targetCount = qCountMap[paperObj.id] || 20;

  for (let i = 0; i < targetCount; i++) {
    const seed = seeds[i % seeds.length];
    const qNum = counter++;

    let qText = seed.q;
    if (level === 'C') {
      qText = `[Basic Foundation] ${seed.q}`;
    } else if (level === 'B') {
      qText = `[Standard Analytical] ${seed.q}`;
    } else if (level === 'A') {
      qText = `[Advanced Critical Evaluation] ${seed.q}`;
    } else if (level === 'Aplus') {
      qText = `[Expert Integration] ${seed.q}`;
    } else if (level === 'Aplusplus') {
      qText = `[Elite Toppers Benchmark] ${seed.q}`;
    }

    questions.push({
      id: `upsc_mains_${paperObj.id.replace('-', '')}_${level.toLowerCase()}_${qNum}`,
      paperId: paperObj.id,
      paperName: paperObj.name,
      level: level,
      question: qText,
      type: paperObj.type,
      marks: seed.marks || paperObj.marksPerQ,
      wordLimit: seed.wordLimit || paperObj.wordLimit,
      section: seed.section || null,
      subject: seed.subject || 'General Studies',
      explanation: seed.explanation || seed.guidelines || 'Detailed answer structure and key points.',
      difficulty: level === 'C' ? 'Foundation' : level === 'B' ? 'Standard' : level === 'A' ? 'Advanced' : level === 'Aplus' ? 'Expert' : 'Elite'
    });
  }

  return questions;
}

function runGenerator() {
  console.log('🚀 Generating UPSC Mains Question Banks (9 Papers × 5 Levels)...');

  const combinedPerLevel = { C: [], B: [], A: [], Aplus: [], Aplusplus: [] };

  PAPERS.forEach(paper => {
    const paperDir = path.join(BASE_MAINS_DIR, paper.id);
    if (!fs.existsSync(paperDir)) {
      fs.mkdirSync(paperDir, { recursive: true });
    }

    LEVELS.forEach(lvl => {
      const levelFile = lvl.replace('+', 'plus');
      const questions = generateMainsQuestions(paper, lvl);
      const filePath = path.join(paperDir, `level-${levelFile}.json`);

      fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
      console.log(`  └─ Created data/questions/upsc-mains/${paper.id}/level-${levelFile}.json (${questions.length} Qs)`);

      combinedPerLevel[lvl].push(...questions);
    });
  });

  // Update top-level combined level files under data/questions/upsc-mains/
  LEVELS.forEach(lvl => {
    const levelFile = lvl.replace('+', 'plus');
    const combined = combinedPerLevel[lvl];
    const topFilePath = path.join(BASE_MAINS_DIR, `level-${levelFile}.json`);

    fs.writeFileSync(topFilePath, JSON.stringify(combined, null, 2), 'utf-8');
    console.log(`✅ Updated top-level data/questions/upsc-mains/level-${levelFile}.json (${combined.length} combined Qs)`);
  });

  console.log('🎉 All UPSC Mains question banks successfully generated!');
}

runGenerator();
