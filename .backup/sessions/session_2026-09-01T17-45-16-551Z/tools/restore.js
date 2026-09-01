/**
 * MOCKHARD — Automated Backup Restore Engine
 * ==========================================
 * Lists and restores codebase states from timestamped daily and session backups.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const BACKUP_DIR = path.join(ROOT_DIR, '.backup');

function getAllBackups() {
  const backups = [];
  ['daily', 'sessions'].forEach(subFolder => {
    const dirPath = path.join(BACKUP_DIR, subFolder);
    if (fs.existsSync(dirPath)) {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const metaPath = path.join(fullPath, 'metadata.json');
        if (fs.statSync(fullPath).isDirectory()) {
          let meta = { backupId: item, timestamp: 'unknown', type: subFolder, description: 'No metadata' };
          if (fs.existsSync(metaPath)) {
            try {
              meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            } catch (e) {}
          }
          backups.push({ ...meta, path: fullPath });
        }
      });
    }
  });

  return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function restoreFromPath(srcDir) {
  console.log(`📦 Restoring codebase from: ${srcDir}...`);

  const excludeNames = ['metadata.json', 'commit-hash.txt'];

  function copySync(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(child => {
        copySync(path.join(src, child), path.join(dest, child));
      });
    } else {
      if (!excludeNames.includes(path.basename(src))) {
        const parentDir = path.dirname(dest);
        if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
        fs.copyFileSync(src, dest);
      }
    }
  }

  const items = fs.readdirSync(srcDir);
  items.forEach(item => {
    if (!excludeNames.includes(item)) {
      copySync(path.join(srcDir, item), path.join(ROOT_DIR, item));
    }
  });

  console.log(`🎉 Restore completed successfully!`);
}

function runRestore() {
  const args = process.argv.slice(2);
  const backups = getAllBackups();

  if (args.includes('--list')) {
    console.log('\n📋 AVAILABLE BACKUPS:');
    console.log('=' .repeat(70));
    if (backups.length === 0) {
      console.log('No backups found.');
      return;
    }
    backups.forEach(b => {
      console.log(`- ID: ${b.backupId}`);
      console.log(`  Type: ${b.type} | Date: ${b.timestamp} | Commit: ${b.commitHash || 'N/A'}`);
      console.log(`  Description: ${b.description}`);
      console.log('-'.repeat(70));
    });
    return;
  }

  let targetBackup = null;

  if (args.includes('--latest')) {
    targetBackup = backups[0];
  } else {
    args.forEach(arg => {
      if (arg.startsWith('--backup=')) {
        const id = arg.replace('--backup=', '');
        targetBackup = backups.find(b => b.backupId === id);
      }
    });
  }

  if (!targetBackup) {
    console.log('⚠️ No backup specified or backup not found.');
    console.log('Usage: node tools/restore.js --list');
    console.log('       node tools/restore.js --latest');
    console.log('       node tools/restore.js --backup=[backupId]');
    return;
  }

  restoreFromPath(targetBackup.path);
}

runRestore();
