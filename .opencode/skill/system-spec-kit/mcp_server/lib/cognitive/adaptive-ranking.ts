import type Database from 'better-sqlite3';

/**
 * Adaptive feedback channels that influence shadow ranking proposals.
 */
export type AdaptiveSignalType = 'access' | 'outcome' | 'correction';

/**
 * Stored adaptive feedback event for a single memory.
 */
export interface AdaptiveSignalEvent {
  memoryId: number;
  signalType: AdaptiveSignalType;
  signalValue?: number;
  query?: string | null;
  actor?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Ranking deltas for one memory under production and shadow scoring.
 */
export interface AdaptiveShadowProposalRow {
  memoryId: number;
  productionScore: number;
  shadowScore: number;
  productionRank: number;
  shadowRank: number;
  scoreDelta: number;
}

/**
 * Bounded shadow-ranking proposal derived from accumulated adaptive signals.
 */
export interface AdaptiveShadowProposal {
  mode: 'shadow' | 'promoted';
  bounded: boolean;
  maxDeltaApplied: number;
  query: string;
  rows: AdaptiveShadowProposalRow[];
  promotedIds: number[];
  demotedIds: number[];
}

const MAX_ADAPTIVE_DELTA = 0.08;
const MIN_SIGNALS_FOR_PROMOTION = 3;

function compareAdaptiveRows(
  a: Record<string, unknown> & { id: number },
  b: Record<string, unknown> & { id: number },
): number {
  const aScore = typeof a.score === 'number' && Number.isFinite(a.score) ? a.score : 0;
  const bScore = typeof b.score === 'number' && Number.isFinite(b.score) ? b.score : 0;
  if (bScore !== aScore) return bScore - aScore;

  const aSimilarity = typeof a.similarity === 'number' && Number.isFinite(a.similarity) ? a.similarity : 0;
  const bSimilarity = typeof b.similarity === 'number' && Number.isFinite(b.similarity) ? b.similarity : 0;
  if (bSimilarity !== aSimilarity) return bSimilarity - aSimilarity;

  return a.id - b.id;
}

function isAdaptiveEnabled(): boolean {
  return process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING === 'true'
    || process.env.SPECKIT_HYDRA_ADAPTIVE_RANKING === 'true';
}

/**
 * Resolve whether adaptive ranking is disabled, shadow-only, or promoted.
 *
 * @returns The effective adaptive-ranking mode.
 */
export function getAdaptiveMode(): 'shadow' | 'promoted' | 'disabled' {
  if (!isAdaptiveEnabled()) return 'disabled';
  const mode = process.env.SPECKIT_MEMORY_ADAPTIVE_MODE?.trim().toLowerCase();
  return mode === 'promoted' ? 'promoted' : 'shadow';
}

/**
 * Ensure the adaptive signal and shadow-run tables exist before use.
 *
 * @param database - Database connection that stores adaptive state.
 */
export function ensureAdaptiveTables(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS adaptive_signal_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      signal_type TEXT NOT NULL CHECK(signal_type IN ('access', 'outcome', 'correction')),
      signal_value REAL DEFAULT 1,
      query TEXT,
      actor TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS adaptive_shadow_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      mode TEXT NOT NULL,
      bounded INTEGER DEFAULT 1,
      max_delta_applied REAL DEFAULT 0,
      proposal_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Record an adaptive signal when the roadmap mode is enabled.
 *
 * @param database - Database connection that stores adaptive state.
 * @param event - Adaptive feedback event to persist.
 */
export function recordAdaptiveSignal(database: Database.Database, event: AdaptiveSignalEvent): void {
  if (getAdaptiveMode() === 'disabled') return;
  ensureAdaptiveTables(database);
  database.prepare(`
    INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, query, actor, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    event.memoryId,
    event.signalType,
    typeof event.signalValue === 'number' ? event.signalValue : 1,
    event.query ?? null,
    event.actor ?? null,
    event.metadata ? JSON.stringify(event.metadata) : null,
  );
}

/**
 * Clear adaptive signal history and shadow-run snapshots for rollback drills.
 *
 * @param database - Database connection that stores adaptive state.
 * @returns Counts for deleted signal and shadow-run rows.
 */
export function resetAdaptiveState(
  database: Database.Database,
): { clearedSignals: number; clearedRuns: number } {
  ensureAdaptiveTables(database);
  const clearedSignals = database.prepare('DELETE FROM adaptive_signal_events').run().changes;
  const clearedRuns = database.prepare('DELETE FROM adaptive_shadow_runs').run().changes;
  return {
    clearedSignals,
    clearedRuns,
  };
}

function getSignalDelta(database: Database.Database, memoryId: number): number {
  ensureAdaptiveTables(database);
  const rows = database.prepare(`
    SELECT signal_type, COUNT(*) AS count, COALESCE(SUM(signal_value), 0) AS total
    FROM adaptive_signal_events
    WHERE memory_id = ?
    GROUP BY signal_type
  `).all(memoryId) as Array<{ signal_type: AdaptiveSignalType; count: number; total: number }>;

  let accessTotal = 0;
  let outcomeTotal = 0;
  let correctionTotal = 0;
  for (const row of rows) {
    if (row.signal_type === 'access') accessTotal = row.total;
    if (row.signal_type === 'outcome') outcomeTotal = row.total;
    if (row.signal_type === 'correction') correctionTotal = row.total;
  }

  const rawDelta = (accessTotal * 0.005) + (outcomeTotal * 0.02) - (correctionTotal * 0.03);
  return Math.max(-MAX_ADAPTIVE_DELTA, Math.min(MAX_ADAPTIVE_DELTA, rawDelta));
}

/**
 * Build a bounded shadow-ranking proposal for a production result set.
 *
 * @param database - Database connection that stores adaptive state.
 * @param query - Query string associated with the evaluated result set.
 * @param results - Ranked production rows to evaluate in shadow mode.
 * @returns Shadow proposal when adaptive ranking is enabled; otherwise `null`.
 */
export function buildAdaptiveShadowProposal(
  database: Database.Database,
  query: string,
  results: Array<Record<string, unknown> & { id: number }>,
): AdaptiveShadowProposal | null {
  const mode = getAdaptiveMode();
  if (mode === 'disabled' || results.length === 0) return null;

  const production = results.map((row, index) => ({
    ...row,
    score: typeof row.score === 'number' && Number.isFinite(row.score)
      ? row.score
      : (typeof row.intentAdjustedScore === 'number' && Number.isFinite(row.intentAdjustedScore)
        ? row.intentAdjustedScore
        : 0),
    similarity: typeof row.similarity === 'number' && Number.isFinite(row.similarity) ? row.similarity : undefined,
    productionRank: index + 1,
  }));

  const shadow = production.map((row) => {
    const delta = getSignalDelta(database, row.id);
    return {
      ...row,
      shadowScore: Math.max(0, Math.min(1, row.score + delta)),
      scoreDelta: delta,
    };
  }).sort((a, b) => compareAdaptiveRows(
    { ...a, score: a.shadowScore } as Record<string, unknown> & { id: number },
    { ...b, score: b.shadowScore } as Record<string, unknown> & { id: number },
  ));

  const signalCounts = database.prepare(`
    SELECT memory_id, COUNT(*) AS total
    FROM adaptive_signal_events
    WHERE memory_id IN (${results.map(() => '?').join(', ')})
    GROUP BY memory_id
  `).all(...results.map((row) => row.id)) as Array<{ memory_id: number; total: number }>;
  const signalCountMap = new Map(signalCounts.map((row) => [row.memory_id, row.total]));

  const rows: AdaptiveShadowProposalRow[] = shadow.map((row, index) => ({
    memoryId: row.id,
    productionScore: row.score,
    shadowScore: row.shadowScore,
    productionRank: row.productionRank,
    shadowRank: index + 1,
    scoreDelta: row.scoreDelta,
  }));

  const promotedIds = rows
    .filter((row) => row.shadowRank < row.productionRank && (signalCountMap.get(row.memoryId) ?? 0) >= MIN_SIGNALS_FOR_PROMOTION)
    .map((row) => row.memoryId);
  const demotedIds = rows
    .filter((row) => row.shadowRank > row.productionRank && (signalCountMap.get(row.memoryId) ?? 0) >= MIN_SIGNALS_FOR_PROMOTION)
    .map((row) => row.memoryId);

  const proposal: AdaptiveShadowProposal = {
    mode,
    bounded: true,
    maxDeltaApplied: MAX_ADAPTIVE_DELTA,
    query,
    rows,
    promotedIds,
    demotedIds,
  };

  ensureAdaptiveTables(database);
  database.prepare(`
    INSERT INTO adaptive_shadow_runs (query, mode, bounded, max_delta_applied, proposal_json)
    VALUES (?, ?, ?, ?, ?)
  `).run(query, mode, 1, MAX_ADAPTIVE_DELTA, JSON.stringify(proposal));

  return proposal;
}
