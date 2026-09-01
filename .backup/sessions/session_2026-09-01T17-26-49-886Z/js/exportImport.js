/**
 * MOCKHARD — Progress Export & Import Engine
 * ===========================================
 */

const ExportImport = (() => {
  function exportData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mockhard_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
    }

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];

    const a = document.createElement('a');
    a.href = url;
    a.download = `mockhard-user-data-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importData(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        let count = 0;
        Object.keys(imported).forEach(key => {
          if (key.startsWith('mockhard_')) {
            localStorage.setItem(key, typeof imported[key] === 'string' ? imported[key] : JSON.stringify(imported[key]));
            count++;
          }
        });
        if (callback) callback(true, count);
      } catch (err) {
        console.error('Import failed:', err);
        if (callback) callback(false, 0);
      }
    };
    reader.readAsText(file);
  }

  return {
    exportData,
    importData
  };
})();
