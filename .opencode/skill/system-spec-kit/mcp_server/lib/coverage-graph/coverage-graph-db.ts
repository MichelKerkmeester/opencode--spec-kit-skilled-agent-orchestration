// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Database
// ───────────────────────────────────────────────────────────────
// SQLite storage for deep-loop coverage graphs (nodes + edges + snapshots).
// Uses dedicated deep-loop-graph.sqlite alongside the memory index DB.
// Follows code-graph-db.ts patterns for schema versioning and transaction safety.

import Database from 'better-sqlite3';
import { join } from 'node:path';
import { statSync } from 'node:fs';
import { DATABASE_DIR } from '../../core/config.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type LoopType = 'research' | 'review';

/** Research node kinds */
export type ResearchNodeKind = 'QUESTION' | 'FINDING' | 'CLAIM' | 'SOURCE';

/** Review node kinds */
export type ReviewNodeKind = 'DIMENSION' | 'FILE' | 'FINDING' | 'EVIDENCE' | 'REMEDIATION';

/** All valid node kinds across both loop types */
export type NodeKind = ResearchNodeKind | ReviewNodeKind;

/** Research edge relation types */
export type ResearchRelation =
  | 'ANSWERS'
  | 'SUPPORTS'
  | 'CONTRADICTS'
  | 'SUPERSEDES'
  | 'DERIVED_FROM'
  | 'COVERS'
  | 'CITES';

/** Review edge relation types */
export type ReviewRelation =
  | 'COVERS'
  | 'EVIDENCE_FOR'
  | 'CONTRADICTS'
  | 'RESOLVES'
  | 'CONFIRMS'
  | 'ESCALATES'
  | 'IN_DIMENSION'
  | 'IN_FILE';

/** All valid relation types */
export type Relation = ResearchRelation | ReviewRelation;

/** A coverage graph node */
export interface CoverageNode {
  id: string;
  specFolder: string;
  loopType: LoopType;
  sessionId: string;
  kind: NodeKind;
  name: string;
  contentHash?: string;
  iteration?: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

/** A coverage graph edge */
export interface CoverageEdge {
  id: string;
  specFolder: string;
  loopType: LoopType;
  sessionId: string;
  sourceId: string;
  targetId: string;
  relation: Relation;
  weight: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

/** A coverage snapshot (per-iteration metrics) */
export interface CoverageSnapshot {
  id?: number;
  specFolder: string;
  loopType: LoopType;
  sessionId: string;
  iteration: number;
  metrics: Record<string, unknown>;
  nodeCount: number;
  edgeCount: number;
  createdAt?: string;
}

/** Namespace components for isolation */
export interface Namespace {
  specFolder: string;
  loopType: LoopType;
  sessionId?: string;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const SCHEMA_VERSION = 1;

const DB_FILENAME = 'deep-loop-graph.sqlite';

/** Weight clamping bounds */
const MIN_WEIGHT = 0.0;
const MAX_WEIGHT = 2.0;

/** Initial weight estimates for research relations */
export const RESEARCH_WEIGHTS: Record<ResearchRelation, number> = {
  ANSWERS: 1.3,
  SUPPORTS: 1.0,
  CONTRADICTS: 0.8,
  SUPERSEDES: 1.5,
  DERIVED_FROM: 1.0,
  COVERS: 1.1,
  CITES: 1.0,
};

/** Initial weight estimates for review relations */
export const REVIEW_WEIGHTS: Record<ReviewRelation, number> = {
  COVERS: 1.3,
  EVIDENCE_FOR: 1.0,
  CONTRADICTS: 0.8,
  RESOLVES: 1.5,
  CONFIRMS: 1.0,
  ESCALATES: 1.2,
  IN_DIMENSION: 1.0,
  IN_FILE: 1.0,
};

/** Valid node kinds by loop type */
export const VALID_KINDS: Record<LoopType, readonly string[]> = {
  research: ['QUESTION', 'FINDING', 'CLAIM', 'SOURCE'] as const,
  review: ['DIMENSION', 'FILE', 'FINDING', 'EVIDENCE', 'REMEDIATION'] as const,
};

/** Valid relation types by loop type */
export const VALID_RELATIONS: Record<LoopType, readonly string[]> = {
  research: ['ANSWERS', 'SUPPORTS', 'CONTRADICTS', 'SUPERSEDES', 'DERIVED_FROM', 'COVERS', 'CITES'] as const,
  review: ['COVERS', 'EVIDENCE_FOR', 'CONTRADICTS', 'RESOLVES', 'CONFIRMS', 'ESCALATES', 'IN_DIMENSION', 'IN_FILE'] as const,
};

// ───────────────────────────────────────────────────────────────
// 3. SCHEMA
// ───────────────────────────────────────────────────────────────

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS coverage_nodes (
    id TEXT PRIMARY KEY,
    spec_folder TEXT NOT NULL,
    loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review')),
    session_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    content_hash TEXT,
    iteration INTEGER,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS coverage_edges (
    id TEXT PRIMARY KEY,
    spec_folder TEXT NOT NULL,
    loop_type TEXT NOT NULL,
    session_id TEXT NOT NULL,
    source_id TEXT NOT NULL REFERENCES coverage_nodes(id),
    target_id TEXT NOT NULL REFERENCES coverage_nodes(id),
    relation TEXT NOT NULL,
    weight REAL DEFAULT 1.0 CHECK(weight >= 0.0 AND weight <= 2.0),
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    CHECK(source_id != target_id)
  );

  CREATE TABLE IF NOT EXISTS coverage_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spec_folder TEXT NOT NULL,
    loop_type TEXT NOT NULL,
    session_id TEXT NOT NULL,
    iteration INTEGER NOT NULL,
    metrics TEXT,
    node_count INTEGER,
    edge_count INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(spec_folder, loop_type, session_id, iteration)
  );

  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_coverage_folder_type ON coverage_nodes(spec_folder, loop_type);
  CREATE INDEX IF NOT EXISTS idx_coverage_kind ON coverage_nodes(kind);
  CREATE INDEX IF NOT EXISTS idx_coverage_session ON coverage_nodes(session_id);
  CREATE INDEX IF NOT EXISTS idx_coverage_iteration ON coverage_nodes(iteration);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_source ON coverage_edges(source_id);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_target ON coverage_edges(target_id);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_relation ON coverage_edges(relation);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_folder_type ON coverage_edges(spec_folder, loop_type);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_session ON coverage_edges(session_id);
  CREATE INDEX IF NOT EXISTS idx_coverage_snapshot_session ON coverage_snapshots(session_id);
`;

// ───────────────────────────────────────────────────────────────
// 4. DATABASE LIFECYCLE
// ───────────────────────────────────────────────────────────────

let db: Database.Database | null = null;
let dbPath: string | null = null;

/** Initialize (or get) the coverage graph database */
export function initDb(dbDir: string): Database.Database {
  if (db) return db;

  try {
    dbPath = join(dbDir, DB_FILENAME);
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.exec(SCHEMA_SQL);

    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
    if (!versionRow) {
      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
    } else if (versionRow.version < SCHEMA_VERSION) {
      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
    }

    return db;
  } catch (err) {
    if (db) {
      try { db.close(); } catch { /* best effort cleanup */ }
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
    dbPath = null;
  }
}

/** Build a namespace filter clause for SQL queries */
function buildNamespaceWhere(ns: Namespace): { clause: string; params: unknown[] } {
  const parts: string[] = ['spec_folder = ?', 'loop_type = ?'];
  const params: unknown[] = [ns.specFolder, ns.loopType];
  if (ns.sessionId) {
    parts.push('session_id = ?');
    params.push(ns.sessionId);
  }
  return { clause: parts.join(' AND '), params };
}

// ───────────────────────────────────────────────────────────────
// 5. WEIGHT CLAMPING
// ───────────────────────────────────────────────────────────────

/** Clamp weight to valid range [0.0, 2.0] */
export function clampWeight(weight: number): number {
  if (!Number.isFinite(weight)) return 1.0;
  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
}

// ───────────────────────────────────────────────────────────────
// 6. NODE OPERATIONS
// ───────────────────────────────────────────────────────────────

/** Insert or update a node. Returns the node ID. */
export function upsertNode(node: CoverageNode): string {
  const d = getDb();
  const now = new Date().toISOString();
  const metadataStr = node.metadata ? JSON.stringify(node.metadata) : null;

  const existing = d.prepare('SELECT id FROM coverage_nodes WHERE id = ?').get(node.id) as { id: string } | undefined;
  if (existing) {
    d.prepare(`
      UPDATE coverage_nodes SET
        kind = ?, name = ?, content_hash = ?, iteration = ?,
        metadata = ?, updated_at = ?
      WHERE id = ?
    `).run(
      node.kind, node.name, node.contentHash ?? null, node.iteration ?? null,
      metadataStr, now, node.id,
    );
    return node.id;
  }

  d.prepare(`
    INSERT INTO coverage_nodes (
      id, spec_folder, loop_type, session_id, kind, name,
      content_hash, iteration, metadata, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    node.id, node.specFolder, node.loopType, node.sessionId,
    node.kind, node.name, node.contentHash ?? null,
    node.iteration ?? null, metadataStr, now, now,
  );
  return node.id;
}

/** Get a node by ID */
export function getNode(id: string): CoverageNode | null {
  const d = getDb();
  const row = d.prepare('SELECT * FROM coverage_nodes WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToNode(row) : null;
}

/** Get all nodes in a namespace */
export function getNodes(ns: Namespace): CoverageNode[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM coverage_nodes WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToNode);
}

/** Get nodes of a specific kind in a namespace */
export function getNodesByKind(ns: Namespace, kind: NodeKind): CoverageNode[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM coverage_nodes WHERE ${clause} AND kind = ?`).all(...params, kind) as Record<string, unknown>[];
  return rows.map(rowToNode);
}

/** Delete a node and its connected edges */
export function deleteNode(id: string): boolean {
  const d = getDb();
  const tx = d.transaction(() => {
    d.prepare('DELETE FROM coverage_edges WHERE source_id = ? OR target_id = ?').run(id, id);
    const result = d.prepare('DELETE FROM coverage_nodes WHERE id = ?').run(id);
    return result.changes > 0;
  });
  return tx();
}

// ───────────────────────────────────────────────────────────────
// 7. EDGE OPERATIONS
// ───────────────────────────────────────────────────────────────

/** Insert or update an edge. Rejects self-loops and clamps weights. Returns the edge ID or null if rejected. */
export function upsertEdge(edge: CoverageEdge): string | null {
  // Self-loop rejection
  if (edge.sourceId === edge.targetId) {
    return null;
  }

  const d = getDb();
  const weight = clampWeight(edge.weight);
  const now = new Date().toISOString();
  const metadataStr = edge.metadata ? JSON.stringify(edge.metadata) : null;

  const existing = d.prepare('SELECT id FROM coverage_edges WHERE id = ?').get(edge.id) as { id: string } | undefined;
  if (existing) {
    d.prepare(`
      UPDATE coverage_edges SET
        relation = ?, weight = ?, metadata = ?
      WHERE id = ?
    `).run(edge.relation, weight, metadataStr, edge.id);
    return edge.id;
  }

  d.prepare(`
    INSERT INTO coverage_edges (
      id, spec_folder, loop_type, session_id, source_id, target_id,
      relation, weight, metadata, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    edge.id, edge.specFolder, edge.loopType, edge.sessionId,
    edge.sourceId, edge.targetId,
    edge.relation, weight, metadataStr, now,
  );
  return edge.id;
}

/** Get an edge by ID */
export function getEdge(id: string): CoverageEdge | null {
  const d = getDb();
  const row = d.prepare('SELECT * FROM coverage_edges WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToEdge(row) : null;
}

/** Get all edges in a namespace */
export function getEdges(ns: Namespace): CoverageEdge[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM coverage_edges WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Get edges from a source node */
export function getEdgesFrom(sourceId: string): CoverageEdge[] {
  const d = getDb();
  const rows = d.prepare('SELECT * FROM coverage_edges WHERE source_id = ?').all(sourceId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Get edges to a target node */
export function getEdgesTo(targetId: string): CoverageEdge[] {
  const d = getDb();
  const rows = d.prepare('SELECT * FROM coverage_edges WHERE target_id = ?').all(targetId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Update an edge's weight and/or metadata */
export function updateEdge(id: string, updates: { weight?: number; metadata?: Record<string, unknown> }): boolean {
  const d = getDb();
  const existing = d.prepare('SELECT * FROM coverage_edges WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) return false;

  const weight = updates.weight !== undefined ? clampWeight(updates.weight) : existing.weight as number;
  const metadataStr = updates.metadata ? JSON.stringify(updates.metadata) : existing.metadata as string | null;

  d.prepare('UPDATE coverage_edges SET weight = ?, metadata = ? WHERE id = ?').run(weight, metadataStr, id);
  return true;
}

/** Delete an edge by ID */
export function deleteEdge(id: string): boolean {
  const d = getDb();
  const result = d.prepare('DELETE FROM coverage_edges WHERE id = ?').run(id);
  return result.changes > 0;
}

// ───────────────────────────────────────────────────────────────
// 8. SNAPSHOT OPERATIONS
// ───────────────────────────────────────────────────────────────

/** Create a coverage snapshot for a given iteration */
export function createSnapshot(snapshot: CoverageSnapshot): number {
  const d = getDb();
  const metricsStr = JSON.stringify(snapshot.metrics);

  const result = d.prepare(`
    INSERT INTO coverage_snapshots (
      spec_folder, loop_type, session_id, iteration, metrics, node_count, edge_count
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(spec_folder, loop_type, session_id, iteration) DO UPDATE SET
      metrics = excluded.metrics,
      node_count = excluded.node_count,
      edge_count = excluded.edge_count
  `).run(
    snapshot.specFolder, snapshot.loopType, snapshot.sessionId, snapshot.iteration,
    metricsStr, snapshot.nodeCount, snapshot.edgeCount,
  );
  return Number(result.lastInsertRowid);
}

/** Get the latest snapshot for a namespace */
export function getLatestSnapshot(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot | null {
  const d = getDb();
  if (sessionId) {
    const row = d.prepare(`
      SELECT * FROM coverage_snapshots
      WHERE spec_folder = ? AND loop_type = ? AND session_id = ?
      ORDER BY iteration DESC LIMIT 1
    `).get(specFolder, loopType, sessionId) as Record<string, unknown> | undefined;
    return row ? rowToSnapshot(row) : null;
  }
  const row = d.prepare(`
    SELECT * FROM coverage_snapshots
    WHERE spec_folder = ? AND loop_type = ?
    ORDER BY iteration DESC LIMIT 1
  `).get(specFolder, loopType) as Record<string, unknown> | undefined;
  return row ? rowToSnapshot(row) : null;
}

/** Get all snapshots for a namespace (ordered by iteration) */
export function getSnapshots(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot[] {
  const d = getDb();
  if (sessionId) {
    const rows = d.prepare(`
      SELECT * FROM coverage_snapshots
      WHERE spec_folder = ? AND loop_type = ? AND session_id = ?
      ORDER BY iteration ASC
    `).all(specFolder, loopType, sessionId) as Record<string, unknown>[];
    return rows.map(rowToSnapshot);
  }
  const rows = d.prepare(`
    SELECT * FROM coverage_snapshots
    WHERE spec_folder = ? AND loop_type = ?
    ORDER BY iteration ASC
  `).all(specFolder, loopType) as Record<string, unknown>[];
  return rows.map(rowToSnapshot);
}

// ───────────────────────────────────────────────────────────────
// 9. STATS AND COUNTS
// ───────────────────────────────────────────────────────────────

/** Get graph statistics for a namespace */
export function getStats(specFolder: string, loopType: LoopType): {
  totalNodes: number;
  totalEdges: number;
  nodesByKind: Record<string, number>;
  edgesByRelation: Record<string, number>;
  lastIteration: number | null;
  schemaVersion: number;
  dbFileSize: number | null;
} {
  const d = getDb();

  const totalNodes = (d.prepare(
    'SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ?',
  ).get(specFolder, loopType) as { c: number }).c;

  const totalEdges = (d.prepare(
    'SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ?',
  ).get(specFolder, loopType) as { c: number }).c;

  const nodesByKind: Record<string, number> = {};
  const kindRows = d.prepare(
    'SELECT kind, COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? GROUP BY kind',
  ).all(specFolder, loopType) as { kind: string; c: number }[];
  for (const r of kindRows) nodesByKind[r.kind] = r.c;

  const edgesByRelation: Record<string, number> = {};
  const relRows = d.prepare(
    'SELECT relation, COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? GROUP BY relation',
  ).all(specFolder, loopType) as { relation: string; c: number }[];
  for (const r of relRows) edgesByRelation[r.relation] = r.c;

  const lastIterRow = d.prepare(
    'SELECT MAX(iteration) as max_iter FROM coverage_snapshots WHERE spec_folder = ? AND loop_type = ?',
  ).get(specFolder, loopType) as { max_iter: number | null } | undefined;
  const lastIteration = lastIterRow?.max_iter ?? null;

  let dbFileSize: number | null = null;
  if (dbPath) {
    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
  }

  return {
    totalNodes,
    totalEdges,
    nodesByKind,
    edgesByRelation,
    lastIteration,
    schemaVersion: SCHEMA_VERSION,
    dbFileSize,
  };
}

// ───────────────────────────────────────────────────────────────
// 10. BATCH UPSERT (TRANSACTION)
// ───────────────────────────────────────────────────────────────

/** Batch upsert nodes and edges in a single transaction */
export function batchUpsert(
  nodes: CoverageNode[],
  edges: CoverageEdge[],
): { insertedNodes: number; insertedEdges: number; rejectedEdges: number } {
  const d = getDb();
  let insertedNodes = 0;
  let insertedEdges = 0;
  let rejectedEdges = 0;

  const tx = d.transaction(() => {
    for (const node of nodes) {
      upsertNode(node);
      insertedNodes++;
    }
    for (const edge of edges) {
      const result = upsertEdge(edge);
      if (result) {
        insertedEdges++;
      } else {
        rejectedEdges++;
      }
    }
  });
  tx();

  return { insertedNodes, insertedEdges, rejectedEdges };
}

// ───────────────────────────────────────────────────────────────
// 11. ROW CONVERTERS
// ───────────────────────────────────────────────────────────────

function rowToNode(r: Record<string, unknown>): CoverageNode {
  return {
    id: r.id as string,
    specFolder: r.spec_folder as string,
    loopType: r.loop_type as LoopType,
    sessionId: r.session_id as string,
    kind: r.kind as NodeKind,
    name: r.name as string,
    contentHash: r.content_hash as string | undefined,
    iteration: r.iteration as number | undefined,
    metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
    createdAt: r.created_at as string | undefined,
    updatedAt: r.updated_at as string | undefined,
  };
}

function rowToEdge(r: Record<string, unknown>): CoverageEdge {
  return {
    id: r.id as string,
    specFolder: r.spec_folder as string,
    loopType: r.loop_type as LoopType,
    sessionId: r.session_id as string,
    sourceId: r.source_id as string,
    targetId: r.target_id as string,
    relation: r.relation as Relation,
    weight: r.weight as number,
    metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
    createdAt: r.created_at as string | undefined,
  };
}

function rowToSnapshot(r: Record<string, unknown>): CoverageSnapshot {
  return {
    id: r.id as number,
    specFolder: r.spec_folder as string,
    loopType: r.loop_type as LoopType,
    sessionId: r.session_id as string,
    iteration: r.iteration as number,
    metrics: r.metrics ? JSON.parse(r.metrics as string) : {},
    nodeCount: r.node_count as number,
    edgeCount: r.edge_count as number,
    createdAt: r.created_at as string | undefined,
  };
}
