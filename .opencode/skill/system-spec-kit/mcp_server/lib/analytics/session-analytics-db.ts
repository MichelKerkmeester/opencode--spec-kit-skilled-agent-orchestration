// ───────────────────────────────────────────────────────────────
// MODULE: Session Analytics Db
// ───────────────────────────────────────────────────────────────
// Reader-owned normalized analytics store for replaying Stop-hook
// producer metadata into queryable session and turn tables.

import * as fs from 'node:fs';
import * as path from 'node:path';

import Database from 'better-sqlite3';

import { DATABASE_DIR } from '../../core/config.js';
import { parseTranscriptTurns, type TranscriptTurn } from '../../hooks/claude/claude-transcript.js';
import type { HookState } from '../../hooks/claude/hook-state.js';

export const SESSION_ANALYTICS_DB_FILENAME = 'speckit-session-analytics.db';

const CACHE_WRITE_MULTIPLIER = 1.25;
const CACHE_READ_MULTIPLIER = 0.1;

interface SeedModelPricingRow {
  pricing_key: string;
  model_family: string;
  match_pattern: string;
  effective_from: string;
  effective_to: string | null;
  prompt_price_per_million_usd: number;
  completion_price_per_million_usd: number;
  cache_write_price_per_million_usd: number;
  cache_read_price_per_million_usd: number;
  source: string;
  notes: string;
}

const SEEDED_MODEL_PRICING_ROWS: SeedModelPricingRow[] = [
  {
    pricing_key: 'claude-opus-family-default',
    model_family: 'opus',
    match_pattern: 'opus',
    effective_from: '2026-04-08T00:00:00.000Z',
    effective_to: null,
    prompt_price_per_million_usd: 15,
    completion_price_per_million_usd: 75,
    cache_write_price_per_million_usd: 15 * CACHE_WRITE_MULTIPLIER,
    cache_read_price_per_million_usd: 15 * CACHE_READ_MULTIPLIER,
    source: 'hooks/claude/claude-transcript.ts',
    notes: 'Mirrors existing family-level estimateCost() prompt/output rates with cache multipliers applied.',
  },
  {
    pricing_key: 'claude-sonnet-family-default',
    model_family: 'sonnet',
    match_pattern: 'sonnet',
    effective_from: '2026-04-08T00:00:00.000Z',
    effective_to: null,
    prompt_price_per_million_usd: 3,
    completion_price_per_million_usd: 15,
    cache_write_price_per_million_usd: 3 * CACHE_WRITE_MULTIPLIER,
    cache_read_price_per_million_usd: 3 * CACHE_READ_MULTIPLIER,
    source: 'hooks/claude/claude-transcript.ts',
    notes: 'Mirrors existing family-level estimateCost() prompt/output rates with cache multipliers applied.',
  },
  {
    pricing_key: 'claude-haiku-family-default',
    model_family: 'haiku',
    match_pattern: 'haiku',
    effective_from: '2026-04-08T00:00:00.000Z',
    effective_to: null,
    prompt_price_per_million_usd: 0.25,
    completion_price_per_million_usd: 1.25,
    cache_write_price_per_million_usd: 0.25 * CACHE_WRITE_MULTIPLIER,
    cache_read_price_per_million_usd: 0.25 * CACHE_READ_MULTIPLIER,
    source: 'hooks/claude/claude-transcript.ts',
    notes: 'Mirrors existing family-level estimateCost() prompt/output rates with cache multipliers applied.',
  },
];

const SEEDED_CACHE_TIER_ROWS = [
  {
    cache_tier: 'cache_write',
    source_field: 'cache_creation_input_tokens',
    description: 'Normalized cache-write tier sourced from Claude transcript cache creation tokens.',
  },
  {
    cache_tier: 'cache_read',
    source_field: 'cache_read_input_tokens',
    description: 'Normalized cache-read tier sourced from Claude transcript cache read tokens.',
  },
] as const;

const SESSION_ANALYTICS_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS analytics_sessions (
    claude_session_id TEXT PRIMARY KEY,
    speckit_session_id TEXT,
    transcript_path TEXT,
    transcript_fingerprint TEXT,
    transcript_size_bytes INTEGER NOT NULL DEFAULT 0,
    transcript_modified_at TEXT,
    last_claude_turn_at TEXT,
    last_replay_offset INTEGER NOT NULL DEFAULT 0,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    cache_creation_input_tokens INTEGER NOT NULL DEFAULT 0,
    cache_read_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    prompt_cost_usd REAL NOT NULL DEFAULT 0,
    completion_cost_usd REAL NOT NULL DEFAULT 0,
    cache_creation_cost_usd REAL NOT NULL DEFAULT 0,
    cache_read_cost_usd REAL NOT NULL DEFAULT 0,
    estimated_total_cost_usd REAL NOT NULL DEFAULT 0,
    turn_count INTEGER NOT NULL DEFAULT 0,
    last_spec_folder TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS analytics_turns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claude_session_id TEXT NOT NULL,
    transcript_path TEXT NOT NULL,
    line_no INTEGER NOT NULL,
    byte_start INTEGER NOT NULL,
    byte_end INTEGER NOT NULL,
    role TEXT NOT NULL,
    model TEXT,
    pricing_key TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    cache_creation_input_tokens INTEGER NOT NULL DEFAULT 0,
    cache_read_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    prompt_cost_usd REAL NOT NULL DEFAULT 0,
    completion_cost_usd REAL NOT NULL DEFAULT 0,
    cache_creation_cost_usd REAL NOT NULL DEFAULT 0,
    cache_read_cost_usd REAL NOT NULL DEFAULT 0,
    estimated_total_cost_usd REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(claude_session_id, transcript_path, byte_start)
  );

  CREATE TABLE IF NOT EXISTS model_pricing_versioned (
    pricing_key TEXT PRIMARY KEY,
    model_family TEXT NOT NULL,
    match_pattern TEXT NOT NULL,
    effective_from TEXT NOT NULL,
    effective_to TEXT,
    prompt_price_per_million_usd REAL NOT NULL,
    completion_price_per_million_usd REAL NOT NULL,
    cache_write_price_per_million_usd REAL NOT NULL,
    cache_read_price_per_million_usd REAL NOT NULL,
    source TEXT NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS cache_tier_normalized (
    cache_tier TEXT PRIMARY KEY,
    source_field TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_analytics_turns_session
    ON analytics_turns (claude_session_id, transcript_path, line_no);
`;

let analyticsDb: Database.Database | null = null;
let analyticsDbPath: string | null = null;

export interface SessionAnalyticsSessionRow {
  claude_session_id: string;
  speckit_session_id: string | null;
  transcript_path: string | null;
  transcript_fingerprint: string | null;
  transcript_size_bytes: number;
  transcript_modified_at: string | null;
  last_claude_turn_at: string | null;
  last_replay_offset: number;
  prompt_tokens: number;
  completion_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  total_tokens: number;
  prompt_cost_usd: number;
  completion_cost_usd: number;
  cache_creation_cost_usd: number;
  cache_read_cost_usd: number;
  estimated_total_cost_usd: number;
  turn_count: number;
  last_spec_folder: string | null;
  updated_at: string;
}

export interface SessionAnalyticsTurnRow {
  id: number;
  claude_session_id: string;
  transcript_path: string;
  line_no: number;
  byte_start: number;
  byte_end: number;
  role: string;
  model: string | null;
  pricing_key: string;
  prompt_tokens: number;
  completion_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  total_tokens: number;
  prompt_cost_usd: number;
  completion_cost_usd: number;
  cache_creation_cost_usd: number;
  cache_read_cost_usd: number;
  estimated_total_cost_usd: number;
  created_at: string;
}

export interface SessionAnalyticsModelPricingRow {
  pricing_key: string;
  model_family: string;
  match_pattern: string;
  effective_from: string;
  effective_to: string | null;
  prompt_price_per_million_usd: number;
  completion_price_per_million_usd: number;
  cache_write_price_per_million_usd: number;
  cache_read_price_per_million_usd: number;
  source: string;
  notes: string | null;
}

export interface SessionAnalyticsCacheTierRow {
  cache_tier: string;
  source_field: string;
  description: string;
}

export interface SessionAnalyticsIngestResult {
  sessionUpserted: boolean;
  insertedTurns: number;
  session: SessionAnalyticsSessionRow;
}

interface TurnCostBreakdown {
  pricingKey: string;
  promptCostUsd: number;
  completionCostUsd: number;
  cacheCreationCostUsd: number;
  cacheReadCostUsd: number;
  estimatedTotalCostUsd: number;
}

function resolveAnalyticsDbPath(dataDir?: string): string {
  const resolvedDir = dataDir || DATABASE_DIR;
  return path.join(resolvedDir, SESSION_ANALYTICS_DB_FILENAME);
}

function roundUsd(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function ensureSeedData(db: Database.Database): void {
  const insertPricing = db.prepare(`
    INSERT OR IGNORE INTO model_pricing_versioned (
      pricing_key,
      model_family,
      match_pattern,
      effective_from,
      effective_to,
      prompt_price_per_million_usd,
      completion_price_per_million_usd,
      cache_write_price_per_million_usd,
      cache_read_price_per_million_usd,
      source,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `) as Database.Statement;

  const insertCacheTier = db.prepare(`
    INSERT OR IGNORE INTO cache_tier_normalized (
      cache_tier,
      source_field,
      description
    ) VALUES (?, ?, ?)
  `) as Database.Statement;

  const tx = db.transaction(() => {
    for (const row of SEEDED_MODEL_PRICING_ROWS) {
      insertPricing.run(
        row.pricing_key,
        row.model_family,
        row.match_pattern,
        row.effective_from,
        row.effective_to,
        row.prompt_price_per_million_usd,
        row.completion_price_per_million_usd,
        row.cache_write_price_per_million_usd,
        row.cache_read_price_per_million_usd,
        row.source,
        row.notes,
      );
    }

    for (const row of SEEDED_CACHE_TIER_ROWS) {
      insertCacheTier.run(row.cache_tier, row.source_field, row.description);
    }
  });

  tx();
}

function selectPricingForModel(model: string | null): SessionAnalyticsModelPricingRow {
  const normalizedModel = (model ?? '').toLowerCase();
  const matchedSeed = SEEDED_MODEL_PRICING_ROWS.find((row) => normalizedModel.includes(row.match_pattern))
    ?? SEEDED_MODEL_PRICING_ROWS.find((row) => row.model_family === 'sonnet');

  if (!matchedSeed) {
    throw new Error('[session-analytics-db] Seeded model pricing is missing a sonnet fallback');
  }

  return matchedSeed;
}

function computeTurnCost(turn: TranscriptTurn): TurnCostBreakdown {
  const pricing = selectPricingForModel(turn.model);
  const promptCostUsd = roundUsd((turn.promptTokens / 1_000_000) * pricing.prompt_price_per_million_usd);
  const completionCostUsd = roundUsd((turn.completionTokens / 1_000_000) * pricing.completion_price_per_million_usd);
  const cacheCreationCostUsd = roundUsd((turn.cacheCreationTokens / 1_000_000) * pricing.cache_write_price_per_million_usd);
  const cacheReadCostUsd = roundUsd((turn.cacheReadTokens / 1_000_000) * pricing.cache_read_price_per_million_usd);

  return {
    pricingKey: pricing.pricing_key,
    promptCostUsd,
    completionCostUsd,
    cacheCreationCostUsd,
    cacheReadCostUsd,
    estimatedTotalCostUsd: roundUsd(promptCostUsd + completionCostUsd + cacheCreationCostUsd + cacheReadCostUsd),
  };
}

export function initSessionAnalyticsDb(dataDir?: string): Database.Database {
  const dbPath = resolveAnalyticsDbPath(dataDir);

  if (analyticsDb && analyticsDbPath === dbPath) {
    return analyticsDb;
  }

  if (analyticsDb) {
    try {
      analyticsDb.close();
    } catch (err) {
      console.warn('[session-analytics-db] close-before-switch warning:', err instanceof Error ? err.message : String(err));
    }
    analyticsDb = null;
    analyticsDbPath = null;
  }

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 5000');
  db.pragma('foreign_keys = ON');
  db.exec(SESSION_ANALYTICS_SCHEMA_SQL);
  ensureSeedData(db);

  analyticsDb = db;
  analyticsDbPath = dbPath;
  return db;
}

export function getSessionAnalyticsDb(): Database.Database {
  if (!analyticsDb) {
    throw new Error('[session-analytics-db] Database not initialized. Call initSessionAnalyticsDb() first.');
  }
  return analyticsDb;
}

export function getSessionAnalyticsDbPath(): string | null {
  return analyticsDbPath;
}

export function closeSessionAnalyticsDb(): void {
  if (analyticsDb) {
    try {
      analyticsDb.close();
    } catch (err) {
      console.warn('[session-analytics-db] close warning:', err instanceof Error ? err.message : String(err));
    }
    analyticsDb = null;
    analyticsDbPath = null;
  }
}

function getSessionRow(db: Database.Database, claudeSessionId: string): SessionAnalyticsSessionRow {
  const row = (db.prepare(`
    SELECT *
    FROM analytics_sessions
    WHERE claude_session_id = ?
  `) as Database.Statement).get(claudeSessionId) as SessionAnalyticsSessionRow | undefined;

  if (!row) {
    throw new Error(`[session-analytics-db] Session row missing after upsert for ${claudeSessionId}`);
  }

  return row;
}

function recomputeSessionAggregates(
  db: Database.Database,
  claudeSessionId: string,
): void {
  const aggregate = (db.prepare(`
    SELECT
      COALESCE(SUM(prompt_tokens), 0) AS prompt_tokens,
      COALESCE(SUM(completion_tokens), 0) AS completion_tokens,
      COALESCE(SUM(cache_creation_input_tokens), 0) AS cache_creation_input_tokens,
      COALESCE(SUM(cache_read_input_tokens), 0) AS cache_read_input_tokens,
      COALESCE(SUM(total_tokens), 0) AS total_tokens,
      COALESCE(SUM(prompt_cost_usd), 0) AS prompt_cost_usd,
      COALESCE(SUM(completion_cost_usd), 0) AS completion_cost_usd,
      COALESCE(SUM(cache_creation_cost_usd), 0) AS cache_creation_cost_usd,
      COALESCE(SUM(cache_read_cost_usd), 0) AS cache_read_cost_usd,
      COALESCE(SUM(estimated_total_cost_usd), 0) AS estimated_total_cost_usd,
      COUNT(*) AS turn_count,
      COALESCE(MAX(byte_end), 0) AS last_replay_offset
    FROM analytics_turns
    WHERE claude_session_id = ?
  `) as Database.Statement).get(claudeSessionId) as {
    prompt_tokens: number;
    completion_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
    total_tokens: number;
    prompt_cost_usd: number;
    completion_cost_usd: number;
    cache_creation_cost_usd: number;
    cache_read_cost_usd: number;
    estimated_total_cost_usd: number;
    turn_count: number;
    last_replay_offset: number;
  };

  (db.prepare(`
    UPDATE analytics_sessions
    SET prompt_tokens = ?,
        completion_tokens = ?,
        cache_creation_input_tokens = ?,
        cache_read_input_tokens = ?,
        total_tokens = ?,
        prompt_cost_usd = ?,
        completion_cost_usd = ?,
        cache_creation_cost_usd = ?,
        cache_read_cost_usd = ?,
        estimated_total_cost_usd = ?,
        turn_count = ?,
        last_replay_offset = ?,
        updated_at = ?
    WHERE claude_session_id = ?
  `) as Database.Statement).run(
    aggregate.prompt_tokens,
    aggregate.completion_tokens,
    aggregate.cache_creation_input_tokens,
    aggregate.cache_read_input_tokens,
    aggregate.total_tokens,
    roundUsd(aggregate.prompt_cost_usd),
    roundUsd(aggregate.completion_cost_usd),
    roundUsd(aggregate.cache_creation_cost_usd),
    roundUsd(aggregate.cache_read_cost_usd),
    roundUsd(aggregate.estimated_total_cost_usd),
    aggregate.turn_count,
    aggregate.last_replay_offset,
    new Date().toISOString(),
    claudeSessionId,
  );
}

function upsertSessionRow(
  db: Database.Database,
  state: HookState,
): void {
  const transcript = state.producerMetadata?.transcript ?? null;

  (db.prepare(`
    INSERT INTO analytics_sessions (
      claude_session_id,
      speckit_session_id,
      transcript_path,
      transcript_fingerprint,
      transcript_size_bytes,
      transcript_modified_at,
      last_claude_turn_at,
      last_replay_offset,
      prompt_tokens,
      completion_tokens,
      cache_creation_input_tokens,
      cache_read_input_tokens,
      total_tokens,
      prompt_cost_usd,
      completion_cost_usd,
      cache_creation_cost_usd,
      cache_read_cost_usd,
      estimated_total_cost_usd,
      turn_count,
      last_spec_folder,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?, ?)
    ON CONFLICT(claude_session_id) DO UPDATE SET
      speckit_session_id = excluded.speckit_session_id,
      transcript_path = excluded.transcript_path,
      transcript_fingerprint = excluded.transcript_fingerprint,
      transcript_size_bytes = excluded.transcript_size_bytes,
      transcript_modified_at = excluded.transcript_modified_at,
      last_claude_turn_at = excluded.last_claude_turn_at,
      last_spec_folder = excluded.last_spec_folder,
      updated_at = excluded.updated_at
  `) as Database.Statement).run(
    state.claudeSessionId,
    state.speckitSessionId,
    transcript?.path ?? null,
    transcript?.fingerprint ?? null,
    transcript?.sizeBytes ?? 0,
    transcript?.modifiedAt ?? null,
    state.producerMetadata?.lastClaudeTurnAt ?? null,
    state.metrics.lastTranscriptOffset,
    state.lastSpecFolder,
    new Date().toISOString(),
  );
}

function insertTurns(
  db: Database.Database,
  claudeSessionId: string,
  turns: TranscriptTurn[],
): number {
  let insertedTurns = 0;
  const insertTurn = db.prepare(`
    INSERT OR IGNORE INTO analytics_turns (
      claude_session_id,
      transcript_path,
      line_no,
      byte_start,
      byte_end,
      role,
      model,
      pricing_key,
      prompt_tokens,
      completion_tokens,
      cache_creation_input_tokens,
      cache_read_input_tokens,
      total_tokens,
      prompt_cost_usd,
      completion_cost_usd,
      cache_creation_cost_usd,
      cache_read_cost_usd,
      estimated_total_cost_usd
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `) as Database.Statement;

  const tx = db.transaction((rows: TranscriptTurn[]) => {
    for (const turn of rows) {
      const cost = computeTurnCost(turn);
      const result = insertTurn.run(
        claudeSessionId,
        turn.transcriptPath,
        turn.lineNo,
        turn.byteStart,
        turn.byteEnd,
        turn.role,
        turn.model,
        cost.pricingKey,
        turn.promptTokens,
        turn.completionTokens,
        turn.cacheCreationTokens,
        turn.cacheReadTokens,
        turn.totalTokens,
        cost.promptCostUsd,
        cost.completionCostUsd,
        cost.cacheCreationCostUsd,
        cost.cacheReadCostUsd,
        cost.estimatedTotalCostUsd,
      );
      insertedTurns += result.changes;
    }
  });
  tx(turns);

  return insertedTurns;
}

export async function ingestSessionAnalytics(
  state: HookState,
  options: { dataDir?: string } = {},
): Promise<SessionAnalyticsIngestResult> {
  const transcriptPath = state.producerMetadata?.transcript?.path;
  if (!transcriptPath) {
    throw new Error('[session-analytics-db] Cannot ingest session analytics without producerMetadata.transcript.path');
  }

  const db = initSessionAnalyticsDb(options.dataDir);
  upsertSessionRow(db, state);

  const existing = getSessionRow(db, state.claudeSessionId);
  const { turns } = await parseTranscriptTurns(transcriptPath, existing.last_replay_offset);
  const insertedTurns = insertTurns(db, state.claudeSessionId, turns);
  recomputeSessionAggregates(db, state.claudeSessionId);

  return {
    sessionUpserted: true,
    insertedTurns,
    session: getSessionRow(db, state.claudeSessionId),
  };
}

export function listSessionAnalyticsSessions(): SessionAnalyticsSessionRow[] {
  const db = getSessionAnalyticsDb();
  return (db.prepare(`
    SELECT *
    FROM analytics_sessions
    ORDER BY claude_session_id ASC
  `) as Database.Statement).all() as SessionAnalyticsSessionRow[];
}

export function listSessionTurns(
  claudeSessionId: string,
): SessionAnalyticsTurnRow[] {
  const db = getSessionAnalyticsDb();
  return (db.prepare(`
    SELECT *
    FROM analytics_turns
    WHERE claude_session_id = ?
    ORDER BY byte_start ASC
  `) as Database.Statement).all(claudeSessionId) as SessionAnalyticsTurnRow[];
}

export function listModelPricing(): SessionAnalyticsModelPricingRow[] {
  const db = getSessionAnalyticsDb();
  return (db.prepare(`
    SELECT *
    FROM model_pricing_versioned
    ORDER BY pricing_key ASC
  `) as Database.Statement).all() as SessionAnalyticsModelPricingRow[];
}

export function listNormalizedCacheTiers(): SessionAnalyticsCacheTierRow[] {
  const db = getSessionAnalyticsDb();
  return (db.prepare(`
    SELECT *
    FROM cache_tier_normalized
    ORDER BY cache_tier ASC
  `) as Database.Statement).all() as SessionAnalyticsCacheTierRow[];
}
