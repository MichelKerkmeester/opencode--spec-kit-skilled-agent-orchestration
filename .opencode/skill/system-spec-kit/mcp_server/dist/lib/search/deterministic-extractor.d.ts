import type Database from 'better-sqlite3';
/**
 * Edge provenance marker for deterministic extraction.
 * Edges created by onIndex() carry evidence='explicit_only' to distinguish
 * them from probabilistic or LLM-derived edges.
 */
export declare const EXPLICIT_ONLY_EVIDENCE = "explicit_only";
/** Edge type produced by deterministic extraction at index time. */
export type DeterministicEdgeType = 'heading_link' | 'alias_link' | 'relation_phrase' | 'technology_link';
/** A single typed edge produced by save-time extraction. */
export interface DeterministicEdge {
    sourceId: string;
    targetId: string;
    relation: DeterministicEdgeType;
    evidence: typeof EXPLICIT_ONLY_EVIDENCE;
    strength: number;
}
/** Payload supplied to onWrite(). */
export interface WriteEdgePayload {
    /** IDs of nodes involved in the write (source, target, or affected). */
    nodeIds: string[];
}
/**
 * Extract technology names from code-fence annotations in markdown.
 * e.g. ```typescript → 'typescript'
 *
 * @param content - Raw markdown content.
 * @returns Unique lowercase technology names.
 */
export declare function extractCodeFenceTechnologies(content: string): string[];
/**
 * Extract headings from markdown content (## through ####).
 *
 * @param content - Raw markdown content.
 * @returns Trimmed heading strings.
 */
export declare function extractHeadings(content: string): string[];
/**
 * Extract alias definitions from markdown content.
 * Matches patterns like: "X is also known as Y", "X aka Y", "X (Y)",
 * or YAML-style `aliases: [X, Y]`.
 *
 * @param content - Raw markdown content.
 * @returns Pairs of [primary, alias] strings.
 */
export declare function extractAliases(content: string): Array<[string, string]>;
/**
 * Extract relation phrases from markdown content.
 * Captures patterns like "X depends on Y", "X implements Y", "X extends Y".
 *
 * @param content - Raw markdown content.
 * @returns Pairs of [subject, object] strings.
 */
export declare function extractRelationPhrases(content: string): Array<[string, string]>;
/**
 * Create typed edges from deterministic extraction results.
 * Writes edges with evidence='explicit_only' to causal_edges.
 *
 * Only runs when SPECKIT_ENTITY_LINKING is enabled (reuses flag per spec).
 *
 * @param db      - SQLite database instance.
 * @param memoryId - The newly saved memory row ID.
 * @param edges   - Typed edges to persist.
 * @param onWriteFn - Callback to trigger graph refresh for newly inserted edges.
 * @returns Number of edges actually inserted.
 */
export declare function createTypedEdges(db: Database.Database, memoryId: number, edges: DeterministicEdge[], onWriteFn: (db: Database.Database, payload: WriteEdgePayload) => void): number;
//# sourceMappingURL=deterministic-extractor.d.ts.map