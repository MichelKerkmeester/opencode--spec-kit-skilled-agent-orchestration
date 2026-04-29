// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Adapter Codex Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => ({ spawn: vi.fn() }));

import { adapterCliCodex } from '../matrix-runners/adapter-cli-codex';
import { baseInput, expectSpawned, mockSpawnNeverCloses, mockSpawnSuccess, spawnMock } from './matrix-adapter-test-utils';

describe('adapterCliCodex', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns PASS when stdout contains the expected signal', async () => {
    const child = mockSpawnSuccess('ok\nMATRIX_CELL_PASS F1\n');
    const result = await adapterCliCodex(baseInput('MATRIX_CELL_PASS F1'));

    expect(result.status).toBe('PASS');
    expect(result.evidence.exitCode).toBe(0);
    expect(child.stdin.write).toHaveBeenCalledWith('Return the matrix signal.');
    expectSpawned('codex', [
      'exec',
      '--model',
      'gpt-5.5',
      '-c',
      'model_reasoning_effort=high',
      '-c',
      'service_tier=fast',
      '-c',
      'approval_policy=never',
      '--sandbox',
      'workspace-write',
      '-',
    ]);
  });

  it('returns TIMEOUT_CELL when the CLI does not close before timeout', async () => {
    vi.useFakeTimers();
    mockSpawnNeverCloses();

    const resultPromise = adapterCliCodex(baseInput('MATRIX_CELL_PASS F1'));
    await vi.advanceTimersByTimeAsync(1000);
    const result = await resultPromise;

    expect(result.status).toBe('TIMEOUT_CELL');
    expect(spawnMock()).toHaveBeenCalledOnce();
  });
});
