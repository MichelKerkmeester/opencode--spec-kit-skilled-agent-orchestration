import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

import * as causalEdges from '../lib/storage/causal-edges.js';

type SqliteDatabase = InstanceType<typeof Database>;
type CausalChainNode = ReturnType<typeof causalEdges.getCausalChain>;

const CANONICAL_SPEC_FOLDER =
  'system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready';

function createCausalGraphDb(): SqliteDatabase {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      source_anchor TEXT,
      target_anchor TEXT,
      relation TEXT NOT NULL CHECK(relation IN (
        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
      )),
      strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
      evidence TEXT,
      extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    );
  `);

  causalEdges.init(db);
  return db;
}

function seedCanonicalDocs(db: SqliteDatabase): void {
  const docs = [
    { id: 101, filePath: 'tasks.md', title: 'Tasks' },
    { id: 102, filePath: 'decision-record.md', title: 'Decision Record' },
    { id: 103, filePath: 'implementation-summary.md', title: 'Implementation Summary' },
    { id: 201, filePath: 'spec.md', title: 'Spec' },
    { id: 202, filePath: 'plan.md', title: 'Plan' },
    { id: 203, filePath: 'checklist.md', title: 'Checklist' },
    { id: 204, filePath: 'research.md', title: 'Research' },
  ];

  const insertDoc = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title)
    VALUES (?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const doc of docs) {
      insertDoc.run(
        doc.id,
        CANONICAL_SPEC_FOLDER,
        `/.opencode/specs/${CANONICAL_SPEC_FOLDER}/${doc.filePath}`,
        doc.title,
      );
    }
  })();
}

function collectChain(node: CausalChainNode): CausalChainNode[] {
  return [node, ...node.children.flatMap((child) => collectChain(child))];
}

function seedCanonicalCausalGraph(db: SqliteDatabase): void {
  const edges = [
    {
      sourceId: '101',
      targetId: '102',
      relation: causalEdges.RELATION_TYPES.SUPPORTS,
      sourceAnchor: 'tasks#child-anchor',
      targetAnchor: 'decision-record#decision-anchor',
      evidence: 'Gate D child packet anchor supports the parent decision anchor',
    },
    {
      sourceId: '102',
      targetId: '103',
      relation: causalEdges.RELATION_TYPES.CAUSED,
      sourceAnchor: 'decision-record#decision-anchor',
      targetAnchor: 'implementation-summary#summary-anchor',
      evidence: 'The decision anchor causes the implementation-summary anchor',
    },
    {
      sourceId: '201',
      targetId: '202',
      relation: causalEdges.RELATION_TYPES.ENABLED,
      sourceAnchor: 'spec#spec-anchor',
      targetAnchor: 'plan#plan-anchor',
      evidence: 'Spec anchor enables the plan anchor',
    },
    {
      sourceId: '202',
      targetId: '203',
      relation: causalEdges.RELATION_TYPES.SUPERSEDES,
      sourceAnchor: 'plan#plan-anchor',
      targetAnchor: 'checklist#checklist-anchor',
      evidence: 'Plan anchor supersedes checklist anchor',
    },
    {
      sourceId: '203',
      targetId: '204',
      relation: causalEdges.RELATION_TYPES.CONTRADICTS,
      sourceAnchor: 'checklist#checklist-anchor',
      targetAnchor: 'research#research-anchor',
      evidence: 'Checklist anchor contradicts research anchor',
    },
    {
      sourceId: '204',
      targetId: '201',
      relation: causalEdges.RELATION_TYPES.DERIVED_FROM,
      sourceAnchor: 'research#research-anchor',
      targetAnchor: 'spec#spec-anchor',
      evidence: 'Research anchor derives the spec anchor',
    },
  ] as const;

  for (const edge of edges) {
    const inserted = causalEdges.insertEdge(
      edge.sourceId,
      edge.targetId,
      edge.relation,
      1.0,
      edge.evidence,
      true,
      'manual',
      {
        sourceAnchor: edge.sourceAnchor,
        targetAnchor: edge.targetAnchor,
      },
    );

    expect(inserted).toBeTypeOf('number');
  }
}

describe('Gate D regression causal graph', () => {
  it('feature 6 preserves all six relation semantics and a 2-hop canonical anchor chain', () => {
    const previousTemporalEdges = process.env.SPECKIT_TEMPORAL_EDGES;
    process.env.SPECKIT_TEMPORAL_EDGES = 'false';

    const db = createCausalGraphDb();

    try {
      seedCanonicalDocs(db);
      seedCanonicalCausalGraph(db);

      const relationSet = [...new Set(
        causalEdges.getAllEdges().map((edge) => edge.relation),
      )].sort();

      expect(relationSet).toEqual([
        causalEdges.RELATION_TYPES.CAUSED,
        causalEdges.RELATION_TYPES.ENABLED,
        causalEdges.RELATION_TYPES.SUPERSEDES,
        causalEdges.RELATION_TYPES.CONTRADICTS,
        causalEdges.RELATION_TYPES.DERIVED_FROM,
        causalEdges.RELATION_TYPES.SUPPORTS,
      ].sort());

      const firstHop = causalEdges.getEdgesFrom('101')[0];
      expect(firstHop).toMatchObject({
        source_id: '101',
        target_id: '102',
        relation: causalEdges.RELATION_TYPES.SUPPORTS,
        source_anchor: 'tasks#child-anchor',
        target_anchor: 'decision-record#decision-anchor',
      });

      const secondHop = causalEdges.getEdgesFrom('102')[0];
      expect(secondHop).toMatchObject({
        source_id: '102',
        target_id: '103',
        relation: causalEdges.RELATION_TYPES.CAUSED,
        source_anchor: 'decision-record#decision-anchor',
        target_anchor: 'implementation-summary#summary-anchor',
      });

      const chain = causalEdges.getCausalChain('101', 2, 'forward');
      const nodes = collectChain(chain);

      expect(nodes.map((node) => node.id)).toEqual(['101', '102', '103']);
      expect(nodes.map((node) => node.depth)).toEqual([0, 1, 2]);
      expect(nodes.slice(1).map((node) => node.relation)).toEqual([
        causalEdges.RELATION_TYPES.SUPPORTS,
        causalEdges.RELATION_TYPES.CAUSED,
      ]);
      expect(chain.children[0]?.children[0]?.children).toHaveLength(0);
    } finally {
      if (previousTemporalEdges === undefined) {
        delete process.env.SPECKIT_TEMPORAL_EDGES;
      } else {
        process.env.SPECKIT_TEMPORAL_EDGES = previousTemporalEdges;
      }
      db.close();
    }
  });
});
