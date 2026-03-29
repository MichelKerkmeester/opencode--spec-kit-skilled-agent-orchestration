import BetterSqlite3 from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { acquireIndexScanLease, completeIndexScanLease, init } from '../core/db-state';
import type { DatabaseLike } from '../core/db-state';

describe('db-state', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
  });

  it('acquires scan lease once and rejects a concurrent fresh lease', async () => {
    const db = new BetterSqlite3(':memory:');

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const now = Date.now();
    const first = await acquireIndexScanLease({ now, cooldownMs: 60000, leaseExpiryMs: 120000 });
    const second = await acquireIndexScanLease({ now: now + 1000, cooldownMs: 60000, leaseExpiryMs: 120000 });

    expect(first.acquired).toBe(true);
    expect(second.acquired).toBe(false);
    expect(second.reason).toBe('lease_active');
    expect(second.waitSeconds).toBeGreaterThan(0);

    db.close();
  });

  it('expires stale scan lease and allows a fresh reservation', async () => {
    const db = new BetterSqlite3(':memory:');
    db.exec('CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT)');
    const staleStartedAt = Date.now() - 300000;
    db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run('scan_started_at', String(staleStartedAt));

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const now = Date.now();
    const lease = await acquireIndexScanLease({ now, cooldownMs: 60000, leaseExpiryMs: 120000 });

    expect(lease.acquired).toBe(true);
    const startedRow = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at') as { value: string };
    expect(Number.parseInt(startedRow.value, 10)).toBe(now);

    db.close();
  });

  it('completes lease by moving scan_started_at to last_index_scan', async () => {
    const db = new BetterSqlite3(':memory:');
    db.exec('CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT)');
    const startedAt = Date.now();
    db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run('scan_started_at', String(startedAt));

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const completedAt = startedAt + 2000;
    await completeIndexScanLease(completedAt);

    const lastScan = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan') as { value: string };
    const activeLease = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at') as { value: string } | undefined;

    expect(Number.parseInt(lastScan.value, 10)).toBe(completedAt);
    expect(activeLease).toBeUndefined();

    db.close();
  });
});
