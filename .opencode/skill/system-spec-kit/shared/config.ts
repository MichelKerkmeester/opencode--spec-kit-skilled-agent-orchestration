// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

/** Get db dir. */
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
  const fromPackageJson = findUp('package.json', import.meta.dirname);
  if (fromPackageJson && fs.existsSync(path.join(fromPackageJson, 'mcp_server', 'database'))) {
    return fromPackageJson;
  }
  return fromPackageJson || path.resolve(import.meta.dirname, '..');
}

const PACKAGE_ROOT = resolvePackageRoot();
const DEFAULT_DB_DIR = path.join(PACKAGE_ROOT, 'mcp_server', 'database');

/** Defines database updated file. */
export const DB_UPDATED_FILE: string = (() => {
  const configuredDir = getDbDir();
  if (configuredDir) {
    const resolvedDir = path.isAbsolute(configuredDir)
      ? configuredDir
      : path.resolve(PACKAGE_ROOT, configuredDir);
    return path.join(resolvedDir, '.db-updated');
  }
  return path.join(DEFAULT_DB_DIR, '.db-updated');
})();
