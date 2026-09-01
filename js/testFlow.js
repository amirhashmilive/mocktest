/**
 * MOCKHARD — Test Flow & Step Management System
 * ===============================================
 * Prevents circular navigation, manages step state (category -> subject -> level -> paper -> confirm),
 * and handles modal popups safely without memory leaks or infinite loops.
 */

const TestFlow = (() => {
  const state = {
    category: null,
    subject: null,
    level: null,
    paperIdx: 0,
    step: 'idle'
  };

  function resetState() {
    state.category = null;
    state.subject = null;
    state.level = null;
    state.paperIdx = 0;
    state.step = 'idle';
  }

  function closeAllModals() {
    const modalIds = [
      'upscSubjectModal',
      'upscMainsOptionalModal',
      'ugcSubjectModal',
      'levelModal',
      'paperModal',
      'timingModal'
    ];
    modalIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  return {
    state,
    resetState,
    closeAllModals
  };
})();

if (typeof module !== 'undefined') module.exports = TestFlow;
