// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Workspace Root Walk-Up
// ───────────────────────────────────────────────────────────────
// Shared walk-up helper used by every advisor handler, daemon, bench,
// and parity test that needs to resolve the workspace root from a
// runtime-supplied starting directory. Mirrors the `code_graph/lib/utils/
// workspace-path.ts` shape: one canonicalized helper, parametrizable by
// start dir, depth cap, and sentinel path.

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface AdvisorWorkspaceRootOptions {
  readonly maxDepth?: number;
  readonly sentinel?: string;
}

const DEFAULT_MAX_DEPTH = 14;
const DEFAULT_SENTINEL = '.opencode/skill';

/**
 * Walk up parent directories from `start` until the `sentinel` path is found
 * relative to the candidate directory. Returns the first directory that
 * contains `sentinel`. If no candidate is found within `maxDepth` iterations,
 * returns the canonicalized form of `start` as the safest fallback (matching
 * the prior in-line behavior of `handlers/advisor-recommend.ts`).
 *
 * @param start - The directory to start walking from. Defaults to `process.cwd()`.
 * @param opts.maxDepth - Maximum number of parent steps to walk. Defaults to 14.
 * @param opts.sentinel - Path (relative to a candidate directory) used as the
 *   workspace marker. Defaults to `'.opencode/skill'`.
 */
export function findAdvisorWorkspaceRoot(
  start: string = process.cwd(),
  opts: AdvisorWorkspaceRootOptions = {},
): string {
  const maxDepth = opts.maxDepth ?? DEFAULT_MAX_DEPTH;
  const sentinel = opts.sentinel ?? DEFAULT_SENTINEL;
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (existsSync(resolve(current, sentinel))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return resolve(start);
}
