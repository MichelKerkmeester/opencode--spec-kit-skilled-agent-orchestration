import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => ({ spawn: vi.fn() }));

import { adapterCliOpencode } from '../matrix-runners/adapter-cli-opencode';
import { baseInput, expectSpawned, mockSpawnNeverCloses, mockSpawnSuccess, spawnMock } from './matrix-adapter-test-utils';

describe('adapterCliOpencode', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns PASS when stdout contains the expected signal', async () => {
    mockSpawnSuccess('{"status":"ok"}\nMATRIX_CELL_PASS F1');
    const input = baseInput('MATRIX_CELL_PASS F1');
    const result = await adapterCliOpencode(input);

    expect(result.status).toBe('PASS');
    expect(result.evidence.stdout).toContain('MATRIX_CELL_PASS F1');
    expectSpawned('opencode', [
      'run',
      '--model',
      'opencode-go/deepseek-v4-pro',
      '--agent',
      'general',
      '--variant',
      'high',
      '--format',
      'json',
      '--dir',
      input.workingDir,
      'Return the matrix signal.',
    ]);
  });

  it('returns TIMEOUT_CELL when the CLI does not close before timeout', async () => {
    vi.useFakeTimers();
    mockSpawnNeverCloses();

    const resultPromise = adapterCliOpencode(baseInput('MATRIX_CELL_PASS F1'));
    await vi.advanceTimersByTimeAsync(1000);
    const result = await resultPromise;

    expect(result.status).toBe('TIMEOUT_CELL');
    expect(spawnMock()).toHaveBeenCalledOnce();
  });
});

