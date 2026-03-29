// ───────────────────────────────────────────────────────────────
// MODULE: Deterministic Extractor
// ───────────────────────────────────────────────────────────────
// Rule-based extraction functions for save-time graph enrichment.
// Extracted from graph-lifecycle.ts for modularization (REQ-D3-004).
//
// All functions are deterministic — no LLM calls.

import type Database from 'better-sqlite3';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('DeterministicExtractor');

/* ───────────────────────────────────────────────────────────────
   1. TYPES
----------------------------------------------------------------*/

/**
 * Edge provenance marker for deterministic extraction.
 * Edges created by onIndex() carry evidence='explicit_only' to distinguish
 * them from probabilistic or LLM-derived edges.
 */
export const EXPLICIT_ONLY_EVIDENCE = 'explicit_only';

/** Edge type produced by deterministic extraction at index time. */
export type DeterministicEdgeType =
  | 'heading_link'
  | 'alias_link'
  | 'relation_phrase'
  | 'technology_link';

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

/* ───────────────────────────────────────────────────────────────
   2. EXTRACTION FUNCTIONS
----------------------------------------------------------------*/

/**
 * Extract technology names from code-fence annotations in markdown.
 * e.g. ```typescript → 'typescript'
 *
 * @param content - Raw markdown content.
 * @returns Unique lowercase technology names.
 */
export function extractCodeFenceTechnologies(content: string): string[] {
  const seen = new Set<string>();
  const re = /```(\w[\w.-]*)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    const tech = match[1].toLowerCase().trim();
    if (tech.length > 0 && tech.length <= 50) {
      seen.add(tech);
    }
  }
  return Array.from(seen);
}

/**
 * Extract headings from markdown content (## through ####).
 *
 * @param content - Raw markdown content.
 * @returns Trimmed heading strings.
 */
export function extractHeadings(content: string): string[] {
  const headings: string[] = [];
  const re = /^#{2,4}\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    const h = match[1].trim();
    if (h.length > 0 && h.length <= 200) {
      headings.push(h);
    }
  }
  return headings;
}

/**
 * Extract alias definitions from markdown content.
 * Matches patterns like: "X is also known as Y", "X aka Y", "X (Y)",
 * or YAML-style `aliases: [X, Y]`.
 *
 * @param content - Raw markdown content.
 * @returns Pairs of [primary, alias] strings.
 */
export function extractAliases(content: string): Array<[string, string]> {
  const aliases: Array<[string, string]> = [];

  // Pattern: "X also known as Y" / "X aka Y"
  const akaRe = /\b([\w][\w\s-]{1,50})\s+(?:also known as|aka)\s+([\w][\w\s-]{1,50})\b/gi;
  let match: RegExpExecArray | null;
  while ((match = akaRe.exec(content)) !== null) {
    aliases.push([match[1].trim(), match[2].trim()]);
  }

  // Pattern: YAML aliases block
  const yamlAliasRe = /^aliases:\s*\[([^\]]+)\]/gm;
  while ((match = yamlAliasRe.exec(content)) !== null) {
    const parts = match[1].split(',').map((s) => s.trim()).filter(Boolean);
    for (let i = 0; i < parts.length - 1; i++) {
      aliases.push([parts[0], parts[i + 1]]);
    }
  }

  return aliases;
}

/**
 * Extract relation phrases from markdown content.
 * Captures patterns like "X depends on Y", "X implements Y", "X extends Y".
 *
 * @param content - Raw markdown content.
 * @returns Pairs of [subject, object] strings.
 */
export function extractRelationPhrases(content: string): Array<[string, string]> {
  const relations: Array<[string, string]> = [];
  const RELATION_VERBS =
    /\b(depends on|implements|extends|inherits from|uses|requires|calls|overrides)\b/gi;

  // Simple sentence-level capture: SUBJECT <VERB> OBJECT
  const re =
    /\b([\w][\w\s-]{0,40}?)\s+(?:depends on|implements|extends|inherits from|uses|requires|calls|overrides)\s+([\w][\w\s-]{0,40})\b/gi;

  // Reset lastIndex since re has /g
  re.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    const subject = match[1].trim();
    const object = match[2].trim();
    if (subject.length > 1 && object.length > 1 && subject !== object) {
      relations.push([subject, object]);
    }
  }

  // Silence unused variable warning while keeping the constant for documentation
  void RELATION_VERBS;

  return relations;
}

/* ───────────────────────────────────────────────────────────────
   3. EDGE CREATION
----------------------------------------------------------------*/

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
export function createTypedEdges(
  db: Database.Database,
  memoryId: number,
  edges: DeterministicEdge[],
  onWriteFn: (db: Database.Database, payload: WriteEdgePayload) => void,
): number {
  if (edges.length === 0) return 0;

  try {
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO causal_edges
        (source_id, target_id, relation, strength, evidence, created_by)
      VALUES (?, ?, ?, ?, ?, 'graph_lifecycle')
    `) as Database.Statement;

    let inserted = 0;
    const runTransaction = db.transaction(() => {
      for (const edge of edges) {
        const result = insertStmt.run(
          edge.sourceId,
          edge.targetId,
          edge.relation,
          edge.strength,
          edge.evidence,
        );
        inserted += result.changes;
      }
    });
    runTransaction();

    // Trigger graph refresh for the newly inserted edges
    const nodeIds = edges.flatMap((e) => [e.sourceId, e.targetId]);
    onWriteFn(db, { nodeIds });

    return inserted;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('createTypedEdges failed', { message });
    return 0;
  }
}
