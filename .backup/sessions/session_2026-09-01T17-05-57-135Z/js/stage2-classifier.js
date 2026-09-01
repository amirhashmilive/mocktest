/**
 * STAGE 2 — QUESTION CLASSIFIER
 * =============================
 * Classifies questions across taxonomy, knowledge type, format, difficulty, and trap mechanisms.
 */
const Classifier = (() => {
  function classifyQuestion(question, config) {
    const qText = (question.question || '').toLowerCase();
    
    // Knowledge Type detection
    let knowledgeType = 'factual';
    if (qText.includes('consider the following') || qText.includes('which of the following statement')) {
      knowledgeType = 'conceptual';
    } if (qText.includes('calculate') || qText.includes('if') || qText.includes('scenario') || qText.includes('suppose')) {
      knowledgeType = 'application';
    } if (qText.includes('analyze') || qText.includes('interplay') || qText.includes('exception') || qText.includes('nuanced')) {
      knowledgeType = 'analytical';
    }

    // Format detection
    let questionFormat = 'direct';
    if (qText.includes('1.') && qText.includes('2.') && qText.includes('3.')) {
      questionFormat = 'statement-3';
    } else if (qText.includes('1.') && qText.includes('2.')) {
      questionFormat = 'statement-2';
    } else if (qText.includes('match list') || qText.includes('pair')) {
      questionFormat = 'matching';
    } else if (qText.includes('assertion') || qText.includes('reason')) {
      questionFormat = 'assertion-reason';
    }

    // Trap Mechanism identification
    let trapMechanism = 'none';
    if (qText.includes('not') || qText.includes('incorrect') || qText.includes('except')) {
      trapMechanism = 'negation';
    } else if (qText.includes('only') || qText.includes('always') || qText.includes('never')) {
      trapMechanism = 'absolute_qualifier';
    } else if (qText.includes('chronolog') || qText.includes('year') || qText.includes('order')) {
      trapMechanism = 'chronology_swap';
    }

    return {
      ...question,
      knowledgeType: question.knowledgeType || knowledgeType,
      questionFormat: question.questionFormat || questionFormat,
      trapMechanism: question.trapMechanism || trapMechanism
    };
  }

  return { classifyQuestion };
})();

if (typeof module !== 'undefined') module.exports = Classifier;
