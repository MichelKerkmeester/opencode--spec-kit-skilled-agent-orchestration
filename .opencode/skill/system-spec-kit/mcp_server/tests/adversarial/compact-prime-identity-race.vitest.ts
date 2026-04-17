// ───────────────────────────────────────────────────────────────
// ADVERSARIAL TEST: R33-001 Compact-Prime Identity Race (T-PRE-09)
// ───────────────────────────────────────────────────────────────
// Exercises T-HST-07 identity-based `clearCompactPrime()` guard.
// Scenario (per FINAL-synthesis-and-review.md §8.3):
//   1. Consumer A reads compact prime payload #1 (cachedAt = T1).
//   2. Producer writes a fresh compact prime payload #2 (cachedAt = T2 > T1)
//      via compact-inject, overwriting pendingCompactPrime.
//   3. Consumer A calls clearCompactPrime() — expecting to clear ITS OWN
//      (now-superseded) payload #1.
//   4. Post-T-HST-07: the clear MUST NOT erase payload #2, because the
//      expected-identity (cachedAt T1) does not match the on-disk
//      pendingCompactPrime (cachedAt T2).
//
// Pre-T-HST-07 (R33-001 failure mode): clear erased by session ID only,
// deleting payload #2 and silently losing the fresh cached context.
//
// This test proves the identity-guard closes R33-001 with the exact
// interleaving described by FINAL §8.3.

import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  clearCompactPrime,
  ensureStateDir,
  loadState,
  readCompactPrime,
  saveState,
  updateState,
  type HookState,
} from '../../hooks/claude/hook-state.js';

describe.sequential('adversarial: R33-001 compact-prime identity race', () => {
  let sandboxRoot: string | null = null;
  let projectRoot: string | null = null;
  let tempRoot: string | null = null;
  let previousCwd: string;
  let previousTmpdir: string | undefined;

  beforeEach(() => {
    sandboxRoot = mkdtempSync(join(tmpdir(), 'speckit-adv-r33001-'));
    projectRoot = join(sandboxRoot, 'project');
    tempRoot = join(sandboxRoot, 'tmp');
    mkdirSync(projectRoot, { recursive: true });
    mkdirSync(tempRoot, { recursive: true });

    previousCwd = process.cwd();
    previousTmpdir = process.env.TMPDIR;
    process.chdir(projectRoot);
    process.env.TMPDIR = tempRoot;
    ensureStateDir();
  });

  afterEach(() => {
    process.chdir(previousCwd);
    if (previousTmpdir === undefined) {
      delete process.env.TMPDIR;
    } else {
      process.env.TMPDIR = previousTmpdir;
    }
    if (sandboxRoot) {
      rmSync(sandboxRoot, { recursive: true, force: true });
    }
    sandboxRoot = null;
    projectRoot = null;
    tempRoot = null;
  });

  it('refuses to clear pendingCompactPrime when a fresher payload replaced it between read and clear', () => {
    const sessionId = 'r33001-session';
    const olderCachedAt = new Date('2026-04-17T10:00:00.000Z').toISOString();
    const newerCachedAt = new Date('2026-04-17T10:05:00.000Z').toISOString();

    const baseState: HookState = {
      claudeSessionId: sessionId,
      speckitSessionId: null,
      lastSpecFolder: null,
      sessionSummary: null,
      pendingCompactPrime: {
        payload: 'OLDER payload — consumer has already read this',
        cachedAt: olderCachedAt,
      },
      producerMetadata: null,
      metrics: {
        estimatedPromptTokens: 0,
        estimatedCompletionTokens: 0,
        lastTranscriptOffset: 0,
      },
      createdAt: olderCachedAt,
      updatedAt: olderCachedAt,
    };
    expect(saveState(sessionId, baseState)).toBe(true);

    // 1. Consumer A reads the older prime (captures identity for later clear).
    const observedByConsumer = readCompactPrime(sessionId);
    expect(observedByConsumer?.cachedAt).toBe(olderCachedAt);

    // 2. Producer (compact-inject) writes a fresher compact prime.
    const producerResult = updateState(sessionId, {
      pendingCompactPrime: {
        payload: 'NEWER payload — fresh cached context from a later hook',
        cachedAt: newerCachedAt,
      },
    });
    expect(producerResult.persisted).toBe(true);

    // 3. Consumer A tries to clear its (now-superseded) payload using the
    //    identity captured at step 1. T-HST-07 MUST reject this clear.
    const clearResult = clearCompactPrime(sessionId, {
      cachedAt: observedByConsumer!.cachedAt,
      opaqueId: observedByConsumer!.opaqueId ?? null,
    });

    // Post-fix: clear is a no-op on identity mismatch — returns null, does not
    // persist a new state.
    expect(clearResult).toBeNull();

    // 4. The newer payload MUST survive the attempted clear. Pre-T-HST-07,
    //    clearCompactPrime by session ID only would have erased it silently.
    const afterClear = loadState(sessionId);
    expect(afterClear.ok).toBe(true);
    if (!afterClear.ok) {
      throw new Error('expected fresh payload to survive attempted identity-mismatched clear');
    }
    expect(afterClear.state.pendingCompactPrime).not.toBeNull();
    expect(afterClear.state.pendingCompactPrime?.cachedAt).toBe(newerCachedAt);
    expect(afterClear.state.pendingCompactPrime?.payload).toContain('NEWER payload');
  });

  it('permits the clear when the on-disk identity matches the consumer-held identity', () => {
    const sessionId = 'r33001-matching-session';
    const cachedAt = new Date('2026-04-17T11:00:00.000Z').toISOString();

    const state: HookState = {
      claudeSessionId: sessionId,
      speckitSessionId: null,
      lastSpecFolder: null,
      sessionSummary: null,
      pendingCompactPrime: {
        payload: 'Only payload — no concurrent producer',
        cachedAt,
      },
      producerMetadata: null,
      metrics: {
        estimatedPromptTokens: 0,
        estimatedCompletionTokens: 0,
        lastTranscriptOffset: 0,
      },
      createdAt: cachedAt,
      updatedAt: cachedAt,
    };
    expect(saveState(sessionId, state)).toBe(true);

    // Read then clear with matching identity — expected behaviour when no race.
    const observed = readCompactPrime(sessionId);
    expect(observed?.cachedAt).toBe(cachedAt);

    const clearResult = clearCompactPrime(sessionId, {
      cachedAt: observed!.cachedAt,
      opaqueId: observed!.opaqueId ?? null,
    });

    expect(clearResult).not.toBeNull();
    expect(clearResult?.persisted).toBe(true);

    const afterClear = loadState(sessionId);
    expect(afterClear.ok).toBe(true);
    if (!afterClear.ok) {
      throw new Error('expected loadState to succeed after matching clear');
    }
    expect(afterClear.state.pendingCompactPrime).toBeNull();
  });
});
