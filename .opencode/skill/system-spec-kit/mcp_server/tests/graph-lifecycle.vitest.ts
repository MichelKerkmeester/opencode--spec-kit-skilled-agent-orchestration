// TEST: GRAPH LIFECYCLE
// REQ-D3-003: Graph Refresh on Write
// REQ-D3-004: Deterministic Save-Time Enrichment
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  resolveGraphRefreshMode,
  isGraphRefreshEnabled,
  isLlmGraphBackfillEnabled,
  markDirty,
  getDirtyNodes,
  estimateComponentSize,
  recomputeLocal,
  scheduleGlobalRefresh,
  cancelScheduledRefresh,
  isScheduledRefreshPending,
  onWrite,
  onIndex,
  extractCodeFenceTechnologies,
  extractHeadings,
  extractAliases,
  extractRelationPhrases,
  createTypedEdges,
  EXPLICIT_ONLY_EVIDENCE,
  __testables,
} from '../lib/search/graph-lifecycle';

import type {
  GraphRefreshMode,
  WriteEdgePayload,
  DeterministicEdge,
  OnIndexResult,
  GraphRefreshResult,
} from '../lib/search/graph-lifecycle';

// ───────────────────────────────────────────────────────────────
// HELPERS
// ───────────────────────────────────────────────────────────────

/** Create an in-memory SQLite database with required tables. */
function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT 'test',
      file_path TEXT NOT NULL DEFAULT 'test.md',
      title TEXT,
      content_text TEXT,
      quality_score REAL DEFAULT 0
    );

    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      created_by TEXT DEFAULT 'manual',
      UNIQUE(source_id, target_id, relation)
    );

    CREATE TABLE memory_entities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      entity_text TEXT NOT NULL,
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      frequency INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL DEFAULT 'auto',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(memory_id, entity_text)
    );

    CREATE TABLE entity_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      canonical_name TEXT NOT NULL UNIQUE,
      aliases TEXT DEFAULT '[]',
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      memory_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  return db;
}

/** Insert a test memory row. */
function insertMemory(db: Database.Database, id: number, specFolder = 'specs/001-test', content = 'hello world'): void {
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, content_text)
    VALUES (?, ?, 'test.md', ?)
  `).run(id, specFolder, content);
}

/** Insert a causal edge between two nodes. */
function insertEdge(db: Database.Database, sourceId: string, targetId: string, relation = 'supports'): void {
  db.prepare(`
    INSERT OR IGNORE INTO causal_edges (source_id, target_id, relation, strength, created_by)
    VALUES (?, ?, ?, 1.0, 'test')
  `).run(sourceId, targetId, relation);
}

/** Set SPECKIT_GRAPH_REFRESH_MODE for the duration of a test. */
function withRefreshMode(mode: string, fn: () => void): void {
  const original = process.env.SPECKIT_GRAPH_REFRESH_MODE;
  process.env.SPECKIT_GRAPH_REFRESH_MODE = mode;
  try {
    fn();
  } finally {
    if (original === undefined) {
      delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
    } else {
      process.env.SPECKIT_GRAPH_REFRESH_MODE = original;
    }
  }
}

// ───────────────────────────────────────────────────────────────
// UNIT: Feature Flags
// ───────────────────────────────────────────────────────────────

describe('Graph Lifecycle — Feature Flags', () => {
  afterEach(() => {
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
    delete process.env.SPECKIT_LLM_GRAPH_BACKFILL;
  });

  it('resolveGraphRefreshMode returns write_local by default (graduated)', () => {
    expect(resolveGraphRefreshMode()).toBe('write_local');
  });

  it('resolveGraphRefreshMode returns write_local for write_local', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'write_local';
    expect(resolveGraphRefreshMode()).toBe('write_local');
  });

  it('resolveGraphRefreshMode accepts write-local hyphen form', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'write-local';
    expect(resolveGraphRefreshMode()).toBe('write_local');
  });

  it('resolveGraphRefreshMode returns scheduled for scheduled', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'scheduled';
    expect(resolveGraphRefreshMode()).toBe('scheduled');
  });

  it('resolveGraphRefreshMode falls back to write_local for unknown value (graduated)', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'invalid_value';
    expect(resolveGraphRefreshMode()).toBe('write_local');
  });

  it('isGraphRefreshEnabled returns true when mode is write_local (graduated default)', () => {
    expect(isGraphRefreshEnabled()).toBe(true);
  });

  it('isGraphRefreshEnabled returns true when mode is write_local', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'write_local';
    expect(isGraphRefreshEnabled()).toBe(true);
  });

  it('isLlmGraphBackfillEnabled returns true by default (graduated)', () => {
    expect(isLlmGraphBackfillEnabled()).toBe(true);
  });

  it('isLlmGraphBackfillEnabled returns true when set to true', () => {
    process.env.SPECKIT_LLM_GRAPH_BACKFILL = 'true';
    expect(isLlmGraphBackfillEnabled()).toBe(true);
  });

  it('isLlmGraphBackfillEnabled returns true when set to 1', () => {
    process.env.SPECKIT_LLM_GRAPH_BACKFILL = '1';
    expect(isLlmGraphBackfillEnabled()).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────
// UNIT: Dirty-Node Tracking
// ───────────────────────────────────────────────────────────────

describe('Dirty-Node Tracking', () => {
  beforeEach(() => {
    // Clear dirty nodes between tests
    __testables.clearDirtyNodes();
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'write_local';
  });

  afterEach(() => {
    __testables.clearDirtyNodes();
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
  });

  it('markDirty returns 0 when graph refresh is off', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'off';
    const added = markDirty(['1', '2', '3']);
    expect(added).toBe(0);
  });

  it('markDirty returns count of newly added nodes', () => {
    const added = markDirty(['1', '2', '3']);
    expect(added).toBe(3);
  });

  it('markDirty deduplicates repeated node IDs', () => {
    markDirty(['1', '2']);
    const added = markDirty(['2', '3']); // '2' is already dirty
    expect(added).toBe(1);
  });

  it('getDirtyNodes returns snapshot of current dirty set', () => {
    markDirty(['10', '20']);
    const snapshot = getDirtyNodes();
    expect(snapshot.nodeIds.has('10')).toBe(true);
    expect(snapshot.nodeIds.has('20')).toBe(true);
  });

  it('clearDirtyNodes empties the dirty set', () => {
    markDirty(['1', '2', '3']);
    __testables.clearDirtyNodes();
    const snapshot = getDirtyNodes();
    expect(snapshot.nodeIds.size).toBe(0);
  });

  it('markDirty ignores null/empty node IDs', () => {
    const added = markDirty(['', '  ']); // empty strings
    expect(added).toBe(0);
  });

  it('markDirty updates markedAt timestamp when new nodes added', () => {
    const before = Date.now();
    markDirty(['42']);
    const snapshot = getDirtyNodes();
    expect(snapshot.markedAt).toBeGreaterThanOrEqual(before);
  });
});

// ───────────────────────────────────────────────────────────────
// UNIT: Component Size Estimation
// ───────────────────────────────────────────────────────────────

describe('estimateComponentSize', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('returns 0 for empty node list', () => {
    expect(estimateComponentSize(db, [])).toBe(0);
  });

  it('returns seed count when no edges exist', () => {
    expect(estimateComponentSize(db, ['1', '2'])).toBe(2);
  });

  it('expands to connected neighbors', () => {
    insertEdge(db, '1', '2');
    insertEdge(db, '2', '3');
    const size = estimateComponentSize(db, ['1']);
    expect(size).toBeGreaterThanOrEqual(2); // at least 1 and 2
  });

  it('does not double-count visited nodes', () => {
    insertEdge(db, '1', '2');
    insertEdge(db, '1', '3');
    insertEdge(db, '2', '3');
    // Component {1, 2, 3} has 3 nodes
    const size = estimateComponentSize(db, ['1', '2', '3']);
    expect(size).toBe(3);
  });
});

// ───────────────────────────────────────────────────────────────
// UNIT: Local Recompute
// ───────────────────────────────────────────────────────────────

describe('recomputeLocal', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('returns 0 for empty node list', () => {
    expect(recomputeLocal(db, [])).toBe(0);
  });

  it('returns 0 when no edges touch the dirty nodes', () => {
    expect(recomputeLocal(db, ['999'])).toBe(0);
  });

  it('updates edge strength for dirty target nodes', () => {
    // Insert edges with low initial strength so boost is visible
    db.prepare(`
      INSERT OR IGNORE INTO causal_edges (source_id, target_id, relation, strength, created_by)
      VALUES ('1', '2', 'supports', 0.5, 'test'),
             ('3', '2', 'supports', 0.5, 'test')
    `).run();
    // node '2' has in-degree 2

    const updated = recomputeLocal(db, ['2']);
    expect(updated).toBeGreaterThan(0);

    // Verify at least one edge to node '2' had its strength updated
    const row = db.prepare(
      `SELECT strength FROM causal_edges WHERE target_id = '2' ORDER BY strength DESC LIMIT 1`
    ).get() as { strength: number } | undefined;
    // Strength increased from 0.5 by in-degree boost (should be > 0.5)
    expect(row?.strength).toBeGreaterThan(0.5);
  });

  it('strength is bounded at 1.0 (MIN cap)', () => {
    // Insert edge with strength already at 1.0; SQL MIN(1.0, 1.0 + boost) = 1.0
    insertEdge(db, '5', '6');
    recomputeLocal(db, ['6']);
    const row = db.prepare(`SELECT strength FROM causal_edges WHERE target_id = '6'`).get() as
      | { strength: number }
      | undefined;
    // Strength must not exceed 1.0 (the MIN cap)
    expect(row?.strength).toBeLessThanOrEqual(1.0);
  });
});

// ───────────────────────────────────────────────────────────────
// UNIT: Scheduled Global Refresh
// ───────────────────────────────────────────────────────────────

describe('scheduleGlobalRefresh', () => {
  afterEach(() => {
    cancelScheduledRefresh();
    __testables.registerGlobalRefreshFn(() => {});
  });

  it('isScheduledRefreshPending returns false initially', () => {
    expect(isScheduledRefreshPending()).toBe(false);
  });

  it('isScheduledRefreshPending returns true after scheduling', () => {
    scheduleGlobalRefresh(10_000); // long delay so it does not fire during test
    expect(isScheduledRefreshPending()).toBe(true);
    cancelScheduledRefresh();
  });

  it('cancelScheduledRefresh cancels a pending refresh', () => {
    scheduleGlobalRefresh(10_000);
    cancelScheduledRefresh();
    expect(isScheduledRefreshPending()).toBe(false);
  });

  it('multiple scheduleGlobalRefresh calls coalesce (debounce)', () => {
    scheduleGlobalRefresh(10_000);
    scheduleGlobalRefresh(10_000);
    scheduleGlobalRefresh(10_000);
    expect(isScheduledRefreshPending()).toBe(true);
    cancelScheduledRefresh();
  });

  it('registered callback is invoked after delay', async () => {
    const called: number[] = [];
    __testables.registerGlobalRefreshFn(() => { called.push(Date.now()); });

    scheduleGlobalRefresh(50); // short delay for test
    await new Promise<void>((resolve) => setTimeout(resolve, 150));
    expect(called.length).toBe(1);
  });
});

// ───────────────────────────────────────────────────────────────
// UNIT: onWrite — Main Entry Point
// ───────────────────────────────────────────────────────────────

describe('onWrite', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
  });

  afterEach(() => {
    db.close();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
  });

  it('returns skipped=true when mode is off', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'off';
    const result = onWrite(db, { nodeIds: ['1', '2'] });
    expect(result.skipped).toBe(true);
    expect(result.mode).toBe('off');
  });

  it('returns skipped=false when mode is write_local', () => {
    withRefreshMode('write_local', () => {
      const result = onWrite(db, { nodeIds: ['1', '2'] });
      expect(result.skipped).toBe(false);
    });
  });

  it('marks dirty nodes in write_local mode', () => {
    withRefreshMode('write_local', () => {
      onWrite(db, { nodeIds: ['10', '11'] });
      // After local recompute with no edges, dirty nodes are cleared
      // (local recompute sets localRecomputed=true and clears dirty set)
      const result = onWrite(db, { nodeIds: ['12'] });
      expect(result.dirtyNodes).toBeGreaterThanOrEqual(1);
    });
  });

  it('does not trigger local recompute for empty nodeIds', () => {
    withRefreshMode('write_local', () => {
      const result = onWrite(db, { nodeIds: [] });
      expect(result.skipped).toBe(true);
    });
  });

  it('schedules global refresh in scheduled mode', () => {
    withRefreshMode('scheduled', () => {
      const result = onWrite(db, { nodeIds: ['1', '2'] });
      expect(result.scheduledRefresh).toBe(true);
      expect(isScheduledRefreshPending()).toBe(true);
    });
  });

  it('triggers local recompute when component is small', () => {
    withRefreshMode('write_local', () => {
      // Small component (3 nodes), threshold is DEFAULT (50)
      insertEdge(db, '1', '2');
      insertEdge(db, '2', '3');
      const result = onWrite(db, { nodeIds: ['1', '2', '3'] });
      expect(result.localRecomputed).toBe(true);
      expect(result.componentSize).toBeLessThan(50);
    });
  });

  it('falls back to scheduled when component exceeds threshold', () => {
    // Set a very small threshold
    const original = process.env.SPECKIT_GRAPH_LOCAL_THRESHOLD;
    process.env.SPECKIT_GRAPH_LOCAL_THRESHOLD = '2';
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'write_local';

    try {
      // Create a component of 3 nodes, threshold is 2
      insertEdge(db, '1', '2');
      insertEdge(db, '2', '3');
      const result = onWrite(db, { nodeIds: ['1', '2', '3'] });
      // Component > threshold → fallback to schedule
      expect(result.scheduledRefresh).toBe(true);
    } finally {
      if (original === undefined) {
        delete process.env.SPECKIT_GRAPH_LOCAL_THRESHOLD;
      } else {
        process.env.SPECKIT_GRAPH_LOCAL_THRESHOLD = original;
      }
      delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
      cancelScheduledRefresh();
    }
  });
});

// ───────────────────────────────────────────────────────────────
// UNIT: Deterministic Extraction Functions
// ───────────────────────────────────────────────────────────────

describe('extractCodeFenceTechnologies', () => {
  it('returns empty array for content with no code fences', () => {
    expect(extractCodeFenceTechnologies('plain text')).toEqual([]);
  });

  it('extracts technology names from code fences', () => {
    const content = '```typescript\nconst x = 1;\n```\n```python\nprint()\n```';
    const result = extractCodeFenceTechnologies(content);
    expect(result).toContain('typescript');
    expect(result).toContain('python');
  });

  it('deduplicates repeated technologies', () => {
    const content = '```typescript\nx\n```\n```typescript\ny\n```';
    const result = extractCodeFenceTechnologies(content);
    expect(result.filter((t) => t === 'typescript').length).toBe(1);
  });

  it('lowercases technology names', () => {
    const content = '```TypeScript\nx\n```';
    const result = extractCodeFenceTechnologies(content);
    expect(result).toContain('typescript');
  });
});

describe('extractHeadings', () => {
  it('returns empty array for content with no headings', () => {
    expect(extractHeadings('plain text')).toEqual([]);
  });

  it('extracts ## through #### headings', () => {
    const content = '## Section One\n### Sub Section\n#### Deep\n# Title (excluded)';
    const result = extractHeadings(content);
    expect(result).toContain('Section One');
    expect(result).toContain('Sub Section');
    expect(result).toContain('Deep');
    expect(result).not.toContain('Title (excluded)');
  });

  it('trims whitespace from headings', () => {
    const content = '##  Heading With Spaces  ';
    const result = extractHeadings(content);
    expect(result[0]).toBe('Heading With Spaces');
  });
});

describe('extractAliases', () => {
  it('returns empty array for content with no aliases', () => {
    expect(extractAliases('plain text with no aliases')).toEqual([]);
  });

  it('extracts "also known as" patterns', () => {
    const content = 'RAG also known as retrieval augmented generation';
    const result = extractAliases(content);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0][0].toLowerCase()).toContain('rag');
  });

  it('extracts YAML aliases block', () => {
    const content = 'aliases: [primary, secondary, tertiary]';
    const result = extractAliases(content);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('extractRelationPhrases', () => {
  it('returns empty array for content with no relation phrases', () => {
    expect(extractRelationPhrases('plain text')).toEqual([]);
  });

  it('extracts "depends on" relations', () => {
    const content = 'GraphSearch depends on VectorIndex for retrieval.';
    const result = extractRelationPhrases(content);
    expect(result.length).toBeGreaterThan(0);
    const [subject, object] = result[0];
    expect(subject.toLowerCase()).toContain('graphsearch');
    expect(object.toLowerCase()).toContain('vectorindex');
  });

  it('extracts "implements" relations', () => {
    const content = 'EntityLinker implements CrossDocSearch interface.';
    const result = extractRelationPhrases(content);
    expect(result.length).toBeGreaterThan(0);
  });

  it('does not produce self-referential edges', () => {
    const result = extractRelationPhrases('X depends on X');
    // subject === object → filtered out
    for (const [s, o] of result) {
      expect(s.toLowerCase().trim()).not.toBe(o.toLowerCase().trim());
    }
  });
});

// ───────────────────────────────────────────────────────────────
// UNIT: createTypedEdges
// ───────────────────────────────────────────────────────────────

describe('createTypedEdges', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    __testables.clearDirtyNodes();
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
  });

  afterEach(() => {
    db.close();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
  });

  it('returns 0 for empty edge list', () => {
    expect(createTypedEdges(db, 1, [])).toBe(0);
  });

  it('inserts typed edges with explicit_only evidence', () => {
    const edges: DeterministicEdge[] = [
      {
        sourceId: '1',
        targetId: 'tech:typescript',
        relation: 'technology_link',
        evidence: EXPLICIT_ONLY_EVIDENCE,
        strength: 0.75,
      },
    ];
    const inserted = createTypedEdges(db, 1, edges);
    expect(inserted).toBe(1);

    const row = db.prepare(
      `SELECT evidence, created_by FROM causal_edges WHERE source_id = '1' AND target_id = 'tech:typescript'`
    ).get() as { evidence: string; created_by: string } | undefined;

    expect(row?.evidence).toBe(EXPLICIT_ONLY_EVIDENCE);
    expect(row?.created_by).toBe('graph_lifecycle');
  });

  it('is idempotent — INSERT OR IGNORE prevents duplicates', () => {
    const edges: DeterministicEdge[] = [
      {
        sourceId: '1',
        targetId: 'tech:python',
        relation: 'technology_link',
        evidence: EXPLICIT_ONLY_EVIDENCE,
        strength: 0.75,
      },
    ];
    createTypedEdges(db, 1, edges);
    const second = createTypedEdges(db, 1, edges);
    expect(second).toBe(0); // already exists
  });
});

// ───────────────────────────────────────────────────────────────
// INTEGRATION: onIndex — save-time enrichment creates edges
// ───────────────────────────────────────────────────────────────

describe('onIndex — Integration', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
    process.env.SPECKIT_ENTITY_LINKING = 'true';
  });

  afterEach(() => {
    db.close();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
    delete process.env.SPECKIT_ENTITY_LINKING;
    delete process.env.SPECKIT_LLM_GRAPH_BACKFILL;
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
  });

  it('returns skipped=true when SPECKIT_ENTITY_LINKING is false', () => {
    process.env.SPECKIT_ENTITY_LINKING = 'false';
    const result = onIndex(db, 1, '## Section\n```typescript\ncode\n```');
    expect(result.skipped).toBe(true);
  });

  it('returns skipped=true when graph refresh mode is off', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'off';
    const result = onIndex(db, 1, '## Section\n```typescript\ncode\n```');
    expect(result.skipped).toBe(true);
    expect(result.edgesCreated).toBe(0);
  });

  it('returns skipped=true for empty content', () => {
    const result = onIndex(db, 1, '');
    expect(result.skipped).toBe(true);
  });

  it('creates heading_link edges for markdown headings', () => {
    insertMemory(db, 1, 'specs/001-test', '## My Heading\n\nSome content.');
    const result = onIndex(db, 1, '## My Heading\n\nSome content.');

    expect(result.skipped).toBe(false);
    const edge = db.prepare(
      `SELECT relation FROM causal_edges WHERE source_id = '1' AND relation = 'heading_link'`
    ).get() as { relation: string } | undefined;
    expect(edge?.relation).toBe('heading_link');
  });

  it('creates technology_link edges for code fences', () => {
    const content = 'Using TypeScript:\n```typescript\nconst x = 1;\n```';
    insertMemory(db, 2, 'specs/001-test', content);
    const result = onIndex(db, 2, content);

    expect(result.skipped).toBe(false);
    const edge = db.prepare(
      `SELECT relation FROM causal_edges WHERE source_id = '2' AND target_id = 'tech:typescript'`
    ).get() as { relation: string } | undefined;
    expect(edge?.relation).toBe('technology_link');
  });

  it('creates relation_phrase edges', () => {
    const content = 'GraphSearch depends on VectorIndex for retrieval scoring.';
    insertMemory(db, 3, 'specs/002', content);
    const result = onIndex(db, 3, content);

    expect(result.skipped).toBe(false);
    // Relation phrases produce concept:* edges
    const edges = db.prepare(
      `SELECT * FROM causal_edges WHERE relation = 'relation_phrase'`
    ).all() as Array<{ source_id: string; target_id: string }>;
    expect(edges.length).toBeGreaterThan(0);
  });

  it('all created edges have evidence = explicit_only', () => {
    const content = '## Section\n```typescript\ncode\n```';
    insertMemory(db, 4, 'specs/003', content);
    onIndex(db, 4, content);

    const edges = db.prepare(
      `SELECT evidence FROM causal_edges WHERE created_by = 'graph_lifecycle'`
    ).all() as Array<{ evidence: string }>;
    for (const edge of edges) {
      expect(edge.evidence).toBe(EXPLICIT_ONLY_EVIDENCE);
    }
  });

  it('does not schedule LLM backfill when flag is off', () => {
    const content = '## Section\n```typescript\ncode\n```';
    insertMemory(db, 5, 'specs/004', content);
    const result = onIndex(db, 5, content, { qualityScore: 0.9 });
    expect(result.llmBackfillScheduled).toBe(false);
  });

  it('schedules LLM backfill for high-quality docs when flag is on', () => {
    process.env.SPECKIT_LLM_GRAPH_BACKFILL = 'true';

    const backfilledIds: number[] = [];
    __testables.registerLlmBackfillFn((id) => { backfilledIds.push(id); });

    const content = '## Section\n```typescript\ncode\n```';
    insertMemory(db, 6, 'specs/005', content);
    const result = onIndex(db, 6, content, { qualityScore: 0.9 });
    expect(result.llmBackfillScheduled).toBe(true);
  });

  it('does not schedule LLM backfill for low-quality docs', () => {
    process.env.SPECKIT_LLM_GRAPH_BACKFILL = 'true';

    const backfilledIds: number[] = [];
    __testables.registerLlmBackfillFn((id) => { backfilledIds.push(id); });

    const content = '## Section\n```typescript\ncode\n```';
    insertMemory(db, 7, 'specs/006', content);
    const result = onIndex(db, 7, content, { qualityScore: 0.3, llmBackfillThreshold: 0.7 });
    expect(result.llmBackfillScheduled).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────
// INTEGRATION: Save triggers dirty-node refresh (REQ-D3-003)
// ───────────────────────────────────────────────────────────────

describe('Integration: save triggers dirty-node refresh', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
  });

  afterEach(() => {
    db.close();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
    delete process.env.SPECKIT_GRAPH_LOCAL_THRESHOLD;
  });

  it('onWrite in write_local mode recomputes small components', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'write_local';

    insertEdge(db, '1', '2');
    insertEdge(db, '3', '2');

    const result = onWrite(db, { nodeIds: ['1', '2', '3'] });
    expect(result.mode).toBe('write_local');
    expect(result.skipped).toBe(false);
    expect(result.localRecomputed).toBe(true);
  });

  it('onWrite in scheduled mode marks dirty and schedules refresh', () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'scheduled';

    const result = onWrite(db, { nodeIds: ['100', '200', '300'] });
    expect(result.scheduledRefresh).toBe(true);
    expect(isScheduledRefreshPending()).toBe(true);
  });

  it('registered global refresh fn is called after scheduled delay', async () => {
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'scheduled';

    const log: string[] = [];
    __testables.registerGlobalRefreshFn(() => { log.push('global-refresh'); });

    onWrite(db, { nodeIds: ['1'] });
    scheduleGlobalRefresh(50);

    await new Promise<void>((resolve) => setTimeout(resolve, 150));
    expect(log).toContain('global-refresh');
  });
});

// ───────────────────────────────────────────────────────────────
// INTEGRATION: save-time enrichment creates expected entities (REQ-D3-004)
// ───────────────────────────────────────────────────────────────

describe('Integration: save-time enrichment entities and edges', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
    process.env.SPECKIT_ENTITY_LINKING = 'true';
  });

  afterEach(() => {
    db.close();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
    delete process.env.SPECKIT_ENTITY_LINKING;
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
  });

  it('multiple extraction types produce distinct edge relations', () => {
    const content = [
      '## GraphSearch Architecture',
      '',
      'GraphSearch depends on VectorIndex for scoring.',
      '',
      '```typescript',
      'const db = new GraphDB();',
      '```',
    ].join('\n');

    insertMemory(db, 10, 'specs/010', content);
    const result = onIndex(db, 10, content);

    expect(result.skipped).toBe(false);
    expect(result.edgesCreated).toBeGreaterThan(0);

    const relations = (db.prepare(
      `SELECT DISTINCT relation FROM causal_edges WHERE created_by = 'graph_lifecycle'`
    ).all() as Array<{ relation: string }>).map((r) => r.relation);

    expect(relations).toContain('heading_link');
    expect(relations).toContain('technology_link');
    expect(relations).toContain('relation_phrase');
  });

  it('onIndex is idempotent — re-indexing same content does not duplicate edges', () => {
    const content = '## Heading\n```python\ncode\n```';
    insertMemory(db, 11, 'specs/011', content);

    onIndex(db, 11, content);
    const countAfterFirst = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM causal_edges WHERE created_by = 'graph_lifecycle'`
    ).get() as { cnt: number }).cnt;

    onIndex(db, 11, content);
    const countAfterSecond = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM causal_edges WHERE created_by = 'graph_lifecycle'`
    ).get() as { cnt: number }).cnt;

    expect(countAfterSecond).toBe(countAfterFirst);
  });

  it('onIndex with empty content creates no edges', () => {
    insertMemory(db, 12, 'specs/012', '');
    const result = onIndex(db, 12, '');
    expect(result.skipped).toBe(true);
    expect(result.edgesCreated).toBe(0);
  });
});
