import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import {
  clearCacheInvalidationListeners,
  onCacheInvalidation,
} from '../../skill_advisor/lib/freshness/cache-invalidation.js';
import {
  publishSkillGraphGeneration,
  __testables as generationTestables,
} from '../../skill_advisor/lib/freshness/generation.js';
import {
  AdvisorPromptCache,
  ADVISOR_PROMPT_CACHE_TTL_MS,
} from '../../skill_advisor/lib/prompt-cache.js';

describe('sa-007 — Generation cache invalidation', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-007-'));
    clearCacheInvalidationListeners();
  });

  afterEach(() => {
    clearCacheInvalidationListeners();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function cacheKey(cache: AdvisorPromptCache<string>, sourceSignature: string): string {
    return cache.makeKey({
      canonicalPrompt: 'stress prompt',
      sourceSignature,
      workspaceRoot: tmpDir,
      runtime: 'vitest',
      maxTokens: 80,
    });
  }

  it('makes pre-bump prompt-cache entries inaccessible through the current generation signature', async () => {
    const cache = new AdvisorPromptCache<string>();
    const beforeKey = cacheKey(cache, 'generation-0');
    cache.set({
      key: beforeKey,
      sourceSignature: 'generation-0',
      value: 'before',
      skillLabels: ['alpha'],
      nowMs: 0,
    });

    let currentSignature = 'generation-0';
    onCacheInvalidation((event) => {
      currentSignature = `generation-${event.generation}`;
      cache.invalidateSourceSignatureChange(currentSignature);
    });
    for (let index = 0; index < 10; index += 1) {
      publishSkillGraphGeneration({ workspaceRoot: tmpDir, reason: `bump-${index}` });
    }

    expect(cache.get(beforeKey, 1)).toBeNull();
    expect(cache.get(cacheKey(cache, currentSignature), 1)).toBeNull();
    expect(cache.size()).toBe(0);
  });

  it('does not let the 5 minute TTL outlive a generation bump', async () => {
    const cache = new AdvisorPromptCache<string>(ADVISOR_PROMPT_CACHE_TTL_MS);
    let currentSignature = 'generation-0';
    const key = cacheKey(cache, currentSignature);
    cache.set({
      key,
      sourceSignature: currentSignature,
      value: 'ttl-protected-entry',
      skillLabels: ['alpha'],
      nowMs: 1,
    });
    onCacheInvalidation((event) => {
      currentSignature = `generation-${event.generation}`;
      cache.invalidateSourceSignatureChange(currentSignature);
    });

    publishSkillGraphGeneration({ workspaceRoot: tmpDir, reason: 'ttl-bypass' });

    expect(ADVISOR_PROMPT_CACHE_TTL_MS).toBe(300_000);
    expect(cache.get(key, 2)).toBeNull();
    expect(cache.get(cacheKey(cache, currentSignature), 2)).toBeNull();
  });
});

// F-001-A1-03: token-checked generation lock release.
//
// Pre-fix bug: `acquireGenerationLock()` stored only `pid:timestamp`, the
// release closure unconditionally removed the lock file, AND the stale path
// unconditionally removed any existing lock. That meant publisher A could
// pause longer than GENERATION_LOCK_STALE_MS, publisher B would reclaim the
// stale lock, then when A resumed its release would happily delete B's lock,
// allowing a third writer to enter while B still believed it owned the lock.
//
// The fix tags every acquisition with a random token and only deletes the
// lock if the token still matches the holder. This stress test reproduces
// the exact pause-and-resume sequence and asserts that A's release is a
// no-op for B's lock.
describe('sa-007b — Generation lock token ownership (F-001-A1-03)', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-007b-'));
    clearCacheInvalidationListeners();
  });

  afterEach(() => {
    clearCacheInvalidationListeners();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function lockTargetPath(): string {
    const filePath = join(tmpDir, '.advisor-state', 'generation.json');
    mkdirSync(dirname(filePath), { recursive: true });
    return filePath;
  }

  function lockFilePath(target: string): string {
    return `${target}.lock`;
  }

  function readLockToken(lockPath: string): string | null {
    if (!existsSync(lockPath)) return null;
    const raw = readFileSync(lockPath, 'utf8').trim();
    const parts = raw.split(':');
    if (parts.length < 3) return null;
    return parts.slice(2).join(':');
  }

  it("publisher A's release does NOT delete publisher B's lock after stale reclamation", () => {
    const target = lockTargetPath();
    const lockPath = lockFilePath(target);

    // Step 1: publisher A acquires.
    const releaseA = generationTestables.acquireGenerationLock(target);
    const tokenA = readLockToken(lockPath);
    expect(tokenA).not.toBeNull();
    expect(tokenA?.length).toBeGreaterThanOrEqual(32);

    // Step 2: simulate publisher A pausing past the stale threshold by
    // rewriting the lock file's timestamp to the distant past while
    // preserving A's token. This reproduces the real-world scenario where
    // A's process has been suspended (GC pause, OS scheduler, debugger,
    // etc.) longer than GENERATION_LOCK_STALE_MS without releasing.
    const ancientTimestamp = Date.now() - generationTestables.GENERATION_LOCK_STALE_MS - 5_000;
    writeFileSync(lockPath, `${process.pid}:${ancientTimestamp}:${tokenA}\n`, 'utf8');

    // Step 3: publisher B acquires while A is "asleep" and observes the
    // lock as stale, reclaims, and writes its own token.
    const releaseB = generationTestables.acquireGenerationLock(target);
    const tokenB = readLockToken(lockPath);
    expect(tokenB).not.toBeNull();
    expect(tokenB).not.toBe(tokenA);

    // Step 4: publisher A finally resumes. Its release MUST be a no-op
    // because the on-disk token no longer matches A's. With the pre-fix
    // bug, releaseA would delete the lock file, leaving B with no lock at
    // all and allowing a hypothetical publisher C to enter concurrently.
    releaseA();
    expect(existsSync(lockPath)).toBe(true);
    expect(readLockToken(lockPath)).toBe(tokenB);

    // Step 5: publisher B releases normally. Now the lock file is gone.
    releaseB();
    expect(existsSync(lockPath)).toBe(false);
  });

  it('two publishers cannot both believe they hold the lock simultaneously', () => {
    const target = lockTargetPath();
    const lockPath = lockFilePath(target);

    const releaseA = generationTestables.acquireGenerationLock(target);
    const tokenA = readLockToken(lockPath);

    // Force-stale A by rewriting the timestamp.
    const ancientTimestamp = Date.now() - generationTestables.GENERATION_LOCK_STALE_MS - 5_000;
    writeFileSync(lockPath, `${process.pid}:${ancientTimestamp}:${tokenA}\n`, 'utf8');

    // B acquires by reclaiming.
    const releaseB = generationTestables.acquireGenerationLock(target);
    const tokenB = readLockToken(lockPath);
    expect(tokenB).not.toBe(tokenA);

    // A's release must not affect B.
    releaseA();
    expect(readLockToken(lockPath)).toBe(tokenB);

    // While B still holds, a third publisher C trying to acquire must
    // either (a) wait, (b) time out, or (c) re-stale-reclaim — but it must
    // NEVER see an empty lock slot just because A released.
    expect(() => {
      const releaseC = generationTestables.acquireGenerationLock(target);
      // If somehow we did acquire (which we should NOT in normal time
      // because B's lock is fresh), at least confirm the token changed.
      const tokenC = readLockToken(lockPath);
      expect(tokenC).not.toBe(tokenB);
      releaseC();
    }).toThrow(/Timed out/);

    releaseB();
  });
});
