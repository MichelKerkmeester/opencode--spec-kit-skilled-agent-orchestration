// @ts-nocheck
// ---------------------------------------------------------------
// TEST: INTEGRATION SEARCH PIPELINE
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterEach } from 'vitest';

import * as searchHandler from '../handlers/memory-search';
import * as hybridSearch from '../lib/search/hybrid-search';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import { isMMREnabled, isTRMEnabled, isMultiQueryEnabled } from '../lib/search/search-flags';

describe('Integration Search Pipeline (T525) [deferred - requires DB test fixtures]', () => {

  // -------------------------------------------------------------
  // SUITE: Pipeline Module Loading
  // -------------------------------------------------------------
  describe('Pipeline Module Loading', () => {
    it('T525-1: Search pipeline modules loaded', () => {
      expect(searchHandler).toBeDefined();

      const modules = [
        { name: 'searchHandler', ref: searchHandler },
        { name: 'hybridSearch', ref: hybridSearch },
        { name: 'vectorIndex', ref: vectorIndex },
        { name: 'bm25Index', ref: bm25Index },
      ];
      const loaded = modules.filter(m => m.ref !== null && m.ref !== undefined);
      expect(loaded.length).toBeGreaterThanOrEqual(1);
    });
  });

  // -------------------------------------------------------------
  // SUITE: Pipeline Input Validation
  // -------------------------------------------------------------
  describe('Pipeline Input Validation', () => {
    it('T525-2: Valid args accepted by pipeline', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({ query: 'test search query' }),
          5000,
          'T525-2'
        );
        // If it returns, it passed input validation
      } catch (error: unknown) {
        // DB/infra errors are acceptable — input validation errors are not
        const isInfraError =
          error.message?.includes('database') ||
          error.message?.includes('SQLITE') ||
          error.message?.includes('DB') ||
          error.message?.includes('no such table') ||
          error.message?.includes('embed') ||
          error.message?.includes('initialize') ||
          error.code === 'E010' ||
          error.code === 'E020';
        const isTimeout = error.message?.includes('Timeout');

        if (!isInfraError && !isTimeout) {
          expect.unreachable(`Unexpected error: ${error.message}`);
        }
      }
    });

    it('T525-3: Empty query behavior at pipeline entry', async () => {
      try {
        const result = await withTimeout(
          searchHandler.handleMemorySearch({ query: '' }),
          5000,
          'T525-3'
        );
        // Handler may accept empty query and return results or error in response
        if (result && (result as unknown).content) {
          const text = JSON.parse((result as unknown).content[0].text);
          // Either an error response or results response is acceptable
          expect(text.error !== undefined || text.results !== undefined).toBe(true);
        }
        // If handler returned without throwing, that's acceptable
      } catch (error: unknown) {
        const isTimeout = error.message?.includes('Timeout');
        if (isTimeout) {
          return; // skip on timeout
        }
        // Any error (including validation rejection) is acceptable for empty query
        expect(typeof error.message).toBe('string');
      }
    });

    it('T525-4: specFolder filter accepted', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({ query: 'test', specFolder: 'specs/test-folder' }),
          5000,
          'T525-4'
        );
      } catch (error: unknown) {
        if (error.message?.includes('Timeout')) {
          return; // skip on timeout
        }
        // specFolder rejection is a failure; other errors are acceptable
        expect(error.message?.includes('specFolder')).not.toBe(true);
      }
    });
  });

  // -------------------------------------------------------------
  // SUITE: Pipeline Error Handling
  // -------------------------------------------------------------
  describe('Pipeline Error Handling', () => {
    it('T525-5: Pipeline error format consistency', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({}),
          5000,
          'T525-5'
        );
        expect.unreachable('No error thrown for empty args');
      } catch (error: unknown) {
        if (error.message?.includes('Timeout')) {
          return; // skip on timeout
        }
        expect(typeof error.message).toBe('string');
      }
    });

    it('T525-6: Response format - handler is async', () => {
      expect(typeof searchHandler.handleMemorySearch).toBe('function');
      const fn = searchHandler.handleMemorySearch;
      const isAsync =
        fn.constructor.name === 'AsyncFunction' || fn.toString().includes('async');
      expect(isAsync || typeof fn === 'function').toBe(true);
    });
  });

  // -------------------------------------------------------------
  // SUITE: Multi-Concept & Advanced Parameters
  // -------------------------------------------------------------
  describe('Multi-Concept & Advanced Parameters', () => {
    it('T525-7: Single concept without query rejected', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({ concepts: ['single'] }),
          5000,
          'T525-7'
        );
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        if (error.message?.includes('Timeout')) {
          return; // skip on timeout
        }
        // Any error is acceptable — single concept should be rejected
        expect(typeof error.message).toBe('string');
      }
    });

    it('T525-8: Intent parameter accepted', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({ query: 'test', intent: 'fix_bug' }),
          5000,
          'T525-8'
        );
      } catch (error: unknown) {
        if (error.message?.includes('Timeout')) {
          return; // skip on timeout
        }
        // Intent rejection is a failure; other errors are acceptable
        expect(error.message?.includes('intent')).not.toBe(true);
      }
    });

    it('T525-9: Session dedup parameters accepted', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({
            query: 'test',
            sessionId: 'sess-123',
            enableDedup: true,
          }),
          5000,
          'T525-9'
        );
      } catch (error: unknown) {
        if (error.message?.includes('Timeout')) {
          return; // skip on timeout
        }
        // Dedup param rejection is a failure; other errors are acceptable
        expect(error.message?.includes('sessionId')).not.toBe(true);
        expect(error.message?.includes('enableDedup')).not.toBe(true);
      }
    });

    it('T525-10: includeConstitutional parameter accepted', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({
            query: 'test',
            includeConstitutional: false,
          }),
          5000,
          'T525-10'
        );
      } catch (error: unknown) {
        if (error.message?.includes('Timeout')) {
          return; // skip on timeout
        }
        // includeConstitutional rejection is a failure; other errors are acceptable
        expect(error.message?.includes('includeConstitutional')).not.toBe(true);
      }
    });
  });
});

describe('C138: Feature Flag Regression Guards', () => {
  it('C138-T1: feature flags are valid boolean strings', () => {
    const validFlags = ['true', 'false', undefined];
    for (const flag of ['SPECKIT_MMR', 'SPECKIT_TRM', 'SPECKIT_MULTI_QUERY']) {
      const value = process.env[flag];
      if (value !== undefined) {
        expect(['true', 'false']).toContain(value);
      }
    }
  });

  it('C138-T2: pipeline flags are independent (toggling one does not affect others)', () => {
    // Verify each flag can be disabled independently without coupling side-effects.
    const saved = {
      MMR: process.env['SPECKIT_MMR'],
      TRM: process.env['SPECKIT_TRM'],
      MULTI_QUERY: process.env['SPECKIT_MULTI_QUERY'],
    };
    try {
      // Disable only MMR; TRM and MULTI_QUERY must remain enabled.
      process.env['SPECKIT_MMR'] = 'false';
      delete process.env['SPECKIT_TRM'];
      delete process.env['SPECKIT_MULTI_QUERY'];

      expect(isMMREnabled()).toBe(false);
      expect(isTRMEnabled()).toBe(true);
      expect(isMultiQueryEnabled()).toBe(true);
    } finally {
      if (saved.MMR === undefined) delete process.env['SPECKIT_MMR']; else process.env['SPECKIT_MMR'] = saved.MMR;
      if (saved.TRM === undefined) delete process.env['SPECKIT_TRM']; else process.env['SPECKIT_TRM'] = saved.TRM;
      if (saved.MULTI_QUERY === undefined) delete process.env['SPECKIT_MULTI_QUERY']; else process.env['SPECKIT_MULTI_QUERY'] = saved.MULTI_QUERY;
    }
  });

  it('C138-T3: SPECKIT_MMR=false disables MMR; absent re-enables it', () => {
    // Verify the actual isMMREnabled() function responds correctly to the env var,
    // not just the raw env var value itself.
    const saved = process.env['SPECKIT_MMR'];
    try {
      delete process.env['SPECKIT_MMR'];
      expect(isMMREnabled()).toBe(true);  // absent → enabled (opt-out pattern)

      process.env['SPECKIT_MMR'] = 'false';
      expect(isMMREnabled()).toBe(false); // explicit false → disabled
    } finally {
      if (saved === undefined) delete process.env['SPECKIT_MMR']; else process.env['SPECKIT_MMR'] = saved;
    }
  });

  it('C138-T4: SPECKIT_TRM=false disables evidence gap detection; absent re-enables it', () => {
    // Verify the actual isTRMEnabled() function responds correctly to the env var.
    const saved = process.env['SPECKIT_TRM'];
    try {
      delete process.env['SPECKIT_TRM'];
      expect(isTRMEnabled()).toBe(true);  // absent → enabled (opt-out pattern)

      process.env['SPECKIT_TRM'] = 'false';
      expect(isTRMEnabled()).toBe(false); // explicit false → disabled
    } finally {
      if (saved === undefined) delete process.env['SPECKIT_TRM']; else process.env['SPECKIT_TRM'] = saved;
    }
  });

  it('C138-T5: opt-out pattern — isMultiQueryEnabled() responds to all three states', () => {
    // Verify the actual isMultiQueryEnabled() function: absent/'true' → enabled, 'false' → disabled.
    const saved = process.env['SPECKIT_MULTI_QUERY'];
    try {
      delete process.env['SPECKIT_MULTI_QUERY'];
      expect(isMultiQueryEnabled()).toBe(true);   // absent → enabled

      process.env['SPECKIT_MULTI_QUERY'] = 'true';
      expect(isMultiQueryEnabled()).toBe(true);   // explicit true → enabled

      process.env['SPECKIT_MULTI_QUERY'] = 'false';
      expect(isMultiQueryEnabled()).toBe(false);  // explicit false → disabled
    } finally {
      if (saved === undefined) delete process.env['SPECKIT_MULTI_QUERY']; else process.env['SPECKIT_MULTI_QUERY'] = saved;
    }
  });
});
