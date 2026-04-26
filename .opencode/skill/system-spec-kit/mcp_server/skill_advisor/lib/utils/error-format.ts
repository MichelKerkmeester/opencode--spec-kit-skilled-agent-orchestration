// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Error Format
// ───────────────────────────────────────────────────────────────
// Single source of truth for the canonical
// `error instanceof Error ? error.message : String(error)` ternary
// repeated across handlers, freshness rebuild, watcher, and bench code.

/**
 * Convert an `unknown` thrown value into a stable, human-readable message
 * string without losing the underlying `Error.message` when present.
 */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
