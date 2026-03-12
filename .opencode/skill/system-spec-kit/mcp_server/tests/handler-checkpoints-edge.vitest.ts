import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as handler from '../handlers/checkpoints';
import * as dbState from '../core/db-state';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpointStorage from '../lib/storage/checkpoints';

function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

interface ParsedEnvelope {
  summary?: string;
  data?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  hints?: string[];
}

type MCPResult = {
  content: Array<{ text: string }>;
  isError?: boolean;
};

const RUN_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
let sequence = 0;
const previousMemoryDbPath = process.env.MEMORY_DB_PATH;

function checkpointName(label: string): string {
  sequence += 1;
  return `edge-${label}-${RUN_ID}-${sequence}`;
}

function getData(payload: ParsedEnvelope): Record<string, unknown> {
  return payload.data ?? {};
}

function getCheckpoints(data: Record<string, unknown>): Array<Record<string, unknown>> {
  const checkpoints = data.checkpoints;
  if (!Array.isArray(checkpoints)) {
    return [];
  }

  return checkpoints.filter((entry): entry is Record<string, unknown> => (
    typeof entry === 'object' && entry !== null
  ));
}

async function createCheckpointExpectSuccess(name: string, specFolder?: string): Promise<void> {
  const result = await handler.handleCheckpointCreate(
    specFolder ? { name, specFolder } : { name }
  );
  const payload = parseResponse(result) as ParsedEnvelope;
  const data = getData(payload);

  expect(result.isError).toBeFalsy();
  expect(data.success).toBe(true);

  const checkpoint = data.checkpoint;
  expect(typeof checkpoint).toBe('object');
  expect(checkpoint && typeof checkpoint === 'object'
    ? (checkpoint as Record<string, unknown>).name
    : undefined
  ).toBe(name);
}

async function expectThrowOrErrorResponse(
  operation: Promise<MCPResult>,
  assertErrorPayload: (payload: ParsedEnvelope) => void,
): Promise<void> {
  try {
    const result = await operation;
    const payload = parseResponse(result) as ParsedEnvelope;
    const data = getData(payload);

    const hasErrorField = typeof data.error === 'string';
    expect(result.isError || hasErrorField).toBe(true);
    assertErrorPayload(payload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    assertErrorPayload({
      summary: message,
      data: {
        error: message,
      },
    });
  }
}

describe('Handler Checkpoints Edge Cases (T009-T012)', () => {
  beforeAll(() => {
    process.env.MEMORY_DB_PATH = ':memory:';
    dbState.init({
      vectorIndex,
      checkpoints: checkpointStorage,
    });
    const db = vectorIndex.initializeDb();
    checkpointStorage.init(db);
  });

  afterAll(() => {
    vectorIndex.closeDb();
    if (previousMemoryDbPath === undefined) {
      delete process.env.MEMORY_DB_PATH;
    } else {
      process.env.MEMORY_DB_PATH = previousMemoryDbPath;
    }
  });

  it('T009-C1: Create checkpoint with valid name returns success with checkpoint name', async () => {
    const name = checkpointName('t009-c1');
    const specFolder = `specs/${checkpointName('t009-c1-folder')}`;

    const result = await handler.handleCheckpointCreate({ name, specFolder });
    const payload = parseResponse(result) as ParsedEnvelope;
    const data = getData(payload);

    expect(result.isError).toBeFalsy();
    expect(data.success).toBe(true);

    const checkpoint = data.checkpoint as Record<string, unknown> | undefined;
    expect(checkpoint).toBeDefined();
    expect(checkpoint?.name).toBe(name);
  });

  it('T009-C2: Create checkpoint with empty name throws or returns error', async () => {
    const operation = handler.handleCheckpointCreate({ name: '' });
    await expectThrowOrErrorResponse(operation, (payload) => {
      const data = getData(payload);
      const errorText = String(data.error ?? payload.summary ?? '');
      expect(errorText).toMatch(/name|required|string/i);
    });
  });

  it('T010-C3: List checkpoints returns array (may be empty for fresh DB)', async () => {
    const result = await handler.handleCheckpointList({});
    const payload = parseResponse(result) as ParsedEnvelope;
    const data = getData(payload);

    expect(result.isError).toBeFalsy();
    expect(Array.isArray(data.checkpoints)).toBe(true);
  });

  it('T010-C4: List with limit=1 returns at most 1 result', async () => {
    await createCheckpointExpectSuccess(checkpointName('t010-c4-a'));
    await createCheckpointExpectSuccess(checkpointName('t010-c4-b'));

    const result = await handler.handleCheckpointList({ limit: 1 });
    const payload = parseResponse(result) as ParsedEnvelope;
    const data = getData(payload);
    const checkpoints = getCheckpoints(data);

    expect(result.isError).toBeFalsy();
    expect(checkpoints.length).toBeLessThanOrEqual(1);
  });

  it('T010-C5: List with specFolder filter returns filtered results', async () => {
    const matchingFolder = `specs/${checkpointName('t010-c5-match-folder')}`;
    const nonMatchingFolder = `specs/${checkpointName('t010-c5-other-folder')}`;
    const keptName = checkpointName('t010-c5-kept');

    await createCheckpointExpectSuccess(keptName, matchingFolder);
    await createCheckpointExpectSuccess(checkpointName('t010-c5-other'), nonMatchingFolder);

    const result = await handler.handleCheckpointList({ specFolder: matchingFolder, limit: 50 });
    const payload = parseResponse(result) as ParsedEnvelope;
    const data = getData(payload);
    const checkpoints = getCheckpoints(data);

    expect(result.isError).toBeFalsy();
    expect(checkpoints.length).toBeGreaterThan(0);
    expect(checkpoints.every((checkpoint) => checkpoint.specFolder === matchingFolder)).toBe(true);
    expect(checkpoints.some((checkpoint) => checkpoint.name === keptName)).toBe(true);
  });

  it('T011-C6: Restore non-existent checkpoint returns error or throws', async () => {
    const missingName = checkpointName('t011-c6-missing');
    const operation = handler.handleCheckpointRestore({ name: missingName });

    await expectThrowOrErrorResponse(operation, (payload) => {
      const data = getData(payload);
      expect(String(data.code ?? '')).toMatch(/CHECKPOINT_RESTORE_FAILED/i);
      expect(String(data.error ?? payload.summary ?? '')).toMatch(/checkpoint|restore/i);
    });
  });

  it('T011-C7: Restore with clearExisting=true on empty DB does not crash', async () => {
    const missingName = checkpointName('t011-c7-empty-restore');
    const operation = handler.handleCheckpointRestore({ name: missingName, clearExisting: true });

    await expectThrowOrErrorResponse(operation, (payload) => {
      const data = getData(payload);
      expect(String(data.error ?? payload.summary ?? '')).toMatch(/checkpoint|restore|not found/i);
    });
  });

  it('T011-C7b: Restore existing checkpoint returns success with restore hints', async () => {
    const name = checkpointName('t011-c7b-existing');
    await createCheckpointExpectSuccess(name, `specs/${checkpointName('t011-c7b-folder')}`);

    const result = await handler.handleCheckpointRestore({ name });
    const payload = parseResponse(result) as ParsedEnvelope;
    const data = getData(payload);

    expect(result.isError).toBeFalsy();
    expect(data.success).toBe(true);
    const hints = Array.isArray(payload.hints) ? payload.hints.map((hint) => String(hint)) : [];
    expect(hints.length).toBeGreaterThan(0);
    expect(hints.some((hint) => /search indexes rebuilt/i.test(hint))).toBe(true);
  });

  it('T011-C7c: Restore merge skips row when checkpoint id collides with different live identity', async () => {
    const db = vectorIndex.getDb();
    const memoryId = 99001;
    const snapshotSpecFolder = `specs/${checkpointName('t011-c7c-snapshot-folder')}`;
    const snapshotPath = `${snapshotSpecFolder}/memory/snapshot.md`;
    const collisionSpecFolder = `specs/${checkpointName('t011-c7c-collision-folder')}`;
    const collisionPath = `${collisionSpecFolder}/memory/collision.md`;
    const checkpoint = checkpointName('t011-c7c-id-collision');

    db.prepare(
      'INSERT INTO memory_index (id, spec_folder, file_path, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      memoryId,
      snapshotSpecFolder,
      snapshotPath,
      'snapshot-title',
      new Date().toISOString(),
      new Date().toISOString(),
    );

    await createCheckpointExpectSuccess(checkpoint, snapshotSpecFolder);

    db.prepare(
      'UPDATE memory_index SET spec_folder = ?, file_path = ?, title = ? WHERE id = ?'
    ).run(collisionSpecFolder, collisionPath, 'collision-title', memoryId);

    const restore = await handler.handleCheckpointRestore({ name: checkpoint, clearExisting: false });
    const restorePayload = parseResponse(restore) as ParsedEnvelope;
    const restoreData = getData(restorePayload);

    expect(restore.isError).toBeFalsy();
    expect(restoreData.success).toBe(true);

    const restored = restoreData.restored as { skipped?: unknown } | undefined;
    expect(Number(restored?.skipped ?? 0)).toBeGreaterThanOrEqual(1);

    const row = db.prepare(
      'SELECT spec_folder, file_path, title FROM memory_index WHERE id = ?'
    ).get(memoryId) as { spec_folder: string; file_path: string; title: string } | undefined;

    expect(row).toBeDefined();
    expect(row?.spec_folder).toBe(collisionSpecFolder);
    expect(row?.file_path).toBe(collisionPath);
    expect(row?.title).toBe('collision-title');
  });

  it('T012-C8: Delete with mismatched confirmName returns error or throws', async () => {
    const name = checkpointName('t012-c8');
    const operation = handler.handleCheckpointDelete({ name, confirmName: `${name}-mismatch` });

    await expectThrowOrErrorResponse(operation, (payload) => {
      const data = getData(payload);
      expect(String(data.error ?? payload.summary ?? '')).toMatch(/confirmName|match/i);
    });
  });

  it('T012-C9: Delete non-existent checkpoint returns deleted=false or error', async () => {
    const name = checkpointName('t012-c9-missing-delete');
    const operation = handler.handleCheckpointDelete({ name, confirmName: name });

    try {
      const result = await operation;
      const payload = parseResponse(result) as ParsedEnvelope;
      const data = getData(payload);

      if (result.isError || typeof data.error === 'string') {
        expect(String(data.error ?? payload.summary ?? '')).toMatch(/checkpoint|delete|not found/i);
      } else {
        expect(data.success).toBe(false);
      }
    } catch {
      await expect(operation).rejects.toThrow();
    }
  });

  it('T012-C10: Delete with matching confirmName on existing checkpoint returns success', async () => {
    const name = checkpointName('t012-c10-existing-delete');
    await createCheckpointExpectSuccess(name, `specs/${checkpointName('t012-c10-folder')}`);

    const result = await handler.handleCheckpointDelete({ name, confirmName: name });
    const payload = parseResponse(result) as ParsedEnvelope;
    const data = getData(payload);

    expect(result.isError).toBeFalsy();
    expect(data.success).toBe(true);
    expect(data.safetyConfirmationUsed).toBe(true);
  });
});
