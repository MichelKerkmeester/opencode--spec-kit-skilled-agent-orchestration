// ───────────────────────────────────────────────────────────────
// MODULE: Workflow Path Utils
// ───────────────────────────────────────────────────────────────
// File path normalization and spec folder file listing utilities.
// Named workflow-path-utils to avoid conflicts with any existing path-utils.
// Extracted from workflow.ts to reduce module size.

import * as path from 'node:path';
import * as fsSync from 'node:fs';
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import type { FileChange } from '../types/session-types';

// ───────────────────────────────────────────────────────────────
// 1. FUNCTIONS
// ───────────────────────────────────────────────────────────────

export function normalizeFilePath(rawPath: string): string {
  return rawPath
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
}

export function getParentDirectory(filePath: string): string {
  const normalized = normalizeFilePath(filePath);
  const idx = normalized.lastIndexOf('/');
  return idx >= 0 ? normalized.slice(0, idx) : '';
}

export function isWithinDirectory(parentDir: string, candidatePath: string): boolean {
  return validateFilePath(candidatePath, [parentDir]) !== null;
}

export function resolveTreeThinningContent(file: FileChange, specFolderPath: string): string {
  const rawPath = typeof file.FILE_PATH === 'string' ? file.FILE_PATH.trim() : '';
  if (rawPath.length === 0) {
    return file.DESCRIPTION || '';
  }

  const candidatePath = path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(specFolderPath, rawPath);

  if (!isWithinDirectory(path.resolve(specFolderPath), path.resolve(candidatePath))) {
    return file.DESCRIPTION || '';
  }

  try {
    const stat = fsSync.statSync(candidatePath);
    if (!stat.isFile()) {
      return file.DESCRIPTION || '';
    }

    return fsSync.readFileSync(candidatePath, 'utf8').slice(0, 500) || file.DESCRIPTION || '';
  } catch (_error: unknown) {
    return file.DESCRIPTION || '';
  }
}

export function listSpecFolderKeyFiles(specFolderPath: string): Array<{ FILE_PATH: string }> {
  const collected: string[] = [];
  // Rec 4: Exclude iteration directories that inflate key_files without adding retrieval value
  const ignoredDirs = new Set(['memory', 'scratch', '.git', 'node_modules', 'iterations']);

  const visit = (currentDir: string, relativeDir: string): void => {
    const entries = fsSync.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        continue;
      }
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) {
          continue;
        }

        visit(path.join(currentDir, entry.name), path.join(relativeDir, entry.name));
        continue;
      }

      if (!entry.isFile() || !/\.(?:md|json)$/i.test(entry.name)) {
        continue;
      }

      collected.push(normalizeFilePath(path.join(relativeDir, entry.name)));
    }
  };

  try {
    visit(specFolderPath, '');
  } catch (_error: unknown) {
    return [];
  }

  // Rec 4: Cap filesystem enumeration at 20 files sorted by name
  return collected
    .filter((f) => !f.includes('research/iterations/') && !f.includes('review/iterations/'))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 20)
    .map((filePath) => ({ FILE_PATH: filePath }));
}

export function buildKeyFiles(effectiveFiles: FileChange[], specFolderPath: string): Array<{ FILE_PATH: string }> {
  const explicitKeyFiles = effectiveFiles
    .filter((file) => !file.FILE_PATH.includes('(merged-small-files)'))
    .map((file) => ({ FILE_PATH: file.FILE_PATH }));

  if (explicitKeyFiles.length > 0) {
    return explicitKeyFiles;
  }

  return listSpecFolderKeyFiles(specFolderPath);
}

export function buildAlignmentKeywords(specFolderPath: string): string[] {
  const ALIGNMENT_STOPWORDS = new Set(['ops', 'app', 'api', 'cli', 'lib', 'src', 'dev', 'hub', 'log', 'run']);
  const keywords = new Set<string>();
  const normalizedSpecPath = specFolderPath
    .replace(/\\/g, '/')
    .trim();
  const rawSegments = normalizedSpecPath.split('/').filter(Boolean);
  const specLikeSegments = rawSegments.filter((segment) => /^\d{3}-/.test(segment));
  // Only use the spec folder lineage (parent/child) for alignment keywords.
  // Including arbitrary absolute path segments (e.g. temp dirs) creates false positives.
  const relevantSegments = specLikeSegments.length > 0
    ? specLikeSegments.slice(-2)
    : [path.posix.basename(normalizedSpecPath)];
  const segments = relevantSegments
    .map((segment) => segment.replace(/^\d+--?/, '').trim().toLowerCase())
    .filter(Boolean);

  for (const segment of segments) {
    if (segment.length >= 2) {
      keywords.add(segment);
    }

    for (const token of segment.split(/[-_]/)) {
      if (token.length >= 3 && !ALIGNMENT_STOPWORDS.has(token)) {
        keywords.add(token);
      }
    }
  }

  return Array.from(keywords);
}
