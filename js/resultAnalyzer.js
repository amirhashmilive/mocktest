/**
 * MOCKHARD — Result Analyzer Engine
 * ====================================================
 * Processes and analyzes test results for randomized test papers.
 * Calculates score, accuracy, subject performance, level performance,
 * and builds structured question review payload for storage and results.html.
 */

function analyzeResults(paper, answers = {}, timeTaken = 0) {
  const questions = (paper && paper.questions) ? paper.questions : (Array.isArray(paper) ? paper : []);
  
  const results = {
    paperId: paper.paperId || `P-${Date.now()}`,
    category: paper.category || 'upsc',
    level: paper.level || 'C',
    subject: paper.subject || null,
    total: questions.length,
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    score: 0,
    percentage: 0,
    timeTaken: timeTaken || 0,
    questionDetails: [],
    questions: questions,
    answers: answers,
    subjectBreakdown: {},
    levelBreakdown: {},
    difficultyBreakdown: {}
  };

  const letters = ['a', 'b', 'c', 'd'];

  questions.forEach((q, index) => {
    const uChoice = answers[index];
    const isAnswered = uChoice !== undefined && uChoice !== null && uChoice !== '';
    const cChoice = (q.correct !== undefined) ? q.correct : q.correctAnswer;

    const isCorrect = isAnswered && Number(uChoice) === Number(cChoice);

    // Counts
    if (isAnswered) {
      if (isCorrect) results.correct++;
      else results.incorrect++;
    } else {
      results.unanswered++;
    }

    // Subject Breakdown
    const subject = q.subject || 'General';
    if (!results.subjectBreakdown[subject]) {
      results.subjectBreakdown[subject] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
    }
    results.subjectBreakdown[subject].total++;
    if (isCorrect) results.subjectBreakdown[subject].correct++;
    else if (isAnswered) results.subjectBreakdown[subject].wrong++;
    else results.subjectBreakdown[subject].skipped++;

    // Level Breakdown
    let level = q.level || paper.level || 'C';
    if (level === 'Aplus') level = 'A+';
    if (level === 'Aplusplus') level = 'A++';

    if (!results.levelBreakdown[level]) {
      results.levelBreakdown[level] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
    }
    results.levelBreakdown[level].total++;
    if (isCorrect) results.levelBreakdown[level].correct++;
    else if (isAnswered) results.levelBreakdown[level].wrong++;
    else results.levelBreakdown[level].skipped++;

    // Question Details Payload
    const optsArray = Array.isArray(q.options)
      ? q.options
      : [q.options.a, q.options.b, q.options.c, q.options.d];

    results.questionDetails.push({
      index: index + 1,
      id: q.id || `q_${index + 1}`,
      text: q.question || q.questionText || '',
      options: optsArray,
      userAnswer: isAnswered ? Number(uChoice) : null,
      userLetter: isAnswered ? letters[Number(uChoice)] : null,
      correctAnswer: Number(cChoice),
      correctLetter: letters[Number(cChoice)] || 'a',
      isCorrect: isCorrect,
      isAnswered: isAnswered,
      subject: subject,
      level: level,
      difficulty: q.difficulty || 'Moderate',
      explanation: q.explanation || '',
      eliminationPath: q.eliminationPath || ''
    });
  });

  results.score = results.correct;
  results.percentage = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0;

  // Add accuracy percentages to breakdowns
  Object.keys(results.subjectBreakdown).forEach(s => {
    const item = results.subjectBreakdown[s];
    item.accuracyPct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });

  Object.keys(results.levelBreakdown).forEach(l => {
    const item = results.levelBreakdown[l];
    item.accuracyPct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });

  return results;
}

if (typeof module !== 'undefined') module.exports = { analyzeResults };
