const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(projectRoot, 'node_modules', '.prisma', 'client');
const targetDir = path.join(projectRoot, 'node_modules', '@prisma', 'client', '.prisma', 'client');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

if (!fs.existsSync(sourceDir)) {
  console.warn('[prisma-sync] Source client not found:', sourceDir);
  process.exit(0);
}

try {
  fs.rmSync(targetDir, { recursive: true, force: true });
  ensureDir(path.dirname(targetDir));
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log('[prisma-sync] Prisma client synced to @prisma/client/.prisma/client');
} catch (error) {
  console.error('[prisma-sync] Failed to sync Prisma client:', error);
  process.exit(1);
}
