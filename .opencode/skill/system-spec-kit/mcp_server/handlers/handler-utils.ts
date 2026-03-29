// ────────────────────────────────────────────────────────────────
// MODULE: Handler Utils
// ────────────────────────────────────────────────────────────────
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
// - detectSpecLevelFromParsed: re-exported from lib/spec/spec-level.ts

export { detectSpecLevelFromParsed } from '../lib/spec/spec-level.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Single and folder delete (memory_delete)
// Feature catalog: Validation feedback (memory_validate)


/** Escape special SQL LIKE pattern characters (% and _) for safe queries */
export function escapeLikePattern(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError(`escapeLikePattern expects string, got ${typeof str}`);
  }
  return str.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}
