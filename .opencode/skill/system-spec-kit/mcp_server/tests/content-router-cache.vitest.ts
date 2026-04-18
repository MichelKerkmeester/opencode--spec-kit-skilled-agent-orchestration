import { describe, expect, it, vi } from 'vitest';

import { createContentRouter } from '../lib/routing/content-router.js';

function makeContext(options: {
  specFolder?: string;
  packetLevel?: 'L2' | 'L3+';
  sessionMeta?: Record<string, unknown>;
} = {}) {
  return {
    specFolder: options.specFolder ?? '026-graph-and-context-optimization/015-packets-009-014-audit',
    packetLevel: options.packetLevel ?? 'L3+',
    existingAnchors: ['phase-1', 'phase-2', 'phase-3', 'what-built', 'how-delivered'],
    sessionMeta: {
      packet_kind: 'phase',
      save_mode: 'auto',
      recent_docs_touched: ['implementation-summary.md'],
      recent_anchors_touched: ['what-built'],
      likely_phase_anchor: 'phase-2',
      session_id: 'session-123',
      ...options.sessionMeta,
    },
  };
}

function buildScopedKey(scope: string, key: string, context: Record<string, unknown>): string {
  return [
    scope,
    key,
    context.spec_folder,
    context.packet_level,
    context.packet_kind,
    context.likely_phase_anchor,
    context.session_id ?? 'no-session',
  ].join('|');
}

describe('content router cache context contract', () => {
  it('surfaces source and packet context so identical text can bypass stale cache hits', async () => {
    const cacheEntries = new Map<string, unknown>();
    const cache = {
      get: vi.fn((scope: string, key: string, context: Record<string, unknown>) => (
        cacheEntries.get(buildScopedKey(scope, key, context)) ?? null
      )),
      set: vi.fn((scope: string, key: string, entry: unknown, _ttlMs: number, context: Record<string, unknown>) => {
        cacheEntries.set(buildScopedKey(scope, key, context), entry);
      }),
    };
    const classifyWithTier3 = vi.fn()
      .mockResolvedValueOnce({
        category: 'narrative_progress',
        confidence: 0.91,
        target_doc: 'implementation-summary.md',
        target_anchor: 'what-built',
        merge_mode: 'append-as-paragraph',
        reasoning: 'Progress-focused implementation summary.',
        alternatives: [{ category: 'narrative_delivery', confidence: 0.45 }],
      })
      .mockResolvedValueOnce({
        category: 'handover_state',
        confidence: 0.89,
        target_doc: 'implementation-summary.md',
        target_anchor: 'next-safe-action',
        merge_mode: 'update-in-place',
        reasoning: 'Resume guidance dominates in the second packet.',
        alternatives: [{ category: 'narrative_progress', confidence: 0.28 }],
      });

    const router = createContentRouter({
      embedText: () => [0, 0, 0, 0, 0, 0, 0, 0],
      classifyWithTier3,
      cache,
      tier3Enabled: true,
    });

    const sharedText = 'This packet note blends status, routing ambiguity, and operator guidance without naming a clear canonical destination.';

    const firstDecision = await router.classifyContent({
      id: 'chunk-a',
      text: sharedText,
      sourceField: 'observations',
    }, makeContext());

    const secondDecision = await router.classifyContent({
      id: 'chunk-b',
      text: sharedText,
      sourceField: 'exchanges',
      metadata: { phase_anchor: 'phase-3' },
    }, makeContext({
      specFolder: '026-graph-and-context-optimization/014-memory-save-rewrite',
      packetLevel: 'L2',
      sessionMeta: {
        packet_kind: 'packet',
        likely_phase_anchor: 'phase-1',
      },
    }));

    expect(firstDecision.cacheHit).toBe(false);
    expect(secondDecision.cacheHit).toBe(false);
    expect(classifyWithTier3).toHaveBeenCalledTimes(2);

    const tier3Inputs = classifyWithTier3.mock.calls.map(([input]) => input);
    expect(tier3Inputs[0]).toMatchObject({
      source_field: 'observations',
      context: {
        packet_level: 'L3+',
        packet_kind: 'phase',
        likely_phase_anchor: 'phase-2',
      },
    });
    expect(tier3Inputs[1]).toMatchObject({
      source_field: 'exchanges',
      context: {
        packet_level: 'L2',
        packet_kind: 'packet',
        likely_phase_anchor: 'phase-3',
      },
    });

    const sessionLookups = cache.get.mock.calls
      .filter(([scope]) => scope === 'session')
      .map(([, , context]) => context);
    expect(sessionLookups[0]).toMatchObject({
      packet_level: 'L3+',
      packet_kind: 'phase',
      likely_phase_anchor: 'phase-2',
    });
    expect(sessionLookups[1]).toMatchObject({
      packet_level: 'L2',
      packet_kind: 'packet',
      likely_phase_anchor: 'phase-3',
    });
  });
});
