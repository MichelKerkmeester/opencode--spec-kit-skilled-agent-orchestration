// ───────────────────────────────────────────────────────────────
// MODULE: Checkpoints
// ───────────────────────────────────────────────────────────────
// Feature catalog: Checkpoint creation (checkpoint_create)
// Feature catalog: Checkpoint restore (checkpoint_restore)
// Gzip-compressed database checkpoints with embedding preservation
// Node stdlib
import * as zlib from 'zlib';

// External packages
import type Database from 'better-sqlite3';

// Internal utils
import { toErrorMessage } from '../../utils/db-helpers.js';
import { getAllowedSharedSpaceIds } from '../collab/shared-spaces.js';
import { rebuildAutoEntities } from '../extraction/entity-extractor.js';
import {
  createScopeFilterPredicate,
  hasScopeConstraints,
  normalizeScopeContext,
  type ScopeContext,
} from '../governance/scope-governance.js';
import { detectCommunities, storeCommunityAssignments } from '../graph/community-detection.js';
import { generateCommunitySummaries } from '../graph/community-summaries.js';
import { storeCommunities } from '../graph/community-storage.js';
import { snapshotDegrees } from '../graph/graph-signals.js';
import { deleteEdgesForMemory } from './causal-edges.js';
import { runLineageBackfill } from './lineage-state.js';

function batchedInQuery<T>(db: Database.Database, sql: string, ids: (number | string)[], batchSize = 500): T[] {
  const results: T[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const placeholders = batch.map(() => '?').join(', ');
    const batchSql = sql.replace('__PLACEHOLDERS__', placeholders);
    results.push(...(db.prepare(batchSql).all(...batch) as T[]));
  }
  return results;
}

function dedupeRowsById<T extends Record<string, unknown>>(rows: T[]): T[] {
  const results: T[] = [];
  const seenIds = new Set<number | string>();

  for (const row of rows) {
    const id = row.id;
    if (typeof id === 'number' || typeof id === 'string') {
      if (seenIds.has(id)) {
        continue;
      }
      seenIds.add(id);
    }
    results.push(row);
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const MAX_CHECKPOINTS = 10;

const CHECKPOINT_MANIFEST = Object.freeze({
  snapshot: [
    'memory_index',
    'vec_memories',
    'vec_metadata',
    'working_memory',
    'causal_edges',
    'weight_history',
    'memory_history',
    'mutation_ledger',
    'memory_conflicts',
    'memory_corrections',
    'adaptive_signal_events',
    'negative_feedback_events',
    'learned_feedback_audit',
    'session_learning',
    'governance_audit',
    'shared_spaces',
    'shared_space_members',
    'shared_space_conflicts',
    'session_state',
    'session_sent_memories',
    'memory_summaries',
  ],
  rebuild: [
    'memory_lineage',
    'active_memory_projection',
    'memory_entities',
    'entity_catalog',
    'degree_snapshots',
    'community_assignments',
    'graph_communities',
    'community_summaries',
    'memory_fts',
  ],
  skip: [
    'checkpoints',
    'schema_version',
    'embedding_cache',
    'adaptive_shadow_runs',
  ],
});

const CHECKPOINT_RESTORE_ORDER = [
  'memory_index',
  'vec_memories',
  'vec_metadata',
  'working_memory',
  'causal_edges',
  'weight_history',
  'memory_history',
  'mutation_ledger',
  'memory_conflicts',
  'memory_corrections',
  'adaptive_signal_events',
  'negative_feedback_events',
  'learned_feedback_audit',
  'session_learning',
  'governance_audit',
  'shared_spaces',
  'shared_space_members',
  'shared_space_conflicts',
  'session_state',
  'session_sent_memories',
  'memory_summaries',
] as const;

const CHECKPOINT_CLEAR_ORDER = [...CHECKPOINT_RESTORE_ORDER].reverse();

const MUTATION_LEDGER_TRIGGER_SQL = `
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
`;

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
----------------------------------------------------------------*/

interface CheckpointEntry {
  id: number;
  name: string;
  created_at: string;
  spec_folder: string | null;
  git_branch: string | null;
  memory_snapshot: Buffer | null;
  file_snapshot: Buffer | null;
  metadata: string | null;
}

interface CheckpointInfo {
  id: number;
  name: string;
  createdAt: string;
  specFolder: string | null;
  gitBranch: string | null;
  snapshotSize: number;
  metadata: Record<string, unknown>;
  [key: string]: unknown;
}

interface CreateCheckpointOptions {
  name?: string;
  specFolder?: string | null;
  includeEmbeddings?: boolean;
  metadata?: Record<string, unknown>;
  scope?: ScopeContext;
}

interface RestoreResult {
  restored: number;
  skipped: number;
  errors: string[];
  workingMemoryRestored: number;
  partialFailure?: boolean;
  rolledBackTables?: string[];
}

interface SnapshotVectorRow {
  rowid: number;
  embedding: Buffer | null;
}

interface TableSnapshot {
  columns: string[];
  rows: Array<Record<string, unknown>>;
}

interface CheckpointManifest {
  snapshot: string[];
  rebuild: string[];
  skip: string[];
}

interface CheckpointSnapshot {
  manifest?: CheckpointManifest;
  tables?: Record<string, TableSnapshot>;
  memories: Array<Record<string, unknown>>;
  workingMemory: Array<Record<string, unknown>>;
  vectors?: SnapshotVectorRow[];
  causalEdges?: Array<Record<string, unknown>>;
  timestamp: string;
}

interface RestoreBarrierStatus {
  code: string;
  message: string;
}

interface RestoreBarrierHooks {
  afterAcquire?: (() => void) | null;
  beforeRelease?: (() => void) | null;
}

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;
let restoreInProgress = false;
let restoreBarrierHooks: RestoreBarrierHooks = {};

const RESTORE_IN_PROGRESS_ERROR_CODE = 'E_RESTORE_IN_PROGRESS';
const RESTORE_IN_PROGRESS_ERROR_MESSAGE = 'Checkpoint restore maintenance is in progress. Retry after the restore lifecycle completes.';

/* ───────────────────────────────────────────────────────────────
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
}

function getDatabase(): Database.Database {
  if (!db) throw new Error('Database not initialized. The checkpoints module requires the MCP server to be running. Restart the MCP server and retry.');
  return db;
}

function isRestoreInProgress(): boolean {
  return restoreInProgress;
}

function getRestoreBarrierStatus(): RestoreBarrierStatus | null {
  if (!restoreInProgress) {
    return null;
  }

  return {
    code: RESTORE_IN_PROGRESS_ERROR_CODE,
    message: RESTORE_IN_PROGRESS_ERROR_MESSAGE,
  };
}

function setRestoreBarrierHooks(hooks: RestoreBarrierHooks | null): void {
  restoreBarrierHooks = hooks ?? {};
}

function acquireRestoreBarrier(): void {
  restoreInProgress = true;
  restoreBarrierHooks.afterAcquire?.();
}

function releaseRestoreBarrier(): void {
  try {
    restoreBarrierHooks.beforeRelease?.();
  } finally {
    restoreInProgress = false;
  }
}

/* ───────────────────────────────────────────────────────────────
   5. HELPERS
----------------------------------------------------------------*/

function getGitBranch(): string | null {
  const candidates = [
    process.env.GIT_BRANCH,
    process.env.BRANCH_NAME,
    process.env.CI_COMMIT_REF_NAME,
    process.env.VERCEL_GIT_COMMIT_REF,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return null;
}

function tableExists(database: Database.Database, tableName: string): boolean {
  try {
    const row = database.prepare(
      "SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name = ?"
    ).get(tableName) as { name?: string } | undefined;
    return !!row?.name;
  } catch (_error: unknown) {
    return false;
  }
}

// F04-005: Static allowlist for dynamic table name interpolation
const ALLOWED_TABLE_NAMES = new Set([
  // Core tables
  'memory_index', 'memory_fts', 'vec_memories', 'vec_metadata', 'causal_edges',
  'memory_conflicts', 'memory_corrections', 'memory_lineage', 'memory_history',
  'memory_summaries', 'mutation_ledger',
  // Working memory & session
  'working_memory', 'session_state', 'session_sent_memories', 'session_learning',
  // Graph & signals
  'weight_history', 'adaptive_signal_events', 'negative_feedback_events',
  'active_memory_projection', 'auto_entities', 'community_assignments', 'degree_snapshots',
  // Feedback & learning
  'learned_feedback_audit', 'learned_trigger_scores', 'learned_trigger_feedback',
  // Governance & shared
  'governance_audit', 'shared_spaces', 'shared_space_members', 'shared_space_conflicts',
  // Checkpoints & system
  'checkpoints', 'checkpoint_items', 'deletion_log', 'consumption_log',
  'eval_shadow_comparisons',
]);

function validateTableName(tableName: string): void {
  if (!ALLOWED_TABLE_NAMES.has(tableName)) {
    throw new Error(`[checkpoints] Table name "${tableName}" not in allowlist`);
  }
}

function getTableColumns(database: Database.Database, tableName: string): string[] {
  validateTableName(tableName);
  try {
    return (database.prepare(`PRAGMA table_info("${tableName}")`).all() as Array<{ name: string }>)
      .map((column) => column.name)
      .filter((name) => typeof name === 'string' && name.length > 0);
  } catch (_error: unknown) {
    return [];
  }
}

function tableHasColumn(
  database: Database.Database,
  tableName: string,
  columnName: string,
): boolean {
  return getTableColumns(database, tableName).includes(columnName);
}

function toBuffer(value: unknown): Buffer | null {
  if (Buffer.isBuffer(value)) return value;
  if (value && typeof value === 'object') {
    const maybeSerialized = value as { type?: unknown; data?: unknown };
    if (
      maybeSerialized.type === 'Buffer' &&
      Array.isArray(maybeSerialized.data) &&
      maybeSerialized.data.every((entry) => typeof entry === 'number')
    ) {
      return Buffer.from(maybeSerialized.data);
    }
  }
  return null;
}

function deserializeSnapshotValue(value: unknown): unknown {
  if (value === undefined) {
    return null;
  }
  return toBuffer(value) ?? value;
}

function getMemoryIds(memories: Array<Record<string, unknown>>): number[] {
  const ids = new Set<number>();
  for (const memory of memories) {
    if (!memory || typeof memory !== 'object') {
      continue;
    }
    const rawId = memory.id;
    if (typeof rawId === 'number' && Number.isSafeInteger(rawId)) {
      ids.add(rawId);
      continue;
    }
    if (typeof rawId === 'string' && /^\d+$/.test(rawId)) {
      ids.add(Number.parseInt(rawId, 10));
    }
  }
  return Array.from(ids);
}

function getSharedSpaceIdsFromMemories(memories: Array<Record<string, unknown>>): string[] {
  const ids = new Set<string>();
  for (const memory of memories) {
    const rawId = memory?.shared_space_id;
    if (typeof rawId === 'string' && rawId.trim().length > 0) {
      ids.add(rawId.trim());
    }
  }
  return Array.from(ids);
}

function parseCheckpointMetadata(value: unknown): Record<string, unknown> {
  if (!value) {
    return {};
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {};
    } catch (_error: unknown) {
      return {};
    }
  }
  return typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function checkpointMetadataMatchesScope(rawMetadata: unknown, scope: ScopeContext): boolean {
  const normalizedScope = normalizeScopeContext(scope);
  if (!hasScopeConstraints(normalizedScope)) {
    return true;
  }

  const metadata = parseCheckpointMetadata(rawMetadata);
  return (
    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
    && (normalizedScope.userId === undefined || metadata.userId === normalizedScope.userId)
    && (normalizedScope.agentId === undefined || metadata.agentId === normalizedScope.agentId)
    && (normalizedScope.sharedSpaceId === undefined || metadata.sharedSpaceId === normalizedScope.sharedSpaceId)
  );
}

function hasDirectScopeColumns(columns: ReadonlySet<string>): boolean {
  return (
    columns.has('tenant_id')
    || columns.has('user_id')
    || columns.has('agent_id')
    || columns.has('session_id')
    || columns.has('shared_space_id')
  );
}

function getScopeFilterContext(
  database: Database.Database,
  scope: ScopeContext = {},
): {
  normalizedScope: ScopeContext;
  allowedSharedSpaceIds: Set<string>;
  predicate: ((row: Record<string, unknown>) => boolean) | null;
} {
  const normalizedScope = normalizeScopeContext(scope);
  if (!hasScopeConstraints(normalizedScope)) {
    return {
      normalizedScope,
      allowedSharedSpaceIds: new Set<string>(),
      predicate: null,
    };
  }

  const allowedSharedSpaceIds = getAllowedSharedSpaceIds(database, normalizedScope);
  return {
    normalizedScope,
    allowedSharedSpaceIds,
    predicate: createScopeFilterPredicate<Record<string, unknown>>(normalizedScope, allowedSharedSpaceIds),
  };
}

function getScopedMemories(
  database: Database.Database,
  specFolder: string | null,
  scope: ScopeContext = {},
): {
  memories: Array<Record<string, unknown>>;
  memoryIds: number[];
  allowedSharedSpaceIds: Set<string>;
  normalizedScope: ScopeContext;
} {
  const { normalizedScope, allowedSharedSpaceIds, predicate } = getScopeFilterContext(database, scope);
  const baseMemories = specFolder
    ? database.prepare('SELECT * FROM memory_index WHERE spec_folder = ?').all(specFolder) as Array<Record<string, unknown>>
    : database.prepare('SELECT * FROM memory_index').all() as Array<Record<string, unknown>>;
  const memories = predicate ? baseMemories.filter((row) => predicate(row)) : baseMemories;

  return {
    memories,
    memoryIds: getMemoryIds(memories),
    allowedSharedSpaceIds,
    normalizedScope,
  };
}

function getCurrentScopedMemoryIds(
  database: Database.Database,
  specFolder: string | null,
  scope: ScopeContext = {},
): number[] {
  return getScopedMemories(database, specFolder, scope).memoryIds;
}

function buildRestoreScopeDeleteWhere(
  columns: ReadonlySet<string>,
  checkpointSpecFolder: string | null,
  scope: ScopeContext = {},
): {
  clauses: string[];
  params: string[];
} {
  const normalizedScope = normalizeScopeContext(scope);
  const clauses: string[] = [];
  const params: string[] = [];

  if (checkpointSpecFolder && columns.has('spec_folder')) {
    clauses.push('spec_folder = ?');
    params.push(checkpointSpecFolder);
  }
  if (normalizedScope.tenantId && columns.has('tenant_id')) {
    clauses.push('tenant_id = ?');
    params.push(normalizedScope.tenantId);
  }
  if (normalizedScope.userId && columns.has('user_id')) {
    clauses.push('user_id = ?');
    params.push(normalizedScope.userId);
  }
  if (normalizedScope.agentId && columns.has('agent_id')) {
    clauses.push('agent_id = ?');
    params.push(normalizedScope.agentId);
  }
  if (normalizedScope.sharedSpaceId && columns.has('shared_space_id')) {
    clauses.push('shared_space_id = ?');
    params.push(normalizedScope.sharedSpaceId);
  }

  return { clauses, params };
}

function getEdgeIds(edges: Array<Record<string, unknown>>): number[] {
  const ids = new Set<number>();
  for (const edge of edges) {
    const rawId = edge?.id;
    if (typeof rawId === 'number' && Number.isSafeInteger(rawId)) {
      ids.add(rawId);
      continue;
    }
    if (typeof rawId === 'string' && /^\d+$/.test(rawId)) {
      ids.add(Number.parseInt(rawId, 10));
    }
  }
  return Array.from(ids);
}

function deleteRowsByIds(
  database: Database.Database,
  tableName: string,
  columnName: string,
  ids: number[],
): void {
  if (ids.length === 0) {
    return;
  }

  const sql = `DELETE FROM ${tableName} WHERE ${columnName} IN (__PLACEHOLDERS__)`;
  for (let i = 0; i < ids.length; i += 500) {
    const batch = ids.slice(i, i + 500);
    const placeholders = batch.map(() => '?').join(', ');
    database.prepare(sql.replace('__PLACEHOLDERS__', placeholders)).run(...batch);
  }
}

function deleteRowsByStringIds(
  database: Database.Database,
  tableName: string,
  columnName: string,
  ids: string[],
): void {
  if (ids.length === 0) {
    return;
  }

  const sql = `DELETE FROM ${tableName} WHERE ${columnName} IN (__PLACEHOLDERS__)`;
  for (let i = 0; i < ids.length; i += 500) {
    const batch = ids.slice(i, i + 500);
    const placeholders = batch.map(() => '?').join(', ');
    database.prepare(sql.replace('__PLACEHOLDERS__', placeholders)).run(...batch);
  }
}

function snapshotCausalEdgesForMemoryIds(
  database: Database.Database,
  memoryIds: number[],
): Array<Record<string, unknown>> {
  if (memoryIds.length === 0 || !tableExists(database, 'causal_edges')) {
    return [];
  }

  try {
    const edgeIds = memoryIds.map((id) => String(id));
    return dedupeRowsById([
      ...batchedInQuery<Record<string, unknown>>(
        database,
        `
          SELECT * FROM causal_edges
          WHERE source_id IN (__PLACEHOLDERS__)
        `,
        edgeIds,
      ),
      ...batchedInQuery<Record<string, unknown>>(
        database,
        `
          SELECT * FROM causal_edges
          WHERE target_id IN (__PLACEHOLDERS__)
        `,
        edgeIds,
      ),
    ]);
  } catch (_error: unknown) {
    return [];
  }
}

function deleteCausalEdgesForMemoryIds(database: Database.Database, memoryIds: number[]): void {
  if (memoryIds.length === 0 || !tableExists(database, 'causal_edges')) {
    return;
  }

  for (const memoryId of new Set(memoryIds.map((id) => String(id)))) {
    deleteEdgesForMemory(memoryId);
  }
}

function getTableSnapshotColumns(database: Database.Database, tableName: string): string[] {
  if (tableName === 'vec_memories') {
    return ['rowid', 'embedding'];
  }
  return getTableColumns(database, tableName);
}

function selectTableRows(
  database: Database.Database,
  tableName: string,
  options: {
    specFolder: string | null;
    memoryIds: number[];
    sharedSpaceIds: string[];
    scope?: ScopeContext;
    allowedSharedSpaceIds?: ReadonlySet<string>;
  },
): Array<Record<string, unknown>> {
  const { specFolder, memoryIds, sharedSpaceIds, scope = {}, allowedSharedSpaceIds } = options;
  const normalizedScope = normalizeScopeContext(scope);
  const hasScope = hasScopeConstraints(normalizedScope);
  const scopePredicate = hasScope
    ? createScopeFilterPredicate<Record<string, unknown>>(normalizedScope, allowedSharedSpaceIds)
    : null;

  if (tableName === 'memory_index') {
    const rows = specFolder
      ? database.prepare(
        'SELECT * FROM memory_index WHERE spec_folder = ?'
      ).all(specFolder) as Array<Record<string, unknown>>
      : database.prepare('SELECT * FROM memory_index').all() as Array<Record<string, unknown>>;
    return scopePredicate ? rows.filter((row) => scopePredicate(row)) : rows;
  }

  if (tableName === 'vec_memories') {
    if (memoryIds.length > 0) {
      return batchedInQuery<Record<string, unknown>>(
        database,
        'SELECT rowid AS rowid, embedding FROM vec_memories WHERE rowid IN (__PLACEHOLDERS__)',
        memoryIds,
      );
    }
    if (specFolder) {
      return database.prepare(`
      SELECT v.rowid AS rowid, v.embedding AS embedding
      FROM vec_memories v
      JOIN memory_index m ON m.id = v.rowid
      WHERE m.spec_folder = ?
    `).all(specFolder) as Array<Record<string, unknown>>;
    }
    return hasScope ? [] : database.prepare(
      'SELECT rowid AS rowid, embedding FROM vec_memories'
    ).all() as Array<Record<string, unknown>>;
  }

  if (tableName === 'causal_edges') {
    if (memoryIds.length > 0) {
      return snapshotCausalEdgesForMemoryIds(database, memoryIds);
    }
    return hasScope ? [] : database.prepare('SELECT * FROM causal_edges').all() as Array<Record<string, unknown>>;
  }

  const columns = new Set(getTableColumns(database, tableName));

  if (tableName === 'shared_spaces') {
    if (sharedSpaceIds.length > 0) {
      return batchedInQuery<Record<string, unknown>>(
        database,
        'SELECT * FROM shared_spaces WHERE space_id IN (__PLACEHOLDERS__)',
        sharedSpaceIds,
      );
    }
    if (normalizedScope.tenantId) {
      return database.prepare(
        'SELECT * FROM shared_spaces WHERE tenant_id = ?'
      ).all(normalizedScope.tenantId) as Array<Record<string, unknown>>;
    }
    return hasScope ? [] : database.prepare('SELECT * FROM shared_spaces').all() as Array<Record<string, unknown>>;
  }

  if (tableName === 'shared_space_members') {
    if (sharedSpaceIds.length > 0) {
      return batchedInQuery<Record<string, unknown>>(
        database,
        'SELECT * FROM shared_space_members WHERE space_id IN (__PLACEHOLDERS__)',
        sharedSpaceIds,
      );
    }
    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_members').all() as Array<Record<string, unknown>>;
  }

  if (tableName === 'shared_space_conflicts') {
    if (memoryIds.length > 0) {
      return dedupeRowsById([
        ...batchedInQuery<Record<string, unknown>>(
          database,
          `
            SELECT * FROM shared_space_conflicts
            WHERE existing_memory_id IN (__PLACEHOLDERS__)
          `,
          memoryIds,
        ),
        ...batchedInQuery<Record<string, unknown>>(
          database,
          `
            SELECT * FROM shared_space_conflicts
            WHERE incoming_memory_id IN (__PLACEHOLDERS__)
          `,
          memoryIds,
        ),
      ]);
    }
    if (sharedSpaceIds.length > 0) {
      return batchedInQuery<Record<string, unknown>>(
        database,
        'SELECT * FROM shared_space_conflicts WHERE space_id IN (__PLACEHOLDERS__)',
        sharedSpaceIds,
      );
    }
    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_conflicts').all() as Array<Record<string, unknown>>;
  }

  if (specFolder && columns.has('spec_folder')) {
    return database.prepare(
      `SELECT * FROM ${tableName} WHERE spec_folder = ?`
    ).all(specFolder) as Array<Record<string, unknown>>;
  }

  if (memoryIds.length > 0 && columns.has('memory_id')) {
    return batchedInQuery<Record<string, unknown>>(
      database,
      `SELECT * FROM ${tableName} WHERE memory_id IN (__PLACEHOLDERS__)`,
      memoryIds,
    );
  }

  if (memoryIds.length > 0 && tableName === 'memory_corrections') {
    return dedupeRowsById([
      ...batchedInQuery<Record<string, unknown>>(
        database,
        `
          SELECT * FROM memory_corrections
          WHERE original_memory_id IN (__PLACEHOLDERS__)
        `,
        memoryIds,
      ),
      ...batchedInQuery<Record<string, unknown>>(
        database,
        `
          SELECT * FROM memory_corrections
          WHERE correction_memory_id IN (__PLACEHOLDERS__)
        `,
        memoryIds,
      ),
    ]);
  }

  const allRows = database.prepare(`SELECT * FROM ${tableName}`).all() as Array<Record<string, unknown>>;
  if (!scopePredicate) {
    return allRows;
  }

  if (hasDirectScopeColumns(columns)) {
    return allRows.filter((row) => scopePredicate(row));
  }

  return [];
}

function createTableSnapshot(
  database: Database.Database,
  tableName: string,
  options: {
    specFolder: string | null;
    memoryIds: number[];
    sharedSpaceIds: string[];
    scope?: ScopeContext;
    allowedSharedSpaceIds?: ReadonlySet<string>;
  },
): TableSnapshot | null {
  if (!tableExists(database, tableName)) {
    return null;
  }

  const columns = getTableSnapshotColumns(database, tableName);
  if (columns.length === 0) {
    return null;
  }

  const rows = selectTableRows(database, tableName, options);
  return { columns, rows };
}

function buildCheckpointManifest(): CheckpointManifest {
  return {
    snapshot: [...CHECKPOINT_MANIFEST.snapshot],
    rebuild: [...CHECKPOINT_MANIFEST.rebuild],
    skip: [...CHECKPOINT_MANIFEST.skip],
  };
}

function buildLegacyTableSnapshots(snapshot: CheckpointSnapshot): Record<string, TableSnapshot> {
  const tableSnapshots: Record<string, TableSnapshot> = {};

  if (Array.isArray(snapshot.memories)) {
    tableSnapshots.memory_index = {
      columns: Object.keys(snapshot.memories[0] ?? {}),
      rows: snapshot.memories,
    };
  }

  if (Array.isArray(snapshot.workingMemory)) {
    tableSnapshots.working_memory = {
      columns: Object.keys(snapshot.workingMemory[0] ?? {}),
      rows: snapshot.workingMemory,
    };
  }

  if (Array.isArray(snapshot.vectors)) {
    tableSnapshots.vec_memories = {
      columns: ['rowid', 'embedding'],
      rows: snapshot.vectors.map((row) => ({
        rowid: row.rowid,
        embedding: row.embedding,
      })),
    };
  }

  if (Array.isArray(snapshot.causalEdges)) {
    tableSnapshots.causal_edges = {
      columns: Object.keys(snapshot.causalEdges[0] ?? {}),
      rows: snapshot.causalEdges,
    };
  }

  return tableSnapshots;
}

function getSnapshotTables(snapshot: CheckpointSnapshot): Record<string, TableSnapshot> {
  const legacyTables = buildLegacyTableSnapshots(snapshot);
  return {
    ...legacyTables,
    ...(snapshot.tables ?? {}),
  };
}

function clearTable(database: Database.Database, tableName: string): void {
  if (!tableExists(database, tableName)) {
    return;
  }

  if (tableName === 'memory_fts') {
    database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('delete-all')`);
    return;
  }

  if (tableName === 'mutation_ledger') {
    database.exec('DROP TRIGGER IF EXISTS prevent_ledger_update');
    database.exec('DROP TRIGGER IF EXISTS prevent_ledger_delete');
    database.prepare('DELETE FROM mutation_ledger').run();
    database.exec(MUTATION_LEDGER_TRIGGER_SQL);
    return;
  }

  database.prepare(`DELETE FROM ${tableName}`).run();
}

function clearTableForRestoreScope(
  database: Database.Database,
  tableName: string,
  options: {
    checkpointSpecFolder: string | null;
    memoryIds: number[];
    sharedSpaceIds: string[];
    edgeIds: number[];
    scope?: ScopeContext;
    allowFullTableFallback?: boolean;
  },
): void {
  const {
    checkpointSpecFolder,
    memoryIds,
    sharedSpaceIds,
    edgeIds,
    scope = {},
    allowFullTableFallback = true,
  } = options;
  const normalizedScope = normalizeScopeContext(scope);
  const hasScope = hasScopeConstraints(normalizedScope);
  if (!tableExists(database, tableName)) {
    return;
  }

  if (!checkpointSpecFolder && !hasScope && allowFullTableFallback) {
    clearTable(database, tableName);
    return;
  }

  const columns = new Set(getTableColumns(database, tableName));
  const { clauses: scopedClauses, params: scopedParams } = buildRestoreScopeDeleteWhere(
    columns,
    checkpointSpecFolder,
    normalizedScope,
  );

  if (tableName === 'memory_index') {
    if (scopedClauses.length > 0) {
      database.prepare(`DELETE FROM memory_index WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
    }
    return;
  }

  if (tableName === 'vec_memories') {
    deleteRowsByIds(database, 'vec_memories', 'rowid', memoryIds);
    return;
  }

  if (tableName === 'causal_edges') {
    deleteCausalEdgesForMemoryIds(database, memoryIds);
    return;
  }

  if (tableName === 'shared_spaces') {
    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
    return;
  }

  if (tableName === 'shared_space_members') {
    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
    return;
  }

  if (tableName === 'shared_space_conflicts') {
    if (sharedSpaceIds.length > 0) {
      deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
    }
    if (memoryIds.length > 0) {
      deleteRowsByIds(database, tableName, 'existing_memory_id', memoryIds);
      deleteRowsByIds(database, tableName, 'incoming_memory_id', memoryIds);
    }
    return;
  }

  if (tableName === 'memory_corrections') {
    if (memoryIds.length === 0) {
      return;
    }
    deleteRowsByIds(database, tableName, 'original_memory_id', memoryIds);
    deleteRowsByIds(database, tableName, 'correction_memory_id', memoryIds);
    return;
  }

  if (tableName === 'weight_history') {
    deleteRowsByIds(database, tableName, 'edge_id', edgeIds);
    return;
  }

  if (scopedClauses.length > 0) {
    database.prepare(`DELETE FROM ${tableName} WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
    return;
  }

  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
    return;
  }

  if (columns.has('spec_folder')) {
    database.prepare(`DELETE FROM ${tableName} WHERE spec_folder = ?`).run(checkpointSpecFolder);
    return;
  }

  if (memoryIds.length > 0 && columns.has('memory_id')) {
    deleteRowsByIds(database, tableName, 'memory_id', memoryIds);
    return;
  }

  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
    return;
  }

  if (!hasScope && allowFullTableFallback) {
    clearTable(database, tableName);
  }
}

function clearDerivedTablesForRestore(
  database: Database.Database,
  options: {
    checkpointSpecFolder: string | null;
    memoryIds: number[];
    scope?: ScopeContext;
  },
): void {
  const { checkpointSpecFolder, memoryIds, scope = {} } = options;
  const hasScope = hasScopeConstraints(normalizeScopeContext(scope));

  for (const tableName of CHECKPOINT_MANIFEST.rebuild) {
    if (!tableExists(database, tableName)) {
      continue;
    }

    if (!checkpointSpecFolder && !hasScope) {
      clearTable(database, tableName);
      continue;
    }

    if (tableName === 'entity_catalog') {
      continue;
    }

    if (tableName === 'memory_fts') {
      continue;
    }

    const columns = new Set(getTableColumns(database, tableName));
    if (memoryIds.length > 0 && columns.has('memory_id')) {
      deleteRowsByIds(database, tableName, 'memory_id', memoryIds);
      continue;
    }

    if (!hasScope) {
      clearTable(database, tableName);
    }
  }
}

function restoreMergeTableAtomically(
  database: Database.Database,
  tableName: string,
  tableSnapshot: TableSnapshot,
  options: {
    checkpointSpecFolder: string | null;
    memoryIds: number[];
    sharedSpaceIds: string[];
    edgeIds: number[];
    scope: ScopeContext;
  },
): { restoredCount: number; error?: string } {
  const savepointName = `checkpoint_merge_${tableName.replace(/[^a-z0-9_]/gi, '_')}`;

  database.exec(`SAVEPOINT ${savepointName}`);
  try {
    clearTableForRestoreScope(database, tableName, {
      ...options,
      allowFullTableFallback: false,
    });
    const restoredCount = restoreGenericTable(database, tableName, tableSnapshot);
    database.exec(`RELEASE SAVEPOINT ${savepointName}`);
    return { restoredCount };
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    try {
      database.exec(`ROLLBACK TO SAVEPOINT ${savepointName}`);
    } finally {
      try {
        database.exec(`RELEASE SAVEPOINT ${savepointName}`);
      } catch {
        // Ignore follow-up release errors after rollback.
      }
    }
    return {
      restoredCount: 0,
      error: `${tableName}: merge restore rolled back after pre-clear because reinsertion failed: ${msg}`,
    };
  }
}

function ensureWorkingMemorySchema(database: Database.Database): void {
  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS working_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        memory_id INTEGER,
        attention_score REAL DEFAULT 1.0,
        added_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
        focus_count INTEGER DEFAULT 1,
        event_counter INTEGER NOT NULL DEFAULT 0,
        mention_count INTEGER NOT NULL DEFAULT 0,
        source_tool TEXT,
        source_call_id TEXT,
        extraction_rule_id TEXT,
        redaction_applied INTEGER NOT NULL DEFAULT 0,
        UNIQUE(session_id, memory_id),
        FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
      )
    `);

    const wmColumns = (database.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    if (!wmColumns.includes('event_counter')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
    }
    if (!wmColumns.includes('mention_count')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
    }
    if (!wmColumns.includes('source_tool')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
    }
    if (!wmColumns.includes('source_call_id')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
    }
    if (!wmColumns.includes('extraction_rule_id')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
    }
    if (!wmColumns.includes('redaction_applied')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
    }
  } catch (_error: unknown) {
    // Best-effort schema preparation only.
  }
}

function restoreGenericTable(
  database: Database.Database,
  tableName: string,
  tableSnapshot: TableSnapshot,
): number {
  if (!tableExists(database, tableName)) {
    return 0;
  }

  const columns = tableSnapshot.columns.length > 0
    ? tableSnapshot.columns
    : Object.keys(tableSnapshot.rows[0] ?? {});
  if (columns.length === 0 || tableSnapshot.rows.length === 0) {
    return 0;
  }

  const placeholders = columns.map(() => '?').join(', ');
  const insertVerb = tableName === 'vec_memories' ? 'INSERT' : 'INSERT OR REPLACE';
  const insertStmt = database.prepare(`
    ${insertVerb} INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
  `) as Database.Statement;
  const deleteVecById = tableName === 'vec_memories'
    ? database.prepare('DELETE FROM vec_memories WHERE rowid = ?') as Database.Statement
    : null;

  let restored = 0;
  for (const row of tableSnapshot.rows) {
    const values = columns.map((column) => deserializeSnapshotValue(row[column]));
    if (deleteVecById) {
      deleteVecById.run(row.rowid);
    }
    insertStmt.run(...values);
    restored++;
  }
  return restored;
}

function runPostRestoreRebuilds(
  database: Database.Database,
  checkpointSpecFolder: string | null,
): void {
  const hasMemoryParentId = tableHasColumn(database, 'memory_index', 'parent_id');

  // Each rebuild is best-effort — failures must not block restore success.
  const rebuildSteps: Array<{ name: string; deps: string[]; run: () => void }> = [
    {
      name: 'auto-entities',
      deps: ['lineage-backfill'],
      run: () => rebuildAutoEntities(database, { specFolder: checkpointSpecFolder ?? undefined }),
    },
    {
      name: 'degree-snapshots',
      deps: ['lineage-backfill'],
      run: () => snapshotDegrees(database),
    },
    {
      name: 'community-artifacts',
      deps: ['degree-snapshots'],
      run: () => {
        const communities = detectCommunities(database);
        storeCommunities(database, communities);
        storeCommunityAssignments(database, communities);
        generateCommunitySummaries(database, communities);
      },
    },
    {
      name: 'fts-rebuild',
      deps: ['lineage-backfill', 'auto-entities'],
      run: () => {
        if (tableExists(database, 'memory_fts')) {
          database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`);
        }
      },
    },
  ];

  if (hasMemoryParentId) {
    rebuildSteps.unshift({
      name: 'lineage-backfill',
      deps: [],
      run: () => runLineageBackfill(database, { actor: 'mcp:checkpoint_restore' }),
    });
  }

  const completed = new Set<string>();
  const skipped = new Set<string>();

  for (const { name, deps, run } of rebuildSteps) {
    const missingDeps = deps.filter((dependency) => !completed.has(dependency));
    if (missingDeps.length > 0) {
      skipped.add(name);
      console.warn(
        `[checkpoints] Skipping post-restore rebuild "${name}" because dependencies did not complete: ${missingDeps.join(', ')}`,
      );
      continue;
    }

    try {
      run();
      completed.add(name);
    } catch (err: unknown) {
      console.warn(`[checkpoints] Post-restore rebuild "${name}" failed (non-fatal): ${toErrorMessage(err)}`);
    }
  }

  console.warn(
    `[checkpoints] Post-restore rebuild summary: completed=${[...completed].join(', ') || 'none'}; skipped=${[...skipped].join(', ') || 'none'}`,
  );
}

function normalizeMemoryColumnValue(column: string, value: unknown): unknown {
  if (value === undefined) {
    if (column === 'confidence') return 0.5;
    if (column === 'stability') return 1.0;
    if (column === 'difficulty') return 5.0;
    if (column === 'review_count') return 0;
    return null;
  }

  if (column === 'confidence') {
    return Number.isFinite(value) ? value : 0.5;
  }
  if (column === 'stability') {
    return Number.isFinite(value) ? value : 1.0;
  }
  if (column === 'difficulty') {
    return Number.isFinite(value) ? value : 5.0;
  }
  if (column === 'review_count') {
    return Number.isFinite(value) ? value : 0;
  }

  if ((column === 'trigger_phrases' || column === 'quality_flags') && Array.isArray(value)) {
    return JSON.stringify(value);
  }

  return value;
}

function getMemoryRestoreColumns(
  database: Database.Database,
  memories: Array<Record<string, unknown>>
): string[] {
  const tableColumns = new Set(getTableColumns(database, 'memory_index'));
  if (tableColumns.size === 0) {
    return [];
  }

  const snapshotColumns = new Set<string>();
  for (const memory of memories) {
    for (const key of Object.keys(memory)) {
      if (tableColumns.has(key)) {
        snapshotColumns.add(key);
      }
    }
  }

  const preferredOrder = [
    'id',
    'spec_folder',
    'file_path',
    'canonical_file_path',
    'anchor_id',
    'title',
    'trigger_phrases',
    'importance_weight',
    'created_at',
    'updated_at',
    'embedding_model',
    'embedding_generated_at',
    'embedding_status',
    'retry_count',
    'last_retry_at',
    'failure_reason',
    'base_importance',
    'decay_half_life_days',
    'is_pinned',
    'access_count',
    'last_accessed',
    'importance_tier',
    'session_id',
    'context_type',
    'channel',
    'content_hash',
    'expires_at',
    'confidence',
    'validation_count',
    'stability',
    'difficulty',
    'last_review',
    'review_count',
    'file_mtime_ms',
    'is_archived',
    'document_type',
    'spec_level',
    'content_text',
    'quality_score',
    'quality_flags',
    'parent_id',
    'chunk_index',
    'chunk_label',
  ];

  const ordered = preferredOrder.filter((column) => snapshotColumns.has(column));
  const extras = Array.from(snapshotColumns)
    .filter((column) => !ordered.includes(column))
    .sort((a, b) => a.localeCompare(b));

  return [...ordered, ...extras];
}

/* ───────────────────────────────────────────────────────────────
   6. T107 FIX: CHECKPOINT SCHEMA VALIDATION
   Validate each memory row before restore to prevent silent data
   loss from corrupt/malformed checkpoint snapshots.
----------------------------------------------------------------*/

/**
 * Validates a single memory row from a checkpoint snapshot.
 * Throws on invalid data — caller should reject the entire restore.
 *
 * Strict on identity fields (id, file_path, spec_folder).
 * Required-but-lenient on INSERT-needed fields (must be present, type flexible).
 * Optional fields (anchor_id, embedding_*, etc.) may be null/undefined for
 * backwards compatibility with older checkpoint formats.
 */
function validateMemoryRow(row: unknown, index: number): void {
  if (!row || typeof row !== 'object') {
    throw new Error(`Checkpoint row ${index}: not an object (got ${typeof row})`);
  }
  const r = row as Record<string, unknown>;

  // --- Strict identity fields (core to INSERT and data integrity) ---
  if (typeof r.id !== 'number' || !Number.isFinite(r.id)) {
    throw new Error(`Checkpoint row ${index}: id must be a finite number, got ${typeof r.id} (${String(r.id)})`);
  }
  if (typeof r.file_path !== 'string' || !r.file_path) {
    throw new Error(`Checkpoint row ${index}: file_path must be non-empty string, got ${typeof r.file_path}`);
  }
  if (typeof r.spec_folder !== 'string' || !r.spec_folder) {
    throw new Error(`Checkpoint row ${index}: spec_folder must be non-empty string, got ${typeof r.spec_folder}`);
  }

  // --- Required fields for INSERT (must be present; type flexibility for compat) ---
  const requiredFields = ['title', 'importance_weight', 'created_at', 'updated_at', 'importance_tier'];
  for (const field of requiredFields) {
    if (r[field] === undefined) {
      throw new Error(`Checkpoint row ${index}: missing required field '${field}'`);
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   7. CHECKPOINT OPERATIONS
----------------------------------------------------------------*/

function createCheckpoint(options: CreateCheckpointOptions = {}): CheckpointInfo | null {
  const database = getDatabase();

  const {
    name = `checkpoint-${Date.now()}`,
    specFolder = null,
    includeEmbeddings: _includeEmbeddings = true,
    metadata = {},
    scope = {},
  } = options;

  try {
    // Wrap snapshot SELECTs + INSERT + overflow DELETE in a transaction for atomicity
    const checkpointInfo = database.transaction(() => {
      const {
        memories,
        memoryIds: scopedMemoryIds,
        allowedSharedSpaceIds,
        normalizedScope,
      } = getScopedMemories(database, specFolder, scope);
      const sharedSpaceIds = Array.from(new Set([
        ...getSharedSpaceIdsFromMemories(memories),
        ...allowedSharedSpaceIds,
      ]));
      const tables: Record<string, TableSnapshot> = {};

      for (const tableName of CHECKPOINT_MANIFEST.snapshot) {
        if (!_includeEmbeddings && (tableName === 'vec_memories' || tableName === 'vec_metadata')) {
          continue;
        }

        const tableSnapshot = createTableSnapshot(database, tableName, {
          specFolder,
          memoryIds: scopedMemoryIds,
          sharedSpaceIds,
          scope: normalizedScope,
          allowedSharedSpaceIds,
        });
        if (!tableSnapshot) {
          continue;
        }
        tables[tableName] = tableSnapshot;
      }

      const vectorRows = tables.vec_memories?.rows ?? [];
      const workingMemorySnapshot = tables.working_memory?.rows ?? [];
      const causalEdgesSnapshot = tables.causal_edges?.rows ?? [];
      const vectors = vectorRows.map((row) => ({
        rowid: Number(row.rowid),
        embedding: toBuffer(row.embedding),
      })).filter((row) => Number.isFinite(row.rowid));

      const snapshot: CheckpointSnapshot = {
        manifest: buildCheckpointManifest(),
        tables,
        memories,
        workingMemory: workingMemorySnapshot,
        vectors,
        causalEdges: causalEdgesSnapshot,
        timestamp: new Date().toISOString(),
      };

      const snapshotJson = JSON.stringify(snapshot);
      const compressed = zlib.gzipSync(Buffer.from(snapshotJson));

      const gitBranch = getGitBranch();
      const now = new Date().toISOString();

      const result = (database.prepare(`
        INSERT INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
      `) as Database.Statement).run(
        name,
        now,
        specFolder,
        gitBranch,
        compressed,
        JSON.stringify({
          ...metadata,
          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
          memoryCount: memories.length,
          vectorCount: vectors.length,
          includeEmbeddings: _includeEmbeddings,
          manifest: buildCheckpointManifest(),
        })
      );

      // Enforce max checkpoints
      const checkpointCount = (database.prepare(
        'SELECT COUNT(*) as count FROM checkpoints'
      ) as Database.Statement).get() as { count: number };

      if (checkpointCount.count > MAX_CHECKPOINTS) {
        database.prepare(`
          DELETE FROM checkpoints WHERE id IN (
            SELECT id FROM checkpoints ORDER BY created_at ASC LIMIT ?
          )
        `).run(checkpointCount.count - MAX_CHECKPOINTS);
      }

      return {
        id: (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number,
        name,
        createdAt: now,
        specFolder,
        gitBranch,
        snapshotSize: compressed.length,
        metadata: {
          ...metadata,
          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
          memoryCount: memories.length,
        },
      };
    })();

    console.error(`[checkpoints] Created checkpoint "${name}" (${checkpointInfo.snapshotSize} bytes compressed)`);

    return checkpointInfo;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] createCheckpoint error: ${msg}`);
    return null;
  }
}

function listCheckpoints(
  specFolder: string | null = null,
  limit: number = 50,
  scope: ScopeContext = {},
): CheckpointInfo[] {
  const database = getDatabase();

  try {
    const folderFilter = specFolder ? 'WHERE spec_folder = ?' : '';
    const params: Array<string | number> = specFolder ? [specFolder] : [];
    params.push(limit);

    const rows = database.prepare(`
      SELECT id, name, created_at, spec_folder, git_branch, LENGTH(memory_snapshot) as snapshot_size, metadata
      FROM checkpoints ${folderFilter}
      ORDER BY created_at DESC
      LIMIT ?
    `).all(...params) as Array<Record<string, unknown>>;

    return rows
      .filter((row) => checkpointMetadataMatchesScope(row.metadata, scope))
      .map(row => ({
      id: row.id as number,
      name: row.name as string,
      createdAt: row.created_at as string,
      specFolder: row.spec_folder as string | null,
      gitBranch: row.git_branch as string | null,
      snapshotSize: (row.snapshot_size as number) || 0,
      metadata: row.metadata ? JSON.parse(row.metadata as string) : {},
      }));
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] listCheckpoints error: ${msg}`);
    return [];
  }
}

function getCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): CheckpointEntry | null {
  const database = getDatabase();

  try {
    const row = typeof nameOrId === 'number'
      ? database.prepare('SELECT * FROM checkpoints WHERE id = ?').get(nameOrId)
      : database.prepare('SELECT * FROM checkpoints WHERE name = ?').get(nameOrId);

    const checkpoint = (row as CheckpointEntry) || null;
    if (checkpoint && !checkpointMetadataMatchesScope(checkpoint.metadata, scope)) {
      return null;
    }
    return checkpoint;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] getCheckpoint error: ${msg}`);
    return null;
  }
}

function restoreCheckpoint(
  nameOrId: string | number,
  clearExisting: boolean = false,
  scope: ScopeContext = {},
): RestoreResult {
  const database = getDatabase();
  const result: RestoreResult = {
    restored: 0,
    skipped: 0,
    errors: [],
    workingMemoryRestored: 0,
    partialFailure: false,
    rolledBackTables: [],
  };

  let restoreBarrierHeld = false;

  try {
    const checkpoint = getCheckpoint(nameOrId, scope);
    if (!checkpoint || !checkpoint.memory_snapshot) {
      result.errors.push('Checkpoint not found or empty');
      return result;
    }

    // Decompress snapshot
    const decompressed = zlib.gunzipSync(checkpoint.memory_snapshot);
    const snapshot = JSON.parse(decompressed.toString()) as CheckpointSnapshot;
    const tableSnapshots = getSnapshotTables(snapshot);
    const memorySnapshot = tableSnapshots.memory_index;
    const memoryRows = memorySnapshot?.rows ?? snapshot.memories;

    if (!Array.isArray(memoryRows)) {
      result.errors.push('Invalid snapshot format');
      return result;
    }

    const checkpointSpecFolder = checkpoint.spec_folder ?? null;
    const snapshotMemoryIds = getMemoryIds(memoryRows);
    const { normalizedScope, allowedSharedSpaceIds } = getScopeFilterContext(database, scope);
    const currentScopedMemoryIds = checkpointSpecFolder
      ? getCurrentScopedMemoryIds(database, checkpointSpecFolder, normalizedScope)
      : getCurrentScopedMemoryIds(database, null, normalizedScope);
    const scopedMemoryIdsToReplace = Array.from(
      new Set([...currentScopedMemoryIds, ...snapshotMemoryIds])
    );
    const currentScopedSharedSpaceIds = checkpointSpecFolder
      ? []
      : getSharedSpaceIdsFromMemories(
        getScopedMemories(database, null, normalizedScope).memories,
      );
    const sharedSpaceIds = Array.from(new Set([
      ...getSharedSpaceIdsFromMemories(memoryRows),
      ...currentScopedSharedSpaceIds,
      ...allowedSharedSpaceIds,
    ]));
    const edgeIds = getEdgeIds(tableSnapshots.causal_edges?.rows ?? []);

    // T107 FIX: Validate every row BEFORE any DB mutations.
    // Reject the entire restore on schema violations to prevent
    // Partial restores or silent NULL insertions.
    if (memoryRows.length > 0) {
      try {
        for (let i = 0; i < memoryRows.length; i++) {
          validateMemoryRow(memoryRows[i], i);
        }
      } catch (validationError: unknown) {
        const msg = toErrorMessage(validationError);
        result.errors.push(`Schema validation failed: ${msg}`);
        return result;
      }
    }

    const memoryRestoreColumns = memoryRows.length > 0
      ? getMemoryRestoreColumns(database, memoryRows)
      : [];
    if (memoryRows.length > 0 && memoryRestoreColumns.length === 0) {
      result.errors.push('No compatible memory_index columns found for restore');
      return result;
    }

    // P0-005 FIX: Split INSERT strategy by restore mode.
    // ClearExisting mode: INSERT OR REPLACE is safe (table was already emptied).
    // Merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
    // Via the FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE.
    // Use INSERT OR IGNORE + explicit UPDATE to avoid the delete-reinsert cycle.
    const memoryInsertStmt = memoryRestoreColumns.length > 0
      ? database.prepare(`
          INSERT OR ${clearExisting ? 'REPLACE' : 'IGNORE'} INTO memory_index (${memoryRestoreColumns.join(', ')})
          VALUES (${memoryRestoreColumns.map(() => '?').join(', ')})
        `) as Database.Statement
      : null;

    const nonIdColumns = memoryRestoreColumns.filter(c => c !== 'id');
    const memoryUpdateStmt = (!clearExisting && nonIdColumns.length > 0)
      ? database.prepare(`
          UPDATE memory_index SET ${nonIdColumns.map(c => `${c} = ?`).join(', ')}
          WHERE id = ?
        `) as Database.Statement
      : null;

    // Ensure working_memory table schema is ready BEFORE the transaction.
    // DDL (CREATE TABLE, ALTER TABLE) causes SQLite to auto-commit, which would
    // Corrupt a surrounding transaction. Run DDL outside the transaction boundary.
    if (tableSnapshots.working_memory) {
      ensureWorkingMemorySchema(database);
    }

    acquireRestoreBarrier();
    restoreBarrierHeld = true;

    // T101 FIX: Transaction-wrap checkpoint restore to prevent data loss.
    // When clearExisting=true, the DELETE and all INSERTs must be atomic.
    // If any INSERT fails after DELETE, ROLLBACK restores original data.
    // Previously, individual insert errors were silently swallowed inside
    // The transaction, allowing COMMIT after DELETE + partial inserts = data loss.
    const restoreTx = database.transaction(() => {
      // Clear existing data if requested
      if (clearExisting) {
        try {
          clearDerivedTablesForRestore(database, {
            checkpointSpecFolder,
            memoryIds: scopedMemoryIdsToReplace,
            scope: normalizedScope,
          });
          for (const tableName of CHECKPOINT_CLEAR_ORDER) {
            if (!tableSnapshots[tableName]) {
              continue;
            }
            try {
              clearTableForRestoreScope(database, tableName, {
                checkpointSpecFolder,
                memoryIds: scopedMemoryIdsToReplace,
                sharedSpaceIds,
                edgeIds,
                scope: normalizedScope,
              });
            } catch (tableError: unknown) {
              throw new Error(`${tableName}: ${toErrorMessage(tableError)}`);
            }
          }
        } catch (error: unknown) {
          const msg = toErrorMessage(error);
          result.errors.push(`Restore clearExisting cleanup failed: ${msg}`);
          throw error;
        }
      }

      const txErrors: string[] = [];
      const rolledBackTables = new Set<string>();
      const restoredMemoryIds = new Set<number>();

      for (const memory of memoryRows) {
        try {
          // P4-11 FIX: When clearExisting=false, check for duplicate logical key
          // (spec_folder + file_path + anchor_id) before inserting.
          if (!clearExisting) {
            const existingByPath = database.prepare(
              `
                SELECT id FROM memory_index
                WHERE spec_folder = ?
                  AND file_path = ?
                  AND (
                    (anchor_id IS NULL AND ? IS NULL)
                    OR anchor_id = ?
                  )
                  AND id != ?
              `
            ).get(
              memory.spec_folder,
              memory.file_path,
              memory.anchor_id ?? null,
              memory.anchor_id ?? null,
              memory.id
            ) as { id: number } | undefined;

            if (existingByPath) {
              console.error(
                `[checkpoints] Skipping restore of memory ${memory.id}: identity "${memory.spec_folder}:${memory.file_path}:${String(memory.anchor_id ?? '')}" already exists as memory ${existingByPath.id}`
              );
              result.skipped++;
              continue;
            }

            // Protect merge mode from primary-key collision overwrite.
            // If the snapshot ID already exists for a different logical identity,
            // Skip this row instead of applying UPDATE ... WHERE id = ?.
            const existingById = database.prepare(
              `
                SELECT spec_folder, file_path, anchor_id
                FROM memory_index
                WHERE id = ?
              `
            ).get(memory.id) as {
              spec_folder: string;
              file_path: string;
              anchor_id: string | null;
            } | undefined;

            if (existingById) {
              const existingAnchor = existingById.anchor_id ?? null;
              const incomingAnchor = memory.anchor_id ?? null;
              const sameIdentity = (
                existingById.spec_folder === memory.spec_folder
                && existingById.file_path === memory.file_path
                && existingAnchor === incomingAnchor
              );
              if (!sameIdentity) {
                console.error(
                  `[checkpoints] Skipping restore of memory ${memory.id}: id collision with existing identity "${existingById.spec_folder}:${existingById.file_path}:${String(existingById.anchor_id ?? '')}"`
                );
                result.skipped++;
                continue;
              }
            }
          }

          if (!memoryInsertStmt) {
            txErrors.push(`Memory ${memory.id}: restore statement unavailable`);
            result.skipped++;
            continue;
          }

          const values = memoryRestoreColumns.map((column) =>
            normalizeMemoryColumnValue(column, memory[column as keyof typeof memory])
          );
          const insertResult = memoryInsertStmt.run(...values) as { changes: number };

          // P0-005: In merge mode, INSERT OR IGNORE returns changes=0 when
          // The row already exists. Follow up with an explicit UPDATE to
          // Apply the snapshot values without triggering CASCADE deletes.
          if (!clearExisting && insertResult.changes === 0 && memoryUpdateStmt) {
            const updateValues = nonIdColumns.map((column) =>
              normalizeMemoryColumnValue(column, memory[column as keyof typeof memory])
            );
            updateValues.push(memory.id); // WHERE id = ?
            memoryUpdateStmt.run(...updateValues);
          }

          restoredMemoryIds.add(memory.id as number);
          result.restored++;
        } catch (e: unknown) {
          const msg = toErrorMessage(e);
          txErrors.push(`Memory ${memory.id}: ${msg}`);
          result.skipped++;
        }
      }

      for (const tableName of CHECKPOINT_RESTORE_ORDER) {
        if (tableName === 'memory_index') {
          continue;
        }

        const tableSnapshot = tableSnapshots[tableName];
        if (!tableSnapshot) {
          continue;
        }

        try {
          let restoredCount = 0;
          // In merge mode, replace only the in-scope rows captured by the checkpoint.
          if (!clearExisting && tableSnapshot.rows.length > 0) {
            const mergeResult = restoreMergeTableAtomically(database, tableName, tableSnapshot, {
              checkpointSpecFolder,
              memoryIds: scopedMemoryIdsToReplace,
              sharedSpaceIds,
              edgeIds,
              scope: normalizedScope,
            });
            if (mergeResult.error) {
              rolledBackTables.add(tableName);
              txErrors.push(mergeResult.error);
              continue;
            }
            restoredCount = mergeResult.restoredCount;
          } else {
            restoredCount = restoreGenericTable(database, tableName, tableSnapshot);
          }
          if (tableName === 'working_memory') {
            result.workingMemoryRestored += restoredCount;
          }
        } catch (e: unknown) {
          const msg = toErrorMessage(e);
          txErrors.push(`${tableName}: ${msg}`);
        }
      }

      // When clearExisting=true, any insert error means data loss risk.
      // Throw to trigger ROLLBACK — this undoes both the DELETEs and partial INSERTs,
      // Leaving original data intact.
      if (clearExisting && txErrors.length > 0) {
        // Reset counters — ROLLBACK will undo all DB changes
        result.restored = 0;
        result.skipped = 0;
        result.workingMemoryRestored = 0;
        result.errors = txErrors;
        throw new Error(
          `Restore aborted: ${txErrors.length} error(s) during restore with clearExisting=true. ` +
          `Transaction rolled back to prevent data loss. First error: ${txErrors[0]}`
        );
      }

      // For non-clearExisting, partial failures are acceptable (no data was deleted)
      if (txErrors.length > 0) {
        result.partialFailure = true;
        result.rolledBackTables = Array.from(rolledBackTables);
        result.errors.push(...txErrors);
      }
    });

    restoreTx();
    runPostRestoreRebuilds(database, checkpointSpecFolder);

    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    result.errors.push(msg);
    console.warn(`[checkpoints] restoreCheckpoint error: ${msg}`);
  } finally {
    if (restoreBarrierHeld) {
      releaseRestoreBarrier();
    }
  }

  return result;
}

function deleteCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): boolean {
  const database = getDatabase();

  try {
    const checkpoint = getCheckpoint(nameOrId, scope);
    if (!checkpoint) {
      return false;
    }

    const result = typeof nameOrId === 'number'
      ? (database.prepare('DELETE FROM checkpoints WHERE id = ?') as Database.Statement).run(nameOrId)
      : (database.prepare('DELETE FROM checkpoints WHERE name = ?') as Database.Statement).run(nameOrId);

    return (result as { changes: number }).changes > 0;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] deleteCheckpoint error: ${msg}`);
    return false;
  }
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
----------------------------------------------------------------*/

export {
  MAX_CHECKPOINTS,

  init,
  getDatabase,
  getGitBranch,
  isRestoreInProgress,
  getRestoreBarrierStatus,
  setRestoreBarrierHooks,
  validateMemoryRow,
  createCheckpoint,
  listCheckpoints,
  getCheckpoint,
  restoreCheckpoint,
  deleteCheckpoint,
  RESTORE_IN_PROGRESS_ERROR_CODE,
  RESTORE_IN_PROGRESS_ERROR_MESSAGE,
};

/**
 * Re-exports related public types.
 */
export type {
  CheckpointEntry,
  CheckpointInfo,
  CreateCheckpointOptions,
  RestoreResult,
};
