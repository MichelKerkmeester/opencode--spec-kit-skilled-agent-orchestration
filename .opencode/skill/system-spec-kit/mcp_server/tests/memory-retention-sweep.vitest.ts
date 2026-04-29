// ───────────────────────────────────────────────────────────────────
// MODULE: Memory Retention Sweep Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { runMemoryRetentionSweep } from '../lib/governance/memory-retention-sweep';
import { createMemoryIndexTestDatabase } from './fixtures/memory-index-db';

function isoOffset(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

function installSearchTables(db: ReturnType<typeof createMemoryIndexTestDatabase>): void {
  db.exec(`
    CREATE VIRTUAL TABLE memory_fts USING fts5(
      title, trigger_phrases, file_path, content_text,
      content='memory_index', content_rowid='id'
    );
    CREATE TRIGGER memory_fts_insert AFTER INSERT ON memory_index BEGIN
      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
    END;
    CREATE TRIGGER memory_fts_delete AFTER DELETE ON memory_index BEGIN
      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
    END;
    CREATE TABLE vec_memories (embedding BLOB);
  `);
}

function insertMemory(
  db: ReturnType<typeof createMemoryIndexTestDatabase>,
  id: number,
  deleteAfter: string | null,
  title = `memory ${id}`,
): void {
  db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases, content_hash,
      content_text, embedding_status, created_at, updated_at,
      tenant_id, user_id, session_id, delete_after
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'success', ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'specs/test-retention',
    `specs/test-retention/${id}.md`,
    title,
    JSON.stringify([title]),
    `hash-${id}`,
    `${title} content`,
    isoOffset(-10_000),
    isoOffset(-10_000),
    'tenant-a',
    'user-a',
    'session-a',
    deleteAfter,
  );

  try {
    db.prepare('INSERT INTO vec_memories(rowid, embedding) VALUES (?, ?)').run(id, Buffer.from([1, 2, 3]));
  } catch {
    // Individual tests that do not install vec_memories do not need vector rows.
  }
}

function memoryIds(db: ReturnType<typeof createMemoryIndexTestDatabase>): number[] {
  return (db.prepare('SELECT id FROM memory_index ORDER BY id').all() as Array<{ id: number }>)
    .map((row) => row.id);
}

describe('memory retention sweep', () => {
  it('deletes expired rows and retains non-expired rows', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');
    insertMemory(db, 2, isoOffset(3_600_000), 'future');
    insertMemory(db, 3, null, 'keep');

    const result = runMemoryRetentionSweep(db);

    expect(result).toMatchObject({
      swept: 1,
      retained: 2,
      dryRun: false,
      deletedIds: [1],
    });
    expect(memoryIds(db)).toEqual([2, 3]);
  });

  it('dry-run returns expired candidates without mutating rows or audit tables', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');
    insertMemory(db, 2, isoOffset(3_600_000), 'future');

    const result = runMemoryRetentionSweep(db, { dryRun: true });

    expect(result.swept).toBe(0);
    expect(result.retained).toBe(2);
    expect(result.candidates.map((row) => row.id)).toEqual([1]);
    expect(memoryIds(db)).toEqual([1, 2]);
    expect(
      (db.prepare('SELECT COUNT(*) AS count FROM governance_audit').get() as { count: number }).count,
    ).toBe(0);
  });

  it('records audit rows with retention_expired reason and original delete_after', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    const deleteAfter = isoOffset(-3_600_000);
    insertMemory(db, 1, deleteAfter, 'expired');

    runMemoryRetentionSweep(db);

    const audit = db.prepare(`
      SELECT action, decision, memory_id, reason, metadata
      FROM governance_audit
      WHERE memory_id = 1
    `).get() as {
      action: string;
      decision: string;
      memory_id: number;
      reason: string;
      metadata: string;
    };

    expect(audit).toMatchObject({
      action: 'retention_sweep',
      decision: 'delete',
      memory_id: 1,
      reason: 'retention_expired',
    });
    expect(JSON.parse(audit.metadata)).toMatchObject({
      originalDeleteAfter: deleteAfter,
      delete_after: deleteAfter,
    });
  });

  it('cleans FTS, vector, active projection, and causal index references', () => {
    const db = createMemoryIndexTestDatabase({
      includeActiveProjection: true,
      includeContentColumns: true,
      includeWorkingMemory: true,
    });
    installSearchTables(db);
    const deleteAfter = isoOffset(-3_600_000);
    insertMemory(db, 1, deleteAfter, 'expired');
    db.prepare(`
      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
      VALUES ('retention::1', 1, 1, ?)
    `).run(isoOffset(-1_000));
    db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('1', '2', 'supports')
    `).run();

    runMemoryRetentionSweep(db);

    expect((db.prepare('SELECT COUNT(*) AS count FROM vec_memories WHERE rowid = 1').get() as { count: number }).count).toBe(0);
    expect((db.prepare("SELECT COUNT(*) AS count FROM memory_fts WHERE memory_fts MATCH 'expired'").get() as { count: number }).count).toBe(0);
    expect((db.prepare('SELECT COUNT(*) AS count FROM active_memory_projection WHERE active_memory_id = 1').get() as { count: number }).count).toBe(0);
    expect((db.prepare("SELECT COUNT(*) AS count FROM causal_edges WHERE source_id = '1' OR target_id = '1'").get() as { count: number }).count).toBe(0);
  });

  it('handles an empty expired set gracefully', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    insertMemory(db, 1, isoOffset(3_600_000), 'future');

    const result = runMemoryRetentionSweep(db);

    expect(result).toMatchObject({
      swept: 0,
      retained: 1,
      dryRun: false,
      candidates: [],
      deletedIds: [],
      ledgerRecorded: null,
    });
    expect(memoryIds(db)).toEqual([1]);
  });

  it('does not corrupt indexes when a sweep and insert interleave', async () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    installSearchTables(db);
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');

    await Promise.all([
      Promise.resolve().then(() => runMemoryRetentionSweep(db)),
      Promise.resolve().then(() => insertMemory(db, 2, isoOffset(3_600_000), 'future')),
    ]);

    expect(memoryIds(db)).toEqual([2]);
    expect((db.prepare("SELECT COUNT(*) AS count FROM memory_fts WHERE memory_fts MATCH 'future'").get() as { count: number }).count).toBe(1);
    expect((db.prepare('SELECT COUNT(*) AS count FROM vec_memories WHERE rowid = 2').get() as { count: number }).count).toBe(1);
  });
});
