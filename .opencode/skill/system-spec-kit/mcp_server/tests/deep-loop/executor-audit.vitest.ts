import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  appendExecutorAuditToLastRecord,
  buildExecutorAuditRecord,
  emitDispatchFailure,
  writeFirstRecordExecutor,
} from '../../lib/deep-loop/executor-audit.js';
import type { ExecutorConfig } from '../../lib/deep-loop/executor-config.js';

function withTempStateLog(content: string, run: (stateLogPath: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'executor-audit-'));
  const stateLogPath = join(tempDir, 'state.jsonl');

  try {
    writeFileSync(stateLogPath, content, 'utf8');
    run(stateLogPath);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('executor-audit', () => {
  it('buildExecutorAuditRecord returns all four audit fields for a cli-codex executor', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'priority',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    expect(buildExecutorAuditRecord(executor)).toEqual({
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'priority',
    });
  });

  it('appendExecutorAuditToLastRecord is a no-op for native executors', () => {
    const executor: ExecutorConfig = {
      kind: 'native',
      model: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"iteration","iteration":1}\n', (stateLogPath) => {
      const before = readFileSync(stateLogPath, 'utf8');

      appendExecutorAuditToLastRecord(stateLogPath, executor);

      expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
    });
  });

  it('writeFirstRecordExecutor appends an iteration_start sentinel when no iteration record exists yet', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'priority',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      writeFirstRecordExecutor(stateLogPath, executor, 7);

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      const lastRecord = JSON.parse(lines.at(-1) ?? '');
      expect(lastRecord).toMatchObject({
        type: 'iteration_start',
        iteration: 7,
        executor: {
          kind: 'cli-codex',
          model: 'gpt-5.4',
          reasoningEffort: 'high',
          serviceTier: 'priority',
        },
      });
      expect(typeof lastRecord.timestamp).toBe('string');
    });
  });

  it('writeFirstRecordExecutor merge-patches the iteration record when executor provenance is missing', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4-mini',
      reasoningEffort: 'medium',
      serviceTier: 'fast',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n{"type":"iteration","iteration":4,"status":"continue"}\n', (stateLogPath) => {
      writeFirstRecordExecutor(stateLogPath, executor, 4);

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(JSON.parse(lines.at(-1) ?? '')).toEqual({
        type: 'iteration',
        iteration: 4,
        status: 'continue',
        executor: {
          kind: 'cli-codex',
          model: 'gpt-5.4-mini',
          reasoningEffort: 'medium',
          serviceTier: 'fast',
        },
      });
    });
  });

  it('writeFirstRecordExecutor is a no-op when the iteration record already has executor provenance', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4-mini',
      reasoningEffort: 'low',
      serviceTier: 'fast',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog(
      '{"type":"iteration","iteration":4,"status":"continue","executor":{"kind":"cli-codex","model":"gpt-5.4-mini","reasoningEffort":"low","serviceTier":"fast"}}\n',
      (stateLogPath) => {
        const before = readFileSync(stateLogPath, 'utf8');

        writeFirstRecordExecutor(stateLogPath, executor, 4);

        expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
      },
    );
  });

  it('writeFirstRecordExecutor skips native executors', () => {
    const executor: ExecutorConfig = {
      kind: 'native',
      model: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      const before = readFileSync(stateLogPath, 'utf8');

      writeFirstRecordExecutor(stateLogPath, executor, 2);

      expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
    });
  });

  it('merges the executor audit block into the last JSONL line for non-native executors', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'medium',
      serviceTier: 'standard',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n{"type":"iteration","iteration":2,"status":"continue"}\n', (stateLogPath) => {
      appendExecutorAuditToLastRecord(stateLogPath, executor);

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(JSON.parse(lines.at(-1) ?? '')).toEqual({
        type: 'iteration',
        iteration: 2,
        status: 'continue',
        executor: {
          kind: 'cli-codex',
          model: 'gpt-5.4',
          reasoningEffort: 'medium',
          serviceTier: 'standard',
        },
      });
    });
  });

  it('persists the updated last line so subsequent reads include the executor field', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4-mini',
      reasoningEffort: 'low',
      serviceTier: 'fast',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"iteration","iteration":3,"status":"continue"}\n', (stateLogPath) => {
      appendExecutorAuditToLastRecord(stateLogPath, executor);

      const persisted = JSON.parse(readFileSync(stateLogPath, 'utf8').trim());
      expect(persisted.executor).toEqual({
        kind: 'cli-codex',
        model: 'gpt-5.4-mini',
        reasoningEffort: 'low',
        serviceTier: 'fast',
      });
    });
  });

  it('throws when the last JSONL line is malformed', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'priority',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event"}\n{"type":"iteration"\n', (stateLogPath) => {
      expect(() => appendExecutorAuditToLastRecord(stateLogPath, executor)).toThrow();
    });
  });

  it('emitDispatchFailure writes a typed dispatch_failure event with executor provenance', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'priority',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      emitDispatchFailure(stateLogPath, executor, 'crash', 3, 'worker exited early');

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(JSON.parse(lines.at(-1) ?? '')).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        iteration: 3,
        reason: 'crash',
        detail: 'worker exited early',
        executor: {
          kind: 'cli-codex',
          model: 'gpt-5.4',
          reasoningEffort: 'high',
          serviceTier: 'priority',
        },
      });
    });
  });

  it('emitDispatchFailure is idempotent on repeat calls for the same iteration', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'medium',
      serviceTier: 'standard',
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      emitDispatchFailure(stateLogPath, executor, 'timeout', 5, 'deadline exceeded');
      const once = readFileSync(stateLogPath, 'utf8');

      emitDispatchFailure(stateLogPath, executor, 'timeout', 5, 'deadline exceeded');

      expect(readFileSync(stateLogPath, 'utf8')).toBe(once);
    });
  });

  it('emitDispatchFailure omits the executor block for native executors', () => {
    const executor: ExecutorConfig = {
      kind: 'native',
      model: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      emitDispatchFailure(stateLogPath, executor, 'other', 1, 'native failure path');

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      const lastRecord = JSON.parse(lines.at(-1) ?? '');
      expect(lastRecord).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        iteration: 1,
        reason: 'other',
        detail: 'native failure path',
      });
      expect(lastRecord.executor).toBeUndefined();
    });
  });
});
