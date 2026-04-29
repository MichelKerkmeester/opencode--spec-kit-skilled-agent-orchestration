// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Adapter Gemini Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => ({ spawn: vi.fn() }));

import { adapterCliGemini } from '../matrix-runners/adapter-cli-gemini';
import { baseInput, expectSpawned, mockSpawnNeverCloses, mockSpawnSuccess, spawnMock } from './matrix-adapter-test-utils';

describe('adapterCliGemini', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns PASS when stdout contains the expected signal', async () => {
    mockSpawnSuccess('verified MATRIX_CELL_PASS F1');
    const result = await adapterCliGemini(baseInput('MATRIX_CELL_PASS F1'));

    expect(result.status).toBe('PASS');
    expect(result.evidence.exitCode).toBe(0);
    expectSpawned('gemini', [
      'Return the matrix signal.',
      '-m',
      'gemini-3.1-pro-preview',
      '-y',
      '-o',
      'text',
    ]);
  });

  it('returns TIMEOUT_CELL when the CLI does not close before timeout', async () => {
    vi.useFakeTimers();
    mockSpawnNeverCloses();

    const resultPromise = adapterCliGemini(baseInput('MATRIX_CELL_PASS F1'));
    await vi.advanceTimersByTimeAsync(1000);
    const result = await resultPromise;

    expect(result.status).toBe('TIMEOUT_CELL');
    expect(spawnMock()).toHaveBeenCalledOnce();
  });
});
