// ───────────────────────────────────────────────────────────────
// MODULE: Spec Level
// ───────────────────────────────────────────────────────────────
// Shared spec-level detection extracted from handlers so lib modules
// can classify spec documents without crossing into handler layers.

import fs from 'fs';
import path from 'path';

// ───────────────────────────────────────────────────────────────
// 1. SPEC HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * Detect spec documentation level for a file by checking its parent `spec.md`.
 *
 * @param filePath - Parsed document path whose spec level should be inferred.
 * @returns Detected level (`1`-`4`, where `4` represents `3+`) or `null`.
 */
export function detectSpecLevelFromParsed(filePath: string): number | null {
  const dir = path.dirname(filePath);
  const specMdPath = path.join(dir, 'spec.md');

  try {
    if (!fs.existsSync(specMdPath)) return null;

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

    const siblings = fs.readdirSync(dir).map((file) => file.toLowerCase());
    if (siblings.includes('decision-record.md')) return 3;
    if (siblings.includes('checklist.md')) return 2;
    return 1;
  } catch (_error: unknown) {
    return null;
  }
}
