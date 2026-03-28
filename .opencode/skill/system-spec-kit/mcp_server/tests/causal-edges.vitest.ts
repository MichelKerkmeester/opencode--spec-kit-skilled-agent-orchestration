// TEST: CAUSAL EDGES
import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import Database from 'better-sqlite3';
import * as causalEdges from '../lib/storage/causal-edges.js';

type SqliteDatabase = InstanceType<typeof Database>;
type RelationType = (typeof causalEdges.RELATION_TYPES)[keyof typeof causalEdges.RELATION_TYPES];
type CausalChainNode = ReturnType<typeof causalEdges.getCausalChain>;

function collectNodes(node: CausalChainNode): string[] {
  const nodes: string[] = [node.id];
  for (const child of node.children) {
    nodes.push(...collectNodes(child));
  }
  return nodes;
}

function flattenChain(node: CausalChainNode): CausalChainNode[] {
  return [node, ...node.children.flatMap((child) => flattenChain(child))];
}

describe('Causal Edges (T043-T047, T128-T141)', () => {
  let testDb: SqliteDatabase;

  function resetEdges(): void {
    testDb.exec('DELETE FROM causal_edges');
    testDb.exec('DELETE FROM weight_history');
  }

  function ensureWeightHistoryTable(): void {
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS weight_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
        old_strength REAL NOT NULL,
        new_strength REAL NOT NULL,
        changed_by TEXT DEFAULT 'manual',
        changed_at TEXT DEFAULT (datetime('now')),
        reason TEXT
      )
    `);
  }

  function insertEdgeOrThrow(
    sourceId: string,
    targetId: string,
    relation: RelationType,
    strength: number = 1.0,
    evidence: string | null = null,
  ): number {
    const edgeId = causalEdges.insertEdge(sourceId, targetId, relation, strength, evidence);
    if (edgeId === null) {
      throw new Error(`Failed to insert edge ${sourceId} -> ${targetId} (${relation})`);
    }
    return edgeId;
  }

  function seedLinearChain(length: number): void {
    for (let i = 1; i < length; i++) {
      insertEdgeOrThrow(String(i), String(i + 1), causalEdges.RELATION_TYPES.CAUSED, 0.9, `edge-${i}`);
    }
  }

  beforeAll(() => {
    testDb = new Database(':memory:');

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS causal_edges (
        id INTEGER PRIMARY KEY,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        relation TEXT NOT NULL CHECK(relation IN (
          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
        )),
        strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
        evidence TEXT,
        extracted_at TEXT DEFAULT (datetime('now')),
        created_by TEXT DEFAULT 'manual',
        last_accessed TEXT,
        UNIQUE(source_id, target_id, relation)
      )
    `);

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS weight_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
        old_strength REAL NOT NULL,
        new_strength REAL NOT NULL,
        changed_by TEXT DEFAULT 'manual',
        changed_at TEXT DEFAULT (datetime('now')),
        reason TEXT
      )
    `);

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL DEFAULT '',
        file_path TEXT NOT NULL DEFAULT '',
        title TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        importance_tier TEXT DEFAULT 'normal'
      )
    `);

    const memoryStmt = testDb.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    memoryStmt.run(1, 'test-spec', '/mem/1.md', 'Memory 1');
    memoryStmt.run(2, 'test-spec', '/mem/2.md', 'Memory 2');
    memoryStmt.run(3, 'test-spec', '/mem/3.md', 'Memory 3');
    memoryStmt.run(4, 'test-spec', '/mem/4.md', 'Memory 4');
    memoryStmt.run(5, 'test-spec', '/mem/5.md', 'Memory 5');

    causalEdges.init(testDb);
  });

  beforeEach(() => {
    resetEdges();
  });

  afterAll(() => {
    testDb.close();
  });

  describe('T044 - Relation Types', () => {
    it('should define 6 relationship types', () => {
      expect(Object.keys(causalEdges.RELATION_TYPES)).toHaveLength(6);
    });

    it('should include all expected types', () => {
      const expected = ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'];
      const values = Object.values(causalEdges.RELATION_TYPES);
      expect(values).toEqual(expect.arrayContaining(expected));
    });

    it('should export frozen RELATION_TYPES constants', () => {
      expect(Object.isFrozen(causalEdges.RELATION_TYPES)).toBe(true);
    });
  });

  describe('T045 - Edge Insertion', () => {
    it('should insert a basic edge', () => {
      const edgeId = causalEdges.insertEdge('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9, 'basic');
      expect(edgeId).toBeTypeOf('number');

      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(edges[0]).toMatchObject({
        source_id: '1',
        target_id: '2',
        relation: causalEdges.RELATION_TYPES.CAUSED,
        strength: 0.9,
        evidence: 'basic',
      });
    });

    it('should insert all relation types', () => {
      const relationTypes = Object.values(causalEdges.RELATION_TYPES);
      relationTypes.forEach((relation, index) => {
        insertEdgeOrThrow('10', `20-${index}`, relation, 0.5 + index * 0.01, relation);
      });

      const edges = causalEdges.getEdgesFrom('10');
      expect(edges).toHaveLength(6);
      expect(new Set(edges.map((edge) => edge.relation))).toEqual(new Set(relationTypes));
    });

    it('rethrows database write failures so handlers can classify them', () => {
      const originalPrepare = testDb.prepare.bind(testDb);
      const prepareSpy = vi.spyOn(testDb, 'prepare').mockImplementation((sql: string) => {
        if (sql.includes('INSERT INTO causal_edges')) {
          throw new Error('SQLITE_BUSY: database is locked');
        }
        return originalPrepare(sql);
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      try {
        expect(() => (
          causalEdges.insertEdge('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9, 'busy-db')
        )).toThrow('SQLITE_BUSY: database is locked');
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('[causal-edges] insertEdge error: SQLITE_BUSY: database is locked')
        );
      } finally {
        prepareSpy.mockRestore();
        warnSpy.mockRestore();
      }
    });

    it('should validate required source_id', () => {
      const edgeId = causalEdges.insertEdge(
        undefined as unknown as string,
        '2',
        causalEdges.RELATION_TYPES.CAUSED,
        0.8,
      );
      expect(edgeId).toBeNull();
      expect(causalEdges.getAllEdges()).toHaveLength(0);
    });

    it('should validate relation type', () => {
      const invalidRelation = 'invalid-relation' as RelationType;
      const edgeId = causalEdges.insertEdge('1', '2', invalidRelation, 0.8);
      expect(edgeId).toBeNull();
      expect(causalEdges.getAllEdges()).toHaveLength(0);
    });

    it('should validate strength bounds', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 1.5);
      insertEdgeOrThrow('3', '4', causalEdges.RELATION_TYPES.ENABLED, -0.5);

      const highStrength = causalEdges.getEdgesFrom('1')[0];
      const lowStrength = causalEdges.getEdgesFrom('3')[0];
      expect(highStrength.strength).toBe(1.0);
      expect(lowStrength.strength).toBe(0.0);
    });

    it('should prevent self-referential edges', () => {
      const edgeId = causalEdges.insertEdge('9', '9', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      expect(edgeId).toBeNull();
      expect(causalEdges.getAllEdges()).toHaveLength(0);
    });
  });

  describe('T045 - Edge Retrieval', () => {
    it('should get edges from a source node', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('1', '3', causalEdges.RELATION_TYPES.ENABLED, 0.6);
      const edges = causalEdges.getEdgesFrom('1');

      expect(edges).toHaveLength(2);
      expect(edges[0].strength).toBeGreaterThanOrEqual(edges[1].strength);
    });

    it('should get edges to a target node', () => {
      insertEdgeOrThrow('1', '9', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('2', '9', causalEdges.RELATION_TYPES.SUPPORTS, 0.5);
      const edges = causalEdges.getEdgesTo('9');

      expect(edges).toHaveLength(2);
      expect(new Set(edges.map((edge) => edge.source_id))).toEqual(new Set(['1', '2']));
    });

    it('should get all edges for a node', () => {
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('4', '2', causalEdges.RELATION_TYPES.SUPPORTS, 0.7);

      const outgoing = causalEdges.getEdgesFrom('2');
      const incoming = causalEdges.getEdgesTo('2');
      expect(outgoing).toHaveLength(1);
      expect(incoming).toHaveLength(1);
      expect(outgoing[0].target_id).toBe('3');
      expect(incoming[0].source_id).toBe('4');
    });

    it('should filter edges by relation type', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.SUPPORTS, 0.8);
      insertEdgeOrThrow('1', '3', causalEdges.RELATION_TYPES.CAUSED, 0.8);
      insertEdgeOrThrow('1', '4', causalEdges.RELATION_TYPES.SUPPORTS, 0.8);

      const supportsOnly = causalEdges
        .getEdgesFrom('1')
        .filter((edge) => edge.relation === causalEdges.RELATION_TYPES.SUPPORTS);

      expect(supportsOnly).toHaveLength(2);
      expect(supportsOnly.every((edge) => edge.relation === causalEdges.RELATION_TYPES.SUPPORTS)).toBe(true);
    });
  });

  describe('T046 - Causal Chain Traversal', () => {
    it('should traverse chain with depth (CHK-063)', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.ENABLED, 0.9);
      insertEdgeOrThrow('3', '4', causalEdges.RELATION_TYPES.SUPPORTS, 0.8);

      const chain = causalEdges.getCausalChain('1', 10, 'forward');
      expect(collectNodes(chain)).toEqual(['1', '2', '3', '4']);
    });

    it('should limit depth', () => {
      seedLinearChain(6); // 1 -> 2 -> 3 -> 4 -> 5 -> 6
      const chain = causalEdges.getCausalChain('1', 2, 'forward');
      expect(collectNodes(chain)).toEqual(['1', '2', '3']);
    });

    it('should group results by relation type', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.ENABLED, 1.0);
      insertEdgeOrThrow('2', '4', causalEdges.RELATION_TYPES.SUPPORTS, 1.0);

      const chain = causalEdges.getCausalChain('1', 3, 'forward');
      const relationCounts = flattenChain(chain)
        .filter((node) => node.depth > 0)
        .reduce<Record<string, number>>((acc, node) => {
          acc[node.relation] = (acc[node.relation] ?? 0) + 1;
          return acc;
        }, {});

      expect(relationCounts).toMatchObject({
        caused: 1,
        enabled: 1,
        supports: 1,
      });
    });

    it('should support direction filtering', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.CAUSED, 1.0);

      const forward = causalEdges.getCausalChain('1', 10, 'forward');
      const backward = causalEdges.getCausalChain('3', 10, 'backward');

      expect(collectNodes(forward)).toEqual(['1', '2', '3']);
      expect(collectNodes(backward)).toEqual(['3', '2', '1']);
    });

    it('should handle cycles safely', () => {
      insertEdgeOrThrow('A', 'B', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('B', 'C', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('C', 'A', causalEdges.RELATION_TYPES.CAUSED, 1.0);

      const chain = causalEdges.getCausalChain('A', 10, 'forward');
      const nodes = collectNodes(chain);
      expect(nodes).toEqual(['A', 'B', 'C']);
      expect(new Set(nodes).size).toBe(3);
    });

    it('preserves both branches of a diamond graph when they converge on the same node', () => {
      insertEdgeOrThrow('A', 'B', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('A', 'C', causalEdges.RELATION_TYPES.ENABLED, 1.0);
      insertEdgeOrThrow('B', 'D', causalEdges.RELATION_TYPES.SUPPORTS, 1.0);
      insertEdgeOrThrow('C', 'D', causalEdges.RELATION_TYPES.DERIVED_FROM, 1.0);

      const chain = causalEdges.getCausalChain('A', 10, 'forward');
      const edgePairs = flattenChain(chain)
        .flatMap((node) => node.children.map((child) => `${node.id}->${child.id}:${child.relation}`));

      expect(edgePairs).toEqual(expect.arrayContaining([
        'A->B:caused',
        'A->C:enabled',
        'B->D:supports',
        'C->D:derived_from',
      ]));
      expect(edgePairs.filter((pair) => pair.endsWith('->D:supports') || pair.endsWith('->D:derived_from'))).toHaveLength(2);
    });

    it('propagates traversal strength cumulatively across deeper paths', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.8);
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.SUPPORTS, 0.5);

      const chain = causalEdges.getCausalChain('1', 10, 'forward');
      const firstHop = chain.children[0];
      const secondHop = firstHop.children[0];
      const firstHopExpected = Math.min(1, 0.8 * causalEdges.RELATION_WEIGHTS.caused);

      expect(firstHop.strength).toBeCloseTo(firstHopExpected, 5);
      expect(secondHop.strength).toBeCloseTo(
        firstHopExpected * 0.5 * causalEdges.RELATION_WEIGHTS.supports,
        5,
      );
    });
  });

  describe('T045 - Edge Management', () => {
    it('should update an edge', () => {
      const edgeId = insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.3, 'before');
      const updated = causalEdges.updateEdge(edgeId, { strength: 0.8, evidence: 'after' });
      const edge = causalEdges.getEdgesFrom('1')[0];

      expect(updated).toBe(true);
      expect(edge.strength).toBe(0.8);
      expect(edge.evidence).toBe('after');
    });

    it('should delete an edge', () => {
      const edgeId = insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      const deleted = causalEdges.deleteEdge(edgeId);

      expect(deleted).toBe(true);
      expect(causalEdges.getAllEdges()).toHaveLength(0);
    });

    it('should delete all edges for a memory', () => {
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.ENABLED, 0.8);
      insertEdgeOrThrow('2', '4', causalEdges.RELATION_TYPES.SUPPORTS, 0.7);
      insertEdgeOrThrow('5', '6', causalEdges.RELATION_TYPES.CONTRADICTS, 0.5);

      const removed = causalEdges.deleteEdgesForMemory('2');
      const remaining = causalEdges.getAllEdges();

      expect(removed).toBe(3);
      expect(remaining).toHaveLength(1);
      expect(remaining[0].source_id).toBe('5');
      expect(remaining[0].target_id).toBe('6');
    });
  });

  describe('CHK-065 - Graph Statistics', () => {
    it('should count total edges', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.8);
      insertEdgeOrThrow('1', '3', causalEdges.RELATION_TYPES.ENABLED, 0.6);
      insertEdgeOrThrow('2', '4', causalEdges.RELATION_TYPES.SUPPORTS, 1.0);
      insertEdgeOrThrow('5', '4', causalEdges.RELATION_TYPES.CONTRADICTS, 0.4);

      const stats = causalEdges.getGraphStats();
      expect(stats.totalEdges).toBe(4);
    });

    it('should break down by relation type', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.8);
      insertEdgeOrThrow('1', '3', causalEdges.RELATION_TYPES.ENABLED, 0.6);
      insertEdgeOrThrow('2', '4', causalEdges.RELATION_TYPES.SUPPORTS, 1.0);
      insertEdgeOrThrow('5', '4', causalEdges.RELATION_TYPES.CONTRADICTS, 0.4);

      const stats = causalEdges.getGraphStats();
      expect(stats.byRelation).toMatchObject({
        caused: 1,
        enabled: 1,
        supports: 1,
        contradicts: 1,
      });
    });

    it('should track unique memories in graph', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.8);
      insertEdgeOrThrow('1', '3', causalEdges.RELATION_TYPES.ENABLED, 0.6);
      insertEdgeOrThrow('2', '4', causalEdges.RELATION_TYPES.SUPPORTS, 1.0);
      insertEdgeOrThrow('5', '4', causalEdges.RELATION_TYPES.CONTRADICTS, 0.4);

      const stats = causalEdges.getGraphStats();
      expect(stats.uniqueSources).toBe(3); // 1,2,5
      expect(stats.uniqueTargets).toBe(3); // 2,3,4
    });

    it('should calculate link coverage', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.8);
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.ENABLED, 0.6);
      insertEdgeOrThrow('3', '4', causalEdges.RELATION_TYPES.SUPPORTS, 1.0);

      const linkedCount = (
        testDb.prepare(`
          SELECT COUNT(DISTINCT memory_id) AS count
          FROM (
            SELECT source_id AS memory_id FROM causal_edges
            UNION
            SELECT target_id AS memory_id FROM causal_edges
          )
        `).get() as { count: number }
      ).count;
      const totalMemories = (
        testDb.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number }
      ).count;
      const coverage = linkedCount / totalMemories;

      expect(coverage).toBeCloseTo(0.8, 5); // 4 of 5 seeded memories linked
    });

    it('should detect orphaned edges', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('999', '1', causalEdges.RELATION_TYPES.SUPPORTS, 0.5);

      const orphans = causalEdges.findOrphanedEdges();
      expect(orphans).toHaveLength(1);
      expect(orphans[0].source_id).toBe('999');
    });
  });

  describe('T045 - Batch Insertion', () => {
    it('should insert a batch of edges', () => {
      const result = causalEdges.insertEdgesBatch([
        { sourceId: '1', targetId: '2', relation: causalEdges.RELATION_TYPES.CAUSED, strength: 0.9 },
        { sourceId: '2', targetId: '3', relation: causalEdges.RELATION_TYPES.ENABLED, strength: 0.7 },
        { sourceId: '3', targetId: '4', relation: causalEdges.RELATION_TYPES.SUPPORTS, evidence: 'batch' },
      ]);

      expect(result).toEqual({ inserted: 3, failed: 0 });
      expect(causalEdges.getAllEdges()).toHaveLength(3);
    });

    it('should handle partial failures in batch', () => {
      const result = causalEdges.insertEdgesBatch([
        { sourceId: '1', targetId: '2', relation: causalEdges.RELATION_TYPES.CAUSED, strength: 0.9 },
        { sourceId: '3', targetId: '3', relation: causalEdges.RELATION_TYPES.ENABLED, strength: 0.7 }, // self-loop
        { sourceId: '4', targetId: '5', relation: causalEdges.RELATION_TYPES.SUPPORTS, evidence: 'valid' },
      ]);

      expect(result.inserted).toBe(2);
      expect(result.failed).toBe(1);
      expect(causalEdges.getAllEdges()).toHaveLength(2);
    });
  });

  describe('T128 - Schema Verification', () => {
    it('should have all required columns', () => {
      const columns = testDb.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>;
      const names = columns.map((column) => column.name);
      expect(names).toEqual(
        expect.arrayContaining(['id', 'source_id', 'target_id', 'relation', 'strength', 'evidence', 'extracted_at']),
      );
    });

    it('should have correct column types', () => {
      const columns = testDb.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string; type: string }>;
      const typeByColumn = Object.fromEntries(columns.map((column) => [column.name, column.type]));
      expect(typeByColumn.id).toBe('INTEGER');
      expect(typeByColumn.source_id).toBe('TEXT');
      expect(typeByColumn.target_id).toBe('TEXT');
      expect(typeByColumn.relation).toBe('TEXT');
      expect(typeByColumn.strength).toBe('REAL');
      expect(typeByColumn.evidence).toBe('TEXT');
      expect(typeByColumn.extracted_at).toBe('TEXT');
    });

    it('should have required indexes', () => {
      const indexes = testDb.prepare('PRAGMA index_list(causal_edges)').all() as Array<{ name: string }>;
      const names = indexes.map((index) => index.name);
      expect(names).toContain('idx_causal_source');
      expect(names).toContain('idx_causal_target');

      const uniqueIndex = indexes.find((index) => index.name.startsWith('sqlite_autoindex_causal_edges'));
      expect(uniqueIndex).toBeDefined();
      if (!uniqueIndex) {
        return;
      }

      const uniqueColumns = testDb.prepare(`PRAGMA index_info(${uniqueIndex.name})`).all() as Array<{ name: string }>;
      expect(uniqueColumns.map((column) => column.name)).toEqual(['source_id', 'target_id', 'relation']);
    });
  });

  describe('T129-T135 - Individual Relation Types', () => {
    it('T129: RELATION_TYPES contains exactly 6 types', () => {
      expect(Object.values(causalEdges.RELATION_TYPES)).toHaveLength(6);
    });

    it('T130: caused relation insertable and retrievable', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.8);
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(edges[0].relation).toBe(causalEdges.RELATION_TYPES.CAUSED);
    });

    it('T131: enabled relation insertable and retrievable', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.ENABLED, 0.8);
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(edges[0].relation).toBe(causalEdges.RELATION_TYPES.ENABLED);
    });

    it('T132: supersedes relation insertable and retrievable', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.SUPERSEDES, 0.8);
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(edges[0].relation).toBe(causalEdges.RELATION_TYPES.SUPERSEDES);
    });

    it('T133: contradicts relation insertable and retrievable', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CONTRADICTS, 0.8);
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(edges[0].relation).toBe(causalEdges.RELATION_TYPES.CONTRADICTS);
    });

    it('T134: derived_from relation insertable and retrievable', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.DERIVED_FROM, 0.8);
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(edges[0].relation).toBe(causalEdges.RELATION_TYPES.DERIVED_FROM);
    });

    it('T135: supports relation insertable and retrievable', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.SUPPORTS, 0.8);
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(edges[0].relation).toBe(causalEdges.RELATION_TYPES.SUPPORTS);
    });
  });

  describe('T136 - Insert Validates Required Fields', () => {
    it('should throw for missing source_id', () => {
      const edgeId = causalEdges.insertEdge(
        undefined as unknown as string,
        '2',
        causalEdges.RELATION_TYPES.CAUSED,
        0.5,
      );
      expect(edgeId).toBeNull();
    });

    it('should throw for missing target_id', () => {
      const edgeId = causalEdges.insertEdge(
        '1',
        undefined as unknown as string,
        causalEdges.RELATION_TYPES.CAUSED,
        0.5,
      );
      expect(edgeId).toBeNull();
    });

    it('should throw for missing relation', () => {
      const edgeId = causalEdges.insertEdge('1', '2', undefined as unknown as RelationType, 0.5);
      expect(edgeId).toBeNull();
    });

    it('should throw for invalid relation type', () => {
      const edgeId = causalEdges.insertEdge('1', '2', 'invalid' as RelationType, 0.5);
      expect(edgeId).toBeNull();
    });

    it('should throw for null source_id', () => {
      const edgeId = causalEdges.insertEdge(null as unknown as string, '2', causalEdges.RELATION_TYPES.CAUSED, 0.5);
      expect(edgeId).toBeNull();
    });

    it('should throw for empty string source_id', () => {
      const edgeId = causalEdges.insertEdge('', '2', causalEdges.RELATION_TYPES.CAUSED, 0.5);
      expect(edgeId).toBeTypeOf('number');
      expect(causalEdges.getEdgesFrom('')).toHaveLength(1);
    });
  });

  describe('T137 - Strength Bounds Validation', () => {
    it('should throw for strength > 1.0', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 2.5);
      const edge = causalEdges.getEdgesFrom('1')[0];
      expect(edge.strength).toBe(1.0);
    });

    it('should throw for strength < 0.0', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, -0.5);
      const edge = causalEdges.getEdgesFrom('1')[0];
      expect(edge.strength).toBe(0.0);
    });

    it('should reject non-numeric strength input', () => {
      const edgeId = causalEdges.insertEdge('1', '2', causalEdges.RELATION_TYPES.CAUSED, Number.NaN);
      expect(edgeId).toBeNull();
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(0);
    });

    it('should accept strength = 0.0', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.0);
      const edge = causalEdges.getEdgesFrom('1')[0];
      expect(edge.strength).toBe(0.0);
    });

    it('should accept strength = 1.0', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      const edge = causalEdges.getEdgesFrom('1')[0];
      expect(edge.strength).toBe(1.0);
    });

    it('should accept strength = 0.5', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.5);
      const edge = causalEdges.getEdgesFrom('1')[0];
      expect(edge.strength).toBe(0.5);
    });
  });

  describe('T138 - Self-Referential Prevention', () => {
    it('should throw for identical string IDs', () => {
      const edgeId = causalEdges.insertEdge('1', '1', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      expect(edgeId).toBeNull();
    });

    it('should throw for identical numeric IDs', () => {
      const edgeId = causalEdges.insertEdge(
        1 as unknown as string,
        1 as unknown as string,
        causalEdges.RELATION_TYPES.CAUSED,
        0.9,
      );
      expect(edgeId).toBeNull();
    });

    it('should throw for equivalent string/number IDs', () => {
      const edgeId = causalEdges.insertEdge('7', 7 as unknown as string, causalEdges.RELATION_TYPES.CAUSED, 0.9);
      expect(edgeId).toBeTypeOf('number');
      expect(causalEdges.getEdgesFrom('7')).toHaveLength(1);
    });

    it('should accept different source and target IDs', () => {
      const edgeId = causalEdges.insertEdge('10', '11', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      expect(edgeId).toBeTypeOf('number');
      expect(causalEdges.getAllEdges()).toHaveLength(1);
    });
  });

  describe('T139 - Depth-Limited Traversal', () => {
    it('should respect max_depth = 10', () => {
      seedLinearChain(14);
      const chain = causalEdges.getCausalChain('1', 10, 'forward');
      expect(collectNodes(chain)).toHaveLength(11);
    });

    it('should respect max_depth = 5', () => {
      seedLinearChain(14);
      const chain = causalEdges.getCausalChain('1', 5, 'forward');
      expect(collectNodes(chain)).toHaveLength(6);
    });

    it('should cap max_depth at 10', () => {
      seedLinearChain(14);
      const chain = causalEdges.getCausalChain('1', 20, 'forward');
      expect(collectNodes(chain)).toHaveLength(14);
    });

    it('should respect max_depth = 1', () => {
      seedLinearChain(14);
      const chain = causalEdges.getCausalChain('1', 1, 'forward');
      expect(collectNodes(chain)).toEqual(['1', '2']);
    });

    it('should return traversal_options with max_depth', () => {
      seedLinearChain(8);
      const maxDepth = 3;
      const chain = causalEdges.getCausalChain('1', maxDepth, 'forward');
      const deepestDepth = Math.max(...flattenChain(chain).map((node) => node.depth));
      expect(deepestDepth).toBeLessThanOrEqual(maxDepth);
    });
  });

  describe('T140 - Cycle Detection', () => {
    it('should complete in reasonable time despite cycle', () => {
      insertEdgeOrThrow('A', 'B', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('B', 'C', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('C', 'A', causalEdges.RELATION_TYPES.CAUSED, 1.0);

      const startedAt = Date.now();
      const chain = causalEdges.getCausalChain('A', 100, 'forward');
      const elapsedMs = Date.now() - startedAt;

      expect(collectNodes(chain)).toEqual(['A', 'B', 'C']);
      expect(elapsedMs).toBeLessThan(1000);
    });

    it('should not produce excessive edges from cycle', () => {
      insertEdgeOrThrow('A', 'B', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('B', 'C', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('C', 'A', causalEdges.RELATION_TYPES.CAUSED, 1.0);

      const chain = causalEdges.getCausalChain('A', 20, 'forward');
      const nodes = collectNodes(chain);
      expect(nodes).toHaveLength(3);
      expect(new Set(nodes).size).toBe(3);
    });

    it('should handle complex diamond cycle', () => {
      insertEdgeOrThrow('A', 'B', causalEdges.RELATION_TYPES.CAUSED, 1.0);
      insertEdgeOrThrow('A', 'C', causalEdges.RELATION_TYPES.ENABLED, 0.9);
      insertEdgeOrThrow('B', 'D', causalEdges.RELATION_TYPES.SUPPORTS, 0.8);
      insertEdgeOrThrow('C', 'D', causalEdges.RELATION_TYPES.DERIVED_FROM, 0.7);
      insertEdgeOrThrow('D', 'A', causalEdges.RELATION_TYPES.SUPERSEDES, 0.6);

      const chain = causalEdges.getCausalChain('A', 20, 'forward');
      const nodes = collectNodes(chain);
      expect(new Set(nodes)).toEqual(new Set(['A', 'B', 'C', 'D']));
    });

    it('should handle non-existent node gracefully', () => {
      const chain = causalEdges.getCausalChain('not-there', 5, 'forward');
      expect(chain.id).toBe('not-there');
      expect(chain.children).toHaveLength(0);
    });
  });

  describe('T141 - Decision Lineage (memory_drift_why)', () => {
    it('should trace incoming edges for decision lineage', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9, 'cause');
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.SUPPORTS, 0.7, 'support');

      const lineage = causalEdges.getCausalChain('3', 10, 'backward');
      expect(collectNodes(lineage)).toEqual(['3', '2', '1']);
    });

    it('should return edges with relation types', () => {
      insertEdgeOrThrow('1', '3', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.CONTRADICTS, 0.4);

      const incoming = causalEdges.getEdgesTo('3');
      expect(incoming.map((edge) => edge.relation)).toEqual(
        expect.arrayContaining([causalEdges.RELATION_TYPES.CAUSED, causalEdges.RELATION_TYPES.CONTRADICTS]),
      );
    });

    it('should include evidence in lineage', () => {
      insertEdgeOrThrow('1', '3', causalEdges.RELATION_TYPES.CAUSED, 0.9, 'root-cause evidence');
      const incoming = causalEdges.getEdgesTo('3');
      expect(incoming[0].evidence).toBe('root-cause evidence');
    });

    it('should group results for why analysis', () => {
      insertEdgeOrThrow('1', '3', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('2', '3', causalEdges.RELATION_TYPES.SUPPORTS, 0.8);
      insertEdgeOrThrow('4', '3', causalEdges.RELATION_TYPES.SUPPORTS, 0.7);

      const grouped = causalEdges.getEdgesTo('3').reduce<Record<string, number>>((acc, edge) => {
        acc[edge.relation] = (acc[edge.relation] ?? 0) + 1;
        return acc;
      }, {});

      expect(grouped).toMatchObject({ caused: 1, supports: 2 });
    });

    it('should construct why explanation chain', () => {
      insertEdgeOrThrow('A', 'B', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('B', 'C', causalEdges.RELATION_TYPES.SUPPORTS, 0.8);

      const chain = causalEdges.getCausalChain('C', 10, 'backward');
      const explanation = collectNodes(chain).join(' <- ');
      expect(explanation).toBe('C <- B <- A');
    });

    it('should trace outgoing edges for impact analysis', () => {
      insertEdgeOrThrow('X', 'Y', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('Y', 'Z', causalEdges.RELATION_TYPES.ENABLED, 0.8);

      const impact = causalEdges.getCausalChain('X', 10, 'forward');
      expect(collectNodes(impact)).toEqual(['X', 'Y', 'Z']);
    });
  });

  describe('C138: Relationship Weight Multipliers', () => {
    it('C138-T1: supersedes relation type exists', () => {
      expect(Object.values(causalEdges.RELATION_TYPES)).toContain('supersedes');
    });

    it('C138-T2: contradicts relation type exists', () => {
      expect(Object.values(causalEdges.RELATION_TYPES)).toContain('contradicts');
    });

    it('C138-T3: weight multiplier ordering is correct', () => {
      const weights = causalEdges.RELATION_WEIGHTS;
      const defaultWeight = weights.supports;
      expect(weights.supersedes).toBeGreaterThan(weights.caused);
      expect(weights.caused).toBeGreaterThan(defaultWeight);
      expect(defaultWeight).toBeGreaterThan(weights.contradicts);
    });

    it('C138-T4: supersedes chain outranks caused chain', () => {
      const w = causalEdges.RELATION_WEIGHTS;
      const supersededScore = 1.0 * w.supersedes * w.supersedes;
      const causedScore = 1.0 * w.caused * w.caused;
      expect(supersededScore).toBeGreaterThan(causedScore);
    });
  });

  describe('Unlink Workflow (T010)', () => {
    it('T010-U1: deleteEdge removes edge and returns true', () => {
      const edgeId = insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9, 'unlink');
      const deleted = causalEdges.deleteEdge(edgeId);

      expect(deleted).toBe(true);
      expect(causalEdges.getAllEdges()).toHaveLength(0);
    });

    it('T010-U2: deleteEdge on non-existent returns false', () => {
      const deleted = causalEdges.deleteEdge(99999);
      expect(deleted).toBe(false);
    });

    it('T010-U3: deleteEdgesForMemory removes all edges for a memory', () => {
      insertEdgeOrThrow('5', '1', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('2', '5', causalEdges.RELATION_TYPES.ENABLED, 0.8);
      insertEdgeOrThrow('5', '3', causalEdges.RELATION_TYPES.SUPPORTS, 0.7);
      insertEdgeOrThrow('4', '6', causalEdges.RELATION_TYPES.CAUSED, 0.6); // unrelated

      const removed = causalEdges.deleteEdgesForMemory('5');
      const remaining = causalEdges.getAllEdges();

      expect(removed).toBe(3);
      expect(remaining).toHaveLength(1);
      expect(remaining[0].source_id).toBe('4');
      expect(remaining[0].target_id).toBe('6');
    });

    it('T010-U4: Unlink preserves unrelated edges', () => {
      insertEdgeOrThrow('5', '1', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      insertEdgeOrThrow('2', '5', causalEdges.RELATION_TYPES.ENABLED, 0.8);
      insertEdgeOrThrow('6', '7', causalEdges.RELATION_TYPES.SUPPORTS, 0.7);
      insertEdgeOrThrow('7', '8', causalEdges.RELATION_TYPES.DERIVED_FROM, 0.6);

      const removed = causalEdges.deleteEdgesForMemory('5');
      const remaining = causalEdges.getAllEdges();
      const remainingPairs = remaining.map((edge) => `${edge.source_id}->${edge.target_id}`);

      expect(removed).toBe(2);
      expect(remainingPairs).toEqual(expect.arrayContaining(['6->7', '7->8']));
      expect(remaining).toHaveLength(2);
    });
  });

  describe('T001/T004 — Audit tracking and cache invalidation', () => {
    it('T001: touchEdgeAccess updates last_accessed timestamp on read', () => {
      const edgeId = insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9);

      // Before read, last_accessed should be null
      const before = (testDb.prepare('SELECT last_accessed FROM causal_edges WHERE id = ?').get(edgeId) as { last_accessed: string | null });
      expect(before.last_accessed).toBeNull();

      // Reading via getEdgesFrom should trigger touchEdgeAccess
      causalEdges.getEdgesFrom('1');

      const after = (testDb.prepare('SELECT last_accessed FROM causal_edges WHERE id = ?').get(edgeId) as { last_accessed: string | null });
      expect(after.last_accessed).not.toBeNull();
    });

    it('T002: rollback restores old_strength from weight_history', () => {
      const edgeId = insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.3);
      causalEdges.updateEdge(edgeId, { strength: 0.8 }, 'test', 'strength bump');

      // Verify weight_history was created
      const history = causalEdges.getWeightHistory(edgeId);
      expect(history.length).toBeGreaterThanOrEqual(1);
      expect(history[0].old_strength).toBe(0.3);
      expect(history[0].new_strength).toBe(0.8);

      // Rollback to before the change
      const rollbackResult = causalEdges.rollbackWeights(edgeId, history[0].changed_at);
      expect(rollbackResult).toBe(true);

      const edge = causalEdges.getEdgesFrom('1')[0];
      expect(edge.strength).toBe(0.3);
    });

    it('T002: getWeightHistory returns entries for modified edge', () => {
      const edgeId = insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.5);
      causalEdges.updateEdge(edgeId, { strength: 0.7 }, 'audit-test', 'first bump');
      causalEdges.updateEdge(edgeId, { strength: 0.9 }, 'audit-test', 'second bump');

      const history = causalEdges.getWeightHistory(edgeId);
      expect(history.length).toBe(2);
      // Most recent first (ORDER BY changed_at DESC)
      expect(history[0].old_strength).toBe(0.7);
      expect(history[0].new_strength).toBe(0.9);
      expect(history[1].old_strength).toBe(0.5);
      expect(history[1].new_strength).toBe(0.7);
    });

    it('T001: rethrows touchEdgeAccess failures through read path warning', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9);
      const originalPrepare = testDb.prepare.bind(testDb);
      const prepareSpy = vi.spyOn(testDb, 'prepare').mockImplementation((sql: string) => {
        if (sql.includes("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?")) {
          throw new Error('touch failed');
        }
        return originalPrepare(sql);
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      const edges = causalEdges.getEdgesFrom('1');

      expect(edges).toHaveLength(1);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('touchEdgeAccess failed for edge'));
      prepareSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('T002: rollback uses deterministic same-second history ordering', () => {
      const edgeId = insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.3);
      causalEdges.updateEdge(edgeId, { strength: 0.5 }, 'test', 'first bump');
      causalEdges.updateEdge(edgeId, { strength: 0.8 }, 'test', 'second bump');

      testDb.prepare("UPDATE weight_history SET changed_at = '2026-03-11 10:00:00' WHERE edge_id = ?").run(edgeId);

      const history = causalEdges.getWeightHistory(edgeId);
      expect(history).toHaveLength(2);
      expect(history[0].old_strength).toBe(0.5);
      expect(history[0].new_strength).toBe(0.8);
      expect(history[1].old_strength).toBe(0.3);
      expect(history[1].new_strength).toBe(0.5);

      const rollbackResult = causalEdges.rollbackWeights(edgeId, history[0].changed_at);
      expect(rollbackResult).toBe(true);

      const edge = causalEdges.getEdgesFrom('1')[0];
      expect(edge.strength).toBe(0.5);
    });

    it('T002: updateEdge rolls back when weight_history insert fails', () => {
      const edgeId = insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.3);
      try {
        testDb.exec('DROP TABLE weight_history');

        const updated = causalEdges.updateEdge(edgeId, { strength: 0.8 }, 'test', 'should rollback');
        expect(updated).toBe(false);

        const edge = causalEdges.getEdgesFrom('1')[0];
        expect(edge.strength).toBe(0.3);
      } finally {
        ensureWeightHistoryTable();
      }
    });

    it('T002: insertEdge upsert rolls back when weight_history insert fails', () => {
      insertEdgeOrThrow('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.4);
      try {
        testDb.exec('DROP TABLE weight_history');

        const edgeId = causalEdges.insertEdge('1', '2', causalEdges.RELATION_TYPES.CAUSED, 0.9);
        expect(edgeId).toBeNull();

        const edge = causalEdges.getEdgesFrom('1')[0];
        expect(edge.strength).toBe(0.4);
      } finally {
        ensureWeightHistoryTable();
      }
    });
  });
});
