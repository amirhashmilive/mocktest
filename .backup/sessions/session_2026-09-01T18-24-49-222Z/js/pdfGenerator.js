/**
 * MOCKHARD — Official PDF Certificate Generator Engine
 * ====================================================
 * Renders an official examination completion certificate canvas
 * with candidate name, score, accuracy %, level, and official seal.
 */

const PDFCertificate = (() => {
  function generateCertificate(resultData, candidateName) {
    if (!candidateName || !candidateName.trim()) {
      candidateName = 'Aspirant Student';
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background Gradient & Border
    const grad = ctx.createLinearGradient(0, 0, 1200, 850);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#f8fafc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 850);

    // Decorative Outer Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 1160, 810);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, 1136, 786);

    // Corner Ornaments
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(40, 40, 20, 20);
    ctx.fillRect(1140, 40, 20, 20);
    ctx.fillRect(40, 790, 20, 20);
    ctx.fillRect(1140, 790, 20, 20);

    // Header Logo & Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('🎯 MOCKHARD EXAMINATION ENGINE', 600, 110);

    ctx.fillStyle = '#475569';
    ctx.font = '600 18px sans-serif';
    ctx.fillText('OFFICIAL PERFORMANCE & COMPETENCY CERTIFICATE', 600, 145);

    // Divider Line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 175);
    ctx.lineTo(1000, 175);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#64748b';
    ctx.font = '18px sans-serif';
    ctx.fillText('THIS IS PROUDLY PRESENTED TO', 600, 230);

    // Candidate Name
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText(candidateName.trim(), 600, 290);

    // Underline Name
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 310);
    ctx.lineTo(850, 310);
    ctx.stroke();

    // Test Description
    const catName = resultData.categoryName || resultData.category || 'Competitive Exam';
    const levelLabel = (resultData.level || 'C').replace('plus', '+');
    const score = resultData.score || 0;
    const total = resultData.total || 100;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const dateStr = resultData.date ? new Date(resultData.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString();

    ctx.fillStyle = '#475569';
    ctx.font = '20px sans-serif';
    ctx.fillText(`For successfully completing the official assessment in`, 600, 370);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`${catName} — Level ${levelLabel}`, 600, 415);

    // Score & Metric Cards Box
    ctx.fillStyle = '#f1f5f9';
    ctx.roundRect ? ctx.roundRect(250, 460, 700, 140, 12) : ctx.fillRect(250, 460, 700, 140);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Metrics Columns inside Box
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${score} / ${total}`, 380, 520);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 14px sans-serif';
    ctx.fillText('FINAL SCORE', 380, 555);

    ctx.fillStyle = '#16a34a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${pct}%`, 600, 520);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 14px sans-serif';
    ctx.fillText('ACCURACY RATE', 600, 555);

    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`Level ${levelLabel}`, 820, 520);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 14px sans-serif';
    ctx.fillText('DIFFICULTY TIER', 820, 555);

    // Footer Info
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Date Issued: ${dateStr}`, 100, 710);
    ctx.fillText(`Verification ID: MH-${Date.now().toString(36).toUpperCase()}`, 100, 740);

    // Official Seal Badge Right Side
    ctx.beginPath();
    ctx.arc(1020, 700, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('VERIFIED', 1020, 695);
    ctx.fillText('PASS', 1020, 715);

    // Convert Canvas to Image Download & Printable View
    const dataUrl = canvas.toDataURL('image/png');
    const win = window.open('');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Mockhard Certificate — ${candidateName}</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; min-height: 100vh; font-family: system-ui, sans-serif; color: #fff; }
            img { max-width: 95%; max-height: 80vh; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            .btn-bar { margin-top: 20px; display: flex; gap: 12px; }
            .btn { background: #2563eb; color: #fff; border: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; cursor: pointer; text-decoration: none; font-size: 1rem; }
            .btn-print { background: #d97706; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Mockhard Certificate" />
          <div class="btn-bar">
            <a href="${dataUrl}" download="Mockhard_Certificate_${candidateName.replace(/\s+/g, '_')}.png" class="btn">⬇ Download Certificate PNG</a>
            <button onclick="window.print()" class="btn btn-print">🖨️ Print / Save as PDF</button>
          </div>
        </body>
        </html>
      `);
    }
  }

  function promptAndGenerate(resultData) {
    MockApp.showModal({
      title: '🎓 Generate Official Certificate',
      body: `
        <div style="text-align:left;">
          <label style="font-size:0.9rem; font-weight:700; color:var(--text-primary); display:block; margin-bottom:8px;">Enter Candidate Full Name:</label>
          <input type="text" id="candidateNameInput" placeholder="e.g. Amir Hashmi" style="width:100%; padding:12px 14px; border-radius:var(--radius-md); border:1.5px solid var(--border-color); background:var(--surface); color:var(--text-primary); font-size:1rem; font-family:inherit;">
        </div>
      `,
      confirmText: 'Generate & Download Certificate',
      cancelText: 'Cancel',
      confirmClass: 'btn-accent',
      onConfirm: () => {
        const input = document.getElementById('candidateNameInput');
        const name = input ? input.value : 'Aspirant';
        generateCertificate(resultData, name);
      }
    });
  }

  return {
    generateCertificate,
    promptAndGenerate
  };
})();
