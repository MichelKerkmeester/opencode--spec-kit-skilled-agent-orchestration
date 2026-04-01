// ───────────────────────────────────────────────────────────────
// TEST: Hook-State Session Resume
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ensureStateDir, updateState, loadState, getStatePath } from '../hooks/claude/hook-state.js';
import { rmSync } from 'node:fs';

describe('hook-state session resume', () => {
  const sessionId = 'test-resume-session';

  beforeEach(() => { ensureStateDir(); });
  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });

  it('recovers session state for resume', () => {
    updateState(sessionId, {
      lastSpecFolder: 'specs/024-compact-code-graph',
      metrics: { estimatedPromptTokens: 10000, estimatedCompletionTokens: 5000, lastTranscriptOffset: 4096 },
    });
    const state = loadState(sessionId);
    expect(state).not.toBeNull();
    expect(state!.lastSpecFolder).toBe('specs/024-compact-code-graph');
    expect(state!.metrics.estimatedPromptTokens).toBe(10000);
  });

  it('handles missing session gracefully', () => {
    const state = loadState('nonexistent-session');
    expect(state).toBeNull();
  });

  it('preserves compact prime across resume', () => {
    updateState(sessionId, {
      pendingCompactPrime: { payload: 'test context', cachedAt: new Date().toISOString() },
      lastSpecFolder: 'specs/test',
    });
    const state = loadState(sessionId);
    expect(state!.pendingCompactPrime!.payload).toBe('test context');
    expect(state!.lastSpecFolder).toBe('specs/test');
  });

  it('session ID is preserved across updates', () => {
    updateState(sessionId, { lastSpecFolder: 'specs/a' });
    updateState(sessionId, { lastSpecFolder: 'specs/b' });
    const state = loadState(sessionId);
    expect(state!.claudeSessionId).toBe(sessionId);
    expect(state!.lastSpecFolder).toBe('specs/b');
  });
});
