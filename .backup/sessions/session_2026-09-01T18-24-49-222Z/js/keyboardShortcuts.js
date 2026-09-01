/**
 * MOCKHARD — Full Test Keyboard Shortcuts & Help Overlay Engine
 * =============================================================
 */

const KeyboardShortcuts = (() => {
  let isListening = false;

  function init(handlers = {}) {
    if (isListening) return;
    isListening = true;

    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        if (e.key === 'Escape') {
          e.target.blur();
          closeHelpOverlay();
        }
        return;
      }

      const key = e.key;

      // Escape key closes modals/overlays
      if (key === 'Escape') {
        closeHelpOverlay();
        if (handlers.onEscape) handlers.onEscape();
        return;
      }

      // Help Overlay Toggle (H)
      if (key === 'h' || key === 'H') {
        e.preventDefault();
        toggleHelpOverlay();
        return;
      }

      // Fullscreen Toggle (F)
      if (key === 'f' || key === 'F') {
        e.preventDefault();
        toggleFullScreen();
        return;
      }

      // Options 1-4
      if (['1', '2', '3', '4'].includes(key)) {
        e.preventDefault();
        const optIdx = parseInt(key) - 1;
        if (handlers.onSelectOption) handlers.onSelectOption(optIdx);
        return;
      }

      // Navigation: N / Right Arrow
      if (key === 'n' || key === 'N' || key === 'ArrowRight') {
        e.preventDefault();
        if (handlers.onNext) handlers.onNext();
        return;
      }

      // Navigation: P / Left Arrow
      if (key === 'p' || key === 'P' || key === 'ArrowLeft') {
        e.preventDefault();
        if (handlers.onPrev) handlers.onPrev();
        return;
      }

      // Mark for Review: M
      if (key === 'm' || key === 'M') {
        e.preventDefault();
        if (handlers.onMark) handlers.onMark();
        return;
      }

      // Submit: S
      if (key === 's' || key === 'S') {
        e.preventDefault();
        if (handlers.onSubmit) handlers.onSubmit();
        return;
      }

      // Reset: R
      if (key === 'r' || key === 'R') {
        if (e.ctrlKey) return; // Allow normal browser refresh Ctrl+R
        e.preventDefault();
        if (handlers.onReset) handlers.onReset();
        return;
      }

      // Timer Toggle: T
      if (key === 't' || key === 'T') {
        e.preventDefault();
        if (handlers.onToggleTimer) handlers.onToggleTimer();
        return;
      }

      // Question Palette Toggle: Q
      if (key === 'q' || key === 'Q') {
        e.preventDefault();
        if (handlers.onTogglePalette) handlers.onTogglePalette();
        return;
      }

      // Download Certificate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && (key === 'd' || key === 'D')) {
        if (handlers.onDownloadCertificate) {
          e.preventDefault();
          handlers.onDownloadCertificate();
        }
      }
    });
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  function renderHelpOverlayModal() {
    let overlay = document.getElementById('keyboardHelpModal');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'keyboardHelpModal';
    overlay.className = 'modal-overlay';
    overlay.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:center; backdrop-filter:blur(4px);';

    overlay.innerHTML = `
      <div class="modal-card card" style="max-width: 640px; width: 90%; max-height: 85vh; overflow-y: auto; padding: var(--space-2xl); border-radius: var(--radius-lg); background: var(--surface);">
        <div class="flex justify-between items-center" style="margin-bottom: var(--space-lg); border-bottom: 1.5px solid var(--border-color); padding-bottom: var(--space-md);">
          <h3 style="margin:0; font-size: 1.3rem; font-weight: 800;">⌨️ Keyboard Shortcuts Reference</h3>
          <button id="closeKeyboardHelpBtn" class="btn btn-ghost btn-sm" style="font-size: 1.2rem; cursor:pointer;">✕</button>
        </div>

        <div style="display: grid; gap: var(--space-md);">
          <div>
            <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--primary); font-weight: 700; margin-bottom: var(--space-xs);">1. Option Selection</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-xs); font-size: 0.9rem;">
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">1</kbd> Select Option A</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">2</kbd> Select Option B</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">3</kbd> Select Option C</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">4</kbd> Select Option D</div>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--primary); font-weight: 700; margin-bottom: var(--space-xs);">2. Test Navigation</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-xs); font-size: 0.9rem;">
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">N</kbd> or <kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">→</kbd> Next Question</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">P</kbd> or <kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">←</kbd> Previous Question</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">Q</kbd> Question Palette</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">Esc</kbd> Close Modal / Overlay</div>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--primary); font-weight: 700; margin-bottom: var(--space-xs);">3. Test Controls & Tools</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-xs); font-size: 0.9rem;">
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">M</kbd> Mark for Review</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">S</kbd> Submit Test</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">F</kbd> Toggle Fullscreen</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">T</kbd> Toggle Timer</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">H</kbd> Toggle Shortcuts Help</div>
              <div><kbd style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:bold;">Ctrl+D</kbd> Download Certificate</div>
            </div>
          </div>
        </div>

        <div style="margin-top: var(--space-xl); text-align: center;">
          <button id="closeKeyboardHelpBtn2" class="btn btn-primary btn-md" style="width: 100%;">Got It (Press Esc)</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('closeKeyboardHelpBtn').addEventListener('click', closeHelpOverlay);
    document.getElementById('closeKeyboardHelpBtn2').addEventListener('click', closeHelpOverlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeHelpOverlay();
    });

    return overlay;
  }

  function toggleHelpOverlay() {
    const overlay = renderHelpOverlayModal();
    if (overlay.style.display === 'flex') {
      overlay.style.display = 'none';
    } else {
      overlay.style.display = 'flex';
    }
  }

  function closeHelpOverlay() {
    const overlay = document.getElementById('keyboardHelpModal');
    if (overlay) overlay.style.display = 'none';
  }

  return {
    init,
    toggleHelpOverlay,
    closeHelpOverlay,
    toggleFullScreen
  };
})();
