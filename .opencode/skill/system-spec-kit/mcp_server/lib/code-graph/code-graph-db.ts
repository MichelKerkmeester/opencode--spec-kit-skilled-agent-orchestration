// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Database
// ───────────────────────────────────────────────────────────────
// SQLite storage for structural code graph (nodes + edges).
// Uses separate code-graph.sqlite alongside the memory index DB.

import Database from 'better-sqlite3';
import { join } from 'node:path';
import { statSync } from 'node:fs';
import type { CodeNode, CodeEdge } from './indexer-types.js';
import { DATABASE_DIR } from '../../core/config.js';

let db: Database.Database | null = null;
let dbPath: string | null = null;

export interface StartupHighlight {
  name: string;
  kind: string;
  filePath: string;
  callCount: number;
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

export function getLastGitHead(): string | null {
  return getMetadata('last_git_head');
}

export function setLastGitHead(head: string): void {
  setMetadata('last_git_head', head);
}

/** Insert or update a file record, returning the file ID */
export function upsertFile(
  filePath: string,
  language: string,
  contentHash: string,
  nodeCount: number,
  edgeCount: number,
  parseHealth: string,
  parseDurationMs: number,
): number {
  const d = getDb();
  const now = new Date().toISOString();
  const fileMtimeMs = getCurrentFileMtimeMs(filePath) ?? 0;

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
    INSERT INTO code_nodes (symbol_id, file_id, file_path, fq_name, kind, name,
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

/** Check if a file needs re-indexing based on stored mtime */
export function isFileStale(filePath: string): boolean {
  const d = getDb();
  const row = d.prepare('SELECT file_mtime_ms FROM code_files WHERE file_path = ?').get(filePath) as { file_mtime_ms: number } | undefined;
  if (!row) return true;
  const currentMtimeMs = getCurrentFileMtimeMs(filePath);
  if (currentMtimeMs === null) return true;
  return row.file_mtime_ms !== currentMtimeMs;
}

/** Batch stale check for a set of file paths */
export function ensureFreshFiles(filePaths: string[]): { stale: string[]; fresh: string[] } {
  const uniquePaths = [...new Set(filePaths)];
  if (uniquePaths.length === 0) {
    return { stale: [], fresh: [] };
  }

  const d = getDb();
  const placeholders = uniquePaths.map(() => '?').join(',');
  const rows = d.prepare(`
    SELECT file_path, file_mtime_ms
    FROM code_files
    WHERE file_path IN (${placeholders})
  `).all(...uniquePaths) as Array<{ file_path: string; file_mtime_ms: number }>;
  const storedMtimes = new Map(rows.map((row) => [row.file_path, row.file_mtime_ms]));

  const stale: string[] = [];
  const fresh: string[] = [];

  for (const filePath of uniquePaths) {
    const storedMtimeMs = storedMtimes.get(filePath);
    const currentMtimeMs = getCurrentFileMtimeMs(filePath);
    if (storedMtimeMs === undefined || currentMtimeMs === null || storedMtimeMs !== currentMtimeMs) {
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
export function queryEdgesFrom(symbolId: string, edgeType?: string): { edge: CodeEdge; targetNode: CodeNode | null }[] {
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
export function queryEdgesTo(symbolId: string, edgeType?: string): { edge: CodeEdge; sourceNode: CodeNode | null }[] {
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

/** Get graph statistics */
export function getStats(): {
  totalFiles: number; totalNodes: number; totalEdges: number;
  nodesByKind: Record<string, number>; edgesByType: Record<string, number>;
  parseHealthSummary: Record<string, number>;
  lastScanTimestamp: string | null;
  lastGitHead: string | null;
  dbFileSize: number | null;
  schemaVersion: number;
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

  // DB file size
  let dbFileSize: number | null = null;
  if (dbPath) {
    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
  }

  return {
    totalFiles, totalNodes, totalEdges, nodesByKind, edgesByType, parseHealthSummary,
    lastScanTimestamp, lastGitHead, dbFileSize, schemaVersion: SCHEMA_VERSION,
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

/** Convert DB row to CodeEdge */
function rowToEdge(r: Record<string, unknown>): CodeEdge {
  return {
    sourceId: r.source_id as string,
    targetId: r.target_id as string,
    edgeType: r.edge_type as CodeEdge['edgeType'],
    weight: r.weight as number,
    metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
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
