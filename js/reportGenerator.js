/**
 * MOCKHARD — Full Report PDF Generator Engine
 * ====================================================
 * Compiles test metrics, subject breakdown, level breakdown,
 * historical benchmarks, and question-by-question solutions into
 * a downloadable PDF report document.
 */

const ReportGenerator = (() => {

  /**
   * Resolves active test result data from session or local storage if not explicitly passed
   */
  function getActiveResultData() {
    if (typeof window !== 'undefined' && window.currentResultData) {
      return window.currentResultData;
    }
    try {
      const sess = sessionStorage.getItem('mockhard_latest_result');
      if (sess) return JSON.parse(sess);
    } catch(e) {}
    try {
      const loc = localStorage.getItem('mockhard_latest_test_result');
      if (loc) return JSON.parse(loc);
    } catch(e) {}
    if (typeof MockStorage !== 'undefined' && MockStorage.getLatestTestResult) {
      return MockStorage.getLatestTestResult();
    }
    return null;
  }

  /**
   * Generates and triggers direct PDF download for full test report
   */
  function downloadFullReportPDF(resultData, questionsList) {
    console.log('📥 downloadFullReportPDF initiated', { resultData, questionsList });
    if (!resultData || typeof resultData !== 'object' || !('score' in resultData)) {
      resultData = getActiveResultData();
    }
    if (!resultData) {
      alert('No test result data available to generate report PDF.');
      return;
    }

    const questions = (Array.isArray(questionsList) && questionsList.length > 0)
      ? questionsList
      : (resultData.questions || (window.currentQuestionsList || []));

    const catName = resultData.categoryName || resultData.category || 'Mock Examination';
    const levelLabel = (resultData.level || 'C').toString().replace('plusplus', '++').replace('plus', '+');
    const score = resultData.score || 0;
    const total = resultData.total || questions.length || 1;
    const percentage = Math.round((score / total) * 100);
    const dateStr = resultData.date
      ? new Date(resultData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN');

    const paperId = resultData.paperId || resultData.id || Date.now().toString(36).toUpperCase();
    const fileName = `Mockhard_Full_Report_${catName.replace(/[^a-zA-Z0-9]/g, '_')}_Level_${levelLabel}_${paperId}.pdf`;

    // Use jsPDF if available
    if (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let y = 15;

      // Header Banner
      doc.setFillColor(15, 52, 96);
      doc.rect(10, y, 190, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('🎯 MOCKHARD — FULL TEST ANALYSIS REPORT', 15, y + 10);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Exam: ${catName} | Level: ${levelLabel} | Date: ${dateStr} | Paper ID: ${paperId}`, 15, y + 18);

      y += 32;

      // Score Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(10, y, 190, 28, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`SCORE: ${score} / ${total} (${percentage}%)`, 20, y + 12);

      const statusText = percentage >= 90 ? '🏆 EXCELLENT' : percentage >= 70 ? '✅ PASSED' : percentage >= 50 ? '⚠️ NEEDS IMPROVEMENT' : '🔁 RE-TEST RECOMMENDED';
      doc.text(`PERFORMANCE TIER: ${statusText}`, 20, y + 20);

      const timeTakenStr = formatTimeStr(resultData.timeTaken || 0);
      doc.text(`TIME TAKEN: ${timeTakenStr}`, 130, y + 12);
      doc.text(`QUESTIONS: ${total}`, 130, y + 20);

      y += 36;

      // Section Header: Question Breakdown
      doc.setFillColor(241, 245, 249);
      doc.rect(10, y, 190, 8, 'F');
      doc.setTextColor(15, 52, 96);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('QUESTION-BY-QUESTION SOLUTIONS & INTERPRETATIONS', 14, y + 6);

      y += 12;

      const letters = ['a', 'b', 'c', 'd'];
      const userAnswers = resultData.answers || {};

      questions.forEach((q, idx) => {
        // Page overflow check
        if (y > 260) {
          doc.addPage();
          y = 15;
        }

        const uChoice = userAnswers[idx];
        const cChoice = (q.correct !== undefined) ? q.correct : q.correctAnswer;
        const isAnswered = uChoice !== undefined && uChoice !== null;
        const isCorrect = isAnswered && Number(uChoice) === Number(cChoice);

        // Status indicator
        const qStatusStr = !isAnswered ? '⚪ SKIPPED' : isCorrect ? '✅ CORRECT' : '❌ INCORRECT';

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        
        const rawText = (q.question || q.questionText || '')
          .replace(/^\[.*?\]\s*/, '')
          .replace(/^Question \d+ — .*? examination\.?\s*/gi, '')
          .replace(/\s*\[Variant #\d+\]/gi, '');

        const splitQ = doc.splitTextToSize(`Q${idx + 1}. ${rawText} [${qStatusStr}]`, 185);
        doc.text(splitQ, 12, y);
        y += (splitQ.length * 5) + 2;

        // Render Options
        const optsArray = Array.isArray(q.options)
          ? q.options
          : [q.options?.a, q.options?.b, q.options?.c, q.options?.d];

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        optsArray.forEach((optText, optIdx) => {
          if (!optText) return;
          if (y > 270) { doc.addPage(); y = 15; }

          const letter = letters[optIdx];
          let optMark = `(${letter}) ${optText}`;

          if (isAnswered && Number(uChoice) === optIdx) {
            optMark += isCorrect ? '  ← YOUR ANSWER ✅' : '  ← YOUR ANSWER ❌';
          }
          if (Number(cChoice) === optIdx) {
            optMark += '  [CORRECT ANSWER]';
          }

          if (Number(cChoice) === optIdx) doc.setTextColor(22, 163, 74);
          else if (isAnswered && Number(uChoice) === optIdx) doc.setTextColor(220, 38, 38);
          else doc.setTextColor(71, 85, 105);

          const splitOpt = doc.splitTextToSize(optMark, 180);
          doc.text(splitOpt, 16, y);
          y += (splitOpt.length * 4.5);
        });

        // Explanation text
        if (q.explanation) {
          if (y > 265) { doc.addPage(); y = 15; }
          doc.setTextColor(15, 52, 96);
          doc.setFont('helvetica', 'italic');
          const splitExp = doc.splitTextToSize(`Explanation: ${q.explanation}`, 180);
          doc.text(splitExp, 16, y);
          y += (splitExp.length * 4.5) + 4;
        } else {
          y += 3;
        }

        // Line separator
        doc.setDrawColor(226, 232, 240);
        doc.line(10, y, 200, y);
        y += 6;
      });

      // Save PDF document
      console.log('📄 Saving Full Report PDF via jsPDF:', fileName);
      doc.save(fileName);
    } else {
      console.warn('⚠️ jsPDF not loaded, triggering print fallback');
      window.print();
    }
  }

  function formatTimeStr(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  return {
    downloadFullReportPDF
  };
})();

// Top-level global function on window for direct HTML inline calls or event listeners
if (typeof window !== 'undefined') {
  window.downloadFullReportPDF = function(resultData, questionsList) {
    console.log('📥 window.downloadFullReportPDF called');
    if (typeof ReportGenerator !== 'undefined' && ReportGenerator.downloadFullReportPDF) {
      ReportGenerator.downloadFullReportPDF(resultData, questionsList);
    }
  };
}

if (typeof module !== 'undefined') module.exports = ReportGenerator;
