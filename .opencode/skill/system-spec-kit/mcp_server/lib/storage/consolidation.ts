// ───────────────────────────────────────────────────────────────
// MODULE: N3-Lite Consolidation Engine
// ───────────────────────────────────────────────────────────────
// Lightweight graph maintenance: contradiction scan, Hebbian
// Strengthening, staleness detection, edge bounds enforcement.
// Behind SPECKIT_CONSOLIDATION flag.
import type Database from 'better-sqlite3';
import { isConsolidationEnabled } from '../search/search-flags.js';
import {
  updateEdge,
  getStaleEdges,
  countEdgesForNode,
  MAX_EDGES_PER_NODE,
  MAX_AUTO_STRENGTH,
  MAX_STRENGTH_INCREASE_PER_CYCLE,
  STALENESS_THRESHOLD_DAYS,
  DECAY_STRENGTH_AMOUNT,
  DECAY_PERIOD_DAYS,
} from './causal-edges.js';
import type { CausalEdge } from './causal-edges.js';

// Feature catalog: Lightweight consolidation


/* ───────────────────────────────────────────────────────────────
   1. TYPES
----------------------------------------------------------------*/

/**
 * Describes the ContradictionPair shape.
 */
export interface ContradictionPair {
  memoryA: { id: number; title: string | null; content: string | null };
  memoryB: { id: number; title: string | null; content: string | null };
  similarity: number;
  conflictType: 'keyword_negation' | 'semantic_opposition';
}

/**
 * Describes the ContradictionCluster shape.
 */
export interface ContradictionCluster {
  /** The initially detected pair */
  seedPair: ContradictionPair;
  /** All cluster members (IDs of related memories) */
  members: number[];
}

/**
 * Describes the ConsolidationResult shape.
 */
export interface ConsolidationResult {
  contradictions: ContradictionCluster[];
  hebbian: { strengthened: number; decayed: number };
  stale: { flagged: number };
  edgeBounds: { rejected: number };
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
----------------------------------------------------------------*/

/** Cosine similarity threshold for contradiction candidates */
const CONTRADICTION_SIMILARITY_THRESHOLD = 0.85;

/** Consolidation cadence for runtime hook (weekly batch semantics) */
const CONSOLIDATION_INTERVAL_DAYS = 7;

/** Negation keywords for lightweight contradiction heuristic */
const NEGATION_KEYWORDS = [
  'not', 'never', 'no longer', 'instead', 'removed', 'deprecated',
  'replaced', 'incorrect', 'wrong', 'outdated', 'contrary', 'opposite',
  "don't", "doesn't", "shouldn't", "won't", "can't", "isn't", "aren't",
];

/* ───────────────────────────────────────────────────────────────
   3. T002a: CONTRADICTION SCAN
----------------------------------------------------------------*/

/**
 * Find potential contradictions by:
 * 1. Candidate generation — high cosine similarity pairs (>0.85)
 * 2. Conflict check — keyword negation heuristic
 *
 * Returns pairs that are both semantically similar AND contain
 * negation patterns suggesting conflicting information.
 */
export function scanContradictions(
  database: Database.Database,
): ContradictionPair[] {
  const pairs: ContradictionPair[] = [];

  try {
    // Query high-similarity pairs from vec_memories using sqlite-vec
    // Fall back to content-based comparison if vec not available
    const hasSqliteVec = checkSqliteVecAvailable(database);

    if (hasSqliteVec) {
      pairs.push(...scanContradictionsVector(database));
    } else {
      pairs.push(...scanContradictionsHeuristic(database));
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[consolidation] scanContradictions error: ${msg}`);
  }

  return pairs;
}

function checkSqliteVecAvailable(database: Database.Database): boolean {
  try {
    const result = (database.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='vec_memories'"
    ) as Database.Statement).get() as { name: string } | undefined;
    return !!result;
  } catch (_error: unknown) {
    return false;
  }
}

/**
 * Vector-based contradiction scan using sqlite-vec cosine similarity.
 */
function scanContradictionsVector(
  database: Database.Database,
): ContradictionPair[] {
  const pairs: ContradictionPair[] = [];

  // Get all non-deprecated, non-chunk memories with embeddings
  const memories = (database.prepare(`
    SELECT m.id, m.title, m.content_text, v.embedding
    FROM memory_index m
    JOIN vec_memories v ON v.rowid = m.id
    WHERE m.importance_tier != 'deprecated'
      AND m.parent_id IS NULL
      AND m.content_text IS NOT NULL
      AND length(m.content_text) > 50
    ORDER BY m.id
    LIMIT 500
  `) as Database.Statement).all() as Array<{
    id: number;
    title: string | null;
    content_text: string | null;
    embedding: Buffer;
  }>;

  // O(n^2) pairwise scan capped at 500 memories (up to 124,750 pairs).
  // A 5-second deadline prevents runaway CPU when embeddings are large or the
  // Machine is slow, keeping the consolidation cycle non-blocking.
  const deadline = Date.now() + 5000;

  // Pairwise similarity check (O(n^2) but capped at 500 memories)
  for (let i = 0; i < memories.length; i++) {
    for (let j = i + 1; j < memories.length; j++) {
      if (Date.now() > deadline) {
        console.warn('[consolidation] Contradiction scan timed out after 5s');
        return pairs;
      }
      const similarity = computeCosineSimilarity(
        new Float32Array(memories[i].embedding.buffer, memories[i].embedding.byteOffset, memories[i].embedding.byteLength / 4),
        new Float32Array(memories[j].embedding.buffer, memories[j].embedding.byteOffset, memories[j].embedding.byteLength / 4),
      );

      if (similarity >= CONTRADICTION_SIMILARITY_THRESHOLD) {
        const contentA = memories[i].content_text || '';
        const contentB = memories[j].content_text || '';

        if (hasNegationConflict(contentA, contentB)) {
          pairs.push({
            memoryA: { id: memories[i].id, title: memories[i].title, content: contentA },
            memoryB: { id: memories[j].id, title: memories[j].title, content: contentB },
            similarity,
            conflictType: 'keyword_negation',
          });
        }
      }
    }
  }

  return pairs;
}

/**
 * Heuristic-only contradiction scan when vector similarity is unavailable.
 * Uses title and content text comparison.
 */
function scanContradictionsHeuristic(
  database: Database.Database,
): ContradictionPair[] {
  const pairs: ContradictionPair[] = [];

  const memories = (database.prepare(`
    SELECT id, title, content_text
    FROM memory_index
    WHERE importance_tier != 'deprecated'
      AND parent_id IS NULL
      AND content_text IS NOT NULL
      AND length(content_text) > 50
    ORDER BY id
    LIMIT 200
  `) as Database.Statement).all() as Array<{
    id: number;
    title: string | null;
    content_text: string | null;
  }>;

  // Same 5-second timeout guard as the vector-based scan to prevent
  // Unbounded CPU usage in the heuristic O(n^2) fallback path.
  const deadline = Date.now() + 5000;

  // Simple word-overlap heuristic for candidate generation
  for (let i = 0; i < memories.length; i++) {
    for (let j = i + 1; j < memories.length; j++) {
      if (Date.now() > deadline) {
        console.warn('[consolidation] Contradiction scan (heuristic) timed out after 5s');
        return pairs;
      }
      const contentA = memories[i].content_text || '';
      const contentB = memories[j].content_text || '';

      const overlap = computeWordOverlap(contentA, contentB);
      if (overlap >= CONTRADICTION_SIMILARITY_THRESHOLD && hasNegationConflict(contentA, contentB)) {
        pairs.push({
          memoryA: { id: memories[i].id, title: memories[i].title, content: contentA },
          memoryB: { id: memories[j].id, title: memories[j].title, content: contentB },
          similarity: overlap,
          conflictType: 'keyword_negation',
        });
      }
    }
  }

  return pairs;
}

/**
 * Check if two texts contain negation patterns suggesting contradiction.
 */
export function hasNegationConflict(textA: string, textB: string): boolean {
  const lowerA = textA.toLowerCase();
  const lowerB = textB.toLowerCase();

  for (const keyword of NEGATION_KEYWORDS) {
    const inA = lowerA.includes(keyword);
    const inB = lowerB.includes(keyword);

    // One has negation, the other doesn't → potential contradiction
    if (inA !== inB) return true;
  }

  return false;
}

function computeCosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

function computeWordOverlap(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const wordsB = new Set(textB.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++;
  }
  return overlap / Math.max(wordsA.size, wordsB.size);
}

/* ───────────────────────────────────────────────────────────────
   4. T002e: CONTRADICTION CLUSTER SURFACING
----------------------------------------------------------------*/

/**
 * Surface all members of a contradiction cluster.
 * When a contradiction pair is detected, find ALL related memories
 * (via causal edges) to surface the full context for resolution.
 */
export function buildContradictionClusters(
  database: Database.Database,
  pairs: ContradictionPair[],
): ContradictionCluster[] {
  const clusters: ContradictionCluster[] = [];

  for (const pair of pairs) {
    const memberIds = new Set<number>([pair.memoryA.id, pair.memoryB.id]);

    // Expand cluster via causal edges (1-hop neighbors)
    for (const seedId of [pair.memoryA.id, pair.memoryB.id]) {
      try {
        const neighbors = (database.prepare(`
          SELECT CAST(target_id AS INTEGER) as neighbor_id FROM causal_edges WHERE source_id = ?
          UNION
          SELECT CAST(source_id AS INTEGER) as neighbor_id FROM causal_edges WHERE target_id = ?
        `) as Database.Statement).all(String(seedId), String(seedId)) as Array<{ neighbor_id: number }>;

        for (const n of neighbors) {
          if (!isNaN(n.neighbor_id)) {
            memberIds.add(n.neighbor_id);
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('[consolidation] cluster expansion error:', message);
      }
    }

    clusters.push({
      seedPair: pair,
      members: Array.from(memberIds),
    });
  }

  return clusters;
}

/* ───────────────────────────────────────────────────────────────
   5. T002b: HEBBIAN EDGE STRENGTHENING
----------------------------------------------------------------*/

/**
 * Hebbian strengthening: increase edge strength for recently co-accessed edges.
 * +0.05 per cycle, capped at MAX_STRENGTH_INCREASE_PER_CYCLE.
 * 30-day decay: edges not accessed in 30 days lose 0.1 strength.
 *
 * All weight changes are logged to weight_history via updateEdge().
 */
export function runHebbianCycle(database: Database.Database): { strengthened: number; decayed: number } {
  let strengthened = 0;
  let decayed = 0;

  try {
    // Wrap all DB operations in a single transaction for atomicity
    database.transaction(() => {
      // Strengthen: edges accessed in the last cycle period (7 days)
      const recentEdges = (database.prepare(`
        SELECT id, strength, last_accessed, created_by FROM causal_edges
        WHERE last_accessed IS NOT NULL
          AND last_accessed > datetime('now', '-7 days')
          AND strength < 1.0
      `) as Database.Statement).all() as CausalEdge[];

      for (const edge of recentEdges) {
        const increase = Math.min(MAX_STRENGTH_INCREASE_PER_CYCLE, 1.0 - edge.strength);
        if (increase > 0) {
          const newStrength = Math.min(1.0, edge.strength + increase);
          // Auto edges cannot exceed MAX_AUTO_STRENGTH
          const cappedStrength = edge.created_by === 'auto'
            ? Math.min(newStrength, MAX_AUTO_STRENGTH)
            : newStrength;

          if (cappedStrength > edge.strength) {
            updateEdge(edge.id, { strength: cappedStrength }, 'hebbian', 'hebbian-strengthening');
            strengthened++;
          }
        }
      }

      // Decay: edges not accessed in DECAY_PERIOD_DAYS
      const staleDecayEdges = (database.prepare(`
        SELECT id, strength, last_accessed, created_by FROM causal_edges
        WHERE (last_accessed IS NULL AND extracted_at < datetime('now', '-' || ? || ' days'))
           OR (last_accessed IS NOT NULL AND last_accessed < datetime('now', '-' || ? || ' days'))
      `) as Database.Statement).all(DECAY_PERIOD_DAYS, DECAY_PERIOD_DAYS) as CausalEdge[];

      for (const edge of staleDecayEdges) {
        const newStrength = Math.max(0, edge.strength - DECAY_STRENGTH_AMOUNT);
        if (newStrength < edge.strength) {
          updateEdge(edge.id, { strength: newStrength }, 'hebbian', 'decay-30-day');
          decayed++;
        }
      }
    })();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[consolidation] runHebbianCycle error: ${msg}`);
  }

  return { strengthened, decayed };
}

/* ───────────────────────────────────────────────────────────────
   6. T002c: STALENESS DETECTION
----------------------------------------------------------------*/

/**
 * Detect stale edges (not accessed in 90+ days).
 * Flags them for review without deletion.
 */
export function detectStaleEdges(_database: Database.Database): CausalEdge[] {
  return getStaleEdges(STALENESS_THRESHOLD_DAYS);
}

/* ───────────────────────────────────────────────────────────────
   7. T002d: EDGE BOUNDS ENFORCEMENT
----------------------------------------------------------------*/

/**
 * Enforce edge bounds for a node:
 * - MAX_EDGES_PER_NODE = 20
 * - Auto edges capped at strength = 0.5
 *
 * Returns count of edges that would be rejected.
 */
export function checkEdgeBounds(
  nodeId: string,
): { currentCount: number; maxAllowed: number; canAddAuto: boolean } {
  const currentCount = countEdgesForNode(nodeId);
  return {
    currentCount,
    maxAllowed: MAX_EDGES_PER_NODE,
    canAddAuto: currentCount < MAX_EDGES_PER_NODE,
  };
}

/* ───────────────────────────────────────────────────────────────
   8. FULL CONSOLIDATION CYCLE
----------------------------------------------------------------*/

/**
 * Run a full N3-lite consolidation cycle:
 * 1. Contradiction scan
 * 2. Hebbian strengthening + decay
 * 3. Staleness detection
 * 4. Edge bounds check
 *
 * Designed to run as a weekly batch job.
 */
export function runConsolidationCycle(database: Database.Database): ConsolidationResult {
  // T002a + T002e: Contradiction scan + cluster surfacing
  const contradictionPairs = scanContradictions(database);
  const contradictions = buildContradictionClusters(database, contradictionPairs);

  // T002b: Hebbian strengthening + decay
  const hebbian = runHebbianCycle(database);

  // T002c: Staleness detection
  const staleEdges = detectStaleEdges(database);

  // T002d: Edge bounds — check counts (enforcement happens at insertEdge)
  let rejectedCount = 0;
  try {
    const nodes = (database.prepare(`
      SELECT DISTINCT node_id FROM (
        SELECT source_id AS node_id FROM causal_edges
        UNION
        SELECT target_id AS node_id FROM causal_edges
      )
    `) as Database.Statement).all() as Array<{ node_id: string }>;

    for (const { node_id } of nodes) {
      const bounds = checkEdgeBounds(node_id);
      if (!bounds.canAddAuto) rejectedCount++;
    }
  } catch (_error: unknown) {
    // Best-effort bounds check
  }

  return {
    contradictions,
    hebbian,
    stale: { flagged: staleEdges.length },
    edgeBounds: { rejected: rejectedCount },
  };
}

/**
 * Runtime gate for N3-lite consolidation.
 * Returns null when consolidation is disabled.
 */
export function runConsolidationCycleIfEnabled(
  database: Database.Database,
): ConsolidationResult | null {
  if (!isConsolidationEnabled()) return null;

  let beganImmediate = false;
  try {
    if (!database.inTransaction) {
      database.exec('BEGIN IMMEDIATE');
      beganImmediate = true;
    }

    (database.prepare(`
      CREATE TABLE IF NOT EXISTS consolidation_state (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        last_run_at TEXT
      )
    `) as Database.Statement).run();

    const row = (database.prepare(
      'SELECT last_run_at FROM consolidation_state WHERE id = 1'
    ) as Database.Statement).get() as { last_run_at: string | null } | undefined;

    if (row?.last_run_at) {
      const due = (database.prepare(`
        SELECT CASE
          WHEN ? <= datetime('now', '-' || ? || ' days') THEN 1
          ELSE 0
        END AS is_due
      `) as Database.Statement).get(row.last_run_at, CONSOLIDATION_INTERVAL_DAYS) as {
        is_due: number;
      };

      if (due.is_due !== 1) {
        if (beganImmediate) {
          database.exec('COMMIT');
          beganImmediate = false;
        }
        return null;
      }
    }

    const result = runConsolidationCycle(database);

    (database.prepare(`
      INSERT INTO consolidation_state (id, last_run_at)
      VALUES (1, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET last_run_at = datetime('now')
    `) as Database.Statement).run();

    if (beganImmediate) {
      database.exec('COMMIT');
      beganImmediate = false;
    }

    return result;
  } catch (err: unknown) {
    if (beganImmediate) {
      try {
        database.exec('ROLLBACK');
      } catch {
        // Ignore rollback errors after failed BEGIN/COMMIT paths.
      }
    }
    // Fail-closed: broken bookkeeping must not cause unbounded cycle runs
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[consolidation] cadence bookkeeping error:', message);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   9. EXPORTS
----------------------------------------------------------------*/

export {
  CONTRADICTION_SIMILARITY_THRESHOLD,
};
