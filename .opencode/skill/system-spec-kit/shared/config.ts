// ---------------------------------------------------------------
// MODULE: Shared Config
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

export function getDbDir(): string | undefined {
  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
}

function resolvePackageRoot(): string {
  const candidates = [
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '../..'),
    process.cwd(),
    path.resolve(process.cwd(), '..'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'mcp_server', 'database'))) {
      return candidate;
    }
  }

  return candidates[0];
}

const PACKAGE_ROOT = resolvePackageRoot();
const DEFAULT_DB_DIR = path.join(PACKAGE_ROOT, 'mcp_server', 'database');

export const DB_UPDATED_FILE: string = (() => {
  const configuredDir = getDbDir();
  if (configuredDir) {
    return path.resolve(process.cwd(), configuredDir, '.db-updated');
  }
  return path.join(DEFAULT_DB_DIR, '.db-updated');
})();
