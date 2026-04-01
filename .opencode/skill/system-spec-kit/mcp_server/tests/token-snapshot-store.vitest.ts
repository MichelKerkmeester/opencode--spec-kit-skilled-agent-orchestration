// ───────────────────────────────────────────────────────────────
// TEST: Hook-State Token Persistence
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ensureStateDir, updateState, loadState, getStatePath } from '../hooks/claude/hook-state.js';
import { rmSync } from 'node:fs';

describe('hook-state token persistence', () => {
  const sessionId = 'test-snapshot-store';

  beforeEach(() => { ensureStateDir(); });
  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });

  it('stores token metrics in hook state', () => {
    updateState(sessionId, {
      metrics: { estimatedPromptTokens: 5000, estimatedCompletionTokens: 2000, lastTranscriptOffset: 1024 },
    });
    const state = loadState(sessionId);
    expect(state).not.toBeNull();
    expect(state!.metrics.estimatedPromptTokens).toBe(5000);
    expect(state!.metrics.estimatedCompletionTokens).toBe(2000);
    expect(state!.metrics.lastTranscriptOffset).toBe(1024);
  });

  it('updates metrics incrementally', () => {
    updateState(sessionId, {
      metrics: { estimatedPromptTokens: 1000, estimatedCompletionTokens: 500, lastTranscriptOffset: 0 },
    });
    updateState(sessionId, {
      metrics: { estimatedPromptTokens: 3000, estimatedCompletionTokens: 1500, lastTranscriptOffset: 2048 },
    });
    const state = loadState(sessionId);
    expect(state!.metrics.estimatedPromptTokens).toBe(3000);
    expect(state!.metrics.lastTranscriptOffset).toBe(2048);
  });

  it('preserves other state when updating metrics', () => {
    updateState(sessionId, { lastSpecFolder: 'specs/test' });
    updateState(sessionId, {
      metrics: { estimatedPromptTokens: 100, estimatedCompletionTokens: 50, lastTranscriptOffset: 512 },
    });
    const state = loadState(sessionId);
    expect(state!.lastSpecFolder).toBe('specs/test');
    expect(state!.metrics.estimatedPromptTokens).toBe(100);
  });
});
