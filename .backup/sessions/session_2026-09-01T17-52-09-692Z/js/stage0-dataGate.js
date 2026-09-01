/**
 * STAGE 0 — DATA / SOURCE GATE
 * =============================
 * Before generating anything, verify that sufficient data and sources exist.
 * Checks: previous papers, answer keys, source materials, factual verification capability.
 * 
 * The agent must NOT invent missing PYQs or answers.
 * If essential evidence is missing: PAUSE.
 */
const DataGate = (() => {
  const STATUS = {
    AVAILABLE: 'AVAILABLE',
    UNAVAILABLE: 'UNAVAILABLE',
    PARTIAL: 'PARTIAL',
    OUTDATED: 'OUTDATED',
    CONTRADICTORY: 'CONTRADICTORY'
  };

  /**
   * Check data availability for an examination configuration
   * @param {Object} config - Examination configuration
   * @param {Object} existingData - Any existing question data
   * @returns {Object} Gate status report
   */
  function checkDataAvailability(config, existingData = {}) {
    const report = {
      examination: config.id,
      timestamp: new Date().toISOString(),
      status: 'PASS',
      checks: {},
      warnings: [],
      blockers: []
    };

    // Check 1: Configuration completeness
    report.checks.configComplete = checkConfigCompleteness(config);
    if (report.checks.configComplete.status === STATUS.UNAVAILABLE) {
      report.blockers.push('Examination configuration is incomplete');
    }

    // Check 2: Subject coverage
    report.checks.subjectCoverage = checkSubjectCoverage(config);
    if (report.checks.subjectCoverage.status === STATUS.UNAVAILABLE) {
      report.blockers.push('No subject definitions available');
    }

    // Check 3: Source hierarchy
    report.checks.sourceHierarchy = checkSourceHierarchy(config);
    if (report.checks.sourceHierarchy.status === STATUS.UNAVAILABLE) {
      report.warnings.push('No source hierarchy defined — questions will lack source attribution');
    }

    // Check 4: Existing question bank
    report.checks.existingBank = checkExistingBank(config, existingData);

    // Check 5: Difficulty distribution validity
    report.checks.difficultyDistribution = checkDifficultyDistribution(config);
    if (report.checks.difficultyDistribution.status === STATUS.CONTRADICTORY) {
      report.blockers.push('Difficulty distribution does not sum to 1.0');
    }

    // Check 6: Question format coverage
    report.checks.formatCoverage = checkFormatCoverage(config);

    // Check 7: Cross-validate question count vs subjects
    report.checks.questionAllocation = checkQuestionAllocation(config);
    if (report.checks.questionAllocation.status === STATUS.CONTRADICTORY) {
      report.warnings.push('Subject weights do not sum to 1.0 — will be normalized');
    }

    // Determine overall gate status
    if (report.blockers.length > 0) {
      report.status = 'BLOCKED';
    } else if (report.warnings.length > 0) {
      report.status = 'PASS_WITH_WARNINGS';
    }

    return report;
  }

  function checkConfigCompleteness(config) {
    const required = ['id', 'name', 'subjects', 'questionCount', 'timeLimit'];
    const missing = required.filter(f => !config[f]);
    return {
      status: missing.length === 0 ? STATUS.AVAILABLE : STATUS.UNAVAILABLE,
      missing,
      detail: missing.length === 0 ? 'All required fields present' : `Missing: ${missing.join(', ')}`
    };
  }

  function checkSubjectCoverage(config) {
    if (!config.subjects || config.subjects.length === 0) {
      return { status: STATUS.UNAVAILABLE, count: 0, detail: 'No subjects defined' };
    }
    const withTopics = config.subjects.filter(s => s.topics && s.topics.length > 0);
    return {
      status: STATUS.AVAILABLE,
      count: config.subjects.length,
      withTopics: withTopics.length,
      detail: `${config.subjects.length} subjects, ${withTopics.length} with topic lists`
    };
  }

  function checkSourceHierarchy(config) {
    if (!config.sourceHierarchy) {
      return { status: STATUS.UNAVAILABLE, detail: 'No source hierarchy' };
    }
    const tiers = Object.keys(config.sourceHierarchy);
    const totalSources = tiers.reduce((sum, t) => sum + (config.sourceHierarchy[t] || []).length, 0);
    return {
      status: totalSources > 0 ? STATUS.AVAILABLE : STATUS.UNAVAILABLE,
      tiers: tiers.length,
      totalSources,
      detail: `${tiers.length} tiers, ${totalSources} sources`
    };
  }

  function checkExistingBank(config, existingData) {
    const questions = existingData.questions || [];
    return {
      status: questions.length > 0 ? STATUS.AVAILABLE : STATUS.UNAVAILABLE,
      count: questions.length,
      detail: `${questions.length} existing questions in bank`
    };
  }

  function checkDifficultyDistribution(config) {
    if (!config.difficultyDistribution) {
      return { status: STATUS.PARTIAL, detail: 'No difficulty distribution — will use defaults' };
    }
    const dd = config.difficultyDistribution;
    const sum = (dd.easy || 0) + (dd.moderate || 0) + (dd.difficult || 0);
    const valid = Math.abs(sum - 1.0) < 0.01;
    return {
      status: valid ? STATUS.AVAILABLE : STATUS.CONTRADICTORY,
      sum: sum.toFixed(2),
      detail: valid ? 'Distribution valid' : `Distribution sums to ${sum.toFixed(2)}, not 1.0`
    };
  }

  function checkFormatCoverage(config) {
    if (!config.questionFormats || config.questionFormats.length === 0) {
      return { status: STATUS.PARTIAL, detail: 'No format definitions — will use direct questions only' };
    }
    return {
      status: STATUS.AVAILABLE,
      formats: config.questionFormats.map(f => f.type),
      detail: `${config.questionFormats.length} question formats defined`
    };
  }

  function checkQuestionAllocation(config) {
    if (!config.subjects) return { status: STATUS.UNAVAILABLE, detail: 'No subjects' };
    const totalWeight = config.subjects.reduce((sum, s) => sum + (s.weight || 0), 0);
    const valid = Math.abs(totalWeight - 1.0) < 0.01;
    return {
      status: valid ? STATUS.AVAILABLE : STATUS.CONTRADICTORY,
      totalWeight: totalWeight.toFixed(2),
      allocation: config.subjects.map(s => ({
        subject: s.name,
        weight: s.weight || 0,
        questions: Math.round((s.weight || 0) * config.questionCount)
      })),
      detail: valid ? 'Weights sum to 1.0' : `Weights sum to ${totalWeight.toFixed(2)}`
    };
  }

  /**
   * Normalize subject weights to sum to 1.0
   */
  function normalizeWeights(config) {
    const totalWeight = config.subjects.reduce((sum, s) => sum + (s.weight || 0), 0);
    if (totalWeight === 0) {
      const equalWeight = 1 / config.subjects.length;
      config.subjects.forEach(s => s.weight = equalWeight);
    } else {
      config.subjects.forEach(s => s.weight = (s.weight || 0) / totalWeight);
    }
    return config;
  }

  return { checkDataAvailability, normalizeWeights, STATUS };
})();

if (typeof module !== 'undefined') module.exports = DataGate;
