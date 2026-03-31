// ───────────────────────────────────────────────────────────────
// TEST: Hook State Management
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  getProjectHash,
  getStatePath,
  ensureStateDir,
  loadState,
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

    it('sanitizes unsafe characters', () => {
      const path = getStatePath('ses/sion/../bad');
      expect(path).not.toContain('..');
      // The filename part should have slashes replaced with underscores
      expect(path).toMatch(/ses_sion____bad\.json$/);
    });
  });

  describe('ensureStateDir', () => {
    it('creates directory without error', () => {
      expect(() => ensureStateDir()).not.toThrow();
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
});
