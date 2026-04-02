// ───────────────────────────────────────────────────────────────
// TEST: Hook State Management
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync, statSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
  });

  describe('updateState', () => {
    it('creates new state if none exists', () => {
      ensureStateDir();
      const state = updateState('new-session', { lastSpecFolder: 'specs/new' });
      expect(state.lastSpecFolder).toBe('specs/new');
      expect(state.claudeSessionId).toBe('new-session');
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
    it('returns the newest state file when within the recency window', () => {
      const originalCwd = process.cwd();
      const projectCwd = join(tmpdir(), `speckit-recent-state-${Date.now()}`);
      mkdirSync(projectCwd, { recursive: true });

      try {
        process.chdir(projectCwd);
        ensureStateDir();
        const olderSessionId = 'older-session';
        const newerSessionId = 'newer-session';

        const baseState: Omit<HookState, 'claudeSessionId'> = {
          speckitSessionId: 'sk',
          lastSpecFolder: 'specs/test',
          sessionSummary: { text: 'Summary', extractedAt: new Date().toISOString() },
          pendingCompactPrime: null,
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        saveState(olderSessionId, { ...baseState, claudeSessionId: olderSessionId });
        saveState(newerSessionId, { ...baseState, claudeSessionId: newerSessionId });

        const olderPath = getStatePath(olderSessionId);
        const newerPath = getStatePath(newerSessionId);
        const olderTime = new Date(Date.now() - 5 * 60 * 1000);
        const newerTime = new Date();
        utimesSync(olderPath, olderTime, olderTime);
        utimesSync(newerPath, newerTime, newerTime);

        const state = loadMostRecentState();
        expect(state?.claudeSessionId).toBe(newerSessionId);

        try { rmSync(olderPath); } catch { /* ok */ }
        try { rmSync(newerPath); } catch { /* ok */ }
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
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
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveState(staleSessionId, staleState);

        const stalePath = getStatePath(staleSessionId);
        const staleTime = new Date(Date.now() - 26 * 60 * 60 * 1000);
        utimesSync(stalePath, staleTime, staleTime);

        expect(loadMostRecentState()).toBeNull();
        try { rmSync(stalePath); } catch { /* ok */ }
      } finally {
        process.chdir(originalCwd);
        rmSync(projectCwd, { recursive: true, force: true });
      }
    });
  });
});
