// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Adapter Copilot Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => ({ spawn: vi.fn() }));

import { adapterCliCopilot } from '../matrix-runners/adapter-cli-copilot';
import { baseInput, expectSpawned, mockSpawnNeverCloses, mockSpawnSuccess, spawnMock } from './matrix-adapter-test-utils';

describe('adapterCliCopilot', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns PASS when stdout contains the expected signal', async () => {
    mockSpawnSuccess('MATRIX_CELL_PASS F1\n');
    const result = await adapterCliCopilot(baseInput('MATRIX_CELL_PASS F1'));

    expect(result.status).toBe('PASS');
    expect(result.evidence.stdout).toContain('MATRIX_CELL_PASS F1');
    expectSpawned('copilot', [
      '-p',
      'Return the matrix signal.',
      '--model',
      'gpt-5.4',
      '--allow-all-tools',
      '--no-ask-user',
    ]);
  });

  it('returns TIMEOUT_CELL when the CLI does not close before timeout', async () => {
    vi.useFakeTimers();
    mockSpawnNeverCloses();

    const resultPromise = adapterCliCopilot(baseInput('MATRIX_CELL_PASS F1'));
    await vi.advanceTimersByTimeAsync(1000);
    const result = await resultPromise;

    expect(result.status).toBe('TIMEOUT_CELL');
    expect(spawnMock()).toHaveBeenCalledOnce();
  });
});
