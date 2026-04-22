// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Database
// ───────────────────────────────────────────────────────────────
// SQLite storage for skill graph metadata (nodes + edges).
// Uses dedicated skill-graph.sqlite alongside the other graph databases.
// Follows code-graph-db.ts and coverage-graph-db.ts patterns for lifecycle and indexing.

import Database from 'better-sqlite3';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { DATABASE_DIR } from '../../core/config.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type SkillFamily = 'cli' | 'mcp' | 'sk-code' | 'sk-deep' | 'sk-util' | 'system';

export type SkillEdgeType =
  | 'depends_on'
  | 'enhances'
  | 'siblings'
  | 'conflicts_with'
  | 'prerequisite_for';

export interface SkillNode {
  id: string;
  family: SkillFamily;
  category: string;
  schemaVersion: 1 | 2;
  domains: string[];
  intentSignals: string[];
  derived: Record<string, unknown> | null;
  sourcePath: string;
  contentHash: string;
  indexedAt?: string;
}

export interface SkillEdge {
  id?: number;
  sourceId: string;
  targetId: string;
  edgeType: SkillEdgeType;
  weight: number;
  context: string;
}

export interface SkillGraphStats {
  totalNodes: number;
  totalEdges: number;
  nodesByFamily: Record<string, number>;
  edgesByType: Record<string, number>;
  lastScanTimestamp: string | null;
  dbFileSize: number | null;
  schemaVersion: number;
}

export interface SkillGraphIndexResult {
  scannedFiles: number;
  indexedFiles: number;
  skippedFiles: number;
  indexedNodes: number;
  indexedEdges: number;
  rejectedEdges: number;
  deletedNodes: number;
  warnings: string[];
}

interface ParsedSkillMetadata {
  node: SkillNode;
  edges: SkillEdge[];
}

type JsonRecord = Record<string, unknown>;

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const SCHEMA_VERSION = 1;

export const DB_FILENAME = 'skill-graph.sqlite';

const SKILL_METADATA_FILENAME = 'graph-metadata.json';
const MIN_WEIGHT = 0.0;
const MAX_WEIGHT = 1.0;

const ALLOWED_FAMILIES: readonly SkillFamily[] = [
  'cli',
  'mcp',
  'sk-code',
  'sk-deep',
  'sk-util',
  'system',
];

const EDGE_TYPES: readonly SkillEdgeType[] = [
  'depends_on',
  'enhances',
  'siblings',
  'conflicts_with',
  'prerequisite_for',
];

const WEIGHT_BANDS: Readonly<Record<SkillEdgeType, readonly [number, number]>> = {
  depends_on: [0.7, 1.0],
  prerequisite_for: [0.7, 1.0],
  enhances: [0.3, 0.7],
  siblings: [0.4, 0.6],
  conflicts_with: [0.5, 1.0],
} as const;

// ───────────────────────────────────────────────────────────────
// 3. SCHEMA
// ───────────────────────────────────────────────────────────────

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS skill_nodes (
    id TEXT PRIMARY KEY,
    family TEXT NOT NULL CHECK(family IN ('cli', 'mcp', 'sk-code', 'sk-deep', 'sk-util', 'system')),
    category TEXT NOT NULL,
    schema_version INTEGER NOT NULL,
    domains TEXT,
    intent_signals TEXT,
    derived TEXT,
    source_path TEXT NOT NULL UNIQUE,
    content_hash TEXT NOT NULL,
    indexed_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS skill_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    edge_type TEXT NOT NULL CHECK(edge_type IN ('depends_on', 'enhances', 'siblings', 'conflicts_with', 'prerequisite_for')),
    weight REAL NOT NULL CHECK(weight >= 0.0 AND weight <= 1.0),
    context TEXT NOT NULL,
    UNIQUE(source_id, target_id, edge_type),
    CHECK(source_id != target_id)
  );

  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS skill_graph_metadata (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_skill_nodes_family ON skill_nodes(family);
  CREATE INDEX IF NOT EXISTS idx_skill_nodes_category ON skill_nodes(category);
  CREATE INDEX IF NOT EXISTS idx_skill_nodes_hash ON skill_nodes(content_hash);
  CREATE INDEX IF NOT EXISTS idx_skill_edges_source ON skill_edges(source_id, edge_type);
  CREATE INDEX IF NOT EXISTS idx_skill_edges_target ON skill_edges(target_id, edge_type);
  CREATE INDEX IF NOT EXISTS idx_skill_edges_type ON skill_edges(edge_type);
`;

// ───────────────────────────────────────────────────────────────
// 4. DATABASE LIFECYCLE
// ───────────────────────────────────────────────────────────────

let db: Database.Database | null = null;
let dbPath: string | null = null;

function ensureSchemaMigrations(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS skill_graph_metadata (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_skill_nodes_family ON skill_nodes(family);
    CREATE INDEX IF NOT EXISTS idx_skill_edges_source ON skill_edges(source_id, edge_type);
    CREATE INDEX IF NOT EXISTS idx_skill_edges_target ON skill_edges(target_id, edge_type);
  `);
}

/** Initialize (or get) the skill graph database. */
export function initDb(dbDir: string): Database.Database {
  if (db) return db;

  try {
    mkdirSync(dbDir, { recursive: true });
    dbPath = join(dbDir, DB_FILENAME);
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
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
  } catch (error) {
    if (db) {
      try { db.close(); } catch { /* best effort cleanup for failed init */ }
    }
    db = null;
    dbPath = null;
    throw error;
  }
}

/** Get the current database instance (lazy-initializes if needed). */
export function getDb(): Database.Database {
  if (!db) initDb(DATABASE_DIR);
  return db!;
}

/** Close the database connection. */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
    dbPath = null;
  }
}

// ───────────────────────────────────────────────────────────────
// 5. METADATA HELPERS
// ───────────────────────────────────────────────────────────────

function getMetadata(key: string): string | null {
  const database = getDb();
  const row = database.prepare('SELECT value FROM skill_graph_metadata WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

function setMetadata(key: string, value: string): void {
  const database = getDb();
  const now = new Date().toISOString();
  database.prepare(`
    INSERT INTO skill_graph_metadata (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, value, now);
}

export function getLastScanTimestamp(): string | null {
  return getMetadata('last_scan_timestamp');
}

// ───────────────────────────────────────────────────────────────
// 6. INDEXING HELPERS
// ───────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toDisplayPath(filePath: string): string {
  const relativePath = relative(process.cwd(), filePath);
  return relativePath && !relativePath.startsWith('..') ? relativePath : filePath;
}

function requireString(value: unknown, fieldName: string, sourcePath: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${toDisplayPath(sourcePath)}: ${fieldName} must be a non-empty string`);
  }
  return value;
}

function requireStringArray(value: unknown, fieldName: string, sourcePath: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`${toDisplayPath(sourcePath)}: ${fieldName} must be an array of strings`);
  }
  return value;
}

function requireDerived(value: unknown, schemaVersion: number, sourcePath: string): JsonRecord | null {
  if (schemaVersion === 1) {
    return isRecord(value) ? value : null;
  }

  if (!isRecord(value)) {
    throw new Error(`${toDisplayPath(sourcePath)}: schema_version 2 requires a derived object`);
  }

  return value;
}

function requireEdgeWeight(value: unknown, edgeType: SkillEdgeType, sourcePath: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${toDisplayPath(sourcePath)}: ${edgeType} edge weight must be a number`);
  }

  if (value < MIN_WEIGHT || value > MAX_WEIGHT) {
    throw new Error(
      `${toDisplayPath(sourcePath)}: ${edgeType} edge weight ${value} out of range [${MIN_WEIGHT}, ${MAX_WEIGHT}]`,
    );
  }

  return value;
}

function warnWeightBand(edge: SkillEdge, sourcePath: string, warnings: string[]): void {
  const [minBand, maxBand] = WEIGHT_BANDS[edge.edgeType];
  if (edge.weight >= minBand && edge.weight <= maxBand) {
    return;
  }

  const warning = `WEIGHT-BAND: ${edge.sourceId} ${edge.edgeType} ${edge.targetId} weight ${edge.weight} ` +
    `outside recommended band [${minBand}, ${maxBand}] (${toDisplayPath(sourcePath)})`;
  warnings.push(warning);
  console.warn(`[skill-graph] ${warning}`);
}

function computeContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

function discoverGraphMetadataFiles(skillDir: string): string[] {
  if (!existsSync(skillDir)) {
    return [];
  }

  const discovered: string[] = [];
  const stack: string[] = [skillDir];

  while (stack.length > 0) {
    const currentDir = stack.pop()!;
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name === SKILL_METADATA_FILENAME) {
        discovered.push(entryPath);
      }
    }
  }

  return discovered.sort((left, right) => left.localeCompare(right));
}

function readMetadataJson(sourcePath: string, content: string): JsonRecord {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content) as unknown;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${toDisplayPath(sourcePath)}: failed to parse JSON (${message})`);
  }

  if (!isRecord(parsedJson)) {
    throw new Error(`${toDisplayPath(sourcePath)}: root must be an object`);
  }

  return parsedJson;
}

function isSkillGraphMetadata(parsedJson: JsonRecord): boolean {
  return typeof parsedJson.skill_id === 'string' || typeof parsedJson.family === 'string' || isRecord(parsedJson.edges);
}

function parseSkillMetadata(sourcePath: string, parsedJson: JsonRecord, contentHash: string): ParsedSkillMetadata {
  const schemaVersion = parsedJson.schema_version;
  if (schemaVersion !== 1 && schemaVersion !== 2) {
    throw new Error(`${toDisplayPath(sourcePath)}: schema_version must be 1 or 2`);
  }

  const skillId = requireString(parsedJson.skill_id, 'skill_id', sourcePath);
  const folderName = basename(dirname(sourcePath));
  if (skillId !== folderName) {
    throw new Error(`${toDisplayPath(sourcePath)}: skill_id "${skillId}" does not match folder name "${folderName}"`);
  }

  const family = requireString(parsedJson.family, 'family', sourcePath);
  if (!ALLOWED_FAMILIES.includes(family as SkillFamily)) {
    throw new Error(`${toDisplayPath(sourcePath)}: family "${family}" is not supported`);
  }

  const category = requireString(parsedJson.category, 'category', sourcePath);
  const domains = requireStringArray(parsedJson.domains, 'domains', sourcePath);
  const intentSignals = requireStringArray(parsedJson.intent_signals, 'intent_signals', sourcePath);
  const derived = requireDerived(parsedJson.derived, schemaVersion, sourcePath);

  if (!isRecord(parsedJson.edges)) {
    throw new Error(`${toDisplayPath(sourcePath)}: edges must be an object`);
  }

  const edges: SkillEdge[] = [];
  for (const edgeType of EDGE_TYPES) {
    const rawEdgeList = parsedJson.edges[edgeType];
    if (rawEdgeList === undefined) {
      continue;
    }

    if (!Array.isArray(rawEdgeList)) {
      throw new Error(`${toDisplayPath(sourcePath)}: edges.${edgeType} must be an array`);
    }

    for (const rawEdge of rawEdgeList) {
      if (!isRecord(rawEdge)) {
        throw new Error(`${toDisplayPath(sourcePath)}: edges.${edgeType} entries must be objects`);
      }

      edges.push({
        sourceId: skillId,
        targetId: requireString(rawEdge.target, `edges.${edgeType}.target`, sourcePath),
        edgeType,
        weight: requireEdgeWeight(rawEdge.weight, edgeType, sourcePath),
        context: requireString(rawEdge.context, `edges.${edgeType}.context`, sourcePath),
      });
    }
  }

  for (const key of Object.keys(parsedJson.edges)) {
    if (!EDGE_TYPES.includes(key as SkillEdgeType)) {
      throw new Error(`${toDisplayPath(sourcePath)}: unsupported edge type "${key}"`);
    }
  }

  return {
    node: {
      id: skillId,
      family: family as SkillFamily,
      category,
      schemaVersion,
      domains,
      intentSignals,
      derived,
      sourcePath,
      contentHash,
    },
    edges,
  };
}

function deleteMissingNodes(database: Database.Database, skillIds: string[]): number {
  if (skillIds.length === 0) {
    const result = database.prepare('DELETE FROM skill_nodes').run();
    return result.changes;
  }

  const placeholders = skillIds.map(() => '?').join(', ');
  const result = database.prepare(`DELETE FROM skill_nodes WHERE id NOT IN (${placeholders})`).run(...skillIds);
  return result.changes;
}

// ───────────────────────────────────────────────────────────────
// 7. INDEXER
// ───────────────────────────────────────────────────────────────

/**
 * Index all discovered graph-metadata.json files under a skill directory.
 *
 * Files whose SHA-256 content hash has not changed are skipped. Node rows that
 * disappear from the source directory are deleted first so foreign-key cascade
 * cleanup removes stale edges, even when neighboring source files are skipped.
 */
export function indexSkillMetadata(skillDir: string): SkillGraphIndexResult {
  const database = getDb();
  const discoveredFiles = discoverGraphMetadataFiles(skillDir);
  const parsedMetadata: ParsedSkillMetadata[] = [];
  const warnings: string[] = [];
  let nonSkillMetadataFiles = 0;

  for (const sourcePath of discoveredFiles) {
    const content = readFileSync(sourcePath, 'utf8');
    const parsedJson = readMetadataJson(sourcePath, content);
    if (!isSkillGraphMetadata(parsedJson)) {
      nonSkillMetadataFiles++;
      warnings.push(`NON-SKILL-METADATA: skipped ${toDisplayPath(sourcePath)}`);
      continue;
    }

    const contentHash = computeContentHash(content);
    parsedMetadata.push(parseSkillMetadata(sourcePath, parsedJson, contentHash));
  }

  const skillIds = parsedMetadata.map((entry) => entry.node.id);
  const duplicateIds = new Set<string>();
  const seenIds = new Set<string>();
  for (const skillId of skillIds) {
    if (seenIds.has(skillId)) {
      duplicateIds.add(skillId);
      continue;
    }
    seenIds.add(skillId);
  }
  if (duplicateIds.size > 0) {
    throw new Error(`Duplicate skill_ids discovered: ${[...duplicateIds].sort().join(', ')}`);
  }

  let indexedFiles = 0;
  let skippedFiles = nonSkillMetadataFiles;
  let indexedNodes = 0;
  let indexedEdges = 0;
  let rejectedEdges = 0;
  let deletedNodes = 0;

  if (skillIds.length === 0) {
    warnings.push(`EMPTY-SKILL-SCAN: no skill metadata discovered under ${toDisplayPath(skillDir)}; preserving existing graph`);
    const summary: SkillGraphIndexResult = {
      scannedFiles: discoveredFiles.length,
      indexedFiles,
      skippedFiles,
      indexedNodes,
      indexedEdges,
      rejectedEdges,
      deletedNodes,
      warnings,
    };

    setMetadata('last_scan_timestamp', new Date().toISOString());
    setMetadata('last_scan_skill_dir', skillDir);
    setMetadata('last_scan_summary', JSON.stringify(summary));

    return summary;
  }

  const knownSkillIds = new Set(skillIds);

  const selectExisting = database.prepare(`
    SELECT content_hash, source_path
    FROM skill_nodes
    WHERE id = ?
  `);
  const upsertNode = database.prepare(`
    INSERT INTO skill_nodes (
      id, family, category, schema_version, domains, intent_signals, derived,
      source_path, content_hash, indexed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      family = excluded.family,
      category = excluded.category,
      schema_version = excluded.schema_version,
      domains = excluded.domains,
      intent_signals = excluded.intent_signals,
      derived = excluded.derived,
      source_path = excluded.source_path,
      content_hash = excluded.content_hash,
      indexed_at = excluded.indexed_at
  `);
  const deleteEdgesBySource = database.prepare('DELETE FROM skill_edges WHERE source_id = ?');
  const insertEdge = database.prepare(`
    INSERT INTO skill_edges (source_id, target_id, edge_type, weight, context)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(source_id, target_id, edge_type) DO UPDATE SET
      weight = excluded.weight,
      context = excluded.context
  `);

  const tx = database.transaction(() => {
    deletedNodes = deleteMissingNodes(database, skillIds);

    const changedEntries: ParsedSkillMetadata[] = [];
    for (const entry of parsedMetadata) {
      const now = new Date().toISOString();
      const existing = selectExisting.get(entry.node.id) as {
        content_hash: string;
        source_path: string;
      } | undefined;

      if (
        existing &&
        existing.content_hash === entry.node.contentHash &&
        existing.source_path === entry.node.sourcePath
      ) {
        skippedFiles++;
        continue;
      }

      upsertNode.run(
        entry.node.id,
        entry.node.family,
        entry.node.category,
        entry.node.schemaVersion,
        JSON.stringify(entry.node.domains),
        JSON.stringify(entry.node.intentSignals),
        entry.node.derived ? JSON.stringify(entry.node.derived) : null,
        entry.node.sourcePath,
        entry.node.contentHash,
        now,
      );

      indexedFiles++;
      indexedNodes++;
      changedEntries.push(entry);
    }

    // Re-publish every source edge after all nodes are known so previously
    // rejected edges can backfill when a target skill appears in a later scan.
    for (const entry of parsedMetadata) {
      deleteEdgesBySource.run(entry.node.id);

      for (const edge of entry.edges) {
        warnWeightBand(edge, entry.node.sourcePath, warnings);

        if (edge.sourceId === edge.targetId) {
          rejectedEdges++;
          const warning = `SELF-LOOP: rejected ${edge.sourceId} ${edge.edgeType} ${edge.targetId} (${toDisplayPath(entry.node.sourcePath)})`;
          warnings.push(warning);
          console.warn(`[skill-graph] ${warning}`);
          continue;
        }

        if (!knownSkillIds.has(edge.targetId)) {
          rejectedEdges++;
          const warning = `UNKNOWN-TARGET: rejected ${edge.sourceId} ${edge.edgeType} ${edge.targetId} (${toDisplayPath(entry.node.sourcePath)})`;
          warnings.push(warning);
          console.warn(`[skill-graph] ${warning}`);
          continue;
        }

        insertEdge.run(edge.sourceId, edge.targetId, edge.edgeType, edge.weight, edge.context);
        indexedEdges++;
      }
    }
  });

  tx();

  const summary: SkillGraphIndexResult = {
    scannedFiles: discoveredFiles.length,
    indexedFiles,
    skippedFiles,
    indexedNodes,
    indexedEdges,
    rejectedEdges,
    deletedNodes,
    warnings,
  };

  setMetadata('last_scan_timestamp', new Date().toISOString());
  setMetadata('last_scan_skill_dir', skillDir);
  setMetadata('last_scan_summary', JSON.stringify(summary));

  return summary;
}

// ───────────────────────────────────────────────────────────────
// 8. STATS
// ───────────────────────────────────────────────────────────────

/** Get graph statistics. */
export function getStats(): SkillGraphStats {
  const database = getDb();
  const totalNodes = (database.prepare('SELECT COUNT(*) as c FROM skill_nodes').get() as { c: number }).c;
  const totalEdges = (database.prepare('SELECT COUNT(*) as c FROM skill_edges').get() as { c: number }).c;

  const nodesByFamily: Record<string, number> = {};
  const familyRows = database.prepare(`
    SELECT family, COUNT(*) as c
    FROM skill_nodes
    GROUP BY family
  `).all() as Array<{ family: string; c: number }>;
  for (const row of familyRows) {
    nodesByFamily[row.family] = row.c;
  }

  const edgesByType: Record<string, number> = {};
  const edgeRows = database.prepare(`
    SELECT edge_type, COUNT(*) as c
    FROM skill_edges
    GROUP BY edge_type
  `).all() as Array<{ edge_type: string; c: number }>;
  for (const row of edgeRows) {
    edgesByType[row.edge_type] = row.c;
  }

  let dbFileSize: number | null = null;
  if (dbPath) {
    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
  }

  return {
    totalNodes,
    totalEdges,
    nodesByFamily,
    edgesByType,
    lastScanTimestamp: getLastScanTimestamp(),
    dbFileSize,
    schemaVersion: SCHEMA_VERSION,
  };
}

// ───────────────────────────────────────────────────────────────
// 9. ROW CONVERTERS
// ───────────────────────────────────────────────────────────────

export function rowToSkillNode(row: Record<string, unknown>): SkillNode {
  return {
    id: row.id as string,
    family: row.family as SkillFamily,
    category: row.category as string,
    schemaVersion: row.schema_version as 1 | 2,
    domains: row.domains ? JSON.parse(row.domains as string) as string[] : [],
    intentSignals: row.intent_signals ? JSON.parse(row.intent_signals as string) as string[] : [],
    derived: row.derived ? JSON.parse(row.derived as string) as Record<string, unknown> : null,
    sourcePath: row.source_path as string,
    contentHash: row.content_hash as string,
    indexedAt: row.indexed_at as string | undefined,
  };
}

export function rowToSkillEdge(row: Record<string, unknown>): SkillEdge {
  return {
    id: row.id as number | undefined,
    sourceId: row.source_id as string,
    targetId: row.target_id as string,
    edgeType: row.edge_type as SkillEdgeType,
    weight: row.weight as number,
    context: row.context as string,
  };
}
