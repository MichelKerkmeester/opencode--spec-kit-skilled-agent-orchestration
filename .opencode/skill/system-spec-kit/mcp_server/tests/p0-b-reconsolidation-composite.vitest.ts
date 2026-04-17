import { beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

const compositeMocks = vi.hoisted(() => ({
  vectorSearch: vi.fn(),
}));

vi.mock('../lib/search/vector-index', () => ({
  vectorSearch: compositeMocks.vectorSearch,
}));

import { determineAction, executeConflict } from '../lib/storage/reconsolidation';
import {
  findScopeFilteredCandidates,
  getRequestedScope,
} from '../handlers/save/reconsolidation-bridge';

function createReconsolidationDb(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT '',
      file_path TEXT NOT NULL DEFAULT '',
      title TEXT,
      content_text TEXT,
      content_hash TEXT DEFAULT '',
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_archived INTEGER DEFAULT 0
    );
  `);
  database.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    );
  `);
  database.exec(`
    CREATE TABLE weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    );
  `);
  return database;
}

describe('P0-B reconsolidation composite', () => {
  beforeEach(() => {
    compositeMocks.vectorSearch.mockReset();
  });

  it('rejects the second conflict writer with conflict_stale_predecessor instead of forking lineage', () => {
    const database = createReconsolidationDb();
    database.exec(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, content_hash, importance_tier, updated_at)
      VALUES
        (1, 'test-spec', '/memory/1.md', 'Original', 'Original content', 'hash-original', 'normal', '2026-04-17T00:00:00Z'),
        (2, 'test-spec', '/memory/2.md', 'Replacement A', 'Replacement A', 'hash-a', 'normal', '2026-04-17T00:00:00Z'),
        (3, 'test-spec', '/memory/3.md', 'Replacement B', 'Replacement B', 'hash-b', 'normal', '2026-04-17T00:00:00Z');
    `);

    const staleSnapshot = {
      id: 1,
      file_path: '/memory/1.md',
      title: 'Original',
      content_text: 'Original content',
      similarity: 0.82,
      spec_folder: 'test-spec',
      importance_weight: 0.5,
      content_hash: 'hash-original',
      updated_at: '2026-04-17T00:00:00Z',
      importance_tier: 'normal',
    };

    const first = executeConflict(staleSnapshot, {
      id: 2,
      title: 'Replacement A',
      content: 'Replacement A',
      specFolder: 'test-spec',
      filePath: '/memory/2.md',
    }, database);

    const second = executeConflict(staleSnapshot, {
      id: 3,
      title: 'Replacement B',
      content: 'Replacement B',
      specFolder: 'test-spec',
      filePath: '/memory/3.md',
    }, database);

    expect(first).toMatchObject({
      action: 'conflict',
      existingMemoryId: 1,
      newMemoryId: 2,
    });
    expect(second).toMatchObject({
      action: 'conflict',
      status: 'conflict_stale_predecessor',
      existingMemoryId: 1,
      newMemoryId: 3,
    });
    expect(
      database.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get(),
    ).toMatchObject({ importance_tier: 'deprecated' });
    expect(
      database.prepare('SELECT COUNT(*) AS count FROM causal_edges WHERE relation = ?').get('supersedes'),
    ).toMatchObject({ count: 1 });
    database.close();
  });

  it('blocks duplicate complement inserts when a concurrent writer creates a high-similarity candidate before commit', () => {
    const database = createReconsolidationDb();
    const parsed = {
      specFolder: 'test-spec',
      title: 'Incoming memory',
      content: 'Incoming memory body',
    } as any;
    const embedding = new Float32Array([0.1, 0.2, 0.3]);

    compositeMocks.vectorSearch
      .mockReturnValueOnce([])
      .mockReturnValueOnce([
        {
          id: 91,
          file_path: '/memory/91.md',
          title: 'Concurrent duplicate',
          content_text: 'Concurrent duplicate body',
          similarity: 99,
          spec_folder: 'test-spec',
        },
      ]);

    const initialCandidates = findScopeFilteredCandidates({
      database,
      embedding,
      parsed,
      requestedScope: getRequestedScope(),
      limit: 1,
      minSimilarity: 50,
      overfetchMultiplier: 3,
    });
    expect(initialCandidates.candidates).toHaveLength(0);

    database.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, content_hash)
      VALUES (91, 'test-spec', '/memory/91.md', 'Concurrent duplicate', 'Concurrent duplicate body', 'hash-91')
    `).run();

    const outcome = database.transaction(() => {
      const recheck = findScopeFilteredCandidates({
        database,
        embedding,
        parsed,
        requestedScope: getRequestedScope(),
        limit: 1,
        minSimilarity: 50,
        overfetchMultiplier: 3,
      });
      const topCandidate = recheck.candidates[0];
      if (topCandidate && determineAction(topCandidate.similarity) !== 'complement') {
        return 'blocked';
      }

      database.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, content_hash)
        VALUES (99, 'test-spec', '/memory/99.md', 'Duplicate write', 'Duplicate write body', 'hash-99')
      `).run();
      return 'inserted';
    })();

    expect(outcome).toBe('blocked');
    expect(
      database.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE id = 99').get(),
    ).toMatchObject({ count: 0 });
    database.close();
  });

  it('uses one batched governed-scope read so retagged candidates cannot survive a mixed snapshot filter', () => {
    const allSpy = vi.fn(() => [
      {
        id: 10,
        tenant_id: 'tenant-b',
        user_id: 'user-a',
        agent_id: 'agent-a',
        session_id: 'session-a',
        content_hash: 'hash-10',
        updated_at: '2026-04-17T00:00:00Z',
        importance_tier: 'normal',
      },
      {
        id: 11,
        tenant_id: 'tenant-a',
        user_id: 'user-a',
        agent_id: 'agent-a',
        session_id: 'session-a',
        content_hash: 'hash-11',
        updated_at: '2026-04-17T00:00:00Z',
        importance_tier: 'normal',
      },
    ]);
    const database = {
      prepare: vi.fn(() => ({
        all: allSpy,
      })),
    } as any;

    compositeMocks.vectorSearch.mockReturnValue([
      {
        id: 10,
        file_path: '/memory/10.md',
        title: 'Retagged memory',
        content_text: 'Retagged memory body',
        similarity: 97,
        spec_folder: 'test-spec',
      },
      {
        id: 11,
        file_path: '/memory/11.md',
        title: 'In-scope memory',
        content_text: 'In-scope memory body',
        similarity: 96,
        spec_folder: 'test-spec',
      },
    ]);

    const result = findScopeFilteredCandidates({
      database,
      embedding: new Float32Array([0.4, 0.5, 0.6]),
      parsed: { specFolder: 'test-spec' } as any,
      requestedScope: getRequestedScope({
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
        sessionId: 'session-a',
      }),
      limit: 2,
      minSimilarity: 88,
      overfetchMultiplier: 3,
    });

    expect(database.prepare).toHaveBeenCalledOnce();
    expect(allSpy).toHaveBeenCalledWith(10, 11);
    expect(result.candidates.map((candidate) => candidate.id)).toEqual([11]);
    expect(result.suppressedCandidateIds).toEqual([10]);
  });
});
