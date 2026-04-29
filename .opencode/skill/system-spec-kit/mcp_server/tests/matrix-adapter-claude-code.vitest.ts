import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => ({ spawn: vi.fn() }));

import { adapterCliClaudeCode } from '../matrix-runners/adapter-cli-claude-code';
import { baseInput, expectSpawned, mockSpawnNeverCloses, mockSpawnSuccess, spawnMock } from './matrix-adapter-test-utils';

describe('adapterCliClaudeCode', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns PASS when stdout contains the expected signal', async () => {
    mockSpawnSuccess('MATRIX_CELL_PASS F1');
    const result = await adapterCliClaudeCode(baseInput('MATRIX_CELL_PASS F1'));

    expect(result.status).toBe('PASS');
    expect(result.evidence.exitCode).toBe(0);
    expectSpawned('claude', [
      '-p',
      'Return the matrix signal.',
      '--model',
      'claude-sonnet-4-6',
      '--permission-mode',
      'acceptEdits',
    ]);
  });

  it('returns TIMEOUT_CELL when the CLI does not close before timeout', async () => {
    vi.useFakeTimers();
    mockSpawnNeverCloses();

    const resultPromise = adapterCliClaudeCode(baseInput('MATRIX_CELL_PASS F1'));
    await vi.advanceTimersByTimeAsync(1000);
    const result = await resultPromise;

    expect(result.status).toBe('TIMEOUT_CELL');
    expect(spawnMock()).toHaveBeenCalledOnce();
  });
});

