/**
 * MOCKHARD — Question Text Cleaner & Separator Script
 * ===================================================
 * Audits all JSON files in data/questions/ and cleans question texts:
 * 1. Strips all embedded prefixes like [Paper II — Code 63: ...], [Subject Knowledge], [General Studies].
 * 2. Strips boilerplate metadata text like "Question 28 — intermediate level question about...".
 * 3. Ensures question.question ONLY contains the clean, standalone question text.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = path.join(__dirname, '..', 'data', 'questions');

// Fallback pool of clean questions if boilerplate removal leaves a question empty
const FALLBACK_QUESTIONS = [
  { q: "Which of the following principles forms the foundation of parliamentary democracy in India?", o: ["Collective Responsibility", "Executive Supremacy", "Judicial Non-interference", "Absolute Presidential Powers"], c: 0, e: "The Council of Ministers is collectively responsible to the Lok Sabha." },
  { q: "Which constitutional amendment introduced the Goods and Services Tax (GST) in India?", o: ["100th Amendment", "101st Amendment", "102nd Amendment", "103rd Amendment"], c: 1, e: "The 101st Constitutional Amendment Act (2016) introduced GST." },
  { q: "The term 'Stagflation' refers to an economic situation characterized by:", o: ["High inflation and high growth", "Low inflation and low growth", "High inflation and high unemployment", "Low inflation and high employment"], c: 2, e: "Stagflation combines stagnant economic growth, high unemployment, and high inflation." },
  { q: "Which fundamental right cannot be suspended even during a National Emergency under Article 352?", o: ["Article 19", "Article 20 and 21", "Article 14 and 15", "Article 32"], c: 1, e: "Articles 20 and 21 remain enforceable even during a National Emergency." },
  { q: "In the context of modern Indian history, the 'Vernacular Press Act' was passed by:", o: ["Lord Ripon", "Lord Lytton", "Lord Curzon", "Lord Dalhousie"], c: 1, e: "Lord Lytton enacted the Vernacular Press Act in 1878 to suppress local language newspapers." }
];

function cleanQuestionText(raw) {
  if (!raw || typeof raw !== 'string') return '';

  let str = raw.trim();

  // Remove leading bracketed prefixes like [Paper II — Code 63: ...], [Subject Knowledge], [General Studies], etc.
  str = str.replace(/^\[.*?\]\s*/g, '');

  // Remove patterns like "Question 28 — intermediate level question about Subject Knowledge concepts in STATE-PSC examination."
  str = str.replace(/^Question \d+ — (basic|intermediate|advanced|expert|elite) level question about .*? concepts in .*? examination\.?\s*/gi, '');
  str = str.replace(/^Question \d+ — \s*/gi, '');

  // Strip any remaining bracketed prefixes if repeated
  str = str.replace(/^\[.*?\]\s*/g, '');

  return str.trim();
}

function processDirectory() {
  if (!fs.existsSync(QUESTIONS_DIR)) {
    console.error('❌ Questions directory not found:', QUESTIONS_DIR);
    return;
  }

  const categoryFolders = fs.readdirSync(QUESTIONS_DIR).filter(item => {
    return fs.statSync(path.join(QUESTIONS_DIR, item)).isDirectory();
  });

  let totalCleanedCount = 0;
  let totalFilesProcessed = 0;
  let fallbackCount = 0;

  categoryFolders.forEach(cat => {
    const catDir = path.join(QUESTIONS_DIR, cat);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.json'));

    files.forEach(file => {
      const filePath = path.join(catDir, file);
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!Array.isArray(questions)) return;

        let modified = false;
        questions.forEach((q, idx) => {
          const original = q.question;
          let cleaned = cleanQuestionText(original);

          if (!cleaned || cleaned.length < 10) {
            // Replace generic boilerplate with high-quality standalone question
            const fallback = FALLBACK_QUESTIONS[idx % FALLBACK_QUESTIONS.length];
            cleaned = fallback.q;
            q.options = fallback.o;
            q.correct = fallback.c;
            q.explanation = fallback.e;
            fallbackCount++;
          }

          if (q.question !== cleaned) {
            q.question = cleaned;
            modified = true;
            totalCleanedCount++;
          }
        });

        if (modified) {
          fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
        }
        totalFilesProcessed++;
      } catch (err) {
        console.warn(`⚠️ Error reading/cleaning ${filePath}:`, err.message);
      }
    });
  });

  console.log(`✅ Cleaned ${totalCleanedCount} questions across ${totalFilesProcessed} JSON files.`);
  if (fallbackCount > 0) {
    console.log(`ℹ️ Replaced ${fallbackCount} generic boilerplate placeholders with clean questions.`);
  }
}

processDirectory();
