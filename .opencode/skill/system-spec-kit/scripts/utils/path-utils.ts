// ---------------------------------------------------------------
// MODULE: Path Utils
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. PATH UTILS
// ───────────────────────────────────────────────────────────────
// Secure path sanitization and resolution with traversal protection (CWE-22)

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
// Node stdlib
import fs from 'fs';
import path from 'path';

// Internal modules
import { structuredLog } from './logger';

// ───────────────────────────────────────────────────────────────
// 3. PATH SANITIZATION
// ───────────────────────────────────────────────────────────────
function sanitizePath(inputPath: string, allowedBases: string[] | null = null): string {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Invalid path: path must be a non-empty string');
  }

  const normalized: string = path.normalize(inputPath);

  // CWE-22: Check for null bytes
  if (normalized.includes('\0')) {
    structuredLog('warn', 'Path contains null bytes', { inputPath });
    throw new Error(`Invalid path: contains null bytes: ${inputPath}`);
  }

  const resolved: string = path.resolve(inputPath);
  let canonicalResolved = resolved;
  try {
    canonicalResolved = fs.realpathSync(resolved);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Path may not exist yet. Canonicalize parent when possible.
    }
    try {
      const parentCanonical = fs.realpathSync(path.dirname(resolved));
      canonicalResolved = path.join(parentCanonical, path.basename(resolved));
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Fall back to the unresolved path when the parent cannot be canonicalized.
      }
      canonicalResolved = resolved;
    }
  }

  const bases: string[] = allowedBases || [
    process.cwd(),
    path.join(process.cwd(), 'specs'),
    path.join(process.cwd(), '.opencode')
  ];

  const isAllowed: boolean = bases.some((base: string) => {
    try {
      const resolvedBase = path.resolve(base);
      let canonicalBase = resolvedBase;
      try {
        canonicalBase = fs.realpathSync(resolvedBase);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Fall back to the unresolved base path when realpath fails.
        }
        canonicalBase = resolvedBase;
      }
      const relative = path.relative(canonicalBase, canonicalResolved);
      return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return false;
      }
      return false;
    }
  });

  if (!isAllowed) {
    structuredLog('warn', 'Path outside allowed directories', {
      inputPath,
      resolved: canonicalResolved,
      allowedBases: bases
    });
    throw new Error(`Path outside allowed directories: ${inputPath}`);
  }

  return canonicalResolved;
}

// ───────────────────────────────────────────────────────────────
// 4. UTILITIES
// ───────────────────────────────────────────────────────────────
function getPathBasename(p: string): string {
  if (!p || typeof p !== 'string') return '';
  return p.replace(/\\/g, '/').split('/').pop() || '';
}

// ───────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  sanitizePath,
  getPathBasename,
};
