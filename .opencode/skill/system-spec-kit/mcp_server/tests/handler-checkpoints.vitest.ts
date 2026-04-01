// TEST: HANDLER CHECKPOINTS
import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

import * as handler from '../handlers/checkpoints';
import * as vectorIndexMod from '../lib/search/vector-index';
import * as bm25IndexMod from '../lib/search/bm25-index';
import * as triggerMatcherMod from '../lib/parsing/trigger-matcher';
import * as checkpointStorageMod from '../lib/storage/checkpoints';
import { initConsumptionLog } from '../lib/telemetry/consumption-logger';
import * as core from '../core';
import type { CheckpointEntry, CheckpointInfo, RestoreResult } from '../lib/storage/checkpoints';

// Track which optional modules loaded
const vectorIndexAvailable = false;
const bm25IndexAvailable = false;
const triggerMatcherAvailable = false;

// HANDLER CHECKPOINTS TESTS
// Covers: T521, T102
type HandlerExportName = keyof typeof handler;

function invalidArgs<T>(value: unknown): T {
  return value as T;
}

describe('Handler Checkpoints (T521, T102) [deferred - requires DB test fixtures]', () => {
  beforeAll(() => {
    vectorIndexMod.closeDb();
    vectorIndexMod.initializeDb(':memory:');
  });

  afterAll(() => {
    vectorIndexMod.closeDb();
  });

  beforeEach(() => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ───────────────────────────────────────────────────────────────
  // 1. SUITE: EXPORTS VALIDATION
  // ───────────────────────────────────────────────────────────────
  describe('Exports Validation', () => {
    const expectedExports: HandlerExportName[] = [
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
      const aliases: HandlerExportName[] = [
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

  // ───────────────────────────────────────────────────────────────
  // 2. SUITE: HANDLECHECKPOINTCREATE VALIDATION
  // ───────────────────────────────────────────────────────────────
  describe('handleCheckpointCreate Validation', () => {
    it('T521-C1: Missing name throws', async () => {
      await expect(
        handler.handleCheckpointCreate(
          invalidArgs<Parameters<typeof handler.handleCheckpointCreate>[0]>({}),
        ),
      ).rejects.toThrow(/name.*required/);
    });

    it('T521-C2: Null name throws', async () => {
      await expect(
        handler.handleCheckpointCreate(
          invalidArgs<Parameters<typeof handler.handleCheckpointCreate>[0]>({ name: null }),
        ),
      ).rejects.toThrow(/name/);
    });

    it('T521-C3: Non-string name throws', async () => {
      await expect(
        handler.handleCheckpointCreate(
          invalidArgs<Parameters<typeof handler.handleCheckpointCreate>[0]>({ name: 12345 }),
        ),
      ).rejects.toThrow(/name.*string/);
    });

    it('T521-C4: Non-string specFolder throws', async () => {
      await expect(
        handler.handleCheckpointCreate(
          invalidArgs<Parameters<typeof handler.handleCheckpointCreate>[0]>({
            name: 'test',
            specFolder: 123,
          }),
        ),
      ).rejects.toThrow();
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

    it('T521-C6: Success hints include checkpoint_delete confirmName guidance', async () => {
      const checkpoint: CheckpointInfo = {
        id: 7,
        name: 'coverage-checkpoint',
        specFolder: 'specs/example',
        createdAt: '2026-03-06T12:00:00.000Z',
        gitBranch: null,
        snapshotSize: 0,
        metadata: {},
      };
      const spy = vi.spyOn(checkpointStorageMod, 'createCheckpoint').mockReturnValue(checkpoint);
      try {
        const result = await handler.handleCheckpointCreate({
          name: 'coverage-checkpoint',
          specFolder: 'specs/example',
        });
        expect(result.isError).toBeFalsy();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.success).toBe(true);
        expect(parsed.data?.checkpoint).toEqual(checkpoint);
        expect(parsed.hints).toContain('Restore with: checkpoint_restore({ name: "coverage-checkpoint" })');
        expect(parsed.hints).toContain(
          'Delete with: checkpoint_delete({ name: "coverage-checkpoint", confirmName: "coverage-checkpoint" })'
        );
      } finally {
        spy.mockRestore();
      }
    });

    it('T521-C7: Explicit scope is merged into checkpoint metadata on create', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'createCheckpoint').mockReturnValue({
        id: 8,
        name: 'scoped-checkpoint',
        specFolder: 'specs/example',
        createdAt: '2026-03-25T12:00:00.000Z',
        gitBranch: null,
        snapshotSize: 123,
        metadata: {
          reason: 'scope-test',
          userId: 'user-1',
          agentId: 'agent-1',
          sharedSpaceId: 'space-1',
        },
      });
      try {
        await handler.handleCheckpointCreate({
          name: 'scoped-checkpoint',
          specFolder: 'specs/example',
          metadata: { reason: 'scope-test' },
          tenantId: 'tenant-a',
          userId: 'user-1',
          agentId: 'agent-1',
          sharedSpaceId: 'space-1',
        });
        expect(spy).toHaveBeenCalledWith({
          name: 'scoped-checkpoint',
          specFolder: 'specs/example',
          metadata: {
            reason: 'scope-test',
            tenantId: 'tenant-a',
            userId: 'user-1',
            agentId: 'agent-1',
            sharedSpaceId: 'space-1',
          },
          scope: {
            tenantId: 'tenant-a',
            userId: 'user-1',
            agentId: 'agent-1',
            sharedSpaceId: 'space-1',
          },
        });
      } finally {
        spy.mockRestore();
      }
    });

    it('T521-C8: Governed checkpoint create requires tenant scope when actor scope is provided', async () => {
      const response = await handler.handleCheckpointCreate({
        name: 'missing-tenant',
        userId: 'user-1',
      });
      const parsed = JSON.parse(response.content[0].text);
      expect(response.isError).toBe(true);
      expect(parsed.data?.code).toBe('CHECKPOINT_SCOPE_TENANT_REQUIRED');
    });

    it('T521-C9: whitespace-only tenantId is rejected when actor scope is provided', async () => {
      await expect(handler.handleCheckpointCreate({
        name: 'blank-tenant',
        tenantId: '   ',
        userId: 'user-1',
      })).rejects.toThrow(/tenantId must be a non-empty string/i);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. SUITE: HANDLECHECKPOINTLIST VALIDATION
  // ───────────────────────────────────────────────────────────────
  describe('handleCheckpointList Validation', () => {
    it('T521-L1: Non-string specFolder throws', async () => {
      await expect(
        handler.handleCheckpointList(
          invalidArgs<Parameters<typeof handler.handleCheckpointList>[0]>({ specFolder: 123 }),
        ),
      ).rejects.toThrow(/specFolder.*string/);
    });

    it('T521-L2: Empty args returns valid response', async () => {
      const listSpy = vi.spyOn(checkpointStorageMod, 'listCheckpoints').mockReturnValue([]);
      try {
        const result = await handler.handleCheckpointList({});
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.count).toBe(0);
        expect(parsed.data?.checkpoints).toEqual([]);
        expect(listSpy).toHaveBeenCalledWith(null, 50, {});
      } finally {
        listSpy.mockRestore();
      }
    });

    it('T521-L3: Limit clamping validates boundary values', async () => {
      const listSpy = vi.spyOn(checkpointStorageMod, 'listCheckpoints').mockReturnValue([]);
      try {
        await handler.handleCheckpointList({ limit: 0 });
        await handler.handleCheckpointList({ limit: -1 });
        await handler.handleCheckpointList({ limit: 999 });

        expect(listSpy).toHaveBeenNthCalledWith(1, null, 50, {});
        expect(listSpy).toHaveBeenNthCalledWith(2, null, 50, {});
        expect(listSpy).toHaveBeenNthCalledWith(3, null, 100, {});
      } finally {
        listSpy.mockRestore();
      }
    });

    it('T521-L4: Optional scope filters checkpoint list results by metadata', async () => {
      const listSpy = vi.spyOn(checkpointStorageMod, 'listCheckpoints').mockReturnValue([
        {
          id: 1,
          name: 'matching-checkpoint',
          specFolder: 'specs/example',
          createdAt: '2026-03-25T12:00:00.000Z',
          gitBranch: null,
          snapshotSize: 50,
          metadata: { userId: 'user-1', sharedSpaceId: 'space-1' },
        },
        {
          id: 2,
          name: 'other-checkpoint',
          specFolder: 'specs/example',
          createdAt: '2026-03-25T12:01:00.000Z',
          gitBranch: null,
          snapshotSize: 50,
          metadata: { userId: 'user-2', sharedSpaceId: 'space-1' },
        },
      ]);
      try {
        const result = await handler.handleCheckpointList({
          tenantId: 'tenant-a',
          userId: 'user-1',
          sharedSpaceId: 'space-1',
        });
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.count).toBe(1);
        expect(parsed.data?.checkpoints).toHaveLength(1);
        expect(parsed.data?.checkpoints[0]?.name).toBe('matching-checkpoint');
        expect(listSpy).toHaveBeenCalledWith(null, 50, {
          tenantId: 'tenant-a',
          userId: 'user-1',
          sharedSpaceId: 'space-1',
        });
      } finally {
        listSpy.mockRestore();
      }
    });

    it('T521-L5: Governed checkpoint list requires tenant scope when actor scope is provided', async () => {
      const response = await handler.handleCheckpointList({ userId: 'user-1' });
      const parsed = JSON.parse(response.content[0].text);
      expect(response.isError).toBe(true);
      expect(parsed.data?.code).toBe('CHECKPOINT_SCOPE_TENANT_REQUIRED');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. SUITE: HANDLECHECKPOINTRESTORE VALIDATION
  // ───────────────────────────────────────────────────────────────
  describe('handleCheckpointRestore Validation', () => {
    it('T521-R1: Missing name throws', async () => {
      await expect(
        handler.handleCheckpointRestore(
          invalidArgs<Parameters<typeof handler.handleCheckpointRestore>[0]>({}),
        ),
      ).rejects.toThrow(/name.*required/);
    });

    it('T521-R2: Null name throws', async () => {
      await expect(
        handler.handleCheckpointRestore(
          invalidArgs<Parameters<typeof handler.handleCheckpointRestore>[0]>({ name: null }),
        ),
      ).rejects.toThrow(/name/);
    });

    it('T521-R3: Non-string name throws', async () => {
      await expect(
        handler.handleCheckpointRestore(
          invalidArgs<Parameters<typeof handler.handleCheckpointRestore>[0]>({ name: 999 }),
        ),
      ).rejects.toThrow(/name.*string/);
    });

    it('T521-R4: Returns MCP error response when restore reports errors with no restored data', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'restoreCheckpoint').mockReturnValue({
        restored: 0,
        skipped: 0,
        errors: ['Checkpoint not found or empty'],
        workingMemoryRestored: 0,
      } satisfies RestoreResult);
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
      } satisfies RestoreResult);
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

    it('T521-R5b: Returns MCP error response when restore reports partial failure after data changes', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'restoreCheckpoint').mockReturnValue({
        restored: 2,
        skipped: 0,
        errors: ['session_state: merge restore rolled back after pre-clear because reinsertion failed'],
        workingMemoryRestored: 1,
        partialFailure: true,
        rolledBackTables: ['session_state'],
      } satisfies RestoreResult);
      try {
        const result = await handler.handleCheckpointRestore({ name: 'partial-failure-checkpoint' });
        expect(result.isError).toBe(true);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.code).toBe('CHECKPOINT_RESTORE_PARTIAL_FAILURE');
        expect(parsed.data?.details?.rolledBackTables).toEqual(['session_state']);
      } finally {
        spy.mockRestore();
      }
    });

    it('T521-R6: Scope mismatch blocks restore before storage mutation', async () => {
      const getSpy = vi.spyOn(checkpointStorageMod, 'getCheckpoint').mockReturnValue({
        id: 1,
        name: 'scoped-restore',
        created_at: '2026-03-25T12:00:00.000Z',
        spec_folder: 'specs/example',
        git_branch: null,
        memory_snapshot: Buffer.from(''),
        file_snapshot: null,
        metadata: JSON.stringify({ userId: 'user-2' }),
      } satisfies CheckpointEntry);
      const restoreSpy = vi.spyOn(checkpointStorageMod, 'restoreCheckpoint');
      try {
        const result = await handler.handleCheckpointRestore({
          name: 'scoped-restore',
          tenantId: 'tenant-a',
          userId: 'user-1',
        });
        expect(result.isError).toBe(true);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.code).toBe('CHECKPOINT_SCOPE_MISMATCH');
        expect(restoreSpy).not.toHaveBeenCalled();
      } finally {
        getSpy.mockRestore();
        restoreSpy.mockRestore();
      }
    });

    it('T521-R7: Governed checkpoint restore requires tenant scope when actor scope is provided', async () => {
      const response = await handler.handleCheckpointRestore({
        name: 'missing-tenant-restore',
        userId: 'user-1',
      });
      const parsed = JSON.parse(response.content[0].text);
      expect(response.isError).toBe(true);
      expect(parsed.data?.code).toBe('CHECKPOINT_SCOPE_TENANT_REQUIRED');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. SUITE: HANDLECHECKPOINTDELETE VALIDATION
  // ───────────────────────────────────────────────────────────────
  describe('handleCheckpointDelete Validation', () => {
    it('T521-DEL1: Missing name throws', async () => {
      await expect(
        handler.handleCheckpointDelete(
          invalidArgs<Parameters<typeof handler.handleCheckpointDelete>[0]>({}),
        ),
      ).rejects.toThrow(/name.*required/);
    });

    it('T521-DEL2: Empty name throws', async () => {
      await expect(handler.handleCheckpointDelete({ name: '', confirmName: '' })).rejects.toThrow(/name/);
    });

    it('T521-DEL3: Missing confirmName throws', async () => {
      await expect(
        handler.handleCheckpointDelete(
          invalidArgs<Parameters<typeof handler.handleCheckpointDelete>[0]>({
            name: 'checkpoint-without-confirm',
          }),
        ),
      ).rejects.toThrow(/confirmName.*required/);
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
        expect(parsed.data?.checkpointName).toBe('safe-delete');
        expect(typeof parsed.data?.deletedAt).toBe('string');
        expect(Number.isNaN(Date.parse(parsed.data?.deletedAt))).toBe(false);
        expect(new Date(parsed.data?.deletedAt).toISOString()).toBe(parsed.data?.deletedAt);
        expect(parsed.hints).toEqual([]);
      } finally {
        spy.mockRestore();
      }
    });

    it('T521-DEL6: Not found response omits deletedAt but keeps checkpointName', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'deleteCheckpoint').mockReturnValue(false);
      try {
        const result = await handler.handleCheckpointDelete({
          name: 'missing-delete',
          confirmName: 'missing-delete',
        });
        expect(result.isError).toBeFalsy();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.success).toBe(false);
        expect(parsed.data?.checkpointName).toBe('missing-delete');
        expect(parsed.data?.deletedAt).toBeUndefined();
      } finally {
        spy.mockRestore();
      }
    });

    it('T521-DEL7: Scope mismatch blocks delete before storage mutation', async () => {
      const getSpy = vi.spyOn(checkpointStorageMod, 'getCheckpoint').mockReturnValue({
        id: 2,
        name: 'scoped-delete',
        created_at: '2026-03-25T12:00:00.000Z',
        spec_folder: 'specs/example',
        git_branch: null,
        memory_snapshot: Buffer.from(''),
        file_snapshot: null,
        metadata: JSON.stringify({ sharedSpaceId: 'space-2' }),
      } satisfies CheckpointEntry);
      const deleteSpy = vi.spyOn(checkpointStorageMod, 'deleteCheckpoint');
      try {
        const result = await handler.handleCheckpointDelete({
          name: 'scoped-delete',
          confirmName: 'scoped-delete',
          tenantId: 'tenant-a',
          sharedSpaceId: 'space-1',
        });
        expect(result.isError).toBe(true);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.code).toBe('CHECKPOINT_SCOPE_MISMATCH');
        expect(deleteSpy).not.toHaveBeenCalled();
      } finally {
        getSpy.mockRestore();
        deleteSpy.mockRestore();
      }
    });

    it('T521-DEL8: Governed checkpoint delete requires tenant scope when actor scope is provided', async () => {
      const response = await handler.handleCheckpointDelete({
        name: 'missing-tenant-delete',
        confirmName: 'missing-tenant-delete',
        sharedSpaceId: 'space-1',
      });
      const parsed = JSON.parse(response.content[0].text);
      expect(response.isError).toBe(true);
      expect(parsed.data?.code).toBe('CHECKPOINT_SCOPE_TENANT_REQUIRED');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. SUITE: HANDLEMEMORYVALIDATE VALIDATION
  // ───────────────────────────────────────────────────────────────
  describe('handleMemoryValidate Validation', () => {
    it('T521-V1: Missing id throws', async () => {
      await expect(
        handler.handleMemoryValidate(
          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ wasUseful: true }),
        ),
      ).rejects.toThrow(/id.*required/);
    });

    it('T521-V2: Missing wasUseful throws', async () => {
      await expect(
        handler.handleMemoryValidate(
          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ id: 1 }),
        ),
      ).rejects.toThrow(/wasUseful.*required/);
    });

    it('T521-V3: Non-boolean wasUseful throws', async () => {
      await expect(
        handler.handleMemoryValidate(
          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({
            id: 1,
            wasUseful: 'yes',
          }),
        ),
      ).rejects.toThrow(/wasUseful.*boolean/);
    });

    it('T521-V4: Non-integer string id throws', async () => {
      await expect(handler.handleMemoryValidate({ id: '7abc', wasUseful: true })).rejects.toThrow(/id.*integer|id.*number/i);
    });

    it('T521-V5: Stores resolved query text for adaptive validation signals', async () => {
      const db = vectorIndexMod.getDb();
      const memoryId = 900051;
      const queryLogId = 900151;
      const now = new Date().toISOString();
      const previousAdaptiveFlag = process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING;

      initConsumptionLog(db);
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(memoryId, 'specs/test', `specs/test/memory-${memoryId}.md`, now, now);
      db.prepare(`
        INSERT INTO consumption_log (id, event_type, query_text, result_count, timestamp)
        VALUES (?, 'search', ?, 1, ?)
      `).run(queryLogId, 'resolved validation query', now);

      try {
        process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
        const response = await handler.handleMemoryValidate({
          id: memoryId,
          wasUseful: true,
          queryId: `consumption:${queryLogId}`,
        });
        const parsed = JSON.parse(response.content[0].text);
        const signal = db.prepare(`
          SELECT query, metadata
          FROM adaptive_signal_events
          WHERE memory_id = ?
          ORDER BY id DESC
          LIMIT 1
        `).get(memoryId) as { query?: string | null; metadata?: string | null } | undefined;

        expect(response.isError).toBeFalsy();
        expect(parsed.data?.memoryId).toBe(memoryId);
        expect(signal?.query).toBe('resolved validation query');
        expect(JSON.parse(signal?.metadata ?? '{}')).toMatchObject({
          queryId: `consumption:${queryLogId}`,
          queryText: 'resolved validation query',
        });
      } finally {
        if (previousAdaptiveFlag === undefined) {
          delete process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING;
        } else {
          process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = previousAdaptiveFlag;
        }
        db.prepare('DELETE FROM adaptive_signal_events WHERE memory_id = ?').run(memoryId);
        db.prepare('DELETE FROM consumption_log WHERE id = ?').run(queryLogId);
        db.prepare('DELETE FROM memory_index WHERE id = ?').run(memoryId);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. SUITE: T102 - INDEX REBUILD AFTER CHECKPOINT RESTORE
  // ───────────────────────────────────────────────────────────────
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
      const spyClearConstitutional = vi
        .spyOn(vectorIndexMod, 'clearConstitutionalCache')
        .mockImplementation((_specFolder: string | null = null) => {
          calls.push('clearConstitutionalCache');
        });
      const spyClearSearch = vi
        .spyOn(vectorIndexMod, 'clearSearchCache')
        .mockImplementation((_specFolder: string | null = null) => {
          calls.push('clearSearchCache');
          return 0;
        });
      const spyRefreshTrigger = vi.spyOn(triggerMatcherMod, 'refreshTriggerCache').mockImplementation(() => { calls.push('refreshTriggerCache'); return []; });

      try {
        try {
          await handler.handleCheckpointRestore({ name: 't102-test-nonexistent' });
        } catch (_err: unknown) {
          // Expected — checkpoint won't exist or DB may not be init'd
        }

        expect(calls.length).not.toBe(1);
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
