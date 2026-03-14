// ───────────────────────────────────────────────────────────────
// MODULE: Search Types
// ───────────────────────────────────────────────────────────────
/**
 * Function signature for graph-based lexical search helpers.
 */
export type GraphSearchFn = (
  query: string,
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;
