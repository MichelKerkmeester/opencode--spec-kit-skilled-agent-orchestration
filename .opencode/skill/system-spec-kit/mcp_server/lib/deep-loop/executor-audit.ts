// MODULE: Deep-Loop Executor Audit

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

export function appendExecutorAuditToLastRecord(stateLogPath: string, executor: ExecutorConfig): void {
  if (executor.kind === 'native') {
    return;
  }

  const stateLogContent = readFileSync(stateLogPath, 'utf8');
  const hasTrailingNewline = stateLogContent.endsWith('\n');
  const lines = stateLogContent.split(/\r?\n/);
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
  const rewritten = lines.join('\n');

  writeFileSync(stateLogPath, hasTrailingNewline ? `${rewritten}\n` : rewritten, 'utf8');
}
