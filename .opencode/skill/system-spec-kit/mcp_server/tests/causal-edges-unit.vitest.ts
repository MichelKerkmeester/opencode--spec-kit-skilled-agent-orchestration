// TEST: CAUSAL EDGES UNIT
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import * as causalEdges from '../lib/storage/causal-edges';
import { flattenCausalTree } from '../handlers/causal-graph';
import type { FlattenedChain } from '../handlers/causal-graph';
import { clearDegreeCache, computeDegreeScores } from '../lib/search/graph-search-fn';

type SqliteDatabase = InstanceType<typeof Database>;
type CausalChainNode = ReturnType<typeof causalEdges.getCausalChain>;
type OrphanedEdge = ReturnType<typeof causalEdges.findOrphanedEdges>[number];

// TEST: CAUSAL EDGES UNIT (Vitest)
// Comprehensive unit tests for lib/storage/causal-edges.ts
// Covers: constants, insertEdge, insertEdgesBatch, getEdgesFrom,
// GetEdgesTo, getAllEdges, getCausalChain, updateEdge,
// DeleteEdge, deleteEdgesForMemory, getGraphStats,
// FindOrphanedEdges
/** DFS helper: collect all node IDs from a causal chain tree */
function collectNodes(node: CausalChainNode): string[] {
  const nodes: string[] = [node.id];
  for (const child of node.children) {
    nodes.push(...collectNodes(child));
  }
  return nodes;
}

describe('Causal Edges Unit Tests', () => {
  let testDb: SqliteDatabase;

  function resetEdges() {
    testDb.exec('DELETE FROM causal_edges');
  }

  beforeAll(() => {
    testDb = new Database(':memory:');

    // Create causal_edges table matching production schema (+created_by, +last_accessed)
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

    // T001d: weight_history for audit tracking
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

    // Create memory_index table (needed for findOrphanedEdges)
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

    // Seed some memories for orphan detection tests
    const stmt = testDb.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(1, 'test-spec', '/mem/1.md', 'Memory 1');
    stmt.run(2, 'test-spec', '/mem/2.md', 'Memory 2');
    stmt.run(3, 'test-spec', '/mem/3.md', 'Memory 3');
    stmt.run(10, 'test-spec', '/mem/10.md', 'Memory 10');
    stmt.run(20, 'test-spec', '/mem/20.md', 'Memory 20');

    // Initialize module with test DB
    causalEdges.init(testDb);
  });

  afterAll(() => {
    if (testDb) {
      try { testDb.close(); } catch {}
    }
  });

  /* ─────────────────────────────────────────────────────────────
     Constants
  ──────────────────────────────────────────────────────────────── */

  describe('Constants', () => {
    it('C1: RELATION_TYPES is exported', () => {
      const rt = causalEdges.RELATION_TYPES;
      expect(rt).toBeDefined();
      expect(typeof rt).toBe('object');
    });

    it('C2: RELATION_TYPES has all 6 types', () => {
      const rt = causalEdges.RELATION_TYPES;
      const expected = ['CAUSED', 'ENABLED', 'SUPERSEDES', 'CONTRADICTS', 'DERIVED_FROM', 'SUPPORTS'];
      for (const k of expected) {
        expect(rt).toHaveProperty(k);
      }
      expect(Object.keys(rt)).toHaveLength(6);
    });

    it('C3: RELATION_TYPES values are correct strings', () => {
      const rt = causalEdges.RELATION_TYPES;
      const expectedValues = ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'];
      const values = Object.values(rt) as string[];
      for (const v of expectedValues) {
        expect(values).toContain(v);
      }
    });

    it('C4: RELATION_TYPES is frozen', () => {
      const rt = causalEdges.RELATION_TYPES;
      expect(Object.isFrozen(rt)).toBe(true);
    });

    it('C5: DEFAULT_MAX_DEPTH is 3', () => {
      expect(causalEdges.DEFAULT_MAX_DEPTH).toBe(3);
    });

    it('C6: MAX_EDGES_LIMIT is 100', () => {
      expect(causalEdges.MAX_EDGES_LIMIT).toBe(100);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     insertEdge
  ──────────────────────────────────────────────────────────────── */

  describe('insertEdge', () => {
    beforeEach(() => {
      resetEdges();
    });

    it('IE1: Insert valid edge returns numeric id', () => {
      const id = causalEdges.insertEdge('1', '2', 'caused', 0.9, 'test evidence');
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);
    });

    it('IE2: Inserted edge is retrievable', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.9, 'test evidence');
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(edges[0].source_id).toBe('1');
      expect(edges[0].target_id).toBe('2');
    });

    it('IE3: Default strength=1.0 and null evidence', () => {
      causalEdges.insertEdge('3', '4', 'enabled');
      const edges = causalEdges.getEdgesFrom('3');
      expect(edges).toHaveLength(1);
      expect(edges[0].strength).toBe(1.0);
      expect(edges[0].evidence).toBeNull();
    });

    it('IE4: Strength clamped from 2.5 to 1.0', () => {
      causalEdges.insertEdge('5', '6', 'supports', 2.5);
      const edges = causalEdges.getEdgesFrom('5');
      expect(edges).toHaveLength(1);
      expect(edges[0].strength).toBe(1.0);
    });

    it('IE5: Strength clamped from -0.5 to 0.0', () => {
      causalEdges.insertEdge('7', '8', 'contradicts', -0.5);
      const edges = causalEdges.getEdgesFrom('7');
      expect(edges).toHaveLength(1);
      expect(edges[0].strength).toBe(0.0);
    });

    it('IE6: Duplicate replaces existing edge', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.5, 'first');
      causalEdges.insertEdge('1', '2', 'caused', 0.8, 'second');
      const edges = causalEdges.getAllEdges();
      expect(edges).toHaveLength(1);
      expect(edges[0].strength).toBe(0.8);
      expect(edges[0].evidence).toBe('second');
    });

    it('IE7: Different relations create separate edges', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('1', '2', 'enabled', 0.7);
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(2);
    });

    it('IE8: Edge has extracted_at timestamp', () => {
      causalEdges.insertEdge('1', '2', 'caused');
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(1);
      expect(typeof edges[0].extracted_at).toBe('string');
      expect(edges[0].extracted_at.length).toBeGreaterThan(0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     insertEdgesBatch
  ──────────────────────────────────────────────────────────────── */

  describe('insertEdgesBatch', () => {
    beforeEach(() => {
      resetEdges();
    });

    it('IB1: Batch inserts 3 edges', () => {
      const result = causalEdges.insertEdgesBatch([
        { sourceId: '1', targetId: '2', relation: 'caused', strength: 0.9 },
        { sourceId: '2', targetId: '3', relation: 'enabled', strength: 0.7 },
        { sourceId: '3', targetId: '4', relation: 'supports', evidence: 'batch test' },
      ]);
      expect(result.inserted).toBe(3);
      expect(result.failed).toBe(0);
    });

    it('IB2: All 3 batch edges retrievable', () => {
      causalEdges.insertEdgesBatch([
        { sourceId: '1', targetId: '2', relation: 'caused', strength: 0.9 },
        { sourceId: '2', targetId: '3', relation: 'enabled', strength: 0.7 },
        { sourceId: '3', targetId: '4', relation: 'supports', evidence: 'batch test' },
      ]);
      const allEdges = causalEdges.getAllEdges();
      expect(allEdges).toHaveLength(3);
    });

    it('IB3: Empty batch returns zeros', () => {
      const result = causalEdges.insertEdgesBatch([]);
      expect(result.inserted).toBe(0);
      expect(result.failed).toBe(0);
    });

    it('IB4: Batch applies defaults', () => {
      const result = causalEdges.insertEdgesBatch([
        { sourceId: '10', targetId: '20', relation: 'derived_from' },
      ]);
      expect(result.inserted).toBe(1);
      const edges = causalEdges.getEdgesFrom('10');
      expect(edges).toHaveLength(1);
      expect(edges[0].strength).toBe(1.0);
      expect(edges[0].evidence).toBeNull();
    });
  });

  /* ─────────────────────────────────────────────────────────────
     getEdgesFrom / getEdgesTo
  ──────────────────────────────────────────────────────────────── */

  describe('getEdgesFrom / getEdgesTo', () => {
    beforeAll(() => {
      resetEdges();
      // Seed: 1->2, 1->3, 4->2
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('1', '3', 'enabled', 0.5);
      causalEdges.insertEdge('4', '2', 'supports', 0.7);
    });

    it('GF1: getEdgesFrom returns outgoing edges', () => {
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(2);
    });

    it('GF2: getEdgesFrom ordered by strength DESC', () => {
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges).toHaveLength(2);
      expect(edges[0].strength).toBeGreaterThanOrEqual(edges[1].strength);
    });

    it('GF3: getEdgesFrom respects limit=1', () => {
      const edges = causalEdges.getEdgesFrom('1', 1);
      expect(edges).toHaveLength(1);
    });

    it('GF4: getEdgesFrom non-existent returns empty', () => {
      const edges = causalEdges.getEdgesFrom('999');
      expect(edges).toHaveLength(0);
    });

    it('GT1: getEdgesTo returns incoming edges', () => {
      const edges = causalEdges.getEdgesTo('2');
      expect(edges).toHaveLength(2);
    });

    it('GT2: getEdgesTo ordered by strength DESC', () => {
      const edges = causalEdges.getEdgesTo('2');
      expect(edges).toHaveLength(2);
      expect(edges[0].strength).toBeGreaterThanOrEqual(edges[1].strength);
    });

    it('GT3: getEdgesTo respects limit=1', () => {
      const edges = causalEdges.getEdgesTo('2', 1);
      expect(edges).toHaveLength(1);
    });

    it('GT4: getEdgesTo no incoming returns empty', () => {
      const edges = causalEdges.getEdgesTo('1');
      expect(edges).toHaveLength(0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     getAllEdges
  ──────────────────────────────────────────────────────────────── */

  describe('getAllEdges', () => {
    it('GA1: Empty graph returns []', () => {
      resetEdges();
      const edges = causalEdges.getAllEdges();
      expect(Array.isArray(edges)).toBe(true);
      expect(edges).toHaveLength(0);
    });

    it('GA2: getAllEdges returns all 3 edges', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.7);
      causalEdges.insertEdge('3', '4', 'supports', 0.5);
      const edges = causalEdges.getAllEdges();
      expect(edges).toHaveLength(3);
    });

    it('GA3: getAllEdges respects limit=2', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.7);
      causalEdges.insertEdge('3', '4', 'supports', 0.5);
      const edges = causalEdges.getAllEdges(2);
      expect(edges).toHaveLength(2);
    });

    it('GA4: Edge has all expected fields', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      const edges = causalEdges.getAllEdges(1);
      const edge = edges[0];
      expect(edge).toBeDefined();
      expect(typeof edge.id).toBe('number');
      expect(typeof edge.source_id).toBe('string');
      expect(typeof edge.target_id).toBe('string');
      expect(typeof edge.relation).toBe('string');
      expect(typeof edge.strength).toBe('number');
      expect(typeof edge.extracted_at).toBe('string');
    });
  });

  /* ─────────────────────────────────────────────────────────────
     getCausalChain
  ──────────────────────────────────────────────────────────────── */

  describe('getCausalChain', () => {
    it('CC1: Chain root has id and depth=0', () => {
      resetEdges();
      // Build chain: 1->2->3->4->5
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8);
      causalEdges.insertEdge('3', '4', 'supports', 0.7);
      causalEdges.insertEdge('4', '5', 'derived_from', 0.6);

      const chain = causalEdges.getCausalChain('1', 10, 'forward');
      expect(chain).toBeDefined();
      expect(chain.id).toBe('1');
      expect(chain.depth).toBe(0);
    });

    it('CC2: Forward traverses to child', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8);
      causalEdges.insertEdge('3', '4', 'supports', 0.7);
      causalEdges.insertEdge('4', '5', 'derived_from', 0.6);

      const chain = causalEdges.getCausalChain('1', 10, 'forward');
      expect(chain.children).toHaveLength(1);
      expect(chain.children[0].id).toBe('2');
    });

    it('CC3: Full depth traversal finds all 5 nodes', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8);
      causalEdges.insertEdge('3', '4', 'supports', 0.7);
      causalEdges.insertEdge('4', '5', 'derived_from', 0.6);

      const chain = causalEdges.getCausalChain('1', 10, 'forward');
      const nodes = collectNodes(chain);
      expect(nodes).toHaveLength(5);
      expect(nodes.join(',')).toBe('1,2,3,4,5');
    });

    it('CC4: Depth limit=2 returns 3 nodes', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8);
      causalEdges.insertEdge('3', '4', 'supports', 0.7);
      causalEdges.insertEdge('4', '5', 'derived_from', 0.6);

      const chain = causalEdges.getCausalChain('1', 2, 'forward');
      const nodes = collectNodes(chain);
      // MaxDepth=2: root(0), child(1) -> at depth=2, traverse returns, so we get 1,2,3
      expect(nodes).toHaveLength(3);
      expect(nodes.join(',')).toBe('1,2,3');
    });

    it('CC5: Backward traversal from leaf', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8);
      causalEdges.insertEdge('3', '4', 'supports', 0.7);
      causalEdges.insertEdge('4', '5', 'derived_from', 0.6);

      const chain = causalEdges.getCausalChain('5', 10, 'backward');
      expect(chain).toBeDefined();
      expect(chain.id).toBe('5');
      const nodes = collectNodes(chain);
      expect(nodes).toHaveLength(5);
      expect(nodes.join(',')).toBe('5,4,3,2,1');
    });

    it('CC6: Cycle prevention works', () => {
      resetEdges();
      causalEdges.insertEdge('A', 'B', 'caused', 1.0);
      causalEdges.insertEdge('B', 'C', 'caused', 1.0);
      causalEdges.insertEdge('C', 'A', 'caused', 1.0); // cycle back to A

      const chain = causalEdges.getCausalChain('A', 10, 'forward');
      const nodes = collectNodes(chain);
      // Should NOT loop: A->B->C and then C->A is skipped (visited)
      expect(nodes).toHaveLength(3);
      expect(nodes.join(',')).toBe('A,B,C');
    });

    it('CC7: Non-existent root returns root-only node', () => {
      const chain = causalEdges.getCausalChain('non-existent', 5, 'forward');
      expect(chain).toBeDefined();
      expect(chain.id).toBe('non-existent');
      expect(chain.children).toHaveLength(0);
    });

    it('CC8: Default direction is forward', () => {
      resetEdges();
      causalEdges.insertEdge('X', 'Y', 'caused', 1.0);

      const chain = causalEdges.getCausalChain('X');
      expect(chain.children).toHaveLength(1);
      expect(chain.children[0].id).toBe('Y');
    });

    describe('T007: Natural leaf vs truncated chain', () => {
      it('T007-NL1: Natural leaf at maxDepth-1 has no children', () => {
        resetEdges();
        // Chain: A -> B (B is a natural leaf at depth 1)
        causalEdges.insertEdge('A', 'B', 'caused', 1.0);

        const chain = causalEdges.getCausalChain('A', 3, 'forward');
        expect(chain.children).toHaveLength(1);
        expect(chain.children[0].id).toBe('B');
        expect(chain.children[0].children).toHaveLength(0);
        expect(chain.children[0].depth).toBe(1);
      });

      it('T007-NL2: Truncated chain has node at maxDepth', () => {
        resetEdges();
        // Chain: A -> B -> C -> D, maxDepth=2 should include A, B, C only.
        causalEdges.insertEdge('A', 'B', 'caused', 1.0);
        causalEdges.insertEdge('B', 'C', 'caused', 1.0);
        causalEdges.insertEdge('C', 'D', 'caused', 1.0);

        const chain = causalEdges.getCausalChain('A', 2, 'forward');
        const nodes = collectNodes(chain);

        expect(nodes).toHaveLength(3);
        expect(nodes).toContain('A');
        expect(nodes).toContain('B');
        expect(nodes).toContain('C');
        expect(nodes).not.toContain('D');
      });
    });

    describe('T007-FT: flattenCausalTree max_depth_reached handler behavior', () => {
      it('T007-FT1: Natural leaf at maxDepth-1 does NOT trigger max_depth_reached', () => {
        resetEdges();
        // Chain: A -> B (B is natural leaf at depth 1, maxDepth=3)
        causalEdges.insertEdge('A', 'B', 'caused', 1.0);
        const chain = causalEdges.getCausalChain('A', 3, 'forward');
        const flat: FlattenedChain = flattenCausalTree(chain, 3, 'forward');
        expect(flat.max_depth_reached).toBe(false);
        expect(flat.total_edges).toBe(1);
      });

      it('T007-FT2: Node at maxDepth DOES trigger max_depth_reached', () => {
        resetEdges();
        // Chain: A -> B -> C -> D, maxDepth=2
        // GetCausalChain adds C at depth 2 (=maxDepth) but never explores C's edges
        causalEdges.insertEdge('A', 'B', 'caused', 1.0);
        causalEdges.insertEdge('B', 'C', 'caused', 1.0);
        causalEdges.insertEdge('C', 'D', 'caused', 1.0);
        const chain = causalEdges.getCausalChain('A', 2, 'forward');
        const flat: FlattenedChain = flattenCausalTree(chain, 2, 'forward');
        expect(flat.max_depth_reached).toBe(true);
      });

      it('T007-FT3: Exact maxDepth boundary — node at maxDepth-1 with children at maxDepth', () => {
        resetEdges();
        // Chain: A -> B -> C, maxDepth=2
        // B is at depth 1 (explored), C is at depth 2 (=maxDepth, added but not explored)
        causalEdges.insertEdge('A', 'B', 'caused', 1.0);
        causalEdges.insertEdge('B', 'C', 'caused', 1.0);
        const chain = causalEdges.getCausalChain('A', 2, 'forward');
        const flat: FlattenedChain = flattenCausalTree(chain, 2, 'forward');
        expect(flat.max_depth_reached).toBe(true);
        expect(flat.all.some(e => e.depth === 2)).toBe(true);
      });

      it('T007-FT4: backward direction max_depth_reached', () => {
        resetEdges();
        // Chain: D -> C -> B -> A, query backward from A maxDepth=1
        causalEdges.insertEdge('D', 'C', 'caused', 1.0);
        causalEdges.insertEdge('C', 'B', 'caused', 1.0);
        causalEdges.insertEdge('B', 'A', 'caused', 1.0);
        const chain = causalEdges.getCausalChain('A', 1, 'backward');
        const flat: FlattenedChain = flattenCausalTree(chain, 1, 'backward');
        expect(flat.max_depth_reached).toBe(true);
      });
    });
  });

  /* ─────────────────────────────────────────────────────────────
     updateEdge
  ──────────────────────────────────────────────────────────────── */

  describe('updateEdge', () => {
    let edgeId: number;

    beforeAll(() => {
      resetEdges();
      edgeId = causalEdges.insertEdge('1', '2', 'caused', 0.5, 'original')!;
    });

    it('UE1: Update strength succeeds', () => {
      const ok = causalEdges.updateEdge(edgeId, { strength: 0.9 });
      const edges = causalEdges.getEdgesFrom('1');
      expect(ok).toBeTruthy();
      expect(edges[0].strength).toBe(0.9);
    });

    it('UE2: Update evidence succeeds', () => {
      const ok = causalEdges.updateEdge(edgeId, { evidence: 'updated evidence' });
      const edges = causalEdges.getEdgesFrom('1');
      expect(ok).toBeTruthy();
      expect(edges[0].evidence).toBe('updated evidence');
    });

    it('UE3: Update both fields', () => {
      const ok = causalEdges.updateEdge(edgeId, { strength: 0.3, evidence: 'both updated' });
      const edges = causalEdges.getEdgesFrom('1');
      expect(ok).toBeTruthy();
      expect(edges[0].strength).toBe(0.3);
      expect(edges[0].evidence).toBe('both updated');
    });

    it('UE4: Update clamps strength above 1', () => {
      causalEdges.updateEdge(edgeId, { strength: 5.0 });
      const edges = causalEdges.getEdgesFrom('1');
      expect(edges[0].strength).toBe(1.0);
    });

    it('UE5: Empty updates returns false', () => {
      const ok = causalEdges.updateEdge(edgeId, {});
      expect(ok).toBe(false);
    });

    it('UE6: Update non-existent returns false', () => {
      const ok = causalEdges.updateEdge(99999, { strength: 0.5 });
      expect(ok).toBe(false);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     deleteEdge
  ──────────────────────────────────────────────────────────────── */

  describe('deleteEdge', () => {
    beforeEach(() => {
      resetEdges();
    });

    it('DE1: Delete existing edge returns true', () => {
      const edgeId = causalEdges.insertEdge('1', '2', 'caused', 0.9)!;
      const ok = causalEdges.deleteEdge(edgeId);
      expect(ok).toBe(true);
    });

    it('DE2: Deleted edge no longer in DB', () => {
      const edgeId = causalEdges.insertEdge('1', '2', 'caused', 0.9)!;
      causalEdges.deleteEdge(edgeId);
      const edges = causalEdges.getAllEdges();
      expect(edges).toHaveLength(0);
    });

    it('DE3: Delete non-existent returns false', () => {
      const ok = causalEdges.deleteEdge(99999);
      expect(ok).toBe(false);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     deleteEdgesForMemory
  ──────────────────────────────────────────────────────────────── */

  describe('deleteEdgesForMemory', () => {
    it('DM1: deleteEdgesForMemory removes 3 edges', () => {
      resetEdges();
      // Seed: edges involving memory '2' as both source and target
      causalEdges.insertEdge('2', '3', 'caused', 0.9);
      causalEdges.insertEdge('1', '2', 'enabled', 0.8);
      causalEdges.insertEdge('2', '4', 'supports', 0.7);
      causalEdges.insertEdge('5', '6', 'contradicts', 0.5); // unrelated

      const count = causalEdges.deleteEdgesForMemory('2');
      expect(count).toBe(3);
    });

    it('DM2: Unrelated edge preserved', () => {
      resetEdges();
      causalEdges.insertEdge('2', '3', 'caused', 0.9);
      causalEdges.insertEdge('1', '2', 'enabled', 0.8);
      causalEdges.insertEdge('2', '4', 'supports', 0.7);
      causalEdges.insertEdge('5', '6', 'contradicts', 0.5);

      causalEdges.deleteEdgesForMemory('2');
      const edges = causalEdges.getAllEdges();
      expect(edges).toHaveLength(1);
      expect(edges[0].source_id).toBe('5');
    });

    it('DM3: No-op delete returns 0', () => {
      resetEdges();
      const count = causalEdges.deleteEdgesForMemory('999');
      expect(count).toBe(0);
    });
  });

  describe('degree cache invalidation on edge mutations', () => {
    beforeEach(() => {
      resetEdges();
      clearDegreeCache();
    });

    it('DC1: updateEdge invalidates cached degree scores', () => {
      const edgeId = causalEdges.insertEdge('1', '2', 'caused', 0.2)!;
      causalEdges.insertEdge('3', '4', 'caused', 1.0);
      const before = computeDegreeScores(testDb, [1]).get('1') ?? 0;

      const ok = causalEdges.updateEdge(edgeId, { strength: 1.0 });
      const after = computeDegreeScores(testDb, [1]).get('1') ?? 0;

      expect(ok).toBe(true);
      expect(after).toBeGreaterThan(before);
    });

    it('DC2: deleteEdgesForMemory invalidates cached degree scores', () => {
      causalEdges.insertEdge('1', '2', 'caused', 1.0);
      const before = computeDegreeScores(testDb, [1]).get('1') ?? 0;

      const deleted = causalEdges.deleteEdgesForMemory('1');
      const after = computeDegreeScores(testDb, [1]).get('1') ?? 0;

      expect(before).toBeGreaterThan(0);
      expect(deleted).toBeGreaterThan(0);
      expect(after).toBe(0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     getGraphStats
  ──────────────────────────────────────────────────────────────── */

  describe('getGraphStats', () => {
    it('GS1: Empty graph stats all zeros', () => {
      resetEdges();
      const stats = causalEdges.getGraphStats();
      expect(stats.totalEdges).toBe(0);
      expect(stats.avgStrength).toBe(0);
      expect(stats.uniqueSources).toBe(0);
      expect(stats.uniqueTargets).toBe(0);
    });

    it('GS2: totalEdges=4', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.8);
      causalEdges.insertEdge('1', '3', 'enabled', 0.6);
      causalEdges.insertEdge('2', '4', 'supports', 1.0);
      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);

      const stats = causalEdges.getGraphStats();
      expect(stats.totalEdges).toBe(4);
    });

    it('GS3: byRelation counts correct', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.8);
      causalEdges.insertEdge('1', '3', 'enabled', 0.6);
      causalEdges.insertEdge('2', '4', 'supports', 1.0);
      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);

      const stats = causalEdges.getGraphStats();
      const br = stats.byRelation;
      expect(br.caused).toBe(1);
      expect(br.enabled).toBe(1);
      expect(br.supports).toBe(1);
      expect(br.contradicts).toBe(1);
    });

    it('GS4: avgStrength=0.7', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.8);
      causalEdges.insertEdge('1', '3', 'enabled', 0.6);
      causalEdges.insertEdge('2', '4', 'supports', 1.0);
      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);

      const stats = causalEdges.getGraphStats();
      // (0.8 + 0.6 + 1.0 + 0.4) / 4 = 0.7
      expect(stats.avgStrength).toBe(0.7);
    });

    it('GS5: uniqueSources=3', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.8);
      causalEdges.insertEdge('1', '3', 'enabled', 0.6);
      causalEdges.insertEdge('2', '4', 'supports', 1.0);
      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);

      const stats = causalEdges.getGraphStats();
      // Sources: 1, 2, 5 = 3
      expect(stats.uniqueSources).toBe(3);
    });

    it('GS6: uniqueTargets=3', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.8);
      causalEdges.insertEdge('1', '3', 'enabled', 0.6);
      causalEdges.insertEdge('2', '4', 'supports', 1.0);
      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);

      const stats = causalEdges.getGraphStats();
      // Targets: 2, 3, 4 = 3
      expect(stats.uniqueTargets).toBe(3);
    });

    it('GS7: byRelation omits absent types', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.8);
      causalEdges.insertEdge('1', '3', 'enabled', 0.6);
      causalEdges.insertEdge('2', '4', 'supports', 1.0);
      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);

      const stats = causalEdges.getGraphStats();
      const keys = Object.keys(stats.byRelation);
      expect(keys).not.toContain('derived_from');
      expect(keys).not.toContain('supersedes');
    });
  });

  /* ─────────────────────────────────────────────────────────────
     findOrphanedEdges
  ──────────────────────────────────────────────────────────────── */

  describe('findOrphanedEdges', () => {
    // Memories in DB: 1, 2, 3, 10, 20

    it('FO1: No orphans when all memories exist', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8);
      const orphans = causalEdges.findOrphanedEdges();
      expect(orphans).toHaveLength(0);
    });

    it('FO2: Edge with missing source detected', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('999', '1', 'supports', 0.5);
      const orphans = causalEdges.findOrphanedEdges();
      const hasOrphan = orphans.some((e: OrphanedEdge) => e.source_id === '999');
      expect(hasOrphan).toBe(true);
    });

    it('FO3: Edge with missing target detected', () => {
      resetEdges();
      causalEdges.insertEdge('1', '888', 'contradicts', 0.5);
      const orphans = causalEdges.findOrphanedEdges();
      const hasOrphan = orphans.some((e: OrphanedEdge) => e.target_id === '888');
      expect(hasOrphan).toBe(true);
    });

    it('FO4: Both missing = orphan', () => {
      resetEdges();
      causalEdges.insertEdge('777', '888', 'supersedes', 0.5);
      const orphans = causalEdges.findOrphanedEdges();
      expect(orphans).toHaveLength(1);
    });

    it('FO5: Empty graph = no orphans', () => {
      resetEdges();
      const orphans = causalEdges.findOrphanedEdges();
      expect(orphans).toHaveLength(0);
    });
  });

  describe('T005: Orphan-edge coverage regression', () => {
    it('T005-R1: Orphaned edges should be detected when source memory is missing', () => {
      resetEdges();
      // Memory IDs 1, 2, 3 exist in memory_index; 999 does not.
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('999', '3', 'enabled', 0.5);

      const orphans = causalEdges.findOrphanedEdges();
      expect(orphans.length).toBeGreaterThan(0);
      expect(orphans.some((e) => e.source_id === '999')).toBe(true);

      const stats = causalEdges.getGraphStats();
      expect(stats.totalEdges).toBe(2);
      // Handler-level coverage should exclude orphaned IDs (T004 fix).
    });

    it('T005-R2: Non-orphaned edges should not be flagged', () => {
      resetEdges();
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8);

      const orphans = causalEdges.findOrphanedEdges();
      expect(orphans).toHaveLength(0);
    });
  });

  describe('T005-HL: Handler-level orphan coverage exclusion', () => {
    const coverageSql = `
      SELECT DISTINCT source_id
      FROM causal_edges
      WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = source_id)
      UNION
      SELECT DISTINCT target_id
      FROM causal_edges
      WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = target_id)
    `;

    const seedMemories = (ids: number[]) => {
      testDb.exec('DELETE FROM memory_index');
      const stmt = testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `);
      for (const id of ids) {
        stmt.run(id, 'test-spec', `/mem/${id}.md`, `Memory ${id}`);
      }
    };

    it('T005-HL1: Orphaned IDs excluded from coverage computation', () => {
      resetEdges();
      seedMemories([1, 2, 3]);
      causalEdges.insertEdge('1', '2', 'caused', 0.9);
      causalEdges.insertEdge('999', '3', 'enabled', 0.5);

      const coveredIds = testDb.prepare(coverageSql).pluck().all() as string[];
      const totalMemories = testDb.prepare('SELECT COUNT(*) FROM memory_index').pluck().get() as number;
      const coveragePercent = (coveredIds.length / totalMemories) * 100;

      expect(coveredIds.sort()).toEqual(['1', '2', '3']);
      expect(coveredIds).not.toContain('999');
      expect(coveragePercent).toBe(100);
    });

    it('T005-HL2: All orphaned edges -> coverage = 0%', () => {
      resetEdges();
      seedMemories([1, 2]);
      causalEdges.insertEdge('999', '888', 'supports', 0.4);

      const coveredIds = testDb.prepare(coverageSql).pluck().all() as string[];
      const totalMemories = testDb.prepare('SELECT COUNT(*) FROM memory_index').pluck().get() as number;
      const coveragePercent = totalMemories === 0 ? 0 : (coveredIds.length / totalMemories) * 100;

      expect(coveredIds).toHaveLength(0);
      expect(coveragePercent).toBe(0);
    });
  });

  describe('cleanupOrphanedEdges', () => {
    it('CO1: Runs inside an outer transaction without reopening one', () => {
      resetEdges();
      causalEdges.insertEdge('999', '1', 'supports', 0.5);

      const result = testDb.transaction(() => causalEdges.cleanupOrphanedEdges())();

      expect(result.deleted).toBe(1);
      expect(causalEdges.findOrphanedEdges()).toHaveLength(0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Uninitialised DB Guards
  ──────────────────────────────────────────────────────────────── */

  describe('Uninitialised DB Guards', () => {
    beforeAll(() => {
      // Simulate uninitialised state
      // @ts-expect-error intentionally verifying uninitialised DB guards
      causalEdges.init(null);
    });

    afterAll(() => {
      // Restore DB
      causalEdges.init(testDb);
    });

    it('UN1: insertEdge returns null when uninitialised', () => {
      const id = causalEdges.insertEdge('1', '2', 'caused');
      expect(id).toBeNull();
    });

    it('UN2: insertEdgesBatch fails all when uninitialised', () => {
      const result = causalEdges.insertEdgesBatch([
        { sourceId: '1', targetId: '2', relation: 'caused' },
      ]);
      expect(result.inserted).toBe(0);
      expect(result.failed).toBe(1);
    });

    it('UN3: getEdgesFrom returns [] when uninitialised', () => {
      const edges = causalEdges.getEdgesFrom('1');
      expect(Array.isArray(edges)).toBe(true);
      expect(edges).toHaveLength(0);
    });

    it('UN4: getGraphStats returns zeros when uninitialised', () => {
      const stats = causalEdges.getGraphStats();
      expect(stats.totalEdges).toBe(0);
      expect(stats.uniqueSources).toBe(0);
    });

    it('UN5: getCausalChain returns root-only when uninitialised', () => {
      const chain = causalEdges.getCausalChain('1');
      expect(chain).toBeDefined();
      expect(chain.id).toBe('1');
      expect(chain.children).toHaveLength(0);
    });

    it('UN6: findOrphanedEdges returns [] when uninitialised', () => {
      const orphans = causalEdges.findOrphanedEdges();
      expect(Array.isArray(orphans)).toBe(true);
      expect(orphans).toHaveLength(0);
    });
  });
});
