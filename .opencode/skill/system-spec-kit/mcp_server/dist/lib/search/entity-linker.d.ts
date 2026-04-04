import type Database from 'better-sqlite3';
export interface EntityMatch {
    canonicalName: string;
    memoryIds: number[];
    specFolders: string[];
}
export interface EntityLinkResult {
    linksCreated: number;
    entitiesProcessed: number;
    crossDocMatches: number;
    skippedByDensityGuard?: boolean;
    edgeDensity?: number;
    densityThreshold?: number;
    blockedByDensityGuard?: number;
}
interface EntityLinkingOptions {
    maxEdgeDensity?: number;
}
export interface EntityLinkStats {
    totalEntityLinks: number;
    crossDocLinks: number;
    uniqueEntities: number;
    coveragePercent: number;
}
/**
 * Extract candidate noun phrase tokens from a query string using simple
 * heuristics: split on whitespace and punctuation, filter stop-words and
 * very short tokens, and return unique lowercase tokens.
 *
 * This is intentionally rule-based (no POS tagging or NLP library) to avoid
 * latency and external dependencies.
 *
 * @param query - The search query string.
 * @returns Array of candidate noun phrase tokens (lowercase, deduplicated).
 * @example
 * ```ts
 * nounPhrases('How does vector search indexing work?');
 * // ['vector', 'search', 'indexing', 'work']
 * ```
 */
export declare function nounPhrases(query: string): string[];
/**
 * Match noun phrase tokens against a concept alias table, returning the
 * canonical concept names for any matched aliases.
 *
 * Matching is done against the built-in alias table first, then against any
 * additional aliases supplied via the `extraAliases` parameter.
 *
 * @param tokens - Noun phrase tokens (from `nounPhrases()`).
 * @param extraAliases - Optional additional alias map (alias -> canonical).
 * @returns Array of matched canonical concept names (unique, max MAX_CONCEPTS_PER_QUERY).
 * @example
 * ```ts
 * matchAliases(['memory', 'graph'], { relationships: 'causal' });
 * // ['memory', 'graph']
 * ```
 */
export declare function matchAliases(tokens: string[], extraAliases?: Record<string, string>): string[];
/**
 * Load concept aliases from the `entity_catalog` database table, if available.
 *
 * Returns an alias map { alias_text -> canonical_name } for use in
 * `matchAliases()`. Returns an empty object when the table is missing or
 * empty (fail-open: concept routing proceeds with built-in aliases only).
 *
 * @param db - SQLite database instance.
 * @returns Alias map from the entity_catalog table.
 * @example
 * ```ts
 * const aliases = loadConceptAliasTable(db);
 * ```
 */
export declare function loadConceptAliasTable(db: Database.Database): Record<string, string>;
/**
 * Query-time concept routing result.
 *
 * Contains the matched concepts and the activation state for the graph channel.
 */
export interface ConceptRoutingResult {
    /** Canonical concept names matched from the query. */
    concepts: string[];
    /** True when at least one concept was matched and graph routing is active. */
    graphActivated: boolean;
}
/**
 * Run query-time concept routing:
 *   1. Extract noun phrases from the query.
 *   2. Load concept aliases from the database (supplementing built-ins).
 *   3. Match aliases against noun phrases.
 *   4. Return matched concepts and graph activation state.
 *
 * Returns `graphActivated: false` with empty concepts when:
 *   - No noun phrases extracted
 *   - No alias matches found
 *   - Any internal error occurs (fail-open)
 *
 * @param query - The search query string.
 * @param db    - Optional SQLite database instance for alias table loading.
 * @returns ConceptRoutingResult with matched concepts and activation state.
 * @example
 * ```ts
 * const routed = routeQueryConcepts('memory graph edges', db);
 * ```
 */
export declare function routeQueryConcepts(query: string, db?: Database.Database): ConceptRoutingResult;
/**
 * Phase B T016: Given a list of canonical concept names, reverse-lookup the
 * alias table to collect related search terms for query expansion.
 *
 * For each canonical name, finds all aliases that map to it (excluding the
 * original query tokens to avoid redundancy). Returns unique expansion terms.
 *
 * @param concepts - Canonical concept names (from routeQueryConcepts).
 * @param originalTokens - Query tokens to exclude from expansion (avoid echo).
 * @param maxTerms - Maximum expansion terms to return (default 5).
 * @returns Array of expansion terms derived from concept aliases.
 */
export declare function getConceptExpansionTerms(concepts: string[], originalTokens: string[], maxTerms?: number): string[];
/**
 * Normalize entity name: lowercase, strip punctuation, collapse whitespace.
 * e.g. "Memory System" -> "memory system", "TF-IDF" -> "tf idf"
 *
 * @param name - Raw entity name to normalize.
 * @returns Normalized lowercase entity name.
 * @example
 * ```ts
 * normalizeEntityName('TF-IDF');
 * // 'tf idf'
 * ```
 */
export declare function normalizeEntityName(name: string): string;
/**
 * Build entity catalog from memory_entities table.
 * Groups entities by their normalized name, collecting associated memory IDs
 * and spec folders.
 *
 * @param db - SQLite database instance.
 * @returns Map of canonical names to associated memory IDs and spec folders.
 * @example
 * ```ts
 * const catalog = buildEntityCatalog(db);
 * ```
 */
export declare function buildEntityCatalog(db: Database.Database): Map<string, {
    memoryIds: number[];
    specFolders: string[];
}>;
/**
 * Find entities that appear in 2+ spec folders (cross-document matches).
 *
 * @param db - SQLite database instance.
 * @returns Entity matches spanning multiple spec folders.
 * @example
 * ```ts
 * const matches = findCrossDocumentMatches(db);
 * ```
 */
export declare function findCrossDocumentMatches(db: Database.Database): EntityMatch[];
/**
 * Count current edges for a node (both source and target).
 */
declare function getEdgeCount(db: Database.Database, nodeId: string): number;
/**
 * Look up which spec folder a memory belongs to.
 */
declare function getSpecFolder(db: Database.Database, memoryId: number): string | null;
/**
 * Parse and validate the maximum edge density threshold for S5 linking.
 * Accepts finite non-negative values; invalid inputs fall back to default.
 */
declare function sanitizeDensityThreshold(value: unknown): number;
/**
 * Resolve S5 density threshold from env var with safe fallback.
 */
declare function getEntityLinkingDensityThreshold(): number;
/**
 * Compute edge density: totalEdges / totalMemories.
 *
 * @param db - An initialized better-sqlite3 Database instance.
 * @returns Density ratio, or 0 if no memories exist or on error.
 * @example
 * ```ts
 * const density = computeEdgeDensity(db);
 * ```
 */
export declare function computeEdgeDensity(db: Database.Database): number;
/**
 * Compute global graph density as total_edges / total_memories.
 * Returns 0 when there are no memories or when a DB error occurs.
 */
declare function getGlobalEdgeDensityStats(db: Database.Database): {
    totalEdges: number;
    totalMemories: number;
    density: number;
};
/**
 * Create cross-document causal links for matched entities.
 *
 * @param db - SQLite database instance.
 * @param matches - Cross-document entity matches to link.
 * @param options - Optional density-guard overrides.
 * @returns Summary of links created and density-guard behavior.
 * @throws {Error} If the causal edge insert statement cannot be prepared.
 * @example
 * ```ts
 * const result = createEntityLinks(db, matches);
 * ```
 */
export declare function createEntityLinks(db: Database.Database, matches: EntityMatch[], options?: EntityLinkingOptions): EntityLinkResult;
/**
 * Get statistics about entity linking.
 *
 * @param db - SQLite database instance.
 * @returns Statistics including total links, cross-doc links, unique entities, and coverage.
 * @example
 * ```ts
 * const stats = getEntityLinkStats(db);
 * ```
 */
export declare function getEntityLinkStats(db: Database.Database): EntityLinkStats;
/**
 * Entity infrastructure gate: check entity_catalog has >0 entries.
 *
 * @param db - SQLite database instance.
 * @returns `true` when the entity catalog table is populated.
 * @example
 * ```ts
 * if (hasEntityInfrastructure(db)) {
 *   runEntityLinking(db);
 * }
 * ```
 */
export declare function hasEntityInfrastructure(db: Database.Database): boolean;
/**
 * Main orchestrator: run the full entity linking pipeline.
 *
 * 1. Checks entity infrastructure (entity_catalog must have entries)
 * 2. Finds cross-document entity matches
 * 3. Creates causal edges between matching memories
 *
 * @param db - SQLite database instance.
 * @returns Result with counts of links created, entities processed, and matches.
 * @example
 * ```ts
 * const result = runEntityLinking(db);
 * ```
 */
export declare function runEntityLinking(db: Database.Database): EntityLinkResult;
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    MAX_EDGES_PER_NODE: number;
    DEFAULT_MAX_EDGE_DENSITY: number;
    sanitizeDensityThreshold: typeof sanitizeDensityThreshold;
    getEntityLinkingDensityThreshold: typeof getEntityLinkingDensityThreshold;
    getGlobalEdgeDensityStats: typeof getGlobalEdgeDensityStats;
    normalizeEntityName: typeof normalizeEntityName;
    getEdgeCount: typeof getEdgeCount;
    getSpecFolder: typeof getSpecFolder;
    BUILTIN_CONCEPT_ALIASES: Record<string, string>;
    MIN_NOUN_PHRASE_TOKEN_LENGTH: number;
    MAX_CONCEPTS_PER_QUERY: number;
};
export {};
//# sourceMappingURL=entity-linker.d.ts.map