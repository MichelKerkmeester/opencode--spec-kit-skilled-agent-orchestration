// ───────────────────────────────────────────────────────────────
// MODULE: Memory Lineage State
// ───────────────────────────────────────────────────────────────
// Provides append-first lineage transitions, active projection reads,
// Temporal asOf resolution, and backfill/integrity helpers.
import { createHash } from 'node:crypto';
import type Database from 'better-sqlite3';

import * as bm25Index from '../search/bm25-index.js';
import * as embeddingsProvider from '../providers/embeddings.js';
import { getCanonicalPathKey } from '../utils/canonical-path.js';
import { ensureLineageTables } from '../search/vector-index-schema.js';
import { get_embedding_dim, refresh_interference_scores_for_folder, sqlite_vec_available } from '../search/vector-index-store.js';
import { to_embedding_buffer } from '../search/vector-index-types.js';
import type { ParsedMemory } from '../parsing/memory-parser.js';
import { classifyEncodingIntent } from '../search/encoding-intent.js';
import { isEncodingIntentEnabled } from '../search/search-flags.js';
import { createLogger } from '../utils/logger.js';
import { detectSpecLevelFromParsed } from '../spec/spec-level.js';
import { getHistoryEventsForLineage, init as initHistory, recordHistory, type HistoryLineageEvent } from './history.js';
import { calculateDocumentWeight, isSpecDocumentType } from './document-helpers.js';
import { applyPostInsertMetadata } from './post-insert-metadata.js';

// Feature catalog: Lineage state active projection and asOf resolution
const logger = createLogger('LineageState');


type MemoryIndexRow = Record<string, unknown> & {
  id: number;
  spec_folder: string;
  file_path: string;
  canonical_file_path?: string | null;
  anchor_id?: string | null;
  tenant_id?: string | null;
  user_id?: string | null;
  agent_id?: string | null;
  session_id?: string | null;
  shared_space_id?: string | null;
  title?: string | null;
  content_hash?: string | null;
  created_at?: string;
  updated_at?: string;
};

type LineageTransitionEvent = 'CREATE' | 'UPDATE' | 'SUPERSEDE' | 'BACKFILL';

interface MemoryLineageRow {
  memory_id: number;
  logical_key: string;
  version_number: number;
  root_memory_id: number;
  predecessor_memory_id: number | null;
  superseded_by_memory_id: number | null;
  valid_from: string;
  valid_to: string | null;
  transition_event: LineageTransitionEvent;
  actor: string;
  metadata: string | null;
  created_at: string;
}

interface ActiveProjectionRow {
  logical_key: string;
  root_memory_id: number;
  active_memory_id: number;
  updated_at: string;
}

interface LoadedLineageRows {
  logicalKey: string;
  projection: ActiveProjectionRow | null;
  rows: MemoryLineageRow[];
}

interface LineageMetadata {
  contentHash: string | null;
  filePath: string;
  canonicalFilePath: string | null;
  anchorId: string | null;
  specFolder: string;
  snapshot: MemoryIndexRow;
  history: HistoryLineageEvent[];
  actor: string;
}

interface RecordLineageTransitionOptions {
  actor?: string;
  predecessorMemoryId?: number | null;
  transitionEvent?: LineageTransitionEvent;
  validFrom?: string;
  historyEvents?: HistoryLineageEvent[];
}

const MAX_LINEAGE_VERSION_RETRIES = 3;

interface RecordedLineageTransition {
  logicalKey: string;
  versionNumber: number;
  rootMemoryId: number;
  activeMemoryId: number;
  predecessorMemoryId: number | null;
  transitionEvent: LineageTransitionEvent;
}

interface ResolvedLineageSnapshot {
  logicalKey: string;
  memoryId: number;
  versionNumber: number;
  rootMemoryId: number;
  validFrom: string;
  validTo: string | null;
  transitionEvent: LineageTransitionEvent;
  snapshot: MemoryIndexRow;
}

interface LineageInspectionSummary {
  logicalKey: string;
  rootMemoryId: number;
  activeMemoryId: number | null;
  activeVersionNumber: number | null;
  totalVersions: number;
  versionNumbers: number[];
  historicalMemoryIds: number[];
  firstValidFrom: string;
  latestValidFrom: string;
  actors: string[];
  transitionCounts: Record<LineageTransitionEvent, number>;
  hasVersionGaps: boolean;
  hasMultipleActiveVersions: boolean;
}

interface ValidateLineageIntegrityResult {
  valid: boolean;
  issues: string[];
  activeProjectionCount: number;
  lineageRowCount: number;
  missingPredecessors: number[];
  duplicateActiveLogicalKeys: string[];
  projectionMismatches: string[];
}

interface BackfillLineageResult {
  dryRun: boolean;
  scanned: number;
  seeded: number;
  skipped: number;
  logicalKeys: string[];
  totalGroups: number;
}

interface LineageWriteBenchmarkResult {
  memoryIds: number[];
  iterations: number;
  insertedVersions: number;
  durationMs: number;
  averageWriteMs: number;
  logicalKey: string | null;
  rootMemoryId: number | null;
  activeMemoryId: number | null;
  finalVersionNumber: number | null;
}

interface CreateAppendOnlyMemoryRecordParams {
  database: Database.Database;
  parsed: ParsedMemory;
  filePath: string;
  embedding: Float32Array | null;
  embeddingFailureReason: string | null;
  predecessorMemoryId: number;
  actor?: string;
}

type LineageRow = MemoryLineageRow;

function getMemoryRow(database: Database.Database, memoryId: number): MemoryIndexRow {
  const row = database.prepare('SELECT * FROM memory_index WHERE id = ?').get(memoryId) as MemoryIndexRow | undefined;
  if (!row) {
    throw new Error(`Memory ${memoryId} not found in memory_index`);
  }
  return row;
}

function normalizeTimestamp(value?: string | null): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return new Date().toISOString();
}

function getSafeHistoryEvents(database: Database.Database, memoryId: number): HistoryLineageEvent[] {
  try {
    return getHistoryEventsForLineage(memoryId, database);
  } catch (error: unknown) {
    logger.warn(`History events retrieval failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

function normalizeScopeValue(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildScopePrefix(row: MemoryIndexRow): string | null {
  const scopeTuple = [
    ['tenant', normalizeScopeValue(row.tenant_id)],
    ['user', normalizeScopeValue(row.user_id)],
    ['agent', normalizeScopeValue(row.agent_id)],
    ['session', normalizeScopeValue(row.session_id)],
    ['shared_space', normalizeScopeValue(row.shared_space_id)],
  ].filter((entry): entry is [string, string] => entry[1] != null);

  if (scopeTuple.length === 0) {
    return null;
  }

  const scopeHash = createHash('sha256')
    .update(JSON.stringify(scopeTuple), 'utf8')
    .digest('hex')
    .slice(0, 24);

  return `scope-sha256:${scopeHash}`;
}

function hasLogicalKeySeparatorCollision(...components: string[]): boolean {
  return components.some((component) => component.includes('::'));
}

function buildHashedLogicalKey(parts: {
  specFolder: string;
  scopePrefix: string | null;
  canonicalPath: string;
  anchorId: string;
}): string {
  const payload = JSON.stringify({
    version: 2,
    specFolder: parts.specFolder,
    scopePrefix: parts.scopePrefix,
    canonicalPath: parts.canonicalPath,
    anchorId: parts.anchorId,
  });
  const digest = createHash('sha256')
    .update(payload, 'utf8')
    .digest('hex');
  return `logical-sha256:${digest}`;
}

function buildLogicalKey(row: MemoryIndexRow): string {
  const canonicalPath = typeof row.canonical_file_path === 'string' && row.canonical_file_path.trim().length > 0
    ? row.canonical_file_path.trim()
    : getCanonicalPathKey(row.file_path);
  const anchorId = typeof row.anchor_id === 'string' && row.anchor_id.trim().length > 0
    ? row.anchor_id.trim()
    : '_';
  const scopePrefix = buildScopePrefix(row);

  if (hasLogicalKeySeparatorCollision(row.spec_folder, canonicalPath, anchorId)) {
    logger.warn(
      `[lineage-state] Logical key component contains '::'; using hashed structured key for spec_folder=${row.spec_folder}, path=${canonicalPath}, anchor=${anchorId}`,
    );
    return buildHashedLogicalKey({
      specFolder: row.spec_folder,
      scopePrefix,
      canonicalPath,
      anchorId,
    });
  }

  if (!scopePrefix) {
    return `${row.spec_folder}::${canonicalPath}::${anchorId}`;
  }
  return `${row.spec_folder}::${scopePrefix}::${canonicalPath}::${anchorId}`;
}

function getLineageRow(database: Database.Database, memoryId: number): MemoryLineageRow | null {
  const row = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE memory_id = ?
  `).get(memoryId) as MemoryLineageRow | undefined;
  return row ?? null;
}

function getActiveProjection(database: Database.Database, logicalKey: string): ActiveProjectionRow | null {
  const row = database.prepare(`
    SELECT *
    FROM active_memory_projection
    WHERE logical_key = ?
  `).get(logicalKey) as ActiveProjectionRow | undefined;
  return row ?? null;
}

function getLatestLineageRowForLogicalKey(database: Database.Database, logicalKey: string): MemoryLineageRow | null {
  const row = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE logical_key = ?
    ORDER BY version_number DESC, created_at DESC
    LIMIT 1
  `).get(logicalKey) as MemoryLineageRow | undefined;
  return row ?? null;
}

function loadLineageRowsForMemory(
  database: Database.Database,
  memoryId: number,
): LoadedLineageRows | null {
  const logicalKey = resolveLogicalKey(database, memoryId);
  if (!logicalKey) {
    return null;
  }

  const projection = getActiveProjection(database, logicalKey);
  const rows = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE logical_key = ?
    ORDER BY version_number ASC, created_at ASC
  `).all(logicalKey) as MemoryLineageRow[];

  return { logicalKey, projection, rows };
}

function isLogicalVersionConflict(error: unknown): boolean {
  const message = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && typeof Reflect.get(error, 'message') === 'string'
      ? String(Reflect.get(error, 'message'))
      : String(error);
  const code = typeof error === 'object' && error !== null && typeof Reflect.get(error, 'code') === 'string'
    ? String(Reflect.get(error, 'code'))
    : '';

  return (
    (code.includes('SQLITE_CONSTRAINT') || message.includes('SQLITE_CONSTRAINT') || message.includes('UNIQUE constraint failed'))
    && message.includes('memory_lineage.logical_key')
    && message.includes('memory_lineage.version_number')
  );
}

function buildMetadata(
  row: MemoryIndexRow,
  actor: string,
  historyEvents: HistoryLineageEvent[] = [],
): string {
  // D1: All fields are serialized for archival — only `.snapshot` is read back
  // during lineage inspection, but the full metadata provides forensic context
  // for post-mortem analysis and backfill validation.
  const metadata: LineageMetadata = {
    contentHash: typeof row.content_hash === 'string' ? row.content_hash : null,
    filePath: row.file_path,
    canonicalFilePath: typeof row.canonical_file_path === 'string' ? row.canonical_file_path : null,
    anchorId: typeof row.anchor_id === 'string' ? row.anchor_id : null,
    specFolder: row.spec_folder,
    snapshot: row,
    history: historyEvents,
    actor,
  };
  return JSON.stringify(metadata);
}

function parseMetadata(row: MemoryLineageRow): LineageMetadata | null {
  if (typeof row.metadata !== 'string' || row.metadata.length === 0) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(row.metadata);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as LineageMetadata;
    }
    logger.warn(`Invalid lineage metadata shape for memory ${row.memory_id}`);
    return null;
  } catch (error: unknown) {
    logger.warn(`Failed to parse lineage metadata for memory ${row.memory_id}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function resolveSnapshotFromLineageRow(
  database: Database.Database,
  row: MemoryLineageRow,
): ResolvedLineageSnapshot {
  const metadata = parseMetadata(row);
  return {
    logicalKey: row.logical_key,
    memoryId: row.memory_id,
    versionNumber: row.version_number,
    rootMemoryId: row.root_memory_id,
    validFrom: row.valid_from,
    validTo: row.valid_to,
    transitionEvent: row.transition_event,
    snapshot: metadata?.snapshot ?? getMemoryRow(database, row.memory_id),
  };
}

function upsertActiveProjection(
  database: Database.Database,
  logicalKey: string,
  rootMemoryId: number,
  activeMemoryId: number,
  updatedAt: string,
): void {
  // Evict any stale projection row that maps a *different* logical_key to the
  // same active_memory_id — prevents UNIQUE constraint violation on re-index
  // when the logical_key changes (e.g. anchor or path normalization drift).
  database.prepare(
    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
  ).run(activeMemoryId, logicalKey);
  database.prepare(`
    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(logical_key) DO UPDATE SET
      root_memory_id = excluded.root_memory_id,
      active_memory_id = excluded.active_memory_id,
      updated_at = excluded.updated_at
  `).run(logicalKey, rootMemoryId, activeMemoryId, updatedAt);
}

function bindHistory(database: Database.Database): void {
  if (typeof (database as Database.Database & { exec?: unknown }).exec === 'function') {
    initHistory(database);
  }
}

function markHistoricalPredecessor(database: Database.Database, memoryId: number, updatedAt: string): void {
  database.prepare(`
    UPDATE memory_index
    SET importance_tier = CASE
          WHEN importance_tier = 'constitutional' THEN importance_tier
          ELSE 'deprecated'
        END,
        updated_at = ?
    WHERE id = ?
  `).run(updatedAt, memoryId);
}

function insertAppendOnlyMemoryIndexRow(params: CreateAppendOnlyMemoryRecordParams): number {
  const { database, parsed, filePath, embedding, embeddingFailureReason } = params;
  const now = new Date().toISOString();
  const canonicalFilePath = getCanonicalPathKey(filePath);
  const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(filePath)
    : null;
  const encodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;
  const embeddingStatus = embedding
    ? (sqlite_vec_available() ? 'success' : 'pending')
    : 'pending';

  const result = database.prepare(`
    INSERT INTO memory_index (
      spec_folder,
      file_path,
      canonical_file_path,
      title,
      trigger_phrases,
      importance_weight,
      created_at,
      updated_at,
      embedding_model,
      embedding_generated_at,
      embedding_status,
      failure_reason,
      encoding_intent,
      document_type,
      spec_level,
      content_text,
      quality_score,
      quality_flags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    parsed.specFolder,
    filePath,
    canonicalFilePath,
    parsed.title,
    JSON.stringify(parsed.triggerPhrases),
    importanceWeight,
    now,
    now,
    embeddingsProvider.getModelName(),
    embedding ? now : null,
    embeddingStatus,
    embeddingFailureReason,
    encodingIntent ?? 'document',
    parsed.documentType || 'memory',
    specLevel,
    parsed.content,
    parsed.qualityScore ?? 0,
    JSON.stringify(parsed.qualityFlags ?? []),
  );

  const memoryId = Number(result.lastInsertRowid);
  applyPostInsertMetadata(database, memoryId, {
    content_hash: parsed.contentHash,
    context_type: parsed.contextType,
    importance_tier: parsed.importanceTier,
    memory_type: parsed.memoryType,
    type_inference_source: parsed.memoryTypeSource,
    encoding_intent: encodingIntent,
    document_type: parsed.documentType || 'memory',
    spec_level: specLevel,
    quality_score: parsed.qualityScore ?? 0,
    quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
  });

  if (embedding && sqlite_vec_available()) {
    const expectedDim = get_embedding_dim();
    if (embedding.length !== expectedDim) {
      throw new Error(`Embedding must be ${expectedDim} dimensions, got ${embedding.length}`);
    }

    database.prepare(`
      INSERT INTO vec_memories (rowid, embedding)
      VALUES (?, ?)
    `).run(BigInt(memoryId), to_embedding_buffer(embedding));
  }

  if (bm25Index.isBm25Enabled()) {
    try {
      bm25Index.getIndex().addDocument(String(memoryId), bm25Index.buildBm25DocumentText({
        title: parsed.title,
        content_text: parsed.content,
        trigger_phrases: parsed.triggerPhrases,
        file_path: filePath,
      }));
    } catch (error: unknown) {
      logger.warn(`BM25 index update failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  try {
    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
  } catch (error: unknown) {
    logger.warn(`History record failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
  }

  refresh_interference_scores_for_folder(database, parsed.specFolder);
  return memoryId;
}

// R1: Shared early-return helper for lineage functions.
function getExistingLineageTransition(
  database: Database.Database,
  memoryId: number,
): RecordedLineageTransition | null {
  const existing = getLineageRow(database, memoryId);
  if (existing) {
    return {
      logicalKey: existing.logical_key,
      versionNumber: existing.version_number,
      rootMemoryId: existing.root_memory_id,
      activeMemoryId: existing.memory_id,
      predecessorMemoryId: existing.predecessor_memory_id,
      transitionEvent: existing.transition_event,
    };
  }
  return null;
}

/**
 * Validates transition input combinations before persisting.
 * Rejects invalid event/predecessor pairings and backwards timestamps.
 */
function validateTransitionInput(
  transitionEvent: string,
  predecessorMemoryId: number | null,
  validFrom: string,
  predecessor: LineageRow | null,
): void {
  if (transitionEvent === 'CREATE' && predecessorMemoryId != null) {
    throw new Error(`E_LINEAGE: CREATE transition must not specify a predecessor (got ${predecessorMemoryId})`);
  }
  if (transitionEvent === 'SUPERSEDE' && predecessorMemoryId == null) {
    throw new Error('E_LINEAGE: SUPERSEDE transition requires a predecessor');
  }
  // M6 FIX: Compare timestamps as numeric epoch values, not raw strings,
  // to handle non-ISO strings and timezone-offset variants correctly.
  if (predecessor && new Date(validFrom).getTime() < new Date(predecessor.valid_from).getTime()) {
    throw new Error(
      `E_LINEAGE: valid_from (${validFrom}) is earlier than predecessor valid_from (${predecessor.valid_from})`,
    );
  }
}

/**
 * Seed lineage state from an existing memory row when no lineage entry exists yet.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory version to seed into lineage tables.
 * @param options - Optional actor, timestamps, and transition metadata.
 * @returns Seeded lineage state for the requested memory version.
 */
export function seedLineageFromCurrentState(
  database: Database.Database,
  memoryId: number,
  options: RecordLineageTransitionOptions = {},
): RecordedLineageTransition {
  bindHistory(database);
  ensureLineageTables(database);

  const cached = getExistingLineageTransition(database, memoryId);
  if (cached) return cached;

  const row = getMemoryRow(database, memoryId);
  const logicalKey = buildLogicalKey(row);
  const actor = options.actor ?? 'system';
  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
  const validFrom = options.validFrom
    ?? historyEvents[0]?.timestamp
    ?? normalizeTimestamp(row.created_at ?? row.updated_at);

  const seedTx = database.transaction(() => {
    database.prepare(`
      INSERT INTO memory_lineage (
        memory_id,
        logical_key,
        version_number,
        root_memory_id,
        predecessor_memory_id,
        superseded_by_memory_id,
        valid_from,
        valid_to,
        transition_event,
        actor,
        metadata
      ) VALUES (?, ?, 1, ?, NULL, NULL, ?, NULL, ?, ?, ?)
    `).run(
      memoryId,
      logicalKey,
      memoryId,
      validFrom,
      options.transitionEvent ?? 'BACKFILL',
      actor,
      buildMetadata(row, actor, historyEvents),
    );

    upsertActiveProjection(database, logicalKey, memoryId, memoryId, normalizeTimestamp(row.updated_at ?? validFrom));
  });

  seedTx();

  return {
    logicalKey,
    versionNumber: 1,
    rootMemoryId: memoryId,
    activeMemoryId: memoryId,
    predecessorMemoryId: null,
    transitionEvent: options.transitionEvent ?? 'BACKFILL',
  };
}

/**
 * Seed or append a lineage transition for a memory version.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory version being recorded.
 * @param options - Transition details such as predecessor and actor.
 * @returns Recorded lineage state for the requested memory version.
 */
export function recordLineageTransition(
  database: Database.Database,
  memoryId: number,
  options: RecordLineageTransitionOptions = {},
): RecordedLineageTransition {
  bindHistory(database);
  ensureLineageTables(database);

  const cached = getExistingLineageTransition(database, memoryId);
  if (cached) return cached;

  for (let attempt = 0; attempt <= MAX_LINEAGE_VERSION_RETRIES; attempt += 1) {
    // A1/B14: Wrap predecessor UPDATE + lineage INSERT + projection UPSERT in a transaction.
    const recordTransitionTx = database.transaction(() => {
      const row = getMemoryRow(database, memoryId);
      const rowLogicalKey = buildLogicalKey(row);
      const actor = options.actor ?? 'system';
      const transitionEvent = options.transitionEvent ?? 'CREATE';
      const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
      const predecessorMemoryId = options.predecessorMemoryId ?? null;
      const validFrom = options.validFrom ?? normalizeTimestamp(row.updated_at ?? row.created_at);

      let logicalKey = rowLogicalKey;
      let rootMemoryId = memoryId;
      let versionNumber = 1;
      let predecessor: LineageRow | null = null;

      if (predecessorMemoryId != null) {
        predecessor = getLineageRow(database, predecessorMemoryId);
        if (predecessor) {
          if (predecessor.logical_key !== rowLogicalKey) {
            throw new Error(
              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${predecessor.logical_key} ` +
              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
            );
          }
          logicalKey = predecessor.logical_key;
          rootMemoryId = predecessor.root_memory_id;
          versionNumber = predecessor.version_number + 1;
        } else {
          const seeded = seedLineageFromCurrentState(database, predecessorMemoryId, {
            actor,
            transitionEvent: 'BACKFILL',
          });
          if (seeded.logicalKey !== rowLogicalKey) {
            throw new Error(
              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${seeded.logicalKey} ` +
              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
            );
          }
          logicalKey = seeded.logicalKey;
          rootMemoryId = seeded.rootMemoryId;
          versionNumber = seeded.versionNumber + 1;
          predecessor = getLineageRow(database, predecessorMemoryId);
        }
      }

      if (attempt > 0) {
        const latest = getLatestLineageRowForLogicalKey(database, logicalKey);
        if (latest) {
          rootMemoryId = latest.root_memory_id;
          versionNumber = latest.version_number + 1;
        }
      }

      validateTransitionInput(transitionEvent, predecessorMemoryId, validFrom, predecessor);

      if (predecessorMemoryId != null) {
        if (predecessor && predecessor.valid_to) {
          logger.warn(
            `Predecessor ${predecessorMemoryId} already superseded (valid_to: ${predecessor.valid_to}). ` +
            'COALESCE will preserve the existing valid_to.',
          );
        }
        database.prepare(`
          UPDATE memory_lineage
          SET valid_to = COALESCE(valid_to, ?),
              superseded_by_memory_id = COALESCE(superseded_by_memory_id, ?)
          WHERE memory_id = ?
        `).run(validFrom, memoryId, predecessorMemoryId);
        markHistoricalPredecessor(database, predecessorMemoryId, validFrom);
      }

      database.prepare(`
        INSERT INTO memory_lineage (
          memory_id,
          logical_key,
          version_number,
          root_memory_id,
          predecessor_memory_id,
          superseded_by_memory_id,
          valid_from,
          valid_to,
          transition_event,
          actor,
          metadata
        ) VALUES (?, ?, ?, ?, ?, NULL, ?, NULL, ?, ?, ?)
      `).run(
        memoryId,
        logicalKey,
        versionNumber,
        rootMemoryId,
        predecessorMemoryId,
        validFrom,
        transitionEvent,
        actor,
        buildMetadata(row, actor, historyEvents),
      );

      upsertActiveProjection(database, logicalKey, rootMemoryId, memoryId, validFrom);

      return {
        logicalKey,
        versionNumber,
        rootMemoryId,
        activeMemoryId: memoryId,
        predecessorMemoryId,
        transitionEvent,
      } as RecordedLineageTransition;
    });

    try {
      return recordTransitionTx();
    } catch (error: unknown) {
      const shouldRetry = isLogicalVersionConflict(error) && attempt < MAX_LINEAGE_VERSION_RETRIES;
      if (!shouldRetry) {
        throw error;
      }

      logger.warn(
        `Retrying lineage insert for memory ${memoryId} after logical_key/version_number conflict ` +
        `(attempt ${attempt + 1}/${MAX_LINEAGE_VERSION_RETRIES})`,
      );
    }
  }

  throw new Error(`E_LINEAGE: exhausted retries while recording lineage for memory ${memoryId}`);
}

/**
 * Create a new append-only memory row and wire it into lineage state.
 *
 * @param params - Parsed memory payload and append-only lineage metadata.
 * @returns Identifier of the newly inserted memory row.
 */
export function createAppendOnlyMemoryRecord(params: CreateAppendOnlyMemoryRecordParams): number {
  bindHistory(params.database);
  const appendTx = params.database.transaction(() => {
    const memoryId = insertAppendOnlyMemoryIndexRow(params);
    recordLineageTransition(params.database, memoryId, {
      actor: params.actor ?? 'mcp:memory_save',
      predecessorMemoryId: params.predecessorMemoryId,
      transitionEvent: 'SUPERSEDE',
    });
    return memoryId;
  });

  return appendTx();
}

function resolveLogicalKey(database: Database.Database, memoryId: number): string | null {
  const row = getLineageRow(database, memoryId);
  if (row) {
    return row.logical_key;
  }

  const memoryRow = getMemoryRow(database, memoryId);
  const projection = getActiveProjection(database, buildLogicalKey(memoryRow));
  return projection?.logical_key ?? buildLogicalKey(memoryRow);
}

/**
 * Return the full ordered lineage chain for the logical key behind a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Ordered lineage snapshots from oldest to newest version.
 */
export function inspectLineageChain(database: Database.Database, memoryId: number): ResolvedLineageSnapshot[] {
  bindHistory(database);
  ensureLineageTables(database);
  const lineage = loadLineageRowsForMemory(database, memoryId);
  if (!lineage) {
    return [];
  }

  return lineage.rows.map((row) => resolveSnapshotFromLineageRow(database, row));
}

/**
 * Build a compact operator-facing summary for the lineage behind a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Aggregated lineage summary when one exists.
 */
export function summarizeLineageInspection(
  database: Database.Database,
  memoryId: number,
): LineageInspectionSummary | null {
  bindHistory(database);
  ensureLineageTables(database);
  const lineage = loadLineageRowsForMemory(database, memoryId);
  if (!lineage) {
    return null;
  }
  const { logicalKey, projection, rows } = lineage;

  if (rows.length === 0) {
    return null;
  }

  const transitionCounts: Record<LineageTransitionEvent, number> = {
    CREATE: 0,
    UPDATE: 0,
    SUPERSEDE: 0,
    BACKFILL: 0,
  };
  const actors = new Set<string>();
  let hasVersionGaps = false;
  let activeRows = 0;

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const expectedVersion = index + 1;
    if (row.version_number !== expectedVersion) {
      hasVersionGaps = true;
    }
    // B7: Use version_number ordering for predecessor chain validation
    // rather than assuming sequential array positions match predecessor IDs.
    if (index > 0) {
      const prevRow = rows[index - 1];
      if (prevRow && row.predecessor_memory_id !== prevRow.memory_id && row.version_number === prevRow.version_number + 1) {
        hasVersionGaps = true;
      }
    }
    if (row.valid_to == null) {
      activeRows += 1;
    }
    transitionCounts[row.transition_event] += 1;
    if (row.actor.trim().length > 0) {
      actors.add(row.actor);
    }
  }

  const activeVersion = projection
    ? rows.find((row) => row.memory_id === projection.active_memory_id) ?? null
    : rows.find((row) => row.valid_to == null) ?? null;

  return {
    logicalKey,
    rootMemoryId: rows[0].root_memory_id,
    activeMemoryId: projection?.active_memory_id ?? activeVersion?.memory_id ?? null,
    activeVersionNumber: activeVersion?.version_number ?? null,
    totalVersions: rows.length,
    versionNumbers: rows.map((row) => row.version_number),
    historicalMemoryIds: rows.slice(0, -1).map((row) => row.memory_id),
    firstValidFrom: rows[0].valid_from,
    latestValidFrom: rows[rows.length - 1].valid_from,
    actors: [...actors],
    transitionCounts,
    hasVersionGaps,
    hasMultipleActiveVersions: activeRows > 1,
  };
}

/**
 * Resolve the currently active lineage snapshot for a memory logical key.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Active lineage snapshot when one exists.
 */
export function resolveActiveLineageSnapshot(
  database: Database.Database,
  memoryId: number,
): ResolvedLineageSnapshot | null {
  ensureLineageTables(database);
  const lineage = loadLineageRowsForMemory(database, memoryId);
  if (!lineage) {
    return null;
  }
  const { projection, rows } = lineage;
  if (rows.length === 0) {
    return null;
  }

  const row = projection
    ? rows.find((candidate) => candidate.memory_id === projection.active_memory_id) ?? null
    : rows.find((candidate) => candidate.valid_to == null) ?? null;
  return row ? resolveSnapshotFromLineageRow(database, row) : null;
}

/**
 * Resolve the lineage snapshot visible at a specific point in time.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @param asOf - Timestamp used for temporal resolution.
 * @returns Snapshot active at the requested time when one exists.
 */
export function resolveLineageAsOf(
  database: Database.Database,
  memoryId: number,
  asOf: string | Date,
): ResolvedLineageSnapshot | null {
  ensureLineageTables(database);
  const lineage = loadLineageRowsForMemory(database, memoryId);
  if (!lineage) {
    return null;
  }

  const asOfTimestamp = typeof asOf === 'string' ? asOf : asOf.toISOString();
  const row = [...lineage.rows].reverse().find((candidate) => (
    candidate.valid_from <= asOfTimestamp
    && (candidate.valid_to == null || candidate.valid_to > asOfTimestamp)
  )) ?? null;

  return row ? resolveSnapshotFromLineageRow(database, row) : null;
}

/**
 * Validate lineage chains and active projections for structural drift.
 *
 * @param database - Database connection that stores lineage state.
 * @returns Integrity report describing missing predecessors and projection drift.
 */
export function validateLineageIntegrity(database: Database.Database): ValidateLineageIntegrityResult {
  ensureLineageTables(database);
  const issues: string[] = [];
  const missingPredecessors: number[] = [];
  const duplicateActiveLogicalKeys: string[] = [];
  const projectionMismatches: string[] = [];

  const orphanPredecessors = database.prepare(`
    SELECT logical_key, memory_id, predecessor_memory_id
    FROM memory_lineage
    WHERE predecessor_memory_id IS NOT NULL
      AND predecessor_memory_id NOT IN (SELECT memory_id FROM memory_lineage)
  `).all() as Array<{ logical_key: string; memory_id: number; predecessor_memory_id: number }>;

  for (const issue of orphanPredecessors) {
    missingPredecessors.push(issue.memory_id);
    issues.push(
      `Lineage ${issue.logical_key} version ${issue.memory_id} references missing predecessor ${issue.predecessor_memory_id}`,
    );
  }

  const duplicateActive = database.prepare(`
    SELECT logical_key, COUNT(*) AS total
    FROM memory_lineage
    WHERE valid_to IS NULL
    GROUP BY logical_key
    HAVING COUNT(*) > 1
  `).all() as Array<{ logical_key: string; total: number }>;

  for (const issue of duplicateActive) {
    duplicateActiveLogicalKeys.push(issue.logical_key);
    issues.push(`Lineage ${issue.logical_key} has ${issue.total} active versions`);
  }

  const projectionMismatch = database.prepare(`
    SELECT p.logical_key, p.active_memory_id
    FROM active_memory_projection p
    LEFT JOIN memory_lineage l
      ON l.logical_key = p.logical_key
     AND l.memory_id = p.active_memory_id
    WHERE l.memory_id IS NULL OR l.valid_to IS NOT NULL
  `).all() as Array<{ logical_key: string; active_memory_id: number }>;

  for (const issue of projectionMismatch) {
    projectionMismatches.push(issue.logical_key);
    issues.push(`Active projection ${issue.logical_key} points to non-active memory ${issue.active_memory_id}`);
  }

  const activeProjectionCount = (
    database.prepare('SELECT COUNT(*) AS total FROM active_memory_projection').get() as { total: number }
  ).total;
  const lineageRowCount = (
    database.prepare('SELECT COUNT(*) AS total FROM memory_lineage').get() as { total: number }
  ).total;

  return {
    valid: issues.length === 0,
    issues,
    activeProjectionCount,
    lineageRowCount,
    missingPredecessors,
    duplicateActiveLogicalKeys,
    projectionMismatches,
  };
}

/**
 * Backfill lineage state from existing memory rows in append-only order.
 *
 * @param database - Database connection that stores lineage state.
 * @param options - Dry-run and actor settings for the backfill.
 * @returns Backfill summary including scanned and seeded rows.
 */
export function backfillLineageState(
  database: Database.Database,
  options: { dryRun?: boolean; actor?: string } = {},
): BackfillLineageResult {
  bindHistory(database);
  ensureLineageTables(database);
  const dryRun = options.dryRun === true;
  const actor = options.actor ?? 'memory-lineage:backfill';
  const rows = database.prepare(`
    SELECT *
    FROM memory_index
    WHERE parent_id IS NULL
    ORDER BY created_at ASC, id ASC
  `).all() as MemoryIndexRow[];

  const groups = new Map<string, MemoryIndexRow[]>();
  for (const row of rows) {
    const logicalKey = buildLogicalKey(row);
    const group = groups.get(logicalKey);
    if (group) {
      group.push(row);
    } else {
      groups.set(logicalKey, [row]);
    }
  }

  const logicalKeys = [...groups.keys()];
  let seeded = 0;
  let skipped = 0;

  for (const group of groups.values()) {
    for (let index = 0; index < group.length; index += 1) {
      const row = group[index];
      const predecessor = index > 0 ? group[index - 1] : null;
      const successor = index < group.length - 1 ? group[index + 1] : null;
      const existing = getLineageRow(database, row.id);
      // B3: Align dry-run timestamp source with execution path.
      const historyEventsForDryRun = getSafeHistoryEvents(database, row.id);
      const expectedValidFrom = historyEventsForDryRun[0]?.timestamp
        ?? normalizeTimestamp(row.created_at ?? row.updated_at);
      const expectedValidTo = successor
        ? normalizeTimestamp(successor.created_at ?? successor.updated_at)
        : null;
      const expectedVersion = index + 1;
      const expectedRoot = group[0].id;
      if (
        !existing
        || existing.version_number !== expectedVersion
        || existing.root_memory_id !== expectedRoot
        || existing.predecessor_memory_id !== (predecessor?.id ?? null)
        || existing.superseded_by_memory_id !== (successor?.id ?? null)
        || existing.valid_from !== expectedValidFrom
        || existing.valid_to !== expectedValidTo
      ) {
        seeded += 1;
      } else {
        skipped += 1;
      }
    }
  }

  if (dryRun) {
    return {
      dryRun: true,
      scanned: rows.length,
      seeded,
      skipped,
      logicalKeys,
      totalGroups: groups.size,
    };
  }

  const execute = database.transaction(() => {
    for (const [logicalKey, group] of groups.entries()) {
      for (let index = 0; index < group.length; index += 1) {
        const row = group[index];
        const predecessor = index > 0 ? group[index - 1] : null;
        const successor = index < group.length - 1 ? group[index + 1] : null;
        const historyEvents = getSafeHistoryEvents(database, row.id);
        const validFrom = historyEvents[0]?.timestamp
          ?? normalizeTimestamp(row.created_at ?? row.updated_at);
        const validTo = successor
          ? normalizeTimestamp(successor.created_at ?? successor.updated_at)
          : null;

        database.prepare(`
          INSERT INTO memory_lineage (
            memory_id,
            logical_key,
            version_number,
            root_memory_id,
            predecessor_memory_id,
            superseded_by_memory_id,
            valid_from,
            valid_to,
            transition_event,
            actor,
            metadata
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'BACKFILL', ?, ?)
          ON CONFLICT(memory_id) DO UPDATE SET
            logical_key = excluded.logical_key,
            version_number = excluded.version_number,
            root_memory_id = excluded.root_memory_id,
            predecessor_memory_id = excluded.predecessor_memory_id,
            superseded_by_memory_id = excluded.superseded_by_memory_id,
            valid_from = excluded.valid_from,
            valid_to = excluded.valid_to,
            transition_event = excluded.transition_event,
            actor = excluded.actor,
            metadata = excluded.metadata
        `).run(
          row.id,
          logicalKey,
          index + 1,
          group[0].id,
          predecessor?.id ?? null,
          successor?.id ?? null,
          validFrom,
          validTo,
          actor,
          buildMetadata(row, actor, historyEvents),
        );

        if (predecessor) {
          markHistoricalPredecessor(database, predecessor.id, validFrom);
        }
      }

      const latest = group[group.length - 1];
      upsertActiveProjection(
        database,
        logicalKey,
        group[0].id,
        latest.id,
        normalizeTimestamp(latest.updated_at ?? latest.created_at),
      );
    }
  });

  execute();

  return {
    dryRun: false,
    scanned: rows.length,
    seeded,
    skipped,
    logicalKeys,
    totalGroups: groups.size,
  };
}

/**
 * Resolve the active projection row for the lineage that owns a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Active projection row when one exists.
 */
export function getActiveProjectionRow(
  database: Database.Database,
  memoryId: number,
): ActiveProjectionRow | null {
  const lineage = loadLineageRowsForMemory(database, memoryId);
  if (!lineage) {
    return null;
  }
  return lineage.projection;
}

/**
 * Resolve the latest lineage row for the logical key behind a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Latest lineage row when one exists.
 */
export function getLatestLineageForMemory(database: Database.Database, memoryId: number): MemoryLineageRow | null {
  const lineage = loadLineageRowsForMemory(database, memoryId);
  if (!lineage || lineage.rows.length === 0) {
    return null;
  }
  return lineage.rows[lineage.rows.length - 1] ?? null;
}

/**
 * Compatibility wrapper used by roadmap tests and save flows for lineage writes.
 *
 * @param database - Database connection that stores lineage state.
 * @param params - Memory identifier and transition metadata to record.
 * @returns Recorded lineage transition for the requested memory version.
 */
export function recordLineageVersion(
  database: Database.Database,
  params: {
    memoryId: number;
    actor?: string;
    predecessorMemoryId?: number | null;
    effectiveAt?: string;
    transitionEvent?: LineageTransitionEvent;
  },
): RecordedLineageTransition {
  if (typeof (database as Database.Database & { exec?: unknown }).exec !== 'function') {
    // B6: Mock path returns memoryId as root — predecessor's root is unavailable
    // without DB access, and using predecessor ID itself is incorrect.
    return {
      logicalKey: `mock:${params.memoryId}`,
      versionNumber: 1,
      rootMemoryId: params.memoryId,
      activeMemoryId: params.memoryId,
      predecessorMemoryId: params.predecessorMemoryId ?? null,
      transitionEvent: params.transitionEvent ?? 'CREATE',
    };
  }

  return recordLineageTransition(database, params.memoryId, {
    actor: params.actor,
    predecessorMemoryId: params.predecessorMemoryId,
    transitionEvent: params.transitionEvent,
    validFrom: params.effectiveAt,
  });
}

/**
 * Compatibility wrapper that resolves the active snapshot for a memory target.
 *
 * @param database - Database connection that stores lineage state.
 * @param target - Memory identifier used to resolve the active snapshot.
 * @returns Active lineage snapshot when one exists.
 */
export function getActiveMemoryProjection(
  database: Database.Database,
  target: { memoryId: number },
): ResolvedLineageSnapshot | null {
  return resolveActiveLineageSnapshot(database, target.memoryId);
}

/**
 * Compatibility wrapper that resolves the snapshot visible at a given time.
 *
 * @param database - Database connection that stores lineage state.
 * @param target - Memory identifier and `asOf` timestamp to resolve.
 * @returns Snapshot active at the requested time when one exists.
 */
export function resolveMemoryAsOf(
  database: Database.Database,
  target: { memoryId: number; asOf: string | Date },
): ResolvedLineageSnapshot | null {
  return resolveLineageAsOf(database, target.memoryId, target.asOf);
}

/**
 * Compatibility wrapper that executes the lineage backfill workflow.
 *
 * @param database - Database connection that stores lineage state.
 * @param options - Dry-run and actor settings for the backfill.
 * @returns Backfill summary including scanned and seeded rows.
 */
export function runLineageBackfill(
  database: Database.Database,
  options: { dryRun?: boolean; actor?: string } = {},
): BackfillLineageResult {
  return backfillLineageState(database, options);
}

/**
 * Benchmark append-first lineage writes across an ordered chain of memory ids.
 *
 * @param database - Database connection that stores lineage state.
 * @param options - Ordered memory ids and optional actor label for the benchmark run.
 * @returns Lightweight write-path timing and final projection details.
 */
export function benchmarkLineageWritePath(
  database: Database.Database,
  options: { memoryIds: number[]; actor?: string },
): LineageWriteBenchmarkResult {
  bindHistory(database);
  ensureLineageTables(database);
  const memoryIds = [...options.memoryIds];

  if (memoryIds.length === 0) {
    return {
      memoryIds,
      iterations: 0,
      insertedVersions: 0,
      durationMs: 0,
      averageWriteMs: 0,
      logicalKey: null,
      rootMemoryId: null,
      activeMemoryId: null,
      finalVersionNumber: null,
    };
  }

  const actor = options.actor ?? 'memory-lineage:benchmark';
  let insertedVersions = 0;
  let predecessorMemoryId: number | null = null;
  let lastRecorded: RecordedLineageTransition | null = null;
  const startedAt = Date.now();

  for (const memoryId of memoryIds) {
    if (!getLineageRow(database, memoryId)) {
      insertedVersions += 1;
    }
    lastRecorded = recordLineageTransition(database, memoryId, {
      actor,
      predecessorMemoryId,
      transitionEvent: predecessorMemoryId == null ? 'CREATE' : 'SUPERSEDE',
    });
    predecessorMemoryId = memoryId;
  }

  const durationMs = Date.now() - startedAt;

  return {
    memoryIds,
    iterations: memoryIds.length,
    insertedVersions,
    durationMs,
    averageWriteMs: durationMs / memoryIds.length,
    logicalKey: lastRecorded?.logicalKey ?? null,
    rootMemoryId: lastRecorded?.rootMemoryId ?? null,
    activeMemoryId: lastRecorded?.activeMemoryId ?? null,
    finalVersionNumber: lastRecorded?.versionNumber ?? null,
  };
}

/**
 * Public lineage result types exposed to tests and compatibility helpers.
 */
export type {
  ActiveProjectionRow,
  BackfillLineageResult,
  LineageInspectionSummary,
  LineageWriteBenchmarkResult,
  RecordedLineageTransition,
  ResolvedLineageSnapshot,
  ValidateLineageIntegrityResult,
};
