// MODULE: Deep-Loop Post-Dispatch Validator

import { readFileSync, existsSync, statSync } from 'node:fs';

import type { ExecutorKind } from './executor-config.js';

export type PostDispatchValidateInput = {
  iterationFile: string;
  stateLogPath: string;
  previousStateLogSize: number;
  requiredJsonlFields: string[];
  executorKind?: ExecutorKind;
};

export type PostDispatchValidateResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | 'iteration_file_missing'
        | 'iteration_file_empty'
        | 'jsonl_not_appended'
        | 'jsonl_missing_fields'
        | 'jsonl_parse_error'
        | 'executor_missing'
        | 'dispatch_failure_logged';
      details: string;
    };

function getLastNonEmptyLine(content: string): string | null {
  const lines = content.split(/\r?\n/);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    if (line.trim() !== '') {
      return line;
    }
  }

  return null;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

export function validateIterationOutputs(input: PostDispatchValidateInput): PostDispatchValidateResult {
  if (statSync(input.stateLogPath).size <= input.previousStateLogSize) {
    return {
      ok: false,
      reason: 'jsonl_not_appended',
      details: `no new records since ${input.previousStateLogSize} bytes`,
    };
  }

  const stateLogContent = readFileSync(input.stateLogPath, 'utf8');
  const lastLine = getLastNonEmptyLine(stateLogContent);

  try {
    const parsedRecord = JSON.parse(lastLine ?? '');
    if (!isObjectRecord(parsedRecord)) {
      return {
        ok: false,
        reason: 'jsonl_parse_error',
        details: 'Last JSONL line is not an object',
      };
    }

    if (parsedRecord.type === 'event' && parsedRecord.event === 'dispatch_failure') {
      return {
        ok: false,
        reason: 'dispatch_failure_logged',
        details:
          typeof parsedRecord.reason === 'string'
            ? `dispatch_failure:${parsedRecord.reason}${typeof parsedRecord.detail === 'string' ? `:${parsedRecord.detail}` : ''}`
            : 'dispatch_failure',
      };
    }

    if (!existsSync(input.iterationFile)) {
      return { ok: false, reason: 'iteration_file_missing', details: input.iterationFile };
    }

    if (statSync(input.iterationFile).size === 0) {
      return { ok: false, reason: 'iteration_file_empty', details: input.iterationFile };
    }

    const missingFields = input.requiredJsonlFields.filter((field) => !(field in parsedRecord));

    if (missingFields.length > 0) {
      return {
        ok: false,
        reason: 'jsonl_missing_fields',
        details: `missing: ${missingFields.join(',')}`,
      };
    }

    if (input.executorKind && input.executorKind !== 'native' && !isObjectRecord(parsedRecord.executor)) {
      return {
        ok: false,
        reason: 'executor_missing',
        details: `missing executor provenance for non-native executor kind '${input.executorKind}'`,
      };
    }
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: 'jsonl_parse_error', details };
  }

  return { ok: true };
}

export class PostDispatchValidationError extends Error {
  result: PostDispatchValidateResult;

  constructor(result: PostDispatchValidateResult) {
    super(result.ok ? 'Post-dispatch validation unexpectedly succeeded' : `${result.reason}: ${result.details}`);
    this.name = 'PostDispatchValidationError';
    this.result = result;
  }
}

export function validateOrThrow(input: PostDispatchValidateInput): void {
  const result = validateIterationOutputs(input);

  if (!result.ok) {
    throw new PostDispatchValidationError(result);
  }
}
