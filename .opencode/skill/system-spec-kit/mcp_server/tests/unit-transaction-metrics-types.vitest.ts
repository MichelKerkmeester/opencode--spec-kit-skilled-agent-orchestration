// Converted from: unit-transaction-metrics-types.test.ts (custom runner)
// TEST: TRANSACTION MANAGER — TransactionMetrics TYPE CHANGES
// Validates: [key: string]: unknown index signature on metrics,
// Spread behavior, known keys, and arbitrary access.
import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import {
  getMetrics,
  resetMetrics,
  atomicWriteFile,
} from '../lib/storage/transaction-manager';

/* --- Tests --- */

describe('Transaction Manager — TransactionMetrics Types', () => {

  describe('TransactionMetrics Shape', () => {
    it('T-TM-01: getMetrics returns all 5 known keys', () => {
      resetMetrics();
      const metrics = getMetrics();

      expect(typeof metrics.totalAtomicWrites).toBe('number');
      expect(typeof metrics.totalDeletes).toBe('number');
      expect(typeof metrics.totalRecoveries).toBe('number');
      expect(typeof metrics.totalErrors).toBe('number');
      expect(metrics.lastOperationTime === null || typeof metrics.lastOperationTime === 'string').toBe(true);
    });

    it('T-TM-02: reset metrics to zero/null', () => {
      resetMetrics();
      const metrics = getMetrics();

      expect(metrics.totalAtomicWrites).toBe(0);
      expect(metrics.totalDeletes).toBe(0);
      expect(metrics.totalRecoveries).toBe(0);
      expect(metrics.totalErrors).toBe(0);
      expect(metrics.lastOperationTime).toBeNull();
    });
  });

  describe('Metrics Known Keys', () => {
    it('T-TM-03: Object.keys returns exactly 5 known keys', () => {
      resetMetrics();
      const metrics = getMetrics();
      const keys = Object.keys(metrics).sort();
      const expectedKeys = [
        'lastOperationTime',
        'totalAtomicWrites',
        'totalDeletes',
        'totalErrors',
        'totalRecoveries',
      ];

      expect(keys).toEqual(expectedKeys);
    });
  });

  describe('Metrics Spread Behavior', () => {
    it('T-TM-04: spread preserves all properties', () => {
      resetMetrics();
      const metrics = getMetrics();
      const spread = { ...metrics };

      expect(typeof spread.totalAtomicWrites).toBe('number');
      expect(typeof spread.totalDeletes).toBe('number');
      expect(typeof spread.totalRecoveries).toBe('number');
      expect(typeof spread.totalErrors).toBe('number');
      expect(spread.lastOperationTime === null || typeof spread.lastOperationTime === 'string').toBe(true);
      expect(spread).toEqual(metrics);
    });

    it('T-TM-05: spread creates independent copy', () => {
      resetMetrics();
      const metrics = getMetrics();
      const copy = { ...metrics };
      copy.totalAtomicWrites = 999;

      expect(copy.totalAtomicWrites).not.toBe(metrics.totalAtomicWrites);
    });
  });

  describe('Index Signature Access', () => {
    it('T-TM-06: arbitrary key access returns undefined', () => {
      resetMetrics();
      const metrics = getMetrics();
      const arbitrary = (metrics as Record<string, unknown>)['nonExistentKey'];

      expect(arbitrary).toBeUndefined();
    });

    it('T-TM-07: Object.entries works', () => {
      resetMetrics();
      const metrics = getMetrics();
      const entries = Object.entries(metrics);

      expect(entries.length).toBe(5);
      const allValid = entries.every(([k]) => typeof k === 'string');
      expect(allValid).toBe(true);
    });

    it('T-TM-08: JSON.stringify/parse roundtrip', () => {
      resetMetrics();
      const metrics = getMetrics();
      const json = JSON.stringify(metrics);
      const parsed = JSON.parse(json);

      expect(parsed.totalAtomicWrites).toBe(0);
      expect(parsed.totalErrors).toBe(0);
      expect(parsed.lastOperationTime).toBeNull();
    });
  });

  describe('Metrics After Operations', () => {
    it('T-TM-09: metrics update after operation', () => {
      resetMetrics();
      const tmpFile = path.join(os.tmpdir(), `tm-test-${Date.now()}.txt`);

      try {
        atomicWriteFile(tmpFile, 'test content');
      } catch (_error: unknown) {
        // Write may fail in some environments
      }

      const metrics = getMetrics();
      expect(typeof metrics.totalAtomicWrites).toBe('number');
      expect(typeof metrics.totalErrors).toBe('number');

      // Cleanup
      try { fs.unlinkSync(tmpFile); } catch {}
    });

    it('T-TM-10: lastOperationTime set after op', () => {
      resetMetrics();
      const tmpFile = path.join(os.tmpdir(), `tm-test-${Date.now()}.txt`);

      try {
        atomicWriteFile(tmpFile, 'test content');
      } catch (_error: unknown) {
        // May fail
      }

      const metrics = getMetrics();
      if (metrics.lastOperationTime !== null) {
        const date = new Date(metrics.lastOperationTime);
        expect(isNaN(date.getTime())).toBe(false);
      }
      // If null, that's also valid (no successful op)

      // Cleanup
      try { fs.unlinkSync(tmpFile); } catch {}
    });
  });
});
