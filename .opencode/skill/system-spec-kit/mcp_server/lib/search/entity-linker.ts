// --- 1. ENTITY LINKER ---
// Gated via SPECKIT_ENTITY_LINKING
// Creates causal edges between memories sharing entities across spec folders.
import type Database from 'better-sqlite3';
import { isEntityLinkingEnabled } from './search-flags';
import { createLogger } from '../utils/logger';

// --- 2. CONSTANTS ---

/** Maximum causal edges per node to prevent graph density explosion. */
const MAX_EDGES_PER_NODE = 20;

/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
const DEFAULT_MAX_EDGE_DENSITY = 1.0;

/** Environment variable for overriding S5 density guard threshold. */
const ENTITY_LINKING_MAX_DENSITY_ENV = 'SPECKIT_ENTITY_LINKING_MAX_DENSITY';
const logger = createLogger('EntityLinker');

// --- 3. INTERFACES ---

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

// --- 4. HELPERS ---

/**
 * Normalize entity name: lowercase, strip punctuation, collapse whitespace.
 * e.g. "Memory System" -> "memory system", "TF-IDF" -> "tf idf"
 *
 * @param name - Raw entity name to normalize
 * @returns Normalized lowercase entity name
 */
export function normalizeEntityName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// --- 5. CORE FUNCTIONS ---

/**
 * Build entity catalog from memory_entities table.
 * Groups entities by their normalized name, collecting associated memory IDs
 * and spec folders.
 *
 * @param db - SQLite database instance
 * @returns Map of canonical_name -> { memoryIds, specFolders (unique) }
 */
export function buildEntityCatalog(
  db: Database.Database,
): Map<string, { memoryIds: number[]; specFolders: string[] }> {
  const catalog = new Map<string, { memoryIds: number[]; specFolders: string[] }>();
  // Track seen values per canonical name using Sets for O(1) dedup instead of O(n) .includes()
  const catalogSets = new Map<string, { memoryIdSet: Set<number>; specFolderSet: Set<string> }>();

  try {
    const rows = (db.prepare(`
      SELECT me.memory_id, me.entity_text, mi.spec_folder
      FROM memory_entities me
      JOIN memory_index mi ON me.memory_id = mi.id
    `) as Database.Statement).all() as Array<{
      memory_id: number;
      entity_text: string;
      spec_folder: string;
    }>;

    for (const row of rows) {
      const canonical = normalizeEntityName(row.entity_text);
      if (canonical.length === 0) continue;

      let entry = catalog.get(canonical);
      let sets = catalogSets.get(canonical);
      if (!entry || !sets) {
        entry = { memoryIds: [], specFolders: [] };
        sets = { memoryIdSet: new Set<number>(), specFolderSet: new Set<string>() };
        catalog.set(canonical, entry);
        catalogSets.set(canonical, sets);
      }

      if (!sets.memoryIdSet.has(row.memory_id)) {
        sets.memoryIdSet.add(row.memory_id);
        entry.memoryIds.push(row.memory_id);
      }
      if (row.spec_folder && !sets.specFolderSet.has(row.spec_folder)) {
        sets.specFolderSet.add(row.spec_folder);
        entry.specFolders.push(row.spec_folder);
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-linker] Failed to build entity catalog: ${message}`);
  }

  return catalog;
}

/**
 * Find entities that appear in 2+ spec folders (cross-document matches).
 *
 * @param db - SQLite database instance
 * @returns Array of entity matches spanning multiple spec folders
 */
export function findCrossDocumentMatches(db: Database.Database): EntityMatch[] {
  const catalog = buildEntityCatalog(db);
  const matches: EntityMatch[] = [];

  for (const [canonicalName, entry] of catalog) {
    if (entry.specFolders.length >= 2) {
      matches.push({
        canonicalName,
        memoryIds: entry.memoryIds,
        specFolders: entry.specFolders,
      });
    }
  }

  return matches;
}

/**
 * Count current edges for a node (both source and target).
 */
function getEdgeCount(db: Database.Database, nodeId: string): number {
  try {
    const row = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM causal_edges WHERE source_id = ? OR target_id = ?`,
    ) as Database.Statement).get(nodeId, nodeId) as { cnt: number } | undefined;
    return row?.cnt ?? 0;
  } catch (error: unknown) {
    logger.warn('Failed to count edges for node', {
      nodeId,
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}

/**
 * Look up which spec folder a memory belongs to.
 */
function getSpecFolder(db: Database.Database, memoryId: number): string | null {
  try {
    const row = (db.prepare(
      `SELECT spec_folder FROM memory_index WHERE id = ?`,
    ) as Database.Statement).get(memoryId) as { spec_folder: string } | undefined;
    return row?.spec_folder ?? null;
  } catch (error: unknown) {
    logger.warn('Failed to resolve spec folder for memory', {
      memoryId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Parse and validate the maximum edge density threshold for S5 linking.
 * Accepts finite non-negative values; invalid inputs fall back to default.
 */
function sanitizeDensityThreshold(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_MAX_EDGE_DENSITY;
  }
  return parsed;
}

/**
 * Resolve S5 density threshold from env var with safe fallback.
 */
function getEntityLinkingDensityThreshold(): number {
  const raw = process.env[ENTITY_LINKING_MAX_DENSITY_ENV];
  if (raw === undefined) {
    return DEFAULT_MAX_EDGE_DENSITY;
  }
  return sanitizeDensityThreshold(raw);
}

/**
 * Compute edge density: totalEdges / totalMemories.
 *
 * @param db - An initialized better-sqlite3 Database instance.
 * @returns Density ratio, or 0 if no memories exist or on error.
 */
export function computeEdgeDensity(db: Database.Database): number {
  return getGlobalEdgeDensityStats(db).density;
}

/**
 * Compute global graph density as total_edges / total_memories.
 * Returns 0 when there are no memories or when a DB error occurs.
 */
function getGlobalEdgeDensityStats(
  db: Database.Database,
): { totalEdges: number; totalMemories: number; density: number } {
  try {
    const edgeRow = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM causal_edges`,
    ) as Database.Statement).get() as { cnt: number };
    const totalEdges = edgeRow?.cnt ?? 0;

    const memoryRow = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM memory_index`,
    ) as Database.Statement).get() as { cnt: number };
    const totalMemories = memoryRow?.cnt ?? 0;

    const density = totalMemories > 0 ? totalEdges / totalMemories : 0;
    return { totalEdges, totalMemories, density };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-linker] Failed to compute edge density: ${message}`);
    return { totalEdges: 0, totalMemories: 0, density: 0 };
  }
}

/**
 * Batch-fetch edge counts for a set of node IDs in a single query.
 * Returns a map of nodeId -> edge count (source OR target).
 * Uses UNION ALL to count both directions per node in one round-trip.
 */
function batchGetEdgeCounts(db: Database.Database, nodeIds: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  if (nodeIds.length === 0) return counts;

  // Build: SELECT id, COUNT(*) AS cnt FROM (
  // SELECT source_id AS id FROM causal_edges WHERE source_id IN (...)
  // UNION ALL
  // SELECT target_id AS id FROM causal_edges WHERE target_id IN (...)
  // ) GROUP BY id
  const placeholders = nodeIds.map(() => '?').join(', ');
  const sql = `
    SELECT id, COUNT(*) AS cnt FROM (
      SELECT source_id AS id FROM causal_edges WHERE source_id IN (${placeholders})
      UNION ALL
      SELECT target_id AS id FROM causal_edges WHERE target_id IN (${placeholders})
    ) GROUP BY id
  `;

  try {
    const rows = (db.prepare(sql) as Database.Statement).all(
      ...nodeIds,
      ...nodeIds,
    ) as Array<{ id: string; cnt: number }>;
    for (const row of rows) {
      counts.set(row.id, row.cnt);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-linker] batchGetEdgeCounts failed: ${message}`);
  }

  return counts;
}

export function createEntityLinks(
  db: Database.Database,
  matches: EntityMatch[],
  options?: EntityLinkingOptions,
): EntityLinkResult {
  let linksCreated = 0;
  let entitiesProcessed = 0;
  const crossDocMatches = matches.length;
  const maxEdgeDensity = options?.maxEdgeDensity === undefined
    ? getEntityLinkingDensityThreshold()
    : sanitizeDensityThreshold(options.maxEdgeDensity);
  const densityStats = getGlobalEdgeDensityStats(db);
  let totalEdges = densityStats.totalEdges;
  const totalMemories = densityStats.totalMemories;
  let blockedByDensityGuard = 0;
  let skippedByDensityGuard = false;

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
    VALUES (?, ?, 'supports', 0.7, ?, 'entity_linker')
  `) as Database.Statement;

  // --- P3b: Batch edge-count pre-fetch ---
  // Collect all unique node IDs across all matches so we can fetch edge counts
  // In a single query instead of one query per node per pair (N+1 pattern).
  const allNodeIds = new Set<string>();
  for (const match of matches) {
    for (const memoryId of match.memoryIds) {
      allNodeIds.add(String(memoryId));
    }
  }
  // EdgeCountCache holds the edge counts at the start of this run.
  // As we insert new edges we increment the cached value so subsequent
  // Checks within the same run stay accurate without extra DB round-trips.
  const edgeCountCache = batchGetEdgeCounts(db, Array.from(allNodeIds));

  for (const match of matches) {
    entitiesProcessed += 1;

    // Build a map of memoryId -> specFolder for this match
    const memoryFolders = new Map<number, string>();
    for (const memoryId of match.memoryIds) {
      const folder = getSpecFolder(db, memoryId);
      if (folder) {
        memoryFolders.set(memoryId, folder);
      }
    }

    // Create edges between each pair of memories in DIFFERENT spec folders
    const memoryIds = Array.from(memoryFolders.keys());
    for (let i = 0; i < memoryIds.length; i++) {
      for (let j = i + 1; j < memoryIds.length; j++) {
        const idA = memoryIds[i];
        const idB = memoryIds[j];
        const folderA = memoryFolders.get(idA);
        const folderB = memoryFolders.get(idB);
        if (!folderA || !folderB) continue;

        // Only link memories from different spec folders
        if (folderA === folderB) continue;

        const sourceId = String(idA);
        const targetId = String(idB);

        // Global density guard: skip linking if this insert would push density
        // Above the configured threshold.
        if (totalMemories > 0) {
          const projectedDensity = (totalEdges + 1) / totalMemories;
          if (projectedDensity > maxEdgeDensity) {
            blockedByDensityGuard += 1;
            skippedByDensityGuard = true;
            continue;
          }
        }

        // Respect MAX_EDGES_PER_NODE — use cached counts (O(1) map lookup)
        const sourceCount = edgeCountCache.get(sourceId) ?? 0;
        const targetCount = edgeCountCache.get(targetId) ?? 0;
        if (sourceCount >= MAX_EDGES_PER_NODE) continue;
        if (targetCount >= MAX_EDGES_PER_NODE) continue;

        const evidence = `Cross-doc entity: ${match.canonicalName}`;

        try {
          const result = insertStmt.run(sourceId, targetId, evidence);
          if (result.changes > 0) {
            linksCreated += 1;
            totalEdges += 1;
            // Keep cache consistent so later pairs in this run see accurate counts
            edgeCountCache.set(sourceId, sourceCount + 1);
            edgeCountCache.set(targetId, targetCount + 1);
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          console.warn(`[entity-linker] Failed to insert edge ${sourceId}->${targetId}: ${message}`);
        }
      }
    }
  }

  const edgeDensity = totalMemories > 0 ? totalEdges / totalMemories : 0;
  return {
    linksCreated,
    entitiesProcessed,
    crossDocMatches,
    skippedByDensityGuard,
    edgeDensity,
    densityThreshold: maxEdgeDensity,
    blockedByDensityGuard,
  };
}

/**
 * Get statistics about entity linking.
 *
 * @param db - SQLite database instance
 * @returns Statistics including total links, cross-doc links, unique entities, and coverage
 */
export function getEntityLinkStats(db: Database.Database): EntityLinkStats {
  try {
    // Count total edges created by entity_linker
    const totalRow = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM causal_edges WHERE created_by = 'entity_linker'`,
    ) as Database.Statement).get() as { cnt: number };
    const totalEntityLinks = totalRow?.cnt ?? 0;

    // Count distinct entity names from evidence field (parse "Cross-doc entity: <name>")
    const evidenceRows = (db.prepare(
      `SELECT DISTINCT evidence FROM causal_edges WHERE created_by = 'entity_linker'`,
    ) as Database.Statement).all() as Array<{ evidence: string }>;

    const entityNames = new Set<string>();
    for (const row of evidenceRows) {
      const match = row.evidence?.match(/^Cross-doc entity:\s*(.+)$/);
      if (match) {
        entityNames.add(match[1]);
      }
    }
    const uniqueEntities = entityNames.size;

    // Count cross-document links (all entity_linker edges are cross-doc by design)
    const crossDocLinks = totalEntityLinks;

    // Coverage: memories with at least one entity link / total memories
    const linkedRow = (db.prepare(`
      SELECT COUNT(DISTINCT id) AS cnt FROM (
        SELECT CAST(source_id AS INTEGER) AS id FROM causal_edges WHERE created_by = 'entity_linker'
        UNION
        SELECT CAST(target_id AS INTEGER) AS id FROM causal_edges WHERE created_by = 'entity_linker'
      )
    `) as Database.Statement).get() as { cnt: number };
    const linkedMemories = linkedRow?.cnt ?? 0;

    const totalRow2 = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM memory_index`,
    ) as Database.Statement).get() as { cnt: number };
    const totalMemories = totalRow2?.cnt ?? 0;

    const coveragePercent = totalMemories > 0
      ? Math.round((linkedMemories / totalMemories) * 10000) / 100
      : 0;

    return { totalEntityLinks, crossDocLinks, uniqueEntities, coveragePercent };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-linker] Failed to get stats: ${message}`);
    return { totalEntityLinks: 0, crossDocLinks: 0, uniqueEntities: 0, coveragePercent: 0 };
  }
}

/**
 * Entity infrastructure gate: check entity_catalog has >0 entries.
 *
 * @param db - SQLite database instance
 * @returns True if entity_catalog table has at least one entry
 */
export function hasEntityInfrastructure(db: Database.Database): boolean {
  try {
    const row = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM entity_catalog`,
    ) as Database.Statement).get() as { cnt: number };
    return (row?.cnt ?? 0) > 0;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-linker] Failed to check entity infrastructure: ${message}`);
    return false;
  }
}

/**
 * Main orchestrator: run the full entity linking pipeline.
 *
 * 1. Checks entity infrastructure (entity_catalog must have entries)
 * 2. Finds cross-document entity matches
 * 3. Creates causal edges between matching memories
 *
 * @param db - SQLite database instance
 * @returns Result with counts of links created, entities processed, and matches
 */
export function runEntityLinking(db: Database.Database): EntityLinkResult {
  const emptyResult: EntityLinkResult = { linksCreated: 0, entitiesProcessed: 0, crossDocMatches: 0 };

  if (!isEntityLinkingEnabled()) {
    return emptyResult;
  }

  if (!hasEntityInfrastructure(db)) {
    return emptyResult;
  }

  try {
    const matches = findCrossDocumentMatches(db);
    if (matches.length === 0) {
      return emptyResult;
    }

    const maxEdgeDensity = getEntityLinkingDensityThreshold();
    const { density } = getGlobalEdgeDensityStats(db);
    if (density > maxEdgeDensity) {
      return {
        ...emptyResult,
        skippedByDensityGuard: true,
        edgeDensity: density,
        densityThreshold: maxEdgeDensity,
        blockedByDensityGuard: 0,
      };
    }

    return createEntityLinks(db, matches, { maxEdgeDensity });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-linker] Pipeline failed: ${message}`);
    return emptyResult;
  }
}

// --- 6. TEST EXPORTS ---

/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  MAX_EDGES_PER_NODE,
  DEFAULT_MAX_EDGE_DENSITY,
  sanitizeDensityThreshold,
  getEntityLinkingDensityThreshold,
  getGlobalEdgeDensityStats,
  normalizeEntityName,
  getEdgeCount,
  getSpecFolder,
};
