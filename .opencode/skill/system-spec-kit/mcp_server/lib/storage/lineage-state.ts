// ───────────────────────────────────────────────────────────────
// 1. MEMORY LINEAGE STATE
// ───────────────────────────────────────────────────────────────
// Provides append-first lineage transitions, active projection reads,
// Temporal asOf resolution, and backfill/integrity helpers.
import type Database from 'better-sqlite3';

import * as bm25Index from '../search/bm25-index';
import * as embeddingsProvider from '../providers/embeddings';
import { getCanonicalPathKey } from '../utils/canonical-path';
import { ensureLineageTables } from '../search/vector-index-schema';
import { get_embedding_dim, refresh_interference_scores_for_folder, sqlite_vec_available } from '../search/vector-index-store';
import { to_embedding_buffer } from '../search/vector-index-types';
import type { ParsedMemory } from '../parsing/memory-parser';
import { classifyEncodingIntent } from '../search/encoding-intent';
import { isEncodingIntentEnabled } from '../search/search-flags';
import { getHistoryEventsForLineage, init as initHistory, recordHistory, type HistoryLineageEvent } from './history';
import { applyPostInsertMetadata } from '../../handlers/save/db-helpers';
import { calculateDocumentWeight, isSpecDocumentType } from '../../handlers/pe-gating';
import { detectSpecLevelFromParsed } from '../../handlers/handler-utils';

// Feature catalog: Lineage state active projection and asOf resolution


type MemoryIndexRow = Record<string, unknown> & {
  id: number;
  spec_folder: string;
  file_path: string;
  canonical_file_path?: string | null;
  anchor_id?: string | null;
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
  } catch {
    return [];
  }
}

function buildLogicalKey(row: MemoryIndexRow): string {
  const canonicalPath = typeof row.canonical_file_path === 'string' && row.canonical_file_path.trim().length > 0
    ? row.canonical_file_path.trim()
    : getCanonicalPathKey(row.file_path);
  const anchorId = typeof row.anchor_id === 'string' && row.anchor_id.trim().length > 0
    ? row.anchor_id.trim()
    : '_';
  return `${row.spec_folder}::${canonicalPath}::${anchorId}`;
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

function buildMetadata(
  row: MemoryIndexRow,
  actor: string,
  historyEvents: HistoryLineageEvent[] = [],
): string {
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
    return JSON.parse(row.metadata) as LineageMetadata;
  } catch (_error: unknown) {
    return null;
  }
}

function upsertActiveProjection(
  database: Database.Database,
  logicalKey: string,
  rootMemoryId: number,
  activeMemoryId: number,
  updatedAt: string,
): void {
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
      bm25Index.getIndex().addDocument(String(memoryId), parsed.content);
    } catch (_error: unknown) {
      // Keep parity with save path best-effort BM25 behavior.
    }
  }

  try {
    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
  } catch (_error: unknown) {
    // History remains best-effort during save.
  }

  refresh_interference_scores_for_folder(database, parsed.specFolder);
  return memoryId;
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

  const row = getMemoryRow(database, memoryId);
  const logicalKey = buildLogicalKey(row);
  const actor = options.actor ?? 'system';
  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
  const validFrom = options.validFrom
    ?? historyEvents[0]?.timestamp
    ?? normalizeTimestamp(row.created_at ?? row.updated_at);

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

  const row = getMemoryRow(database, memoryId);
  const actor = options.actor ?? 'system';
  const transitionEvent = options.transitionEvent ?? 'CREATE';
  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
  const predecessorMemoryId = options.predecessorMemoryId ?? null;
  const validFrom = options.validFrom ?? normalizeTimestamp(row.updated_at ?? row.created_at);

  let logicalKey = buildLogicalKey(row);
  let rootMemoryId = memoryId;
  let versionNumber = 1;

  if (predecessorMemoryId != null) {
    const predecessor = getLineageRow(database, predecessorMemoryId);
    if (predecessor) {
      logicalKey = predecessor.logical_key;
      rootMemoryId = predecessor.root_memory_id;
      versionNumber = predecessor.version_number + 1;
    } else {
      const seeded = seedLineageFromCurrentState(database, predecessorMemoryId, {
        actor,
        transitionEvent: 'BACKFILL',
      });
      logicalKey = seeded.logicalKey;
      rootMemoryId = seeded.rootMemoryId;
      versionNumber = seeded.versionNumber + 1;
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
  };
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
  const logicalKey = resolveLogicalKey(database, memoryId);
  if (!logicalKey) {
    return [];
  }

  const rows = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE logical_key = ?
    ORDER BY version_number ASC, created_at ASC
  `).all(logicalKey) as MemoryLineageRow[];

  return rows.map((row) => {
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
  });
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
  const logicalKey = resolveLogicalKey(database, memoryId);
  if (!logicalKey) {
    return null;
  }

  const rows = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE logical_key = ?
    ORDER BY version_number ASC, created_at ASC
  `).all(logicalKey) as MemoryLineageRow[];

  if (rows.length === 0) {
    return null;
  }

  const projection = getActiveProjection(database, logicalKey);
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
    if (index > 0 && row.predecessor_memory_id !== rows[index - 1]?.memory_id) {
      hasVersionGaps = true;
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
  const logicalKey = resolveLogicalKey(database, memoryId);
  if (!logicalKey) {
    return null;
  }

  const projection = getActiveProjection(database, logicalKey);
  if (!projection) {
    return null;
  }

  const row = getLineageRow(database, projection.active_memory_id);
  if (!row) {
    return null;
  }

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
  const logicalKey = resolveLogicalKey(database, memoryId);
  if (!logicalKey) {
    return null;
  }

  const asOfTimestamp = typeof asOf === 'string' ? asOf : asOf.toISOString();
  const row = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE logical_key = ?
      AND valid_from <= ?
      AND (valid_to IS NULL OR valid_to > ?)
    ORDER BY version_number DESC, created_at DESC
    LIMIT 1
  `).get(logicalKey, asOfTimestamp, asOfTimestamp) as MemoryLineageRow | undefined;

  if (!row) {
    return null;
  }

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
      const expectedValidFrom = normalizeTimestamp(row.created_at ?? row.updated_at);
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
  const logicalKey = resolveLogicalKey(database, memoryId);
  if (!logicalKey) {
    return null;
  }
  return getActiveProjection(database, logicalKey);
}

/**
 * Resolve the latest lineage row for the logical key behind a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Latest lineage row when one exists.
 */
export function getLatestLineageForMemory(database: Database.Database, memoryId: number): MemoryLineageRow | null {
  const logicalKey = resolveLogicalKey(database, memoryId);
  if (!logicalKey) {
    return null;
  }
  return getLatestLineageRowForLogicalKey(database, logicalKey);
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
    return {
      logicalKey: `mock:${params.memoryId}`,
      versionNumber: 1,
      rootMemoryId: params.predecessorMemoryId ?? params.memoryId,
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
