// ---------------------------------------------------------------
// MODULE: Paths
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

import { getDbDir } from './config';

function findUp(startDir: string, predicate: (dir: string) => boolean): string | undefined {
  let dir = startDir;
  while (true) {
    if (predicate(dir)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

function hasPackageJson(dir: string): boolean {
  return fs.existsSync(path.join(dir, 'package.json'));
}

function hasWorkspaceDirectories(dir: string): boolean {
  return (
    fs.existsSync(path.join(dir, 'mcp_server')) &&
    fs.existsSync(path.join(dir, 'shared'))
  );
}

export function resolvePackageRoot(): string {
  const fromWorkspaceDirs = findUp(__dirname, hasWorkspaceDirectories);
  if (fromWorkspaceDirs) {
    return fromWorkspaceDirs;
  }

  const fromWorkspaceDirsCwd = findUp(process.cwd(), hasWorkspaceDirectories);
  if (fromWorkspaceDirsCwd) {
    return fromWorkspaceDirsCwd;
  }

  const fromPackageJson = findUp(__dirname, hasPackageJson);
  if (fromPackageJson) {
    return fromPackageJson;
  }

  const fromCwd = findUp(process.cwd(), hasPackageJson);
  return fromCwd || path.resolve(__dirname, '..');
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
