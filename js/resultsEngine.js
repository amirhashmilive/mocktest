/**
 * MOCKHARD — Results & Analysis Engine
 * ====================================================
 * Processes mock test results, generates question-by-question detailed analysis,
 * option distractor breakdowns, subject-wise and level-wise performance reports,
 * and handles print and PDF generation actions.
 */

const ResultsEngine = (() => {
  let resultData = null;
  let questionsList = [];
  let activeFilter = 'all';

  const LEVEL_NAMES = {
    'C': 'Level C (Beginner)',
    'B': 'Level B (Intermediate)',
    'A': 'Level A (Advanced)',
    'Aplus': 'Level A+ (Expert)',
    'A+': 'Level A+ (Expert)',
    'Aplusplus': 'Level A++ (Elite)',
    'A++': 'Level A++ (Elite)'
  };

  /**
   * Initializes the Results Engine, retrieves results from session/local storage
   */
  function init() {
    const params = (typeof MockApp !== 'undefined') ? MockApp.getParams() : {};
    const resultId = params.id;

    // 1. Session Storage
    const sessionRaw = sessionStorage.getItem('mockhard_latest_result');
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        if (!resultId || parsed.id === resultId) {
          resultData = parsed;
          questionsList = parsed.questions || getQuestionsFallback(parsed.category);
        }
      } catch (e) {
        console.warn('Failed to parse session result:', e);
      }
    }

    // 2. Local Storage by ID
    if (!resultData && resultId && typeof MockStorage !== 'undefined') {
      resultData = MockStorage.getTestById(resultId);
      if (resultData) {
        questionsList = resultData.questions || getQuestionsFallback(resultData.category);
      }
    }

    // 3. Fallback to latest test from history
    if (!resultData && typeof MockStorage !== 'undefined') {
      const history = MockStorage.getTestHistory();
      if (history && history.length > 0) {
        resultData = history[0];
        questionsList = resultData.questions || getQuestionsFallback(resultData.category);
      }
    }

    if (!resultData || !questionsList || questionsList.length === 0) {
      alert('No result data found. Redirecting to categories.');
      window.location.href = 'categories.html';
      return;
    }

    // Add questions to Revision Bank automatically if incorrect
    if (typeof RevisionMode !== 'undefined' && questionsList.length > 0) {
      RevisionMode.addQuestionsToRevision(
        questionsList,
        resultData.answers || {},
        resultData.category,
        resultData.level || 'C'
      );
    }

    // Store globally for direct access by PDF Generators
    if (typeof window !== 'undefined') {
      window.currentResultData = resultData;
      window.currentQuestionsList = questionsList;
    }

    renderFullReport();
    bindEvents();
  }

  function getQuestionsFallback(category) {
    if (typeof QUESTION_BANKS_MAP !== 'undefined' && QUESTION_BANKS_MAP[category]) {
      return QUESTION_BANKS_MAP[category];
    }
    if (typeof UPSC_QUESTIONS !== 'undefined') return UPSC_QUESTIONS;
    return [];
  }

  /**
   * Main Render function for the entire results report page
   */
  function renderFullReport() {
    renderHeaderSummary();
    renderSubjectPerformance();
    renderLevelPerformance();
    renderHistoricalAnalysis();
    renderQuestionAnalysisSection();
  }

  /**
   * Renders Historical Cut-off Benchmark Analysis Card
   */
  async function renderHistoricalAnalysis() {
    const container = document.getElementById('historicalAnalysisContainer');
    if (!container) return;

    const score = resultData.score || 0;
    const total = resultData.total || questionsList.length || 1;
    const cat = resultData.category || 'upsc';

    if (typeof HistoricalAnalysis !== 'undefined') {
      const comp = await HistoricalAnalysis.comparePerformance(cat, score, total);

      let tableRowsHtml = '';
      if (comp.historicalStats && comp.historicalStats.length > 0) {
        comp.historicalStats.forEach(st => {
          tableRowsHtml += `
            <tr>
              <td><strong>${st.year}</strong></td>
              <td><span class="badge badge-accent">${st.cutOff}</span></td>
              <td>${(st.appeared || 0).toLocaleString()}</td>
              <td>${(st.qualifiedPrelims || st.qualified || 0).toLocaleString()}</td>
            </tr>
          `;
        });
      }

      const tableBlockHtml = tableRowsHtml ? `
        <div style="margin-top:12px; margin-bottom:12px;">
          <div style="font-size:0.82rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">📚 Verified Multi-Year Cut-off Statistics:</div>
          <div class="table-container">
            <table class="data-table" style="width:100%; font-size:0.82rem;">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Cut-Off</th>
                  <th>Appeared</th>
                  <th>Qualified</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      ` : '';

      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <span style="font-weight:700; font-size:1rem; color:var(--text-primary);">${comp.examName}</span>
          <span class="badge" style="background:${comp.statusColor}; color:#fff; font-weight:800;">${comp.statusText}</span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap:10px; margin-bottom:14px;">
          <div style="background:var(--surface-hover); padding:10px; border-radius:var(--radius-sm); text-align:center; border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; color:var(--text-tertiary); font-weight:600;">YOUR SCORE</div>
            <div style="font-size:1.2rem; font-weight:800; color:${comp.statusColor};">${comp.candidatePct}%</div>
          </div>
          <div style="background:var(--surface-hover); padding:10px; border-radius:var(--radius-sm); text-align:center; border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; color:var(--text-tertiary); font-weight:600;">CUT-OFF (${comp.cutOffYear})</div>
            <div style="font-size:1.2rem; font-weight:800; color:var(--text-primary);">${comp.cutOffVal} (${comp.cutOffPct}%)</div>
          </div>
          ${comp.topperAvg ? `
          <div style="background:var(--surface-hover); padding:10px; border-radius:var(--radius-sm); text-align:center; border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; color:var(--text-tertiary); font-weight:600;">TOPPER AVERAGE</div>
            <div style="font-size:1.2rem; font-weight:800; color:var(--accent);">${comp.topperAvg}</div>
          </div>
          ` : ''}
        </div>

        ${tableBlockHtml}

        <div style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5; margin-bottom:10px;">
          <strong>🎯 Difficulty Trend:</strong> ${comp.difficultyTrend}<br>
          <strong>⏱️ Preparation Window:</strong> ${comp.recommendedPrep}<br>
          <strong>📚 High-Yield Focus Areas:</strong> ${(comp.focusAreas || []).join(', ')}
        </div>

        <div style="font-size:0.75rem; color:var(--text-tertiary); border-top:1px dashed var(--border-color); padding-top:8px;">
          <strong>🛡️ Authentic Sources:</strong> ${(comp.sources || []).join(' • ')}
        </div>
      `;
    }
  }

  /**
   * Renders the top report banner & score summary statistics
   */
  function renderHeaderSummary() {
    const score = resultData.score || 0;
    const total = resultData.total || questionsList.length || 1;
    const percentage = Math.round((score / total) * 100);
    const userAnswers = resultData.answers || {};

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questionsList.forEach((q, idx) => {
      const uChoice = normalizeAnswerIdx(userAnswers[idx]);
      const cChoice = normalizeAnswerIdx(q.correct);
      if (uChoice === null || uChoice === undefined) {
        skippedCount++;
      } else if (uChoice === cChoice) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const catName = resultData.categoryName || formatCategoryName(resultData.category);
    const levelLabel = normalizeLevelLabel(resultData.level || 'C');
    const timeTakenStr = (typeof MockApp !== 'undefined')
      ? MockApp.formatTime(resultData.timeTaken || 0)
      : `${Math.floor((resultData.timeTaken || 0) / 60)}m ${(resultData.timeTaken || 0) % 60}s`;

    const dateStr = resultData.date
      ? new Date(resultData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN');

    // Update Header Elements
    const titleEl = document.getElementById('reportTitle');
    if (titleEl) {
      titleEl.innerHTML = `📊 TEST ANALYSIS REPORT — <span class="report-cat-badge">${catName}</span> <span class="report-level-pill">Level ${levelLabel}</span>`;
    }

    const subEl = document.getElementById('reportSubtitle');
    if (subEl) {
      subEl.textContent = `Completed on ${dateStr} • Time Taken: ${timeTakenStr} • Total Questions: ${total}`;
    }

    // Donut chart / percentage text
    const pctEl = document.getElementById('scorePercentageText');
    if (pctEl) pctEl.textContent = `${percentage}%`;

    const ratioEl = document.getElementById('scoreRatioText');
    if (ratioEl) ratioEl.textContent = `${score} / ${total}`;

    // Stats elements
    const correctEl = document.getElementById('correctCountText');
    if (correctEl) correctEl.textContent = correctCount;

    const wrongEl = document.getElementById('wrongCountText');
    if (wrongEl) wrongEl.textContent = wrongCount;

    const skippedEl = document.getElementById('skippedCountText');
    if (skippedEl) skippedEl.textContent = skippedCount;

    const timeEl = document.getElementById('timeTakenText');
    if (timeEl) timeEl.textContent = timeTakenStr;

    // Performance Badge
    const badgeEl = document.getElementById('performanceBadge');
    if (badgeEl && typeof MockApp !== 'undefined') {
      const badgeInfo = MockApp.getPerformanceBadge(percentage);
      badgeEl.textContent = badgeInfo.text;
      badgeEl.className = `performance-badge ${badgeInfo.class}`;
    }

    // Draw Donut Chart if charts.js is available
    if (typeof MockCharts !== 'undefined' && document.getElementById('scoreDonutCanvas')) {
      MockCharts.drawDonutChart('scoreDonutCanvas', score, total, {
        size: 190,
        lineWidth: 16,
        animated: true,
      });
    }
  }

  /**
   * Calculates & renders subject-wise performance breakdown cards & meters
   */
  function renderSubjectPerformance() {
    const userAnswers = resultData.answers || {};
    const subjectStats = calculateSubjectBreakdown(questionsList, userAnswers);

    const tbody = document.getElementById('subjectBreakdownBody');
    const meterContainer = document.getElementById('subjectMetersContainer');

    if (tbody) tbody.innerHTML = '';
    if (meterContainer) meterContainer.innerHTML = '';

    Object.entries(subjectStats).forEach(([subject, stats]) => {
      const accPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      const perfClass = accPct >= 75 ? 'high' : accPct >= 40 ? 'medium' : 'low';

      // Table Row (if table element exists)
      if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(subject)}</strong></td>
          <td>${stats.total}</td>
          <td><span style="color:var(--success); font-weight:700;">${stats.correct}</span></td>
          <td><span style="color:var(--error); font-weight:700;">${stats.wrong}</span></td>
          <td><span style="color:var(--text-tertiary);">${stats.skipped}</span></td>
          <td><span class="badge ${accPct >= 75 ? 'badge-success' : accPct >= 40 ? 'badge-warning' : 'badge-danger'}">${accPct}%</span></td>
        `;
        tbody.appendChild(tr);
      }

      // Enhanced Large Card Widget (18px+ title, 22px progress bar, detailed metrics)
      if (meterContainer) {
        const cardItem = document.createElement('div');
        cardItem.className = 'subject-perf-card';
        cardItem.innerHTML = `
          <div class="subject-perf-header">
            <span class="subject-perf-title">📚 ${escapeHtml(subject)}</span>
            <span class="subject-score-pill ${perfClass}">${stats.correct} / ${stats.total} (${accPct}%)</span>
          </div>
          <div class="perf-bar-track-large">
            <div class="perf-bar-fill-large ${perfClass}" style="width: ${accPct}%;">
              ${accPct >= 15 ? `${accPct}%` : ''}
            </div>
          </div>
          <div class="subject-detail-pills">
            <span class="sub-metric-item" style="color: var(--success);">✅ Correct: ${stats.correct}</span>
            <span class="sub-metric-item" style="color: var(--error);">❌ Incorrect: ${stats.wrong}</span>
            <span class="sub-metric-item" style="color: var(--text-tertiary);">⚪ Skipped: ${stats.skipped}</span>
          </div>
        `;
        meterContainer.appendChild(cardItem);
      }
    });
  }

  /**
   * Calculates & renders level-wise performance breakdown cards & meters
   */
  function renderLevelPerformance() {
    const userAnswers = resultData.answers || {};
    const levelStats = calculateLevelBreakdown(questionsList, userAnswers);
    const container = document.getElementById('levelMetersContainer');

    if (!container) return;
    container.innerHTML = '';

    Object.entries(levelStats).forEach(([lvlKey, stats]) => {
      if (stats.total === 0) return;
      const accPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      const perfClass = accPct >= 75 ? 'high' : accPct >= 40 ? 'medium' : 'low';
      const levelTitle = LEVEL_NAMES[lvlKey] || `Level ${lvlKey}`;

      const cardItem = document.createElement('div');
      cardItem.className = 'subject-perf-card';
      cardItem.innerHTML = `
        <div class="subject-perf-header">
          <span class="subject-perf-title">🎯 ${escapeHtml(levelTitle)}</span>
          <span class="subject-score-pill ${perfClass}">${stats.correct} / ${stats.total} (${accPct}%)</span>
        </div>
        <div class="perf-bar-track-large">
          <div class="perf-bar-fill-large ${perfClass}" style="width: ${accPct}%;">
            ${accPct >= 15 ? `${accPct}%` : ''}
          </div>
        </div>
        <div class="subject-detail-pills">
          <span class="sub-metric-item" style="color: var(--success);">✅ Correct: ${stats.correct}</span>
          <span class="sub-metric-item" style="color: var(--error);">❌ Incorrect: ${stats.wrong}</span>
          <span class="sub-metric-item" style="color: var(--text-tertiary);">⚪ Skipped: ${stats.skipped}</span>
        </div>
      `;
      container.appendChild(cardItem);
    });
  }

  /**
   * Calculate Subject-wise Breakdown
   */
  function calculateSubjectBreakdown(questions, userAnswers) {
    const subjectStats = {};
    questions.forEach((q, idx) => {
      const subject = q.subject || 'General';
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
      }
      subjectStats[subject].total++;

      const uChoice = normalizeAnswerIdx(userAnswers[idx]);
      const cChoice = normalizeAnswerIdx(q.correct);

      if (uChoice === null || uChoice === undefined) {
        subjectStats[subject].skipped++;
      } else if (uChoice === cChoice) {
        subjectStats[subject].correct++;
      } else {
        subjectStats[subject].wrong++;
      }
    });
    return subjectStats;
  }

  /**
   * Calculate Level-wise Breakdown
   */
  function calculateLevelBreakdown(questions, userAnswers) {
    const levelOrder = ['C', 'B', 'A', 'A+', 'A++'];
    const levelStats = {};
    levelOrder.forEach(l => {
      levelStats[l] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
    });

    questions.forEach((q, idx) => {
      let lvl = q.level || resultData.level || 'C';
      if (lvl === 'Aplus') lvl = 'A+';
      if (lvl === 'Aplusplus') lvl = 'A++';
      if (!levelStats[lvl]) {
        levelStats[lvl] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
      }
      levelStats[lvl].total++;

      const uChoice = normalizeAnswerIdx(userAnswers[idx]);
      const cChoice = normalizeAnswerIdx(q.correct);

      if (uChoice === null || uChoice === undefined) {
        levelStats[lvl].skipped++;
      } else if (uChoice === cChoice) {
        levelStats[lvl].correct++;
      } else {
        levelStats[lvl].wrong++;
      }
    });
    return levelStats;
  }

  /**
   * Render Question-by-Question Detailed Analysis
   */
  function renderQuestionAnalysisSection() {
    const container = document.getElementById('reviewQuestionsContainer');
    if (!container) return;
    container.innerHTML = '';

    const userAnswers = resultData.answers || {};
    const bookmarked = new Set(resultData.bookmarked || []);
    let visibleCount = 0;
    let correctCount = 0;
    let wrongCount = 0;

    questionsList.forEach((q, idx) => {
      const uChoice = normalizeAnswerIdx(userAnswers[idx]);
      const cChoice = normalizeAnswerIdx(q.correct);
      const isAnswered = uChoice !== null && uChoice !== undefined;
      const isCorrect = isAnswered && uChoice === cChoice;
      const isBookmarked = bookmarked.has(idx);

      if (isCorrect) correctCount++;
      if (isAnswered && !isCorrect) wrongCount++;

      // Filter evaluation
      if (activeFilter === 'correct' && !isCorrect) return;
      if (activeFilter === 'incorrect' && (isCorrect || !isAnswered)) return;
      if (activeFilter === 'bookmarked' && !isBookmarked) return;

      visibleCount++;
      const qAnalysis = generateQuestionAnalysis(q, uChoice, cChoice, idx, isBookmarked);
      container.appendChild(createQuestionAnalysisElement(qAnalysis));
    });

    // Update filter count labels
    const totalFilterEl = document.getElementById('totalFilterCount');
    if (totalFilterEl) totalFilterEl.textContent = questionsList.length;

    const correctFilterEl = document.getElementById('correctFilterCount');
    if (correctFilterEl) correctFilterEl.textContent = correctCount;

    const incorrectFilterEl = document.getElementById('incorrectFilterCount');
    if (incorrectFilterEl) incorrectFilterEl.textContent = wrongCount;

    const bookmarkedFilterEl = document.getElementById('bookmarkedFilterCount');
    if (bookmarkedFilterEl) bookmarkedFilterEl.textContent = bookmarked.size;

    if (visibleCount === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No questions match this filter</h3>
          <p>Select "All Questions" to view the complete analysis.</p>
        </div>
      `;
    }
  }

  /**
   * Generates analysis payload for a question
   */
  function generateQuestionAnalysis(question, uChoice, cChoice, idx, isBookmarked) {
    const letters = ['a', 'b', 'c', 'd'];
    const isAnswered = uChoice !== null && uChoice !== undefined;
    const isCorrect = isAnswered && uChoice === cChoice;

    // Clean up question text (remove brackets/internal tags)
    let cleanText = (question.question || question.questionText || '')
      .replace(/^\[.*?\]\s*/, '')
      .replace(/^Question \d+ — .*? examination\.?\s*/gi, '')
      .replace(/\s*\[Variant #\d+\]/gi, '');

    const optsArray = Array.isArray(question.options)
      ? question.options
      : [question.options.a, question.options.b, question.options.c, question.options.d];

    const correctLetter = letters[cChoice] || 'a';
    const correctText = optsArray[cChoice] || '';
    const userLetter = isAnswered ? letters[uChoice] : null;

    return {
      index: idx + 1,
      total: questionsList.length,
      id: question.id || `q_${idx + 1}`,
      rawText: cleanText,
      options: optsArray,
      userChoice: uChoice,
      userLetter: userLetter,
      correctChoice: cChoice,
      correctLetter: correctLetter,
      correctText: correctText,
      isAnswered: isAnswered,
      isCorrect: isCorrect,
      isBookmarked: isBookmarked,
      subject: question.subject || 'General',
      level: question.level || resultData.level || 'C',
      difficulty: question.difficulty || getDifficultyLabel(question.level || resultData.level),
      interpretation: generateInterpretation(question, uChoice, cChoice),
      optionAnalysis: analyzeOptions(question, cChoice)
    };
  }

  /**
   * Synthesizes interpretation for a question
   */
  function generateInterpretation(question, uChoice, cChoice) {
    const letters = ['a', 'b', 'c', 'd'];
    const correctLetter = letters[cChoice] || 'a';
    const optsArray = Array.isArray(question.options)
      ? question.options
      : [question.options.a, question.options.b, question.options.c, question.options.d];
    const correctOptText = optsArray[cChoice] || '';

    const isAnswered = uChoice !== null && uChoice !== undefined;
    const isCorrect = isAnswered && uChoice === cChoice;

    let text = `The correct answer is (${correctLetter}) ${correctOptText}. `;

    if (question.explanation) {
      text += question.explanation + ' ';
    }

    if (isCorrect) {
      text += `You answered (${correctLetter}) correctly.`;
    } else if (!isAnswered) {
      text += `You skipped this question. Review the core factual and logical explanation above to master this concept.`;
    } else {
      const userLetter = letters[uChoice] || '?';
      text += `Your answer was (${userLetter}). `;
      if (question.distractorAnalysis) {
        text += question.distractorAnalysis;
      } else {
        text += `Option (${userLetter}) is incorrect because it fails key criteria. Review the detailed option analysis below.`;
      }
    }

    return text;
  }

  /**
   * Analyzes why options are correct / incorrect
   */
  function analyzeOptions(question, cChoice) {
    const letters = ['a', 'b', 'c', 'd'];
    const opts = Array.isArray(question.options)
      ? question.options
      : [question.options.a, question.options.b, question.options.c, question.options.d];

    const analysis = {};
    letters.forEach((letter, i) => {
      const isCorrect = i === cChoice;
      let exp = '';

      if (isCorrect) {
        exp = 'Correct statement / choice satisfying all core syllabus requirements.';
      } else if (question.distractorExplanations && question.distractorExplanations[letter]) {
        exp = question.distractorExplanations[letter];
      } else {
        exp = generateOptionDistractorReason(question, i, letter, cChoice);
      }

      analysis[letter] = {
        label: letter,
        text: opts[i] || '',
        isCorrect: isCorrect,
        explanation: exp
      };
    });

    return analysis;
  }

  function generateOptionDistractorReason(question, optIdx, letter, correctIdx) {
    const qText = question.question || question.questionText || '';
    if (qText.includes('1.') && qText.includes('2.')) {
      if (letter === 'a') return 'Omits key valid statement(s) substantiated in the official reference.';
      if (letter === 'b') return 'Includes unverified statement premises that fail verification.';
      if (letter === 'c') return 'Over-inclusive of statements that contain factual errors.';
      if (letter === 'd') return 'Incorrect premise; verified statements exist in the question prompt.';
    }

    const reasons = [
      'Incorrect factual premise or misattributes key subject principles.',
      'Distractor that confuses related terminology or historical context.',
      'Fails the specific conditions set in the question statement.',
      'Inaccurate value, legal clause, or geographical property.'
    ];
    return reasons[optIdx % reasons.length];
  }

  /**
   * Builds DOM node for Detailed Question Analysis Card
   */
  function createQuestionAnalysisElement(q) {
    const card = document.createElement('div');
    card.className = 'question-analysis-card animate-fade-in-up';

    const statusBadge = !q.isAnswered
      ? `<span class="q-status-badge skipped">⚪ SKIPPED</span>`
      : q.isCorrect
        ? `<span class="q-status-badge correct">✅ CORRECT</span>`
        : `<span class="q-status-badge incorrect">❌ INCORRECT</span>`;

    // Render Options List
    let optionsHtml = '';
    const letters = ['a', 'b', 'c', 'd'];

    q.options.forEach((optText, optIdx) => {
      const letter = letters[optIdx];
      const isCorrectOpt = optIdx === q.correctChoice;
      const isUserChoice = q.isAnswered && optIdx === q.userChoice;

      let itemClass = 'analysis-option-item';
      let tagHtml = '';

      if (isUserChoice && isCorrectOpt) {
        itemClass += ' user-correct';
        tagHtml = `<span class="user-answer-tag correct">← YOUR ANSWER ✅ CORRECT</span>`;
      } else if (isUserChoice && !isCorrectOpt) {
        itemClass += ' user-incorrect';
        tagHtml = `<span class="user-answer-tag incorrect">← YOUR ANSWER ❌ INCORRECT</span>`;
      } else if (isCorrectOpt) {
        itemClass += ' correct-target';
        tagHtml = `<span class="correct-answer-pill">✅ CORRECT ANSWER</span>`;
      }

      optionsHtml += `
        <div class="${itemClass}">
          <div class="opt-label-badge">(${letter})</div>
          <div class="opt-content-text">${escapeHtml(optText)}</div>
          ${tagHtml}
        </div>
      `;
    });

    // Render Option Distractor Breakdown (Why Option X is wrong)
    let distractorBreakdownHtml = '';
    letters.forEach(letter => {
      const item = q.optionAnalysis[letter];
      if (!item.isCorrect) {
        distractorBreakdownHtml += `
          <div class="option-distractor-line">
            <span class="distractor-icon">🔍</span>
            <strong>Why Option (${letter}) is wrong:</strong> ${escapeHtml(item.explanation)}
          </div>
        `;
      }
    });

    card.innerHTML = `
      <div class="q-card-header">
        <div class="q-card-title">
          <span>Question ${q.index} of ${q.total}</span>
          ${q.isBookmarked ? '<span class="bookmark-indicator" title="Bookmarked">🔖</span>' : ''}
        </div>
        ${statusBadge}
      </div>

      <div class="q-prompt-text">${escapeHtml(q.rawText)}</div>

      <div class="analysis-options-list">
        ${optionsHtml}
      </div>

      <div class="correct-highlight-box">
        ✅ <strong>Correct Answer:</strong> (${q.correctLetter}) ${escapeHtml(q.correctText)}
      </div>

      <div class="interpretation-box">
        <div class="interpretation-header">📖 Interpretation</div>
        <div class="interpretation-body">${escapeHtml(q.interpretation)}</div>
      </div>

      <div class="distractor-analysis-box">
        ${distractorBreakdownHtml}
      </div>

      <div class="q-meta-footer">
        <span class="q-meta-pill"><strong>Subject:</strong> ${escapeHtml(q.subject)}</span>
        <span class="q-meta-pill"><strong>Level:</strong> ${escapeHtml(normalizeLevelLabel(q.level))}</span>
        <span class="q-meta-pill"><strong>Difficulty:</strong> ${escapeHtml(q.difficulty)}</span>
      </div>
    `;

    return card;
  }

  /**
   * Bind Buttons & Actions
   */
  function bindEvents() {
    // 1. Download Certificate PDF Buttons
    document.querySelectorAll('.action-cert-pdf').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof PDFCertificate !== 'undefined' && resultData) {
          PDFCertificate.promptAndDownloadPDF(resultData);
        }
      });
    });

    // 2. Download Certificate PNG Buttons
    document.querySelectorAll('.action-cert-png').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof PDFCertificate !== 'undefined' && resultData) {
          PDFCertificate.promptAndDownloadPNG(resultData);
        }
      });
    });

    // 3. Print Certificate Buttons
    document.querySelectorAll('.action-print-cert').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof PDFCertificate !== 'undefined' && resultData) {
          PDFCertificate.promptAndGenerate(resultData);
        }
      });
    });

    // 4. Download Full Report PDF Buttons
    document.querySelectorAll('.action-report-pdf').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof ReportGenerator !== 'undefined' && resultData) {
          ReportGenerator.downloadFullReportPDF(resultData, questionsList);
        } else {
          window.print();
        }
      });
    });

    // 5. Print Report Buttons (Legacy fallback)
    document.querySelectorAll('.action-print-report').forEach(btn => {
      btn.addEventListener('click', () => {
        window.print();
      });
    });

    // 6. Keyboard Shortcut for Certificate Download
    if (typeof KeyboardShortcuts !== 'undefined') {
      KeyboardShortcuts.init({
        onDownloadCertificate: () => {
          if (typeof PDFCertificate !== 'undefined' && resultData) {
            PDFCertificate.promptAndDownloadPDF(resultData);
          }
        }
      });
    }

    // 7. Retry Test Button
    document.querySelectorAll('.action-retry-test').forEach(btn => {
      btn.addEventListener('click', () => {
        retryTest();
      });
    });

    // 8. Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        renderQuestionAnalysisSection();
      });
    });
  }

  /**
   * Triggers test retake with query parameters
   */
  function retryTest() {
    if (!resultData) return;
    let url = `test.html?category=${encodeURIComponent(resultData.category)}&level=${encodeURIComponent(resultData.level || 'C')}`;
    if (resultData.subjectName) {
      url += `&subject=${encodeURIComponent(resultData.subjectName)}`;
    }
    window.location.href = url;
  }

  /**
   * Generates or triggers report print/pdf export
   */
  function downloadReportPDF() {
    if (typeof PDFCertificate !== 'undefined' && resultData) {
      PDFCertificate.promptAndGenerate(resultData);
    } else {
      window.print();
    }
  }

  // Utility Helpers
  function normalizeAnswerIdx(val) {
    if (val === undefined || val === null || val === '') return null;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      if (lower === 'a' || lower === '0') return 0;
      if (lower === 'b' || lower === '1') return 1;
      if (lower === 'c' || lower === '2') return 2;
      if (lower === 'd' || lower === '3') return 3;
    }
    return null;
  }

  function normalizeLevelLabel(lvl) {
    if (!lvl) return 'C';
    let clean = lvl.toString().replace('plusplus', '++').replace('plus', '+');
    return clean;
  }

  function formatCategoryName(cat) {
    if (!cat) return 'Mock Examination';
    const names = {
      upsc: 'UPSC Civil Services',
      ssc: 'SSC Examinations',
      railways: 'Railways RRB',
      neet: 'NEET UG Medical',
      norcet: 'AIIMS NORCET',
      jee: 'JEE Main & Advanced',
      gate: 'GATE Engineering',
      clat: 'CLAT UG Law',
      board: 'Board Examinations',
      defence: 'Defence Exams'
    };
    return names[cat] || cat.toUpperCase();
  }

  function getDifficultyLabel(lvl) {
    const map = {
      'C': 'Beginner',
      'B': 'Intermediate',
      'A': 'Advanced',
      'Aplus': 'Expert',
      'A+': 'Expert',
      'Aplusplus': 'Elite',
      'A++': 'Elite'
    };
    return map[lvl] || 'Moderate';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return {
    init,
    generateQuestionAnalysis,
    generateInterpretation,
    analyzeOptions,
    calculateSubjectBreakdown,
    calculateLevelBreakdown,
    retryTest,
    downloadReportPDF
  };
})();

// Auto initialize on DOM Content Loaded if results-page present
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.results-page')) {
    ResultsEngine.init();
  }
});
