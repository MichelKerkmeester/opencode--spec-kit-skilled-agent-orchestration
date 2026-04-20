import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { GenerationMetadataSchema, type GenerationMetadata } from '../../schemas/generation-metadata.js';
import { invalidateSkillGraphCaches, type CacheInvalidationEvent } from './cache-invalidation.js';
import type { SkillGraphTrustState } from './trust-state.js';

const GENERATION_RELATIVE_PATH = join('.opencode', 'skill', '.advisor-state', 'skill-graph-generation.json');

export interface PublishGenerationOptions {
  readonly workspaceRoot: string;
  readonly changedPaths?: readonly string[];
  readonly reason: string;
  readonly state?: SkillGraphTrustState;
  readonly sourceSignature?: string | null;
}

export interface PublishGenerationResult {
  readonly metadata: GenerationMetadata;
  readonly invalidation: CacheInvalidationEvent;
}

export function getSkillGraphGenerationPath(workspaceRoot: string): string {
  return join(resolve(workspaceRoot), GENERATION_RELATIVE_PATH);
}

function fsyncPath(filePath: string): void {
  let fd: number | null = null;
  try {
    fd = openSync(filePath, 'r');
    fsyncSync(fd);
  } finally {
    if (fd !== null) {
      closeSync(fd);
    }
  }
}

function writeJsonAtomic(filePath: string, payload: GenerationMetadata): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tmpPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    fsyncPath(tmpPath);
    renameSync(tmpPath, filePath);
    fsyncPath(dirname(filePath));
  } catch (error: unknown) {
    try {
      rmSync(tmpPath, { force: true });
    } catch {
      // Temp cleanup is best effort; the write failure remains authoritative.
    }
    throw error;
  }
}

export function readSkillGraphGeneration(workspaceRoot: string): GenerationMetadata {
  const filePath = getSkillGraphGenerationPath(workspaceRoot);
  if (!existsSync(filePath)) {
    return {
      generation: 0,
      updatedAt: new Date(0).toISOString(),
      sourceSignature: null,
      reason: 'GENERATION_ABSENT',
      state: 'absent',
    };
  }

  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  return GenerationMetadataSchema.parse(parsed);
}

export function publishSkillGraphGeneration(options: PublishGenerationOptions): PublishGenerationResult {
  const current = readSkillGraphGeneration(options.workspaceRoot);
  const metadata: GenerationMetadata = {
    generation: current.generation + 1,
    updatedAt: new Date().toISOString(),
    sourceSignature: options.sourceSignature ?? null,
    reason: options.reason,
    state: options.state ?? 'live',
  };
  writeJsonAtomic(getSkillGraphGenerationPath(options.workspaceRoot), metadata);
  const invalidation = invalidateSkillGraphCaches({
    generation: metadata.generation,
    changedPaths: options.changedPaths ?? [],
    reason: options.reason,
  });
  return { metadata, invalidation };
}

export async function publishAfterCommit<T>(
  commit: () => T | Promise<T>,
  options: PublishGenerationOptions,
): Promise<{ result: T; publication: PublishGenerationResult }> {
  const result = await commit();
  return {
    result,
    publication: publishSkillGraphGeneration(options),
  };
}
