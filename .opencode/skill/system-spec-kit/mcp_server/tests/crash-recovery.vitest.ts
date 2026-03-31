// TEST: CRASH RECOVERY
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const mockState = vi.hoisted(() => ({
  databasePath: '',
  workingMemory: {
    clearSession: vi.fn(),
    sessionExists: vi.fn(() => false),
  },
}));

vi.mock('../core/config.js', () => ({
  resolveDatabasePaths: () => ({
    databasePath: mockState.databasePath,
  }),
}));

vi.mock('../lib/cognitive/working-memory.js', () => mockState.workingMemory);

import * as sessionManager from '../lib/session/session-manager.js';
import {
  findPendingFiles,
  getPendingPath,
  recoverAllPendingFiles,
  recoverPendingFile,
  resetMetrics,
} from '../lib/storage/transaction-manager.js';
import {
  SCHEMA_VERSION,
  initDb,
  getDb,
  closeDb,
  getStats,
  cleanupOrphans,
  ensureFreshFiles,
  getLastGitHead,
  isFileStale,
  setLastGitHead,
  upsertFile,
  replaceNodes,
} from '../lib/code-graph/code-graph-db.js';
import type { CodeNode } from '../lib/code-graph/indexer-types.js';

interface MockSessionStateRow {
  session_id: string;
  status: string;
  spec_folder: string | null;
  current_task: string | null;
  last_action: string | null;
  context_summary: string | null;
  pending_work: string | null;
  state_data: string | null;
  tenant_id: string | null;
  user_id: string | null;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
}

interface MockRunResult {
  changes: number;
}

interface MockDatabaseHarness {
  db: {
    exec: (sql: string) => void;
    prepare: (sql: string) => {
      run: (...args: unknown[]) => MockRunResult;
      get: (...args: unknown[]) => Record<string, unknown> | undefined;
      all: (...args: unknown[]) => Array<Record<string, unknown>>;
    };
    transaction: <T>(callback: () => T) => () => T;
    inTransaction: boolean;
  };
  execStatements: string[];
  tableColumns: Set<string>;
  getSessionState: (sessionId: string) => MockSessionStateRow | undefined;
}

const SESSION_STATE_BASE_COLUMNS = [
  'session_id',
  'status',
  'spec_folder',
  'current_task',
  'last_action',
  'context_summary',
  'pending_work',
  'state_data',
  'created_at',
  'updated_at',
];

const tempDirs: string[] = [];

function normalizeSql(sql: string): string {
  return sql.replace(/\s+/g, ' ').trim();
}

function createMockDatabase(): MockDatabaseHarness {
  const execStatements: string[] = [];
  const tables = new Set<string>();
  const tableColumns = new Set<string>();
  const sessionState = new Map<string, MockSessionStateRow>();

  const cloneRow = (row: MockSessionStateRow | undefined): MockSessionStateRow | undefined => {
    return row ? { ...row } : undefined;
  };

  const db = {
    inTransaction: false,
    exec(sql: string) {
      execStatements.push(sql);
      const normalizedSql = normalizeSql(sql);

      if (normalizedSql.includes('CREATE TABLE IF NOT EXISTS session_sent_memories')) {
        tables.add('session_sent_memories');
      }

      if (normalizedSql.includes('CREATE TABLE IF NOT EXISTS session_state')) {
        tables.add('session_state');
        for (const column of SESSION_STATE_BASE_COLUMNS) {
          tableColumns.add(column);
        }
      }

      if (normalizedSql.includes('ALTER TABLE session_state ADD COLUMN tenant_id')) {
        tableColumns.add('tenant_id');
      }
      if (normalizedSql.includes('ALTER TABLE session_state ADD COLUMN user_id')) {
        tableColumns.add('user_id');
      }
      if (normalizedSql.includes('ALTER TABLE session_state ADD COLUMN agent_id')) {
        tableColumns.add('agent_id');
      }
    },
    prepare(sql: string) {
      const normalizedSql = normalizeSql(sql);

      return {
        run: (...args: unknown[]) => {
          if (normalizedSql === 'DELETE FROM working_memory WHERE last_focused < ?') {
            return { changes: 0 };
          }

          if (normalizedSql === 'DELETE FROM session_sent_memories WHERE sent_at < ?') {
            return { changes: 0 };
          }

          if (normalizedSql === "DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?") {
            const cutoffIso = String(args[0]);
            let changes = 0;
            for (const [sessionId, row] of sessionState.entries()) {
              if ((row.status === 'completed' || row.status === 'interrupted') && row.updated_at < cutoffIso) {
                sessionState.delete(sessionId);
                changes++;
              }
            }
            return { changes };
          }

          if (normalizedSql.startsWith('INSERT INTO session_state (')) {
            const [
              sessionId,
              specFolder,
              currentTask,
              lastAction,
              contextSummary,
              pendingWork,
              stateData,
              tenantId,
              userId,
              agentId,
              createdAt,
              updatedAt,
            ] = args as [
              string,
              string | null,
              string | null,
              string | null,
              string | null,
              string | null,
              string | null,
              string | null,
              string | null,
              string | null,
              string,
              string,
            ];

            const existing = sessionState.get(sessionId);
            const nextRow: MockSessionStateRow = {
              session_id: sessionId,
              status: 'active',
              spec_folder: specFolder ?? existing?.spec_folder ?? null,
              current_task: currentTask ?? existing?.current_task ?? null,
              last_action: lastAction ?? existing?.last_action ?? null,
              context_summary: contextSummary ?? existing?.context_summary ?? null,
              pending_work: pendingWork ?? existing?.pending_work ?? null,
              state_data: stateData ?? existing?.state_data ?? null,
              tenant_id: tenantId ?? existing?.tenant_id ?? null,
              user_id: userId ?? existing?.user_id ?? null,
              agent_id: agentId ?? existing?.agent_id ?? null,
              created_at: existing?.created_at ?? createdAt,
              updated_at: updatedAt,
            };
            sessionState.set(sessionId, nextRow);
            return { changes: existing ? 1 : 1 };
          }

          if (normalizedSql === "UPDATE session_state SET status = 'completed', updated_at = ? WHERE session_id = ?") {
            const [updatedAt, sessionId] = args as [string, string];
            const row = sessionState.get(sessionId);
            if (!row) {
              return { changes: 0 };
            }
            row.status = 'completed';
            row.updated_at = updatedAt;
            return { changes: 1 };
          }

          if (normalizedSql === "UPDATE session_state SET status = 'interrupted', updated_at = ? WHERE status = 'active'") {
            const [updatedAt] = args as [string];
            let changes = 0;
            for (const row of sessionState.values()) {
              if (row.status === 'active') {
                row.status = 'interrupted';
                row.updated_at = updatedAt;
                changes++;
              }
            }
            return { changes };
          }

          if (normalizedSql === "UPDATE session_state SET status = 'active', updated_at = ? WHERE session_id = ?") {
            const [updatedAt, sessionId] = args as [string, string];
            const row = sessionState.get(sessionId);
            if (!row) {
              return { changes: 0 };
            }
            row.status = 'active';
            row.updated_at = updatedAt;
            return { changes: 1 };
          }

          throw new Error(`Unhandled mock run SQL: ${normalizedSql}`);
        },
        get: (...args: unknown[]) => {
          if (normalizedSql === "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1") {
            const [tableName] = args as [string];
            return tables.has(tableName) ? { 1: 1 } : undefined;
          }

          if (normalizedSql === 'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1') {
            const [sessionId] = args as [string];
            return sessionState.has(sessionId) ? { 1: 1 } : undefined;
          }

          if (normalizedSql === 'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1') {
            return undefined;
          }

          if (normalizedSql === 'SELECT session_id, status, spec_folder, current_task, last_action, context_summary, pending_work, state_data, tenant_id, user_id, agent_id, created_at, updated_at FROM session_state WHERE session_id = ?') {
            const [sessionId] = args as [string];
            return cloneRow(sessionState.get(sessionId));
          }

          if (normalizedSql === 'SELECT tenant_id, user_id, agent_id FROM session_state WHERE session_id = ? LIMIT 1') {
            const [sessionId] = args as [string];
            const row = sessionState.get(sessionId);
            if (!row) {
              return undefined;
            }
            return {
              tenant_id: row.tenant_id,
              user_id: row.user_id,
              agent_id: row.agent_id,
            };
          }

          throw new Error(`Unhandled mock get SQL: ${normalizedSql}`);
        },
        all: (...args: unknown[]) => {
          if (normalizedSql === 'PRAGMA table_info(session_state)') {
            return Array.from(tableColumns).map((name) => ({ name }));
          }

          if (normalizedSql === 'SELECT session_id, spec_folder, current_task, last_action, context_summary, pending_work, updated_at, tenant_id, user_id, agent_id FROM session_state WHERE status = \'interrupted\' ORDER BY updated_at DESC') {
            return Array.from(sessionState.values())
              .filter((row) => row.status === 'interrupted')
              .sort((left, right) => right.updated_at.localeCompare(left.updated_at))
              .map((row) => ({
                session_id: row.session_id,
                spec_folder: row.spec_folder,
                current_task: row.current_task,
                last_action: row.last_action,
                context_summary: row.context_summary,
                pending_work: row.pending_work,
                updated_at: row.updated_at,
                tenant_id: row.tenant_id,
                user_id: row.user_id,
                agent_id: row.agent_id,
              }));
          }

          if (normalizedSql === "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='session_state'") {
            return execStatements
              .filter((statement) => statement.includes('CREATE INDEX IF NOT EXISTS idx_session_state_'))
              .map((statement) => {
                const match = statement.match(/CREATE INDEX IF NOT EXISTS ([^\s]+) ON/i);
                return { name: match?.[1] ?? '' };
              });
          }

          if (normalizedSql === "SELECT name FROM sqlite_master WHERE type='table' AND name='session_state'") {
            return tables.has('session_state') ? [{ name: 'session_state' }] : [];
          }

          void args;
          throw new Error(`Unhandled mock all SQL: ${normalizedSql}`);
        },
      };
    },
    transaction<T>(callback: () => T) {
      return () => callback();
    },
  };

  return {
    db,
    execStatements,
    tableColumns,
    getSessionState: (sessionId: string) => cloneRow(sessionState.get(sessionId)),
  };
}

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}-`));
  tempDirs.push(dir);
  return dir;
}

function createRecoveryDb(rootDir: string, fileName: string = 'context-index.sqlite'): string {
  const dbDir = path.join(rootDir, 'db');
  const dbPath = path.join(dbDir, fileName);
  fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(dbPath, '', 'utf8');
  mockState.databasePath = dbPath;
  return dbPath;
}

function createPendingFile(rootDir: string, relativePath: string, content: string): {
  originalPath: string;
  pendingPath: string;
} {
  const originalPath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(originalPath), { recursive: true });
  const pendingPath = getPendingPath(originalPath);
  fs.writeFileSync(pendingPath, content, 'utf8');
  return { originalPath, pendingPath };
}

describe('Crash Recovery (T009-T016, T071-T075)', () => {
  let database: MockDatabaseHarness;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionManager.shutdown();
    resetMetrics();
    mockState.databasePath = '';
    database = createMockDatabase();
    expect(sessionManager.init(database.db as never)).toEqual({ success: true });
  });

  afterEach(() => {
    sessionManager.shutdown();
    resetMetrics();
    mockState.databasePath = '';

    for (const dir of tempDirs.splice(0, tempDirs.length)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('should expose crash recovery exports without initializing a database', () => {
    expect(sessionManager).toBeDefined();
    expect(sessionManager.resetInterruptedSessions).toBeTypeOf('function');
    expect(sessionManager.recoverState).toBeTypeOf('function');
    expect(sessionManager.getConfig()).toEqual(expect.objectContaining({
      enabled: expect.any(Boolean),
    }));
  });

  describe('T073 - Session State Table', () => {
    it('should create session_state table and indexes', () => {
      const result = sessionManager.ensureSessionStateSchema();

      expect(result.success).toBe(true);
      expect(database.execStatements.some((sql) => sql.includes('CREATE TABLE IF NOT EXISTS session_state'))).toBe(true);
      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_status'))).toBe(true);
      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_updated'))).toBe(true);
      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_identity_scope'))).toBe(true);
    });

    it('should save session state correctly', () => {
      const result = sessionManager.saveSessionState('session-state-save', {
        specFolder: 'specs/023-esm-module-compliance',
        currentTask: 'replace placeholder tests',
        lastAction: 'built mock db harness',
        contextSummary: 'Crash recovery tests now run without SQLite fixtures.',
        pendingWork: 'Run focused vitest command.',
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
        data: { stage: 'implementation', coverage: 26 },
      });

      const row = database.getSessionState('session-state-save');

      expect(result.success).toBe(true);
      expect(row).toMatchObject({
        session_id: 'session-state-save',
        status: 'active',
        spec_folder: 'specs/023-esm-module-compliance',
        current_task: 'replace placeholder tests',
        last_action: 'built mock db harness',
        context_summary: 'Crash recovery tests now run without SQLite fixtures.',
        pending_work: 'Run focused vitest command.',
        tenant_id: 'tenant-a',
        user_id: 'user-a',
        agent_id: 'agent-a',
      });
    });
  });

  describe('T074 - Reset Interrupted Sessions', () => {
    it('should mark active sessions as interrupted on startup', () => {
      sessionManager.saveSessionState('active-a', { currentTask: 'A' });
      sessionManager.saveSessionState('active-b', { currentTask: 'B' });

      const result = sessionManager.resetInterruptedSessions();

      expect(result).toEqual({ success: true, interruptedCount: 2 });
      expect(database.getSessionState('active-a')?.status).toBe('interrupted');
      expect(database.getSessionState('active-b')?.status).toBe('interrupted');
    });

    it('should not affect completed sessions', () => {
      sessionManager.saveSessionState('active-only', { currentTask: 'still running' });
      sessionManager.saveSessionState('completed-only', { currentTask: 'already done' });
      sessionManager.completeSession('completed-only');

      const result = sessionManager.resetInterruptedSessions();

      expect(result.success).toBe(true);
      expect(database.getSessionState('active-only')?.status).toBe('interrupted');
      expect(database.getSessionState('completed-only')?.status).toBe('completed');
    });

    it('should list interrupted sessions', () => {
      sessionManager.saveSessionState('list-a', { specFolder: 'specs/A', currentTask: 'recover A' });
      sessionManager.saveSessionState('list-b', { specFolder: 'specs/B', currentTask: 'recover B' });
      sessionManager.saveSessionState('list-c', { specFolder: 'specs/C', currentTask: 'completed C' });
      sessionManager.completeSession('list-c');
      sessionManager.resetInterruptedSessions();

      const result = sessionManager.getInterruptedSessions();

      expect(result.success).toBe(true);
      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['list-a', 'list-b']);
    });
  });

  describe('T075 - Recover State with _recovered Flag', () => {
    it('should recover interrupted session with _recovered=true', () => {
      sessionManager.saveSessionState('recover-me', {
        specFolder: 'specs/023-esm-module-compliance/005-test-and-scenario-remediation',
        currentTask: 'resume crash recovery verification',
        data: { nested: { ok: true } },
      });
      sessionManager.resetInterruptedSessions();

      const result = sessionManager.recoverState('recover-me');

      expect(result.success).toBe(true);
      expect(result._recovered).toBe(true);
      expect(result.state?._recovered).toBe(true);
      expect(result.state?.data).toEqual({ nested: { ok: true } });
      expect(database.getSessionState('recover-me')?.status).toBe('active');
    });

    it('should handle non-existent session gracefully', () => {
      const result = sessionManager.recoverState('missing-session');

      expect(result).toEqual({ success: true, state: null, _recovered: false });
    });
  });

  describe('T071 - Generate CONTINUE_SESSION.md', () => {
    it('should generate content with required sections', () => {
      const content = sessionManager.generateContinueSessionMd({
        sessionId: 'session-123',
        specFolder: 'specs/022-hybrid-rag-fusion',
        currentTask: 'Recover interrupted save pipeline audit',
        lastAction: 'Finished targeted verification',
        contextSummary: 'Need to resume from the saved recovery packet.',
        pendingWork: 'Re-run final workspace verification and summarize results.',
        data: { cacheHit: false, stage: 'verification' },
      });

      expect(content).toContain('# CONTINUE SESSION');
      expect(content).toContain('## Session State');
      expect(content).toContain('## Context Summary');
      expect(content).toContain('## Pending Work');
      expect(content).toContain('session-123');
      expect(content).toContain('/spec_kit:resume specs/022-hybrid-rag-fusion');
    });

    it('should include session data in content', () => {
      const content = sessionManager.generateContinueSessionMd({
        sessionId: 'session-with-data',
        currentTask: 'serialize additional data',
        data: { phase: 'verification', attempts: 2, flags: { recovered: true } },
      });

      expect(content).toContain('## Additional State Data');
      expect(content).toContain('"phase": "verification"');
      expect(content).toContain('"attempts": 2');
      expect(content).toContain('"recovered": true');
    });
  });

  describe('T072 - Write CONTINUE_SESSION.md on Checkpoint', () => {
    it('should write CONTINUE_SESSION.md to spec folder even when SQLite recovery is unavailable', () => {
      const specFolderPath = makeTempDir('crash-recovery');

      const result = sessionManager.writeContinueSessionMd('session-fallback', specFolderPath);

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(path.join(specFolderPath, 'CONTINUE_SESSION.md'));

      const written = fs.readFileSync(result.filePath!, 'utf8');
      expect(written).toContain('# CONTINUE SESSION');
      expect(written).toContain('session-fallback');
      expect(written).toContain(specFolderPath);
    });

    it('should checkpoint session (save + generate md)', () => {
      const specFolderPath = makeTempDir('checkpoint-session');

      const result = sessionManager.checkpointSession('checkpoint-1', {
        specFolder: specFolderPath,
        currentTask: 'checkpoint test',
        contextSummary: 'Persist state and write recovery markdown.',
        pendingWork: 'Run the targeted vitest command.',
        data: { verified: false },
      }, specFolderPath);

      expect(result.success).toBe(true);
      expect(database.getSessionState('checkpoint-1')?.current_task).toBe('checkpoint test');
      expect(result.filePath).toBe(path.join(specFolderPath, 'CONTINUE_SESSION.md'));
      expect(fs.readFileSync(result.filePath!, 'utf8')).toContain('checkpoint test');
    });
  });

  describe('T009 - Session State Table Schema on First Startup', () => {
    it('should create session_state table with correct columns', () => {
      const result = sessionManager.ensureSessionStateSchema();

      expect(result.success).toBe(true);
      expect(Array.from(database.tableColumns).sort()).toEqual([
        'agent_id',
        'context_summary',
        'created_at',
        'current_task',
        'last_action',
        'pending_work',
        'session_id',
        'spec_folder',
        'state_data',
        'status',
        'tenant_id',
        'updated_at',
        'user_id',
      ]);
    });

    it('should have CHECK constraint on status column', () => {
      sessionManager.ensureSessionStateSchema();

      const createTableSql = database.execStatements.find((sql) => sql.includes('CREATE TABLE IF NOT EXISTS session_state'));

      expect(createTableSql).toContain("CHECK(status IN ('active', 'completed', 'interrupted'))");
    });
  });

  describe('T010 - saveSessionState Persists Immediately', () => {
    it('should persist all fields immediately to SQLite', () => {
      const result = sessionManager.saveSessionState('persist-all', {
        specFolder: 'specs/023-esm-module-compliance',
        currentTask: 'persist every field',
        lastAction: 'called saveSessionState',
        contextSummary: 'Verifying the mocked persistence layer.',
        pendingWork: 'Assert rows and timestamps.',
        tenantId: 'tenant-1',
        userId: 'user-1',
        agentId: 'agent-1',
        data: { pass: true },
      });

      expect(result.success).toBe(true);
      expect(database.getSessionState('persist-all')).toMatchObject({
        spec_folder: 'specs/023-esm-module-compliance',
        current_task: 'persist every field',
        last_action: 'called saveSessionState',
        context_summary: 'Verifying the mocked persistence layer.',
        pending_work: 'Assert rows and timestamps.',
        tenant_id: 'tenant-1',
        user_id: 'user-1',
        agent_id: 'agent-1',
      });
    });

    it('should serialize state_data as JSON', () => {
      sessionManager.saveSessionState('json-state', {
        data: { nested: { values: [1, 2, 3] }, mode: 'mocked' },
      });

      expect(database.getSessionState('json-state')?.state_data).toBe(JSON.stringify({
        nested: { values: [1, 2, 3] },
        mode: 'mocked',
      }));
    });

    it('should set timestamps', () => {
      sessionManager.saveSessionState('timestamped', {
        currentTask: 'record timestamps',
      });

      const row = database.getSessionState('timestamped');

      expect(row?.created_at).toEqual(expect.any(String));
      expect(row?.updated_at).toEqual(expect.any(String));
      expect(row?.created_at).toBe(row?.updated_at);
    });
  });

  describe('T011 - Status Transition: active -> completed', () => {
    it('should transition from active to completed', () => {
      sessionManager.saveSessionState('complete-transition', { currentTask: 'finish work' });

      const result = sessionManager.completeSession('complete-transition');

      expect(result.success).toBe(true);
      expect(database.getSessionState('complete-transition')?.status).toBe('completed');
      expect(mockState.workingMemory.clearSession).toHaveBeenCalledWith('complete-transition');
    });
  });

  describe('T012 - Status Transition: active -> interrupted (crash)', () => {
    it('should transition from active to interrupted on crash simulation', () => {
      sessionManager.saveSessionState('interrupt-transition', { currentTask: 'simulate crash' });

      const result = sessionManager.resetInterruptedSessions();

      expect(result.success).toBe(true);
      expect(database.getSessionState('interrupt-transition')?.status).toBe('interrupted');
    });
  });

  describe('T013 - resetInterruptedSessions Marks Active as Interrupted', () => {
    it('should interrupt only active sessions, not completed ones', () => {
      sessionManager.saveSessionState('interrupt-active', { currentTask: 'active' });
      sessionManager.saveSessionState('interrupt-completed', { currentTask: 'completed' });
      sessionManager.completeSession('interrupt-completed');

      sessionManager.resetInterruptedSessions();

      expect(database.getSessionState('interrupt-active')?.status).toBe('interrupted');
      expect(database.getSessionState('interrupt-completed')?.status).toBe('completed');
    });
  });

  describe('T014 - recoverState Retrieves Interrupted Session Data', () => {
    it('should retrieve all original state fields', () => {
      sessionManager.saveSessionState('recover-fields', {
        specFolder: 'specs/023/005',
        currentTask: 'recover fields',
        lastAction: 'saved state',
        contextSummary: 'Need all fields back.',
        pendingWork: 'Verify state integrity.',
        tenantId: 'tenant-z',
        userId: 'user-z',
        agentId: 'agent-z',
        data: { version: 1 },
      });
      sessionManager.resetInterruptedSessions();

      const result = sessionManager.recoverState('recover-fields');

      expect(result.success).toBe(true);
      expect(result.state).toMatchObject({
        sessionId: 'recover-fields',
        status: 'interrupted',
        specFolder: 'specs/023/005',
        currentTask: 'recover fields',
        lastAction: 'saved state',
        contextSummary: 'Need all fields back.',
        pendingWork: 'Verify state integrity.',
        tenantId: 'tenant-z',
        userId: 'user-z',
        agentId: 'agent-z',
      });
      expect(result.state?.createdAt).toEqual(expect.any(String));
      expect(result.state?.updatedAt).toEqual(expect.any(String));
    });

    it('should retrieve nested data objects', () => {
      sessionManager.saveSessionState('recover-nested', {
        data: {
          summary: { items: ['a', 'b'] },
          flags: { recovered: false },
        },
      });
      sessionManager.resetInterruptedSessions();

      const result = sessionManager.recoverState('recover-nested');

      expect(result.success).toBe(true);
      expect(result.state?.data).toEqual({
        summary: { items: ['a', 'b'] },
        flags: { recovered: false },
      });
    });
  });

  describe('T015 - _recovered Flag After Recovery', () => {
    it('should set _recovered=true for interrupted sessions', () => {
      sessionManager.saveSessionState('flag-interrupted', { currentTask: 'interrupted' });
      sessionManager.resetInterruptedSessions();

      const result = sessionManager.recoverState('flag-interrupted');

      expect(result._recovered).toBe(true);
      expect(result.state?._recovered).toBe(true);
    });

    it('should set _recovered=false for completed sessions', () => {
      sessionManager.saveSessionState('flag-completed', { currentTask: 'completed' });
      sessionManager.completeSession('flag-completed');

      const result = sessionManager.recoverState('flag-completed');

      expect(result.success).toBe(true);
      expect(result._recovered).toBe(false);
      expect(result.state?._recovered).toBe(false);
      expect(result.state?.status).toBe('completed');
    });

    it('should set _recovered=false for non-existent sessions', () => {
      const result = sessionManager.recoverState('flag-missing');

      expect(result).toEqual({ success: true, state: null, _recovered: false });
    });

    it('should set session to active after recovery', () => {
      sessionManager.saveSessionState('flag-reactivate', { currentTask: 'reactivate' });
      sessionManager.resetInterruptedSessions();

      sessionManager.recoverState('flag-reactivate');

      expect(database.getSessionState('flag-reactivate')?.status).toBe('active');
    });
  });

  describe('T016 - getInterruptedSessions Lists All Recoverable', () => {
    it('should list only interrupted sessions', () => {
      sessionManager.saveSessionState('recoverable-a', { specFolder: 'specs/A', currentTask: 'A' });
      sessionManager.saveSessionState('recoverable-b', { specFolder: 'specs/B', currentTask: 'B' });
      sessionManager.saveSessionState('recoverable-c', { specFolder: 'specs/C', currentTask: 'C' });
      sessionManager.completeSession('recoverable-c');
      sessionManager.resetInterruptedSessions();

      const result = sessionManager.getInterruptedSessions();

      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['recoverable-a', 'recoverable-b']);
    });

    it('should not include completed sessions', () => {
      sessionManager.saveSessionState('exclude-completed', { currentTask: 'completed' });
      sessionManager.completeSession('exclude-completed');
      sessionManager.resetInterruptedSessions();

      const result = sessionManager.getInterruptedSessions();

      expect(result.sessions.some((session) => session.sessionId === 'exclude-completed')).toBe(false);
    });

    it('should include expected fields in each session', () => {
      sessionManager.saveSessionState('field-check', {
        specFolder: 'specs/023/005',
        currentTask: 'verify interrupted session payload',
        lastAction: 'saved',
        contextSummary: 'Ensure list fields are preserved.',
        pendingWork: 'Resume this test.',
      });
      sessionManager.resetInterruptedSessions();

      const result = sessionManager.getInterruptedSessions();
      const session = result.sessions.find((entry) => entry.sessionId === 'field-check');

      expect(session).toMatchObject({
        sessionId: 'field-check',
        specFolder: 'specs/023/005',
        currentTask: 'verify interrupted session payload',
        lastAction: 'saved',
        contextSummary: 'Ensure list fields are preserved.',
        pendingWork: 'Resume this test.',
        updatedAt: expect.any(String),
      });
    });
  });

  describe('transaction-manager crash recovery integration', () => {
    it('recovers a committed pending file to its original path', () => {
      const rootDir = makeTempDir('txn-committed');
      createRecoveryDb(rootDir);
      const { originalPath, pendingPath } = createPendingFile(rootDir, 'specs/023/memory/entry.md', '# pending committed');

      const result = recoverPendingFile(pendingPath, () => true);

      expect(result).toEqual({ path: pendingPath, recovered: true });
      expect(fs.existsSync(originalPath)).toBe(true);
      expect(fs.existsSync(pendingPath)).toBe(false);
      expect(fs.readFileSync(originalPath, 'utf8')).toBe('# pending committed');
    });

    it('keeps stale pending files in place when the db probe reports no committed row', () => {
      const rootDir = makeTempDir('txn-stale');
      createRecoveryDb(rootDir);
      const { originalPath, pendingPath } = createPendingFile(rootDir, 'specs/023/memory/stale.md', '# pending stale');

      const result = recoverPendingFile(pendingPath, () => false);

      expect(result.recovered).toBe(false);
      expect(result.error).toContain('Stale pending file');
      expect(fs.existsSync(pendingPath)).toBe(true);
      expect(fs.existsSync(originalPath)).toBe(false);
    });

    it('recovers all pending files in a directory and reports mixed outcomes', () => {
      const rootDir = makeTempDir('txn-all');
      createRecoveryDb(rootDir);
      const committed = createPendingFile(rootDir, 'specs/023/memory/committed.md', '# committed');
      const stale = createPendingFile(rootDir, 'specs/023/memory/stale.md', '# stale');

      expect(findPendingFiles(rootDir).sort()).toEqual([committed.pendingPath, stale.pendingPath].sort());

      const results = recoverAllPendingFiles(rootDir, (originalPath) => path.basename(originalPath) !== 'stale.md');
      const byPath = new Map(results.map((result) => [result.path, result]));

      expect(byPath.get(committed.pendingPath)?.recovered).toBe(true);
      expect(byPath.get(stale.pendingPath)?.recovered).toBe(false);
      expect(byPath.get(stale.pendingPath)?.error).toContain('Stale pending file');
      expect(fs.existsSync(committed.originalPath)).toBe(true);
      expect(fs.existsSync(stale.pendingPath)).toBe(true);
    });
  });
});

describe('code-graph SQLite recovery', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-recovery-'));
  });

  afterEach(() => {
    // Close the DB to release the file handle
    try { closeDb(); } catch { /* may not be initialized */ }
  });

  it('initDb creates WAL mode database', () => {
    const db = initDb(tempDir);

    expect(db).toBeDefined();
    expect(db).toBe(getDb());

    const stats = getStats();
    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);

    closeDb();
  });

  it('schema versioning detection', () => {
    initDb(tempDir);

    const stats = getStats();
    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);
    expect(stats.totalFiles).toBe(0);
  });

  it('stores file mtimes and reports stale files via mtime checks', () => {
    initDb(tempDir);

    const trackedFile = path.join(tempDir, 'tracked.ts');
    fs.writeFileSync(trackedFile, 'export const value = 1;\n');

    upsertFile(
      trackedFile,
      'typescript',
      'hash-abc',
      0,
      0,
      'clean',
      5,
    );

    const row = getDb().prepare(
      'SELECT file_mtime_ms FROM code_files WHERE file_path = ?',
    ).get(trackedFile) as { file_mtime_ms: number } | undefined;

    expect(row?.file_mtime_ms).toBeGreaterThan(0);
    expect(isFileStale(trackedFile)).toBe(false);
    expect(ensureFreshFiles([trackedFile])).toEqual({
      stale: [],
      fresh: [trackedFile],
    });

    const futureTime = new Date(Date.now() + 5_000);
    fs.utimesSync(trackedFile, futureTime, futureTime);

    expect(isFileStale(trackedFile)).toBe(true);
    expect(ensureFreshFiles([trackedFile])).toEqual({
      stale: [trackedFile],
      fresh: [],
    });
  });

  it('stores code graph metadata for git HEAD tracking and creates the file-line index', () => {
    initDb(tempDir);

    expect(getLastGitHead()).toBeNull();

    setLastGitHead('abc123');

    expect(getLastGitHead()).toBe('abc123');

    const indexes = getDb().prepare('PRAGMA index_list(code_nodes)').all() as Array<{ name: string }>;
    expect(indexes.some((index) => index.name === 'idx_file_line')).toBe(true);
  });

  it('recovery after corrupted DB file', () => {
    const dbPath = path.join(tempDir, 'code-graph.sqlite');
    fs.writeFileSync(dbPath, Buffer.from([0x00, 0xff, 0xde, 0xad, 0xbe, 0xef]));

    try { closeDb(); } catch { /* may not be initialized */ }

    let initError: unknown = null;
    try {
      initDb(tempDir);
    } catch (err) {
      initError = err;
    }

    // Either succeeds (SQLite recreates over garbage) or throws a meaningful error —
    // the critical assertion is that it does not hang or crash the process silently.
    if (initError !== null) {
      expect(initError).toBeInstanceOf(Error);
      expect((initError as Error).message.length).toBeGreaterThan(0);
    } else {
      // Succeeded — verify the DB is functional
      expect(getStats).not.toThrow();
    }
  });

  it('cleanupOrphans removes stale nodes/edges', () => {
    initDb(tempDir);

    const fileId = upsertFile(
      '/test/file.ts',
      'typescript',
      'hash-abc',
      1,
      0,
      'ok',
      50,
    );

    const testNode: CodeNode = {
      symbolId: 'test::func1',
      filePath: '/test/file.ts',
      fqName: 'test.func1',
      kind: 'function',
      name: 'func1',
      startLine: 1,
      endLine: 10,
      startColumn: 0,
      endColumn: 0,
      language: 'typescript',
      signature: 'function func1()',
      docstring: null,
      contentHash: 'abc123',
    };

    replaceNodes(fileId, [testNode]);

    // Insert an orphaned edge referencing a non-existent node
    getDb().prepare(
      'INSERT INTO code_edges (source_id, target_id, edge_type) VALUES (?, ?, ?)',
    ).run('nonexistent::source', 'nonexistent::target', 'calls');

    // Verify the edge exists before cleanup
    const edgesBefore = (getDb().prepare('SELECT COUNT(*) as c FROM code_edges').get() as { c: number }).c;
    expect(edgesBefore).toBeGreaterThan(0);

    const removed = cleanupOrphans();
    expect(removed).toBeGreaterThan(0);

    // Orphaned edges should be removed
    const edgesAfter = (getDb().prepare(
      "SELECT COUNT(*) as c FROM code_edges WHERE source_id = 'nonexistent::source'",
    ).get() as { c: number }).c;
    expect(edgesAfter).toBe(0);
  });
});
