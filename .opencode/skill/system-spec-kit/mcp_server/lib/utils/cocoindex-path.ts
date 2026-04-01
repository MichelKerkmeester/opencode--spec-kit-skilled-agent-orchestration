// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Path Helper
// ───────────────────────────────────────────────────────────────
// F046/F051: Shared helper for resolving the CocoIndex binary path.
// Eliminates duplicated process.cwd() calls in memory-surface.ts,
// session-resume.ts, and other consumers.

import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Relative path from project root to the CocoIndex CLI binary. */
const COCOINDEX_RELATIVE_PATH = '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc';

/**
 * Resolve the project root directory.
 *
 * Strategy: walk up from this module's directory until we find the
 * `.opencode/` marker directory. Falls back to process.cwd() if the
 * marker is not found within 10 levels (defensive guard).
 */
function resolveProjectRoot(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  let current = moduleDir;
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(current, '.opencode'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) break; // filesystem root
    current = parent;
  }
  // Fallback — should not happen in normal deployments
  return process.cwd();
}

let cachedRoot: string | null = null;

/** Get the project root (cached after first resolution). */
function getProjectRoot(): string {
  if (!cachedRoot) {
    cachedRoot = resolveProjectRoot();
  }
  return cachedRoot;
}

/**
 * Get the absolute path to the CocoIndex binary.
 * Uses the resolved project root instead of process.cwd().
 */
export function getCocoIndexBinaryPath(): string {
  return resolve(getProjectRoot(), COCOINDEX_RELATIVE_PATH);
}

/**
 * Check whether the CocoIndex binary exists on disk.
 */
export function isCocoIndexAvailable(): boolean {
  return existsSync(getCocoIndexBinaryPath());
}

/** Reset cached root (for testing only). */
export function _resetCachedRoot(): void {
  cachedRoot = null;
}
