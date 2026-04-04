// ───────────────────────────────────────────────────────────────
// MODULE: Co Activation
// ───────────────────────────────────────────────────────────────
// Spreading activation for related memory retrieval
// Feature catalog: Co-activation fan-effect divisor
// Feature catalog: Co-activation boost strength increase
/* --- 1. CONFIGURATION --- */
/**
 * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
 *
 * Intentional deviation from the original spec (which listed 0.2): empirical tuning raised
 * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
 * keeps hub-node inflation in check, so a higher raw factor remains safe. Tests are
 * written against 0.25 and serve as the authoritative contract going forward.
 */
const DEFAULT_COACTIVATION_STRENGTH = 0.25;
function resolveCoActivationEnabled() {
    return process.env.SPECKIT_COACTIVATION !== 'false';
}
function resolveCoActivationBoostFactor() {
    const parsedBoostFactor = parseFloat(process.env.SPECKIT_COACTIVATION_STRENGTH || String(DEFAULT_COACTIVATION_STRENGTH));
    return Number.isFinite(parsedBoostFactor)
        ? Math.max(0, Math.min(1.0, parsedBoostFactor))
        : DEFAULT_COACTIVATION_STRENGTH;
}
const CO_ACTIVATION_CONFIG = Object.freeze({
    get enabled() {
        return resolveCoActivationEnabled();
    },
    get boostFactor() {
        return resolveCoActivationBoostFactor();
    },
    maxRelated: 5,
    minSimilarity: 70,
    decayPerHop: 0.5,
    maxHops: 2,
    maxSpreadResults: 20,
});
const DEFAULT_RELATED_MEMORY_SIMILARITY = 50;
/* --- 3. MODULE STATE --- */
let db = null;
/** Simple TTL + size-capped cache for getRelatedMemories() results. */
const RELATED_CACHE = new Map();
const RELATED_CACHE_TTL_MS = 30_000; // 30 seconds
const RELATED_CACHE_MAX_SIZE = 200;
/**
 * Enforce cache bound using the enforceCacheBound() pattern from graph-signals.ts.
 * Clears the entire cache when the limit is exceeded, since Map iteration order
 * is insertion order and partial eviction of "oldest" entries would require
 * iterating anyway.
 */
function enforceCacheBound() {
    if (RELATED_CACHE.size > RELATED_CACHE_MAX_SIZE) {
        RELATED_CACHE.clear();
    }
}
/** Clear the getRelatedMemories cache (called on init to avoid stale data across DB reloads). */
function clearRelatedCache() {
    RELATED_CACHE.clear();
}
function parseRelatedMemoryReferences(raw) {
    if (!raw)
        return [];
    let parsedRelated;
    try {
        parsedRelated = JSON.parse(raw);
    }
    catch (_err) {
        return [];
    }
    if (!Array.isArray(parsedRelated))
        return [];
    return parsedRelated.flatMap((rel) => {
        if (typeof rel === 'number' && Number.isFinite(rel)) {
            return [{ id: rel, similarity: DEFAULT_RELATED_MEMORY_SIMILARITY }];
        }
        if (typeof rel !== 'object' || rel === null)
            return [];
        const candidate = rel;
        if (typeof candidate.id === 'number'
            && Number.isFinite(candidate.id)
            && typeof candidate.similarity === 'number'
            && Number.isFinite(candidate.similarity)) {
            return [{ id: candidate.id, similarity: candidate.similarity }];
        }
        return [];
    });
}
function fetchMemoryDetails(memoryIds) {
    if (!db || memoryIds.length === 0)
        return new Map();
    const uniqueIds = [...new Set(memoryIds.filter((id) => Number.isFinite(id)))];
    if (uniqueIds.length === 0)
        return new Map();
    const placeholders = uniqueIds.map(() => '?').join(',');
    const rows = db.prepare(`SELECT id, title, spec_folder, file_path, importance_tier
     FROM memory_index
     WHERE id IN (${placeholders})`).all(...uniqueIds);
    return new Map(rows.map((row) => [row.id, row]));
}
/* --- 4. INITIALIZATION --- */
function init(database) {
    db = database;
    clearRelatedCache(); // Evict stale entries when a new DB connection is set
}
function isEnabled() {
    return resolveCoActivationEnabled();
}
/* --- 5. CORE FUNCTIONS --- */
/**
 * Boost a search result's score based on co-activation with related memories.
 */
function boostScore(baseScore, relatedCount, avgSimilarity) {
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
function getRelatedMemories(memoryId, limit = CO_ACTIVATION_CONFIG.maxRelated) {
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
        const memory = db.prepare('SELECT related_memories FROM memory_index WHERE id = ?').get(memoryId);
        if (!memory || !memory.related_memories) {
            return [];
        }
        const related = parseRelatedMemoryReferences(memory.related_memories).slice(0, limit);
        const relatedDetails = fetchMemoryDetails(related.map((rel) => rel.id));
        const results = related.flatMap((rel) => {
            const fullMemory = relatedDetails.get(rel.id);
            if (!fullMemory)
                return [];
            return [{
                    ...fullMemory,
                    similarity: rel.similarity,
                }];
        });
        // Cache miss: store results before returning
        RELATED_CACHE.set(cacheKey, { results, expiresAt: Date.now() + RELATED_CACHE_TTL_MS });
        enforceCacheBound();
        return results;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[co-activation] getRelatedMemories error: ${msg}`);
        return [];
    }
}
function getRelatedMemoryCounts(memoryIds, limit = CO_ACTIVATION_CONFIG.maxRelated) {
    if (!db || memoryIds.length === 0) {
        return new Map();
    }
    const uniqueIds = [...new Set(memoryIds.filter((id) => Number.isFinite(id)))];
    if (uniqueIds.length === 0) {
        return new Map();
    }
    const placeholders = uniqueIds.map(() => '?').join(',');
    const rows = db.prepare(`SELECT id, related_memories
     FROM memory_index
     WHERE id IN (${placeholders})`).all(...uniqueIds);
    return new Map(rows.map((row) => [
        row.id,
        parseRelatedMemoryReferences(row.related_memories).slice(0, limit).length,
    ]));
}
/**
 * Populate related memories field for a given memory.
 */
async function populateRelatedMemories(memoryId, vectorSearchFn) {
    if (!db)
        return 0;
    try {
        // Get the memory's embedding via a vector search for itself
        const memory = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(memoryId);
        if (!memory)
            return 0;
        // Get the memory's actual embedding from vec_memories
        const embeddingRow = db ? db.prepare('SELECT embedding FROM vec_memories WHERE rowid = ?').get(memoryId) : undefined;
        if (!embeddingRow || !embeddingRow.embedding || embeddingRow.embedding.length === 0)
            return 0;
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
            db.prepare('UPDATE memory_index SET related_memories = ? WHERE id = ?').run(JSON.stringify(related), memoryId);
        }
        return related.length;
    }
    catch (error) {
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
function getCausalNeighbors(memoryId, limit = CO_ACTIVATION_CONFIG.maxRelated) {
    if (!db)
        return [];
    try {
        const memIdStr = String(memoryId);
        return db.prepare(`
      WITH causal_neighbors AS (
        SELECT
          CASE
            WHEN ce.source_id = ? THEN CAST(ce.target_id AS INTEGER)
            ELSE CAST(ce.source_id AS INTEGER)
          END AS neighbor_id,
          ce.strength
        FROM causal_edges ce
        WHERE ce.source_id = ? OR ce.target_id = ?
        ORDER BY ce.strength DESC
        LIMIT ?
      )
      SELECT
        mi.id,
        mi.title,
        mi.spec_folder,
        mi.file_path,
        mi.importance_tier,
        CAST(ROUND(causal_neighbors.strength * 100) AS INTEGER) AS similarity
      FROM causal_neighbors
      JOIN memory_index mi ON mi.id = causal_neighbors.neighbor_id
      WHERE mi.id != ?
    `).all(memIdStr, memIdStr, memIdStr, limit, memoryId);
    }
    catch (error) {
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
function spreadActivation(seedIds, maxHops = CO_ACTIVATION_CONFIG.maxHops, limit = CO_ACTIVATION_CONFIG.maxSpreadResults) {
    if (!db || seedIds.length === 0)
        return [];
    const visited = new Set();
    const results = [];
    const queue = seedIds.map(id => ({
        id,
        score: 1.0,
        hop: 0,
        path: [id],
    }));
    while (queue.length > 0 && results.length < limit) {
        const current = queue.shift();
        if (!current)
            break;
        if (visited.has(current.id))
            continue;
        visited.add(current.id);
        if (current.hop > 0) {
            results.push({
                id: current.id,
                activationScore: Math.round(current.score * 1000) / 1000,
                hop: current.hop,
                path: current.path,
            });
        }
        if (current.hop >= maxHops)
            continue;
        // Merge neighbors from both similarity and causal graphs
        const similarityNeighbors = getRelatedMemories(current.id);
        const causalNeighbors = getCausalNeighbors(current.id);
        // Deduplicate by ID, keeping the higher similarity score
        const neighborMap = new Map();
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
            if (visited.has(rel.id))
                continue;
            const decayedScore = current.score * CO_ACTIVATION_CONFIG.decayPerHop * (rel.similarity / 100);
            if (!Number.isFinite(decayedScore) || decayedScore < 0.01)
                continue;
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
export { CO_ACTIVATION_CONFIG, DEFAULT_COACTIVATION_STRENGTH, init, isEnabled, resolveCoActivationBoostFactor, boostScore, getRelatedMemories, getRelatedMemoryCounts, getCausalNeighbors, populateRelatedMemories, spreadActivation, clearRelatedCache, };
//# sourceMappingURL=co-activation.js.map