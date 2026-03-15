// ───────────────────────────────────────────────────────────────
// MODULE: Canonical Path
// ───────────────────────────────────────────────────────────────
import fs from 'fs';
import path from 'path';

/** Returns true for errors indicating a missing path segment (ENOENT/ENOTDIR). */
function isMissingPathError(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException | undefined)?.code;
  return code === 'ENOENT' || code === 'ENOTDIR';
}

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

/**
 * Resolve symlinks before spec-folder extraction so that paths through
 * symlinked directories (e.g. `.claude/specs → ../.opencode/specs`)
 * produce the same spec_folder string as the real path.
 *
 * Handles the atomic-save case where the file doesn't exist yet by
 * walking up to the nearest existing ancestor and resolving from there.
 */
export function canonicalizeForSpecFolderExtraction(filePath: string): string {
  try {
    return fs.realpathSync(filePath).replace(/\\/g, '/');
  } catch (err: unknown) {
    if (!isMissingPathError(err)) {
      // EACCES, ELOOP, EPERM — do not parent-walk, return resolved path
      return path.resolve(filePath).replace(/\\/g, '/');
    }
    // ENOENT/ENOTDIR — file doesn't exist yet (atomic save flow)
    const segments: string[] = [];
    let probe = path.resolve(filePath);
    while (!fs.existsSync(probe)) {
      const parent = path.dirname(probe);
      if (parent === probe) return path.resolve(filePath).replace(/\\/g, '/');
      segments.unshift(path.basename(probe));
      probe = parent;
    }
    try {
      const canonicalBase = fs.realpathSync(probe);
      return path.join(canonicalBase, ...segments).replace(/\\/g, '/');
    } catch {
      return path.resolve(filePath).replace(/\\/g, '/');
    }
  }
}
