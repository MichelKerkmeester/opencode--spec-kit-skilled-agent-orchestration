// ---------------------------------------------------------------
// TEST: DB State Graph Reinit
// ---------------------------------------------------------------

import { describe, expect, it, vi } from 'vitest';
import { init, reinitializeDatabase } from '../core/db-state';
import type { DatabaseLike } from '../core/db-state';

describe('db-state graph search wiring', () => {
  it('reuses configured graphSearchFn during database reinitialization', async () => {
    const fakeDb = {} as unknown as DatabaseLike;
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
});
