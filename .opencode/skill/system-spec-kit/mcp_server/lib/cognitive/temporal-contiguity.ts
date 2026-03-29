// ───────────────────────────────────────────────────────────────
// MODULE: Temporal Contiguity
// ───────────────────────────────────────────────────────────────
// Boost search results when memories are temporally adjacent,
// Query temporal neighbors, and build spec-folder timelines.

import type Database from 'better-sqlite3';

// Feature catalog: Temporal contiguity layer


/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

export const DEFAULT_WINDOW = 3600;   // 1 hour in seconds
export const MAX_WINDOW = 86400;      // 24 hours in seconds

const BOOST_FACTOR = 0.15;
// Cap the cumulative contiguity boost per result so that a cluster of
// Many temporally-close memories cannot inflate a score unboundedly.
const MAX_TOTAL_BOOST = 0.5;

function formatBoundaryTimestamp(timestampMs: number, anchorTimestamp: string): string {
  const iso = new Date(timestampMs).toISOString();
  if (anchorTimestamp.includes('T')) {
    return iso;
  }
  return iso.replace('T', ' ').replace('Z', '');
}

/* ───────────────────────────────────────────────────────────────
   2. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

/* ───────────────────────────────────────────────────────────────
   3. INITIALIZATION
----------------------------------------------------------------*/

export function init(database: Database.Database): void {
  db = database;
}

/* ───────────────────────────────────────────────────────────────
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

  // Clamp window to valid range
  const clampedWindow = Math.max(1, Math.min(MAX_WINDOW, windowSeconds));

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
      if (timeDelta > clampedWindow) continue;

      const rawBoost = (1 - timeDelta / clampedWindow) * BOOST_FACTOR;

      // Clamp each result's cumulative boost to MAX_TOTAL_BOOST
      const boostI = Math.min(rawBoost, MAX_TOTAL_BOOST - cumulativeBoost[i]);
      const boostJ = Math.min(rawBoost, MAX_TOTAL_BOOST - cumulativeBoost[j]);

      if (boostI > 0) {
        boosted[i].similarity *= (1 + boostI);
        cumulativeBoost[i] += boostI;
      }
      if (boostJ > 0) {
        boosted[j].similarity *= (1 + boostJ);
        cumulativeBoost[j] += boostJ;
      }
    }
  }

  // Strip internal _ts field before returning
  return boosted.map(({ _ts, ...rest }) => rest);
}

/* ───────────────────────────────────────────────────────────────
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

  // Clamp window to valid range
  const clampedWindow = Math.max(1, Math.min(MAX_WINDOW, windowSeconds));

  try {
    const anchor = (db.prepare(
      'SELECT created_at, spec_folder FROM memory_index WHERE id = ?',
    ) as Database.Statement).get(memoryId) as { created_at: string; spec_folder: string } | undefined;

    if (!anchor) return [];
    const anchorTimestampMs = Date.parse(anchor.created_at);
    if (!Number.isFinite(anchorTimestampMs)) {
      console.warn(`[temporal-contiguity] Invalid anchor timestamp for memory ${memoryId}: ${anchor.created_at}`);
      return [];
    }

    const lowerBound = formatBoundaryTimestamp(
      anchorTimestampMs - clampedWindow * 1000,
      anchor.created_at,
    );
    const upperBound = formatBoundaryTimestamp(
      anchorTimestampMs + clampedWindow * 1000,
      anchor.created_at,
    );

    const narrowedRows = (db.prepare(`
      SELECT *
        FROM memory_index
       WHERE id != ?
         AND spec_folder = ?
         AND created_at >= ?
         AND created_at <= ?
       ORDER BY created_at DESC
    `) as Database.Statement).all(
      memoryId,
      anchor.spec_folder,
      lowerBound,
      upperBound,
    ) as Array<{ created_at: string; [key: string]: unknown }>;

    const neighbors: Array<{ time_delta_seconds: number; [key: string]: unknown }> = [];
    for (const row of narrowedRows) {
      const createdAt = typeof row.created_at === 'string' ? row.created_at : String(row.created_at);
      const createdAtMs = Date.parse(createdAt);
      if (!Number.isFinite(createdAtMs)) {
        continue;
      }

      const timeDeltaSeconds = Math.abs(Math.trunc((createdAtMs - anchorTimestampMs) / 1000));
      if (timeDeltaSeconds > clampedWindow) {
        continue;
      }

      neighbors.push({
        ...row,
        time_delta_seconds: timeDeltaSeconds,
      });
    }

    neighbors.sort((left, right) => left.time_delta_seconds - right.time_delta_seconds);
    return neighbors;
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
