// ---------------------------------------------------------------
// MODULE: Canonical Path
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

function normalizePathKey(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}

/**
 * Canonical identity for path deduplication.
 *
 * - Uses realpath when possible so symlink aliases collapse to one key.
 * - Falls back to resolved absolute path when file does not exist.
 */
export function getCanonicalPathKey(filePath: string): string {
  try {
    return normalizePathKey(fs.realpathSync(filePath));
  } catch {
    return normalizePathKey(path.resolve(filePath));
  }
}
