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

export const SCHEMA_VERSION = 2;

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

// Schema v2 (REQ-028): primary keys are composite
// `(spec_folder, loop_type, session_id, id)` so two sessions can reuse the
// same logical node/edge ID without overwriting each other's rows. Every
// read, write, update, and delete must scope the bare id by namespace.
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS coverage_nodes (
    spec_folder TEXT NOT NULL,
    loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review')),
    session_id TEXT NOT NULL,
    id TEXT NOT NULL,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    content_hash TEXT,
    iteration INTEGER,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (spec_folder, loop_type, session_id, id)
  );

  CREATE TABLE IF NOT EXISTS coverage_edges (
    spec_folder TEXT NOT NULL,
    loop_type TEXT NOT NULL,
    session_id TEXT NOT NULL,
    id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relation TEXT NOT NULL,
    weight REAL DEFAULT 1.0 CHECK(weight >= 0.0 AND weight <= 2.0),
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    CHECK(source_id != target_id),
    PRIMARY KEY (spec_folder, loop_type, session_id, id),
    FOREIGN KEY (spec_folder, loop_type, session_id, source_id)
      REFERENCES coverage_nodes (spec_folder, loop_type, session_id, id),
    FOREIGN KEY (spec_folder, loop_type, session_id, target_id)
      REFERENCES coverage_nodes (spec_folder, loop_type, session_id, id)
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
  CREATE INDEX IF NOT EXISTS idx_coverage_session ON coverage_nodes(spec_folder, loop_type, session_id);
  CREATE INDEX IF NOT EXISTS idx_coverage_iteration ON coverage_nodes(iteration);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_source ON coverage_edges(spec_folder, loop_type, session_id, source_id);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_target ON coverage_edges(spec_folder, loop_type, session_id, target_id);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_relation ON coverage_edges(relation);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_folder_type ON coverage_edges(spec_folder, loop_type);
  CREATE INDEX IF NOT EXISTS idx_coverage_edge_session ON coverage_edges(spec_folder, loop_type, session_id);
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

    // Schema migration: v1 used a single `id TEXT PRIMARY KEY`, which let
    // two sessions with the same logical node/edge id overwrite each other
    // (REQ-028 / F004 in the 042 closing audit). v2 switches to a composite
    // primary key of (spec_folder, loop_type, session_id, id). Live upgrades
    // drop the v1 tables before creating the v2 schema — this is a dev-only
    // coverage cache, not durable state, so a drop is safe and idempotent.
    const schemaTableExists = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'",
    ).get() as { name: string } | undefined;
    if (schemaTableExists) {
      const existing = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
      if (existing && existing.version < SCHEMA_VERSION) {
        db.exec(`
          DROP INDEX IF EXISTS idx_coverage_folder_type;
          DROP INDEX IF EXISTS idx_coverage_kind;
          DROP INDEX IF EXISTS idx_coverage_session;
          DROP INDEX IF EXISTS idx_coverage_iteration;
          DROP INDEX IF EXISTS idx_coverage_edge_source;
          DROP INDEX IF EXISTS idx_coverage_edge_target;
          DROP INDEX IF EXISTS idx_coverage_edge_relation;
          DROP INDEX IF EXISTS idx_coverage_edge_folder_type;
          DROP INDEX IF EXISTS idx_coverage_edge_session;
          DROP INDEX IF EXISTS idx_coverage_snapshot_session;
          DROP TABLE IF EXISTS coverage_edges;
          DROP TABLE IF EXISTS coverage_nodes;
          DROP TABLE IF EXISTS coverage_snapshots;
        `);
      }
    }

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

/**
 * Insert or update a node scoped to `(specFolder, loopType, sessionId, id)`.
 * Returns the node ID. Every existence check is namespace-qualified so two
 * sessions reusing the same logical id cannot collide (REQ-028).
 */
export function upsertNode(node: CoverageNode): string {
  const d = getDb();
  const now = new Date().toISOString();
  const metadataStr = node.metadata ? JSON.stringify(node.metadata) : null;

  const existing = d.prepare(
    'SELECT id FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(node.specFolder, node.loopType, node.sessionId, node.id) as { id: string } | undefined;
  if (existing) {
    d.prepare(`
      UPDATE coverage_nodes SET
        kind = ?, name = ?, content_hash = ?, iteration = ?,
        metadata = ?, updated_at = ?
      WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?
    `).run(
      node.kind, node.name, node.contentHash ?? null, node.iteration ?? null,
      metadataStr, now,
      node.specFolder, node.loopType, node.sessionId, node.id,
    );
    return node.id;
  }

  d.prepare(`
    INSERT INTO coverage_nodes (
      spec_folder, loop_type, session_id, id, kind, name,
      content_hash, iteration, metadata, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    node.specFolder, node.loopType, node.sessionId, node.id,
    node.kind, node.name, node.contentHash ?? null,
    node.iteration ?? null, metadataStr, now, now,
  );
  return node.id;
}

/** Get a node by ID inside a namespace. */
export function getNode(ns: Namespace, id: string): CoverageNode | null {
  if (!ns.sessionId) return null;
  const d = getDb();
  const row = d.prepare(
    'SELECT * FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
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

/** Delete a node and its connected edges inside a namespace. */
export function deleteNode(ns: Namespace, id: string): boolean {
  if (!ns.sessionId) return false;
  const d = getDb();
  const tx = d.transaction(() => {
    d.prepare(
      'DELETE FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND (source_id = ? OR target_id = ?)',
    ).run(ns.specFolder, ns.loopType, ns.sessionId, id, id);
    const result = d.prepare(
      'DELETE FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
    ).run(ns.specFolder, ns.loopType, ns.sessionId, id);
    return result.changes > 0;
  });
  return tx();
}

// ───────────────────────────────────────────────────────────────
// 7. EDGE OPERATIONS
// ───────────────────────────────────────────────────────────────

/**
 * Insert or update an edge scoped to `(specFolder, loopType, sessionId, id)`.
 * Rejects self-loops and clamps weights. Returns the edge ID or null if
 * rejected. Namespace scoping is load-bearing: two sessions that both emit
 * an edge with the same logical id get independent rows (REQ-028).
 */
export function upsertEdge(edge: CoverageEdge): string | null {
  // Self-loop rejection
  if (edge.sourceId === edge.targetId) {
    return null;
  }

  const d = getDb();
  const weight = clampWeight(edge.weight);
  const now = new Date().toISOString();
  const metadataStr = edge.metadata ? JSON.stringify(edge.metadata) : null;

  const existing = d.prepare(
    'SELECT id FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(edge.specFolder, edge.loopType, edge.sessionId, edge.id) as { id: string } | undefined;
  if (existing) {
    d.prepare(`
      UPDATE coverage_edges SET
        relation = ?, weight = ?, metadata = ?
      WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?
    `).run(
      edge.relation, weight, metadataStr,
      edge.specFolder, edge.loopType, edge.sessionId, edge.id,
    );
    return edge.id;
  }

  d.prepare(`
    INSERT INTO coverage_edges (
      spec_folder, loop_type, session_id, id, source_id, target_id,
      relation, weight, metadata, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    edge.specFolder, edge.loopType, edge.sessionId, edge.id,
    edge.sourceId, edge.targetId,
    edge.relation, weight, metadataStr, now,
  );
  return edge.id;
}

/** Get an edge by ID inside a namespace. */
export function getEdge(ns: Namespace, id: string): CoverageEdge | null {
  if (!ns.sessionId) return null;
  const d = getDb();
  const row = d.prepare(
    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
  return row ? rowToEdge(row) : null;
}

/** Get all edges in a namespace */
export function getEdges(ns: Namespace): CoverageEdge[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM coverage_edges WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Get edges from a source node inside a namespace. */
export function getEdgesFrom(ns: Namespace, sourceId: string): CoverageEdge[] {
  if (!ns.sessionId) return [];
  const d = getDb();
  const rows = d.prepare(
    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND source_id = ?',
  ).all(ns.specFolder, ns.loopType, ns.sessionId, sourceId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Get edges to a target node inside a namespace. */
export function getEdgesTo(ns: Namespace, targetId: string): CoverageEdge[] {
  if (!ns.sessionId) return [];
  const d = getDb();
  const rows = d.prepare(
    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND target_id = ?',
  ).all(ns.specFolder, ns.loopType, ns.sessionId, targetId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Update an edge's weight and/or metadata inside a namespace. */
export function updateEdge(
  ns: Namespace,
  id: string,
  updates: { weight?: number; metadata?: Record<string, unknown> },
): boolean {
  if (!ns.sessionId) return false;
  const d = getDb();
  const existing = d.prepare(
    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
  if (!existing) return false;

  const weight = updates.weight !== undefined ? clampWeight(updates.weight) : existing.weight as number;
  const metadataStr = updates.metadata ? JSON.stringify(updates.metadata) : existing.metadata as string | null;

  d.prepare(
    'UPDATE coverage_edges SET weight = ?, metadata = ? WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).run(weight, metadataStr, ns.specFolder, ns.loopType, ns.sessionId, id);
  return true;
}

/** Delete an edge by ID inside a namespace. */
export function deleteEdge(ns: Namespace, id: string): boolean {
  if (!ns.sessionId) return false;
  const d = getDb();
  const result = d.prepare(
    'DELETE FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).run(ns.specFolder, ns.loopType, ns.sessionId, id);
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
