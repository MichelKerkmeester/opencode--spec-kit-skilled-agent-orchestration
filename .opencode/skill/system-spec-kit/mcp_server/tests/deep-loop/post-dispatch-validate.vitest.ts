import { mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  PostDispatchValidationError,
  validateIterationOutputs,
  validateOrThrow,
} from '../../lib/deep-loop/post-dispatch-validate.js';

type TempPaths = {
  tempDir: string;
  iterationFile: string;
  stateLogPath: string;
};

function withTempPaths(run: (paths: TempPaths) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'post-dispatch-validate-'));
  const iterationFile = join(tempDir, 'iteration-001.md');
  const stateLogPath = join(tempDir, 'state.jsonl');

  try {
    run({ tempDir, iterationFile, stateLogPath });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('post-dispatch-validate', () => {
  it('returns ok when the iteration file exists and the appended JSONL line has all required fields', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        }),
      ).toEqual({ ok: true });
    });
  });

  it('returns iteration_file_missing when the iteration file does not exist', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(stateLogPath, '{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n', 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize: 0,
          requiredJsonlFields: ['type'],
        }),
      ).toEqual({
        ok: false,
        reason: 'iteration_file_missing',
        details: iterationFile,
      });
    });
  });

  it('returns iteration_file_empty when the iteration file has zero bytes', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '', 'utf8');
      writeFileSync(stateLogPath, '{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n', 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize: 0,
          requiredJsonlFields: ['type'],
        }),
      ).toEqual({
        ok: false,
        reason: 'iteration_file_empty',
        details: iterationFile,
      });
    });
  });

  it('returns jsonl_not_appended when the state log size does not grow', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"iteration","iteration":1}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type'],
        }),
      ).toEqual({
        ok: false,
        reason: 'jsonl_not_appended',
        details: `no new records since ${previousStateLogSize} bytes`,
      });
    });
  });

  it('returns jsonl_missing_fields when the last JSONL line omits a required field', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(stateLogPath, '{"type":"event"}\n{"type":"iteration","iteration":1,"status":"continue","focus":"coverage"}\n', 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        }),
      ).toEqual({
        ok: false,
        reason: 'jsonl_missing_fields',
        details: 'missing: newInfoRatio',
      });
    });
  });

  it('returns jsonl_parse_error when the last JSONL line is malformed', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(stateLogPath, '{"type":"event"}\n{"type":"iteration"\n', 'utf8');

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type'],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe('jsonl_parse_error');
      }
    });
  });

  it('validateOrThrow throws PostDispatchValidationError on a bad result', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '', 'utf8');
      writeFileSync(stateLogPath, '{"type":"iteration"}\n', 'utf8');

      expect(() =>
        validateOrThrow({
          iterationFile,
          stateLogPath,
          previousStateLogSize: 0,
          requiredJsonlFields: ['type'],
        }),
      ).toThrow(PostDispatchValidationError);
    });
  });

  it('validateOrThrow returns void when validation succeeds', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      expect(
        validateOrThrow({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        }),
      ).toBeUndefined();
    });
  });
});
