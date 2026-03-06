// ---------------------------------------------------------------
// TEST: Hooks UX Feedback
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
import { buildMutationHookFeedback, appendAutoSurfaceHints } from '../hooks';

describe('Hooks UX feedback', () => {
  it('buildMutationHookFeedback returns data and expected hints', () => {
    const feedback = buildMutationHookFeedback('save', {
      latencyMs: 9,
      triggerCacheCleared: true,
      constitutionalCacheCleared: false,
      graphSignalsCacheCleared: true,
      coactivationCacheCleared: true,
      toolCacheInvalidated: 3,
    });

    expect(feedback.data).toEqual({
      operation: 'save',
      latencyMs: 9,
      triggerCacheCleared: true,
      constitutionalCacheCleared: false,
      graphSignalsCacheCleared: true,
      coactivationCacheCleared: true,
      toolCacheInvalidated: 3,
    });

    expect(feedback.hints.some((hint) => hint.includes('Post-mutation cache clear'))).toBe(true);
    expect(feedback.hints.some((hint) => hint.includes('Tool cache invalidation'))).toBe(true);
    expect(feedback.hints.some((hint) => hint.includes('non-fatal'))).toBe(true);
  });

  it('appendAutoSurfaceHints injects hints and meta into envelope JSON', () => {
    const result = {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            summary: 'ok',
            data: { status: 'success' },
            hints: [],
            meta: { tokenCount: 12 },
          }),
        },
      ],
    };

    appendAutoSurfaceHints(result, {
      constitutional: [{ id: 1 }, { id: 2 }],
      triggered: [{ id: 3 }],
      surfaced_at: '2026-03-05T10:00:00.000Z',
      latencyMs: 6,
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 2 constitutional and 1 triggered memories (6ms)'))).toBe(true);
    expect(parsed.meta.autoSurface).toEqual({
      constitutionalCount: 2,
      triggeredCount: 1,
      surfaced_at: '2026-03-05T10:00:00.000Z',
      latencyMs: 6,
    });
    expect(parsed.meta.tokenCount).toBe(estimateTokenCount(result.content[0].text));
  });

  it('appendAutoSurfaceHints no-ops on malformed or non-json response', () => {
    const malformedResult = {
      content: [{ type: 'text', text: '{not-json' }],
    };

    expect(() => appendAutoSurfaceHints(malformedResult, { constitutional: [], triggered: [] })).not.toThrow();
    expect(malformedResult.content[0].text).toBe('{not-json');

    const noTextResult = { content: [{ type: 'text' }] };
    expect(() => appendAutoSurfaceHints(noTextResult, { constitutional: [], triggered: [] })).not.toThrow();
  });
});
