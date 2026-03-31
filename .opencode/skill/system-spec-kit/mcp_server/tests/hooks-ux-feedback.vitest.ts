// TEST: Hooks UX Feedback
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
      errors: [],
    });

    expect(feedback.data).toEqual({
      operation: 'save',
      latencyMs: 9,
      triggerCacheCleared: true,
      constitutionalCacheCleared: false,
      graphSignalsCacheCleared: true,
      coactivationCacheCleared: true,
      toolCacheInvalidated: 3,
      errors: [],
    });

    expect(feedback.hints.some((hint) => hint.includes('Post-mutation cache clear'))).toBe(true);
    expect(feedback.hints.some((hint) => hint.includes('Tool cache invalidation'))).toBe(true);
    expect(feedback.hints.some((hint) => hint.includes('non-fatal'))).toBe(true);
  });

  it('buildMutationHookFeedback omits non-fatal warning when all caches succeed', () => {
    const feedback = buildMutationHookFeedback('save', {
      latencyMs: 5,
      triggerCacheCleared: true,
      constitutionalCacheCleared: true,
      graphSignalsCacheCleared: true,
      coactivationCacheCleared: true,
      toolCacheInvalidated: 1,
      errors: [],
    });

    expect(feedback.hints.some((hint) => hint.includes('non-fatal'))).toBe(false);
  });

  it('buildMutationHookFeedback surfaces error messages in hints and data', () => {
    const feedback = buildMutationHookFeedback('update', {
      latencyMs: 2,
      triggerCacheCleared: true,
      constitutionalCacheCleared: true,
      graphSignalsCacheCleared: true,
      coactivationCacheCleared: true,
      toolCacheInvalidated: 0,
      errors: ['hook failed: xyz'],
    });

    expect(feedback.data.errors).toEqual(['hook failed: xyz']);
    expect(feedback.hints.some((hint) => hint.includes('Post-mutation hook errors: hook failed: xyz'))).toBe(true);
  });

  it('appendAutoSurfaceHints injects hints and sets tokenCount from the final serialized envelope JSON', () => {
    const result = {
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        cache_creation_tokens: 25,
        cache_read_tokens: 10,
      },
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

    const finalText = result.content[0].text;
    const parsed = JSON.parse(finalText);
    expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 2 constitutional and 1 triggered memories (6ms)'))).toBe(true);
    expect(parsed.meta.autoSurface).toEqual({
      constitutionalCount: 2,
      triggeredCount: 1,
      surfaced_at: '2026-03-05T10:00:00.000Z',
      latencyMs: 6,
      tokenCount: 185,
    });
    expect(finalText).toBe(JSON.stringify(parsed, null, 2));
    expect(parsed.meta.tokenCount).not.toBe(12);
    expect(parsed.meta.tokenCount).toBe(estimateTokenCount(finalText));
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

  it('appendAutoSurfaceHints skips hint injection when constitutional and triggered are empty', () => {
    const result = {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            summary: 'ok',
            data: {},
            hints: ['existing'],
            meta: {},
          }),
        },
      ],
    };

    appendAutoSurfaceHints(result, { constitutional: [], triggered: [] });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.hints).not.toContainEqual(expect.stringContaining('Auto-surface hook'));
    expect(parsed.hints).toContainEqual('existing');
  });
});
