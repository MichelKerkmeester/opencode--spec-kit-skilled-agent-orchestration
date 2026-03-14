// ───────────────────────────────────────────────────────────────
// 1. CHECKPOINTS
// ───────────────────────────────────────────────────────────────
// Gzip-compressed database checkpoints with embedding preservation
// Node stdlib
import * as zlib from 'zlib';

// External packages
import type Database from 'better-sqlite3';

// Internal utils
import { toErrorMessage } from '../../utils/db-helpers';
import { bulkInsertEdges, deleteEdgesForMemory, type RelationType } from './causal-edges';
import { recordHistory } from './history';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const MAX_CHECKPOINTS = 10;

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
}

interface RestoreResult {
  restored: number;
  skipped: number;
  errors: string[];
  workingMemoryRestored: number;
}

interface SnapshotVectorRow {
  rowid: number;
  embedding: Buffer | null;
}

interface CheckpointSnapshot {
  memories: Array<Record<string, unknown>>;
  workingMemory: Array<Record<string, unknown>>;
  vectors?: SnapshotVectorRow[];
  causalEdges?: Array<Record<string, unknown>>;
  timestamp: string;
}

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

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

function getTableColumns(database: Database.Database, tableName: string): string[] {
  try {
    return (database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>)
      .map((column) => column.name)
      .filter((name) => typeof name === 'string' && name.length > 0);
  } catch (_error: unknown) {
    return [];
  }
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

function getCurrentMemoryIdsForSpecFolder(database: Database.Database, specFolder: string): number[] {
  try {
    const rows = database.prepare(
      'SELECT id FROM memory_index WHERE spec_folder = ?'
    ).all(specFolder) as Array<{ id: number | string }>;
    return getMemoryIds(rows as Array<Record<string, unknown>>);
  } catch (_error: unknown) {
    return [];
  }
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

  const placeholders = ids.map(() => '?').join(', ');
  database.prepare(
    `DELETE FROM ${tableName} WHERE ${columnName} IN (${placeholders})`
  ).run(...ids);
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
    const placeholders = edgeIds.map(() => '?').join(', ');
    return database.prepare(
      `
        SELECT * FROM causal_edges
        WHERE source_id IN (${placeholders})
           OR target_id IN (${placeholders})
      `
    ).all(...edgeIds, ...edgeIds) as Array<Record<string, unknown>>;
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
  } = options;

  try {
    // Wrap snapshot SELECTs + INSERT + overflow DELETE in a transaction for atomicity
    const checkpointInfo = database.transaction(() => {
      // Snapshot memory_index
      const folderFilter = specFolder ? 'WHERE spec_folder = ?' : '';
      const params = specFolder ? [specFolder] : [];

      const memories = database.prepare(
        `SELECT * FROM memory_index ${folderFilter}`
      ).all(...params) as Array<Record<string, unknown>>;
      const scopedMemoryIds = getMemoryIds(memories);

      // Snapshot vectors from vec_memories when enabled/available.
      // This preserves semantic search state across clearExisting restores.
      let vectors: SnapshotVectorRow[] = [];
      if (_includeEmbeddings && tableExists(database, 'vec_memories')) {
        try {
          const vectorSql = specFolder
            ? `
                SELECT v.rowid as rowid, v.embedding as embedding
                FROM vec_memories v
                JOIN memory_index m ON m.id = v.rowid
                WHERE m.spec_folder = ?
              `
            : 'SELECT rowid, embedding FROM vec_memories';
          const vectorParams = specFolder ? [specFolder] : [];
          vectors = database.prepare(vectorSql).all(...vectorParams) as SnapshotVectorRow[];
        } catch (_error: unknown) {
          vectors = [];
        }
      }

      // Snapshot working memory if exists
      let workingMemorySnapshot: Array<Record<string, unknown>> = [];
      try {
        const workingMemoryColumns = getTableColumns(database, 'working_memory');
        if (specFolder && workingMemoryColumns.includes('memory_id')) {
          if (scopedMemoryIds.length > 0) {
            const placeholders = scopedMemoryIds.map(() => '?').join(', ');
            workingMemorySnapshot = database.prepare(
              `SELECT * FROM working_memory WHERE memory_id IN (${placeholders})`
            ).all(...scopedMemoryIds) as Array<Record<string, unknown>>;
          }
        } else {
          workingMemorySnapshot = database.prepare(
            'SELECT * FROM working_memory'
          ).all() as Array<Record<string, unknown>>;
        }
      } catch (_error: unknown) {
        // Table may not exist
      }

      // Snapshot causal_edges if exists
      let causalEdgesSnapshot: Array<Record<string, unknown>> = [];
      if (tableExists(database, 'causal_edges')) {
        try {
          causalEdgesSnapshot = specFolder
            ? snapshotCausalEdgesForMemoryIds(database, scopedMemoryIds)
            : database.prepare(
              'SELECT * FROM causal_edges'
            ).all() as Array<Record<string, unknown>>;
        } catch (_error: unknown) {
          // Table may not exist or be empty
        }
      }

      const snapshot: CheckpointSnapshot = {
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
          memoryCount: memories.length,
          vectorCount: vectors.length,
          includeEmbeddings: _includeEmbeddings,
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
        metadata: { ...metadata, memoryCount: memories.length },
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

function listCheckpoints(specFolder: string | null = null, limit: number = 50): CheckpointInfo[] {
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

    return rows.map(row => ({
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

function getCheckpoint(nameOrId: string | number): CheckpointEntry | null {
  const database = getDatabase();

  try {
    const row = typeof nameOrId === 'number'
      ? database.prepare('SELECT * FROM checkpoints WHERE id = ?').get(nameOrId)
      : database.prepare('SELECT * FROM checkpoints WHERE name = ?').get(nameOrId);

    return (row as CheckpointEntry) || null;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] getCheckpoint error: ${msg}`);
    return null;
  }
}

function restoreCheckpoint(nameOrId: string | number, clearExisting: boolean = false): RestoreResult {
  const database = getDatabase();
  const result: RestoreResult = { restored: 0, skipped: 0, errors: [], workingMemoryRestored: 0 };

  try {
    const checkpoint = getCheckpoint(nameOrId);
    if (!checkpoint || !checkpoint.memory_snapshot) {
      result.errors.push('Checkpoint not found or empty');
      return result;
    }

    // Decompress snapshot
    const decompressed = zlib.gunzipSync(checkpoint.memory_snapshot);
    const snapshot = JSON.parse(decompressed.toString()) as CheckpointSnapshot;

    if (!snapshot.memories || !Array.isArray(snapshot.memories)) {
      result.errors.push('Invalid snapshot format');
      return result;
    }

    const hasVecMemories = tableExists(database, 'vec_memories');
    const checkpointVectors = Array.isArray(snapshot.vectors) ? snapshot.vectors : [];
    const hasVectorSnapshot = hasVecMemories && checkpointVectors.length > 0;
    const checkpointSpecFolder = checkpoint.spec_folder ?? null;
    const snapshotMemoryIds = getMemoryIds(snapshot.memories);
    const currentScopedMemoryIds = checkpointSpecFolder
      ? getCurrentMemoryIdsForSpecFolder(database, checkpointSpecFolder)
      : [];
    const scopedMemoryIdsToReplace = Array.from(
      new Set([...currentScopedMemoryIds, ...snapshotMemoryIds])
    );

    // T107 FIX: Validate every row BEFORE any DB mutations.
    // Reject the entire restore on schema violations to prevent
    // Partial restores or silent NULL insertions.
    if (snapshot.memories.length > 0) {
      try {
        for (let i = 0; i < snapshot.memories.length; i++) {
          validateMemoryRow(snapshot.memories[i], i);
        }
      } catch (validationError: unknown) {
        const msg = toErrorMessage(validationError);
        result.errors.push(`Schema validation failed: ${msg}`);
        return result;
      }
    }

    const memoryRestoreColumns = snapshot.memories.length > 0
      ? getMemoryRestoreColumns(database, snapshot.memories)
      : [];
    if (snapshot.memories.length > 0 && memoryRestoreColumns.length === 0) {
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
    if (Array.isArray(snapshot.workingMemory) && snapshot.workingMemory.length > 0) {
      try {
        // Fix F4 — prevent CASCADE delete chain on working_memory.
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
          .map(column => column.name);
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
        // Table may already exist with different schema — proceed anyway
      }
    }

    // T101 FIX: Transaction-wrap checkpoint restore to prevent data loss.
    // When clearExisting=true, the DELETE and all INSERTs must be atomic.
    // If any INSERT fails after DELETE, ROLLBACK restores original data.
    // Previously, individual insert errors were silently swallowed inside
    // The transaction, allowing COMMIT after DELETE + partial inserts = data loss.
    const restoreTx = database.transaction(() => {
      // Clear existing data if requested
      if (clearExisting) {
        if (checkpointSpecFolder) {
          // Record DELETE history only for currently-existing memories (not snapshot-only IDs)
          for (const memId of currentScopedMemoryIds) {
            try { recordHistory(memId, 'DELETE', null, null, 'mcp:checkpoint_restore', checkpointSpecFolder); } catch (_histErr: unknown) { /* best-effort */ }
          }
          if (hasVectorSnapshot) {
            try { deleteRowsByIds(database, 'vec_memories', 'rowid', scopedMemoryIdsToReplace); } catch (_error: unknown) { /* table may not exist */ }
          }
          try { deleteRowsByIds(database, 'working_memory', 'memory_id', scopedMemoryIdsToReplace); } catch (_error: unknown) { /* table may not exist or use a legacy schema */ }
          try { deleteCausalEdgesForMemoryIds(database, scopedMemoryIdsToReplace); } catch (_error: unknown) { /* table may not exist */ }
          database.prepare('DELETE FROM memory_index WHERE spec_folder = ?').run(checkpointSpecFolder);
        } else {
          // Record DELETE history for all memories before full checkpoint restore
          const allIds = database.prepare('SELECT id, spec_folder FROM memory_index').all() as Array<{ id: number; spec_folder: string | null }>;
          for (const row of allIds) {
            try { recordHistory(row.id, 'DELETE', null, null, 'mcp:checkpoint_restore', row.spec_folder ?? null); } catch (_histErr: unknown) { /* best-effort */ }
          }
          database.prepare('DELETE FROM memory_index').run();
          // Only clear vec table when checkpoint contains vectors to restore.
          // This keeps backward compatibility for older checkpoints that lacked vector snapshots.
          if (hasVectorSnapshot) {
            try { database.prepare('DELETE FROM vec_memories').run(); } catch (_error: unknown) { /* table may not exist */ }
          }
          try { database.prepare('DELETE FROM working_memory').run(); } catch (_error: unknown) { /* table may not exist */ }
          try { database.prepare('DELETE FROM causal_edges').run(); } catch (_error: unknown) { /* table may not exist */ }
        }
      }

      const txErrors: string[] = [];
      const restoredMemoryIds = new Set<number>();

      for (const memory of snapshot.memories) {
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

      // Restore vector rows when available in checkpoint snapshot.
      if (hasVectorSnapshot) {
        const deleteVectorById = database.prepare('DELETE FROM vec_memories WHERE rowid = ?') as Database.Statement;
        const insertVector = database.prepare(
          'INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)'
        ) as Database.Statement;

        for (const vectorRow of checkpointVectors) {
          try {
            if (!restoredMemoryIds.has(vectorRow.rowid)) {
              continue;
            }
            const embeddingBuffer = toBuffer(vectorRow.embedding);
            if (!embeddingBuffer) {
              txErrors.push(`Vector ${vectorRow.rowid}: missing or invalid embedding payload`);
              continue;
            }
            deleteVectorById.run(vectorRow.rowid);
            insertVector.run(vectorRow.rowid, embeddingBuffer);
          } catch (e: unknown) {
            const msg = toErrorMessage(e);
            txErrors.push(`Vector ${vectorRow.rowid}: ${msg}`);
          }
        }
      }

      // T213: Restore working memory state from checkpoint snapshot.
      // The working_memory table holds session-based attention data that must
      // Survive checkpoint save/restore cycles.
      // DDL (CREATE TABLE, ALTER TABLE) is executed BEFORE the transaction above.
      if (Array.isArray(snapshot.workingMemory) && snapshot.workingMemory.length > 0) {
        for (const wmEntry of snapshot.workingMemory) {
          // Fix F19 — validate required fields before INSERT.
          if (!wmEntry || typeof wmEntry.session_id !== 'string') {
            console.warn('[checkpoints] Skipping working_memory entry with missing session_id');
            continue;
          }
          try {
            database.prepare(`
              INSERT OR REPLACE INTO working_memory (
                id, session_id, memory_id, attention_score,
                added_at, last_focused, focus_count,
                event_counter, mention_count,
                source_tool, source_call_id, extraction_rule_id, redaction_applied
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              wmEntry.id,
              wmEntry.session_id,
              wmEntry.memory_id,
              wmEntry.attention_score ?? 1.0,
              wmEntry.added_at,
              wmEntry.last_focused,
              wmEntry.focus_count ?? 1,
              wmEntry.event_counter ?? 0,
              wmEntry.mention_count ?? 0,
              wmEntry.source_tool ?? null,
              wmEntry.source_call_id ?? null,
              wmEntry.extraction_rule_id ?? null,
              wmEntry.redaction_applied ?? 0
            );
            result.workingMemoryRestored++;
          } catch (e: unknown) {
            const msg = toErrorMessage(e);
            txErrors.push(`WorkingMemory ${wmEntry.id}: ${msg}`);
          }
        }
      }

      // P1-036: Restore causal_edges from checkpoint snapshot.
      if (tableExists(database, 'causal_edges')) {
        if (checkpointSpecFolder && restoredMemoryIds.size > 0) {
          try {
            deleteCausalEdgesForMemoryIds(database, Array.from(restoredMemoryIds));
          } catch (_error: unknown) {
            // Table may not exist
          }
        }

        if (!Array.isArray(snapshot.causalEdges) || snapshot.causalEdges.length === 0) {
          // No edges captured for this checkpoint state — leave the scoped graph cleared.
        } else {
          const memoryExistsStmt = database.prepare(
            'SELECT 1 FROM memory_index WHERE id = ? LIMIT 1'
          ) as Database.Statement;
          const edgesToRestore: Array<Record<string, unknown>> = [];

          for (const edge of snapshot.causalEdges) {
            try {
              if (typeof edge.source_id !== 'string' || typeof edge.target_id !== 'string' || typeof edge.relation !== 'string') {
                continue;
              }
              if (checkpointSpecFolder) {
                const sourceExists = !!memoryExistsStmt.get(edge.source_id);
                const targetExists = !!memoryExistsStmt.get(edge.target_id);
                if (!sourceExists || !targetExists) {
                  continue;
                }
              }
              if (edge.source_id === edge.target_id) {
                console.warn(`[checkpoints] Skipping self-loop causal edge during restore: ${String(edge.source_id)}`);
                continue;
              }

              edgesToRestore.push({
                ...edge,
                relation: edge.relation as RelationType,
              });
            } catch (e: unknown) {
              const msg = toErrorMessage(e);
              txErrors.push(`CausalEdge: ${msg}`);
            }
          }

          if (edgesToRestore.length > 0) {
            const { failed } = bulkInsertEdges(edgesToRestore);
            if (failed > 0) {
              txErrors.push(`CausalEdge: failed to restore ${failed} edge(s)`);
            }
          }
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
        result.errors.push(...txErrors);
      }
    });

    restoreTx();

    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    result.errors.push(msg);
    console.warn(`[checkpoints] restoreCheckpoint error: ${msg}`);
  }

  return result;
}

function deleteCheckpoint(nameOrId: string | number): boolean {
  const database = getDatabase();

  try {
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
  validateMemoryRow,
  createCheckpoint,
  listCheckpoints,
  getCheckpoint,
  restoreCheckpoint,
  deleteCheckpoint,
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
