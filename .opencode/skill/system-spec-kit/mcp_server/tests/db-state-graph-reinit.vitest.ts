// TEST: DB State Graph Reinit
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, expect, it, vi } from 'vitest';
import { checkDatabaseUpdated, init, reinitializeDatabase } from '../core/db-state';
import type { DatabaseLike } from '../core/db-state';

function createPopulatedFakeDb(memoryCount = 2): DatabaseLike {
  return {
    prepare: vi.fn((sql: string) => {
      if (sql.includes('COUNT(*) as cnt FROM memory_index')) {
        return { get: vi.fn(() => ({ cnt: memoryCount })) };
      }
      if (sql.includes('PRAGMA database_list')) {
        return { all: vi.fn(() => [{ name: 'main', file: '/tmp/context-index.sqlite' }]) };
      }
      return {
        get: vi.fn(() => ({})),
        all: vi.fn(() => []),
      };
    }),
  } as unknown as DatabaseLike;
}

describe('db-state graph search wiring', () => {
  it('reuses configured graphSearchFn during database reinitialization', async () => {
    const fakeDb = createPopulatedFakeDb();
    const fakeGraphFn = vi.fn();

    const vectorIndex = {
      initializeDb: vi.fn(),
      getDb: vi.fn(() => fakeDb),
      closeDb: vi.fn(),
      vectorSearch: vi.fn(),
    };

    const checkpoints = { init: vi.fn() };
    const accessTracker = { init: vi.fn() };
    const hybridSearch = { init: vi.fn() };
    const sessionManager = { init: vi.fn(() => ({ success: true })) };
    const incrementalIndex = { init: vi.fn() };

    init({
      vectorIndex,
      checkpoints,
      accessTracker,
      hybridSearch,
      sessionManager,
      incrementalIndex,
      graphSearchFn: fakeGraphFn,
    });

    await reinitializeDatabase();

    expect(vectorIndex.closeDb).toHaveBeenCalled();
    expect(vectorIndex.initializeDb).toHaveBeenCalled();
    expect(hybridSearch.init).toHaveBeenCalledWith(fakeDb, vectorIndex.vectorSearch, fakeGraphFn);
  });

  it('preserves lastDbCheck when rebinding does not complete', async () => {
    const tempDbDir = fs.mkdtempSync(path.join(os.tmpdir(), 'db-state-rebind-'));
    const markerTimestamp = Number.MAX_SAFE_INTEGER - 2048;
    fs.writeFileSync(path.join(tempDbDir, '.db-updated'), String(markerTimestamp), 'utf8');
    const originalDbDir = process.env.SPEC_KIT_DB_DIR;

    try {
      process.env.SPEC_KIT_DB_DIR = tempDbDir;
      const fakeDb = createPopulatedFakeDb();
      let dbAvailable = false;

      const vectorIndex = {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => (dbAvailable ? fakeDb : null)),
        closeDb: vi.fn(),
        vectorSearch: vi.fn(),
      };
      const checkpoints = { init: vi.fn() };
      const accessTracker = { init: vi.fn() };
      const hybridSearch = { init: vi.fn() };
      const sessionManager = { init: vi.fn(() => ({ success: true })) };
      const incrementalIndex = { init: vi.fn() };

      init({
        vectorIndex,
        checkpoints,
        accessTracker,
        hybridSearch,
        sessionManager,
        incrementalIndex,
      });

      const firstAttempt = await checkDatabaseUpdated();
      expect(firstAttempt).toBe(false);

      dbAvailable = true;
      const secondAttempt = await checkDatabaseUpdated();
      expect(secondAttempt).toBe(true);
      expect(vectorIndex.initializeDb).toHaveBeenCalledTimes(2);
    } finally {
      if (originalDbDir === undefined) {
        delete process.env.SPEC_KIT_DB_DIR;
      } else {
        process.env.SPEC_KIT_DB_DIR = originalDbDir;
      }
      fs.rmSync(tempDbDir, { recursive: true, force: true });
    }
  });

  it('returns false when session manager rebind fails', async () => {
    const fakeDb = createPopulatedFakeDb();
    const vectorIndex = {
      initializeDb: vi.fn(),
      getDb: vi.fn(() => fakeDb),
      closeDb: vi.fn(),
      vectorSearch: vi.fn(),
    };
    const checkpoints = { init: vi.fn() };
    const accessTracker = { init: vi.fn() };
    const hybridSearch = { init: vi.fn() };
    const sessionManager = { init: vi.fn(() => ({ success: false, error: 'session-db-init-failed' })) };
    const incrementalIndex = { init: vi.fn() };

    init({
      vectorIndex,
      checkpoints,
      accessTracker,
      hybridSearch,
      sessionManager,
      incrementalIndex,
    });

    const result = await reinitializeDatabase();
    expect(result).toBe(false);
    expect(sessionManager.init).toHaveBeenCalledTimes(1);
  });

  it('rebinds all registered database consumers when the vector index swaps connections directly', () => {
    const originalDb = { name: 'original-db' } as unknown as DatabaseLike;
    const reboundDb = { name: 'rebound-db' } as unknown as DatabaseLike;
    let connectionListener: ((database: DatabaseLike) => void) | null = null;

    const vectorIndex = {
      initializeDb: vi.fn(),
      getDb: vi.fn(() => originalDb),
      closeDb: vi.fn(),
      vectorSearch: vi.fn(),
      onDatabaseConnectionChange: vi.fn((listener: (database: DatabaseLike) => void) => {
        connectionListener = listener;
        return () => {
          connectionListener = null;
        };
      }),
    };

    const checkpoints = { init: vi.fn() };
    const accessTracker = { init: vi.fn() };
    const hybridSearch = { init: vi.fn() };
    const sessionManager = { init: vi.fn(() => ({ success: true })) };
    const incrementalIndex = { init: vi.fn() };
    const extraConsumer = { init: vi.fn() };

    init({
      vectorIndex,
      checkpoints,
      accessTracker,
      hybridSearch,
      sessionManager,
      incrementalIndex,
      graphSearchFn: null,
      dbConsumers: [extraConsumer],
    });

    expect(vectorIndex.onDatabaseConnectionChange).toHaveBeenCalledTimes(1);
    expect(connectionListener).not.toBeNull();

    connectionListener?.(reboundDb);

    expect(checkpoints.init).toHaveBeenCalledWith(reboundDb);
    expect(accessTracker.init).toHaveBeenCalledWith(reboundDb);
    expect(hybridSearch.init).toHaveBeenCalledWith(reboundDb, vectorIndex.vectorSearch, null);
    expect(sessionManager.init).toHaveBeenCalledWith(reboundDb);
    expect(incrementalIndex.init).toHaveBeenCalledWith(reboundDb);
    expect(extraConsumer.init).toHaveBeenCalledWith(reboundDb);
  });

  it('logs when a direct vector-index rebind listener returns false', () => {
    const originalDb = { name: 'original-db' } as unknown as DatabaseLike;
    const reboundDb = { name: 'rebound-db' } as unknown as DatabaseLike;
    let connectionListener: ((database: DatabaseLike) => void) | null = null;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const vectorIndex = {
      initializeDb: vi.fn(),
      getDb: vi.fn(() => originalDb),
      closeDb: vi.fn(),
      vectorSearch: vi.fn(),
      onDatabaseConnectionChange: vi.fn((listener: (database: DatabaseLike) => void) => {
        connectionListener = listener;
        return () => {
          connectionListener = null;
        };
      }),
    };

    init({
      vectorIndex,
      checkpoints: { init: vi.fn() },
      accessTracker: { init: vi.fn() },
      hybridSearch: { init: vi.fn() },
      sessionManager: { init: vi.fn(() => ({ success: false, error: 'listener-session-init-failed' })) },
      incrementalIndex: { init: vi.fn() },
    });

    connectionListener?.(reboundDb);

    expect(errorSpy).toHaveBeenCalledWith('[db-state] Session manager rebind failed: listener-session-init-failed');
    expect(errorSpy).toHaveBeenCalledWith('[db-state] Database consumer listener rebind returned false');
    errorSpy.mockRestore();
  });
});
