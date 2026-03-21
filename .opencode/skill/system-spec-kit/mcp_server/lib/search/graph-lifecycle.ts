// ───────────────────────────────────────────────────────────────
// MODULE: Graph Lifecycle
// ───────────────────────────────────────────────────────────────
// Feature catalog: Graph-augmented retrieval — graph lifecycle
// REQ-D3-003: Graph Refresh on Write
// REQ-D3-004: Deterministic Save-Time Enrichment (wiring side)
//
// Gated via SPECKIT_GRAPH_REFRESH_MODE (off | write_local | scheduled)
// and SPECKIT_LLM_GRAPH_BACKFILL for async LLM enrichment.
//
// Design principles:
//   - All features default-OFF (no-op when flags unset)
//   - No breaking changes to existing save pipeline
//   - Deterministic extraction: no LLM calls for default path
//   - TypeScript strict mode; zero external runtime deps beyond better-sqlite3

import type Database from 'better-sqlite3';
import { createLogger } from '../utils/logger';

const logger = createLogger('GraphLifecycle');

// ───────────────────────────────────────────────────────────────
// 1. FEATURE FLAGS
// ───────────────────────────────────────────────────────────────

/**
 * REQ-D3-003: Graph refresh mode.
 * Controls when dirty-node recomputation is triggered after write operations.
 *
 * Values:
 *   off          — No graph refresh (default, safe).
 *   write_local  — Synchronous local recompute for small dirty components.
 *   scheduled    — Schedule a background global refresh for larger components.
 */
export type GraphRefreshMode = 'off' | 'write_local' | 'scheduled';

/**
 * Resolve the SPECKIT_GRAPH_REFRESH_MODE environment variable.
 * Falls back to 'off' for any unrecognised value.
 */
export function resolveGraphRefreshMode(): GraphRefreshMode {
  const raw = process.env.SPECKIT_GRAPH_REFRESH_MODE?.trim().toLowerCase();
  if (raw === 'write_local' || raw === 'write-local') return 'write_local';
  if (raw === 'scheduled') return 'scheduled';
  return 'off';
}

/** Whether graph refresh is active (any non-off mode). */
export function isGraphRefreshEnabled(): boolean {
  return resolveGraphRefreshMode() !== 'off';
}

/**
 * REQ-D3-004: LLM graph backfill feature flag.
 * When true, high-value docs receive an async LLM-based enrichment pass.
 * Default: FALSE (opt-in).  Set SPECKIT_LLM_GRAPH_BACKFILL=true to enable.
 */
export function isLlmGraphBackfillEnabled(): boolean {
  const val = process.env.SPECKIT_LLM_GRAPH_BACKFILL?.toLowerCase().trim();
  return val === 'true' || val === '1';
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

/**
 * Default maximum component size below which local recompute runs
 * synchronously.  Components larger than this are handled via the
 * scheduled-refresh path.  Override via SPECKIT_GRAPH_LOCAL_THRESHOLD.
 */
const DEFAULT_LOCAL_RECOMPUTE_THRESHOLD = 50;

/** Maximum number of edges to query per node during local recompute. */
const LOCAL_RECOMPUTE_EDGE_LIMIT = 500;

// ───────────────────────────────────────────────────────────────
// 3. INTERFACES
// ───────────────────────────────────────────────────────────────

/** Nodes whose edges have changed and require graph recomputation. */
export interface DirtyNodeSet {
  nodeIds: Set<string>;
  markedAt: number; // epoch ms
}

/** Result returned by onWrite(). */
export interface GraphRefreshResult {
  mode: GraphRefreshMode;
  dirtyNodes: number;
  localRecomputed: boolean;
  scheduledRefresh: boolean;
  componentSize: number;
  skipped: boolean;
}

/** Payload supplied to onWrite(). */
export interface WriteEdgePayload {
  /** IDs of nodes involved in the write (source, target, or affected). */
  nodeIds: string[];
}

// ───────────────────────────────────────────────────────────────
// 4. DIRTY-NODE TRACKING
// ───────────────────────────────────────────────────────────────

/**
 * Module-level dirty-node store.
 * Persists across onWrite() calls within the same process lifetime so
 * accumulated dirty nodes can be batch-refreshed during a scheduled run.
 *
 * The store is intentionally process-local (no DB persistence) to keep the
 * mechanism lightweight and side-effect-free for the default 'off' mode.
 */
let _dirtyNodes: DirtyNodeSet = {
  nodeIds: new Set<string>(),
  markedAt: 0,
};

/**
 * Mark a set of node IDs as dirty.
 * Safe to call in all modes; becomes a no-op when graph refresh is off.
 *
 * @param nodeIds - String node identifiers whose edges have changed.
 * @returns Number of newly dirtied nodes added to the dirty set.
 */
export function markDirty(nodeIds: string[]): number {
  if (!isGraphRefreshEnabled()) return 0;

  const before = _dirtyNodes.nodeIds.size;
  for (const id of nodeIds) {
    const normalized = id != null ? String(id).trim() : '';
    if (normalized.length > 0) {
      _dirtyNodes.nodeIds.add(normalized);
    }
  }
  if (_dirtyNodes.nodeIds.size > before) {
    _dirtyNodes.markedAt = Date.now();
  }
  return _dirtyNodes.nodeIds.size - before;
}

/** Return a snapshot of the current dirty-node set (read-only). */
export function getDirtyNodes(): Readonly<DirtyNodeSet> {
  return {
    nodeIds: new Set(_dirtyNodes.nodeIds),
    markedAt: _dirtyNodes.markedAt,
  };
}

/** Clear the dirty-node set (called after a successful global refresh). */
export function clearDirtyNodes(): void {
  _dirtyNodes = { nodeIds: new Set<string>(), markedAt: 0 };
}

// ───────────────────────────────────────────────────────────────
// 5. COMPONENT SIZE ESTIMATION
// ───────────────────────────────────────────────────────────────

/**
 * Parse the local-recompute threshold from the environment.
 * Falls back to DEFAULT_LOCAL_RECOMPUTE_THRESHOLD for invalid values.
 */
function resolveLocalThreshold(): number {
  const raw = process.env.SPECKIT_GRAPH_LOCAL_THRESHOLD;
  if (!raw) return DEFAULT_LOCAL_RECOMPUTE_THRESHOLD;
  const parsed = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LOCAL_RECOMPUTE_THRESHOLD;
}

/**
 * Estimate the connected component size for a set of dirty nodes.
 *
 * Performs a BFS expansion up to LOCAL_RECOMPUTE_EDGE_LIMIT edges to bound
 * the query cost.  Returns the total number of distinct nodes reachable
 * from the dirty set within that edge budget.
 *
 * @param db      - SQLite database instance.
 * @param nodeIds - Seed dirty-node IDs.
 * @returns Estimated component size (>= nodeIds.length).
 */
export function estimateComponentSize(
  db: Database.Database,
  nodeIds: string[],
): number {
  if (nodeIds.length === 0) return 0;

  const visited = new Set<string>(nodeIds);
  const queue: string[] = [...nodeIds];
  let edgesScanned = 0;

  try {
    const stmt = db.prepare(`
      SELECT source_id, target_id
      FROM causal_edges
      WHERE source_id = ? OR target_id = ?
      LIMIT ?
    `) as Database.Statement;

    while (queue.length > 0 && edgesScanned < LOCAL_RECOMPUTE_EDGE_LIMIT) {
      const current = queue.shift()!;
      const rows = stmt.all(current, current, LOCAL_RECOMPUTE_EDGE_LIMIT - edgesScanned) as Array<{
        source_id: string;
        target_id: string;
      }>;

      for (const row of rows) {
        edgesScanned++;
        for (const neighbor of [row.source_id, row.target_id]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('estimateComponentSize failed — using dirty-node count', { message });
    return nodeIds.length;
  }

  return visited.size;
}

// ───────────────────────────────────────────────────────────────
// 6. LOCAL RECOMPUTE
// ───────────────────────────────────────────────────────────────

/**
 * Recompute graph scores for a small dirty component in place.
 *
 * Currently updates the `strength` column for edges touching dirty nodes
 * using a normalized degree score (in-degree / max-degree within the
 * component).  This is the local, synchronous variant — only called when
 * component.size < threshold.
 *
 * @param db      - SQLite database instance.
 * @param nodeIds - Dirty node IDs to recompute.
 * @returns Number of edge rows updated.
 */
export function recomputeLocal(
  db: Database.Database,
  nodeIds: string[],
): number {
  if (nodeIds.length === 0) return 0;

  try {
    // Count in-degree for each dirty node
    const placeholders = nodeIds.map(() => '?').join(', ');
    const degreeRows = (db.prepare(`
      SELECT target_id AS node_id, COUNT(*) AS in_degree
      FROM causal_edges
      WHERE target_id IN (${placeholders})
      GROUP BY target_id
    `) as Database.Statement).all(...nodeIds) as Array<{
      node_id: string;
      in_degree: number;
    }>;

    if (degreeRows.length === 0) return 0;

    const maxDegree = Math.max(...degreeRows.map((r) => r.in_degree));
    if (maxDegree === 0) return 0;

    const updateStmt = db.prepare(`
      UPDATE causal_edges
      SET strength = MIN(1.0, strength + ?)
      WHERE target_id = ?
    `) as Database.Statement;

    let updated = 0;
    const runTransaction = db.transaction(() => {
      for (const row of degreeRows) {
        const normalizedBoost = row.in_degree / maxDegree * 0.1; // bounded: max +0.1
        const result = updateStmt.run(normalizedBoost, row.node_id);
        updated += result.changes;
      }
    });
    runTransaction();

    return updated;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('recomputeLocal failed', { message });
    return 0;
  }
}

// ───────────────────────────────────────────────────────────────
// 7. SCHEDULED GLOBAL REFRESH
// ───────────────────────────────────────────────────────────────

/**
 * Scheduled global-refresh timer handle.
 * NodeJS timer — cleared when a new schedule supersedes the previous one.
 */
let _scheduledRefreshTimer: ReturnType<typeof setTimeout> | null = null;

/** Default debounce delay in ms before scheduled refresh executes. */
const DEFAULT_SCHEDULE_DELAY_MS = 5_000;

/**
 * Schedule a global graph refresh to run after a debounce delay.
 *
 * Multiple calls within the debounce window are coalesced — only the last
 * call triggers execution.  The actual refresh callback (`_globalRefreshFn`)
 * is set via `registerGlobalRefreshFn()` and defaults to a no-op.
 *
 * @param delayMs - Debounce window in milliseconds (default 5 s).
 */
export function scheduleGlobalRefresh(delayMs = DEFAULT_SCHEDULE_DELAY_MS): void {
  if (_scheduledRefreshTimer !== null) {
    clearTimeout(_scheduledRefreshTimer);
  }
  _scheduledRefreshTimer = setTimeout(() => {
    _scheduledRefreshTimer = null;
    try {
      _globalRefreshFn();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn('scheduleGlobalRefresh callback failed', { message });
    }
  }, delayMs);
}

/**
 * Cancel any pending scheduled global refresh without executing it.
 * Intended for test teardown and graceful shutdown.
 */
export function cancelScheduledRefresh(): void {
  if (_scheduledRefreshTimer !== null) {
    clearTimeout(_scheduledRefreshTimer);
    _scheduledRefreshTimer = null;
  }
}

/** Returns true when a scheduled refresh is pending. */
export function isScheduledRefreshPending(): boolean {
  return _scheduledRefreshTimer !== null;
}

/** Registered global-refresh callback (default: no-op). */
let _globalRefreshFn: () => void = () => {
  logger.warn('Global graph refresh triggered but no refresh function registered.');
};

/**
 * Register a global-refresh callback.
 * Called by the application bootstrap to wire in the actual refresh
 * implementation (e.g., re-running entity linking over the full graph).
 *
 * @param fn - Synchronous or fire-and-forget async callback.
 */
export function registerGlobalRefreshFn(fn: () => void): void {
  _globalRefreshFn = fn;
}

// ───────────────────────────────────────────────────────────────
// 8. MAIN ENTRY POINT: onWrite
// ───────────────────────────────────────────────────────────────

/**
 * REQ-D3-003: Hook called after a write operation that modifies edges.
 *
 * Pipeline:
 *   1. markDirty(edges.nodes)
 *   2. estimateComponentSize()
 *   3. if component.size < threshold → recomputeLocal() (write_local mode)
 *   4. scheduleGlobalRefresh() (scheduled mode)
 *
 * Returns a summary result; never throws (fail-open to protect save pipeline).
 *
 * @param db      - SQLite database instance.
 * @param payload - Node IDs affected by the write.
 * @returns GraphRefreshResult describing what was done.
 */
export function onWrite(
  db: Database.Database,
  payload: WriteEdgePayload,
): GraphRefreshResult {
  const mode = resolveGraphRefreshMode();

  const emptyResult: GraphRefreshResult = {
    mode,
    dirtyNodes: 0,
    localRecomputed: false,
    scheduledRefresh: false,
    componentSize: 0,
    skipped: true,
  };

  if (mode === 'off') return emptyResult;

  try {
    const { nodeIds } = payload;
    if (!Array.isArray(nodeIds) || nodeIds.length === 0) {
      return emptyResult;
    }

    const newlyDirty = markDirty(nodeIds);
    const allDirty = Array.from(_dirtyNodes.nodeIds);
    const componentSize = estimateComponentSize(db, allDirty);
    const threshold = resolveLocalThreshold();

    let localRecomputed = false;
    let scheduledRefresh = false;

    if (mode === 'write_local' && componentSize < threshold) {
      const updated = recomputeLocal(db, allDirty);
      localRecomputed = updated >= 0; // true even when 0 updates (no error)
      if (localRecomputed) {
        clearDirtyNodes();
      }
    } else if (mode === 'scheduled') {
      scheduleGlobalRefresh();
      scheduledRefresh = true;
    } else if (mode === 'write_local' && componentSize >= threshold) {
      // Component too large for synchronous recompute — fall back to schedule
      scheduleGlobalRefresh();
      scheduledRefresh = true;
    }

    return {
      mode,
      dirtyNodes: newlyDirty,
      localRecomputed,
      scheduledRefresh,
      componentSize,
      skipped: false,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('onWrite failed — graph refresh skipped', { message });
    return emptyResult;
  }
}

// ───────────────────────────────────────────────────────────────
// 9. DETERMINISTIC SAVE-TIME ENRICHMENT (REQ-D3-004)
// ───────────────────────────────────────────────────────────────

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

/** Result returned by onIndex(). */
export interface OnIndexResult {
  edgesCreated: number;
  llmBackfillScheduled: boolean;
  skipped: boolean;
}

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

/**
 * Create typed edges from deterministic extraction results.
 * Writes edges with evidence='explicit_only' to causal_edges.
 *
 * Only runs when SPECKIT_ENTITY_LINKING is enabled (reuses flag per spec).
 *
 * @param db      - SQLite database instance.
 * @param memoryId - The newly saved memory row ID.
 * @param edges   - Typed edges to persist.
 * @returns Number of edges actually inserted.
 */
export function createTypedEdges(
  db: Database.Database,
  memoryId: number,
  edges: DeterministicEdge[],
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
    onWrite(db, { nodeIds });

    return inserted;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('createTypedEdges failed', { message });
    return 0;
  }
}

/**
 * REQ-D3-004: Deterministic save-time enrichment hook.
 *
 * Called at index time after a memory is persisted.  Extracts entities and
 * relations from the document using rule-based (deterministic) extraction and
 * creates typed edges with evidence='explicit_only'.
 *
 * Also schedules async LLM backfill when SPECKIT_LLM_GRAPH_BACKFILL=true
 * and the document is considered "high-value" (qualityScore >= threshold).
 *
 * @param db         - SQLite database instance.
 * @param memoryId   - The newly indexed memory row ID.
 * @param content    - Raw text content of the memory document.
 * @param options    - Optional override for quality threshold.
 * @returns OnIndexResult describing what was done.
 */
export function onIndex(
  db: Database.Database,
  memoryId: number,
  content: string,
  options?: { qualityScore?: number; llmBackfillThreshold?: number },
): OnIndexResult {
  const skippedResult: OnIndexResult = {
    edgesCreated: 0,
    llmBackfillScheduled: false,
    skipped: true,
  };

  // Guard: only run when entity linking is enabled (reuse SPECKIT_ENTITY_LINKING)
  const entityLinkingRaw = process.env.SPECKIT_ENTITY_LINKING?.toLowerCase().trim();
  if (entityLinkingRaw === 'false' || entityLinkingRaw === '0') {
    return skippedResult;
  }

  if (!content || content.trim().length === 0) {
    return skippedResult;
  }

  try {
    const memoryIdStr = String(memoryId);
    const edges: DeterministicEdge[] = [];

    // Extract headings → create heading_link edges to the memory node
    const headings = extractHeadings(content);
    for (const heading of headings) {
      // Use a deterministic pseudo-ID for the heading anchor node
      const headingId = `heading:${heading.toLowerCase().replace(/\s+/g, '_').slice(0, 80)}`;
      edges.push({
        sourceId: memoryIdStr,
        targetId: headingId,
        relation: 'heading_link',
        evidence: EXPLICIT_ONLY_EVIDENCE,
        strength: 0.6,
      });
    }

    // Extract aliases → alias_link edges
    const aliases = extractAliases(content);
    for (const [primary, alias] of aliases) {
      const primaryId = `alias:${primary.toLowerCase().replace(/\s+/g, '_').slice(0, 80)}`;
      const aliasId = `alias:${alias.toLowerCase().replace(/\s+/g, '_').slice(0, 80)}`;
      edges.push({
        sourceId: primaryId,
        targetId: aliasId,
        relation: 'alias_link',
        evidence: EXPLICIT_ONLY_EVIDENCE,
        strength: 0.7,
      });
    }

    // Extract relation phrases → relation_phrase edges
    const relations = extractRelationPhrases(content);
    for (const [subject, object] of relations) {
      const subjectId = `concept:${subject.toLowerCase().replace(/\s+/g, '_').slice(0, 80)}`;
      const objectId = `concept:${object.toLowerCase().replace(/\s+/g, '_').slice(0, 80)}`;
      edges.push({
        sourceId: subjectId,
        targetId: objectId,
        relation: 'relation_phrase',
        evidence: EXPLICIT_ONLY_EVIDENCE,
        strength: 0.65,
      });
    }

    // Extract code-fence technology names → technology_link edges
    const technologies = extractCodeFenceTechnologies(content);
    for (const tech of technologies) {
      const techId = `tech:${tech.replace(/\s+/g, '_').slice(0, 50)}`;
      edges.push({
        sourceId: memoryIdStr,
        targetId: techId,
        relation: 'technology_link',
        evidence: EXPLICIT_ONLY_EVIDENCE,
        strength: 0.75,
      });
    }

    const edgesCreated = createTypedEdges(db, memoryId, edges);

    // LLM backfill scheduling
    let llmBackfillScheduled = false;
    if (isLlmGraphBackfillEnabled()) {
      const qualityScore = options?.qualityScore ?? 0;
      const threshold = options?.llmBackfillThreshold ?? 0.7;
      if (qualityScore >= threshold) {
        llmBackfillScheduled = _scheduleLlmBackfill(memoryId);
      }
    }

    return {
      edgesCreated,
      llmBackfillScheduled,
      skipped: false,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('onIndex failed — enrichment skipped', { message });
    return skippedResult;
  }
}

// ───────────────────────────────────────────────────────────────
// 10. LLM BACKFILL (fire-and-forget, high-value docs)
// ───────────────────────────────────────────────────────────────

/**
 * Registered LLM backfill callback.
 * Set via `registerLlmBackfillFn()` in application bootstrap.
 * Default: no-op — safe to call without registration.
 */
let _llmBackfillFn: ((memoryId: number) => void) | null = null;

/**
 * Register the async LLM backfill callback.
 *
 * @param fn - Called with the memory ID when a high-value doc needs backfill.
 */
export function registerLlmBackfillFn(fn: (memoryId: number) => void): void {
  _llmBackfillFn = fn;
}

/**
 * Schedule LLM backfill for a memory document (fire-and-forget).
 * Uses setImmediate to defer work out of the current synchronous call stack.
 *
 * @param memoryId - The memory row to enrich.
 * @returns True when backfill was scheduled, false when no callback registered.
 */
function _scheduleLlmBackfill(memoryId: number): boolean {
  if (!_llmBackfillFn) return false;
  const fn = _llmBackfillFn;
  setImmediate(() => {
    try {
      fn(memoryId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn('LLM backfill callback failed', { memoryId, message });
    }
  });
  return true;
}

// ───────────────────────────────────────────────────────────────
// 11. TEST EXPORTS
// ───────────────────────────────────────────────────────────────

/**
 * Internal functions and constants exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  DEFAULT_LOCAL_RECOMPUTE_THRESHOLD,
  LOCAL_RECOMPUTE_EDGE_LIMIT,
  DEFAULT_SCHEDULE_DELAY_MS,
  resolveLocalThreshold,
  getDirtyNodes,
  clearDirtyNodes,
  markDirty,
  estimateComponentSize,
  recomputeLocal,
  isScheduledRefreshPending,
  cancelScheduledRefresh,
  registerGlobalRefreshFn,
  registerLlmBackfillFn,
  _scheduleLlmBackfill,
};
