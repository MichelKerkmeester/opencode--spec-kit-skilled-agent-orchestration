// ---------------------------------------------------------------
// MODULE: Workspace Identity
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. WORKSPACE IDENTITY
// ───────────────────────────────────────────────────────────────
// Normalizes backend-native workspace paths to the canonical repo-local
// .opencode anchor so native session capture can match equivalent roots
// across different CLI transcript formats.

import * as fs from 'fs';
import * as path from 'path';

export interface WorkspaceIdentity {
  canonicalOpencodePath: string;
  workspaceRoot: string;
  inputPath: string;
  matchPaths: string[];
}

function normalizeRequestedPath(filePath: string): string {
  return path.resolve(filePath).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
}

function normalizeAbsolutePath(filePath: string): string {
  const resolved = path.resolve(filePath);

  try {
    return fs.realpathSync.native(resolved).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
  } catch {
    const suffix: string[] = [];
    let probe = resolved;

    while (!fs.existsSync(probe)) {
      const parent = path.dirname(probe);
      if (parent === probe) {
        return resolved.replace(/\\/g, '/').replace(/\/+$/, '') || '/';
      }

      suffix.unshift(path.basename(probe));
      probe = parent;
    }

    try {
      const canonicalBase = fs.realpathSync.native(probe);
      return path.join(canonicalBase, ...suffix).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
    } catch {
      return resolved.replace(/\\/g, '/').replace(/\/+$/, '') || '/';
    }
  }
}

function safeStat(filePath: string): fs.Stats | null {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

function findNearestOpencodeDirectoryRaw(candidatePath: string): string | null {
  let current = normalizeRequestedPath(candidatePath);
  const initialStats = safeStat(current);

  if (initialStats?.isFile()) {
    current = normalizeRequestedPath(path.dirname(current));
  }

  while (true) {
    if (path.posix.basename(current) === '.opencode') {
      return current;
    }

    const nestedOpencode = path.join(current, '.opencode');
    const nestedStats = safeStat(nestedOpencode);
    if (nestedStats?.isDirectory()) {
      return normalizeRequestedPath(nestedOpencode);
    }

    const parent = normalizeRequestedPath(path.dirname(current));
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function findNearestOpencodeDirectory(candidatePath: string): string | null {
  let current = normalizeAbsolutePath(candidatePath);
  const initialStats = safeStat(current);

  if (initialStats?.isFile()) {
    current = normalizeAbsolutePath(path.dirname(current));
  }

  while (true) {
    if (path.posix.basename(current) === '.opencode') {
      return current;
    }

    const nestedOpencode = path.join(current, '.opencode');
    const nestedStats = safeStat(nestedOpencode);
    if (nestedStats?.isDirectory()) {
      return normalizeAbsolutePath(nestedOpencode);
    }

    const parent = normalizeAbsolutePath(path.dirname(current));
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function uniquePaths(paths: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const value of paths) {
    if (!value) {
      continue;
    }

    const normalized = normalizeRequestedPath(value);
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    ordered.push(normalized);
  }

  return ordered;
}

export function buildWorkspaceIdentity(workspacePath: string): WorkspaceIdentity {
  const requestedPath = normalizeRequestedPath(workspacePath);
  const inputPath = normalizeAbsolutePath(workspacePath);
  const rawCanonicalOpencodePath = findNearestOpencodeDirectoryRaw(requestedPath) ?? requestedPath;
  const canonicalOpencodePath = findNearestOpencodeDirectory(inputPath) ?? inputPath;
  const rawWorkspaceRoot = path.posix.basename(rawCanonicalOpencodePath) === '.opencode'
    ? normalizeRequestedPath(path.dirname(rawCanonicalOpencodePath))
    : rawCanonicalOpencodePath;
  const workspaceRoot = path.posix.basename(canonicalOpencodePath) === '.opencode'
    ? normalizeAbsolutePath(path.dirname(canonicalOpencodePath))
    : canonicalOpencodePath;

  return {
    canonicalOpencodePath,
    workspaceRoot,
    inputPath,
    matchPaths: uniquePaths([
      canonicalOpencodePath,
      workspaceRoot,
      inputPath,
      rawCanonicalOpencodePath,
      rawWorkspaceRoot,
      requestedPath,
    ]),
  };
}

export function getWorkspacePathVariants(workspacePath: string): string[] {
  return buildWorkspaceIdentity(workspacePath).matchPaths;
}

export function isSameWorkspacePath(workspacePath: string, candidatePath: string | null | undefined): boolean {
  if (typeof candidatePath !== 'string' || candidatePath.trim().length === 0) {
    return false;
  }

  const identity = buildWorkspaceIdentity(workspacePath);
  const requestedCandidate = normalizeRequestedPath(candidatePath);
  const normalizedCandidate = normalizeAbsolutePath(candidatePath);

  if (identity.matchPaths.includes(requestedCandidate) || identity.matchPaths.includes(normalizedCandidate)) {
    return true;
  }

  const candidateIdentity = findNearestOpencodeDirectory(normalizedCandidate) ?? findNearestOpencodeDirectoryRaw(requestedCandidate);
  return candidateIdentity !== null && normalizeAbsolutePath(candidateIdentity) === identity.canonicalOpencodePath;
}

export function toWorkspaceRelativePath(workspacePath: string, maybeFilePath: string): string {
  if (!maybeFilePath) {
    return '';
  }

  const normalizedInput = maybeFilePath.replace(/\\/g, '/');
  if (!path.isAbsolute(maybeFilePath)) {
    if (normalizedInput.startsWith('../')) {
      return '';
    }

    return normalizedInput.replace(/^\.\//, '').replace(/\/+$/, '');
  }

  const identity = buildWorkspaceIdentity(workspacePath);
  const normalizedAbsolute = normalizeAbsolutePath(maybeFilePath);
  const normalizedRoot = identity.workspaceRoot;

  if (normalizedAbsolute !== normalizedRoot && !normalizedAbsolute.startsWith(`${normalizedRoot}/`)) {
    return '';
  }

  return path.relative(normalizedRoot, normalizedAbsolute).replace(/\\/g, '/');
}

export {
  findNearestOpencodeDirectory,
  normalizeAbsolutePath,
};
