// --- 1. HANDLER UTILS ---
// Shared utilities extracted from handler modules to break dependency cycles.
//
// GROWTH POLICY (T033):
// - ONLY add functions extracted from handler modules to break circular deps
// - Each function MUST document its origin handler in a JSDoc comment
// - Max 5 functions — if exceeded, split into domain-specific modules
//   (e.g., handler-sql-utils.ts, handler-spec-utils.ts)
// - Do NOT add general-purpose utilities here — use shared/ instead
//
// Current contents:
// - escapeLikePattern: extracted from memory-save.ts
// - detectSpecLevelFromParsed: extracted from causal-links-processor.ts
import fs from 'fs';
import path from 'path';

/** Escape special SQL LIKE pattern characters (% and _) for safe queries */
export function escapeLikePattern(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError(`escapeLikePattern expects string, got ${typeof str}`);
  }
  return str.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

/**
 * Detect spec documentation level for a file by checking its parent spec.md.
 * Delegates to the spec.md file in the same directory (or returns null).
 */
export function detectSpecLevelFromParsed(filePath: string): number | null {
  const dir = path.dirname(filePath);
  const specMdPath = path.join(dir, 'spec.md');

  try {
    if (!fs.existsSync(specMdPath)) return null;

    // Read first 2KB for SPECKIT_LEVEL marker
    const fd = fs.openSync(specMdPath, 'r');
    let bytesRead = 0;
    const buffer = Buffer.alloc(2048);
    try {
      bytesRead = fs.readSync(fd, buffer, 0, 2048, 0);
    } finally {
      fs.closeSync(fd);
    }

    const header = buffer.toString('utf-8', 0, bytesRead);
    const levelMatch = header.match(/<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/i);
    if (levelMatch) {
      const levelStr = levelMatch[1];
      if (levelStr === '3+') return 4;
      const level = parseInt(levelStr, 10);
      if (level >= 1 && level <= 3) return level;
    }

    // Heuristic: check sibling files
    const siblings = fs.readdirSync(dir).map(f => f.toLowerCase());
    if (siblings.includes('decision-record.md')) return 3;
    if (siblings.includes('checklist.md')) return 2;
    return 1;
  } catch (_err: unknown) {
    // Spec level detection is best-effort; null signals unknown level to caller
    return null;
  }
}
