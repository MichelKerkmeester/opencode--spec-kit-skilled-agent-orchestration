// ───────────────────────────────────────────────────────────────
// MODULE: Skill Derived Rollback
// ───────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs';

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
  writeFileSync(graphMetadataPath, `${JSON.stringify(result.metadata, null, 2)}\n`, 'utf8');
  return result;
}

