const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');
const apiBackupDir = path.join(__dirname, '../app/_api_backup');

// Restaurar carpeta API después del build
if (fs.existsSync(apiBackupDir)) {
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }
  fs.renameSync(apiBackupDir, apiDir);
  console.log('✅ API folder restored');
}
