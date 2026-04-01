// ───────────────────────────────────────────────────────────────
// MODULE: Adaptive Ranking
// ───────────────────────────────────────────────────────────────
// Feature catalog: Adaptive shadow ranking, bounded proposals, and rollback
// Shadow-mode adaptive ranking with bounded feedback loops,
// signal aggregation, threshold tuning, and promotion gates.
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

/** Immutable snapshot of bounded thresholds and signal weights governing adaptive ranking. */
export interface AdaptiveThresholdSnapshot {
  maxAdaptiveDelta: number;
  minSignalsForPromotion: number;
  signalWeights: Record<AdaptiveSignalType, number>;
}

/** Aggregate signal quality and rollout readiness metrics across stored adaptive events. */
export interface AdaptiveSignalQualitySummary {
  totalSignals: number;
  distinctMemories: number;
  promotionReadyMemories: number;
  shadowRunCount: number;
  latestShadowMode: 'shadow' | 'promoted' | null;
  weightedSignalScore: number;
  signalCounts: Record<AdaptiveSignalType, number>;
  signalTotals: Record<AdaptiveSignalType, number>;
}

/** Optional overrides for adaptive threshold tuning after evaluation. */
export interface AdaptiveThresholdOverrides {
  maxAdaptiveDelta?: number;
  minSignalsForPromotion?: number;
  signalWeights?: Partial<Record<AdaptiveSignalType, number>>;
}

/** Result of an adaptive threshold tuning pass with before/after snapshots. */
export interface AdaptiveThresholdTuningResult {
  summary: AdaptiveSignalQualitySummary;
  previous: AdaptiveThresholdSnapshot;
  next: AdaptiveThresholdSnapshot;
}

const MAX_ADAPTIVE_DELTA = 0.08;
const MIN_SIGNALS_FOR_PROMOTION = 3;
const ADAPTIVE_SIGNAL_WEIGHTS: Record<AdaptiveSignalType, number> = {
  access: 0.005,
  outcome: 0.02,
  correction: -0.03,
};
const DEFAULT_ADAPTIVE_THRESHOLDS: AdaptiveThresholdSnapshot = {
  maxAdaptiveDelta: MAX_ADAPTIVE_DELTA,
  minSignalsForPromotion: MIN_SIGNALS_FOR_PROMOTION,
  signalWeights: { ...ADAPTIVE_SIGNAL_WEIGHTS },
};
const MIN_ALLOWED_ADAPTIVE_DELTA = 0.02;
const MAX_ALLOWED_ADAPTIVE_DELTA = 0.12;
const MIN_ALLOWED_SIGNALS_FOR_PROMOTION = 1;
const MAX_ALLOWED_SIGNALS_FOR_PROMOTION = 8;

interface AdaptiveThresholdCacheEntry {
  config: AdaptiveThresholdSnapshot;
  updatedAt: string | null;
}

const adaptiveThresholdCache = new WeakMap<object, AdaptiveThresholdCacheEntry>();

interface AdaptiveThresholdRow {
  max_adaptive_delta: number;
  outcome_weight: number;
  correction_weight: number;
  access_weight: number;
  min_signals_for_promotion: number;
  updated_at?: string;
  last_tune_watermark?: string | null;
}

function getCachedThresholdForDb(database?: object): AdaptiveThresholdCacheEntry | undefined {
  if (!database) return undefined;
  return adaptiveThresholdCache.get(database);
}

function setCachedThresholdForDb(database: object, config: AdaptiveThresholdSnapshot, updatedAt: string | null): void {
  adaptiveThresholdCache.set(database, { config, updatedAt });
}

function parseAdaptiveTimestamp(value?: string | null): number | null {
  if (!value) return null;
  const normalizedValue = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const parsedValue = Date.parse(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function isCachedThresholdFresh(cachedUpdatedAt: string | null, persistedUpdatedAt: string | null): boolean {
  if (!persistedUpdatedAt) {
    return cachedUpdatedAt === null;
  }
  if (!cachedUpdatedAt) {
    return false;
  }

  const cachedMillis = parseAdaptiveTimestamp(cachedUpdatedAt);
  const persistedMillis = parseAdaptiveTimestamp(persistedUpdatedAt);
  if (cachedMillis === null || persistedMillis === null) {
    return cachedUpdatedAt === persistedUpdatedAt;
  }
  return persistedMillis <= cachedMillis;
}

function mapAdaptiveThresholdRowToSnapshot(row: AdaptiveThresholdRow): AdaptiveThresholdSnapshot {
  return mergeAdaptiveThresholds({
    maxAdaptiveDelta: row.max_adaptive_delta,
    minSignalsForPromotion: row.min_signals_for_promotion,
    signalWeights: {
      access: row.access_weight,
      outcome: row.outcome_weight,
      correction: row.correction_weight,
    },
  });
}

function mergeAdaptiveThresholds(overrides: AdaptiveThresholdOverrides = {}): AdaptiveThresholdSnapshot {
  return {
    maxAdaptiveDelta: clampAdaptiveDelta(overrides.maxAdaptiveDelta ?? DEFAULT_ADAPTIVE_THRESHOLDS.maxAdaptiveDelta),
    minSignalsForPromotion: clampSignalThreshold(
      overrides.minSignalsForPromotion ?? DEFAULT_ADAPTIVE_THRESHOLDS.minSignalsForPromotion,
    ),
    signalWeights: {
      access: roundAdaptiveNumber(overrides.signalWeights?.access ?? DEFAULT_ADAPTIVE_THRESHOLDS.signalWeights.access),
      outcome: roundAdaptiveNumber(
        overrides.signalWeights?.outcome ?? DEFAULT_ADAPTIVE_THRESHOLDS.signalWeights.outcome,
      ),
      correction: roundAdaptiveNumber(
        overrides.signalWeights?.correction ?? DEFAULT_ADAPTIVE_THRESHOLDS.signalWeights.correction,
      ),
    },
  };
}

function isAdaptiveFlagEnabled(...flagNames: string[]): boolean {
  for (const flagName of flagNames) {
    const rawValue = process.env[flagName]?.trim().toLowerCase();
    if (rawValue === 'false' || rawValue === '0') {
      return false;
    }
    if (rawValue === 'true' || rawValue === '1') {
      return true;
    }
  }
  return false;
}

function roundAdaptiveNumber(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clampAdaptiveDelta(value: number): number {
  return roundAdaptiveNumber(Math.max(MIN_ALLOWED_ADAPTIVE_DELTA, Math.min(MAX_ALLOWED_ADAPTIVE_DELTA, value)));
}

function clampSignalThreshold(value: number): number {
  return Math.max(
    MIN_ALLOWED_SIGNALS_FOR_PROMOTION,
    Math.min(MAX_ALLOWED_SIGNALS_FOR_PROMOTION, Math.trunc(value)),
  );
}

function getAdaptiveThresholdMetadata(
  database: Database.Database,
): { updatedAt: string | null; lastTuneWatermark: string | null } {
  const metadataRow = database.prepare(`
    SELECT updated_at, last_tune_watermark
    FROM adaptive_thresholds
    WHERE id = 1
  `).get() as { updated_at?: string; last_tune_watermark?: string | null } | undefined;

  return {
    updatedAt: metadataRow?.updated_at ?? null,
    lastTuneWatermark: metadataRow?.last_tune_watermark ?? null,
  };
}

function persistAdaptiveThresholdConfig(
  database: Database.Database,
  config: AdaptiveThresholdSnapshot,
  options: { lastTuneWatermark?: string | null } = {},
): AdaptiveThresholdSnapshot {
  ensureAdaptiveTables(database);
  const updatedAt = new Date().toISOString();
  const lastTuneWatermark = options.lastTuneWatermark ?? null;

  database.prepare(`
    INSERT INTO adaptive_thresholds (
      id,
      max_adaptive_delta,
      outcome_weight,
      correction_weight,
      access_weight,
      min_signals_for_promotion,
      updated_at,
      last_tune_watermark
    )
    VALUES (1, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      max_adaptive_delta = excluded.max_adaptive_delta,
      outcome_weight = excluded.outcome_weight,
      correction_weight = excluded.correction_weight,
      access_weight = excluded.access_weight,
      min_signals_for_promotion = excluded.min_signals_for_promotion,
      updated_at = excluded.updated_at,
      last_tune_watermark = COALESCE(excluded.last_tune_watermark, adaptive_thresholds.last_tune_watermark)
  `).run(
    config.maxAdaptiveDelta,
    config.signalWeights.outcome,
    config.signalWeights.correction,
    config.signalWeights.access,
    config.minSignalsForPromotion,
    updatedAt,
    lastTuneWatermark,
  );

  setCachedThresholdForDb(database, config, updatedAt);
  return config;
}

function getAdaptiveThresholdConfig(database?: Database.Database): AdaptiveThresholdSnapshot {
  if (!database) {
    return mergeAdaptiveThresholds();
  }

  ensureAdaptiveTables(database);
  const cachedThreshold = getCachedThresholdForDb(database);
  if (cachedThreshold) {
    const { updatedAt } = getAdaptiveThresholdMetadata(database);
    if (isCachedThresholdFresh(cachedThreshold.updatedAt, updatedAt)) {
      return cachedThreshold.config;
    }
  }

  const persistedRow = database.prepare(`
    SELECT
      max_adaptive_delta,
      outcome_weight,
      correction_weight,
      access_weight,
      min_signals_for_promotion,
      updated_at,
      last_tune_watermark
    FROM adaptive_thresholds
    WHERE id = 1
  `).get() as AdaptiveThresholdRow | undefined;

  if (!persistedRow) {
    const defaultThresholds = mergeAdaptiveThresholds();
    setCachedThresholdForDb(database, defaultThresholds, null);
    return defaultThresholds;
  }

  const persistedThresholds = mapAdaptiveThresholdRowToSnapshot(persistedRow);
  setCachedThresholdForDb(database, persistedThresholds, persistedRow.updated_at ?? null);
  return persistedThresholds;
}

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

  // Use relational comparison instead of subtraction so very large integer ids stay deterministic above 2^53.
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function isAdaptiveEnabled(): boolean {
  return isAdaptiveFlagEnabled(
    'SPECKIT_MEMORY_ADAPTIVE_RANKING',
    'SPECKIT_HYDRA_ADAPTIVE_RANKING',
  );
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
    CREATE TABLE IF NOT EXISTS adaptive_thresholds (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      max_adaptive_delta REAL NOT NULL,
      outcome_weight REAL NOT NULL,
      correction_weight REAL NOT NULL,
      access_weight REAL NOT NULL,
      min_signals_for_promotion INTEGER NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_tune_watermark TEXT
    )
  `);

  const thresholdColumns = database.prepare(`PRAGMA table_info(adaptive_thresholds)`).all() as Array<{ name: string }>;
  if (!thresholdColumns.some((column) => column.name === 'last_tune_watermark')) {
    database.exec('ALTER TABLE adaptive_thresholds ADD COLUMN last_tune_watermark TEXT');
  }

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
  database.exec(
    'CREATE INDEX IF NOT EXISTS idx_adaptive_signal_events_memory_type ON adaptive_signal_events(memory_id, signal_type)',
  );
}

/**
 * Record an adaptive signal when the roadmap mode is enabled.
 *
 * @param database - Database connection that stores adaptive state.
 * @param event - Adaptive feedback event to persist.
 */
export function recordAdaptiveSignal(database: Database.Database, event: AdaptiveSignalEvent): void {
  if (getAdaptiveMode() === 'disabled') return;
  if (typeof event.signalValue === 'number') {
    if (!Number.isFinite(event.signalValue) || event.signalValue <= 0) {
      return;
    }
  }
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
  // B17: Wrap both DELETEs in a transaction for atomicity.
  const resetTx = database.transaction(() => {
    const clearedSignals = database.prepare('DELETE FROM adaptive_signal_events').run().changes;
    const clearedRuns = database.prepare('DELETE FROM adaptive_shadow_runs').run().changes;
    database.prepare(`
      UPDATE adaptive_thresholds
      SET last_tune_watermark = NULL
      WHERE id = 1
    `).run();
    return { clearedSignals, clearedRuns };
  });
  return resetTx();
}

/**
 * Apply resettable adaptive-threshold overrides after evaluation.
 *
 * @param overrides - Optional threshold and weight overrides to apply.
 * @returns Effective adaptive threshold snapshot after the update.
 */
export function setAdaptiveThresholdOverrides(
  overrides: AdaptiveThresholdOverrides = {},
  database?: Database.Database,
): AdaptiveThresholdSnapshot {
  // H4 FIX: Warn when called without a database, as overrides won't persist
  if (!database) {
    console.warn('[adaptive-ranking] setAdaptiveThresholdOverrides called without database — overrides will not persist');
  }
  const nextOverrides: AdaptiveThresholdOverrides = {
    maxAdaptiveDelta: typeof overrides.maxAdaptiveDelta === 'number' && Number.isFinite(overrides.maxAdaptiveDelta)
      ? overrides.maxAdaptiveDelta
      : undefined,
    minSignalsForPromotion:
      typeof overrides.minSignalsForPromotion === 'number' && Number.isFinite(overrides.minSignalsForPromotion)
        ? overrides.minSignalsForPromotion
        : undefined,
    signalWeights: overrides.signalWeights
      ? {
          access:
            typeof overrides.signalWeights.access === 'number' && Number.isFinite(overrides.signalWeights.access)
              ? overrides.signalWeights.access
              : undefined,
          outcome:
            typeof overrides.signalWeights.outcome === 'number' && Number.isFinite(overrides.signalWeights.outcome)
              ? overrides.signalWeights.outcome
              : undefined,
          correction:
            typeof overrides.signalWeights.correction === 'number' && Number.isFinite(overrides.signalWeights.correction)
              ? overrides.signalWeights.correction
              : undefined,
        }
      : undefined,
  };
  const nextThresholds = mergeAdaptiveThresholds(nextOverrides);
  if (database) {
    persistAdaptiveThresholdConfig(database, nextThresholds);
  }
  return nextThresholds;
}

/**
 * Clear adaptive-threshold tuning and restore the default bounded configuration.
 *
 * @returns Default adaptive threshold snapshot.
 */
export function resetAdaptiveThresholdOverrides(database?: Database.Database): AdaptiveThresholdSnapshot {
  if (database) {
    ensureAdaptiveTables(database);
    adaptiveThresholdCache.delete(database);
    database.prepare('DELETE FROM adaptive_thresholds WHERE id = 1').run();
  }
  return getAdaptiveThresholdConfig(database);
}

/**
 * Snapshot the bounded thresholds and signal weights that govern adaptive ranking.
 *
 * @returns Immutable adaptive threshold configuration for diagnostics.
 */
export function getAdaptiveThresholdSnapshot(database?: Database.Database): AdaptiveThresholdSnapshot {
  return getAdaptiveThresholdConfig(database);
}

/**
 * Summarize adaptive signal quality and rollout readiness across stored events.
 *
 * @param database - Database connection that stores adaptive state.
 * @returns Aggregate signal counts, totals, and shadow-run coverage.
 */
export function summarizeAdaptiveSignalQuality(
  database: Database.Database,
): AdaptiveSignalQualitySummary {
  ensureAdaptiveTables(database);
  const thresholds = getAdaptiveThresholdConfig(database);

  const signalCounts: Record<AdaptiveSignalType, number> = {
    access: 0,
    outcome: 0,
    correction: 0,
  };
  const signalTotals: Record<AdaptiveSignalType, number> = {
    access: 0,
    outcome: 0,
    correction: 0,
  };

  const signalRows = database.prepare(`
    SELECT signal_type, COUNT(*) AS count, COALESCE(SUM(signal_value), 0) AS total
    FROM adaptive_signal_events
    GROUP BY signal_type
  `).all() as Array<{ signal_type: AdaptiveSignalType; count: number; total: number }>;

  let totalSignals = 0;
  let weightedSignalScore = 0;
  for (const row of signalRows) {
    signalCounts[row.signal_type] = row.count;
    signalTotals[row.signal_type] = row.total;
    totalSignals += row.count;
    weightedSignalScore += row.total * thresholds.signalWeights[row.signal_type];
  }

  const distinctMemoriesRow = database.prepare(`
    SELECT COUNT(DISTINCT memory_id) AS count
    FROM adaptive_signal_events
  `).get() as { count?: number } | undefined;
  const promotionReadyRow = database.prepare(`
    SELECT COUNT(*) AS count
    FROM (
      SELECT memory_id
      FROM adaptive_signal_events
      GROUP BY memory_id
      HAVING COUNT(*) >= ?
    )
  `).get(thresholds.minSignalsForPromotion) as { count?: number } | undefined;
  const shadowRunCountRow = database.prepare(`
    SELECT COUNT(*) AS count
    FROM adaptive_shadow_runs
  `).get() as { count?: number } | undefined;
  const latestShadowRun = database.prepare(`
    SELECT mode
    FROM adaptive_shadow_runs
    ORDER BY id DESC
    LIMIT 1
  `).get() as { mode?: string } | undefined;

  return {
    totalSignals,
    distinctMemories: typeof distinctMemoriesRow?.count === 'number' ? distinctMemoriesRow.count : 0,
    promotionReadyMemories: typeof promotionReadyRow?.count === 'number' ? promotionReadyRow.count : 0,
    shadowRunCount: typeof shadowRunCountRow?.count === 'number' ? shadowRunCountRow.count : 0,
    latestShadowMode: latestShadowRun?.mode === 'shadow' || latestShadowRun?.mode === 'promoted'
      ? latestShadowRun.mode
      : null,
    weightedSignalScore,
    signalCounts,
    signalTotals,
  };
}

/**
 * Tune adaptive thresholds after reviewing the current shadow signal set.
 *
 * @param database - Database connection that stores adaptive state.
 * @returns Previous and next threshold snapshots plus the summary that drove the tuning.
 */
export function tuneAdaptiveThresholdsAfterEvaluation(
  database: Database.Database,
  gateResult?: {
    ready?: boolean;
    consecutiveWeeks?: number;
    recommendation?: string;
  },
): AdaptiveThresholdTuningResult {
  ensureAdaptiveTables(database);
  const previous = getAdaptiveThresholdConfig(database);
  const signalCount = database.prepare(`
    SELECT COUNT(*) AS cnt
    FROM adaptive_signal_events
  `).get() as { cnt?: number } | undefined;
  const gateKey = gateResult?.recommendation ?? 'none';
  const watermark = `${signalCount?.cnt ?? 0}:${gateKey}`;
  const metadata = getAdaptiveThresholdMetadata(database);
  const summary = summarizeAdaptiveSignalQuality(database);

  if (metadata.lastTuneWatermark === watermark) {
    return {
      summary,
      previous,
      next: previous,
    };
  }

  let nextMinSignals = previous.minSignalsForPromotion;
  let nextMaxAdaptiveDelta = previous.maxAdaptiveDelta;
  const nextSignalWeights = { ...previous.signalWeights };
  const relaxationMultiplier = gateResult?.recommendation === 'promote' ? 1.5 : 1;

  // B16: Per-evaluation signal weight adjustment is clamped to ±0.05 from defaults.
  const WEIGHT_CLAMP_RANGE = 0.05;
  const clampWeight = (key: AdaptiveSignalType, value: number): number =>
    roundAdaptiveNumber(Math.max(
      ADAPTIVE_SIGNAL_WEIGHTS[key] - WEIGHT_CLAMP_RANGE,
      Math.min(ADAPTIVE_SIGNAL_WEIGHTS[key] + WEIGHT_CLAMP_RANGE, value),
    ));

  const hasStrongSignals = (
    summary.totalSignals >= previous.minSignalsForPromotion * 2
    && summary.weightedSignalScore >= 0.04
    && summary.distinctMemories >= 2
  );
  const shouldRelaxThresholds = gateResult?.ready === true || gateResult?.recommendation === 'promote' || hasStrongSignals;
  const shouldTightenThresholds = gateResult != null
    ? !shouldRelaxThresholds
    : summary.totalSignals < previous.minSignalsForPromotion * 2;

  if (shouldRelaxThresholds) {
    nextMinSignals = Math.max(2, previous.minSignalsForPromotion - 1);
    nextMaxAdaptiveDelta = clampAdaptiveDelta(previous.maxAdaptiveDelta + (0.02 * relaxationMultiplier));
    nextSignalWeights.outcome = clampWeight(
      'outcome',
      previous.signalWeights.outcome + (0.005 * relaxationMultiplier),
    );
  } else if (shouldTightenThresholds) {
    nextMinSignals = clampSignalThreshold(previous.minSignalsForPromotion + 1);
    nextMaxAdaptiveDelta = clampAdaptiveDelta(previous.maxAdaptiveDelta - 0.02);
    nextSignalWeights.correction = clampWeight('correction', previous.signalWeights.correction - 0.005);
  }

  const next = persistAdaptiveThresholdConfig(
    database,
    mergeAdaptiveThresholds({
      maxAdaptiveDelta: nextMaxAdaptiveDelta,
      minSignalsForPromotion: nextMinSignals,
      signalWeights: nextSignalWeights,
    }),
    { lastTuneWatermark: watermark },
  );

  return {
    summary,
    previous,
    next,
  };
}

function getSignalDeltas(database: Database.Database, memoryIds: readonly number[]): Map<number, number> {
  ensureAdaptiveTables(database);
  if (memoryIds.length === 0) {
    return new Map();
  }

  const thresholds = getAdaptiveThresholdConfig(database);
  const rows = database.prepare(`
    SELECT memory_id, signal_type, COALESCE(SUM(signal_value), 0) AS total
    FROM adaptive_signal_events
    WHERE memory_id IN (${memoryIds.map(() => '?').join(', ')})
    GROUP BY memory_id, signal_type
  `).all(...memoryIds) as Array<{ memory_id: number; signal_type: AdaptiveSignalType; total: number }>;

  const totalsByMemory = new Map<number, Record<AdaptiveSignalType, number>>();
  for (const row of rows) {
    const memoryTotals = totalsByMemory.get(row.memory_id) ?? {
      access: 0,
      outcome: 0,
      correction: 0,
    };
    memoryTotals[row.signal_type] = row.total;
    totalsByMemory.set(row.memory_id, memoryTotals);
  }

  const deltaMap = new Map<number, number>();
  for (const memoryId of memoryIds) {
    const totals = totalsByMemory.get(memoryId);
    if (!totals) continue;

    const rawDelta =
      (totals.access * thresholds.signalWeights.access) +
      (totals.outcome * thresholds.signalWeights.outcome) +
      (totals.correction * thresholds.signalWeights.correction);
    deltaMap.set(memoryId, Math.max(-thresholds.maxAdaptiveDelta, Math.min(thresholds.maxAdaptiveDelta, rawDelta)));
  }

  return deltaMap;
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
  const thresholds = getAdaptiveThresholdConfig(database);
  const signalDeltaMap = getSignalDeltas(database, results.map((row) => row.id));

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
    const delta = signalDeltaMap.get(row.id) ?? 0;
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
    .filter(
      (row) => row.shadowRank < row.productionRank
        && (signalCountMap.get(row.memoryId) ?? 0) >= thresholds.minSignalsForPromotion,
    )
    .map((row) => row.memoryId);
  const demotedIds = rows
    .filter(
      (row) => row.shadowRank > row.productionRank
        && (signalCountMap.get(row.memoryId) ?? 0) >= thresholds.minSignalsForPromotion,
    )
    .map((row) => row.memoryId);

  const proposal: AdaptiveShadowProposal = {
    mode,
    bounded: true,
    maxDeltaApplied: thresholds.maxAdaptiveDelta,
    query,
    rows,
    promotedIds,
    demotedIds,
  };

  // B18: Wrap signal reads + proposal write in a transaction for consistency.
  // B19: Retain only the last 50 shadow runs.
  ensureAdaptiveTables(database);
  const persistProposalTx = database.transaction(() => {
    database.prepare(`
      INSERT INTO adaptive_shadow_runs (query, mode, bounded, max_delta_applied, proposal_json)
      VALUES (?, ?, ?, ?, ?)
    `).run(query, mode, 1, thresholds.maxAdaptiveDelta, JSON.stringify(proposal));

    // B19: Retention — keep only the last 50 shadow run rows.
    database.prepare(`
      DELETE FROM adaptive_shadow_runs
      WHERE id NOT IN (
        SELECT id FROM adaptive_shadow_runs ORDER BY id DESC LIMIT 50
      )
    `).run();
  });
  persistProposalTx();

  return proposal;
}
