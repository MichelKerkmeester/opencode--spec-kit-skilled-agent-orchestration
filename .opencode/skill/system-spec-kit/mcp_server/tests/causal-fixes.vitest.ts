// TEST: CAUSAL FIXES
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import * as causalEdges from '../lib/storage/causal-edges';
import * as causalGraphHandler from '../handlers/causal-graph';
import BetterSqlite3 from 'better-sqlite3';
import type { CausalChainNode } from '../lib/storage/causal-edges';

let testDb!: BetterSqlite3.Database;

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  if (value == null) {
    throw new Error('Expected value to be defined');
  }
  return value;
}

describe('T202 + T203: FlatEdge id & Relations Filter [deferred - requires DB test fixtures]', () => {
  beforeAll(() => {
    testDb = new BetterSqlite3(':memory:');

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

    // T001d: weight_history
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

    // Seed memories
    const stmt = testDb.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(1, 'test-spec', '/mem/1.md', 'Memory 1');
    stmt.run(2, 'test-spec', '/mem/2.md', 'Memory 2');
    stmt.run(3, 'test-spec', '/mem/3.md', 'Memory 3');
    stmt.run(4, 'test-spec', '/mem/4.md', 'Memory 4');
    stmt.run(5, 'test-spec', '/mem/5.md', 'Memory 5');

    causalEdges.init(testDb);
  });

  function resetEdges() {
    testDb.exec('DELETE FROM causal_edges');
  }

  describe('T202: CausalChainNode.edgeId', () => {
    beforeEach(() => {
      resetEdges();
    });

    it('T202-1: insertEdge returns numeric id', () => {
      const edgeId = causalEdges.insertEdge('1', '2', 'caused', 1.0, null);
      expect(typeof edgeId).toBe('number');
      expect(edgeId).toBeGreaterThan(0);
    });

    it('T202-2: CausalChainNode child has edgeId', () => {
      causalEdges.insertEdge('1', '2', 'caused', 1.0, null);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8, null);
      const chain = causalEdges.getCausalChain('1', 3, 'forward');
      const child = expectDefined(chain.children[0]);
      expect(child.edgeId).toBeDefined();
      expect(child.edgeId).not.toBeNull();
    });

    it('T202-3: edgeId matches insertEdge return', () => {
      const edgeId1 = causalEdges.insertEdge('1', '2', 'caused', 1.0, null);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8, null);
      const chain = causalEdges.getCausalChain('1', 3, 'forward');
      const child = expectDefined(chain.children[0]);
      expect(child.edgeId).toBe(edgeId1);
    });

    it('T202-4: Grandchild edgeId matches', () => {
      causalEdges.insertEdge('1', '2', 'caused', 1.0, null);
      const edgeId2 = causalEdges.insertEdge('2', '3', 'enabled', 0.8, null);
      const chain = causalEdges.getCausalChain('1', 3, 'forward');
      const grandchild = expectDefined(chain.children[0]?.children?.[0]);
      expect(grandchild.edgeId).toBe(edgeId2);
    });

    it('T202-5: Backward traversal has edgeId', () => {
      causalEdges.insertEdge('1', '2', 'caused', 1.0, null);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8, null);
      const backChain = causalEdges.getCausalChain('3', 3, 'backward');
      const backChild = expectDefined(backChain.children[0]);
      expect(typeof backChild.edgeId).toBe('number');
      expect(backChild.edgeId).toBeGreaterThan(0);
    });

    it('T202-6: Unlink via chain edgeId succeeds', () => {
      causalEdges.insertEdge('1', '2', 'caused', 1.0, null);
      causalEdges.insertEdge('2', '3', 'enabled', 0.8, null);
      const backChain = causalEdges.getCausalChain('3', 3, 'backward');
      const backChild = expectDefined(backChain.children[0]);
      const deleteTarget = expectDefined(backChild.edgeId);
      const deleted = causalEdges.deleteEdge(deleteTarget);
      expect(deleted).toBe(true);
    });
  });

  describe('T203: Relations filter', () => {
    beforeEach(() => {
      resetEdges();
      // Create edges with different relation types from node 1
      causalEdges.insertEdge('1', '2', 'caused', 1.0, null);
      causalEdges.insertEdge('1', '3', 'enabled', 0.9, null);
      causalEdges.insertEdge('1', '4', 'supports', 0.7, null);
      causalEdges.insertEdge('1', '5', 'contradicts', 0.5, null);
    });

    it('T203-1: Unfiltered chain returns all 4 edges', () => {
      const fullChain = causalEdges.getCausalChain('1', 3, 'forward');
      expect(fullChain.children.length).toBe(4);
    });

    it('T203-2: Chain children have relation types', () => {
      const fullChain = causalEdges.getCausalChain('1', 3, 'forward');
      const relations = fullChain.children.map((child) => child.relation);
      expect(relations).toContain('caused');
      expect(relations).toContain('enabled');
      expect(relations).toContain('supports');
      expect(relations).toContain('contradicts');
    });

    it('T203-3: Filter caused returns 1 edge (node 2)', () => {
      const fullChain = causalEdges.getCausalChain('1', 3, 'forward');
      const causedOnly = fullChain.children.filter((child) => child.relation === 'caused');
      expect(causedOnly.length).toBe(1);
      expect(causedOnly[0].id).toBe('2');
    });

    it('T203-4: Filter caused+enabled returns 2 edges', () => {
      const fullChain = causalEdges.getCausalChain('1', 3, 'forward');
      const allowedSet = new Set(['caused', 'enabled']);
      const filtered = fullChain.children.filter((child) => allowedSet.has(child.relation));
      expect(filtered.length).toBe(2);
    });

    it('T203-5: No filter returns all 4 edges', () => {
      const fullChain = causalEdges.getCausalChain('1', 3, 'forward');
      expect(fullChain.children.length).toBe(4);
    });

    it('T203-6: Filter non-existent relation returns 0', () => {
      const fullChain = causalEdges.getCausalChain('1', 3, 'forward');
      const noneFilter = fullChain.children.filter((child) => child.relation === 'supersedes');
      expect(noneFilter.length).toBe(0);
    });

    it('T203-7: Handler drift_why is callable', () => {
      expect(typeof causalGraphHandler.handleMemoryDriftWhy).toBe('function');
    });
  });

  describe('T202+T203: Combined workflow', () => {
    beforeEach(() => {
      resetEdges();
      // Create a graph: 1 -caused-> 2, 1 -enabled-> 3, 2 -supports-> 4
      causalEdges.insertEdge('1', '2', 'caused', 1.0, null);
      causalEdges.insertEdge('1', '3', 'enabled', 0.9, null);
      causalEdges.insertEdge('2', '4', 'supports', 0.7, null);
    });

    it('T202+T203-1: All chain children have edgeId', () => {
      const chain = causalEdges.getCausalChain('1', 3, 'forward');
      const allHaveEdgeId = chain.children.every(
        (child: CausalChainNode) => typeof child.edgeId === 'number' && child.edgeId > 0
      );
      expect(allHaveEdgeId).toBe(true);
    });

    it('T202+T203-2: Caused filter returns 1 child', () => {
      const chain = causalEdges.getCausalChain('1', 3, 'forward');
      const causedChildren = chain.children.filter((child) => child.relation === 'caused');
      expect(causedChildren.length).toBe(1);
    });

    it('T202+T203-3: Unlink filtered edge by id', () => {
      const chain = causalEdges.getCausalChain('1', 3, 'forward');
      const causedChildren = chain.children.filter((child) => child.relation === 'caused');
      const edgeIdToDelete = expectDefined(causedChildren[0]?.edgeId);
      const deleted = causalEdges.deleteEdge(edgeIdToDelete);
      expect(deleted).toBe(true);
    });

    it('T202+T203-4: Edge confirmed deleted from chain', () => {
      const chain = causalEdges.getCausalChain('1', 3, 'forward');
      const causedChildren = chain.children.filter((child) => child.relation === 'caused');
      const edgeIdToDelete = expectDefined(causedChildren[0]?.edgeId);
      causalEdges.deleteEdge(edgeIdToDelete);

      const afterChain = causalEdges.getCausalChain('1', 3, 'forward');
      const causedAfter = afterChain.children.filter((child) => child.relation === 'caused');
      expect(causedAfter.length).toBe(0);
    });
  });
});
