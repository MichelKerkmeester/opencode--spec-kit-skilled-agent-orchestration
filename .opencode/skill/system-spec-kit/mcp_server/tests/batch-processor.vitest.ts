// TEST: BATCH PROCESSOR
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  processBatches,
  processWithRetry,
  processSequentially,
  BATCH_SIZE,
  BATCH_DELAY_MS,
  DEFAULT_RETRY_OPTIONS,
  MAX_BATCH_SIZE,
} from '../utils/batch-processor';

type RetryFailure = {
  retries_failed: boolean;
  error?: unknown;
  item?: unknown;
  errorDetail?: string;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Batch Processor', () => {
  /* ═══════════════════════════════════════════════════════════
     1. Module Exports
  ════════════════════════════════════════════════════════════ */

  describe('1. Module Exports', () => {
    it('T01: processBatches exported as function', () => {
      expect(typeof processBatches).toBe('function');
    });

    it('T02: processWithRetry exported as function', () => {
      expect(typeof processWithRetry).toBe('function');
    });

    it('T03: processSequentially exported as function', () => {
      expect(typeof processSequentially).toBe('function');
    });

    it('T04: BATCH_SIZE exported as number', () => {
      expect(typeof BATCH_SIZE).toBe('number');
    });

    it('T05: BATCH_DELAY_MS exported as number', () => {
      expect(typeof BATCH_DELAY_MS).toBe('number');
    });

    it('T06: DEFAULT_RETRY_OPTIONS exported with maxRetries and retryDelay', () => {
      expect(typeof DEFAULT_RETRY_OPTIONS).toBe('object');
      expect(typeof DEFAULT_RETRY_OPTIONS.maxRetries).toBe('number');
      expect(typeof DEFAULT_RETRY_OPTIONS.retryDelay).toBe('number');
    });

    it('T06b: MAX_BATCH_SIZE exported as number', () => {
      expect(typeof MAX_BATCH_SIZE).toBe('number');
      expect(MAX_BATCH_SIZE).toBeGreaterThan(0);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     2. Batch Size Validation (P0-08)
  ════════════════════════════════════════════════════════════ */

  describe('2. batchSize Validation (P0-08)', () => {
    it('T07: batchSize=0 throws Error with descriptive message', async () => {
      await expect(
        processBatches([1, 2, 3], async (x: number) => x, 0)
      ).rejects.toThrow('positive integer');
    });

    it('T08: batchSize=-1 throws Error', async () => {
      await expect(
        processBatches([1], async (x: number) => x, -1)
      ).rejects.toThrow();
    });

    it('T09: batchSize=-100 throws Error', async () => {
      await expect(
        processBatches([1], async (x: number) => x, -100)
      ).rejects.toThrow();
    });

    it('T10: batchSize=0 throws even with empty items array', async () => {
      await expect(
        processBatches<number, number>([], async (x: number) => x, 0)
      ).rejects.toThrow();
    });

    it('T11: batchSize=1 is valid (smallest positive integer)', async () => {
      const results = await processBatches([42], async (x: number) => x * 2, 1, 0);
      expect(results.length).toBe(1);
      expect(results[0]).toBe(84);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     3. Normal Operation (processBatches)
  ════════════════════════════════════════════════════════════ */

  describe('3. Normal Operation (processBatches)', () => {
    it('T12: batchSize=1 processes items one at a time', async () => {
      const order: number[] = [];
      const items = [10, 20, 30];
      const results = await processBatches(
        items,
        async (x: number) => { order.push(x); return x + 1; },
        1, 0
      );
      expect(results).toEqual([11, 21, 31]);
      expect(order).toEqual([10, 20, 30]);
    });

    it('T13: batchSize=5 with 12 items processes in 3 batches', async () => {
      let batchCount = 0;
      const spy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
        const msg = args.join(' ');
        if (msg.includes('[batch-processor] Processing batch')) batchCount++;
      });

      const items = Array.from({ length: 12 }, (_, i) => i);
      const results = await processBatches(
        items,
        async (x: number) => x * 10,
        5, 0
      );

      expect(results.length).toBe(12);
      expect(batchCount).toBe(3);
      expect(results[0]).toBe(0);
      expect(results[11]).toBe(110);
    });

    it('T14: Empty items array returns empty results', async () => {
      const results = await processBatches<number, number>([], async (x: number) => x, 5, 0);
      expect(results).toEqual([]);
    });

    it('T15: Results preserve input order', async () => {
      const items = [3, 1, 4, 1, 5, 9, 2, 6];
      const results = await processBatches(
        items,
        async (x: number) => x * 100,
        3, 0
      );
      expect(results).toEqual([300, 100, 400, 100, 500, 900, 200, 600]);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     4. Callback / Processor Behavior
  ════════════════════════════════════════════════════════════ */

  describe('4. Callback / Processor Behavior', () => {
    it('T16: processFn called for each item exactly once', async () => {
      const seen: string[] = [];
      const items = ['a', 'b', 'c', 'd'];
      await processBatches(
        items,
        async (x: string) => { seen.push(x); return x.toUpperCase(); },
        2, 0
      );
      expect(seen.sort()).toEqual(['a', 'b', 'c', 'd']);
    });

    it('T17: Error in processFn returns RetryErrorResult', async () => {
      const items = [1, 2, 3];
      const results = await processBatches(
        items,
        async (x: number) => {
          if (x === 2) throw new Error('deliberate non-transient failure');
          return x;
        },
        3, 0,
        { maxRetries: 0 }
      );
      expect(results.length).toBe(3);
      expect(results[0]).toBe(1);
      expect(results[2]).toBe(3);
      const errResult = results[1] as RetryFailure;
      expect(errResult.retries_failed).toBe(true);
      expect(errResult.error).toBeTruthy();
      expect(errResult.item).toBe(2);
    });

    it('T18: Async processor results are properly awaited', async () => {
      const results = await processBatches(
        [10, 20],
        async (x: number) => {
          await new Promise<void>(r => setTimeout(r, 10));
          return x + 5;
        },
        2, 0
      );
      expect(results).toEqual([15, 25]);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     5. Edge Cases (processBatches)
  ════════════════════════════════════════════════════════════ */

  describe('5. Edge Cases (processBatches)', () => {
    it('T19: Single item processed correctly', async () => {
      const results = await processBatches(['only'], async (x: string) => x.length, 5, 0);
      expect(results).toEqual([4]);
    });

    it('T20: batchSize larger than items count processes in 1 batch', async () => {
      let batchCount = 0;
      const spy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
        const msg = args.join(' ');
        if (msg.includes('[batch-processor] Processing batch')) batchCount++;
      });

      const results = await processBatches([1, 2, 3], async (x: number) => x, 100, 0);

      expect(results).toEqual([1, 2, 3]);
      expect(batchCount).toBe(1);
    });

    it('T21: Very large batchSize (10000) with small array works', async () => {
      const results = await processBatches([42], async (x: number) => x, 10000, 0);
      expect(results).toEqual([42]);
    });

    it('T21b: overly large batchSize is clamped before running concurrent work', async () => {
      const batchLogs: string[] = [];
      vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
        const message = args.join(' ');
        if (message.includes('[batch-processor] Processing batch')) {
          batchLogs.push(message);
        }
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const items = Array.from({ length: MAX_BATCH_SIZE * 2 + 1 }, (_, index) => index);
      const results = await processBatches(items, async (x: number) => x, MAX_BATCH_SIZE * 10, 0);

      expect(results).toHaveLength(items.length);
      expect(batchLogs).toHaveLength(3);
      expect(warnSpy).toHaveBeenCalledWith(
        `[batch-processor] Clamped batch size ${MAX_BATCH_SIZE * 10} to ${MAX_BATCH_SIZE} to avoid unbounded concurrency`,
      );
    });

    it('T22: Exact batch boundary (6 items / batchSize 3 = 2 batches)', async () => {
      let batchCount = 0;
      const spy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
        const msg = args.join(' ');
        if (msg.includes('[batch-processor] Processing batch')) batchCount++;
      });

      const results = await processBatches([1, 2, 3, 4, 5, 6], async (x: number) => x, 3, 0);

      expect(results.length).toBe(6);
      expect(batchCount).toBe(2);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     6. processWithRetry
  ════════════════════════════════════════════════════════════ */

  describe('6. processWithRetry', () => {
    it('T23: processWithRetry returns result on success', async () => {
      const result = await processWithRetry(5, async (x: number) => x * 3);
      expect(result).toBe(15);
    });

    it('T24: Non-transient error returns RetryErrorResult without retry', async () => {
      const result = await processWithRetry(
        'test',
        async () => { throw new Error('permanent failure'); },
        { maxRetries: 2, retryDelay: 1 }
      ) as RetryFailure;
      expect(result.retries_failed).toBe(true);
      expect(result.error).toBeTruthy();
      expect(result.item).toBe('test');
    });

    it('T25: maxRetries=0 means single attempt', async () => {
      let attempts = 0;
      const result = await processWithRetry(
        'val',
        async () => { attempts++; throw new Error('SQLITE_BUSY transient'); },
        { maxRetries: 0, retryDelay: 1 }
      ) as RetryFailure;
      expect(attempts).toBe(1);
      expect(result.retries_failed).toBe(true);
    });

    it('T26: DEFAULT_RETRY_OPTIONS has maxRetries=2, retryDelay=1000', () => {
      expect(DEFAULT_RETRY_OPTIONS.maxRetries).toBe(2);
      expect(DEFAULT_RETRY_OPTIONS.retryDelay).toBe(1000);
    });

    it('T26a: invalid maxRetries falls back to default without crashing', async () => {
      let attempts = 0;
      const result = await processWithRetry(
        'retry',
        async () => {
          attempts++;
          throw new Error('SQLITE_BUSY transient');
        },
        { maxRetries: -5, retryDelay: 0 }
      ) as RetryFailure;
      expect(attempts).toBe(DEFAULT_RETRY_OPTIONS.maxRetries + 1);
      expect(result.retries_failed).toBe(true);
    });

    it('T26b: invalid retryDelay falls back to default and still completes', async () => {
      const result = await processWithRetry(
        1,
        async () => {
          throw new Error('permanent failure');
        },
        { maxRetries: 0, retryDelay: Number.NaN }
      ) as RetryFailure;
      expect(result.retries_failed).toBe(true);
      expect(result.errorDetail).toContain('permanent failure');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     7. processSequentially
  ════════════════════════════════════════════════════════════ */

  describe('7. processSequentially', () => {
    it('T27: processSequentially processes items in strict order', async () => {
      const order: number[] = [];
      const items = [1, 2, 3, 4, 5];
      const results = await processSequentially(
        items,
        async (x: number) => {
          order.push(x);
          return x * 2;
        }
      );
      expect(order).toEqual([1, 2, 3, 4, 5]);
      expect(results).toEqual([2, 4, 6, 8, 10]);
    });

    it('T28: processSequentially with empty array returns []', async () => {
      const results = await processSequentially<number, number>([], async (x: number) => x);
      expect(results).toEqual([]);
    });

    it('T29: processSequentially error in one item does not stop others', async () => {
      const items = [1, 2, 3];
      const results = await processSequentially(
        items,
        async (x: number) => {
          if (x === 2) throw new Error('fail item 2');
          return x;
        },
        { maxRetries: 0 }
      );
      expect(results.length).toBe(3);
      expect(results[0]).toBe(1);
      expect((results[1] as RetryFailure).retries_failed).toBe(true);
      expect(results[2]).toBe(3);
    });

    it('T30: processSequentially with single item', async () => {
      const results = await processSequentially([99], async (x: number) => x + 1);
      expect(results).toEqual([100]);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     8. Delay Behavior
  ════════════════════════════════════════════════════════════ */

  describe('8. Delay Behavior', () => {
    it('T31: delayMs=0 does not add delay between batches', async () => {
      const start = Date.now();
      await processBatches([1, 2, 3, 4], async (x: number) => x, 2, 0);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(200);
    });

    it('T32: No delay after last batch (single batch case)', async () => {
      const start = Date.now();
      await processBatches([1, 2], async (x: number) => x, 2, 500);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(200);
    });
  });
});
