// ───────────────────────────────────────────────────────────────
// MODULE: Skill Derived Rollback
// ───────────────────────────────────────────────────────────────

import { closeSync, fsyncSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface RollbackResult {
  readonly metadata: Record<string, unknown>;
  readonly removedDerived: boolean;
  readonly schemaVersion: 1;
  readonly reindexRequired: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

function fsyncPath(targetPath: string): void {
  let fd: number | null = null;
  try {
    fd = openSync(targetPath, 'r');
    fsyncSync(fd);
  } finally {
    if (fd !== null) closeSync(fd);
  }
}

function writeJsonAtomic(filePath: string, payload: Record<string, unknown>): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tmpPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    fsyncPath(tmpPath);
    renameSync(tmpPath, filePath);
    fsyncPath(dirname(filePath));
  } catch (error: unknown) {
    rmSync(tmpPath, { force: true });
    throw error;
  }
}

export function rollbackDerivedBlock(metadata: Record<string, unknown>): RollbackResult {
  const { derived: _derived, ...rest } = metadata;
  return {
    metadata: {
      ...rest,
      schema_version: 1,
    },
    removedDerived: Object.prototype.hasOwnProperty.call(metadata, 'derived'),
    schemaVersion: 1,
    reindexRequired: true,
  };
}

export function rollbackGraphMetadataFile(graphMetadataPath: string): RollbackResult {
  const parsed: unknown = JSON.parse(readFileSync(graphMetadataPath, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`graph-metadata root must be an object: ${graphMetadataPath}`);
  }
  const result = rollbackDerivedBlock(parsed as Record<string, unknown>);
  writeJsonAtomic(graphMetadataPath, result.metadata);
  return result;
}
