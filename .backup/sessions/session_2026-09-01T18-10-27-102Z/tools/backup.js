/**
 * MOCKHARD — Automated Backup Engine
 * ===================================
 * Creates timestamped daily and session backups of critical codebase files,
 * records commit metadata, and enforces retention policies (max 10 daily / 10 session).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, '.backup-config.json');

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (e) {
      console.warn('⚠️ Could not parse .backup-config.json, using defaults.');
    }
  }
  return {
    dailyBackups: 10,
    sessionBackups: 10,
    backupPaths: ['index.html', 'categories.html', 'test.html', 'results.html', 'random.html', 'dashboard.html', 'js/', 'css/', 'data/', 'tools/', '.agent/'],
    excludePaths: ['node_modules/', '.git/', '.backup/']
  };
}

function getCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: ROOT_DIR }).toString().trim();
  } catch (e) {
    return 'unknown';
  }
}

function copyRecursiveSync(src, dest, excludes) {
  if (!fs.existsSync(src)) return 0;
  
  const relSrc = path.relative(ROOT_DIR, src).replace(/\\/g, '/');
  if (excludes.some(ex => relSrc.startsWith(ex) || (relSrc + '/').startsWith(ex))) {
    return 0;
  }

  let count = 0;
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const children = fs.readdirSync(src);
    children.forEach(child => {
      count += copyRecursiveSync(path.join(src, child), path.join(dest, child), excludes);
    });
  } else {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    count = 1;
  }

  return count;
}

function cleanupOldBackups(backupDir, maxLimit) {
  if (!fs.existsSync(backupDir)) return;

  const entries = fs.readdirSync(backupDir)
    .map(name => {
      const full = path.join(backupDir, name);
      return { name, full, stat: fs.statSync(full) };
    })
    .filter(item => item.stat.isDirectory())
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs); // newest first

  if (entries.length > maxLimit) {
    const toRemove = entries.slice(maxLimit);
    toRemove.forEach(item => {
      fs.rmSync(item.full, { recursive: true, force: true });
      console.log(`🧹 Cleaned up old backup: ${item.name}`);
    });
  }
}

function runBackup() {
  const config = loadConfig();
  const args = process.argv.slice(2);
  
  let type = 'session';
  let description = 'Automated backup';

  args.forEach(arg => {
    if (arg.startsWith('--type=')) {
      type = arg.replace('--type=', '').toLowerCase();
    } else if (arg.startsWith('--description=')) {
      description = arg.replace('--description=', '');
    }
  });

  const now = new Date();
  const timestampStr = now.toISOString().replace(/[:.]/g, '-');
  const dateFolderStr = now.toISOString().split('T')[0];

  const subFolder = type === 'daily' ? 'daily' : 'sessions';
  const backupFolderId = type === 'daily' 
    ? `daily_${dateFolderStr}_${timestampStr.split('T')[1].substring(0, 5)}`
    : `session_${timestampStr}`;

  const targetBackupDir = path.join(ROOT_DIR, '.backup', subFolder, backupFolderId);
  fs.mkdirSync(targetBackupDir, { recursive: true });

  let totalFilesCopied = 0;

  config.backupPaths.forEach(relPath => {
    const srcPath = path.join(ROOT_DIR, relPath);
    const destPath = path.join(targetBackupDir, relPath);
    totalFilesCopied += copyRecursiveSync(srcPath, destPath, config.excludePaths || []);
  });

  const commitHash = getCommitHash();
  const metadata = {
    backupId: backupFolderId,
    timestamp: now.toISOString(),
    commitHash: commitHash,
    filesCount: totalFilesCopied,
    type: type,
    description: description
  };

  fs.writeFileSync(path.join(targetBackupDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');
  fs.writeFileSync(path.join(targetBackupDir, 'commit-hash.txt'), commitHash, 'utf-8');

  console.log(`✅ Backup complete: [${backupFolderId}] — ${totalFilesCopied} files copied (${type} backup).`);

  // Enforce retention policies
  const maxLimit = type === 'daily' ? (config.dailyBackups || 10) : (config.sessionBackups || 10);
  cleanupOldBackups(path.join(ROOT_DIR, '.backup', subFolder), maxLimit);
}

runBackup();
