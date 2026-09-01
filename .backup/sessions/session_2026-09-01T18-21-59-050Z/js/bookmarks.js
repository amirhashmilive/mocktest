/**
 * MOCKHARD — Bookmarks & Question Notes Engine
 * ============================================
 */

const MockNotes = (() => {
  const NOTES_KEY = 'mockhard_notes';

  function getNotes() {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveNote(questionId, noteText, questionData = null) {
    const notes = getNotes();
    if (!noteText || !noteText.trim()) {
      delete notes[questionId];
    } else {
      notes[questionId] = {
        questionId: questionId,
        text: noteText.trim(),
        savedAt: new Date().toISOString(),
        question: questionData ? questionData.question : '',
        category: questionData ? questionData.category : '',
        subject: questionData ? questionData.subject : ''
      };
    }
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return notes[questionId] || null;
  }

  function getNote(questionId) {
    const notes = getNotes();
    return notes[questionId] || null;
  }

  function deleteNote(questionId) {
    const notes = getNotes();
    delete notes[questionId];
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }

  return {
    getNotes,
    saveNote,
    getNote,
    deleteNote
  };
})();
