import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { emitDispatchFailure } from '../../lib/deep-loop/executor-audit.js';
import type { ExecutorConfig } from '../../lib/deep-loop/executor-config.js';
import { validateIterationOutputs } from '../../lib/deep-loop/post-dispatch-validate.js';

type TempPaths = {
  tempDir: string;
  iterationFile: string;
  stateLogPath: string;
};

function withTempPaths(run: (paths: TempPaths) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'dispatch-failure-'));
  const iterationFile = join(tempDir, 'iteration-001.md');
  const stateLogPath = join(tempDir, 'state.jsonl');

  try {
    run({ tempDir, iterationFile, stateLogPath });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('dispatch-failure end-to-end', () => {
  it('returns dispatch_failure_logged when a crash happens before the iteration record is written', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'priority',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(stateLogPath, '{"type":"event","event":"start"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      emitDispatchFailure(stateLogPath, executor, 'crash', 1, 'dispatcher exited before output');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
          executorKind: 'cli-codex',
        }),
      ).toEqual({
        ok: false,
        reason: 'dispatch_failure_logged',
        details: 'dispatch_failure:crash:dispatcher exited before output',
      });
    });
  });

  it('preserves executor provenance on the dispatch_failure record after a crash', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4-mini',
      reasoningEffort: 'medium',
      serviceTier: 'standard',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempPaths(({ stateLogPath }) => {
      writeFileSync(stateLogPath, '{"type":"event","event":"start"}\n', 'utf8');

      emitDispatchFailure(stateLogPath, executor, 'missing_output', 2, 'no stdout or file output');

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(JSON.parse(lines.at(-1) ?? '')).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        iteration: 2,
        reason: 'missing_output',
        detail: 'no stdout or file output',
        executor: {
          kind: 'cli-codex',
          model: 'gpt-5.4-mini',
          reasoningEffort: 'medium',
          serviceTier: 'standard',
        },
      });
    });
  });
});
