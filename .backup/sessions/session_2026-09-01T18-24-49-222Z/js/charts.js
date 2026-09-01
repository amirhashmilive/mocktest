/* ============================================================
   MOCKHARD — Canvas Charts
   Pure canvas-based chart rendering for the analytics dashboard.
   No external dependencies.
   ============================================================ */

const MockCharts = (() => {
  // ── Get computed CSS variable ──
  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // ── Setup canvas with device pixel ratio ──
  function setupCanvas(canvasId, width, height) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { canvas, ctx, width, height };
  }

  // ============================================================
  // DONUT CHART (for score circle)
  // ============================================================
  function drawDonutChart(canvasId, value, total, options = {}) {
    const {
      size = 200,
      lineWidth = 14,
      bgColor = null,
      fgColor = null,
      animated = true,
    } = options;

    const setup = setupCanvas(canvasId, size, size);
    if (!setup) return;
    const { ctx, width, height } = setup;

    const cx = width / 2;
    const cy = height / 2;
    const radius = (Math.min(width, height) / 2) - lineWidth;
    const percentage = total > 0 ? value / total : 0;
    const endAngle = percentage * Math.PI * 2;

    const bg = bgColor || getCSSVar('--border-color') || '#e2e6ef';
    const fg = fgColor || (percentage >= 0.8 ? (getCSSVar('--success') || '#06d6a0') :
                           percentage >= 0.6 ? (getCSSVar('--primary') || '#0f3460') :
                           percentage >= 0.4 ? (getCSSVar('--gold') || '#f0a500') :
                           (getCSSVar('--error') || '#ef476f'));

    function draw(progress) {
      ctx.clearRect(0, 0, width, height);

      // Background arc
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = bg;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Foreground arc
      if (endAngle > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + endAngle * progress);
        ctx.strokeStyle = fg;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    if (animated) {
      let start = null;
      const duration = 1200;
      function animate(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        draw(eased);
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    } else {
      draw(1);
    }
  }

  // ============================================================
  // LINE CHART (for score trend)
  // ============================================================
  function drawLineChart(canvasId, labels, data, options = {}) {
    const {
      width = 600,
      height = 250,
      lineColor = null,
      fillColor = null,
      pointColor = null,
      animated = true,
    } = options;

    const setup = setupCanvas(canvasId, width, height);
    if (!setup) return;
    const { ctx } = setup;

    if (!data || data.length === 0) {
      drawEmptyState(ctx, width, height, 'No data yet');
      return;
    }

    const padding = { top: 20, right: 20, bottom: 40, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data, 100);
    const minVal = 0;
    const range = maxVal - minVal || 1;

    const line = lineColor || getCSSVar('--primary') || '#0f3460';
    const fill = fillColor || (line + '15');
    const point = pointColor || getCSSVar('--accent') || '#e94560';
    const textColor = getCSSVar('--text-secondary') || '#5a6377';
    const gridColor = getCSSVar('--border-color') || '#e2e6ef';

    function getX(i) {
      return padding.left + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2);
    }
    function getY(val) {
      return padding.top + chartH - ((val - minVal) / range) * chartH;
    }

    function draw(progress) {
      ctx.clearRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Y-axis labels
      ctx.fillStyle = textColor;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        const val = Math.round(maxVal - (maxVal / 4) * i);
        ctx.fillText(val + '%', padding.left - 8, y);
      }

      // X-axis labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      labels.forEach((label, i) => {
        if (labels.length <= 10 || i % Math.ceil(labels.length / 8) === 0) {
          ctx.fillText(label, getX(i), height - padding.bottom + 10);
        }
      });

      // Draw the visible portion based on progress
      const visibleCount = Math.ceil(data.length * progress);

      // Area fill
      if (visibleCount > 1) {
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(data[0]));
        for (let i = 1; i < visibleCount; i++) {
          ctx.lineTo(getX(i), getY(data[i]));
        }
        ctx.lineTo(getX(visibleCount - 1), padding.top + chartH);
        ctx.lineTo(getX(0), padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
      }

      // Line
      if (visibleCount > 0) {
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(data[0]));
        for (let i = 1; i < visibleCount; i++) {
          ctx.lineTo(getX(i), getY(data[i]));
        }
        ctx.strokeStyle = line;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Points
      for (let i = 0; i < visibleCount; i++) {
        ctx.beginPath();
        ctx.arc(getX(i), getY(data[i]), 4, 0, Math.PI * 2);
        ctx.fillStyle = point;
        ctx.fill();
        ctx.strokeStyle = getCSSVar('--surface') || '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    if (animated) {
      let start = null;
      const duration = 1000;
      function animate(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        draw(eased);
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    } else {
      draw(1);
    }
  }

  // ============================================================
  // BAR CHART (for category breakdown)
  // ============================================================
  function drawBarChart(canvasId, labels, data, options = {}) {
    const {
      width = 400,
      height = 250,
      barColors = null,
      animated = true,
    } = options;

    const setup = setupCanvas(canvasId, width, height);
    if (!setup) return;
    const { ctx } = setup;

    if (!data || data.length === 0) {
      drawEmptyState(ctx, width, height, 'No data yet');
      return;
    }

    const padding = { top: 20, right: 20, bottom: 50, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data, 100);
    const barWidth = Math.min(40, (chartW / data.length) * 0.6);
    const barGap = (chartW - barWidth * data.length) / (data.length + 1);

    const defaultColors = [
      '#4361ee', '#f72585', '#06d6a0', '#fca311', '#118ab2',
      '#ef476f', '#06d6a0', '#ffd166', '#073b4c', '#e94560'
    ];
    const colors = barColors || defaultColors;

    const textColor = getCSSVar('--text-secondary') || '#5a6377';
    const gridColor = getCSSVar('--border-color') || '#e2e6ef';

    function draw(progress) {
      ctx.clearRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Y-axis labels
      ctx.fillStyle = textColor;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        const val = Math.round(maxVal - (maxVal / 4) * i);
        ctx.fillText(val + '%', padding.left - 8, y);
      }

      // Bars
      data.forEach((val, i) => {
        const x = padding.left + barGap * (i + 1) + barWidth * i;
        const barH = (val / maxVal) * chartH * progress;
        const y = padding.top + chartH - barH;

        // Bar
        const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
        const color = colors[i % colors.length];
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '80');
        ctx.fillStyle = gradient;

        // Rounded top
        const r = Math.min(4, barWidth / 2);
        ctx.beginPath();
        ctx.moveTo(x, padding.top + chartH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + barWidth - r, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
        ctx.lineTo(x + barWidth, padding.top + chartH);
        ctx.fill();

        // Value on top
        if (progress > 0.8) {
          ctx.fillStyle = textColor;
          ctx.textAlign = 'center';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.fillText(Math.round(val) + '%', x + barWidth / 2, y - 8);
        }

        // Label below
        ctx.fillStyle = textColor;
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + barWidth / 2, padding.top + chartH + 12);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(labels[i], 0, 0);
        ctx.restore();
      });
    }

    if (animated) {
      let start = null;
      const duration = 800;
      function animate(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        draw(eased);
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    } else {
      draw(1);
    }
  }

  // ── Empty state helper ──
  function drawEmptyState(ctx, width, height, message) {
    ctx.fillStyle = getCSSVar('--text-tertiary') || '#8b95a8';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, width / 2, height / 2);
  }

  return {
    drawDonutChart,
    drawLineChart,
    drawBarChart,
  };
})();
