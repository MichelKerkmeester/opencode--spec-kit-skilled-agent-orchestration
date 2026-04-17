// ───────────────────────────────────────────────────────────────
// TEST: Hook State Management
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs, {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CURRENT_HOOK_STATE_SCHEMA_VERSION,
  cleanStaleStates,
  ensureStateDir,
  getProjectHash,
  getStatePath,
  loadMostRecentState,
  loadState,
  saveState,
  updateState,
  type HookState,
  type PersistedHookState,
} from '../hooks/claude/hook-state.js';

function unwrapState(sessionId: string): PersistedHookState | null {
  const result = loadState(sessionId);
  return result.ok ? result.state : null;
}

describe('hook state management', () => {
  const testSessionId = 'test-session-123';

  afterEach(() => {
    vi.restoreAllMocks();
    try {
      rmSync(getStatePath(testSessionId));
    } catch {
      // ok
    }
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
      const filePath = getStatePath('session-abc');
      expect(filePath).toContain('.json');
      expect(filePath).toContain('speckit-claude-hooks');
    });

    it('hashes session ids into fixed-length filenames', () => {
      const sessionId = 'ses/sion/../bad';
      const filePath = getStatePath(sessionId);
      expect(filePath).not.toContain('..');
      expect(filePath).toMatch(/[a-f0-9]{16}\.json$/);
      expect(filePath).toContain(createHash('sha256').update(sessionId).digest('hex').slice(0, 16));
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
    it('returns a typed not_found result for a missing session', () => {
      expect(loadState('non-existent-session')).toMatchObject({
        ok: false,
        reason: 'not_found',
      });
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

      expect(saveState(testSessionId, state)).toBe(true);

      const loaded = loadState(testSessionId);
      expect(loaded.ok).toBe(true);
      expect(loaded).toMatchObject({
        ok: true,
        migrated: false,
      });
      if (!loaded.ok) {
        throw new Error('expected saved hook state to load');
      }
      expect(loaded.state.schemaVersion).toBe(CURRENT_HOOK_STATE_SCHEMA_VERSION);
      expect(loaded.state.claudeSessionId).toBe(testSessionId);
      expect(loaded.state.speckitSessionId).toBe('sk-123');
      expect(loaded.state.lastSpecFolder).toBe('specs/test');
      expect(statSync(getStatePath(testSessionId)).mode & 0o777).toBe(0o600);
    });

    it('quarantines parse failures to a .bad sibling', () => {
      ensureStateDir();
      const statePath = getStatePath(testSessionId);
      const quarantinedPath = `${statePath}.bad`;
      writeFileSync(statePath, '{not-valid-json', 'utf-8');

      const loaded = loadState(testSessionId);
      expect(loaded).toMatchObject({
        ok: false,
        reason: 'parse_error',
        path: statePath,
        quarantinedPath,
      });
      expect(existsSync(statePath)).toBe(false);
      expect(existsSync(quarantinedPath)).toBe(true);
    });

    it('rejects schema mismatches and quarantines them', () => {
      ensureStateDir();
      const statePath = getStatePath(testSessionId);
      const quarantinedPath = `${statePath}.bad`;
      writeFileSync(statePath, JSON.stringify({
        schemaVersion: 999,
        claudeSessionId: testSessionId,
        speckitSessionId: null,
        lastSpecFolder: 'specs/test',
        sessionSummary: null,
        pendingCompactPrime: null,
        producerMetadata: null,
        metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }), 'utf-8');

      const loaded = loadState(testSessionId);
      expect(loaded).toMatchObject({
        ok: false,
        reason: 'schema_mismatch',
        path: statePath,
        quarantinedPath,
      });
      expect(existsSync(statePath)).toBe(false);
      expect(existsSync(quarantinedPath)).toBe(true);
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
      expect(unwrapState(concurrentSessionId)?.lastSpecFolder).toBe('specs/a');

      try {
        rmSync(getStatePath(concurrentSessionId));
      } catch {
        // ok
      }
    });
  });

  describe('updateState', () => {
    it('returns merged + persisted metadata when creating a new state', () => {
      ensureStateDir();
      const result = updateState('new-session', { lastSpecFolder: 'specs/new' });
      expect(result).toMatchObject({
        ok: true,
        persisted: true,
        path: getStatePath('new-session'),
      });
      expect(result.merged.lastSpecFolder).toBe('specs/new');
      expect(result.merged.claudeSessionId).toBe('new-session');
      expect(result.merged.speckitSessionId).toBeNull();
      expect(result.merged.producerMetadata).toBeNull();
      try {
        rmSync(getStatePath('new-session'));
      } catch {
        // ok
      }
    });

    it('merges patch fields without pretending durability failed writes succeeded', () => {
      ensureStateDir();
      updateState(testSessionId, { lastSpecFolder: 'specs/first' });
      const updated = updateState(testSessionId, {
        pendingCompactPrime: { payload: 'test', cachedAt: new Date().toISOString() },
      });

      expect(updated.ok).toBe(true);
      expect(updated.persisted).toBe(true);
      expect(updated.merged.lastSpecFolder).toBe('specs/first');
      expect(updated.merged.pendingCompactPrime).not.toBeNull();
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
        expect(state.ok).toBe(true);
        if (!state.ok) {
          throw new Error('expected scoped hook state to be found');
        }
        expect(state.errors).toEqual([]);
        expect(state.state.claudeSessionId).toBe(matchingSessionId);
        expect(state.state.lastSpecFolder).toBe('specs/matching');

        try { rmSync(matchingPath); } catch { /* ok */ }
        try { rmSync(mismatchedPath); } catch { /* ok */ }
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });

    it('fails closed when the caller cannot prove scope', () => {
      expect(loadMostRecentState()).toMatchObject({
        ok: false,
        reason: 'scope_unknown_fail_closed',
        errors: [],
      });
    });

    it('returns not_found when the newest state is older than 24 hours', () => {
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
        })).toMatchObject({
          ok: false,
          reason: 'not_found',
          errors: [],
        });
        try { rmSync(stalePath); } catch { /* ok */ }
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });

    it('quarantines malformed sibling files instead of aborting the whole scan', () => {
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
        writeFileSync(invalidPath, '{not-valid-json', 'utf-8');

        const result = loadMostRecentState({ scope: { specFolder: 'specs/matching' } });
        expect(result.ok).toBe(true);
        if (!result.ok) {
          throw new Error('expected valid sibling to survive poisoned scan');
        }
        expect(result.state.claudeSessionId).toBe(matchingSessionId);
        expect(result.errors).toContainEqual({
          path: invalidPath,
          reason: 'parse_error',
          detail: expect.any(String),
          quarantinedPath: `${invalidPath}.bad`,
        });
        expect(existsSync(invalidPath)).toBe(false);
        expect(existsSync(`${invalidPath}.bad`)).toBe(true);

        try { rmSync(getStatePath(matchingSessionId)); } catch { /* ok */ }
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
        expect(result.errors).toContainEqual({
          path: blockedPath,
          reason: 'read_error',
          detail: expect.any(String),
        });
        expect(existsSync(stalePath)).toBe(false);
        expect(existsSync(blockedPath)).toBe(true);
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });
  });
});
