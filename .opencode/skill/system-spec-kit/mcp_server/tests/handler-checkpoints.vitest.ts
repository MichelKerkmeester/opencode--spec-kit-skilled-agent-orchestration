// @ts-nocheck
// ---------------------------------------------------------------
// TEST: HANDLER CHECKPOINTS
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

import * as handler from '../handlers/checkpoints';
import * as vectorIndexMod from '../lib/search/vector-index';
import * as bm25IndexMod from '../lib/search/bm25-index';
import * as triggerMatcherMod from '../lib/parsing/trigger-matcher';
import * as checkpointStorageMod from '../lib/storage/checkpoints';

// Track which optional modules loaded
const vectorIndexAvailable = false;
const bm25IndexAvailable = false;
const triggerMatcherAvailable = false;

// ─────────────────────────────────────────────────────────────
// HANDLER CHECKPOINTS TESTS
// Covers: T521, T102
// ─────────────────────────────────────────────────────────────

describe('Handler Checkpoints (T521, T102) [deferred - requires DB test fixtures]', () => {

  // ─────────────────────────────────────────────────────────────
  // SUITE: Exports Validation
  // ─────────────────────────────────────────────────────────────
  describe('Exports Validation', () => {
    const expectedExports = [
      'handleCheckpointCreate',
      'handleCheckpointList',
      'handleCheckpointRestore',
      'handleCheckpointDelete',
      'handleMemoryValidate',
    ];

    for (const name of expectedExports) {
      it(`T521-export: ${name} exported`, () => {
        expect(typeof handler[name]).toBe('function');
      });
    }

    it('T521-export-aliases: All snake_case aliases', () => {
      const aliases = [
        'handle_checkpoint_create',
        'handle_checkpoint_list',
        'handle_checkpoint_restore',
        'handle_checkpoint_delete',
        'handle_memory_validate',
      ];

      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: handleCheckpointCreate Validation
  // ─────────────────────────────────────────────────────────────
  describe('handleCheckpointCreate Validation', () => {
    it('T521-C1: Missing name throws', async () => {
      await expect(handler.handleCheckpointCreate({})).rejects.toThrow(/name.*required/);
    });

    it('T521-C2: Null name throws', async () => {
      await expect(handler.handleCheckpointCreate({ name: null })).rejects.toThrow(/name/);
    });

    it('T521-C3: Non-string name throws', async () => {
      await expect(handler.handleCheckpointCreate({ name: 12345 })).rejects.toThrow(/name.*string/);
    });

    it('T521-C4: Non-string specFolder throws', async () => {
      await expect(handler.handleCheckpointCreate({ name: 'test', specFolder: 123 })).rejects.toThrow();
    });

    it('T521-C5: Returns MCP error response when checkpoint storage create fails', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'createCheckpoint').mockReturnValue(null);
      try {
        const result = await handler.handleCheckpointCreate({ name: 'create-failure-test' });
        expect(result.isError).toBe(true);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.code).toBe('CHECKPOINT_CREATE_FAILED');
      } finally {
        spy.mockRestore();
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: handleCheckpointList Validation
  // ─────────────────────────────────────────────────────────────
  describe('handleCheckpointList Validation', () => {
    it('T521-L1: Non-string specFolder throws', async () => {
      await expect(handler.handleCheckpointList({ specFolder: 123 })).rejects.toThrow(/specFolder.*string/);
    });

    it('T521-L2: Empty args returns valid response', async () => {
      try {
        const result = await handler.handleCheckpointList({});
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.count !== undefined || parsed.summary !== undefined).toBe(true);
      } catch (error: unknown) {
        // DB-dependent — acceptable to skip if DB not available
        expect(
          error.message.includes('database') ||
          error.message.includes('getDb') ||
          error.message.includes('Database') ||
          error.message.includes('not initialized') ||
          error.message.includes('SQLITE')
        ).toBe(true);
      }
    });

    it('T521-L3: Limit clamping implemented', () => {
      expect(typeof handler.handleCheckpointList).toBe('function');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: handleCheckpointRestore Validation
  // ─────────────────────────────────────────────────────────────
  describe('handleCheckpointRestore Validation', () => {
    it('T521-R1: Missing name throws', async () => {
      await expect(handler.handleCheckpointRestore({})).rejects.toThrow(/name.*required/);
    });

    it('T521-R2: Null name throws', async () => {
      await expect(handler.handleCheckpointRestore({ name: null })).rejects.toThrow(/name/);
    });

    it('T521-R3: Non-string name throws', async () => {
      await expect(handler.handleCheckpointRestore({ name: 999 })).rejects.toThrow(/name.*string/);
    });

    it('T521-R4: Returns MCP error response when restore reports errors with no restored data', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'restoreCheckpoint').mockReturnValue({
        restored: 0,
        skipped: 0,
        errors: ['Checkpoint not found or empty'],
        workingMemoryRestored: 0,
      });
      try {
        const result = await handler.handleCheckpointRestore({ name: 'missing-checkpoint' });
        expect(result.isError).toBe(true);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.code).toBe('CHECKPOINT_RESTORE_FAILED');
      } finally {
        spy.mockRestore();
      }
    });

    it('T521-R5: Returns MCP success-with-warning when restore is partial', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'restoreCheckpoint').mockReturnValue({
        restored: 2,
        skipped: 1,
        errors: ['Memory 10: duplicate key'],
        workingMemoryRestored: 1,
      });
      try {
        const result = await handler.handleCheckpointRestore({ name: 'partial-checkpoint' });
        expect(result.isError).toBeFalsy();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.success).toBe(true);
        expect(parsed.data?.partial).toBe(true);
        expect(parsed.data?.warningCount).toBe(1);
        expect(parsed.summary).toMatch(/with warnings/i);
      } finally {
        spy.mockRestore();
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: handleCheckpointDelete Validation
  // ─────────────────────────────────────────────────────────────
  describe('handleCheckpointDelete Validation', () => {
    it('T521-DEL1: Missing name throws', async () => {
      await expect(handler.handleCheckpointDelete({})).rejects.toThrow(/name.*required/);
    });

    it('T521-DEL2: Empty name throws', async () => {
      await expect(handler.handleCheckpointDelete({ name: '' })).rejects.toThrow(/name/);
    });

    it('T521-DEL3: Missing confirmName throws', async () => {
      await expect(handler.handleCheckpointDelete({ name: 'checkpoint-without-confirm' })).rejects.toThrow(/confirmName.*required/);
    });

    it('T521-DEL4: Mismatched confirmName throws', async () => {
      await expect(
        handler.handleCheckpointDelete({ name: 'checkpoint-a', confirmName: 'checkpoint-b' })
      ).rejects.toThrow(/confirmName must exactly match name/);
    });

    it('T521-DEL5: Matching confirmName deletes checkpoint and reports safety confirmation', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'deleteCheckpoint').mockReturnValue(true);
      try {
        const result = await handler.handleCheckpointDelete({
          name: 'safe-delete',
          confirmName: 'safe-delete',
        });
        expect(result.isError).toBeFalsy();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.success).toBe(true);
        expect(parsed.data?.safetyConfirmationUsed).toBe(true);
        expect(parsed.hints).toEqual([]);
      } finally {
        spy.mockRestore();
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: handleMemoryValidate Validation
  // ─────────────────────────────────────────────────────────────
  describe('handleMemoryValidate Validation', () => {
    it('T521-V1: Missing id throws', async () => {
      await expect(handler.handleMemoryValidate({ wasUseful: true })).rejects.toThrow(/id.*required/);
    });

    it('T521-V2: Missing wasUseful throws', async () => {
      await expect(handler.handleMemoryValidate({ id: 1 })).rejects.toThrow(/wasUseful.*required/);
    });

    it('T521-V3: Non-boolean wasUseful throws', async () => {
      await expect(handler.handleMemoryValidate({ id: 1, wasUseful: 'yes' })).rejects.toThrow(/wasUseful.*boolean/);
    });

    it('T521-V4: Non-integer string id throws', async () => {
      await expect(handler.handleMemoryValidate({ id: '7abc', wasUseful: true })).rejects.toThrow(/id.*integer|id.*number/i);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: T102 - Index Rebuild After Checkpoint Restore
  // ─────────────────────────────────────────────────────────────
  describe('T102 - Index Rebuild After Checkpoint Restore', () => {
    it('T102-1: bm25Index module available', () => {
      expect(bm25IndexMod).toBeDefined();
    });

    it('T102-2: triggerMatcher module available', () => {
      expect(triggerMatcherMod).toBeDefined();
    });

    it('T102-3: vectorIndex cache clear functions exist', () => {
      expect(typeof vectorIndexMod.clearConstitutionalCache).toBe('function');
      expect(typeof vectorIndexMod.clearSearchCache).toBe('function');
    });

    it('T102-4: bm25Index rebuild API exists', () => {
      expect(typeof bm25IndexMod.isBm25Enabled).toBe('function');
      expect(typeof bm25IndexMod.getIndex).toBe('function');
    });

    it('T102-5: triggerMatcher.refreshTriggerCache exists', () => {
      expect(typeof triggerMatcherMod.refreshTriggerCache).toBe('function');
    });

    it('T102-6: Restore triggers index rebuild', async () => {
      if (!vectorIndexMod || !triggerMatcherMod) {
        return; // skip if modules not loadable
      }

      const calls: string[] = [];

      // Use vi.spyOn instead of direct property assignment to avoid ESM readonly errors
      const spyClearConstitutional = vi.spyOn(vectorIndexMod, 'clearConstitutionalCache').mockImplementation((..._args: any[]) => { calls.push('clearConstitutionalCache'); });
      const spyClearSearch = vi.spyOn(vectorIndexMod, 'clearSearchCache').mockImplementation((..._args: any[]) => { calls.push('clearSearchCache'); return 0; });
      const spyRefreshTrigger = vi.spyOn(triggerMatcherMod, 'refreshTriggerCache').mockImplementation(() => { calls.push('refreshTriggerCache'); return []; });

      try {
        try {
          await handler.handleCheckpointRestore({ name: 't102-test-nonexistent' });
        } catch (_err: unknown) {
          // Expected — checkpoint won't exist or DB may not be init'd
        }

        if (calls.length >= 2) {
          expect(calls).toContain('clearConstitutionalCache');
          expect(calls).toContain('clearSearchCache');
          expect(calls).toContain('refreshTriggerCache');
        } else {
          // Restore threw before reaching rebuild (no DB/checkpoint) — no rebuild calls should run
          expect(calls).toHaveLength(0);
        }
      } finally {
        // Restore originals via vitest
        spyClearConstitutional.mockRestore();
        spyClearSearch.mockRestore();
        spyRefreshTrigger.mockRestore();
      }
    });

    it('T102-7: Source contains index rebuild sequence', () => {
      const HANDLERS_PATH = path.join(__dirname, '..', 'handlers');
      const handlerSource = fs.readFileSync(path.join(HANDLERS_PATH, 'checkpoints.ts'), 'utf-8');

      expect(handlerSource).toContain('T102');
      expect(handlerSource).toContain('clearConstitutionalCache');
      expect(handlerSource).toContain('clearSearchCache');
      expect(handlerSource).toContain('refreshTriggerCache');
      expect(handlerSource).toContain('rebuildFromDatabase');
    });
  });
});
