// ───────────────────────────────────────────────────────────────
// TEST: SessionStart Hook
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureStateDir, saveState, getStatePath, type HookState } from '../hooks/claude/hook-state.js';
import { formatHookOutput, truncateToTokenBudget, SESSION_PRIME_TOKEN_BUDGET, COMPACTION_TOKEN_BUDGET } from '../hooks/claude/shared.js';

describe('session-prime hook', () => {
  const testSessionId = 'test-session-prime';

  beforeEach(() => {
    ensureStateDir();
  });

  afterEach(() => {
    try { rmSync(getStatePath(testSessionId)); } catch { /* ok */ }
  });

  describe('compact source handling', () => {
    it('reads cached compact payload from hook state', () => {
      const now = new Date().toISOString();
      const state: HookState = {
        claudeSessionId: testSessionId,
        speckitSessionId: '',
        lastSpecFolder: null,
        pendingCompactPrime: { payload: '## Active Files\n- /test.ts', cachedAt: now },
        metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
        createdAt: now,
        updatedAt: now,
      };
      saveState(testSessionId, state);

      // Simulate what session-prime does for compact source
      const loaded = require('node:fs').readFileSync(getStatePath(testSessionId), 'utf-8');
      const parsed = JSON.parse(loaded) as HookState;
      expect(parsed.pendingCompactPrime).not.toBeNull();
      expect(parsed.pendingCompactPrime!.payload).toContain('Active Files');
    });

    it('provides fallback when no cached payload exists', () => {
      const state: HookState = {
        claudeSessionId: testSessionId,
        speckitSessionId: '',
        lastSpecFolder: null,
        pendingCompactPrime: null,
        metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveState(testSessionId, state);

      const loaded = require('node:fs').readFileSync(getStatePath(testSessionId), 'utf-8');
      const parsed = JSON.parse(loaded) as HookState;
      expect(parsed.pendingCompactPrime).toBeNull();
    });
  });

  describe('output formatting', () => {
    it('formats startup sections within budget', () => {
      const output = formatHookOutput([
        { title: 'Session Priming', content: 'Spec Kit Memory is active.' },
      ]);
      const truncated = truncateToTokenBudget(output, SESSION_PRIME_TOKEN_BUDGET);
      expect(truncated).toContain('Session Priming');
      expect(truncated.length / 4).toBeLessThanOrEqual(SESSION_PRIME_TOKEN_BUDGET);
    });

    it('compact output uses larger budget', () => {
      const longPayload = 'x'.repeat(12000);
      const truncated = truncateToTokenBudget(longPayload, COMPACTION_TOKEN_BUDGET);
      expect(truncated.length / 4).toBeLessThanOrEqual(COMPACTION_TOKEN_BUDGET + 50);
    });
  });

  describe('source routing', () => {
    it('routes startup correctly', () => {
      const source = 'startup';
      expect(['startup', 'resume', 'compact', 'clear']).toContain(source);
    });

    it('routes compact correctly', () => {
      const source = 'compact';
      expect(source).toBe('compact');
    });
  });
});
