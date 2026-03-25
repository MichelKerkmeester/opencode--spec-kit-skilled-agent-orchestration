// TEST: ENTITY LINKER
// Cross-Document Entity Linking
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';

import {
  normalizeEntityName,
  buildEntityCatalog,
  findCrossDocumentMatches,
  createEntityLinks,
  getEntityLinkStats,
  hasEntityInfrastructure,
  runEntityLinking,
  __testables,
} from '../lib/search/entity-linker';

import type {
  EntityMatch,
  EntityLinkResult,
  EntityLinkStats,
} from '../lib/search/entity-linker';

// ───────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────
/** Create an in-memory SQLite database with the required tables. */
function createTestDb(): InstanceType<typeof Database> {
  const db = new Database(':memory:');

  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT 'test',
      file_path TEXT NOT NULL DEFAULT 'test.md',
      title TEXT,
      importance_tier TEXT NOT NULL DEFAULT 'normal'
    );
  `);

  db.exec(`
    CREATE TABLE memory_entities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      entity_text TEXT NOT NULL,
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      frequency INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL DEFAULT 'entity_extractor',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(memory_id, entity_text)
    );
  `);

  db.exec(`
    CREATE TABLE entity_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      canonical_name TEXT NOT NULL UNIQUE,
      aliases TEXT DEFAULT '[]',
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      memory_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    );
  `);

  return db;
}

/** Insert a memory into memory_index. */
function insertMemory(db: InstanceType<typeof Database>, id: number, specFolder: string, title?: string): void {
  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
    .run(id, specFolder, `${specFolder}/test.md`, title ?? `Memory ${id}`);
}

/** Insert an entity into memory_entities. */
function insertEntity(db: InstanceType<typeof Database>, memoryId: number, entityText: string): void {
  db.prepare(`INSERT INTO memory_entities (memory_id, entity_text) VALUES (?, ?)`)
    .run(memoryId, entityText);
}

/** Insert into entity_catalog to satisfy infrastructure gate. */
function insertCatalogEntry(db: InstanceType<typeof Database>, canonicalName: string): void {
  db.prepare(`INSERT OR IGNORE INTO entity_catalog (canonical_name) VALUES (?)`)
    .run(canonicalName);
}

function trackBatchedEdgeCountQueries(db: InstanceType<typeof Database>): { getCount: () => number; restore: () => void } {
  let batchQueryCount = 0;
  const dbWithMutablePrepare = db as unknown as {
    prepare: (sql: string) => ReturnType<InstanceType<typeof Database>['prepare']>;
  };
  const originalPrepare = db.prepare.bind(db) as (sql: string) => ReturnType<InstanceType<typeof Database>['prepare']>;

  dbWithMutablePrepare.prepare = ((sql: string) => {
    if (
      sql.includes('SELECT id, COUNT(*) AS cnt FROM (') &&
      sql.includes('UNION ALL') &&
      sql.includes('GROUP BY id')
    ) {
      batchQueryCount += 1;
    }
    return originalPrepare(sql);
  }) as typeof dbWithMutablePrepare.prepare;

  return {
    getCount: () => batchQueryCount,
    restore: () => {
      dbWithMutablePrepare.prepare = originalPrepare as typeof dbWithMutablePrepare.prepare;
    },
  };
}

// ═════════════════════════════════════════════════════════════
// TESTS
// ═════════════════════════════════════════════════════════════

describe('S8 Entity Linker', () => {
  let db: InstanceType<typeof Database>;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
    delete process.env.SPECKIT_ENTITY_LINKING_MAX_DENSITY;
  });

  // ───────────────────────────────────────────────────────────────
  // 2. NORMALIZEENTITYNAME
  // ───────────────────────────────────────────────────────────────
  describe('normalizeEntityName', () => {
    it('lowercases text', () => {
      expect(normalizeEntityName('Memory System')).toBe('memory system');
    });

    it('strips punctuation', () => {
      expect(normalizeEntityName('hello, world!')).toBe('hello world');
    });

    it('collapses whitespace', () => {
      expect(normalizeEntityName('multiple   spaces   here')).toBe('multiple spaces here');
    });

    it('handles hyphens by replacing with space', () => {
      expect(normalizeEntityName('TF-IDF')).toBe('tf idf');
    });

    it('returns empty string for empty input', () => {
      expect(normalizeEntityName('')).toBe('');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. BUILDENTITYCATALOG
  // ───────────────────────────────────────────────────────────────
  describe('buildEntityCatalog', () => {
    it('returns empty map for empty tables', () => {
      const catalog = buildEntityCatalog(db);
      expect(catalog.size).toBe(0);
    });

    it('creates one entry for a single entity', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertEntity(db, 1, 'Entity Linker');

      const catalog = buildEntityCatalog(db);
      expect(catalog.size).toBe(1);
      expect(catalog.has('entity linker')).toBe(true);
    });

    it('groups entities across memories by canonical name', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertEntity(db, 1, 'Entity Linker');
      insertEntity(db, 2, 'entity linker');

      const catalog = buildEntityCatalog(db);
      expect(catalog.size).toBe(1);

      const entry = catalog.get('entity linker')!;
      expect(entry.memoryIds).toContain(1);
      expect(entry.memoryIds).toContain(2);
      expect(entry.specFolders).toContain('specs/001-alpha');
      expect(entry.specFolders).toContain('specs/002-beta');
    });

    it('includes memory IDs and spec folders', () => {
      insertMemory(db, 10, 'specs/010-search');
      insertEntity(db, 10, 'BM25 Index');

      const catalog = buildEntityCatalog(db);
      const entry = catalog.get('bm25 index')!;
      expect(entry.memoryIds).toEqual([10]);
      expect(entry.specFolders).toEqual(['specs/010-search']);
    });

    it('handles entities in same spec folder without duplicating folder', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/001-alpha');
      insertEntity(db, 1, 'Memory System');
      insertEntity(db, 2, 'Memory System');

      const catalog = buildEntityCatalog(db);
      const entry = catalog.get('memory system')!;
      expect(entry.memoryIds).toHaveLength(2);
      // Spec folder should appear only once
      expect(entry.specFolders).toHaveLength(1);
      expect(entry.specFolders).toEqual(['specs/001-alpha']);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. FINDCROSSDOCUMENTMATCHES
  // ───────────────────────────────────────────────────────────────
  describe('findCrossDocumentMatches', () => {
    it('returns empty array when no cross-doc matches exist', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertEntity(db, 1, 'Alpha Only');

      const matches = findCrossDocumentMatches(db);
      expect(matches).toHaveLength(0);
    });

    it('finds entity present in 2 spec folders', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertEntity(db, 1, 'Shared Entity');
      insertEntity(db, 2, 'shared entity');

      const matches = findCrossDocumentMatches(db);
      expect(matches).toHaveLength(1);
      expect(matches[0].canonicalName).toBe('shared entity');
      expect(matches[0].specFolders).toHaveLength(2);
    });

    it('does not match entity in only 1 spec folder', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/001-alpha');
      insertEntity(db, 1, 'Local Entity');
      insertEntity(db, 2, 'Local Entity');

      const matches = findCrossDocumentMatches(db);
      expect(matches).toHaveLength(0);
    });

    it('finds multiple cross-doc entities', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertEntity(db, 1, 'Entity A');
      insertEntity(db, 2, 'Entity A');
      insertEntity(db, 1, 'Entity B');
      insertEntity(db, 2, 'Entity B');

      const matches = findCrossDocumentMatches(db);
      expect(matches).toHaveLength(2);

      const names = matches.map((m) => m.canonicalName).sort();
      expect(names).toEqual(['entity a', 'entity b']);
    });

    it('uses normalized names for matching', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertEntity(db, 1, 'TF-IDF Score');
      insertEntity(db, 2, 'tf idf score');

      const matches = findCrossDocumentMatches(db);
      expect(matches).toHaveLength(1);
      expect(matches[0].canonicalName).toBe('tf idf score');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. CREATEENTITYLINKS
  // ───────────────────────────────────────────────────────────────
  describe('createEntityLinks', () => {
    it('creates causal_edges with relation=supports', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');

      const matches: EntityMatch[] = [{
        canonicalName: 'test entity',
        memoryIds: [1, 2],
        specFolders: ['specs/001-alpha', 'specs/002-beta'],
      }];

      createEntityLinks(db, matches);

      const edges = db.prepare(`SELECT * FROM causal_edges WHERE relation = 'supports'`).all() as Array<{ relation: string }>;
      expect(edges).toHaveLength(1);
      expect(edges[0].relation).toBe('supports');
    });

    it('sets strength to 0.7', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');

      const matches: EntityMatch[] = [{
        canonicalName: 'test entity',
        memoryIds: [1, 2],
        specFolders: ['specs/001-alpha', 'specs/002-beta'],
      }];

      createEntityLinks(db, matches);

      const edge = db.prepare(`SELECT strength FROM causal_edges`).get() as { strength: number };
      expect(edge.strength).toBeCloseTo(0.7);
    });

    it('sets created_by to entity_linker', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');

      const matches: EntityMatch[] = [{
        canonicalName: 'cross doc entity',
        memoryIds: [1, 2],
        specFolders: ['specs/001-alpha', 'specs/002-beta'],
      }];

      createEntityLinks(db, matches);

      const edge = db.prepare(`SELECT created_by FROM causal_edges`).get() as { created_by: string };
      expect(edge.created_by).toBe('entity_linker');
    });

    it('includes entity name in evidence field', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');

      const matches: EntityMatch[] = [{
        canonicalName: 'memory system',
        memoryIds: [1, 2],
        specFolders: ['specs/001-alpha', 'specs/002-beta'],
      }];

      createEntityLinks(db, matches);

      const edge = db.prepare(`SELECT evidence FROM causal_edges`).get() as { evidence: string };
      expect(edge.evidence).toContain('memory system');
      expect(edge.evidence).toBe('Cross-doc entity: memory system');
    });

    it('skips duplicate edges via INSERT OR IGNORE', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');

      const matches: EntityMatch[] = [{
        canonicalName: 'duplicate test',
        memoryIds: [1, 2],
        specFolders: ['specs/001-alpha', 'specs/002-beta'],
      }];

      // Insert same edge twice via two calls
      const result1 = createEntityLinks(db, matches);
      const result2 = createEntityLinks(db, matches);

      // Second call should create 0 new links (INSERT OR IGNORE)
      // Total edges in table should still be 1
      const count = db.prepare(`SELECT COUNT(*) AS cnt FROM causal_edges`).get() as { cnt: number };
      expect(count.cnt).toBe(1);
    });

    it('uses a single batched edge-count query for a normal multi-memory match', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');

      const matches: EntityMatch[] = [{
        canonicalName: 'batched-count-normal',
        memoryIds: [1, 2, 3],
        specFolders: ['specs/001-alpha', 'specs/002-beta', 'specs/003-gamma'],
      }];

      const tracker = trackBatchedEdgeCountQueries(db);
      try {
        const result = createEntityLinks(db, matches, { maxEdgeDensity: 10 });
        expect(tracker.getCount()).toBe(1);
        expect(result.linksCreated).toBe(3);
      } finally {
        tracker.restore();
      }
    });

    it('skips batched edge-count retrieval for empty match batches', () => {
      const tracker = trackBatchedEdgeCountQueries(db);
      try {
        const result = createEntityLinks(db, []);
        expect(tracker.getCount()).toBe(0);
        expect(result.linksCreated).toBe(0);
        expect(result.entitiesProcessed).toBe(0);
      } finally {
        tracker.restore();
      }
    });

    it('runs one batched edge-count retrieval for single-item batches and creates no links', () => {
      insertMemory(db, 1, 'specs/001-alpha');

      const matches: EntityMatch[] = [{
        canonicalName: 'single-item-batch',
        memoryIds: [1],
        specFolders: ['specs/001-alpha'],
      }];

      const tracker = trackBatchedEdgeCountQueries(db);
      try {
        const result = createEntityLinks(db, matches);
        expect(tracker.getCount()).toBe(1);
        expect(result.linksCreated).toBe(0);
        expect(result.entitiesProcessed).toBe(1);
      } finally {
        tracker.restore();
      }
    });

    it('handles large batches with one batched edge-count retrieval query', () => {
      const largeIds: number[] = [];
      for (let i = 1; i <= 12; i++) {
        largeIds.push(i);
        insertMemory(db, i, `specs/${String(i).padStart(3, '0')}-batch`);
      }

      const matches: EntityMatch[] = [{
        canonicalName: 'large-batch-entity',
        memoryIds: largeIds,
        specFolders: largeIds.map((id) => `specs/${String(id).padStart(3, '0')}-batch`),
      }];

      const tracker = trackBatchedEdgeCountQueries(db);
      try {
        const result = createEntityLinks(db, matches, { maxEdgeDensity: 10 });
        expect(tracker.getCount()).toBe(1);
        expect(result.entitiesProcessed).toBe(1);
        expect(result.linksCreated).toBeGreaterThan(0);
      } finally {
        tracker.restore();
      }
    });

    it('respects MAX_EDGES_PER_NODE limit (20)', () => {
      const { MAX_EDGES_PER_NODE } = __testables;
      expect(MAX_EDGES_PER_NODE).toBe(20);

      // Create a memory with exactly MAX_EDGES_PER_NODE existing edges
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');

      // Fill up memory 1 with MAX_EDGES_PER_NODE edges
      for (let i = 100; i < 100 + MAX_EDGES_PER_NODE; i++) {
        db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES (?, ?, 'caused', 'test')`)
          .run(String(1), String(i));
      }

      const matches: EntityMatch[] = [{
        canonicalName: 'over limit entity',
        memoryIds: [1, 2],
        specFolders: ['specs/001-alpha', 'specs/002-beta'],
      }];

      const result = createEntityLinks(db, matches);
      expect(result.linksCreated).toBe(0);
    });

    it('skips link creation when projected density exceeds threshold', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');
      insertMemory(db, 4, 'specs/004-delta');

      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('1', '3', 'caused', 'test')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('2', '3', 'caused', 'test')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('1', '4', 'caused', 'test')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('2', '4', 'caused', 'test')`).run();

      const matches: EntityMatch[] = [{
        canonicalName: 'dense graph entity',
        memoryIds: [1, 2],
        specFolders: ['specs/001-alpha', 'specs/002-beta'],
      }];

      const result = createEntityLinks(db, matches, { maxEdgeDensity: 1.0 });
      expect(result.linksCreated).toBe(0);
      expect(result.skippedByDensityGuard).toBe(true);
      expect(result.edgeDensity).toBeCloseTo(1.0);
      expect(result.densityThreshold).toBe(1.0);

      const count = db.prepare(`SELECT COUNT(*) AS cnt FROM causal_edges`).get() as { cnt: number };
      expect(count.cnt).toBe(4);
    });

    it('allows link creation when projected density equals threshold', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');
      insertMemory(db, 4, 'specs/004-delta');

      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('1', '3', 'caused', 'test')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('2', '3', 'caused', 'test')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('3', '4', 'caused', 'test')`).run();

      const matches: EntityMatch[] = [{
        canonicalName: 'boundary density entity',
        memoryIds: [1, 2],
        specFolders: ['specs/001-alpha', 'specs/002-beta'],
      }];

      const result = createEntityLinks(db, matches, { maxEdgeDensity: 1.0 });
      expect(result.linksCreated).toBe(1);
      expect(result.skippedByDensityGuard).toBe(false);
      expect(result.densityThreshold).toBe(1.0);

      const count = db.prepare(`SELECT COUNT(*) AS cnt FROM causal_edges`).get() as { cnt: number };
      expect(count.cnt).toBe(4);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. GETENTITYLINKSTATS
  // ───────────────────────────────────────────────────────────────
  describe('getEntityLinkStats', () => {
    it('returns zeros for empty database', () => {
      const stats = getEntityLinkStats(db);
      expect(stats.totalEntityLinks).toBe(0);
      expect(stats.crossDocLinks).toBe(0);
      expect(stats.uniqueEntities).toBe(0);
      expect(stats.coveragePercent).toBe(0);
    });

    it('reports correct total links', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');

      // Insert 2 entity_linker edges
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
        VALUES ('1', '2', 'supports', 0.7, 'Cross-doc entity: test a', 'entity_linker')`)
        .run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
        VALUES ('2', '3', 'supports', 0.7, 'Cross-doc entity: test b', 'entity_linker')`)
        .run();

      const stats = getEntityLinkStats(db);
      expect(stats.totalEntityLinks).toBe(2);
    });

    it('reports correct unique entities', () => {
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');

      // Two edges for the same entity, one for a different entity
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
        VALUES ('1', '2', 'supports', 0.7, 'Cross-doc entity: memory system', 'entity_linker')`)
        .run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
        VALUES ('1', '3', 'supports', 0.7, 'Cross-doc entity: memory system', 'entity_linker')`)
        .run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
        VALUES ('2', '3', 'supports', 0.7, 'Cross-doc entity: bm25 index', 'entity_linker')`)
        .run();

      const stats = getEntityLinkStats(db);
      expect(stats.uniqueEntities).toBe(2);
    });

    it('calculates coverage percent correctly', () => {
      // 4 total memories, 2 are linked
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');
      insertMemory(db, 4, 'specs/004-delta');

      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
        VALUES ('1', '2', 'supports', 0.7, 'Cross-doc entity: shared', 'entity_linker')`)
        .run();

      const stats = getEntityLinkStats(db);
      // 2 linked memories out of 4 total = 50%
      expect(stats.coveragePercent).toBe(50);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. HASENTITYINFRASTRUCTURE
  // ───────────────────────────────────────────────────────────────
  describe('hasEntityInfrastructure', () => {
    it('returns false for empty entity_catalog', () => {
      expect(hasEntityInfrastructure(db)).toBe(false);
    });

    it('returns true when entity_catalog has entries', () => {
      insertCatalogEntry(db, 'memory system');
      expect(hasEntityInfrastructure(db)).toBe(true);
    });

    it('handles missing table gracefully (returns false)', () => {
      // Drop the entity_catalog table to simulate missing infrastructure
      db.exec(`DROP TABLE entity_catalog`);
      expect(hasEntityInfrastructure(db)).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 8. RUNENTITYLINKING (END-TO-END)
  // ───────────────────────────────────────────────────────────────
  describe('runEntityLinking', () => {
    it('end-to-end: extracts cross-doc matches and creates links', () => {
      // Set up entity infrastructure
      insertCatalogEntry(db, 'shared concept');

      // Set up memories in different spec folders
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertEntity(db, 1, 'Shared Concept');
      insertEntity(db, 2, 'shared concept');

      const result = runEntityLinking(db);
      expect(result.linksCreated).toBe(1);
      expect(result.crossDocMatches).toBe(1);
      expect(result.entitiesProcessed).toBe(1);

      // Verify the edge was actually created
      const edges = db.prepare(`SELECT * FROM causal_edges WHERE created_by = 'entity_linker'`).all() as Array<{ relation: string }>;
      expect(edges).toHaveLength(1);
      expect(edges[0].relation).toBe('supports');
    });

    it('returns zero when no entities exist', () => {
      // Infrastructure exists but no entities in memory_entities
      insertCatalogEntry(db, 'some entity');

      const result = runEntityLinking(db);
      expect(result.linksCreated).toBe(0);
      expect(result.entitiesProcessed).toBe(0);
      expect(result.crossDocMatches).toBe(0);
    });

    it('returns zero when no cross-doc matches exist', () => {
      insertCatalogEntry(db, 'local only');

      // Two memories in the same spec folder
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/001-alpha');
      insertEntity(db, 1, 'Local Only');
      insertEntity(db, 2, 'Local Only');

      const result = runEntityLinking(db);
      expect(result.linksCreated).toBe(0);
      expect(result.crossDocMatches).toBe(0);
    });

    it('honors density-threshold env override for S5 linking', () => {
      process.env.SPECKIT_ENTITY_LINKING_MAX_DENSITY = '1.5';

      insertCatalogEntry(db, 'shared concept');

      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');
      insertMemory(db, 4, 'specs/004-delta');

      insertEntity(db, 1, 'Shared Concept');
      insertEntity(db, 2, 'shared concept');

      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('100', '200', 'caused', 'seed')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('101', '201', 'caused', 'seed')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('102', '202', 'caused', 'seed')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('103', '203', 'caused', 'seed')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('104', '204', 'caused', 'seed')`).run();

      const result = runEntityLinking(db);
      expect(result.linksCreated).toBe(1);
      expect(result.crossDocMatches).toBe(1);
      expect(result.densityThreshold).toBe(1.5);
    });

    it('falls back to default threshold for invalid density env value', () => {
      process.env.SPECKIT_ENTITY_LINKING_MAX_DENSITY = 'not-a-number';

      insertCatalogEntry(db, 'shared concept');

      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');
      insertMemory(db, 4, 'specs/004-delta');

      insertEntity(db, 1, 'Shared Concept');
      insertEntity(db, 2, 'shared concept');

      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('100', '200', 'caused', 'seed')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('101', '201', 'caused', 'seed')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('102', '202', 'caused', 'seed')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('103', '203', 'caused', 'seed')`).run();
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation, created_by) VALUES ('104', '204', 'caused', 'seed')`).run();

      const result = runEntityLinking(db);
      expect(result.linksCreated).toBe(0);
      expect(result.skippedByDensityGuard).toBe(true);
      expect(result.densityThreshold).toBe(1.0);
      expect(result.edgeDensity).toBeCloseTo(1.25);
    });

    it('creates correct number of pairwise links', () => {
      insertCatalogEntry(db, 'multi folder entity');

      // Entity shared across 3 spec folders = 3 pairwise combinations
      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertMemory(db, 3, 'specs/003-gamma');
      insertEntity(db, 1, 'Multi Folder Entity');
      insertEntity(db, 2, 'multi folder entity');
      insertEntity(db, 3, 'Multi Folder Entity');

      const result = runEntityLinking(db);
      // 3 memories in 3 different folders: C(3,2) = 3 pairwise links
      expect(result.linksCreated).toBe(3);
      expect(result.crossDocMatches).toBe(1);
      expect(result.entitiesProcessed).toBe(1);
    });

    it('source_id and target_id are strings (TEXT columns)', () => {
      insertCatalogEntry(db, 'string ids');

      insertMemory(db, 1, 'specs/001-alpha');
      insertMemory(db, 2, 'specs/002-beta');
      insertEntity(db, 1, 'String IDs');
      insertEntity(db, 2, 'String IDs');

      runEntityLinking(db);

      const edge = db.prepare(`SELECT source_id, target_id FROM causal_edges WHERE created_by = 'entity_linker'`).get() as { source_id: string; target_id: string };
      expect(typeof edge.source_id).toBe('string');
      expect(typeof edge.target_id).toBe('string');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 9. EDGE CASES
  // ───────────────────────────────────────────────────────────────
  describe('Edge cases', () => {
    it('handles many entities without errors', () => {
      // Insert 50 entities across 5 spec folders
      for (let folder = 0; folder < 5; folder++) {
        for (let mem = 0; mem < 10; mem++) {
          const id = folder * 10 + mem + 1;
          insertMemory(db, id, `specs/${String(folder).padStart(3, '0')}-folder`);
          insertEntity(db, id, `Entity ${mem}`);
        }
      }

      insertCatalogEntry(db, 'entity 0');

      // Should not throw
      const result = runEntityLinking(db);
      expect(result.crossDocMatches).toBeGreaterThan(0);
      expect(result.linksCreated).toBeGreaterThan(0);
    });

    it('normalizes entities with special characters correctly', () => {
      expect(normalizeEntityName('hello@world#2024!')).toBe('hello world 2024');
      expect(normalizeEntityName('C++ Programming')).toBe('c programming');
      expect(normalizeEntityName('key=value&foo=bar')).toBe('key value foo bar');
      expect(normalizeEntityName('(parenthesized)')).toBe('parenthesized');
      expect(normalizeEntityName('[brackets]')).toBe('brackets');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 10. __TESTABLES INTERNAL EXPORTS
  // ───────────────────────────────────────────────────────────────
  describe('__testables', () => {
    it('exposes MAX_EDGES_PER_NODE constant', () => {
      expect(__testables.MAX_EDGES_PER_NODE).toBe(20);
    });

    it('exposes normalizeEntityName function', () => {
      expect(typeof __testables.normalizeEntityName).toBe('function');
      expect(__testables.normalizeEntityName('TEST')).toBe('test');
    });

    it('exposes density-threshold helpers', () => {
      expect(typeof __testables.sanitizeDensityThreshold).toBe('function');
      expect(typeof __testables.getEntityLinkingDensityThreshold).toBe('function');
      expect(typeof __testables.getGlobalEdgeDensityStats).toBe('function');
    });

    it('exposes getEdgeCount function', () => {
      expect(typeof __testables.getEdgeCount).toBe('function');

      // No edges yet
      const count = __testables.getEdgeCount(db, '1');
      expect(count).toBe(0);

      // Add an edge and verify
      db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation) VALUES ('1', '2', 'supports')`).run();
      expect(__testables.getEdgeCount(db, '1')).toBe(1);
      expect(__testables.getEdgeCount(db, '2')).toBe(1);
    });

    it('exposes getSpecFolder function', () => {
      expect(typeof __testables.getSpecFolder).toBe('function');

      // No memory
      expect(__testables.getSpecFolder(db, 999)).toBeNull();

      // Add memory and verify
      insertMemory(db, 1, 'specs/001-test');
      expect(__testables.getSpecFolder(db, 1)).toBe('specs/001-test');
    });
  });
});
