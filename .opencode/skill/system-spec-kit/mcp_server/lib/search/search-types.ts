// ---------------------------------------------------------------
// MODULE: Search Types
// ---------------------------------------------------------------

export type GraphSearchFn = (
  query: string,
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;
