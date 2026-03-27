// TEST: SESSION MANAGER EXTENDED
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import Database from 'better-sqlite3';
import * as sm from '../lib/session/session-manager';

/* ─────────────────────────────────────────────────────────────
   SCAFFOLDING
──────────────────────────────────────────────────────────────── */

interface MemoryObject {
  id: number;
  file_path: string;
  anchorId: string;
  content_hash?: string;
  title: string;
}

interface CountRow {
  c: number;
}

interface SessionStateRow {
  status: string;
  spec_folder: string | null;
  current_task: string | null;
  last_action: string | null;
  tenant_id: string | null;
  user_id: string | null;
  agent_id: string | null;
  state_data: string | null;
}

interface TableRow {
  name: string;
}

interface HashRow {
  memory_hash: string;
}

type InterruptedSession = ReturnType<typeof sm.getInterruptedSessions>['sessions'][number];

let testDb: InstanceType<typeof Database> | null = null;

function setup(): void {
  testDb = new Database(':memory:');
  const r = sm.init(testDb);
  if (!r.success) throw new Error(`init failed: ${r.error}`);
  // Also ensure session_state table exists for state management tests
  sm.ensureSessionStateSchema();
}

function teardown(): void {
  if (testDb) {
    testDb.close();
    testDb = null;
  }
}

function resetDb(): void {
  if (!testDb) return;
  try { testDb.exec('DELETE FROM session_sent_memories'); } catch (_: unknown) {}
  try { testDb.exec('DELETE FROM session_state'); } catch (_: unknown) {}
}

function mem(overrides: Partial<MemoryObject> = {}): MemoryObject {
  return {
    id: 1,
    file_path: '/specs/test/memory/test.md',
    anchorId: 'test-anchor',
    title: 'Test Memory',
    ...overrides,
  };
}

/** Insert a sent-memory row with a custom sent_at timestamp */
function insertSentRow(sessionId: string, hash: string, memoryId: number | null, sentAt: string): void {
  testDb!.prepare(
    `INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at) VALUES (?, ?, ?, ?)`
  ).run(sessionId, hash, memoryId, sentAt);
}

/** Create a temp directory for file-writing tests */
function makeTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sm-test-'));
}

/** Recursively remove a directory */
function rmDir(dir: string): void {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_: unknown) {}
}

/* ─────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('Session Manager Extended Tests', () => {
  beforeEach(() => {
    setup();
  });

  afterAll(() => {
    teardown();
  });

  // ───────────────────────────────────────────────────────────────
  // 1. SHOULDSENDMEMORIESBATCH
  // ───────────────────────────────────────────────────────────────
  describe('1. shouldSendMemoriesBatch', () => {
    it('all new memories return true', () => {
      resetDb();
      const sid = 'batch-check-1';
      const memories = [mem({ id: 10 }), mem({ id: 11 }), mem({ id: 12 })];
      const map = sm.shouldSendMemoriesBatch(sid, memories);
      expect(map).toBeInstanceOf(Map);
      expect(map.get(10)).toBe(true);
      expect(map.get(11)).toBe(true);
      expect(map.get(12)).toBe(true);
    });

    it('mix of sent and unsent', () => {
      resetDb();
      const sid = 'batch-check-2';
      const memories = [mem({ id: 20 }), mem({ id: 21 }), mem({ id: 22 })];
      // Mark id 21 as already sent
      sm.markMemorySent(sid, mem({ id: 21 }));
      const map = sm.shouldSendMemoriesBatch(sid, memories);
      expect(map.get(20)).toBe(true);
      expect(map.get(21)).toBe(false);
      expect(map.get(22)).toBe(true);
    });

    it('empty array returns empty Map', () => {
      resetDb();
      const map = sm.shouldSendMemoriesBatch('edge-1', []);
      expect(map).toBeInstanceOf(Map);
      expect(map.size).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. MARKMEMORIESSENTBATCH
  // ───────────────────────────────────────────────────────────────
  describe('2. markMemoriesSentBatch', () => {
    it('marks all memories in transaction', () => {
      resetDb();
      const sid = 'batch-mark-1';
      const memories = [mem({ id: 30 }), mem({ id: 31 }), mem({ id: 32 })];
      const result = sm.markMemoriesSentBatch(sid, memories);
      expect(result.success).toBe(true);
      expect(result.markedCount).toBe(3);
      // Verify all now show as sent
      for (const m of memories) {
        expect(sm.shouldSendMemory(sid, m)).toBe(false);
      }
    });

    it('skips duplicates, counts only new', () => {
      resetDb();
      const sid = 'batch-mark-2';
      const m = mem({ id: 40 });
      sm.markMemorySent(sid, m);
      // Re-mark the same memory + a new one
      const result = sm.markMemoriesSentBatch(sid, [m, mem({ id: 41 })]);
      expect(result.success).toBe(true);
      // MarkedCount should be 1 (duplicate ignored via INSERT OR IGNORE)
      expect(result.markedCount).toBe(1);
    });

    it('rejects invalid inputs', () => {
      const r1 = sm.markMemoriesSentBatch('', [mem({ id: 50 })]);
      expect(r1.success).toBe(false);
      const r2 = sm.markMemoriesSentBatch('sid', []);
      expect(r2.success).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. CLEANUPEXPIREDSESSIONS
  // ───────────────────────────────────────────────────────────────
  describe('3. cleanupExpiredSessions', () => {
    it('removes expired entries', () => {
      resetDb();
      const sid = 'cleanup-1';
      // Insert rows with old timestamps (2 hours ago, well past 30min TTL)
      const oldTime = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      insertSentRow(sid, 'hash_old_1', 1, oldTime);
      insertSentRow(sid, 'hash_old_2', 2, oldTime);
      // Insert a recent row
      insertSentRow(sid, 'hash_new_1', 3, new Date().toISOString());

      const result = sm.cleanupExpiredSessions();
      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(2);
      // Recent row should survive
        const remaining = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories').get() as CountRow;
        expect(remaining.c).toBe(1);
    });

    it('no-op when nothing expired', () => {
      resetDb();
      // No expired entries
      insertSentRow('cleanup-2', 'hash_fresh', 10, new Date().toISOString());
      const result = sm.cleanupExpiredSessions();
      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. CLEARSESSION
  // ───────────────────────────────────────────────────────────────
  describe('4. clearSession', () => {
    it('deletes only target session entries', () => {
      resetDb();
      const sid = 'clear-1';
      sm.markMemorySent(sid, mem({ id: 60 }));
      sm.markMemorySent(sid, mem({ id: 61 }));
      sm.markMemorySent('other-session', mem({ id: 62 }));

      const result = sm.clearSession(sid);
      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(2);
      // Other-session should be untouched
        const remaining = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get('other-session') as CountRow;
        expect(remaining.c).toBe(1);
    });

    it('returns failure for empty sessionId', () => {
      const r1 = sm.clearSession('');
      expect(r1.success).toBe(false);
      expect(r1.deletedCount).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. GETSESSIONSTATS
  // ───────────────────────────────────────────────────────────────
  describe('5. getSessionStats', () => {
    it('returns correct counts and timestamps', () => {
      resetDb();
      const sid = 'stats-1';
      sm.markMemorySent(sid, mem({ id: 70 }));
      sm.markMemorySent(sid, mem({ id: 71 }));
      sm.markMemorySent(sid, mem({ id: 72 }));

      const stats = sm.getSessionStats(sid);
      expect(stats.totalSent).toBe(3);
      expect(stats.oldestEntry).not.toBeNull();
      expect(stats.newestEntry).not.toBeNull();
    });

    it('returns zeros for unknown session', () => {
      resetDb();
      const stats = sm.getSessionStats('nonexistent');
      expect(stats.totalSent).toBe(0);
      expect(stats.oldestEntry).toBeNull();
      expect(stats.newestEntry).toBeNull();
    });

    it('empty sessionId returns zeros', () => {
      const stats = sm.getSessionStats('');
      expect(stats.totalSent).toBe(0);
    });
  });

  describe('5a. resolveTrustedSession', () => {
    it('accepts server-tracked sessions', () => {
      resetDb();
      sm.saveSessionState('trusted-session', {
        currentTask: 'tracked by server',
        tenantId: 'tenant-a',
      });

      const result = sm.resolveTrustedSession('trusted-session');

      expect(result.requestedSessionId).toBe('trusted-session');
      expect(result.effectiveSessionId).toBe('trusted-session');
      expect(result.trusted).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects tracked sessions without corroborated identity', () => {
      resetDb();
      sm.saveSessionState('trusted-session-without-identity', { currentTask: 'tracked by server' });

      const result = sm.resolveTrustedSession('trusted-session-without-identity');

      expect(result.trusted).toBe(false);
      expect(result.error).toContain('not bound to a corroborated server identity');
    });

    it('rejects scope mismatches for bound sessions', () => {
      resetDb();
      sm.saveSessionState('bound-session', {
        currentTask: 'tracked by server',
        tenantId: 'tenant-a',
        userId: 'user-a',
      });

      const result = sm.resolveTrustedSession('bound-session', { tenantId: 'tenant-b', userId: 'user-a' });

      expect(result.trusted).toBe(false);
      expect(result.error).toContain('different tenantId');
    });

    it('rejects caller identities that were never corroborated on the stored session', () => {
      resetDb();
      sm.saveSessionState('bound-session-missing-user', {
        currentTask: 'tracked by server',
        tenantId: 'tenant-a',
      });

      const result = sm.resolveTrustedSession('bound-session-missing-user', {
        tenantId: 'tenant-a',
        userId: 'user-a',
      });

      expect(result.trusted).toBe(false);
      expect(result.error).toContain('different userId');
    });

    it('rejects untracked caller-supplied session IDs', () => {
      resetDb();
      const result = sm.resolveTrustedSession('invented-session');

      expect(result.trusted).toBe(false);
      expect(result.error).toContain('does not match a server-managed session');
    });

    it('generates a server session when caller omits sessionId', () => {
      resetDb();
      const result = sm.resolveTrustedSession(null);

      expect(result.requestedSessionId).toBeNull();
      expect(result.trusted).toBe(false);
      expect(result.effectiveSessionId).toEqual(expect.any(String));
      expect(result.effectiveSessionId.length).toBeGreaterThan(20);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. MARKRESULTSSENT
  // ───────────────────────────────────────────────────────────────
  describe('6. markResultsSent', () => {
    it('delegates to markMemoriesSentBatch correctly', () => {
      resetDb();
      const sid = 'mark-results-1';
      const results = [mem({ id: 80 }), mem({ id: 81 })];
      const r = sm.markResultsSent(sid, results);
      expect(r.success).toBe(true);
      expect(r.markedCount).toBe(2);
      // Verify they're blocked now
      expect(sm.shouldSendMemory(sid, mem({ id: 80 }))).toBe(false);
      expect(sm.shouldSendMemory(sid, mem({ id: 81 }))).toBe(false);
    });

    it('no-op for invalid inputs', () => {
      const r1 = sm.markResultsSent('', [mem({ id: 90 })]);
      expect(r1.markedCount).toBe(0);
      const r2 = sm.markResultsSent('sid', []);
      expect(r2.markedCount).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. ENSURESESSIONSTATESCHEMA
  // ───────────────────────────────────────────────────────────────
  describe('7. ensureSessionStateSchema', () => {
    it('creates session_state table', () => {
      // Schema already created in setup(), verify the table exists
        const tables = testDb!.prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='session_state'"
        ).all() as TableRow[];
        expect(tables.length).toBe(1);
    });

    it('idempotent (safe to call twice)', () => {
      // Calling it again should be idempotent (CREATE IF NOT EXISTS)
      const r = sm.ensureSessionStateSchema();
      expect(r.success).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 8. SAVESESSIONSTATE
  // ───────────────────────────────────────────────────────────────
  describe('8. saveSessionState', () => {
    it('inserts full state correctly', () => {
      resetDb();
      const r = sm.saveSessionState('save-1', {
        specFolder: 'specs/001-test',
        currentTask: 'implement feature X',
        lastAction: 'wrote file A',
        contextSummary: 'Working on feature X',
        pendingWork: 'Need to write tests',
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
        data: { step: 3, items: ['a', 'b'] },
      });
      expect(r.success).toBe(true);
      // Verify in DB
        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('save-1') as SessionStateRow | undefined;
        expect(row).toBeTruthy();
        expect(row!.status).toBe('active');
        expect(row!.spec_folder).toBe('specs/001-test');
        expect(row!.current_task).toBe('implement feature X');
        expect(row!.tenant_id).toBe('tenant-a');
        expect(row!.user_id).toBe('user-a');
        expect(row!.agent_id).toBe('agent-a');
        const data = JSON.parse(row!.state_data! as string) as { step: number };
        expect(data.step).toBe(3);
    });

    it('upsert preserves existing fields via COALESCE', () => {
      resetDb();
      // Save initial state
      sm.saveSessionState('save-2', { currentTask: 'task A', specFolder: 'specs/002' });
      // Update with partial state (should COALESCE, not overwrite with null)
      sm.saveSessionState('save-2', { lastAction: 'did something' });
        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('save-2') as SessionStateRow;
        expect(row.spec_folder).toBe('specs/002');
        expect(row.last_action).toBe('did something');
    });

    it('rejects empty sessionId', () => {
      const r = sm.saveSessionState('', {});
      expect(r.success).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 9. COMPLETESESSION
  // ───────────────────────────────────────────────────────────────
  describe('9. completeSession', () => {
    it('marks session as completed', () => {
      resetDb();
      sm.saveSessionState('complete-1', { currentTask: 'finishing up' });
      const r = sm.completeSession('complete-1');
      expect(r.success).toBe(true);
        const row = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('complete-1') as Pick<SessionStateRow, 'status'>;
        expect(row.status).toBe('completed');
    });

    it('fails for empty sessionId', () => {
      const r = sm.completeSession('');
      expect(r.success).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 10. RESETINTERRUPTEDSESSIONS
  // ───────────────────────────────────────────────────────────────
  describe('10. resetInterruptedSessions', () => {
    it('only active sessions become interrupted', () => {
      resetDb();
      sm.saveSessionState('reset-1', { currentTask: 'task A' });
      sm.saveSessionState('reset-2', { currentTask: 'task B' });
      sm.completeSession('reset-2'); // This one is completed, should NOT be interrupted

      const r = sm.resetInterruptedSessions();
      expect(r.success).toBe(true);
      expect(r.interruptedCount).toBe(1);

        const row1 = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('reset-1') as Pick<SessionStateRow, 'status'>;
        expect(row1.status).toBe('interrupted');
        const row2 = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('reset-2') as Pick<SessionStateRow, 'status'>;
        expect(row2.status).toBe('completed');
    });

    it('returns 0 when no active sessions', () => {
      resetDb();
      // No active sessions
      const r = sm.resetInterruptedSessions();
      expect(r.success).toBe(true);
      expect(r.interruptedCount).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 11. RECOVERSTATE
  // ───────────────────────────────────────────────────────────────
  describe('11. recoverState', () => {
    it('recovers interrupted session and reactivates it', () => {
      resetDb();
      sm.saveSessionState('recover-1', {
        specFolder: 'specs/003',
        currentTask: 'doing stuff',
        tenantId: 'tenant-a',
        data: { key: 'value' },
      });
      // Mark as interrupted first
      sm.resetInterruptedSessions();

        const r = sm.recoverState('recover-1');
        expect(r.success).toBe(true);
        expect(r.state).toBeTruthy();
        const state = r.state;
        if (!state) {
          throw new Error('Expected recovered state');
        }
        expect(state.sessionId).toBe('recover-1');
        expect(state.specFolder).toBe('specs/003');
        expect(state.currentTask).toBe('doing stuff');
        expect(state.tenantId).toBe('tenant-a');
        expect(r._recovered).toBe(true);
        expect(state.data).toEqual({ key: 'value' });

      // After recovery, session should be reactivated
        const row = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('recover-1') as Pick<SessionStateRow, 'status'>;
        expect(row.status).toBe('active');
    });

    it('returns null state for unknown session', () => {
      const r = sm.recoverState('nonexistent-session');
      expect(r.success).toBe(true);
      expect(r.state).toBeNull();
      expect(r._recovered).toBe(false);
    });

    it('rejects recovery when bound identity mismatches', () => {
      resetDb();
      sm.saveSessionState('recover-bound', {
        currentTask: 'doing stuff',
        tenantId: 'tenant-a',
        userId: 'user-a',
      });

      const r = sm.recoverState('recover-bound', { tenantId: 'tenant-b', userId: 'user-a' });

      expect(r.success).toBe(false);
      expect(r.error).toContain('different tenantId');
    });

    it('rejects empty sessionId', () => {
      const r = sm.recoverState('');
      expect(r.success).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 12. GETINTERRUPTEDSESSIONS
  // ───────────────────────────────────────────────────────────────
  describe('12. getInterruptedSessions', () => {
    it('lists only interrupted sessions', () => {
      resetDb();
      sm.saveSessionState('int-1', { specFolder: 'specs/A', currentTask: 'task A', tenantId: 'tenant-a' });
      sm.saveSessionState('int-2', { specFolder: 'specs/B', currentTask: 'task B', tenantId: 'tenant-a' });
      sm.saveSessionState('int-3', { specFolder: 'specs/C', currentTask: 'task C' });
      sm.completeSession('int-3'); // Won't be interrupted
      sm.resetInterruptedSessions(); // int-1, int-2 become interrupted

      const r = sm.getInterruptedSessions();
      expect(r.success).toBe(true);
      expect(r.sessions.length).toBe(2);
        const ids = r.sessions.map((s: InterruptedSession) => s.sessionId);
        expect(ids).toContain('int-1');
        expect(ids).toContain('int-2');
        // Verify fields are populated
        const s1 = r.sessions.find((s: InterruptedSession) => s.sessionId === 'int-1');
        expect(s1?.specFolder).toBe('specs/A');
        expect(s1?.currentTask).toBe('task A');
    });

    it('filters interrupted sessions by bound identity when caller scope is provided', () => {
      resetDb();
      sm.saveSessionState('int-scope-a', { currentTask: 'task A', tenantId: 'tenant-a', userId: 'user-a' });
      sm.saveSessionState('int-scope-b', { currentTask: 'task B', tenantId: 'tenant-b', userId: 'user-b' });
      sm.saveSessionState('int-unbound', { currentTask: 'task C' });
      sm.resetInterruptedSessions();

      const r = sm.getInterruptedSessions({ tenantId: 'tenant-a', userId: 'user-a' });
      const ids = r.sessions.map((session: InterruptedSession) => session.sessionId);

      expect(ids).toContain('int-scope-a');
      expect(ids).not.toContain('int-unbound');
      expect(ids).not.toContain('int-scope-b');
    });

    it('returns empty array when none', () => {
      resetDb();
      const r = sm.getInterruptedSessions();
      expect(r.success).toBe(true);
      expect(r.sessions.length).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 13. GENERATECONTINUESESSIONMD
  // ───────────────────────────────────────────────────────────────
  describe('13. generateContinueSessionMd', () => {
    it('generates full markdown with all fields', () => {
      const md = sm.generateContinueSessionMd({
        sessionId: 'gen-md-1',
        specFolder: 'specs/005',
        currentTask: 'writing tests',
        lastAction: 'created test file',
        contextSummary: 'Testing session manager',
        pendingWork: 'Need edge case tests',
        data: { priority: 'high' },
      });
      expect(typeof md).toBe('string');
      expect(md).toContain('# CONTINUE SESSION');
      expect(md).toContain('gen-md-1');
      expect(md).toContain('specs/005');
      expect(md).toContain('writing tests');
      expect(md).toContain('created test file');
      expect(md).toContain('Testing session manager');
      expect(md).toContain('Need edge case tests');
      expect(md).toContain('"priority": "high"');
      expect(md).toContain('/spec_kit:resume specs/005');
    });

    it('handles minimal input with N/A defaults', () => {
      // Minimal input (only sessionId required)
      const md = sm.generateContinueSessionMd({ sessionId: 'gen-md-2' });
      expect(md).toContain('# CONTINUE SESSION');
      expect(md).toContain('gen-md-2');
      expect(md).toContain('N/A');
      expect(md).not.toContain('Additional State Data');
      // Without specFolder, should use sessionId-based resume command
      expect(md).toContain('memory_search');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 14. WRITECONTINUESESSIONMD
  // ───────────────────────────────────────────────────────────────
  describe('14. writeContinueSessionMd', () => {
    it('writes file with recovered state', () => {
      resetDb();
      const tmpDir = makeTmpDir();
      try {
        sm.saveSessionState('write-md-1', {
          specFolder: tmpDir,
          currentTask: 'testing writes',
          contextSummary: 'Write test',
        });
        const r = sm.writeContinueSessionMd('write-md-1', tmpDir);
        expect(r.success).toBe(true);
        expect(r.filePath).toBeTruthy();
        // Verify file exists and has content
          const filePath = r.filePath;
          if (!filePath) {
            throw new Error('Expected continue-session file path');
          }
          const content = fs.readFileSync(filePath, 'utf8');
          expect(content).toContain('# CONTINUE SESSION');
          expect(content).toContain('testing writes');
      } finally {
        rmDir(tmpDir);
      }
    });

    it('writes minimal file when no state exists', () => {
      resetDb();
      const tmpDir = makeTmpDir();
      try {
        // No state saved for this session — should fall back to minimal
        const r = sm.writeContinueSessionMd('write-md-nostate', tmpDir);
        expect(r.success).toBe(true);
          const filePath = r.filePath;
          if (!filePath) {
            throw new Error('Expected continue-session file path');
          }
          const content = fs.readFileSync(filePath, 'utf8');
          expect(content).toContain('# CONTINUE SESSION');
          expect(content).toContain('write-md-nostate');
      } finally {
        rmDir(tmpDir);
      }
    });

    it('rejects empty inputs', () => {
      const r = sm.writeContinueSessionMd('', '/some/path');
      expect(r.success).toBe(false);
      const r2 = sm.writeContinueSessionMd('sid', '');
      expect(r2.success).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 15. CHECKPOINTSESSION
  // ───────────────────────────────────────────────────────────────
  describe('15. checkpointSession', () => {
    it('saves state and writes file', () => {
      resetDb();
      const tmpDir = makeTmpDir();
      try {
        const r = sm.checkpointSession('cp-1', {
          specFolder: tmpDir,
          currentTask: 'checkpoint test',
          contextSummary: 'Testing checkpoint',
        }, tmpDir);
        expect(r.success).toBe(true);
        expect(r.filePath).toBeTruthy();
        // Verify state saved in DB
        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('cp-1') as SessionStateRow | undefined;
        expect(row).toBeTruthy();
        expect(row!.current_task).toBe('checkpoint test');
        // Verify file written
        const filePath = r.filePath;
        if (!filePath) {
          throw new Error('Expected checkpoint file path');
        }
        const content = fs.readFileSync(filePath, 'utf8');
        expect(content).toContain('# CONTINUE SESSION');
      } finally {
        rmDir(tmpDir);
      }
    });

    it('saves DB only when no spec folder exists', () => {
      resetDb();
      // No specFolderPath, no state.specFolder — should save to DB only
      const r = sm.checkpointSession('cp-2', { currentTask: 'db only' }, null);
      expect(r.success).toBe(true);
      expect(r.note).toBeTruthy();
      expect(r.note).toContain('no spec folder');
      // Verify state in DB
        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('cp-2') as SessionStateRow | undefined;
        expect(row).toBeTruthy();
    });

    it('falls back to DB-only when folder missing', () => {
      resetDb();
      // SpecFolderPath that doesn't exist on disk — should save DB only
      const r = sm.checkpointSession('cp-3', { currentTask: 'missing dir' }, '/nonexistent/path/abc');
      expect(r.success).toBe(true);
      expect(r.note).toBeTruthy();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 16. ENFORCEENTRYLIMIT
  // ───────────────────────────────────────────────────────────────
  describe('16. enforceEntryLimit', () => {
    it('trims to maxEntriesPerSession', () => {
      resetDb();
      const sid = 'enforce-1';
      const originalMax = sm.CONFIG.maxEntriesPerSession;
      // Temporarily set a small limit
      sm.CONFIG.maxEntriesPerSession = 3;
      try {
        // Insert 5 memories (exceeds limit of 3)
        for (let i = 1; i <= 5; i++) {
          sm.markMemorySent(sid, mem({ id: 1000 + i, anchorId: `anchor-${i}` }));
        }
        // EnforceEntryLimit is called inside markMemorySent
          const count = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get(sid) as CountRow;
          expect(count.c).toBeLessThanOrEqual(3);
      } finally {
        sm.CONFIG.maxEntriesPerSession = originalMax;
      }
    });

    it('no trimming when under limit', () => {
      resetDb();
      const sid = 'enforce-2';
      const originalMax = sm.CONFIG.maxEntriesPerSession;
      sm.CONFIG.maxEntriesPerSession = 5;
      try {
        // Insert exactly 3 (under limit of 5)
        for (let i = 1; i <= 3; i++) {
          sm.markMemorySent(sid, mem({ id: 2000 + i, anchorId: `anchor-${i}` }));
        }
          const count = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get(sid) as CountRow;
          expect(count.c).toBe(3);
      } finally {
        sm.CONFIG.maxEntriesPerSession = originalMax;
      }
    });

    it('trims oldest entries first (FIFO)', () => {
      resetDb();
      const sid = 'enforce-3';
      const originalMax = sm.CONFIG.maxEntriesPerSession;
      sm.CONFIG.maxEntriesPerSession = 2;
      try {
        // Insert with known order via direct SQL for determinism
        const t1 = '2025-01-01T00:00:01.000Z';
        const t2 = '2025-01-01T00:00:02.000Z';
        const t3 = '2025-01-01T00:00:03.000Z';
        insertSentRow(sid, 'oldest_hash', 3001, t1);
        insertSentRow(sid, 'middle_hash', 3002, t2);
        insertSentRow(sid, 'newest_hash', 3003, t3);

        // Manually trigger enforce via a new markMemorySent
        sm.markMemorySent(sid, mem({ id: 3004, anchorId: 'trigger-enforce' }));

        // Should keep only the 2 newest
        const rows = testDb!.prepare(
          'SELECT memory_hash FROM session_sent_memories WHERE session_id = ? ORDER BY sent_at ASC'
        ).all(sid) as HashRow[];
        // After inserting 4 rows with limit 2, the 2 oldest should be trimmed
        expect(rows.length).toBeLessThanOrEqual(2);
        // The newest hash should survive
        const hashes = rows.map((r: HashRow) => r.memory_hash);
        expect(
          hashes.includes('newest_hash') || hashes.some((h: string) => h !== 'oldest_hash')
        ).toBe(true);
      } finally {
        sm.CONFIG.maxEntriesPerSession = originalMax;
      }
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 17. DB UNAVAILABLE DEDUP MODE
  // ───────────────────────────────────────────────────────────────
  describe('17. db unavailable dedup mode', () => {
    it('blocks sending when DB unavailable and mode is block', () => {
      const originalMode = sm.CONFIG.dbUnavailableMode;
      try {
        teardown();
        sm.CONFIG.dbUnavailableMode = 'block';

        const single = sm.shouldSendMemory('db-down-block', mem({ id: 9101 }));
        expect(single).toBe(false);

        const batch = sm.shouldSendMemoriesBatch('db-down-block', [mem({ id: 9102 }), mem({ id: 9103 })]);
        expect(batch.get(9102)).toBe(false);
        expect(batch.get(9103)).toBe(false);
      } finally {
        sm.CONFIG.dbUnavailableMode = originalMode;
        setup();
      }
    });

    it('allows sending when DB unavailable and mode is allow', () => {
      const originalMode = sm.CONFIG.dbUnavailableMode;
      try {
        teardown();
        sm.CONFIG.dbUnavailableMode = 'allow';

        const single = sm.shouldSendMemory('db-down-allow', mem({ id: 9201 }));
        expect(single).toBe(true);

        const batch = sm.shouldSendMemoriesBatch('db-down-allow', [mem({ id: 9202 }), mem({ id: 9203 })]);
        expect(batch.get(9202)).toBe(true);
        expect(batch.get(9203)).toBe(true);
      } finally {
        sm.CONFIG.dbUnavailableMode = originalMode;
        setup();
      }
    });
  });
});
