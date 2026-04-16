// ---------------------------------------------------------------
// MODULE: Save Context Path
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SAVE CONTEXT PATH HELPERS
// ───────────────────────────────────────────────────────────────
// Shared helpers for session-scoped generate-context file examples and
// legacy shared-path detection.

import os from 'node:os';
import path from 'node:path';

const SAVE_CONTEXT_FILE_STEM = 'save-context-data';
const SAVE_CONTEXT_FILE_SUFFIX = '.json';
const LEGACY_SHARED_SAVE_CONTEXT_BASENAME = `${SAVE_CONTEXT_FILE_STEM}${SAVE_CONTEXT_FILE_SUFFIX}`;

function normalizeFilesystemPath(filePath: string): string {
  return path.resolve(filePath).replace(/\\/g, '/').replace(/\/+$/, '');
}

function sanitizeSessionId(sessionId: string): string {
  return sessionId
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildSessionScopedSaveContextPath(sessionId: string): string {
  const sanitizedSessionId = sanitizeSessionId(sessionId);
  if (!sanitizedSessionId) {
    throw new Error('Session ID must contain at least one valid path character');
  }

  return path.join(os.tmpdir(), `${SAVE_CONTEXT_FILE_STEM}-${sanitizedSessionId}${SAVE_CONTEXT_FILE_SUFFIX}`);
}

export function getSessionScopedSaveContextExample(): string {
  return path.join(os.tmpdir(), `${SAVE_CONTEXT_FILE_STEM}-<session-id>${SAVE_CONTEXT_FILE_SUFFIX}`);
}

export function isLegacySharedSaveContextPath(filePath: string): boolean {
  const normalizedPath = normalizeFilesystemPath(filePath);
  const basename = path.posix.basename(normalizedPath);
  if (basename !== LEGACY_SHARED_SAVE_CONTEXT_BASENAME) {
    return false;
  }

  const dirname = path.posix.dirname(normalizedPath);
  const tempRoots = new Set<string>([
    normalizeFilesystemPath(os.tmpdir()),
    '/tmp',
    '/private/tmp',
  ]);

  return tempRoots.has(dirname);
}

