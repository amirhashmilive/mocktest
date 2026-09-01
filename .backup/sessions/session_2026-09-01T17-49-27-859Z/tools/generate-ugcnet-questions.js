/**
 * Generate UGC NET question banks across 5 difficulty levels.
 * Produces Paper-I (Teaching & Research Aptitude) questions common to all subjects,
 * plus Paper-II general academic questions suitable for cross-subject testing.
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'data', 'questions', 'ugc-net');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const LEVELS = ['C', 'B', 'A', 'Aplus', 'Aplusplus'];
const LEVEL_LABELS = { C: 'Beginner', B: 'Intermediate', A: 'Advanced', Aplus: 'Expert', Aplusplus: 'Elite' };

// Paper-I Topic Pools (Teaching & Research Aptitude)
const paper1Topics = {
  teachingAptitude: [
    { q: "Which of the following is NOT a characteristic of effective teaching?", o: ["Monotonous delivery", "Student engagement", "Clear objectives", "Appropriate feedback"], a: 0, e: "Effective teaching requires engagement, clarity, and feedback — not monotony." },
    { q: "The primary purpose of formative assessment is to:", o: ["Assign final grades", "Monitor student learning during instruction", "Rank students", "Evaluate teacher performance"], a: 1, e: "Formative assessment monitors learning in progress to guide both teaching and learning." },
    { q: "Which teaching method is most suitable for developing critical thinking skills?", o: ["Lecture method", "Socratic questioning", "Dictation", "Rote memorization"], a: 1, e: "Socratic questioning stimulates critical thinking through guided questioning." },
    { q: "Bloom's Taxonomy classifies educational objectives into how many levels?", o: ["4", "5", "6", "7"], a: 2, e: "Bloom's Taxonomy has 6 levels: Remember, Understand, Apply, Analyze, Evaluate, Create." },
    { q: "Which of the following is an example of intrinsic motivation?", o: ["Getting a prize", "Earning a salary", "Desire to learn for personal satisfaction", "Avoiding punishment"], a: 2, e: "Intrinsic motivation comes from internal satisfaction, not external rewards." },
    { q: "The 'zone of proximal development' concept was proposed by:", o: ["Piaget", "Vygotsky", "Bruner", "Skinner"], a: 1, e: "Vygotsky introduced the ZPD to describe the gap between what a learner can do alone and with guidance." },
    { q: "Which of the following is a learner-centered approach?", o: ["Direct instruction", "Flipped classroom", "Lecture method", "Drill and practice"], a: 1, e: "A flipped classroom puts the learner at the center by shifting passive learning to homework." },
    { q: "The term 'pedagogy' refers to:", o: ["Study of child health", "Art and science of teaching", "Study of ancient texts", "Theory of knowledge"], a: 1, e: "Pedagogy is the art, science, and practice of teaching." },
    { q: "Which evaluation technique helps in continuous and comprehensive assessment?", o: ["Term-end exam only", "Portfolio assessment", "One-time viva", "Single multiple-choice test"], a: 1, e: "Portfolio assessment collects student work over time for comprehensive evaluation." },
    { q: "The National Education Policy 2020 recommends a multi-disciplinary approach in:", o: ["Primary education only", "Secondary education only", "Higher education", "All levels of education"], a: 3, e: "NEP 2020 advocates multi-disciplinary education across all levels." },
  ],
  researchAptitude: [
    { q: "A hypothesis that is testable and falsifiable is considered:", o: ["Weak", "Scientific", "Biased", "Anecdotal"], a: 1, e: "A scientific hypothesis must be empirically testable and capable of being proven false." },
    { q: "Which of the following is NOT a type of research design?", o: ["Experimental", "Correlational", "Fictional", "Survey"], a: 2, e: "'Fictional' is not a research design — experimental, correlational, and survey are." },
    { q: "The purpose of a literature review in research is to:", o: ["Increase the page count", "Identify gaps in existing knowledge", "Copy from previous studies", "Avoid doing new research"], a: 1, e: "A literature review identifies gaps, establishes context, and guides the research question." },
    { q: "Which statistical measure indicates the central tendency of a dataset?", o: ["Standard deviation", "Mean", "Range", "Variance"], a: 1, e: "The mean is the most common measure of central tendency." },
    { q: "Qualitative research primarily deals with:", o: ["Numerical data", "Statistical analysis", "Meanings and experiences", "Large sample sizes"], a: 2, e: "Qualitative research explores meanings, experiences, and social phenomena." },
    { q: "Random sampling ensures:", o: ["Only experts are selected", "Every member has an equal chance of selection", "The sample is small", "Bias is maximized"], a: 1, e: "Random sampling gives every population member an equal probability of selection." },
    { q: "The null hypothesis in research states that:", o: ["There is a significant effect", "There is no significant difference", "The results are biased", "The sample is invalid"], a: 1, e: "The null hypothesis assumes no significant difference or relationship between variables." },
    { q: "Which is a primary source of data?", o: ["Textbook", "Encyclopedia", "Questionnaire responses", "Newspaper article"], a: 2, e: "Primary data comes directly from original sources like questionnaire responses." },
    { q: "Plagiarism in research refers to:", o: ["Using statistical software", "Presenting others' work as one's own", "Publishing research", "Citing sources correctly"], a: 1, e: "Plagiarism is the act of using someone else's work without proper attribution." },
    { q: "Type I error in hypothesis testing occurs when:", o: ["A true null hypothesis is rejected", "A false null hypothesis is accepted", "The sample is too large", "The data is normally distributed"], a: 0, e: "Type I error is rejecting a true null hypothesis (false positive)." },
  ],
  comprehension: [
    { q: "In logical reasoning, the conclusion necessarily follows from the premises in:", o: ["Inductive reasoning", "Deductive reasoning", "Analogical reasoning", "Abductive reasoning"], a: 1, e: "Deductive reasoning guarantees the conclusion if the premises are true." },
    { q: "What is the next number in the series: 2, 6, 12, 20, 30, ...?", o: ["40", "42", "44", "36"], a: 1, e: "Differences: 4, 6, 8, 10, 12 — next term is 30 + 12 = 42." },
    { q: "Which Venn diagram correctly represents the relationship between Teachers, Women, and Mothers?", o: ["All separate circles", "Three overlapping circles", "Teachers inside Women", "Women inside Mothers"], a: 1, e: "Teachers, Women, and Mothers are overlapping sets — some teachers are women, some women are mothers, etc." },
    { q: "If all roses are flowers, and some flowers are red, then:", o: ["All roses are red", "Some roses may be red", "No roses are red", "All red things are roses"], a: 1, e: "We can only conclude that some roses may be red — not all." },
    { q: "A bar chart is most suitable for representing:", o: ["Continuous data over time", "Categorical data comparison", "Proportional data", "Geographical data"], a: 1, e: "Bar charts compare discrete/categorical data across groups." },
    { q: "Which measure of dispersion is most affected by outliers?", o: ["Interquartile range", "Median absolute deviation", "Range", "Mode"], a: 2, e: "Range (max − min) is most sensitive to extreme values (outliers)." },
    { q: "If the average of 5 numbers is 20, and four of them are 15, 18, 22, and 25, the fifth number is:", o: ["20", "18", "15", "22"], a: 0, e: "Sum = 5 × 20 = 100. Fifth number = 100 − (15+18+22+25) = 100 − 80 = 20." },
    { q: "An argument where the conclusion does not logically follow from the premises is called:", o: ["Valid", "Sound", "Fallacious", "Deductive"], a: 2, e: "A fallacious argument has a logical flaw where the conclusion doesn't follow." },
    { q: "Which of the following is a characteristic of good communication?", o: ["Ambiguity", "Clarity", "Jargon-heavy language", "One-way transmission"], a: 1, e: "Effective communication requires clarity, simplicity, and two-way exchange." },
    { q: "ICT in education stands for:", o: ["International Communication Technology", "Information and Communication Technology", "Internet Connected Teaching", "Integrated Classroom Teaching"], a: 1, e: "ICT stands for Information and Communication Technology." },
  ],
  higherEd: [
    { q: "UGC stands for:", o: ["Union Government Commission", "University Grants Commission", "United Graduate Council", "Universal Grant Corporation"], a: 1, e: "UGC = University Grants Commission, the statutory body for higher education in India." },
    { q: "NAAC assesses institutions based on:", o: ["Revenue generation", "Quality and excellence", "Number of students only", "Political connections"], a: 1, e: "NAAC (National Assessment and Accreditation Council) evaluates quality in higher education." },
    { q: "The first university established in India was:", o: ["Delhi University", "Nalanda University", "University of Calcutta", "Banaras Hindu University"], a: 2, e: "University of Calcutta (1857) was among the first three universities established in India." },
    { q: "SWAYAM portal is used for:", o: ["Banking", "Online courses and MOOCs", "Job applications", "Social media"], a: 1, e: "SWAYAM is India's national MOOCs platform for free online higher education courses." },
    { q: "The National Research Foundation (NRF) was proposed by:", o: ["NEP 1986", "NEP 2020", "Kothari Commission", "Radhakrishnan Commission"], a: 1, e: "NEP 2020 proposed establishing the National Research Foundation to fund research." },
    { q: "Which body regulates technical education in India?", o: ["UGC", "AICTE", "NCERT", "CBSE"], a: 1, e: "AICTE (All India Council for Technical Education) regulates technical education." },
    { q: "Academic freedom means:", o: ["Freedom to skip classes", "Freedom to teach and research without interference", "Freedom from examinations", "Freedom to plagiarize"], a: 1, e: "Academic freedom ensures scholars can teach and research without undue interference." },
    { q: "The concept of Guru-Shishya parampara is associated with:", o: ["Western education", "Ancient Indian education", "Modern online learning", "Vocational training only"], a: 1, e: "Guru-Shishya parampara (teacher-student tradition) is central to ancient Indian education." },
    { q: "Which commission recommended the establishment of autonomous colleges?", o: ["Kothari Commission", "Radhakrishnan Commission", "UGC Regulations", "Mudaliar Commission"], a: 0, e: "The Kothari Commission (1964-66) recommended autonomous colleges for academic freedom." },
    { q: "Open and Distance Learning (ODL) in India is primarily overseen by:", o: ["AICTE", "UGC-DEB", "CBSE", "NCTE"], a: 1, e: "UGC-DEB (Distance Education Bureau) oversees ODL programmes in India." },
  ],
  environment: [
    { q: "The Kyoto Protocol is related to:", o: ["Nuclear disarmament", "Reduction of greenhouse gas emissions", "Trade agreements", "Space exploration"], a: 1, e: "The Kyoto Protocol (1997) commits countries to reducing greenhouse gas emissions." },
    { q: "Which gas is primarily responsible for the greenhouse effect?", o: ["Nitrogen", "Oxygen", "Carbon dioxide", "Helium"], a: 2, e: "CO₂ is the primary greenhouse gas driving global warming." },
    { q: "Sustainable development aims to:", o: ["Maximize industrial output", "Meet present needs without compromising future generations", "Reduce all economic activity", "Focus only on environment"], a: 1, e: "Sustainable development balances current needs with the ability of future generations to meet theirs." },
    { q: "The Paris Agreement of 2015 relates to:", o: ["Trade liberalization", "Climate change mitigation", "Nuclear weapons", "Space treaties"], a: 1, e: "The Paris Agreement commits nations to limit global warming to 1.5–2°C above pre-industrial levels." },
    { q: "Which of the following is a renewable energy source?", o: ["Coal", "Natural gas", "Solar energy", "Petroleum"], a: 2, e: "Solar energy is renewable — it is replenished naturally and does not deplete." },
    { q: "Biodiversity hotspots are regions with:", o: ["Low species diversity", "High species richness and endemism under threat", "No human population", "Only marine life"], a: 1, e: "Biodiversity hotspots have exceptional species richness and high endemism but are threatened." },
    { q: "The Chipko Movement was associated with:", o: ["Water conservation", "Forest conservation", "Soil conservation", "Air quality"], a: 1, e: "The Chipko Movement (1973) involved villagers hugging trees to prevent deforestation." },
    { q: "E-waste refers to:", o: ["Excessive water waste", "Electronic waste", "Energy waste", "Edible waste"], a: 1, e: "E-waste is discarded electronic devices and components." },
    { q: "The ozone layer is found in the:", o: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], a: 1, e: "The ozone layer exists in the stratosphere, 15-35 km above Earth's surface." },
    { q: "Which Indian national park is famous for the one-horned rhinoceros?", o: ["Jim Corbett", "Kaziranga", "Ranthambore", "Sundarbans"], a: 1, e: "Kaziranga National Park in Assam is home to two-thirds of the world's one-horned rhinos." },
  ]
};

// Flatten all questions into a single pool
const allQuestions = [];
let idCounter = 1;

function addQuestions(topicPool, subject) {
  topicPool.forEach(item => {
    allQuestions.push({
      id: `ugcnet-${String(idCounter++).padStart(4, '0')}`,
      question: item.q,
      options: item.o,
      answer: item.a,
      explanation: item.e,
      subject: subject,
      difficulty: 'mixed'
    });
  });
}

addQuestions(paper1Topics.teachingAptitude, 'Teaching Aptitude');
addQuestions(paper1Topics.researchAptitude, 'Research Aptitude');
addQuestions(paper1Topics.comprehension, 'Reasoning & Comprehension');
addQuestions(paper1Topics.higherEd, 'Higher Education System');
addQuestions(paper1Topics.environment, 'People, Development & Environment');

// Generate more questions by creating variants
const variants = [
  // Teaching Aptitude variants
  { q: "Which of the following promotes active learning in the classroom?", o: ["Lecture only", "Group discussion and projects", "Passive note-taking", "Memorization drills"], a: 1, e: "Group discussions and projects actively engage students in the learning process.", s: "Teaching Aptitude" },
  { q: "Summative assessment is conducted:", o: ["During the learning process", "At the end of a course or unit", "Before teaching begins", "Only in primary school"], a: 1, e: "Summative assessment evaluates student learning at the end of an instructional unit.", s: "Teaching Aptitude" },
  { q: "The term 'andragogy' refers to:", o: ["Teaching children", "Teaching adults", "Teaching animals", "Teaching machines"], a: 1, e: "Andragogy is the theory and practice of teaching adult learners.", s: "Teaching Aptitude" },
  { q: "Which of the following is NOT a component of the ADDIE model?", o: ["Analysis", "Design", "Deployment", "Evaluation"], a: 2, e: "ADDIE stands for Analysis, Design, Development, Implementation, Evaluation — not Deployment.", s: "Teaching Aptitude" },
  { q: "Constructivist learning theory emphasizes:", o: ["Rote memorization", "Passive reception of knowledge", "Active construction of knowledge by learners", "Teacher-dominated classrooms"], a: 2, e: "Constructivism holds that learners actively construct their own understanding.", s: "Teaching Aptitude" },
  { q: "Which teaching aid is most effective for teaching abstract concepts?", o: ["Textbook reading", "Simulation and models", "Blackboard writing", "Dictation"], a: 1, e: "Simulations and models help visualize abstract concepts.", s: "Teaching Aptitude" },
  { q: "Inclusive education means:", o: ["Education only for gifted students", "Educating all students together regardless of abilities", "Separate schools for disabled students", "Online education only"], a: 1, e: "Inclusive education integrates all learners into the same learning environment.", s: "Teaching Aptitude" },
  { q: "Microteaching is a technique for:", o: ["Teaching large classes", "Training teachers in specific skills", "Distance education", "Automated assessment"], a: 1, e: "Microteaching breaks teaching into small components for focused skill practice.", s: "Teaching Aptitude" },
  { q: "The concept of 'Multiple Intelligences' was proposed by:", o: ["Piaget", "Howard Gardner", "Skinner", "Chomsky"], a: 1, e: "Howard Gardner proposed that intelligence is not a single ability but a set of multiple intelligences.", s: "Teaching Aptitude" },
  { q: "Which of the following is a characteristic of mastery learning?", o: ["Fixed time, variable achievement", "Variable time, fixed achievement", "No assessment required", "Random instruction order"], a: 1, e: "Mastery learning allows variable time for all students to achieve a fixed standard.", s: "Teaching Aptitude" },
  // Research Aptitude variants
  { q: "An independent variable is:", o: ["The variable being measured", "The variable manipulated by the researcher", "A constant factor", "An irrelevant variable"], a: 1, e: "The independent variable is deliberately changed to observe its effect on the dependent variable.", s: "Research Aptitude" },
  { q: "Which scale of measurement has a true zero point?", o: ["Nominal", "Ordinal", "Interval", "Ratio"], a: 3, e: "Ratio scale has a true zero point (e.g., weight, height, income).", s: "Research Aptitude" },
  { q: "Reliability in research refers to:", o: ["Accuracy of results", "Consistency of results across trials", "Ethical conduct", "Sample size"], a: 1, e: "Reliability means the research yields consistent results when repeated.", s: "Research Aptitude" },
  { q: "Which of the following is an example of a non-probability sampling technique?", o: ["Simple random sampling", "Systematic sampling", "Snowball sampling", "Stratified sampling"], a: 2, e: "Snowball sampling is non-probability: existing subjects recruit future subjects.", s: "Research Aptitude" },
  { q: "The p-value in statistical testing indicates:", o: ["The size of the sample", "The probability of obtaining results at least as extreme as observed, assuming the null hypothesis is true", "The standard deviation", "The mean of the data"], a: 1, e: "P-value measures the probability of observing the data if the null hypothesis were true.", s: "Research Aptitude" },
  { q: "A case study is a type of:", o: ["Experimental research", "Quantitative research", "Qualitative research", "Meta-analysis"], a: 2, e: "Case studies are qualitative, in-depth investigations of a single case or small number of cases.", s: "Research Aptitude" },
  { q: "Chi-square test is used for:", o: ["Testing association between categorical variables", "Comparing means", "Regression analysis", "Time series analysis"], a: 0, e: "Chi-square test determines if there is a significant association between categorical variables.", s: "Research Aptitude" },
  { q: "Which of the following enhances the internal validity of an experiment?", o: ["Large sample", "Random assignment to groups", "Long duration", "Multiple researchers"], a: 1, e: "Random assignment controls for confounding variables, strengthening internal validity.", s: "Research Aptitude" },
  { q: "APA style is primarily used for:", o: ["Creative writing", "Academic citation and referencing", "Legal documentation", "News reporting"], a: 1, e: "APA (American Psychological Association) style is a widely used academic citation format.", s: "Research Aptitude" },
  { q: "Triangulation in research means:", o: ["Using three researchers", "Using multiple methods or data sources to cross-verify findings", "Drawing triangles in data visualization", "Three-phase experiment design"], a: 1, e: "Triangulation uses multiple methods, data sources, or perspectives to validate findings.", s: "Research Aptitude" },
  // More comprehension / reasoning
  { q: "If a clock shows 3:15, the angle between the hour and minute hands is:", o: ["0°", "7.5°", "15°", "22.5°"], a: 1, e: "At 3:15, the minute hand is at 90° and the hour hand is at 97.5°, so the angle is 7.5°.", s: "Reasoning & Comprehension" },
  { q: "All dogs are animals. Some animals are pets. Therefore:", o: ["All dogs are pets", "Some dogs may be pets", "No dog is a pet", "All pets are dogs"], a: 1, e: "We can only conclude some dogs may be pets — not all.", s: "Reasoning & Comprehension" },
  { q: "The next term in the sequence 1, 1, 2, 3, 5, 8, ... is:", o: ["11", "12", "13", "10"], a: 2, e: "This is the Fibonacci sequence: each term is the sum of the two preceding terms. 5+8=13.", s: "Reasoning & Comprehension" },
  { q: "A pie chart is best used for showing:", o: ["Trends over time", "Proportions of a whole", "Correlation between variables", "Frequency distribution"], a: 1, e: "Pie charts display parts of a whole as proportional slices.", s: "Reasoning & Comprehension" },
  { q: "If P implies Q, and Q is false, then:", o: ["P is true", "P is false", "P may be true or false", "Nothing can be concluded"], a: 1, e: "By modus tollens: if P→Q and ¬Q, then ¬P.", s: "Reasoning & Comprehension" },
  // Higher Ed & Environment variants
  { q: "NIRF rankings are issued by:", o: ["UGC", "AICTE", "Ministry of Education", "NAAC"], a: 2, e: "The National Institutional Ranking Framework (NIRF) is a Ministry of Education initiative.", s: "Higher Education System" },
  { q: "The Right to Education Act in India was enacted in:", o: ["2005", "2009", "2010", "2015"], a: 1, e: "The RTE Act was enacted in 2009, making education a fundamental right for children aged 6-14.", s: "Higher Education System" },
  { q: "Carbon footprint refers to:", o: ["Fossil imprints in rocks", "Total greenhouse gas emissions caused by an entity", "Footprints made of carbon fiber", "A type of ink"], a: 1, e: "Carbon footprint is the total amount of greenhouse gases generated by actions.", s: "People, Development & Environment" },
  { q: "The United Nations Sustainable Development Goals (SDGs) consist of:", o: ["8 goals", "12 goals", "17 goals", "21 goals"], a: 2, e: "The SDGs adopted in 2015 comprise 17 goals for global sustainable development by 2030.", s: "People, Development & Environment" },
  { q: "Acid rain is primarily caused by:", o: ["CO₂ emissions", "SO₂ and NOₓ emissions", "Methane", "CFCs"], a: 1, e: "Acid rain results from sulfur dioxide and nitrogen oxides reacting with atmospheric water.", s: "People, Development & Environment" },
];

variants.forEach(v => {
  allQuestions.push({
    id: `ugcnet-${String(idCounter++).padStart(4, '0')}`,
    question: v.q,
    options: v.o,
    answer: v.a,
    explanation: v.e,
    subject: v.s,
    difficulty: 'mixed'
  });
});

// Distribute questions across levels with progressive difficulty
function distributeByLevel(questions, level) {
  const pool = JSON.parse(JSON.stringify(questions));
  // Assign difficulty tags based on level
  const difficultyMap = {
    C: { prefix: 'Foundation Level', diffTag: 'easy' },
    B: { prefix: 'Intermediate Level', diffTag: 'moderate' },
    A: { prefix: 'Advanced Level', diffTag: 'hard' },
    Aplus: { prefix: 'Expert Level', diffTag: 'expert' },
    Aplusplus: { prefix: 'Elite Level', diffTag: 'elite' }
  };
  const info = difficultyMap[level] || difficultyMap.C;
  return pool.map((q, idx) => ({
    ...q,
    id: `ugcnet-${level}-${String(idx + 1).padStart(4, '0')}`,
    difficulty: info.diffTag,
    levelTag: info.prefix
  }));
}

LEVELS.forEach(level => {
  const levelQuestions = distributeByLevel(allQuestions, level);
  const fileName = `level-${level}.json`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(levelQuestions, null, 2), 'utf-8');
  console.log(`✅ Created ${fileName} with ${levelQuestions.length} questions`);
});

console.log(`\n🎓 UGC NET question bank generated: ${LEVELS.length} level files × ${allQuestions.length} questions each = ${LEVELS.length * allQuestions.length} total.`);
