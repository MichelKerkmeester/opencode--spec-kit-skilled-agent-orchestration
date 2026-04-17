// ───────────────────────────────────────────────────────────────
// TEST: P0-D TOCTOU Cleanup Regression
// ───────────────────────────────────────────────────────────────

import fs, { existsSync, mkdirSync, mkdtempSync, rmSync, utimesSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  cleanStaleStates,
  ensureStateDir,
  getStatePath,
  loadMostRecentState,
  saveState,
  type HookState,
} from '../hooks/claude/hook-state.js';

describe.sequential('P0-D TOCTOU cleanup regression', () => {
  let sandboxRoot: string | null = null;
  let projectRoot: string | null = null;
  let tempRoot: string | null = null;
  let previousCwd: string;
  let previousTmpdir: string | undefined;

  beforeEach(() => {
    sandboxRoot = mkdtempSync(join(tmpdir(), 'speckit-p0-d-cleanup-'));
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

  it('skips deleting a fresh generation that replaces a stale file during finalize cleanup', () => {
    const sessionId = 'live-session';
    const staleState: HookState = {
      claudeSessionId: sessionId,
      speckitSessionId: 'stale-session',
      lastSpecFolder: 'specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review',
      sessionSummary: { text: 'stale state', extractedAt: new Date(0).toISOString() },
      pendingCompactPrime: null,
      producerMetadata: null,
      metrics: { estimatedPromptTokens: 10, estimatedCompletionTokens: 5, lastTranscriptOffset: 64 },
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    };
    const freshState: HookState = {
      ...staleState,
      speckitSessionId: 'fresh-session',
      sessionSummary: { text: 'fresh state survives finalize', extractedAt: new Date().toISOString() },
      metrics: { estimatedPromptTokens: 120, estimatedCompletionTokens: 45, lastTranscriptOffset: 2048 },
    };

    expect(saveState(sessionId, staleState)).toBe(true);
    const statePath = getStatePath(sessionId);
    const staleTime = new Date(Date.now() - 26 * 60 * 60 * 1000);
    utimesSync(statePath, staleTime, staleTime);

    const logLines: string[] = [];
    const originalOpenSync = fs.openSync.bind(fs);
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk: string | Uint8Array) => {
      logLines.push(typeof chunk === 'string' ? chunk : chunk.toString('utf-8'));
      return true;
    });

    let replacedDuringCleanup = false;
    const openSpy = vi.spyOn(fs, 'openSync').mockImplementation((...args: Parameters<typeof fs.openSync>) => {
      if (!replacedDuringCleanup && args[0] === statePath) {
        replacedDuringCleanup = true;
        expect(saveState(sessionId, freshState)).toBe(true);
      }
      return originalOpenSync(...args);
    });

    try {
      const cleanup = cleanStaleStates(24 * 60 * 60 * 1000);
      const recovered = loadMostRecentState({ scope: { claudeSessionId: sessionId } });

      expect(replacedDuringCleanup).toBe(true);
      expect(cleanup.removed).toBe(0);
      expect(cleanup.skipped).toBe(1);
      expect(cleanup.errors).toEqual([
        {
          path: statePath,
          reason: 'read_error',
          detail: 'identity_changed_before_cleanup',
        },
      ]);
      expect(logLines.join('')).toContain('clean_stale_states_skipped');
      expect(logLines.join('')).toContain('identity_changed_before_cleanup');
      expect(existsSync(statePath)).toBe(true);
      expect(recovered.ok).toBe(true);
      if (!recovered.ok) {
        throw new Error('expected fresh replacement state to survive cleanup');
      }
      expect(recovered.errors).toEqual([]);
      expect(recovered.state.sessionSummary?.text).toBe('fresh state survives finalize');
      expect(recovered.state.metrics.lastTranscriptOffset).toBe(2048);
    } finally {
      openSpy.mockRestore();
      stderrSpy.mockRestore();
    }
  });
});
