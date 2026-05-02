// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Database
// ───────────────────────────────────────────────────────────────
// SQLite storage for structural code graph (nodes + edges).
// Uses separate code-graph.sqlite alongside the memory index DB.

import Database from 'better-sqlite3';
import { join, isAbsolute, resolve as resolvePath } from 'node:path';
import { readFileSync, statSync } from 'node:fs';
import { generateContentHash, type CodeNode, type CodeEdge, type DetectorProvenance } from './indexer-types.js';
import {
  CODE_GRAPH_SCOPE_FINGERPRINT_KEY,
  CODE_GRAPH_SCOPE_LABEL_KEY,
  type IndexScopePolicy,
} from './index-scope-policy.js';
import { DATABASE_DIR } from '../../core/config.js';

let db: Database.Database | null = null;
let dbPath: string | null = null;

export interface StartupHighlight {
  name: string;
  kind: string;
  filePath: string;
  callCount: number;
}

export interface FileImportDependent {
  importedFilePath: string;
  importerFilePath: string;
}

export interface FileDegree {
  filePath: string;
  degree: number;
}

export interface DetectorProvenanceSummary {
  dominant: DetectorProvenance | 'unknown';
  counts: Partial<Record<DetectorProvenance, number>>;
}

export type GraphEdgeEvidenceSummaryClass =
  | 'import'
  | 'type_reference'
  | 'test_coverage'
  | 'inferred_heuristic'
  | 'direct_call';

export interface GraphEdgeEnrichmentSummary {
  edgeEvidenceClass: GraphEdgeEvidenceSummaryClass;
  numericConfidence: number;
}

export interface StoredCodeGraphScope {
  fingerprint: string | null;
  label: string | null;
}

/** Schema version for migration tracking */
export const SCHEMA_VERSION = 3;

/** SQL schema for code graph tables */
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS code_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    file_mtime_ms INTEGER NOT NULL DEFAULT 0,
    node_count INTEGER DEFAULT 0,
    edge_count INTEGER DEFAULT 0,
    parse_health TEXT DEFAULT 'clean',
    indexed_at TEXT NOT NULL,
    parse_duration_ms INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS code_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol_id TEXT NOT NULL UNIQUE,
    file_id INTEGER NOT NULL REFERENCES code_files(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    fq_name TEXT NOT NULL,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    start_line INTEGER NOT NULL,
    end_line INTEGER NOT NULL,
    start_column INTEGER DEFAULT 0,
    end_column INTEGER DEFAULT 0,
    language TEXT NOT NULL,
    signature TEXT,
    docstring TEXT,
    content_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS code_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    edge_type TEXT NOT NULL,
    weight REAL DEFAULT 1.0,
    metadata TEXT
  );

  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS code_graph_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_nodes_file_id ON code_nodes(file_id);
  CREATE INDEX IF NOT EXISTS idx_nodes_symbol_id ON code_nodes(symbol_id);
  CREATE INDEX IF NOT EXISTS idx_nodes_kind ON code_nodes(kind);
  CREATE INDEX IF NOT EXISTS idx_nodes_name ON code_nodes(name);
  CREATE INDEX IF NOT EXISTS idx_file_line ON code_nodes(file_path, start_line);
  CREATE INDEX IF NOT EXISTS idx_edges_source ON code_edges(source_id, edge_type);
  CREATE INDEX IF NOT EXISTS idx_edges_target ON code_edges(target_id, edge_type);
  CREATE INDEX IF NOT EXISTS idx_edges_type ON code_edges(edge_type);
  CREATE INDEX IF NOT EXISTS idx_files_path ON code_files(file_path);
  CREATE INDEX IF NOT EXISTS idx_files_hash ON code_files(content_hash);
`;

function getCurrentFileMtimeMs(filePath: string): number | null {
  try {
    return Math.trunc(statSync(filePath).mtimeMs);
  } catch {
    return null;
  }
}

function getCurrentFileContentHash(filePath: string): string | null {
  try {
    return generateContentHash(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function hasColumn(database: Database.Database, tableName: string, columnName: string): boolean {
  const rows = database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return rows.some((row) => row.name === columnName);
}

function ensureSchemaMigrations(database: Database.Database): void {
  if (!hasColumn(database, 'code_files', 'file_mtime_ms')) {
    database.exec('ALTER TABLE code_files ADD COLUMN file_mtime_ms INTEGER NOT NULL DEFAULT 0');
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS code_graph_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_file_line ON code_nodes(file_path, start_line);
  `);
}

/** Initialize (or get) the code graph database */
export function initDb(dbDir: string): Database.Database {
  if (db) return db;

  try {
    dbPath = join(dbDir, 'code-graph.sqlite');
    db = new Database(dbPath);
    // F-002-A2-02: explicit busy_timeout so concurrent writers wait up to 5s
    // for the writer lock instead of throwing SQLITE_BUSY immediately. Set
    // BEFORE journal_mode/foreign_keys so any incidental contention during
    // PRAGMA setup also benefits from the wait.
    db.pragma('busy_timeout = 5000');
    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
    db.pragma('foreign_keys = ON');
    db.exec(SCHEMA_SQL);
    ensureSchemaMigrations(db);

    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
    if (!versionRow) {
      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
    } else if (versionRow.version < SCHEMA_VERSION) {
      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
    }

    return db;
  } catch (err) {
    if (db) {
      try { db.close(); } catch { /* best effort cleanup for failed init */ }
    }
    db = null;
    dbPath = null;
    throw err;
  }
}

/** Get the current database instance (lazy-initializes if needed) */
export function getDb(): Database.Database {
  if (!db) initDb(DATABASE_DIR);
  // initDb either assigns the singleton database or throws before this return.
  return db!;
}

/** Close the database connection */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

function getMetadata(key: string): string | null {
  const d = getDb();
  const row = d.prepare('SELECT value FROM code_graph_metadata WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

function setMetadata(key: string, value: string): void {
  const d = getDb();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO code_graph_metadata (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, value, now);
}

function clearMetadata(key: string): void {
  const d = getDb();
  d.prepare('DELETE FROM code_graph_metadata WHERE key = ?').run(key);
}

export function getCodeGraphMetadata(key: string): string | null {
  return getMetadata(key);
}

export function setCodeGraphMetadata(key: string, value: string): void {
  setMetadata(key, value);
}

export function getStoredCodeGraphScope(): StoredCodeGraphScope {
  return {
    fingerprint: getMetadata(CODE_GRAPH_SCOPE_FINGERPRINT_KEY),
    label: getMetadata(CODE_GRAPH_SCOPE_LABEL_KEY),
  };
}

export function setCodeGraphScope(scopePolicy: Pick<IndexScopePolicy, 'fingerprint' | 'label'>): void {
  setMetadata(CODE_GRAPH_SCOPE_FINGERPRINT_KEY, scopePolicy.fingerprint);
  setMetadata(CODE_GRAPH_SCOPE_LABEL_KEY, scopePolicy.label);
}

export function getLastGitHead(): string | null {
  return getMetadata('last_git_head');
}

export function setLastGitHead(head: string): void {
  setMetadata('last_git_head', head);
}

export function getLastDetectorProvenance(): DetectorProvenance | null {
  const value = getMetadata('last_detector_provenance');
  if (value === 'ast' || value === 'structured' || value === 'regex' || value === 'heuristic') {
    return value;
  }
  return null;
}

export function setLastDetectorProvenance(provenance: DetectorProvenance): void {
  setMetadata('last_detector_provenance', provenance);
}

export function getLastDetectorProvenanceSummary(): DetectorProvenanceSummary | null {
  const result = getLastDetectorProvenanceSummaryWithDiagnostics();
  // F-004-A4-03: backward-compat — caller-visible API still returns null on
  // any non-resolved state; corrupt/invalid state is observable via the
  // *WithDiagnostics() companion below.
  return result.kind === 'resolved' ? result.value : null;
}

/**
 * F-004-A4-03: Discriminated metadata read result so callers can distinguish
 * - 'absent': the row does not exist (first-write hasn't happened yet)
 * - 'resolved': the row exists, parsed cleanly, and matches the expected shape
 * - 'corrupt': the row exists but is not valid JSON (write-side bug or
 *   storage corruption)
 * - 'invalid-shape': the row parsed as JSON but does not match the expected
 *   shape (schema-version drift or write-side type bug)
 *
 * The original API (returns `null` on absent / corrupt / invalid-shape) is
 * preserved; new callers use these companions to react differently to corrupt
 * state vs absent state (e.g. quarantine the row instead of silently rebuilding).
 */
export type MetadataReadResult<T> =
  | { kind: 'absent' }
  | { kind: 'resolved'; value: T }
  | { kind: 'corrupt'; raw: string }
  | { kind: 'invalid-shape'; raw: string };

export function getLastDetectorProvenanceSummaryWithDiagnostics(): MetadataReadResult<DetectorProvenanceSummary> {
  // F-004-A4-03: typed read — distinguish absent vs corrupt vs invalid
  const value = getMetadata('last_detector_provenance_summary');
  if (!value) {
    return { kind: 'absent' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { kind: 'corrupt', raw: value };
  }
  // Shape guard: must be an object with `dominant` and `counts` properties.
  if (
    typeof parsed !== 'object'
    || parsed === null
    || !('dominant' in parsed)
    || !('counts' in parsed)
  ) {
    return { kind: 'invalid-shape', raw: value };
  }
  return { kind: 'resolved', value: parsed as DetectorProvenanceSummary };
}

export function setLastDetectorProvenanceSummary(summary: DetectorProvenanceSummary): void {
  setMetadata('last_detector_provenance_summary', JSON.stringify(summary));
}

export function getLastGraphEdgeEnrichmentSummary(): GraphEdgeEnrichmentSummary | null {
  const result = getLastGraphEdgeEnrichmentSummaryWithDiagnostics();
  // F-004-A4-03: backward-compat null on any non-resolved state
  return result.kind === 'resolved' ? result.value : null;
}

export function getLastGraphEdgeEnrichmentSummaryWithDiagnostics(): MetadataReadResult<GraphEdgeEnrichmentSummary> {
  // F-004-A4-03: typed read — distinguish absent vs corrupt vs invalid
  const value = getMetadata('last_graph_edge_enrichment_summary');
  if (!value) {
    return { kind: 'absent' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { kind: 'corrupt', raw: value };
  }
  // Shape guard: must have `edgeEvidenceClass` and `numericConfidence`.
  if (
    typeof parsed !== 'object'
    || parsed === null
    || !('edgeEvidenceClass' in parsed)
    || !('numericConfidence' in parsed)
  ) {
    return { kind: 'invalid-shape', raw: value };
  }
  return { kind: 'resolved', value: parsed as GraphEdgeEnrichmentSummary };
}

export function setLastGraphEdgeEnrichmentSummary(
  summary: GraphEdgeEnrichmentSummary,
): void {
  setMetadata('last_graph_edge_enrichment_summary', JSON.stringify(summary));
}

export function clearLastGraphEdgeEnrichmentSummary(): void {
  clearMetadata('last_graph_edge_enrichment_summary');
}

export function getLastGoldVerification(): object | null {
  const result = getLastGoldVerificationWithDiagnostics();
  // F-004-A4-03: backward-compat null on any non-resolved state
  return result.kind === 'resolved' ? result.value : null;
}

export function getLastGoldVerificationWithDiagnostics(): MetadataReadResult<object> {
  // F-004-A4-03: typed read — distinguish absent vs corrupt vs invalid
  const value = getCodeGraphMetadata('last_gold_verification');
  if (!value) {
    return { kind: 'absent' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { kind: 'corrupt', raw: value };
  }
  // Shape guard: gold verification must be an object (it's a free-form
  // record but never a primitive). The detailed shape check stays at the
  // call sites that already use isRecord() etc.
  if (typeof parsed !== 'object' || parsed === null) {
    return { kind: 'invalid-shape', raw: value };
  }
  return { kind: 'resolved', value: parsed as object };
}

export function setLastGoldVerification(json: object): void {
  setCodeGraphMetadata('last_gold_verification', JSON.stringify(json));
}

export function getGraphQualitySummary(): {
  detectorProvenanceSummary: DetectorProvenanceSummary | null;
  graphEdgeEnrichmentSummary: GraphEdgeEnrichmentSummary | null;
} {
  return {
    detectorProvenanceSummary: getLastDetectorProvenanceSummary(),
    graphEdgeEnrichmentSummary: getLastGraphEdgeEnrichmentSummary(),
  };
}

/**
 * Insert or update a file record, returning the file ID.
 *
 * T-ENR-02 (R5-002): `options.fileMtimeMs` lets callers stage a placeholder
 * mtime (e.g. `0`) during multi-step structural persistence so `isFileStale()`
 * continues flagging the file as stale until nodes + edges have landed.
 * When omitted, the current on-disk mtime is used (original behavior).
 */
export function upsertFile(
  filePath: string,
  language: string,
  contentHash: string,
  nodeCount: number,
  edgeCount: number,
  parseHealth: string,
  parseDurationMs: number,
  options?: { fileMtimeMs?: number },
): number {
  const d = getDb();
  const now = new Date().toISOString();
  const fileMtimeMs = options?.fileMtimeMs !== undefined
    ? options.fileMtimeMs
    : (getCurrentFileMtimeMs(filePath) ?? 0);

  const existing = d.prepare('SELECT id FROM code_files WHERE file_path = ?').get(filePath) as { id: number } | undefined;
  if (existing) {
    d.prepare(`
      UPDATE code_files SET language = ?, content_hash = ?, node_count = ?, edge_count = ?,
        file_mtime_ms = ?, parse_health = ?, indexed_at = ?, parse_duration_ms = ?
      WHERE id = ?
    `).run(language, contentHash, nodeCount, edgeCount, fileMtimeMs, parseHealth, now, parseDurationMs, existing.id);
    return existing.id;
  }

  const result = d.prepare(`
    INSERT INTO code_files (
      file_path, language, content_hash, file_mtime_ms, node_count, edge_count, parse_health, indexed_at, parse_duration_ms
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(filePath, language, contentHash, fileMtimeMs, nodeCount, edgeCount, parseHealth, now, parseDurationMs);
  return Number(result.lastInsertRowid);
}

/** Batch insert nodes for a file (deletes existing first) */
export function replaceNodes(fileId: number, nodes: CodeNode[]): void {
  const d = getDb();
  const insert = d.prepare(`
    INSERT OR IGNORE INTO code_nodes (symbol_id, file_id, file_path, fq_name, kind, name,
      start_line, end_line, start_column, end_column, language, signature, docstring, content_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = d.transaction(() => {
    const oldSymbolRows = d.prepare('SELECT symbol_id FROM code_nodes WHERE file_id = ?').all(fileId) as { symbol_id: string }[];
    const oldSymbolIds = oldSymbolRows.map(row => row.symbol_id);

    d.prepare('DELETE FROM code_nodes WHERE file_id = ?').run(fileId);

    if (oldSymbolIds.length > 0) {
      const placeholders = oldSymbolIds.map(() => '?').join(',');
      d.prepare(`
        DELETE FROM code_edges
        WHERE source_id IN (${placeholders}) OR target_id IN (${placeholders})
      `).run(...oldSymbolIds, ...oldSymbolIds);
    }

    for (const n of nodes) {
      insert.run(
        n.symbolId, fileId, n.filePath, n.fqName, n.kind, n.name,
        n.startLine, n.endLine, n.startColumn, n.endColumn,
        n.language, n.signature ?? null, n.docstring ?? null, n.contentHash,
      );
    }
  });
  tx();
}

/** Batch insert edges (deletes edges from the source nodes first) */
export function replaceEdges(sourceIds: string[], edges: CodeEdge[]): void {
  const d = getDb();

  const insert = d.prepare(`
    INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
    VALUES (?, ?, ?, ?, ?)
  `);

  const tx = d.transaction(() => {
    if (sourceIds.length > 0) {
      const placeholders = sourceIds.map(() => '?').join(',');
      d.prepare(`DELETE FROM code_edges WHERE source_id IN (${placeholders})`).run(...sourceIds);
    }

    for (const e of edges) {
      insert.run(e.sourceId, e.targetId, e.edgeType, e.weight, e.metadata ? JSON.stringify(e.metadata) : null);
    }
  });
  tx();
}

/** Check if a file needs re-indexing based on stored mtime and content hash */
export function isFileStale(filePath: string, options?: { currentContentHash?: string }): boolean {
  const d = getDb();
  const row = d.prepare('SELECT file_mtime_ms, content_hash FROM code_files WHERE file_path = ?').get(filePath) as {
    file_mtime_ms: number;
    content_hash: string | null;
  } | undefined;
  if (!row) return true;
  const currentMtimeMs = getCurrentFileMtimeMs(filePath);
  if (currentMtimeMs === null) return true;
  if (!row.content_hash) return true;

  // F-014-C4-01: hash content on mtime drift before declaring stale. A touch
  // (mtime drift, content unchanged) used to force reindex; now it stays
  // fresh as long as the content hash matches. Avoids gratuitous full-scans
  // on `git checkout` of unchanged files.
  const currentContentHash = options?.currentContentHash ?? getCurrentFileContentHash(filePath);
  if (currentContentHash === null) return true;
  return row.content_hash !== currentContentHash;
}

/** Batch stale check for a set of file paths */
export interface FreshFilesResult {
  readonly stale: string[];
  readonly fresh: string[];
}

export function ensureFreshFiles(filePaths: string[]): FreshFilesResult {
  const uniquePaths = [...new Set(filePaths)];
  if (uniquePaths.length === 0) {
    return { stale: [], fresh: [] };
  }

  const d = getDb();
  const placeholders = uniquePaths.map(() => '?').join(',');
  const rows = d.prepare(`
    SELECT file_path, file_mtime_ms, content_hash
    FROM code_files
    WHERE file_path IN (${placeholders})
  `).all(...uniquePaths) as Array<{ file_path: string; file_mtime_ms: number; content_hash: string | null }>;
  const storedFiles = new Map(rows.map((row) => [row.file_path, row]));

  const stale: string[] = [];
  const fresh: string[] = [];

  for (const filePath of uniquePaths) {
    const storedFile = storedFiles.get(filePath);
    const currentMtimeMs = getCurrentFileMtimeMs(filePath);
    if (storedFile === undefined || currentMtimeMs === null) {
      stale.push(filePath);
      continue;
    }
    if (!storedFile.content_hash) {
      stale.push(filePath);
      continue;
    }
    // F-014-C4-01: hash on mtime drift before declaring stale. Touch-only
    // changes (mtime drift, content unchanged) stay fresh; only real content
    // changes flip the file to stale.
    const currentContentHash = getCurrentFileContentHash(filePath);
    if (currentContentHash === null || storedFile.content_hash !== currentContentHash) {
      stale.push(filePath);
      continue;
    }
    fresh.push(filePath);
  }

  return { stale, fresh };
}

/** Get all tracked file paths from the graph database */
export function getTrackedFiles(): string[] {
  const d = getDb();
  const rows = d.prepare('SELECT file_path FROM code_files').all() as Array<{ file_path: string }>;
  return rows.map((row) => row.file_path);
}

export function countTrackedSkillFiles(): number {
  const d = getDb();
  const row = d.prepare(`
    SELECT COUNT(*) AS count
    FROM code_files
    WHERE file_path LIKE '%.opencode/skill/%'
  `).get() as { count: number } | undefined;
  return row?.count ?? 0;
}

/** Remove a file and its nodes/edges from the graph */
export function removeFile(filePath: string): void {
  const d = getDb();
  const file = d.prepare('SELECT id FROM code_files WHERE file_path = ?').get(filePath) as { id: number } | undefined;
  if (!file) return;
  // CASCADE will handle nodes; edges need manual cleanup
  const nodeIds = d.prepare('SELECT symbol_id FROM code_nodes WHERE file_id = ?').all(file.id) as { symbol_id: string }[];
  if (nodeIds.length > 0) {
    const placeholders = nodeIds.map(() => '?').join(',');
    const ids = nodeIds.map(n => n.symbol_id);
    d.prepare(`DELETE FROM code_edges WHERE source_id IN (${placeholders}) OR target_id IN (${placeholders})`).run(...ids, ...ids);
  }
  d.prepare('DELETE FROM code_files WHERE id = ?').run(file.id);
}

/** Query: get file outline (nodes sorted by line) */
export function queryOutline(filePath: string): CodeNode[] {
  const d = getDb();
  const rows = d.prepare(`
    SELECT * FROM code_nodes WHERE file_path = ? ORDER BY start_line
  `).all(filePath) as Record<string, unknown>[];

  return rows.map(rowToNode);
}

/** Query: startup-friendly highlights — most-called project symbols (incoming calls). */
export function queryStartupHighlights(limit: number = 5): StartupHighlight[] {
  const d = getDb();
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(Math.trunc(limit), 20)) : 5;
  const rows = d.prepare(`
    WITH filtered_nodes AS (
      SELECT n.symbol_id, n.name, n.kind, n.file_path, n.start_line
      FROM code_nodes n
      WHERE n.kind IN ('class', 'function', 'method', 'interface', 'type_alias', 'module')
        AND n.file_path NOT LIKE '%/site-packages/%'
        AND n.file_path NOT LIKE '%/node_modules/%'
        AND n.file_path NOT LIKE '%/.venv/%'
        AND n.file_path NOT LIKE '%/vendor/%'
        AND n.file_path NOT LIKE '%/dist/%'
        AND n.file_path NOT LIKE '%/build/%'
        AND n.file_path NOT LIKE '%/__pycache__/%'
        AND n.file_path NOT LIKE '%/tests/%'
        AND n.file_path NOT LIKE '%/test_%'
        AND n.file_path NOT LIKE '%__tests__%'
    ),
    aggregated AS (
      SELECT
        fn.name as name,
        fn.kind as kind,
        fn.file_path as file_path,
        MIN(fn.start_line) as start_line,
        COALESCE(SUM(CASE WHEN UPPER(e.edge_type) = 'CALLS' THEN 1 ELSE 0 END), 0) as call_count
      FROM filtered_nodes fn
      LEFT JOIN code_edges e
        ON e.target_id = fn.symbol_id
      GROUP BY fn.name, fn.kind, fn.file_path
    ),
    ranked AS (
      SELECT
        name,
        kind,
        file_path,
        call_count,
        start_line,
        ROW_NUMBER() OVER (
          PARTITION BY file_path
          ORDER BY call_count DESC, start_line ASC
        ) as file_rank
      FROM aggregated
    )
    SELECT
      name,
      kind,
      file_path,
      call_count
    FROM ranked
    WHERE file_rank <= 2
    ORDER BY call_count DESC, start_line ASC
    LIMIT ?
  `).all(safeLimit) as Array<{
    name: string;
    kind: string;
    file_path: string;
    call_count: number;
  }>;

  return rows.map((row) => ({
    name: row.name,
    kind: row.kind,
    filePath: row.file_path,
    callCount: row.call_count,
  }));
}

/** Query: get edges from a symbol */
export interface CodeEdgeTargetResult {
  readonly edge: CodeEdge;
  readonly targetNode: CodeNode | null;
}

export function queryEdgesFrom(symbolId: string, edgeType?: string): CodeEdgeTargetResult[] {
  const d = getDb();
  let sql = 'SELECT * FROM code_edges WHERE source_id = ?';
  const params: unknown[] = [symbolId];
  if (edgeType) {
    sql += ' AND edge_type = ?';
    params.push(edgeType);
  }

  const edges = d.prepare(sql).all(...params) as Record<string, unknown>[];
  return edges.map(e => {
    const edge = rowToEdge(e);
    const targetRow = d.prepare('SELECT * FROM code_nodes WHERE symbol_id = ?').get(edge.targetId) as Record<string, unknown> | undefined;
    return { edge, targetNode: targetRow ? rowToNode(targetRow) : null };
  });
}

/** Query: get edges to a symbol */
export interface CodeEdgeSourceResult {
  readonly edge: CodeEdge;
  readonly sourceNode: CodeNode | null;
}

export function queryEdgesTo(symbolId: string, edgeType?: string): CodeEdgeSourceResult[] {
  const d = getDb();
  let sql = 'SELECT * FROM code_edges WHERE target_id = ?';
  const params: unknown[] = [symbolId];
  if (edgeType) {
    sql += ' AND edge_type = ?';
    params.push(edgeType);
  }

  const edges = d.prepare(sql).all(...params) as Record<string, unknown>[];
  return edges.map(e => {
    const edge = rowToEdge(e);
    const sourceRow = d.prepare('SELECT * FROM code_nodes WHERE symbol_id = ?').get(edge.sourceId) as Record<string, unknown> | undefined;
    return { edge, sourceNode: sourceRow ? rowToNode(sourceRow) : null };
  });
}

export function resolveSubjectFilePath(subject: string): string | null {
  const d = getDb();

  const candidates = [subject];
  if (!isAbsolute(subject)) {
    candidates.push(resolvePath(process.cwd(), subject));
  }

  for (const candidate of candidates) {
    const directFile = d.prepare('SELECT file_path FROM code_files WHERE file_path = ? LIMIT 1').get(candidate) as { file_path: string } | undefined;
    if (directFile) return directFile.file_path;
  }

  const byId = d.prepare('SELECT file_path FROM code_nodes WHERE symbol_id = ? LIMIT 1').get(subject) as { file_path: string } | undefined;
  if (byId) return byId.file_path;

  const byFq = d.prepare('SELECT file_path FROM code_nodes WHERE fq_name = ? LIMIT 1').get(subject) as { file_path: string } | undefined;
  if (byFq) return byFq.file_path;

  const byName = d.prepare('SELECT file_path FROM code_nodes WHERE name = ? LIMIT 1').get(subject) as { file_path: string } | undefined;
  if (byName) return byName.file_path;

  const like = d.prepare('SELECT file_path FROM code_files WHERE file_path LIKE ? LIMIT 1').get(`%${subject}`) as { file_path: string } | undefined;
  if (like) return like.file_path;

  return null;
}

export function queryFileImportDependents(): FileImportDependent[] {
  const d = getDb();
  const rows = d.prepare(`
    SELECT DISTINCT
      target.file_path AS imported_file_path,
      source.file_path AS importer_file_path
    FROM code_edges edge
    INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
    INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
    WHERE UPPER(edge.edge_type) = 'IMPORTS'
      AND source.file_path != target.file_path
  `).all() as Array<{
    imported_file_path: string;
    importer_file_path: string;
  }>;

  return rows.map((row) => ({
    importedFilePath: row.imported_file_path,
    importerFilePath: row.importer_file_path,
  }));
}

export function queryFileDegrees(filePaths: string[]): FileDegree[] {
  const uniquePaths = [...new Set(filePaths.filter((filePath) => typeof filePath === 'string' && filePath.length > 0))];
  if (uniquePaths.length === 0) {
    return [];
  }

  const d = getDb();
  const placeholders = uniquePaths.map(() => '?').join(',');
  const rows = d.prepare(`
    SELECT
      node_file_path,
      COUNT(DISTINCT connected_file_path) AS degree
    FROM (
      SELECT
        source.file_path AS node_file_path,
        target.file_path AS connected_file_path
      FROM code_edges edge
      INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
      INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
      WHERE source.file_path IN (${placeholders})
        AND source.file_path != target.file_path

      UNION ALL

      SELECT
        target.file_path AS node_file_path,
        source.file_path AS connected_file_path
      FROM code_edges edge
      INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
      INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
      WHERE target.file_path IN (${placeholders})
        AND source.file_path != target.file_path
    )
    GROUP BY node_file_path
  `).all(...uniquePaths, ...uniquePaths) as Array<{
    node_file_path: string;
    degree: number;
  }>;

  const degreeByFile = new Map(rows.map((row) => [row.node_file_path, row.degree]));
  return uniquePaths.map((filePath) => ({
    filePath,
    degree: degreeByFile.get(filePath) ?? 0,
  }));
}

/** Get graph statistics */
export function getStats(): {
  totalFiles: number; totalNodes: number; totalEdges: number;
  nodesByKind: Record<string, number>; edgesByType: Record<string, number>;
  parseHealthSummary: Record<string, number>;
  lastScanTimestamp: string | null;
  lastGitHead: string | null;
  dbFileSize: number | null;
  schemaVersion: number;
  graphQualitySummary: {
    detectorProvenanceSummary: DetectorProvenanceSummary | null;
    graphEdgeEnrichmentSummary: GraphEdgeEnrichmentSummary | null;
  };
} {
  const d = getDb();
  const totalFiles = (d.prepare('SELECT COUNT(*) as c FROM code_files').get() as { c: number }).c;
  const totalNodes = (d.prepare('SELECT COUNT(*) as c FROM code_nodes').get() as { c: number }).c;
  const totalEdges = (d.prepare('SELECT COUNT(*) as c FROM code_edges').get() as { c: number }).c;

  const nodesByKind: Record<string, number> = {};
  const kindRows = d.prepare('SELECT kind, COUNT(*) as c FROM code_nodes GROUP BY kind').all() as { kind: string; c: number }[];
  for (const r of kindRows) nodesByKind[r.kind] = r.c;

  const edgesByType: Record<string, number> = {};
  const typeRows = d.prepare('SELECT edge_type, COUNT(*) as c FROM code_edges GROUP BY edge_type').all() as { edge_type: string; c: number }[];
  for (const r of typeRows) edgesByType[r.edge_type] = r.c;

  const parseHealthSummary: Record<string, number> = {};
  const healthRows = d.prepare('SELECT parse_health, COUNT(*) as c FROM code_files GROUP BY parse_health').all() as { parse_health: string; c: number }[];
  for (const r of healthRows) parseHealthSummary[r.parse_health] = r.c;

  // Last scan timestamp
  const lastScan = d.prepare('SELECT MAX(indexed_at) as last FROM code_files').get() as { last: string | null } | undefined;
  const lastScanTimestamp = lastScan?.last ?? null;
  const lastGitHead = getLastGitHead();
  const graphQualitySummary = getGraphQualitySummary();

  // DB file size
  let dbFileSize: number | null = null;
  if (dbPath) {
    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
  }

  return {
    totalFiles, totalNodes, totalEdges, nodesByKind, edgesByType, parseHealthSummary,
    lastScanTimestamp, lastGitHead, dbFileSize, schemaVersion: SCHEMA_VERSION, graphQualitySummary,
  };
}

/** Remove orphaned nodes whose files no longer exist in code_files */
export function cleanupOrphans(): number {
  const d = getDb();
  // Find node file_ids not in code_files
  const orphanedNodes = d.prepare(`
    DELETE FROM code_nodes WHERE file_id NOT IN (SELECT id FROM code_files)
  `).run();

  // Find edges referencing non-existent nodes
  const orphanedEdges = d.prepare(`
    DELETE FROM code_edges WHERE
      source_id NOT IN (SELECT symbol_id FROM code_nodes) OR
      target_id NOT IN (SELECT symbol_id FROM code_nodes)
  `).run();

  return orphanedNodes.changes + orphanedEdges.changes;
}

/** Convert DB row to CodeNode */
function rowToNode(r: Record<string, unknown>): CodeNode {
  return {
    symbolId: r.symbol_id as string,
    filePath: r.file_path as string,
    fqName: r.fq_name as string,
    kind: r.kind as CodeNode['kind'],
    name: r.name as string,
    startLine: r.start_line as number,
    endLine: r.end_line as number,
    startColumn: r.start_column as number ?? 0,
    endColumn: r.end_column as number ?? 0,
    language: r.language as CodeNode['language'],
    signature: r.signature as string | undefined,
    docstring: r.docstring as string | undefined,
    contentHash: r.content_hash as string,
  };
}

/**
 * R-007-P2-3: Allowlist `reason` / `step` strings on the edge-
 * metadata read path. Stale or imported rows may contain values
 * that pre-date a sanitizer change, were written by a different
 * branch, or simply contain control characters/newlines that
 * would break downstream rendering. Strict allowlist keeps the
 * read path safe even if a write-path regression slips a bad
 * value into `code_edges.metadata`.
 *
 * Allowlist rules (single line, length-cap, non-control-char):
 *   - No control characters (0x00-0x1F, 0x7F)
 *   - No CR/LF (single line)
 *   - Length ≤ 200
 *   - Falls back to `null` on any violation
 *
 * The cap is intentionally generous (200 chars) since the values
 * are operator-supplied free-form attribution strings; we need
 * to preserve readability while rejecting injection-shaped input.
 */
const EDGE_METADATA_STRING_MAX_LENGTH = 200;
const EDGE_METADATA_STRING_BLOCKED = /[\x00-\x1F\x7F]/;

export function sanitizeEdgeMetadataString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.length === 0) return null;
  if (value.length > EDGE_METADATA_STRING_MAX_LENGTH) return null;
  if (EDGE_METADATA_STRING_BLOCKED.test(value)) return null;
  return value;
}

/** Convert DB row to CodeEdge */
function rowToEdge(r: Record<string, unknown>): CodeEdge {
  // 008/D7 hardening: malformed JSON in code_edges.metadata must not throw
  // out of the read path. Treat parse failures as "no metadata" rather than
  // crashing relationship/blast_radius queries on a single bad row.
  let rawMetadata: unknown = undefined;
  if (r.metadata) {
    try {
      rawMetadata = JSON.parse(r.metadata as string);
    } catch {
      rawMetadata = undefined;
    }
  }
  if (rawMetadata && typeof rawMetadata === 'object') {
    // Sanitize the two free-form attribution strings on the read
    // path. Other metadata fields (`confidence`, `detectorProvenance`,
    // `evidenceClass`, ...) are validated by their own typecheck
    // sites and don't need string-shape filtering here.
    const meta = rawMetadata as Record<string, unknown>;
    if ('reason' in meta) {
      meta.reason = sanitizeEdgeMetadataString(meta.reason);
    }
    if ('step' in meta) {
      meta.step = sanitizeEdgeMetadataString(meta.step);
    }
  }
  return {
    sourceId: r.source_id as string,
    targetId: r.target_id as string,
    edgeType: r.edge_type as CodeEdge['edgeType'],
    weight: r.weight as number,
    metadata: rawMetadata as CodeEdge['metadata'],
  };
}

/** Compute token usage ratio (completion / total) for budget allocator consumption */
export function getTokenUsageRatio(
  sessionMetrics: { estimatedPromptTokens: number; estimatedCompletionTokens: number } | null,
): number {
  if (!sessionMetrics) return 0;
  const total = sessionMetrics.estimatedPromptTokens + sessionMetrics.estimatedCompletionTokens;
  if (total === 0) return 0;
  return sessionMetrics.estimatedCompletionTokens / total;
}
