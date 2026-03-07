// ---------------------------------------------------------------
// MODULE: Shared Config
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

export function getDbDir(): string | undefined {
  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
}

function findUp(filename: string, startDir: string): string | undefined {
  let dir = startDir;
  while (true) {
    if (fs.existsSync(path.join(dir, filename))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

function resolvePackageRoot(): string {
  const fromPackageJson = findUp('package.json', __dirname);
  if (fromPackageJson && fs.existsSync(path.join(fromPackageJson, 'mcp_server', 'database'))) {
    return fromPackageJson;
  }

  const fromCwd = findUp('package.json', process.cwd());
  if (fromCwd && fs.existsSync(path.join(fromCwd, 'mcp_server', 'database'))) {
    return fromCwd;
  }

  return fromPackageJson || path.resolve(__dirname, '..');
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
