/**
 * STAGE 6 — QUESTION BLUEPRINT GENERATOR
 * =====================================
 * Establishes exact allocations for subjects, difficulties, and formats BEFORE candidate generation begins.
 * Mathematically verifies that allocations equal target question count.
 */
const Blueprint = (() => {
  function createBlueprint(config, priorityMatrix) {
    const totalCount = config.questionCount || 120;
    const subjects = config.subjects || [];
    const diffDist = config.difficultyDistribution || { easy: 0.20, moderate: 0.50, difficult: 0.30 };

    // 1. Calculate subject allocation
    const subjectAllocation = {};
    let allocatedCount = 0;

    subjects.forEach((sub, idx) => {
      if (idx === subjects.length - 1) {
        // Last subject gets remainder to guarantee exact total
        subjectAllocation[sub.name] = totalCount - allocatedCount;
      } else {
        const count = Math.round(totalCount * (sub.weight || (1 / subjects.length)));
        subjectAllocation[sub.name] = count;
        allocatedCount += count;
      }
    });

    // 2. Calculate difficulty allocation
    const difficultyAllocation = {
      easy: Math.round(totalCount * (diffDist.easy || 0.20)),
      moderate: Math.round(totalCount * (diffDist.moderate || 0.50)),
      difficult: totalCount - Math.round(totalCount * (diffDist.easy || 0.20)) - Math.round(totalCount * (diffDist.moderate || 0.50))
    };

    // 3. Format allocation
    const formats = config.questionFormats || [{ type: 'direct', weight: 1.0 }];
    const formatAllocation = {};
    let fmtAllocated = 0;
    formats.forEach((fmt, idx) => {
      if (idx === formats.length - 1) {
        formatAllocation[fmt.type] = totalCount - fmtAllocated;
      } else {
        const count = Math.round(totalCount * fmt.weight);
        formatAllocation[fmt.type] = count;
        fmtAllocated += count;
      }
    });

    // Verification check
    const subjectSum = Object.values(subjectAllocation).reduce((a, b) => a + b, 0);
    const difficultySum = Object.values(difficultyAllocation).reduce((a, b) => a + b, 0);
    const formatSum = Object.values(formatAllocation).reduce((a, b) => a + b, 0);

    return {
      totalQuestions: totalCount,
      verification: {
        subjectMatch: subjectSum === totalCount,
        difficultyMatch: difficultySum === totalCount,
        formatMatch: formatSum === totalCount
      },
      subjectAllocation,
      difficultyAllocation,
      formatAllocation,
      priorityTopicMapping: priorityMatrix.slice(0, totalCount)
    };
  }

  return { createBlueprint };
})();

if (typeof module !== 'undefined') module.exports = Blueprint;
