import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function ensureAbsoluteTempEnv(): void {
  const currentTmp = os.tmpdir();
  const absoluteTmp = path.isAbsolute(currentTmp) ? currentTmp : path.resolve(currentTmp);

  fs.mkdirSync(absoluteTmp, { recursive: true });

  for (const key of ['TMPDIR', 'TMP', 'TEMP'] as const) {
    const currentValue = process.env[key];
    if (!currentValue || !path.isAbsolute(currentValue)) {
      process.env[key] = absoluteTmp;
    }
  }
}

ensureAbsoluteTempEnv();
