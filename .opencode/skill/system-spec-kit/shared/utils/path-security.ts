// ---------------------------------------------------------------
// MODULE: Path Security
// ---------------------------------------------------------------
// Canonical location (moved from mcp_server/lib/utils/path-security.js)

import path from 'path';
import fs from 'fs';

// ---------------------------------------------------------------
// 1. PATH VALIDATION
// ---------------------------------------------------------------

/**
 * Validate file path is within allowed directories (CWE-22: Path Traversal mitigation)
 * Uses path.relative() containment check instead of startsWith() to prevent path confusion attacks.
 */
export function validateFilePath(filePath: string, allowedBasePaths: string[]): string | null {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  if (!Array.isArray(allowedBasePaths) || allowedBasePaths.length === 0) {
    console.warn('[utils] validateFilePath called with empty allowedBasePaths');
    return null;
  }

  try {
    // Security: Reject null bytes BEFORE path.resolve() to prevent path truncation (CWE-78)
    if (filePath.includes('\0')) {
      console.warn(`[utils] Null byte in path blocked: ${filePath}`);
      return null;
    }

    // Security: Reject explicit traversal segments before normalization.
    // Even if resolution lands inside an allowed base, a caller supplying ".."
    // is treated as a traversal attempt and blocked.
    const normalizedInput = filePath.replace(/\\/g, '/');
    if (normalizedInput.split('/').some((segment) => segment === '..')) {
      console.warn(`[utils] Path traversal segment blocked: ${filePath}`);
      return null;
    }

    const resolved = path.resolve(filePath);

    // Compare canonical paths so symlink aliases cannot bypass containment checks.
    let realResolved: string;
    try {
      realResolved = fs.realpathSync(resolved);
    } catch (_error: unknown) {
      if (_error instanceof Error) {
        void _error.message;
      }
      // New files may not exist yet, so we canonicalize the parent and rebuild the target path.
      try {
        const parentReal = fs.realpathSync(path.dirname(resolved));
        realResolved = path.join(parentReal, path.basename(resolved));
      } catch (_error: unknown) {
        if (_error instanceof Error) {
          void _error.message;
        }
        // AI-WHY: When neither the target file nor its parent directory exist on disk
        // (e.g. a new file in a not-yet-created directory), realpathSync cannot
        // canonicalize the path. Falling back to path.resolve() is safe here because
        // the subsequent path.relative() containment check still prevents traversal —
        // resolve() normalises away ".." segments, so a malicious path like
        // "/allowed/../etc/passwd" becomes "/etc/passwd" which will correctly fail
        // the containment test against allowedBasePaths.
        realResolved = resolved;
      }
    }

    // Security: path.relative() containment check (CWE-22)
    const isAllowed = allowedBasePaths.some((basePath) => {
      try {
        const normalizedBase = path.resolve(basePath);
        // Canonicalize base paths too, otherwise realResolved and base could use different aliases.
        let realBase: string;
        try {
          realBase = fs.realpathSync(normalizedBase);
        } catch (_error: unknown) {
          if (_error instanceof Error) {
            void _error.message;
          }
          realBase = normalizedBase;
        }
        const relative = path.relative(realBase, realResolved);
        return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
      } catch (_error: unknown) {
        if (_error instanceof Error) {
          void _error.message;
        }
        return false;
      }
    });

    if (!isAllowed) {
      console.warn(`[utils] Path traversal blocked: ${filePath} -> ${realResolved}`);
      return null;
    }

    return realResolved;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[utils] Path validation error: ${message}`);
    return null;
  }
}

// ---------------------------------------------------------------
// 2. REGEX UTILITIES
// ---------------------------------------------------------------

/** Escape special regex characters in a string */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
