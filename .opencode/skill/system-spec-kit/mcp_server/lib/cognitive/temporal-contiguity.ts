// ---------------------------------------------------------------
// MODULE: Temporal Contiguity
// Boost search results when memories are temporally adjacent,
// query temporal neighbors, and build spec-folder timelines.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

export const DEFAULT_WINDOW = 3600;   // 1 hour in seconds
export const MAX_WINDOW = 86400;      // 24 hours in seconds

const BOOST_FACTOR = 0.15;
// AI-WHY: Cap the cumulative contiguity boost per result so that a cluster of
// many temporally-close memories cannot inflate a score unboundedly.
const MAX_TOTAL_BOOST = 0.5;

/* -------------------------------------------------------------
   2. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

/* -------------------------------------------------------------
   3. INITIALIZATION
----------------------------------------------------------------*/

export function init(database: Database.Database): void {
  db = database;
}

/* -------------------------------------------------------------
   4. PURE FUNCTIONS
----------------------------------------------------------------*/

/**
 * Apply temporal-contiguity boost to vector search results.
 *
 * For every pair of results whose timestamps fall within `windowSeconds`
 * of each other, each member of the pair receives a similarity boost
 * proportional to how close they are:
 *
 *   boost = (1 - timeDelta / windowSeconds) * BOOST_FACTOR
 *   similarity *= (1 + boost)
 *
 * Null input returns null; empty array returns []; single item is
 * returned as-is (no pairs to evaluate).
 */
export function vectorSearchWithContiguity(
  results: Array<{ id: number; similarity: number; created_at: string }> | null,
  windowSeconds: number,
): Array<{ id: number; similarity: number; created_at: string }> | null {
  if (results === null) return null;
  if (results.length <= 1) return results.map(r => ({ ...r }));

  // Clone results so we can mutate similarities safely
  const boosted = results.map(r => ({
    ...r,
    _ts: new Date(r.created_at).getTime(),
  }));

  // Track cumulative boost per result so we can enforce MAX_TOTAL_BOOST
  const cumulativeBoost = new Array<number>(boosted.length).fill(0);

  for (let i = 0; i < boosted.length; i++) {
    for (let j = i + 1; j < boosted.length; j++) {
      const timeDelta = Math.abs(boosted[i]._ts - boosted[j]._ts) / 1000; // seconds
      if (timeDelta > windowSeconds) continue;

      const rawBoost = (1 - timeDelta / windowSeconds) * BOOST_FACTOR;

      // Clamp each result's cumulative boost to MAX_TOTAL_BOOST
      const boostI = Math.min(rawBoost, MAX_TOTAL_BOOST - cumulativeBoost[i]);
      const boostJ = Math.min(rawBoost, MAX_TOTAL_BOOST - cumulativeBoost[j]);

      if (boostI > 0) {
        boosted[i].similarity = boosted[i].similarity * (1 + boostI);
        cumulativeBoost[i] += boostI;
      }
      if (boostJ > 0) {
        boosted[j].similarity = boosted[j].similarity * (1 + boostJ);
        cumulativeBoost[j] += boostJ;
      }
    }
  }

  // Strip internal _ts field before returning
  return boosted.map(({ _ts, ...rest }) => rest);
}

/* -------------------------------------------------------------
   5. DB-DEPENDENT FUNCTIONS
----------------------------------------------------------------*/

/**
 * Find memories whose `created_at` falls within `windowSeconds` of the
 * given memory. Results are ordered by `time_delta_seconds ASC`.
 */
export function getTemporalNeighbors(
  memoryId: number,
  windowSeconds: number,
): Array<{ time_delta_seconds: number; [key: string]: unknown }> {
  if (!db) {
    console.warn('[temporal-contiguity] Database not initialized.');
    return [];
  }

  try {
    const anchor = (db.prepare(
      'SELECT created_at FROM memory_index WHERE id = ?',
    ) as Database.Statement).get(memoryId) as { created_at: string } | undefined;

    if (!anchor) return [];

    const rows = (db.prepare(`
      SELECT *,
             ABS(CAST((julianday(created_at) - julianday(?)) * 86400 AS INTEGER)) AS time_delta_seconds
        FROM memory_index
       WHERE id != ?
         AND ABS(CAST((julianday(created_at) - julianday(?)) * 86400 AS INTEGER)) <= ?
       ORDER BY time_delta_seconds ASC
    `) as Database.Statement).all(
      anchor.created_at,
      memoryId,
      anchor.created_at,
      windowSeconds,
    ) as Array<{ time_delta_seconds: number; [key: string]: unknown }>;

    return rows;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[temporal-contiguity] getTemporalNeighbors error: ${msg}`);
    return [];
  }
}

/**
 * Build a timeline of memories ordered by `created_at DESC`.
 * Optionally filtered to a single `specFolder`.
 */
export function buildTimeline(
  specFolder: string | null,
  limit: number,
): Array<{ created_at: string; [key: string]: unknown }> {
  if (!db) {
    console.warn('[temporal-contiguity] Database not initialized.');
    return [];
  }

  try {
    if (specFolder) {
      return (db.prepare(`
        SELECT * FROM memory_index
         WHERE spec_folder = ?
         ORDER BY created_at DESC
         LIMIT ?
      `) as Database.Statement).all(specFolder, limit) as Array<{ created_at: string; [key: string]: unknown }>;
    }

    return (db.prepare(`
      SELECT * FROM memory_index
       ORDER BY created_at DESC
       LIMIT ?
    `) as Database.Statement).all(limit) as Array<{ created_at: string; [key: string]: unknown }>;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[temporal-contiguity] buildTimeline error: ${msg}`);
    return [];
  }
}
