/**
 * MOCKHARD — JSON Data Files Validation Suite
 * ============================================
 * Validates integrity, JSON syntax, and basic schema constraints for
 * configuration and data files in data/ and data/examination-configs/.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CONFIGS_DIR = path.join(DATA_DIR, 'examination-configs');

function validateJsonFile(filePath, customValidator = null) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, file: relativePath, error: 'File does not exist' };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) {
      return { success: false, file: relativePath, error: 'File is empty' };
    }

    const parsed = JSON.parse(content);

    if (customValidator) {
      const customErr = customValidator(parsed);
      if (customErr) {
        return { success: false, file: relativePath, error: customErr };
      }
    }

    return { success: true, file: relativePath };
  } catch (err) {
    return { success: false, file: relativePath, error: err.message };
  }
}

function runJsonValidation() {
  console.log('🔍 Validating Repository JSON Data Files...\n');

  let totalFiles = 0;
  let passedCount = 0;
  let failedCount = 0;
  const errors = [];

  // 1. Validate data/examination-configs/*.json
  if (fs.existsSync(CONFIGS_DIR)) {
    const configFiles = fs.readdirSync(CONFIGS_DIR).filter(f => f.endsWith('.json'));
    console.log(`📁 Validating ${configFiles.length} examination configuration files...`);

    for (const file of configFiles) {
      totalFiles++;
      const fullPath = path.join(CONFIGS_DIR, file);
      const res = validateJsonFile(fullPath, (data) => {
        if (!data || typeof data !== 'object') return 'Must be a JSON object';
        if (!data.id && !data.category) return 'Missing "id" or "category" field';
        if (!data.name && !data.examinationName) return 'Missing "name" or "examinationName" field';
        return null;
      });

      if (res.success) {
        passedCount++;
      } else {
        failedCount++;
        errors.push(`${res.file}: ${res.error}`);
        console.error(`  ❌ ${file}: ${res.error}`);
      }
    }
  }

  // 2. Validate core data/*.json files
  const coreDataFiles = [
    {
      name: 'exam-updates.json',
      validator: (data) => {
        if (!Array.isArray(data.exams)) return 'Missing or invalid "exams" array';
        return null;
      }
    },
    {
      name: 'historical-database.json',
      validator: (data) => {
        if (!data.examinations || typeof data.examinations !== 'object') return 'Missing "examinations" object';
        return null;
      }
    },
    {
      name: 'aiims-exams.json',
      validator: (data) => {
        if (!Array.isArray(data.exams)) return 'Missing or invalid "exams" array';
        return null;
      }
    },
    {
      name: 'metrics.json',
      validator: (data) => {
        if (typeof data.totalQuestions !== 'number') return 'Missing or non-number "totalQuestions"';
        return null;
      }
    },
    {
      name: 'manifest.json',
      validator: (data) => {
        if (!data || typeof data !== 'object') return 'Must be a JSON object';
        return null;
      }
    }
  ];

  console.log(`\n📁 Validating core data files...`);
  for (const item of coreDataFiles) {
    const fullPath = path.join(DATA_DIR, item.name);
    if (fs.existsSync(fullPath)) {
      totalFiles++;
      const res = validateJsonFile(fullPath, item.validator);
      if (res.success) {
        passedCount++;
        console.log(`  ✅ ${item.name}`);
      } else {
        failedCount++;
        errors.push(`${res.file}: ${res.error}`);
        console.error(`  ❌ ${item.name}: ${res.error}`);
      }
    }
  }

  // 3. Validate any remaining top-level data/*.json files (e.g. schema, duplicate-report, etc.)
  const allDataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  for (const file of allDataFiles) {
    if (coreDataFiles.some(c => c.name === file)) continue; // Already validated
    totalFiles++;
    const fullPath = path.join(DATA_DIR, file);
    const res = validateJsonFile(fullPath);
    if (res.success) {
      passedCount++;
    } else {
      failedCount++;
      errors.push(`${res.file}: ${res.error}`);
      console.error(`  ❌ ${file}: ${res.error}`);
    }
  }

  console.log('\n======================================================');
  console.log(`📊 JSON Validation Summary: ${passedCount}/${totalFiles} files passed.`);

  if (failedCount > 0) {
    console.error(`❌ Validation failed with ${failedCount} error(s):`);
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('🎉 All JSON data and configuration files are valid and healthy!');
    process.exit(0);
  }
}

if (require.main === module) {
  runJsonValidation();
}

module.exports = { validateJsonFile, runJsonValidation };
