/**
 * MOCKHARD — Official Certificate Generator Engine
 * ====================================================
 * Renders official examination practice completion certificates and handles
 * direct PDF downloads, PNG image downloads, and printable views.
 */

const PDFCertificate = (() => {

  /**
   * Returns status badge object based on percentage score range
   */
  function getCertificateStatus(percentage) {
    if (percentage >= 90) {
      return {
        status: 'EXCELLENT',
        badge: '🏆',
        color: '#FFD700',
        textColor: '#000000',
        message: 'Outstanding performance!'
      };
    } else if (percentage >= 70) {
      return {
        status: 'PASSED',
        badge: '✅',
        color: '#2ecc71',
        textColor: '#ffffff',
        message: 'Well done! You passed.'
      };
    } else if (percentage >= 50) {
      return {
        status: 'NEEDS IMPROVEMENT',
        badge: '⚠️',
        color: '#f39c12',
        textColor: '#ffffff',
        message: 'Keep practicing!'
      };
    } else {
      return {
        status: 'RE-TEST RECOMMENDED',
        badge: '🔁',
        color: '#e74c3c',
        textColor: '#ffffff',
        message: 'Review and try again.'
      };
    }
  }

  /**
   * Creates certificate HTML Canvas element
   */
  function renderCertificateCanvas(resultData, candidateName) {
    if (!candidateName || !candidateName.trim()) {
      candidateName = 'Aspirant Student';
    }

    const score = resultData.score || 0;
    const total = resultData.total || 100;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const statusInfo = getCertificateStatus(pct);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background Gradient & Outer Frame
    const grad = ctx.createLinearGradient(0, 0, 1200, 850);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#f8fafc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 850);

    // Decorative Outer Borders
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 1160, 810);

    ctx.strokeStyle = statusInfo.color;
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, 1136, 786);

    // Corner Ornaments
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(40, 40, 20, 20);
    ctx.fillRect(1140, 40, 20, 20);
    ctx.fillRect(40, 790, 20, 20);
    ctx.fillRect(1140, 790, 20, 20);

    // Header Logo & Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('🎯 MOCKHARD EXAMINATION ENGINE', 600, 95);

    ctx.fillStyle = '#475569';
    ctx.font = '600 16px sans-serif';
    ctx.fillText('CERTIFICATE OF PRACTICE ASSESSMENT', 600, 125);

    // Score Status Pill Badge (Top Center)
    ctx.fillStyle = statusInfo.color;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(420, 145, 360, 42, 21);
      ctx.fill();
    } else {
      ctx.fillRect(420, 145, 360, 42);
    }

    ctx.fillStyle = statusInfo.textColor;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`${statusInfo.badge} ${statusInfo.status} — ${statusInfo.message}`, 600, 172);

    // Divider Line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(200, 205);
    ctx.lineTo(1000, 205);
    ctx.stroke();

    // Body Presentation Text
    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    ctx.fillText('THIS IS PROUDLY PRESENTED TO', 600, 245);

    // Candidate Name
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 42px Georgia, serif';
    ctx.fillText(candidateName.trim(), 600, 300);

    // Underline Name
    ctx.strokeStyle = statusInfo.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 320);
    ctx.lineTo(850, 320);
    ctx.stroke();

    // Test Description
    const catName = resultData.categoryName || resultData.category || 'Competitive Examination';
    const levelLabel = (resultData.level || 'C').toString().replace('plusplus', '++').replace('plus', '+');
    const dateStr = resultData.date ? new Date(resultData.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-IN');

    ctx.fillStyle = '#475569';
    ctx.font = '18px sans-serif';
    ctx.fillText(`For completing the official mock test assessment in`, 600, 370);

    ctx.fillStyle = '#0f3460';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`${catName} — Level ${levelLabel}`, 600, 410);

    // Score & Metric Cards Box
    ctx.fillStyle = '#ffffff';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(220, 450, 760, 130, 12);
      ctx.fill();
    } else {
      ctx.fillRect(220, 450, 760, 130);
    }
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Metrics Columns inside Box
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`${score} / ${total}`, 350, 510);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('FINAL SCORE', 350, 545);

    ctx.fillStyle = statusInfo.color;
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`${pct}%`, 600, 510);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('ACCURACY RATE', 600, 545);

    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`Level ${levelLabel}`, 850, 510);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('DIFFICULTY TIER', 850, 555);

    // Mandatory Practice Disclaimer Box
    ctx.fillStyle = '#fffbeb';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(120, 605, 960, 55, 8);
      ctx.fill();
    } else {
      ctx.fillRect(120, 605, 960, 55);
    }
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('⚠️ DISCLAIMER: THIS IS A PRACTICE CERTIFICATE BASED ON PERFORMANCE IN A MOCKHARD MOCK TEST.', 600, 627);
    ctx.font = '11px sans-serif';
    ctx.fillText('It does not constitute official government certification or guarantee of selection in the actual examination.', 600, 647);

    // Footer Verification Details
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    const paperIdStr = resultData.paperId || resultData.id || Date.now().toString(36).toUpperCase();
    ctx.fillText(`Date Issued: ${dateStr}`, 100, 715);
    ctx.fillText(`Verification ID: MH-${paperIdStr}`, 100, 740);

    // Official Verification Seal Badge (Right Side)
    ctx.beginPath();
    ctx.arc(1020, 725, 48, 0, Math.PI * 2);
    ctx.fillStyle = statusInfo.color;
    ctx.fill();
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = statusInfo.textColor;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(statusInfo.status.split(' ')[0], 1020, 720);
    ctx.fillText('VERIFIED', 1020, 738);

    return canvas;
  }

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
   * Direct PDF File Download
   */
  function downloadCertificatePDF(resultData, candidateName) {
    console.log('📜 downloadCertificatePDF initiated', { resultData, candidateName });
    if (!resultData || typeof resultData !== 'object' || !('score' in resultData)) {
      resultData = getActiveResultData();
    }
    if (!resultData) {
      alert('No active test result found to generate certificate PDF.');
      return;
    }

    const name = (typeof candidateName === 'string' && candidateName.trim()) ? candidateName.trim() : 'Aspirant Student';
    const score = resultData.score || 0;
    const total = resultData.total || 100;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const statusInfo = getCertificateStatus(pct);
    const catName = resultData.categoryName || resultData.category || 'Competitive Examination';
    const levelLabel = (resultData.level || 'C').toString().replace('plusplus', '++').replace('plus', '+');
    const dateStr = resultData.date ? new Date(resultData.date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    const verificationId = `MH-${resultData.paperId || resultData.id || Date.now().toString(36).toUpperCase()}`;

    // Direct jsPDF generation if library is loaded
    if (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Render high-res Canvas image into PDF page
      const canvas = renderCertificateCanvas(resultData, name);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 0, 0, 297, 210);

      const cleanFileName = `Mockhard_Certificate_${name.replace(/\s+/g, '_')}_${pct}pct.pdf`;
      console.log('📄 Saving Certificate PDF via jsPDF:', cleanFileName);
      doc.save(cleanFileName);
      return;
    }

    console.warn('⚠️ jsPDF not loaded, falling back to canvas image download');
    // Fallback using Canvas Image Download
    const canvas = renderCertificateCanvas(resultData, name);
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Mockhard_Certificate_${name.replace(/\s+/g, '_')}_${pct}pct.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Direct PNG Image File Download
   */
  function downloadCertificatePNG(resultData, candidateName = 'Aspirant Student') {
    if (!resultData || typeof resultData !== 'object' || !('score' in resultData)) {
      resultData = getActiveResultData();
    }
    const canvas = renderCertificateCanvas(resultData, candidateName);
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Mockhard_Certificate_${candidateName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Opens Certificate Preview Modal with direct PDF, PNG, and Print actions
   */
  function generateCertificate(resultData, candidateName) {
    if (!resultData || typeof resultData !== 'object' || !('score' in resultData)) {
      resultData = getActiveResultData();
    }
    const canvas = renderCertificateCanvas(resultData, candidateName);
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
            img { max-width: 95%; max-height: 75vh; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            .btn-bar { margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap; }
            .btn { background: #2563eb; color: #fff; border: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; cursor: pointer; text-decoration: none; font-size: 1rem; }
            .btn-pdf { background: #16a34a; }
            .btn-print { background: #d97706; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Mockhard Certificate" />
          <div class="btn-bar">
            <a href="${dataUrl}" download="Mockhard_Certificate_${candidateName.replace(/\s+/g, '_')}.png" class="btn">⬇️ Download Certificate PNG</a>
            <button onclick="window.print()" class="btn btn-print">🖨️ Print Certificate</button>
          </div>
        </body>
        </html>
      `);
    }
  }

  function promptAndDownloadPDF(resultData, candidateName) {
    if (candidateName) {
      downloadCertificatePDF(resultData, candidateName);
    } else {
      promptCandidateName(resultData, (name) => {
        downloadCertificatePDF(resultData, name);
      });
    }
  }

  function promptAndDownloadPNG(resultData) {
    promptCandidateName(resultData, (name) => {
      downloadCertificatePNG(resultData, name);
    });
  }

  function promptAndGenerate(resultData) {
    promptCandidateName(resultData, (name) => {
      generateCertificate(resultData, name);
    });
  }

  function promptCandidateName(resultData, callback) {
    if (typeof MockApp !== 'undefined' && MockApp.showModal) {
      MockApp.showModal({
        title: '📜 Candidate Certificate Details',
        body: `
          <div style="text-align:left;">
            <label style="font-size:0.9rem; font-weight:700; color:var(--text-primary); display:block; margin-bottom:8px;">Enter Candidate Full Name:</label>
            <input type="text" id="candidateNameInput" placeholder="e.g. Amir Hashmi" style="width:100%; padding:12px 14px; border-radius:var(--radius-md); border:1.5px solid var(--border-color); background:var(--surface); color:var(--text-primary); font-size:1rem; font-family:inherit;">
          </div>
        `,
        confirmText: 'Continue Download',
        cancelText: 'Cancel',
        confirmClass: 'btn-accent',
        onConfirm: () => {
          const input = document.getElementById('candidateNameInput');
          const name = input ? input.value : 'Aspirant Student';
          callback(name);
        }
      });
    } else {
      const name = prompt('Enter candidate full name:', 'Aspirant Student');
      if (name) callback(name);
    }
  }

  return {
    getCertificateStatus,
    renderCertificateCanvas,
    downloadCertificatePDF,
    downloadCertificatePNG,
    generateCertificate,
    promptAndDownloadPDF,
    promptAndDownloadPNG,
    promptAndGenerate
  };
})();

// Top-level global function on window for direct HTML inline calls or event listeners
if (typeof window !== 'undefined') {
  window.downloadCertificatePDF = function(resultData, candidateName) {
    console.log('📜 window.downloadCertificatePDF called');
    if (typeof PDFCertificate !== 'undefined' && PDFCertificate.promptAndDownloadPDF) {
      PDFCertificate.promptAndDownloadPDF(resultData, candidateName);
    }
  };
}

if (typeof module !== 'undefined') module.exports = PDFCertificate;
