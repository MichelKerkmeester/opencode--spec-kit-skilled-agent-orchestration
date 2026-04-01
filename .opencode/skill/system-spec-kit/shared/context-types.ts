// ---------------------------------------------------------------
// MODULE: Context Types
// ---------------------------------------------------------------
// Single source of truth for context type definitions, canonical
// values, and legacy alias mappings. Used across shared/,
// mcp_server/, and scripts/.
// ---------------------------------------------------------------

/** The 4 canonical context types after the decision/discovery migration. */
export type CanonicalContextType = 'implementation' | 'research' | 'planning' | 'general';

/** All accepted context types including legacy aliases still in the DB. */
export type ContextType = CanonicalContextType | 'decision' | 'discovery';

/** Set of the 4 canonical context types. */
export const CANONICAL_CONTEXT_TYPES: ReadonlySet<CanonicalContextType> = new Set([
  'implementation',
  'research',
  'planning',
  'general',
]);

/**
 * Legacy context type aliases that map to canonical types.
 * These values existed before spec 009 and may still appear in
 * older database rows or frontmatter.
 */
export const LEGACY_CONTEXT_TYPE_ALIASES: Readonly<Record<string, CanonicalContextType>> = {
  decision: 'planning',
  discovery: 'general',
};

/**
 * Normalize any context type string to its canonical form.
 * Returns the canonical type if recognized, or null if unknown.
 */
export function resolveCanonicalContextType(value: string): CanonicalContextType | null {
  const lower = value.toLowerCase().trim();
  if (CANONICAL_CONTEXT_TYPES.has(lower as CanonicalContextType)) {
    return lower as CanonicalContextType;
  }
  return LEGACY_CONTEXT_TYPE_ALIASES[lower] ?? null;
}

/**
 * Check whether a context type value is a legacy alias.
 */
export function isLegacyContextType(value: string): boolean {
  return value in LEGACY_CONTEXT_TYPE_ALIASES;
}
