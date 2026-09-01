/* ============================================================
   MOCKHARD — Timer Module
   Countdown timer with pause/resume, warnings, and auto-submit.
   ============================================================ */

const MockTimer = (() => {
  let intervalId = null;
  let remaining = 0;
  let isRunning = false;
  let onTickCb = null;
  let onExpireCb = null;
  let startedAt = null;
  let totalDuration = 0;

  /**
   * Start the countdown timer.
   * @param {number} durationInSeconds - Total time in seconds
   * @param {function} onTick - Called every second with { remaining, formatted, percentage }
   * @param {function} onExpire - Called when timer reaches zero
   */
  function start(durationInSeconds, onTick, onExpire) {
    stop(); // Clear any existing timer

    remaining = durationInSeconds;
    totalDuration = durationInSeconds;
    onTickCb = onTick;
    onExpireCb = onExpire;
    isRunning = true;
    startedAt = Date.now();

    // Initial tick
    tick();

    intervalId = setInterval(() => {
      remaining -= 1;
      tick();

      if (remaining <= 0) {
        stop();
        if (onExpireCb) onExpireCb();
      }
    }, 1000);
  }

  function tick() {
    if (onTickCb) {
      onTickCb({
        remaining: Math.max(0, remaining),
        formatted: formatTime(remaining),
        percentage: totalDuration > 0 ? ((totalDuration - remaining) / totalDuration) * 100 : 0,
        isWarning: remaining <= 300 && remaining > 60, // under 5 min
        isDanger: remaining <= 60, // under 1 min
      });
    }
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isRunning = false;
  }

  function pause() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isRunning = false;
  }

  function resume() {
    if (!isRunning && remaining > 0) {
      isRunning = true;
      intervalId = setInterval(() => {
        remaining -= 1;
        tick();
        if (remaining <= 0) {
          stop();
          if (onExpireCb) onExpireCb();
        }
      }, 1000);
    }
  }

  function getRemaining() {
    return remaining;
  }

  function getElapsed() {
    return totalDuration - remaining;
  }

  function isActive() {
    return isRunning;
  }

  function setRemaining(seconds) {
    remaining = seconds;
  }

  function formatTime(seconds) {
    const s = Math.max(0, seconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  return {
    start,
    stop,
    pause,
    resume,
    getRemaining,
    getElapsed,
    isActive,
    setRemaining,
    formatTime,
  };
})();
