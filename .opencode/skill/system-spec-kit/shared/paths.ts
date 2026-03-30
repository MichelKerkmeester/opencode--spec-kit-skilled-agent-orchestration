// ---------------------------------------------------------------
// MODULE: Paths
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

import { getDbDir } from './config.js';

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

function findNearestSpecKitWorkspaceRoot(startDir: string): string | undefined {
  // Walk up to find the workspace root (package.json with "workspaces" field),
  // NOT individual @spec-kit/* packages. This ensures path validation uses the
  // monorepo root as the boundary, not a child package like shared/.
  return findUp(startDir, (dir) => {
    const packageJsonPath = path.join(dir, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return false;
    try {
      const parsed = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as { workspaces?: unknown };
      return Array.isArray(parsed.workspaces);
    } catch { return false; }
  });
}

function isWithinDirectoryTree(candidatePath: string, rootPath: string): boolean {
  const relativePath = path.relative(rootPath, candidatePath);
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function resolveImportMetaRelativePackageRoot(): string {
  return path.resolve(import.meta.dirname, '..');
}

function fallbackResolvedPath(label: 'package root' | 'database dir'): string {
  return label === 'package root'
    ? resolveImportMetaRelativePackageRoot()
    : path.join(resolveImportMetaRelativePackageRoot(), 'mcp_server', 'database');
}

function validateResolvedPath(label: 'package root' | 'database dir', resolvedPath: string): string {
  const workspaceRoot = findNearestSpecKitWorkspaceRoot(import.meta.dirname);
  if (!workspaceRoot || isWithinDirectoryTree(resolvedPath, workspaceRoot)) {
    return resolvedPath;
  }

  console.warn(`[shared/paths] ${label} resolved outside @spec-kit workspace root (${workspaceRoot}); falling back to import.meta.dirname-relative resolution`);
  return fallbackResolvedPath(label);
}

export function resolvePackageRoot(): string {
  const fromWorkspaceDirs = findUp(import.meta.dirname, hasWorkspaceDirectories);
  if (fromWorkspaceDirs) {
    return validateResolvedPath('package root', fromWorkspaceDirs);
  }

  const fromWorkspaceDirsCwd = findUp(process.cwd(), hasWorkspaceDirectories);
  if (fromWorkspaceDirsCwd) {
    return validateResolvedPath('package root', fromWorkspaceDirsCwd);
  }

  const fromPackageJson = findUp(import.meta.dirname, hasPackageJson);
  if (fromPackageJson) {
    return validateResolvedPath('package root', fromPackageJson);
  }

  const fromCwd = findUp(process.cwd(), hasPackageJson);
  return validateResolvedPath('package root', fromCwd || resolveImportMetaRelativePackageRoot());
}

export function resolveDatabaseDir(): string {
  const configuredDir = getDbDir();
  if (configuredDir) {
    return validateResolvedPath('database dir', path.resolve(process.cwd(), configuredDir));
  }
  return validateResolvedPath('database dir', path.join(resolvePackageRoot(), 'mcp_server', 'database'));
}

const DEFAULT_DB_PATH = path.join(resolveDatabaseDir(), 'context-index.sqlite');

/** Defines database path. */
export const DB_PATH: string = (() => {
  const configuredPath = process.env.MEMORY_DB_PATH?.trim();
  if (configuredPath) {
    const resolvedPath = path.resolve(process.cwd(), configuredPath);
    const validatedDir = validateResolvedPath('database dir', path.dirname(resolvedPath));
    return path.join(validatedDir, path.basename(resolvedPath));
  }

  return DEFAULT_DB_PATH;
})();
