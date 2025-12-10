// this utility ensures that the log directory exists; if not, it creates it

import fs from 'fs';

export function ensureLogDir(logDir) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}