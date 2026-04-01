// ───────────────────────────────────────────────────────────────
// MODULE: Scoring Observability (T010)
// ───────────────────────────────────────────────────────────────
// Lightweight observability logging for TM-01 interference scoring
// values at query time.
// Sampled at 5% of queries to avoid performance overhead.
// All logging is best-effort (fail-safe, never throws).
// Feature flags:
// SPECKIT_INTERFERENCE_SCORE — TM-01 interference penalty
import type Database from 'better-sqlite3';

// Feature catalog: Scoring observability


// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** 5% sampling rate — logs ~1 in 20 scoring calls */
export const SAMPLING_RATE = 0.05;

// ───────────────────────────────────────────────────────────────
// 2. TYPES

// ───────────────────────────────────────────────────────────────
/** Full observation record for a single scored memory */
export interface ScoringObservation {
  memoryId: number;
  queryId: string;
  timestamp: string;
  memoryAgeDays: number;
  // TM-01 fields
  interferenceApplied: boolean;
  interferenceScore: number;
  interferencePenalty: number;
  // Composite
  scoreBeforeBoosts: number;
  scoreAfterBoosts: number;
  scoreDelta: number;
}

/** Aggregate stats returned by getScoringStats() */
export interface ScoringStats {
  totalObservations: number;
  avgInterferencePenalty: number;
  pctWithInterferencePenalty: number;
  avgScoreDelta: number;
}

// 3. DATABASE HANDLE (module-scoped, set via initScoringObservability)
let _db: Database.Database | null = null;

// ───────────────────────────────────────────────────────────────
// 3. INITIALIZATION

// ───────────────────────────────────────────────────────────────
/**
 * Initialize the scoring observability system.
 * Creates the scoring_observations table if it does not exist.
 * Call once at startup (after DB is available).
 * Fail-safe: any error is caught and logged; never throws.
 */
export function initScoringObservability(db: Database.Database): void {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS scoring_observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memory_id INTEGER,
        query_id TEXT,
        timestamp TEXT DEFAULT (datetime('now')),
        memory_age_days REAL DEFAULT 0,
        interference_applied INTEGER DEFAULT 0,
        interference_score REAL DEFAULT 0,
        interference_penalty REAL DEFAULT 0,
        score_before REAL,
        score_after REAL,
        score_delta REAL
      )
    `);
    // Only set _db after successful schema creation
    _db = db;
  } catch (e: unknown) {
    _db = null;
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[scoring-observability] initScoringObservability failed:', msg);
  }
}

// ───────────────────────────────────────────────────────────────
// 4. SAMPLING

// ───────────────────────────────────────────────────────────────
/**
 * Returns true approximately 5% of the time.
 * Uses Math.random() — no seeding, no state.
 */
export function shouldSample(): boolean {
  return Math.random() < SAMPLING_RATE;
}

// ───────────────────────────────────────────────────────────────
// 5. LOGGING

// ───────────────────────────────────────────────────────────────
/**
 * Persist a scoring observation to the DB.
 * Fail-safe: any error is logged via console.error (non-fatal).
 * Never modifies scoring behavior or return values.
 */
export function logScoringObservation(obs: ScoringObservation): void {
  if (!_db) return;
  try {
    _db.prepare(`
      INSERT INTO scoring_observations (
        memory_id, query_id, timestamp,
        memory_age_days,
        interference_applied, interference_score, interference_penalty,
        score_before, score_after, score_delta
      ) VALUES (
        ?, ?, ?,
        ?,
        ?, ?, ?,
        ?, ?, ?
      )
    `).run(
      obs.memoryId,
      obs.queryId,
      obs.timestamp,
      obs.memoryAgeDays,
      obs.interferenceApplied ? 1 : 0,
      obs.interferenceScore,
      obs.interferencePenalty,
      obs.scoreBeforeBoosts,
      obs.scoreAfterBoosts,
      obs.scoreDelta,
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[scoring-observability] logScoringObservation failed:', msg);
  }
}

// ───────────────────────────────────────────────────────────────
// 6. STATS QUERY

// ───────────────────────────────────────────────────────────────
/**
 * Aggregate stats over all logged scoring observations.
 * Returns zeros if table is empty or DB is unavailable.
 * Fail-safe: any error returns zero-value stats.
 */
export function getScoringStats(): ScoringStats {
  const empty: ScoringStats = {
    totalObservations: 0,
    avgInterferencePenalty: 0,
    pctWithInterferencePenalty: 0,
    avgScoreDelta: 0,
  };

  if (!_db) return empty;

  try {
    const row = _db.prepare(`
      SELECT
        COUNT(*) AS total,
        AVG(CASE WHEN interference_applied = 1 THEN interference_penalty ELSE NULL END) AS avg_interference_penalty,
        AVG(score_delta) AS avg_score_delta,
        SUM(interference_applied) AS tm01_count
      FROM scoring_observations
    `).get() as {
      total: number;
      avg_interference_penalty: number | null;
      avg_score_delta: number | null;
      tm01_count: number;
    } | undefined;

    if (!row || row.total === 0) return empty;

    return {
      totalObservations: row.total,
      avgInterferencePenalty: row.avg_interference_penalty ?? 0,
      pctWithInterferencePenalty: row.total > 0 ? (row.tm01_count / row.total) * 100 : 0,
      avgScoreDelta: row.avg_score_delta ?? 0,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[scoring-observability] getScoringStats failed:', msg);
    return empty;
  }
}

// 8. DB HANDLE ACCESSOR (for testing)
/** Return the current DB handle (may be null if not initialized). */
export function getDb(): Database.Database | null {
  return _db;
}

/** Reset the DB handle (for testing teardown). */
export function resetDb(): void {
  _db = null;
}
