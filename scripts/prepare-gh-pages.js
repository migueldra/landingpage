const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');
const apiBackupDir = path.join(__dirname, '../app/_api_backup');

// Mover carpeta API fuera del alcance de Next.js para GitHub Pages
if (fs.existsSync(apiDir) && process.env.GITHUB_PAGES === 'true') {
  if (fs.existsSync(apiBackupDir)) {
    fs.rmSync(apiBackupDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, apiBackupDir);
  console.log('✅ API folder moved for GitHub Pages build');
}
