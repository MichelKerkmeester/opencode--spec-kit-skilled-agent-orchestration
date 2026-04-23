// MODULE: Deep-Loop Executor Audit

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

import type { ExecutorConfig } from './executor-config.js';

export function buildExecutorAuditRecord(executor: ExecutorConfig): Record<string, unknown> {
  return {
    kind: executor.kind,
    model: executor.model,
    reasoningEffort: executor.reasoningEffort,
    serviceTier: executor.serviceTier,
  };
}

function findLastNonEmptyLineIndex(lines: string[]): number {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index]?.trim() !== '') {
      return index;
    }
  }

  return -1;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function readJsonlFile(stateLogPath: string): {
  content: string;
  hasTrailingNewline: boolean;
  lines: string[];
} {
  const content = readFileSync(stateLogPath, 'utf8');
  return {
    content,
    hasTrailingNewline: content.endsWith('\n'),
    lines: content.split(/\r?\n/),
  };
}

function rewriteJsonlFile(stateLogPath: string, lines: string[], hasTrailingNewline: boolean): void {
  const rewritten = lines.join('\n');
  writeFileSync(stateLogPath, hasTrailingNewline ? `${rewritten}\n` : rewritten, 'utf8');
}

function appendJsonlRecord(stateLogPath: string, record: Record<string, unknown>): void {
  const { content, hasTrailingNewline } = readJsonlFile(stateLogPath);
  const prefix = content.length === 0 || hasTrailingNewline ? '' : '\n';
  writeFileSync(stateLogPath, `${content}${prefix}${JSON.stringify(record)}\n`, 'utf8');
}

function findLatestIterationRecordIndex(lines: string[], iteration: number): number {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index]?.trim();
    if (!line) {
      continue;
    }

    const parsedRecord = JSON.parse(line);
    if (
      isObjectRecord(parsedRecord) &&
      parsedRecord.iteration === iteration &&
      (parsedRecord.type === 'iteration' || parsedRecord.type === 'iteration_start')
    ) {
      return index;
    }
  }

  return -1;
}

function findLatestIterationEvent(lines: string[], iteration: number): Record<string, unknown> | null {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index]?.trim();
    if (!line) {
      continue;
    }

    const parsedRecord = JSON.parse(line);
    if (
      isObjectRecord(parsedRecord) &&
      parsedRecord.iteration === iteration &&
      parsedRecord.type === 'event'
    ) {
      return parsedRecord;
    }
  }

  return null;
}

export function writeFirstRecordExecutor(stateLogPath: string, executor: ExecutorConfig, iteration: number): void {
  if (executor.kind === 'native') {
    return;
  }

  const { lines, hasTrailingNewline } = readJsonlFile(stateLogPath);
  const recordIndex = findLatestIterationRecordIndex(lines, iteration);

  if (recordIndex !== -1) {
    const parsedRecord = JSON.parse(lines[recordIndex]);
    if (!isObjectRecord(parsedRecord)) {
      throw new Error(`Iteration ${iteration} JSONL record is not an object`);
    }

    if (isObjectRecord(parsedRecord.executor)) {
      return;
    }

    lines[recordIndex] = JSON.stringify({
      ...parsedRecord,
      executor: buildExecutorAuditRecord(executor),
    });
    rewriteJsonlFile(stateLogPath, lines, hasTrailingNewline);
    return;
  }

  appendJsonlRecord(stateLogPath, {
    type: 'iteration_start',
    iteration,
    executor: buildExecutorAuditRecord(executor),
    timestamp: new Date().toISOString(),
  });
}

export function emitDispatchFailure(
  stateLogPath: string,
  executor: ExecutorConfig,
  reason: 'timeout' | 'crash' | 'missing_output' | 'invalid_output' | 'other',
  iteration: number,
  detail?: string,
): void {
  const lastIterationEvent = findLatestIterationEvent(readJsonlFile(stateLogPath).lines, iteration);
  if (lastIterationEvent?.event === 'dispatch_failure') {
    return;
  }

  appendJsonlRecord(stateLogPath, {
    type: 'event',
    event: 'dispatch_failure',
    ...(executor.kind === 'native' ? {} : { executor: buildExecutorAuditRecord(executor) }),
    reason,
    iteration,
    ...(detail ? { detail } : {}),
    timestamp: new Date().toISOString(),
  });
}

type RunAuditedExecutorCommandInput = {
  command: string;
  args: string[];
  cwd: string;
  timeoutSeconds: number;
  stateLogPath: string;
  executor: ExecutorConfig;
  iteration: number;
  input?: string;
};

/**
 * Run a non-native executor command and translate timeout or crash paths into
 * typed dispatch_failure events before the validator checks the iteration.
 */
export function runAuditedExecutorCommand(input: RunAuditedExecutorCommandInput): number {
  const timeoutMs = Number.isFinite(input.timeoutSeconds)
    ? Math.max(1000, Math.trunc(input.timeoutSeconds * 1000) - 1000)
    : 1000;
  const result = spawnSync(input.command, input.args, {
    cwd: input.cwd,
    encoding: 'utf8',
    timeout: timeoutMs,
    ...(typeof input.input === 'string' ? { input: input.input } : {}),
  });

  if (typeof result.stdout === 'string' && result.stdout.length > 0) {
    process.stdout.write(result.stdout);
  }
  if (typeof result.stderr === 'string' && result.stderr.length > 0) {
    process.stderr.write(result.stderr);
  }

  if (result.error) {
    const isTimeoutError =
      result.error.name === 'TimeoutError' ||
      (typeof result.error === 'object' &&
        result.error !== null &&
        'code' in result.error &&
        result.error.code === 'ETIMEDOUT');
    emitDispatchFailure(
      input.stateLogPath,
      input.executor,
      isTimeoutError ? 'timeout' : 'crash',
      input.iteration,
      result.error.message,
    );
    return 0;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    emitDispatchFailure(
      input.stateLogPath,
      input.executor,
      'crash',
      input.iteration,
      `executor exited with status ${result.status}`,
    );
    return 0;
  }

  if (typeof result.signal === 'string' && result.signal.length > 0) {
    emitDispatchFailure(
      input.stateLogPath,
      input.executor,
      'crash',
      input.iteration,
      `executor terminated by signal ${result.signal}`,
    );
    return 0;
  }

  return 0;
}

export function appendExecutorAuditToLastRecord(stateLogPath: string, executor: ExecutorConfig): void {
  if (executor.kind === 'native') {
    return;
  }

  const { lines, hasTrailingNewline } = readJsonlFile(stateLogPath);
  const lastLineIndex = findLastNonEmptyLineIndex(lines);

  if (lastLineIndex === -1) {
    throw new Error('State log does not contain any JSONL records');
  }

  const parsedRecord = JSON.parse(lines[lastLineIndex]);
  if (parsedRecord === null || Array.isArray(parsedRecord) || typeof parsedRecord !== 'object') {
    throw new Error('Last JSONL record is not an object');
  }

  const mergedRecord: Record<string, unknown> = {
    ...parsedRecord,
    executor: buildExecutorAuditRecord(executor),
  };

  lines[lastLineIndex] = JSON.stringify(mergedRecord);
  rewriteJsonlFile(stateLogPath, lines, hasTrailingNewline);
}
