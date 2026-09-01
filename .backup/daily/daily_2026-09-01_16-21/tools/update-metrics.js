/**
 * MOCKHARD — Metrics Automation Script
 * =====================================
 * Scans data/questions/ directory, computes exact real-time metrics,
 * writes data/metrics.json, and updates index.html stats.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = path.join(__dirname, '..', 'data', 'questions');
const METRICS_PATH = path.join(__dirname, '..', 'data', 'metrics.json');
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

function scanMetrics() {
  if (!fs.existsSync(QUESTIONS_DIR)) {
    console.error('❌ Questions directory not found:', QUESTIONS_DIR);
    return;
  }

  const categoryFolders = fs.readdirSync(QUESTIONS_DIR).filter(item => {
    return fs.statSync(path.join(QUESTIONS_DIR, item)).isDirectory();
  });

  let totalQuestions = 0;
  const breakdown = {};

  categoryFolders.forEach(cat => {
    breakdown[cat] = { total: 0, levels: {} };
    const catDir = path.join(QUESTIONS_DIR, cat);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.json'));

    files.forEach(file => {
      const levelKey = file.replace('level-', '').replace('.json', '');
      const filePath = path.join(catDir, file);
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const count = Array.isArray(questions) ? questions.length : 0;
        breakdown[cat].levels[levelKey] = count;
        breakdown[cat].total += count;
        totalQuestions += count;
      } catch (err) {
        console.warn(`⚠️ Error reading ${filePath}:`, err.message);
      }
    });
  });

  const metrics = {
    totalQuestions: totalQuestions,
    categories: categoryFolders.length,
    levels: 5,
    breakdown: breakdown,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2), 'utf-8');
  console.log(`✅ Saved data/metrics.json — Total: ${totalQuestions.toLocaleString()} Qs across ${categoryFolders.length} categories.`);

  // Update index.html stat counter data attributes if present
  if (fs.existsSync(INDEX_PATH)) {
    let html = fs.readFileSync(INDEX_PATH, 'utf-8');
    
    // Update data-count for questions and categories
    html = html.replace(/(id="statQuestions"[^>]*data-count=")\d+(")/g, `$1${totalQuestions}$2`);
    html = html.replace(/(id="statCategories"[^>]*data-count=")\d+(")/g, `$1${categoryFolders.length}$2`);
    
    fs.writeFileSync(INDEX_PATH, html, 'utf-8');
    console.log(`✅ Updated index.html stat counter metrics.`);
  }

  return metrics;
}

scanMetrics();
