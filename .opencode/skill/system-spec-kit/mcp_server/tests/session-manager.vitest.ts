// TEST: SESSION MANAGER
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';

import Database from 'better-sqlite3';
import * as sessionManager from '../lib/session/session-manager';
import { extractSpecFolder } from '../lib/parsing/memory-parser';

// TESTS: SESSION MANAGER (T001-T008)
// T001-T008: Core session deduplication functionality
// REQ-001: Session Deduplication - Hash-based duplicate prevention

interface SessionConfig {
  sessionTtlMinutes: number;
  maxEntriesPerSession: number;
  enabled: boolean;
}

interface MarkResult {
  success: boolean;
  hash?: string;
  error?: string;
}

interface DedupStats {
  filtered: number;
  total: number;
  enabled: boolean;
  tokenSavingsEstimate: string;
}

type FilterResult = ReturnType<typeof sessionManager.filterSearchResults>;

interface MemoryObject {
  id: number;
  file_path: string;
  anchorId: string;
  content_hash?: string;
  title: string;
}

let testDb: InstanceType<typeof Database> | null = null;

/**
 * Create a mock memory object
 */
function createMemory(overrides: Partial<MemoryObject> = {}): MemoryObject {
  return {
    id: 1,
    file_path: '/specs/test-spec/memory/test.md',
    anchorId: 'test-anchor',
    title: 'Test Memory',
    ...overrides,
  };
}

/**
 * Reset database between tests for isolation
 */
function resetDb(): void {
  if (testDb) {
    try {
      testDb.exec('DELETE FROM session_sent_memories');
    } catch (_error: unknown) {
      // Table might not exist yet
    }
  }
}

describe('Session Manager Tests (T001-T008)', () => {
  beforeAll(() => {
    testDb = new Database(':memory:');

    const result = sessionManager.init(testDb);
    if (!result.success) {
      throw new Error(`Failed to initialize session manager: ${result.error}`);
    }
  });

  afterAll(() => {
    if (testDb) {
      testDb.close();
      testDb = null;
    }
  });

  // T001: SESSION MANAGER INSTANTIATION
  describe('T001: SessionManager class instantiation with default config', () => {
    it('T001: SessionManager exports all required functions', () => {
      const requiredExports: string[] = [
        'init',
        'ensureSchema',
        'getDb',
        'generateMemoryHash',
        'shouldSendMemory',
        'markMemorySent',
        'isEnabled',
        'getConfig',
      ];

      const missingExports: string[] = requiredExports.filter(
        // TODO(P6-05): Intentional test cast — exercises non-function property check
        (exp: string) => typeof (sessionManager as unknown as Record<string, unknown>)[exp] !== 'function'
      );

      expect(missingExports).toHaveLength(0);
    });

    it('T001: Default config has correct types', () => {
      const config: SessionConfig = sessionManager.getConfig();
      expect(typeof config.sessionTtlMinutes).toBe('number');
      expect(typeof config.maxEntriesPerSession).toBe('number');
      expect(typeof config.enabled).toBe('boolean');
    });

    it('T001: Database reference set after init', () => {
      expect(sessionManager.getDb()).toBeTruthy();
    });
  });

  // T002: HASH GENERATION
  describe('T002: Hash generation for memory content fingerprinting', () => {
    it('T002: Hash generated with content_hash', () => {
      const memory1: MemoryObject = createMemory({ content_hash: 'abc123def456' });
      const hash1: string = sessionManager.generateMemoryHash(memory1);
      expect(typeof hash1).toBe('string');
      // Fix #37 — hash now 128-bit (32 hex chars) instead of 64-bit (16)
      expect(hash1).toHaveLength(32);
    });

    it('T002: Hash generated with id fallback', () => {
      const memory2: MemoryObject = createMemory({
        id: 42,
        anchorId: 'decisions',
        file_path: '/specs/test/memory/dec.md'
      });
      const hash2: string = sessionManager.generateMemoryHash(memory2);
      expect(typeof hash2).toBe('string');
      expect(hash2).toHaveLength(32);
    });

    it('T002: Hash is deterministic', () => {
      const memory: MemoryObject = createMemory({ content_hash: 'abc123def456' });
      const hash1: string = sessionManager.generateMemoryHash(memory);
      const hash1b: string = sessionManager.generateMemoryHash(memory);
      expect(hash1).toBe(hash1b);
    });

    it('T002: Different inputs produce different hashes', () => {
      const memory1: MemoryObject = createMemory({ content_hash: 'abc123def456' });
      const memory2: MemoryObject = createMemory({
        id: 42,
        anchorId: 'decisions',
        file_path: '/specs/test/memory/dec.md'
      });
      const hash1: string = sessionManager.generateMemoryHash(memory1);
      const hash2: string = sessionManager.generateMemoryHash(memory2);
      expect(hash1).not.toBe(hash2);
    });

    it('T002: Null memory throws error', () => {
      // TODO(P6-05): Intentional test cast — validates null input handling
      expect(() => {
        sessionManager.generateMemoryHash(null as unknown as MemoryObject);
      }).toThrow();
    });
  });

  // T003: shouldSendMemory() RETURNS TRUE FOR NEW MEMORIES
  describe('T003: shouldSendMemory() returns true for new memories', () => {
    beforeEach(() => {
      resetDb();
    });

    it('T003: New memory object should be sent', () => {
      const sessionId: string = 'test-session-T003';
      const memory: MemoryObject = createMemory({ id: 100, anchorId: 'new-memory' });
      const shouldSend: boolean = sessionManager.shouldSendMemory(sessionId, memory);
      expect(shouldSend).toBe(true);
    });

    it('T003: New memory ID (number) should be sent', () => {
      const sessionId: string = 'test-session-T003';
      const shouldSend2: boolean = sessionManager.shouldSendMemory(sessionId, 999);
      expect(shouldSend2).toBe(true);
    });
  });

  // T004: shouldSendMemory() RETURNS FALSE FOR ALREADY-SENT
  describe('T004: shouldSendMemory() returns false for already-sent memories', () => {
    beforeEach(() => {
      resetDb();
    });

    it('T004: Memory blocked after being marked as sent', () => {
      const sessionId: string = 'test-session-T004';
      const memory: MemoryObject = createMemory({ id: 200, anchorId: 'sent-memory' });

      const firstCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
      expect(firstCheck).toBe(true);

      const markResult: MarkResult = sessionManager.markMemorySent(sessionId, memory);
      expect(markResult.success).toBe(true);

      const secondCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
      expect(secondCheck).toBe(false);
    });
  });

  // T005: markMemorySent() TRACKS SENT MEMORY IDS
  describe('T005: markMemorySent() correctly tracks sent memory IDs', () => {
    beforeEach(() => {
      resetDb();
    });

    it('T005: All marked memories are tracked and blocked', () => {
      const sessionId: string = 'test-session-T005';
      const memories: MemoryObject[] = [
        createMemory({ id: 301, anchorId: 'memory-a' }),
        createMemory({ id: 302, anchorId: 'memory-b' }),
        createMemory({ id: 303, anchorId: 'memory-c' }),
      ];

      for (const memory of memories) {
        const result: MarkResult = sessionManager.markMemorySent(sessionId, memory);
        expect(result.success).toBe(true);
        expect(typeof result.hash).toBe('string');
        expect(result.hash).toHaveLength(32);
      }

      for (const memory of memories) {
        expect(sessionManager.shouldSendMemory(sessionId, memory)).toBe(false);
      }

      const count = testDb!.prepare(`
        SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
      `).get(sessionId) as { count: number };

      expect(count.count).toBe(3);
    });
  });

  // T006: SESSION ID GENERATION IS UNIQUE
  describe('T006: Session ID generation is unique per session', () => {
    beforeEach(() => {
      resetDb();
    });

    it('T006: Different sessions maintain separate tracking', () => {
      const session1: string = 'session-unique-001';
      const session2: string = 'session-unique-002';
      const memory: MemoryObject = createMemory({ id: 400, anchorId: 'shared-memory' });

      sessionManager.markMemorySent(session1, memory);

      expect(sessionManager.shouldSendMemory(session1, memory)).toBe(false);

      expect(sessionManager.shouldSendMemory(session2, memory)).toBe(true);

      sessionManager.markMemorySent(session2, memory);

      expect(sessionManager.shouldSendMemory(session1, memory)).toBe(false);
      expect(sessionManager.shouldSendMemory(session2, memory)).toBe(false);

      const entries = testDb!.prepare(`
        SELECT session_id FROM session_sent_memories ORDER BY session_id
      `).all() as Array<{ session_id: string }>;

      const sessions: Set<string> = new Set(entries.map((e) => e.session_id));
      expect(sessions.size).toBe(2);
    });
  });

  // T007: MEMORY FILTERING REMOVES DUPLICATES
  describe('T007: Memory filtering removes duplicates from search results', () => {
    beforeEach(() => {
      resetDb();
    });

    it('T007: Filters duplicate memories from search results', () => {
      const sessionId: string = 'test-session-T007';

      const searchResults: MemoryObject[] = [
        createMemory({ id: 501, anchorId: 'result-1' }),
        createMemory({ id: 502, anchorId: 'result-2' }),
        createMemory({ id: 503, anchorId: 'result-3' }),
        createMemory({ id: 504, anchorId: 'result-4' }),
        createMemory({ id: 505, anchorId: 'result-5' }),
      ];

      sessionManager.markMemorySent(sessionId, searchResults[1]); // 502
      sessionManager.markMemorySent(sessionId, searchResults[3]); // 504

      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);

      expect(filtered).toHaveLength(3);

      const filteredIds: number[] = filtered.map((m) => m.id!);
      expect(filteredIds).toContain(501);
      expect(filteredIds).toContain(503);
      expect(filteredIds).toContain(505);

      expect(dedupStats.filtered).toBe(2);
      expect(dedupStats.total).toBe(5);
      expect(dedupStats.enabled).toBe(true);
    });

    it('T007b: Removes duplicates within the same result batch', () => {
      const sessionId: string = 'test-session-T007b';

      const duplicateResultA: MemoryObject = createMemory({ id: 701, anchorId: 'dup-result' });
      const duplicateResultB: MemoryObject = createMemory({ id: 701, anchorId: 'dup-result' });
      const uniqueResult: MemoryObject = createMemory({ id: 702, anchorId: 'unique-result' });

      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, [
        duplicateResultA,
        duplicateResultB,
        uniqueResult,
      ]);

      expect(filtered).toHaveLength(2);
      const filteredIds: number[] = filtered.map((m) => m.id!);
      expect(filteredIds).toEqual([701, 702]);

      expect(dedupStats.filtered).toBe(1);
      expect(dedupStats.total).toBe(3);
      expect(dedupStats.enabled).toBe(true);
    });
  });

  // T008: DEDUP_SAVINGS_TOKENS CALCULATION
  describe('T008: dedup_savings_tokens calculation accuracy', () => {
    beforeEach(() => {
      resetDb();
    });

    it('T008: Token savings calculated correctly for filtered duplicates', () => {
      const sessionId: string = 'test-session-T008';

      const searchResults: MemoryObject[] = [
        createMemory({ id: 601, anchorId: 'result-1' }),
        createMemory({ id: 602, anchorId: 'result-2' }),
        createMemory({ id: 603, anchorId: 'result-3' }),
        createMemory({ id: 604, anchorId: 'result-4' }),
      ];

      sessionManager.markMemorySent(sessionId, searchResults[0]); // 601
      sessionManager.markMemorySent(sessionId, searchResults[1]); // 602
      sessionManager.markMemorySent(sessionId, searchResults[2]); // 603

      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);

      expect(dedupStats.tokenSavingsEstimate).toBeTruthy();

      // 3 filtered * 200 = ~600 tokens
      expect(dedupStats.tokenSavingsEstimate).toBe('~600 tokens');
    });

    it('T008: Zero savings when no duplicates', () => {
      const sessionId: string = 'test-session-T008-zero';

      const searchResults: MemoryObject[] = [
        createMemory({ id: 601, anchorId: 'result-1' }),
        createMemory({ id: 602, anchorId: 'result-2' }),
      ];

      const { dedupStats: noSavingsStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
      expect(noSavingsStats.tokenSavingsEstimate).toBe('0');
    });
  });

  // T009: CROSS-PATH SESSION CONSISTENCY
  describe('T009: Cross-path session consistency via spec folder canonicalization', () => {
    it('T009: extractSpecFolder produces same result for symlink and real paths', () => {
      // Simulates the scenario where the same memory file is accessed
      // via .claude/specs (symlink) and .opencode/specs (real path).
      // Both should produce the same spec_folder for session state consistency.
      const fs = require('fs');
      const path = require('path');
      const os = require('os');

      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sess-cross-'));
      try {
        // Create real structure
        const realMemDir = path.join(tmpDir, '.opencode', 'specs', '010-test', 'memory');
        fs.mkdirSync(realMemDir, { recursive: true });
        fs.writeFileSync(path.join(realMemDir, 'session.md'), 'content');

        // Create symlink
        const claudeDir = path.join(tmpDir, '.claude');
        fs.mkdirSync(claudeDir, { recursive: true });
        fs.symlinkSync(path.join('..', '.opencode', 'specs'), path.join(claudeDir, 'specs'));

        const realPath = path.join(tmpDir, '.opencode', 'specs', '010-test', 'memory', 'session.md');
        const symPath = path.join(tmpDir, '.claude', 'specs', '010-test', 'memory', 'session.md');

        const specReal = extractSpecFolder(realPath);
        const specSym = extractSpecFolder(symPath);

        // Critical: both paths must yield the same spec_folder
        expect(specReal).toBe(specSym);
        expect(specReal).toBe('010-test');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('T009: Hash consistency across symlink paths', () => {
      const memory1: MemoryObject = createMemory({
        id: 700,
        file_path: '/project/.opencode/specs/010-test/memory/ctx.md',
        anchorId: 'cross-path-1',
        content_hash: 'cross-path-hash-123',
      });
      const memory2: MemoryObject = createMemory({
        id: 700,
        file_path: '/project/.claude/specs/010-test/memory/ctx.md',
        anchorId: 'cross-path-1',
        content_hash: 'cross-path-hash-123',
      });

      // Same content_hash → same dedup hash regardless of path
      const hash1 = sessionManager.generateMemoryHash(memory1);
      const hash2 = sessionManager.generateMemoryHash(memory2);
      expect(hash1).toBe(hash2);
    });
  });
});
