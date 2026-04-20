// ───────────────────────────────────────────────────────────────
// MODULE: Derived Metadata Provenance
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import type { DerivedSourceCategory } from './trust-lanes.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type ProvenanceBuckets = Readonly<Record<DerivedSourceCategory, readonly string[]>>;

export interface FileDependency {
  readonly path: string;
  readonly hash: string;
  readonly exists: boolean;
}

export interface ProvenanceFingerprint {
  readonly provenanceFingerprint: string;
  readonly bucketFingerprints: Record<string, string>;
  readonly dependencies: FileDependency[];
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

function sha256(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeBucket(values: readonly string[]): string[] {
  return values
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
}

export function fileDependency(workspaceRoot: string, filePath: string): FileDependency {
  const absolutePath = resolve(workspaceRoot, filePath);
  if (!existsSync(absolutePath)) {
    return {
      path: relative(resolve(workspaceRoot), absolutePath),
      hash: 'missing',
      exists: false,
    };
  }
  const stat = statSync(absolutePath);
  if (!stat.isFile()) {
    return {
      path: relative(resolve(workspaceRoot), absolutePath),
      hash: 'not-file',
      exists: false,
    };
  }
  return {
    path: relative(resolve(workspaceRoot), absolutePath),
    hash: sha256(readFileSync(absolutePath)),
    exists: true,
  };
}

export function computeProvenanceFingerprint(
  buckets: ProvenanceBuckets,
  dependencies: readonly FileDependency[] = [],
): ProvenanceFingerprint {
  const bucketFingerprints: Record<string, string> = {};
  const payload: Record<string, unknown> = {};

  for (const [bucketName, values] of Object.entries(buckets)) {
    const normalized = normalizeBucket(values);
    bucketFingerprints[bucketName] = `sha256:${sha256(JSON.stringify(normalized))}`;
    payload[bucketName] = normalized;
  }
  payload.dependencies = dependencies
    .map((dependency) => ({ path: dependency.path, hash: dependency.hash, exists: dependency.exists }))
    .sort((left, right) => left.path.localeCompare(right.path));

  return {
    provenanceFingerprint: `sha256:${sha256(JSON.stringify(payload))}`,
    bucketFingerprints,
    dependencies: [...dependencies],
  };
}

export function hasFingerprintChanged(previous: string | null | undefined, next: string): boolean {
  return previous !== next;
}

