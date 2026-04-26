// ───────────────────────────────────────────────────────────────
// MODULE: Workspace Path Utilities
// ───────────────────────────────────────────────────────────────
// Shared canonicalization + workspace-containment helpers used by
// every code-graph handler that accepts a caller-supplied path.

import { realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';

export interface CanonicalizedWorkspace {
  readonly canonicalWorkspace: string;
  readonly canonicalRootDir: string;
}

/**
 * Canonicalize the workspace root and a candidate `rootDir` via `realpathSync`.
 *
 * Returns `null` when either path is invalid or contains a broken symlink.
 * Callers are expected to surface a typed error response on `null`.
 */
export function canonicalizeWorkspacePaths(
  rootDir: string,
  workspaceRoot: string = process.cwd(),
): CanonicalizedWorkspace | null {
  try {
    const canonicalWorkspace = realpathSync(resolve(workspaceRoot));
    const canonicalRootDir = realpathSync(resolve(rootDir));
    return { canonicalWorkspace, canonicalRootDir };
  } catch {
    return null;
  }
}

/**
 * Returns `true` iff `candidatePath` is the canonical workspace itself or a
 * descendant of it. Compares strings only — both inputs MUST already be
 * canonicalized via `realpathSync` (or equivalent) before being passed in.
 *
 * Centralized to keep the workspace-boundary invariant identical across
 * `handlers/scan.ts`, `handlers/verify.ts`, and `handlers/detect-changes.ts`.
 */
export function isWithinWorkspace(canonicalWorkspace: string, candidatePath: string): boolean {
  if (candidatePath === canonicalWorkspace) {
    return true;
  }
  const workspacePrefix = canonicalWorkspace.endsWith(sep)
    ? canonicalWorkspace
    : `${canonicalWorkspace}${sep}`;
  return candidatePath.startsWith(workspacePrefix);
}

/**
 * Throw-form of {@link isWithinWorkspace}. Used by callers (e.g. `verify.ts`)
 * that consume the discriminated-union failure shape via try/catch wrapping.
 */
export function assertWithinWorkspace(
  canonicalWorkspace: string,
  candidatePath: string,
  label: string,
): void {
  if (!isWithinWorkspace(canonicalWorkspace, candidatePath)) {
    throw new Error(`${label} must stay within the workspace root: ${canonicalWorkspace}`);
  }
}
