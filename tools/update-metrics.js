/**
 * MOCKHARD — Metrics Automation Script
 * =====================================
 * Scans data/questions/ directory recursively, computes exact real-time metrics,
 * writes data/metrics.json with full category metadata, and updates index.html stats.
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

    const hasSubdirs = fs.readdirSync(catDir).some(f => fs.statSync(path.join(catDir, f)).isDirectory());

    function scanDirectory(dirPath) {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.endsWith('.json')) {
          const isTopLevel = (dirPath === catDir);
          // If category has subject subdirectories, skip top-level combined files to avoid double counting
          if (isTopLevel && hasSubdirs) {
            return;
          }

          const levelKey = item.replace('level-', '').replace('.json', '');
          try {
            const questions = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
            const count = Array.isArray(questions) ? questions.length : 0;
            if (!breakdown[cat].levels[levelKey]) {
              breakdown[cat].levels[levelKey] = 0;
            }
            breakdown[cat].levels[levelKey] += count;
            breakdown[cat].total += count;
            totalQuestions += count;
          } catch (err) {
            console.warn(`⚠️ Error reading ${fullPath}:`, err.message);
          }
        }
      });
    }

    scanDirectory(catDir);
  });

  // Load CATEGORIES from js/categories.js as single source of truth
  let categoriesList = [];
  try {
    const categoriesModule = require('../js/categories.js');
    if (Array.isArray(categoriesModule)) {
      categoriesList = categoriesModule.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        description: cat.desc,
        papers: cat.papers,
        questions: cat.questions,
        time: cat.time,
        negativeMarking: cat.negative,
        totalQuestionsInBank: breakdown[cat.id] ? breakdown[cat.id].total : 0,
        color: cat.color,
        featured: Boolean(cat.featured)
      }));
    }
  } catch (e) {
    console.warn('⚠️ Could not load js/categories.js:', e.message);
  }

  const metrics = {
    lastUpdated: new Date().toISOString(),
    totalQuestions: totalQuestions,
    totalCategories: categoryFolders.length,
    levels: 5,
    categories: categoriesList,
    breakdown: breakdown
  };

  fs.writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2), 'utf-8');
  console.log(`✅ Saved data/metrics.json — Total: ${totalQuestions.toLocaleString()} Qs across ${categoryFolders.length} categories.`);

  // Update index.html stat counter data attributes and category text if present
  if (fs.existsSync(INDEX_PATH)) {
    let html = fs.readFileSync(INDEX_PATH, 'utf-8');
    
    html = html.replace(/(id="statQuestions"[^>]*data-count=")\d+(")/g, `$1${totalQuestions}$2`);
    html = html.replace(/(id="statCategories"[^>]*data-count=")\d+(")/g, `$1${categoryFolders.length}$2`);
    html = html.replace(/Browse through \d+ exam categories/g, `Browse through ${categoryFolders.length} exam categories`);
    
    fs.writeFileSync(INDEX_PATH, html, 'utf-8');
    console.log(`✅ Updated index.html stat counter metrics.`);
  }

  return metrics;
}

scanMetrics();
