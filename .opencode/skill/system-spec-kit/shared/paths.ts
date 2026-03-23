// ---------------------------------------------------------------
// MODULE: Paths
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

import { getDbDir } from './config';

function findUp(filename: string, startDir: string): string | undefined {
  let dir = startDir;
  while (true) {
    if (fs.existsSync(path.join(dir, filename))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

export function resolvePackageRoot(): string {
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

export function resolveDatabaseDir(): string {
  const configuredDir = getDbDir();
  if (configuredDir) {
    return path.resolve(process.cwd(), configuredDir);
  }
  return path.join(resolvePackageRoot(), 'mcp_server', 'database');
}

const DEFAULT_DB_PATH = path.join(resolveDatabaseDir(), 'context-index.sqlite');

/** Defines database path. */
export const DB_PATH: string = (() => {
  const configuredPath = process.env.MEMORY_DB_PATH?.trim();
  if (configuredPath) {
    return path.resolve(process.cwd(), configuredPath);
  }

  return DEFAULT_DB_PATH;
})();
