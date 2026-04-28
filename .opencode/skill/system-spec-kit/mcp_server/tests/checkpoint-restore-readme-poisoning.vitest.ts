import Database from 'better-sqlite3';
import { gzipSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as checkpointStorage from '../lib/storage/checkpoints.js';
import { createMemoryIndexTestDatabase } from './fixtures/memory-index-db.js';

let database: Database.Database;

function insertCheckpoint(name: string, memories: Array<Record<string, unknown>>): void {
  const snapshot = {
    memories,
    workingMemory: [],
    timestamp: new Date().toISOString(),
  };
  database.prepare(`
    INSERT INTO checkpoints (name, created_at, memory_snapshot, metadata)
    VALUES (?, ?, ?, ?)
  `).run(
    name,
    new Date().toISOString(),
    gzipSync(Buffer.from(JSON.stringify(snapshot))),
    JSON.stringify({ memoryCount: memories.length }),
  );
}

beforeEach(() => {
  database = createMemoryIndexTestDatabase({
    includeCheckpoints: true,
    includeWorkingMemory: true,
  });
  checkpointStorage.init(database);
});

afterEach(() => {
  database.close();
});

describe('checkpoint_restore constitutional README poisoning guard', () => {
  it('downgrades constitutional README rows from poisoned checkpoints and records governance_audit', () => {
    const readmePath = '/workspace/.opencode/skill/system-spec-kit/constitutional/README.md';
    insertCheckpoint('poisoned-readme', [
      {
        id: 7001,
        spec_folder: 'system-spec-kit/constitutional',
        file_path: readmePath,
        canonical_file_path: readmePath,
        title: 'Constitutional README',
        importance_weight: 0.9,
        created_at: '2026-04-24T00:00:00Z',
        updated_at: '2026-04-24T00:00:00Z',
        importance_tier: 'constitutional',
      },
    ]);

    const result = checkpointStorage.restoreCheckpoint('poisoned-readme', true);

    expect(result.errors).toEqual([]);
    expect(result.restored).toBe(1);

    const restored = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = 7001
    `).get() as { importance_tier: string };
    expect(restored.importance_tier).toBe('important');

    const audits = database.prepare(`
      SELECT action
      FROM governance_audit
      ORDER BY id ASC
    `).all() as Array<{ action: string }>;
    expect(audits).toEqual([
      { action: 'tier_downgrade_non_constitutional_path' },
    ]);
  });
});
