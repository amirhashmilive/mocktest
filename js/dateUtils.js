/**
 * MOCKHARD — Dynamic Date & Time Real-Time Awareness System
 * ==========================================================
 * Provides dynamic current date calculation, ISO date parsing,
 * future date filtering, days remaining countdown, and standard badge mapping.
 */

const DateUtils = (() => {
  /**
   * Returns current system date/time
   */
  function getCurrentDate() {
    return new Date();
  }

  /**
   * Parses any date string into a Date object
   */
  function parseDate(dateString) {
    if (!dateString) return null;
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) return parsed;

    // Fallback for custom formats e.g. "25 May 2026"
    const parts = dateString.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const months = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };
      const month = months[parts[1].substring(0, 3).toLowerCase()];
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  }

  /**
   * Formats Date to ISO YYYY-MM-DD
   */
  function toIsoDateString(dateObj) {
    const d = dateObj || getCurrentDate();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Checks if exam date is in the future relative to refDate
   */
  function isFutureDate(dateString, refDate = getCurrentDate()) {
    const examDate = parseDate(dateString);
    if (!examDate) return false;
    
    // Compare start of days
    const examDay = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate()).getTime();
    const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()).getTime();
    
    return examDay >= today;
  }

  /**
   * Calculates days remaining until dateString
   */
  function getDaysUntil(dateString, refDate = getCurrentDate()) {
    const examDate = parseDate(dateString);
    if (!examDate) return 0;

    const examDay = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate()).getTime();
    const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()).getTime();

    const diffTime = examDay - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Gets badge info based on days until exam:
   * 0-7 days   -> 🔴 URGENT
   * 8-30 days  -> 🟡 SOON
   * 31-90 days -> 🟢 UPCOMING
   * 90+ days   -> 🔵 FUTURE
   */
  function getBadgeInfo(dateString, refDate = getCurrentDate()) {
    const days = getDaysUntil(dateString, refDate);

    if (days < 0) {
      return {
        key: 'PAST',
        label: '⚫ EXPIRED',
        color: '#6c757d',
        bgColor: 'rgba(108, 117, 125, 0.15)',
        daysText: 'Completed',
        days: days
      };
    } else if (days <= 7) {
      return {
        key: 'URGENT',
        label: '🔴 URGENT',
        color: '#e63946',
        bgColor: 'rgba(230, 57, 70, 0.15)',
        daysText: days === 0 ? 'Today!' : `${days} day${days > 1 ? 's' : ''} left`,
        days: days
      };
    } else if (days <= 30) {
      return {
        key: 'SOON',
        label: '🟡 SOON',
        color: '#d97706',
        bgColor: 'rgba(217, 119, 6, 0.15)',
        daysText: `${days} days left`,
        days: days
      };
    } else if (days <= 90) {
      return {
        key: 'UPCOMING',
        label: '🟢 UPCOMING',
        color: '#2a9d8f',
        bgColor: 'rgba(42, 157, 143, 0.15)',
        daysText: `${days} days left`,
        days: days
      };
    } else {
      return {
        key: 'FUTURE',
        label: '🔵 FUTURE',
        color: '#4361ee',
        bgColor: 'rgba(67, 97, 238, 0.15)',
        daysText: `${days} days left`,
        days: days
      };
    }
  }

  /**
   * Filters array of exam objects to keep ONLY future exams, sorted by date (closest first)
   */
  function filterAndSortFutureExams(examsArray, refDate = getCurrentDate()) {
    if (!Array.isArray(examsArray)) return [];
    return examsArray
      .filter(exam => isFutureDate(exam.examDate, refDate))
      .sort((a, b) => {
        const da = parseDate(a.examDate);
        const db = parseDate(b.examDate);
        return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
      });
  }

  return {
    getCurrentDate,
    parseDate,
    toIsoDateString,
    isFutureDate,
    getDaysUntil,
    getBadgeInfo,
    filterAndSortFutureExams
  };
})();

if (typeof module !== 'undefined') {
  module.exports = DateUtils;
}
