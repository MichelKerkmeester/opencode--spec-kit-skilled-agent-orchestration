// --- 1. CO ACTIVATION ---
// Spreading activation for related memory retrieval

import type Database from 'better-sqlite3';

/* --- 1. CONFIGURATION --- */

/**
 * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
 *
 * Intentional deviation from Sprint 1 spec (which listed 0.2): empirical tuning raised
 * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
 * keeps hub-node inflation in check, so a higher raw factor remains safe. Tests are
 * written against 0.25 and serve as the authoritative contract going forward.
 */
const DEFAULT_COACTIVATION_STRENGTH = 0.25;

const parsedBoostFactor = parseFloat(process.env.SPECKIT_COACTIVATION_STRENGTH || String(DEFAULT_COACTIVATION_STRENGTH));

const CO_ACTIVATION_CONFIG = {
  enabled: process.env.SPECKIT_COACTIVATION !== 'false',
  boostFactor: Number.isFinite(parsedBoostFactor) ? Math.max(0, Math.min(1.0, parsedBoostFactor)) : DEFAULT_COACTIVATION_STRENGTH,
  maxRelated: 5,
  minSimilarity: 70,
  decayPerHop: 0.5,
  maxHops: 2,
  maxSpreadResults: 20,
} as const;

/* --- 2. INTERFACES --- */

interface RelatedMemory {
  id: number;
  similarity: number;
  title?: string;
  spec_folder?: string;
  [key: string]: unknown;
}

interface SpreadResult {
  id: number;
  activationScore: number;
  hop: number;
  path: number[];
}

/* --- 3. MODULE STATE --- */

let db: Database.Database | null = null;

/** Simple TTL + size-capped cache for getRelatedMemories() results. */
const RELATED_CACHE = new Map<string, { results: RelatedMemory[]; expiresAt: number }>();
const RELATED_CACHE_TTL_MS = 30_000; // 30 seconds
const RELATED_CACHE_MAX_SIZE = 100;

function pruneRelatedCache(): void {
  if (RELATED_CACHE.size < RELATED_CACHE_MAX_SIZE) return;
  // Evict the oldest entry (Map preserves insertion order)
  const firstKey = RELATED_CACHE.keys().next().value;
  if (firstKey !== undefined) RELATED_CACHE.delete(firstKey);
}

/** Clear the getRelatedMemories cache (called on init to avoid stale data across DB reloads). */
function clearRelatedCache(): void {
  RELATED_CACHE.clear();
}

/* --- 4. INITIALIZATION --- */

function init(database: Database.Database): void {
  db = database;
  clearRelatedCache(); // Evict stale entries when a new DB connection is set
}

function isEnabled(): boolean {
  return CO_ACTIVATION_CONFIG.enabled;
}

/* --- 5. CORE FUNCTIONS --- */

/**
 * Boost a search result's score based on co-activation with related memories.
 */
function boostScore(
  baseScore: number,
  relatedCount: number,
  avgSimilarity: number
): number {
  if (!CO_ACTIVATION_CONFIG.enabled || relatedCount === 0) {
    return baseScore;
  }

  const perNeighborBoost = CO_ACTIVATION_CONFIG.boostFactor * (avgSimilarity / 100);
  // Pure fan-effect scaling — each additional neighbor contributes less (sublinear)
  const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
  const boost = Math.max(0, perNeighborBoost / fanDivisor);
  return baseScore + boost;
}

/**
 * Get related memories for a given memory ID from stored relations.
 *
 * Results are cached by memoryId for up to 30 seconds (RELATED_CACHE_TTL_MS) and
 * the cache is capped at 100 entries to bound memory usage. This avoids the O(N*E)
 * repeated DB round-trips when spreadActivation() traverses multiple hops.
 */
function getRelatedMemories(
  memoryId: number,
  limit: number = CO_ACTIVATION_CONFIG.maxRelated
): RelatedMemory[] {
  if (!db) {
    console.warn('[co-activation] Database not initialized. Server may still be starting up.');
    return [];
  }

  const cacheKey = `${memoryId}:${limit}`;

  // Cache hit: return early if a fresh entry exists
  const cached = RELATED_CACHE.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.results;
  }

  try {
    const memory = (db.prepare(
      'SELECT related_memories FROM memory_index WHERE id = ?'
    ) as Database.Statement).get(memoryId) as { related_memories: string | null } | undefined;

    if (!memory || !memory.related_memories) {
      return [];
    }

    let parsedRelated: unknown;
    try {
      parsedRelated = JSON.parse(memory.related_memories);
    } catch (_err: unknown) { // Malformed JSON in related_memories — return empty
      return [];
    }

    if (!Array.isArray(parsedRelated)) return [];

    const related = parsedRelated.filter((rel): rel is { id: number; similarity: number } => {
      if (typeof rel !== 'object' || rel === null) return false;
      const candidate = rel as { id?: unknown; similarity?: unknown };
      return (
        typeof candidate.id === 'number'
        && Number.isFinite(candidate.id)
        && typeof candidate.similarity === 'number'
        && Number.isFinite(candidate.similarity)
      );
    });

    // Fetch full memory details for each related
    const results: RelatedMemory[] = [];
    for (const rel of related.slice(0, limit)) {
      try {
        const fullMemory = (db.prepare(
          'SELECT id, title, spec_folder, file_path, importance_tier FROM memory_index WHERE id = ?'
        ) as Database.Statement).get(rel.id) as Record<string, unknown> | undefined;

        if (fullMemory) {
          results.push({
            ...(fullMemory as RelatedMemory),
            similarity: rel.similarity,
          });
        }
      } catch (_err: unknown) { // Individual relation lookup failure — skip
        // Skip individual failures
      }
    }

    // Cache miss: store results before returning
    pruneRelatedCache();
    RELATED_CACHE.set(cacheKey, { results, expiresAt: Date.now() + RELATED_CACHE_TTL_MS });
    return results;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[co-activation] getRelatedMemories error: ${msg}`);
    return [];
  }
}

/**
 * Populate related memories field for a given memory.
 */
async function populateRelatedMemories(
  memoryId: number,
  vectorSearchFn: (embedding: Float32Array, options: Record<string, unknown>) => Array<{ id: number; similarity: number; [key: string]: unknown }>
): Promise<number> {
  if (!db) return 0;

  try {
    // Get the memory's embedding via a vector search for itself
    const memory = (db.prepare('SELECT * FROM memory_index WHERE id = ?') as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
    if (!memory) return 0;

    // Get the memory's actual embedding from vec_memories
    const embeddingRow = db ? (db.prepare(
      'SELECT embedding FROM vec_memories WHERE rowid = ?'
    ) as import('better-sqlite3').Statement).get(memoryId) as { embedding: Buffer } | undefined : undefined;

    if (!embeddingRow || !embeddingRow.embedding || embeddingRow.embedding.length === 0) return 0;

    // Convert Buffer to Float32Array with proper byte alignment
    const uint8 = new Uint8Array(embeddingRow.embedding);
    if (uint8.byteLength === 0 || uint8.byteLength % 4 !== 0) {
      // Embedding data is empty or not aligned to 4-byte float boundaries
      console.warn(`[co-activation] Invalid embedding size (${uint8.byteLength} bytes) for memory ${memoryId}`);
      return 0;
    }
    const embedding = new Float32Array(uint8.buffer, uint8.byteOffset, uint8.byteLength / 4);
    const similar = vectorSearchFn(embedding, {
      limit: 2 * CO_ACTIVATION_CONFIG.maxRelated,
      minSimilarity: CO_ACTIVATION_CONFIG.minSimilarity,
    });

    const related = similar
      .filter(r => r.id !== memoryId)
      .slice(0, CO_ACTIVATION_CONFIG.maxRelated)
      .map(r => ({ id: r.id, similarity: r.similarity }));

    if (related.length > 0) {
      (db.prepare(
        'UPDATE memory_index SET related_memories = ? WHERE id = ?'
      ) as Database.Statement).run(JSON.stringify(related), memoryId);
    }

    return related.length;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[co-activation] populateRelatedMemories error: ${msg}`);
    return 0;
  }
}

/**
 * Get causally related memories for a given memory ID from the causal_edges table.
 * This surfaces memories connected by causal relationships (caused, enabled, supports, etc.)
 * which may be semantically dissimilar but contextually important.
 */
function getCausalNeighbors(
  memoryId: number,
  limit: number = CO_ACTIVATION_CONFIG.maxRelated
): RelatedMemory[] {
  if (!db) return [];

  try {
    const memIdStr = String(memoryId);
    const rows = (db.prepare(`
      SELECT
        CASE WHEN ce.source_id = ? THEN CAST(ce.target_id AS INTEGER)
             ELSE CAST(ce.source_id AS INTEGER)
        END AS neighbor_id,
        ce.strength,
        ce.relation
      FROM causal_edges ce
      WHERE ce.source_id = ? OR ce.target_id = ?
      ORDER BY ce.strength DESC
      LIMIT ?
    `) as Database.Statement).all(memIdStr, memIdStr, memIdStr, limit) as Array<{
      neighbor_id: number;
      strength: number;
      relation: string;
    }>;

    const results: RelatedMemory[] = [];
    for (const row of rows) {
      if (row.neighbor_id == null || row.neighbor_id === memoryId) continue;
      try {
        const fullMemory = (db!.prepare( // non-null safe: guard on line 207 returns early if db is null
          'SELECT id, title, spec_folder, file_path, importance_tier FROM memory_index WHERE id = ?'
        ) as Database.Statement).get(row.neighbor_id) as Record<string, unknown> | undefined;

        if (fullMemory) {
          results.push({
            ...(fullMemory as RelatedMemory),
            // Map edge strength (0-1) to similarity scale (0-100) for consistent scoring
            similarity: Math.round(row.strength * 100),
          });
        }
      } catch (_err: unknown) { // Causal neighbor lookup failure — skip
        // Skip individual failures
      }
    }

    return results;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[co-activation] getCausalNeighbors error: ${msg}`);
    return [];
  }
}

/**
 * Spreading activation: traverse both pre-computed similarity graph
 * and causal_edges graph from seed memories. Merging both sources
 * surfaces causally related but semantically dissimilar memories
 * that pure vector similarity would miss.
 */
function spreadActivation(
  seedIds: number[],
  maxHops: number = CO_ACTIVATION_CONFIG.maxHops,
  limit: number = CO_ACTIVATION_CONFIG.maxSpreadResults
): SpreadResult[] {
  if (!db || seedIds.length === 0) return [];

  const visited = new Set<number>();
  const results: SpreadResult[] = [];

  interface QueueItem {
    id: number;
    score: number;
    hop: number;
    path: number[];
  }

  const queue: QueueItem[] = seedIds.map(id => ({
    id,
    score: 1.0,
    hop: 0,
    path: [id],
  }));

  while (queue.length > 0 && results.length < limit) {
    const current = queue.shift();
    if (!current) break;

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (current.hop > 0) {
      results.push({
        id: current.id,
        activationScore: Math.round(current.score * 1000) / 1000,
        hop: current.hop,
        path: current.path,
      });
    }

    if (current.hop >= maxHops) continue;

    // Merge neighbors from both similarity and causal graphs
    const similarityNeighbors = getRelatedMemories(current.id);
    const causalNeighbors = getCausalNeighbors(current.id);

    // Deduplicate by ID, keeping the higher similarity score
    const neighborMap = new Map<number, RelatedMemory>();
    for (const rel of similarityNeighbors) {
      neighborMap.set(rel.id, rel);
    }
    for (const rel of causalNeighbors) {
      const existing = neighborMap.get(rel.id);
      if (!existing || rel.similarity > existing.similarity) {
        neighborMap.set(rel.id, rel);
      }
    }

    for (const rel of neighborMap.values()) {
      if (visited.has(rel.id)) continue;

      const decayedScore = current.score * CO_ACTIVATION_CONFIG.decayPerHop * (rel.similarity / 100);
      if (!Number.isFinite(decayedScore) || decayedScore < 0.01) continue;

      queue.push({
        id: rel.id,
        score: decayedScore,
        hop: current.hop + 1,
        path: [...current.path, rel.id],
      });
    }

    // Sort queue by score (greedy best-first)
    queue.sort((a, b) => b.score - a.score);
  }

  return results.sort((a, b) => b.activationScore - a.activationScore);
}

/* --- 6. EXPORTS --- */

export {
  CO_ACTIVATION_CONFIG,
  DEFAULT_COACTIVATION_STRENGTH,
  init,
  isEnabled,
  boostScore,
  getRelatedMemories,
  getCausalNeighbors,
  populateRelatedMemories,
  spreadActivation,
  clearRelatedCache,
};

export type {
  RelatedMemory,
  SpreadResult,
};
