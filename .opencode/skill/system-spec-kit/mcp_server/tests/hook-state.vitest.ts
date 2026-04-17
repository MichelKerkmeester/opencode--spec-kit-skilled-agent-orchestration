// ───────────────────────────────────────────────────────────────
// TEST: Hook State Management
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, afterEach, vi } from 'vitest';
import fs, { mkdirSync, rmSync, existsSync, statSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import {
  getProjectHash,
  getStatePath,
  ensureStateDir,
  loadState,
  loadMostRecentState,
  saveState,
  updateState,
  cleanStaleStates,
  type HookState,
} from '../hooks/claude/hook-state.js';

describe('hook state management', () => {
  const testSessionId = 'test-session-123';

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up test state files
    try {
      const statePath = getStatePath(testSessionId);
      if (existsSync(statePath)) {
        rmSync(statePath);
      }
    } catch { /* ok */ }
  });

  describe('getProjectHash', () => {
    it('returns a 12-char hex string', () => {
      const hash = getProjectHash();
      expect(hash).toMatch(/^[a-f0-9]{12}$/);
    });

    it('is deterministic', () => {
      expect(getProjectHash()).toBe(getProjectHash());
    });
  });

  describe('getStatePath', () => {
    it('returns a .json file path', () => {
      const path = getStatePath('session-abc');
      expect(path).toContain('.json');
      expect(path).toContain('speckit-claude-hooks');
    });

    it('hashes session ids into fixed-length filenames', () => {
      const sessionId = 'ses/sion/../bad';
      const path = getStatePath(sessionId);
      expect(path).not.toContain('..');
      expect(path).toMatch(/[a-f0-9]{16}\.json$/);
      expect(path).toContain(createHash('sha256').update(sessionId).digest('hex').slice(0, 16));
    });
  });

  describe('ensureStateDir', () => {
    it('creates directory without error', () => {
      expect(() => ensureStateDir()).not.toThrow();
    });

    it('uses restrictive directory permissions', () => {
      const originalCwd = process.cwd();
      const projectCwd = join(tmpdir(), `speckit-state-perms-${Date.now()}`);
      mkdirSync(projectCwd, { recursive: true });

      let stateDir = '';
      try {
        process.chdir(projectCwd);
        ensureStateDir();
        stateDir = join(tmpdir(), 'speckit-claude-hooks', getProjectHash());
        const mode = statSync(stateDir).mode & 0o777;
        expect(mode).toBe(0o700);
      } finally {
        process.chdir(originalCwd);
        if (stateDir) rmSync(stateDir, { recursive: true, force: true });
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });
  });

  describe('loadState / saveState', () => {
    it('returns null for non-existent session', () => {
      expect(loadState('non-existent-session')).toBeNull();
    });

    it('saves and loads state correctly', () => {
      ensureStateDir();
      const state: HookState = {
        claudeSessionId: testSessionId,
        speckitSessionId: 'sk-123',
        lastSpecFolder: 'specs/test',
        sessionSummary: null,
        pendingCompactPrime: null,
        producerMetadata: null,
        metrics: { estimatedPromptTokens: 100, estimatedCompletionTokens: 50, lastTranscriptOffset: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveState(testSessionId, state);
      const loaded = loadState(testSessionId);
      expect(loaded).not.toBeNull();
      expect(loaded!.claudeSessionId).toBe(testSessionId);
      expect(loaded!.speckitSessionId).toBe('sk-123');
      expect(loaded!.lastSpecFolder).toBe('specs/test');
      expect(statSync(getStatePath(testSessionId)).mode & 0o777).toBe(0o600);
    });

    it('uses unique temp paths for overlapping writes to the same session', () => {
      ensureStateDir();
      const concurrentSessionId = `concurrent-session-${Date.now()}`;
      const stateA: HookState = {
        claudeSessionId: concurrentSessionId,
        speckitSessionId: 'sk-a',
        lastSpecFolder: 'specs/a',
        sessionSummary: null,
        pendingCompactPrime: null,
        producerMetadata: null,
        metrics: { estimatedPromptTokens: 1, estimatedCompletionTokens: 2, lastTranscriptOffset: 3 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const stateB: HookState = {
        ...stateA,
        speckitSessionId: 'sk-b',
        lastSpecFolder: 'specs/b',
      };
      const tempPaths: string[] = [];
      let nestedWriteTriggered = false;
      const originalWriteFileSync = fs.writeFileSync.bind(fs) as typeof fs.writeFileSync;

      vi.spyOn(fs, 'writeFileSync').mockImplementation((...args: Parameters<typeof fs.writeFileSync>) => {
        const [filePath] = args;

        if (typeof filePath === 'string' && filePath.includes('.tmp-')) {
          tempPaths.push(filePath);
          originalWriteFileSync(...args);
          if (!nestedWriteTriggered) {
            nestedWriteTriggered = true;
            expect(saveState(concurrentSessionId, stateB)).toBe(true);
          }
          return;
        }

        originalWriteFileSync(...args);
      });

      expect(saveState(concurrentSessionId, stateA)).toBe(true);
      expect(tempPaths).toHaveLength(2);
      expect(new Set(tempPaths).size).toBe(2);
      const counterMatches = tempPaths.map((tempPath) => tempPath.match(new RegExp(`\\.tmp-${process.pid}-(\\d+)-([0-9a-f]{8})$`)));

      expect(counterMatches[0]).not.toBeNull();
      expect(counterMatches[1]).not.toBeNull();
      expect(new Set(counterMatches.map((match) => match?.[1])).size).toBe(2);
      expect(loadState(concurrentSessionId)?.lastSpecFolder).toBe('specs/a');

      try {
        rmSync(getStatePath(concurrentSessionId));
      } catch {
        // ok
      }
    });
  });

  describe('updateState', () => {
    it('creates new state if none exists', () => {
      ensureStateDir();
      const state = updateState('new-session', { lastSpecFolder: 'specs/new' });
      expect(state.lastSpecFolder).toBe('specs/new');
      expect(state.claudeSessionId).toBe('new-session');
      expect(state.speckitSessionId).toBeNull();
      expect(state.producerMetadata).toBeNull();
      // Clean up
      try { rmSync(getStatePath('new-session')); } catch { /* ok */ }
    });

    it('merges patch into existing state', () => {
      ensureStateDir();
      updateState(testSessionId, { lastSpecFolder: 'specs/first' });
      const updated = updateState(testSessionId, { pendingCompactPrime: { payload: 'test', cachedAt: new Date().toISOString() } });
      expect(updated.lastSpecFolder).toBe('specs/first');
      expect(updated.pendingCompactPrime).not.toBeNull();
    });
  });

  describe('loadMostRecentState', () => {
    it('returns the newest state file that matches the requested scope', () => {
      const originalCwd = process.cwd();
      const projectCwd = join(tmpdir(), `speckit-recent-state-${Date.now()}`);
      mkdirSync(projectCwd, { recursive: true });

      try {
        process.chdir(projectCwd);
        ensureStateDir();
        const matchingSessionId = 'matching-session';
        const mismatchedSessionId = 'mismatched-session';

        const baseState: Omit<HookState, 'claudeSessionId'> = {
          speckitSessionId: 'sk',
          lastSpecFolder: 'specs/matching',
          sessionSummary: { text: 'Summary', extractedAt: new Date().toISOString() },
          pendingCompactPrime: null,
          producerMetadata: null,
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        saveState(matchingSessionId, { ...baseState, claudeSessionId: matchingSessionId });
        saveState(mismatchedSessionId, {
          ...baseState,
          claudeSessionId: mismatchedSessionId,
          lastSpecFolder: 'specs/mismatched',
        });

        const matchingPath = getStatePath(matchingSessionId);
        const mismatchedPath = getStatePath(mismatchedSessionId);
        const matchingTime = new Date(Date.now() - 5 * 60 * 1000);
        const mismatchedTime = new Date();
        utimesSync(matchingPath, matchingTime, matchingTime);
        utimesSync(mismatchedPath, mismatchedTime, mismatchedTime);

        const state = loadMostRecentState({ scope: { specFolder: 'specs/matching' } });
        expect(state.errors).toEqual([]);
        expect(state.states[0]?.claudeSessionId).toBe(matchingSessionId);
        expect(state.states[0]?.lastSpecFolder).toBe('specs/matching');

        try { rmSync(matchingPath); } catch { /* ok */ }
        try { rmSync(mismatchedPath); } catch { /* ok */ }
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });

    it('fails closed when the caller cannot prove scope', () => {
      expect(loadMostRecentState()).toEqual({ states: [], errors: [] });
    });

    it('returns null when the newest state is older than 24 hours', () => {
      const originalCwd = process.cwd();
      const projectCwd = join(tmpdir(), `speckit-stale-state-${Date.now()}`);
      mkdirSync(projectCwd, { recursive: true });

      try {
        process.chdir(projectCwd);
        ensureStateDir();
        const staleSessionId = 'stale-session';
        const staleState: HookState = {
          claudeSessionId: staleSessionId,
          speckitSessionId: 'sk-stale',
          lastSpecFolder: 'specs/stale',
          sessionSummary: null,
          pendingCompactPrime: null,
          producerMetadata: null,
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveState(staleSessionId, staleState);

        const stalePath = getStatePath(staleSessionId);
        const staleTime = new Date(Date.now() - 26 * 60 * 60 * 1000);
        utimesSync(stalePath, staleTime, staleTime);

        expect(loadMostRecentState({
          scope: { specFolder: 'specs/stale', claudeSessionId: staleSessionId },
        })).toEqual({ states: [], errors: [] });
        try { rmSync(stalePath); } catch { /* ok */ }
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });

    it('skips malformed sibling files instead of aborting the whole scan', () => {
      const originalCwd = process.cwd();
      const projectCwd = join(tmpdir(), `speckit-poison-pill-state-${Date.now()}`);
      mkdirSync(projectCwd, { recursive: true });

      try {
        process.chdir(projectCwd);
        ensureStateDir();
        const matchingSessionId = 'matching-session';
        const validState: HookState = {
          claudeSessionId: matchingSessionId,
          speckitSessionId: 'sk-valid',
          lastSpecFolder: 'specs/matching',
          sessionSummary: { text: 'Valid sibling survives', extractedAt: new Date().toISOString() },
          pendingCompactPrime: null,
          producerMetadata: null,
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        saveState(matchingSessionId, validState);
        const invalidPath = join(dirname(getStatePath(matchingSessionId)), 'poison-pill.json');
        fs.writeFileSync(invalidPath, '{not-valid-json', 'utf-8');

        const result = loadMostRecentState({ scope: { specFolder: 'specs/matching' } });
        expect(result.states).toHaveLength(1);
        expect(result.states[0]?.claudeSessionId).toBe(matchingSessionId);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]?.path).toBe(invalidPath);
        expect(result.errors[0]?.reason.length).toBeGreaterThan(0);

        try { rmSync(getStatePath(matchingSessionId)); } catch { /* ok */ }
        try { rmSync(invalidPath); } catch { /* ok */ }
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });
  });

  describe('cleanStaleStates', () => {
    it('returns removed, skipped, and errors when one stale entry cannot be unlinked', () => {
      const originalCwd = process.cwd();
      const projectCwd = join(tmpdir(), `speckit-clean-state-${Date.now()}`);
      mkdirSync(projectCwd, { recursive: true });

      try {
        process.chdir(projectCwd);
        ensureStateDir();
        const staleSessionId = 'stale-cleanup-session';
        const staleState: HookState = {
          claudeSessionId: staleSessionId,
          speckitSessionId: 'sk-clean',
          lastSpecFolder: 'specs/cleanup',
          sessionSummary: null,
          pendingCompactPrime: null,
          producerMetadata: null,
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        saveState(staleSessionId, staleState);
        const stalePath = getStatePath(staleSessionId);
        const blockedPath = join(dirname(stalePath), 'blocked.json');
        mkdirSync(blockedPath, { recursive: true });
        const staleTime = new Date(Date.now() - 26 * 60 * 60 * 1000);
        utimesSync(stalePath, staleTime, staleTime);
        utimesSync(blockedPath, staleTime, staleTime);

        const result = cleanStaleStates(24 * 60 * 60 * 1000);
        expect(result.removed).toBe(1);
        expect(result.skipped).toBe(1);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]?.path).toBe(blockedPath);
        expect(result.errors[0]?.reason.length).toBeGreaterThan(0);
        expect(existsSync(stalePath)).toBe(false);
        expect(existsSync(blockedPath)).toBe(true);
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });
  });
});
