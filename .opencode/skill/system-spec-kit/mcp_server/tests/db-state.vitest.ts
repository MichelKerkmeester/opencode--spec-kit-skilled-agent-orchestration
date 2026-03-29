import { afterEach, describe, expect, it, vi } from 'vitest';
import { init } from '../core/db-state';
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
});
