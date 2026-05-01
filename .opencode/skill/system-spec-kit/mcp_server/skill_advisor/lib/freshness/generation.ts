// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Freshness Generation
// ───────────────────────────────────────────────────────────────

import { randomBytes } from 'node:crypto';
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { GenerationMetadataSchema, type GenerationMetadata } from '../../schemas/generation-metadata.js';
import { invalidateSkillGraphCaches, type CacheInvalidationEvent } from './cache-invalidation.js';
import type { SkillGraphTrustState } from './trust-state.js';

const GENERATION_RELATIVE_PATH = join('.opencode', 'skill', '.advisor-state', 'skill-graph-generation.json');
const GENERATION_LOCK_STALE_MS = 30_000;
const GENERATION_LOCK_WAIT_MS = 250;

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

// F-001-A1-03: token-checked lock release.
//
// The previous implementation stored only `pid:timestamp` and let any process
// remove the lock file unconditionally. That meant publisher A could pause
// past GENERATION_LOCK_STALE_MS, publisher B would reclaim the stale lock,
// and when A resumed its release closure would happily delete B's lock,
// allowing a third writer to enter while B still believed it owned the lock.
//
// Fix: every acquisition writes a random `token` into the lock file. Release
// reads the file back and only removes the lock if the token still matches
// the holder's. Stale reclamation also reads the persisted token before
// deletion so concurrent reclaimers do not stomp on each other.
//
// Format: `${pid}:${acquiredAtMs}:${token}`
//   - pid           — debugging only
//   - acquiredAtMs  — staleness check
//   - token         — 32 hex chars from crypto.randomBytes
function readLockTokenAndAge(lockPath: string): { token: string | null; ageMs: number | null } {
  try {
    const raw = readFileSync(lockPath, 'utf8').trim();
    const parts = raw.split(':');
    if (parts.length < 3) {
      // Legacy or corrupt lock contents — treat as un-owned.
      return { token: null, ageMs: null };
    }
    const acquiredAtMs = Number(parts[1]);
    const token = parts.slice(2).join(':');
    if (!Number.isFinite(acquiredAtMs)) {
      return { token, ageMs: null };
    }
    return { token, ageMs: Date.now() - acquiredAtMs };
  } catch {
    return { token: null, ageMs: null };
  }
}

function acquireGenerationLock(filePath: string): () => void {
  const lockPath = `${filePath}.lock`;
  mkdirSync(dirname(filePath), { recursive: true });
  const startedAt = Date.now();
  while (true) {
    const myToken = randomBytes(16).toString('hex');
    try {
      const fd = openSync(lockPath, 'wx');
      writeFileSync(fd, `${process.pid}:${Date.now()}:${myToken}\n`, 'utf8');
      closeSync(fd);
      return () => {
        // Only delete if the token still matches ours. Reading the file back
        // is the cheapest available compare-and-swap on a POSIX directory.
        const { token } = readLockTokenAndAge(lockPath);
        if (token === myToken) {
          rmSync(lockPath, { force: true });
        }
        // If the token does NOT match, another holder reclaimed the lock
        // after we paused/lost ownership. We must not delete their lock.
      };
    } catch (error: unknown) {
      const code = error instanceof Error && 'code' in error ? (error as NodeJS.ErrnoException).code : null;
      if (code !== 'EEXIST') throw error;
      const { token: incumbentToken, ageMs } = readLockTokenAndAge(lockPath);
      if (ageMs !== null && ageMs > GENERATION_LOCK_STALE_MS) {
        // Compare-and-swap stale reclamation: re-read the token, confirm it
        // is still the same incumbent that we just observed as stale, and
        // only then remove. This narrows the window where two reclaimers
        // both believe they cleared the same stale lock.
        try {
          const reread = readLockTokenAndAge(lockPath);
          if (reread.token !== null && reread.token === incumbentToken) {
            rmSync(lockPath, { force: true });
          }
        } catch {
          // Lock vanished between our two reads — nothing to do.
        }
        continue;
      }
      if (incumbentToken === null) {
        // Corrupt lock contents (legacy format or partial write). Reclaim it.
        rmSync(lockPath, { force: true });
        continue;
      }
      if (Date.now() - startedAt > GENERATION_LOCK_WAIT_MS) {
        throw new Error('Timed out acquiring skill graph generation lock');
      }
    }
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
  const generationPath = getSkillGraphGenerationPath(options.workspaceRoot);
  const releaseLock = acquireGenerationLock(generationPath);
  let metadata: GenerationMetadata;
  try {
    const current = readSkillGraphGeneration(options.workspaceRoot);
    metadata = {
      generation: current.generation + 1,
      updatedAt: new Date().toISOString(),
      sourceSignature: options.sourceSignature ?? null,
      reason: options.reason,
      state: options.state ?? 'live',
    };
    writeJsonAtomic(generationPath, metadata);
  } finally {
    releaseLock();
  }
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

// Test-only surface: stress + unit tests need to drive the lock primitive
// directly to verify the F-001-A1-03 token-ownership semantics. Production
// code should always go through `publishSkillGraphGeneration`.
export const __testables = {
  acquireGenerationLock,
  GENERATION_LOCK_STALE_MS,
};
