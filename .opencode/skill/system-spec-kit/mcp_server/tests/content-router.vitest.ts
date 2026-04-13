import { createHash } from 'node:crypto';

import { describe, expect, it, vi } from 'vitest';

import {
  buildTier3Prompt,
  createContentRouter,
  createRoutingAuditEntry,
  getDefaultPrototypeLibrary,
  getTier3Contract,
  TIER3_THRESHOLD,
} from '../lib/routing/content-router.js';

function makeEmbeddingFn() {
  return (text: string): number[] => {
    const buckets = Array.from({ length: 64 }, () => 0);
    for (const token of text.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean)) {
      const digest = createHash('sha256').update(token).digest();
      const bucketIndex = digest[0] % buckets.length;
      buckets[bucketIndex] += 1;
    }
    return buckets;
  };
}

function makeContext(overrides: Record<string, unknown> = {}) {
  return {
    specFolder: '026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready',
    packetLevel: 'L3+' as const,
    existingAnchors: ['phase-1', 'phase-2', 'phase-3', 'what-built', 'how-delivered'],
    sessionMeta: {
      packet_kind: 'phase' as const,
      save_mode: 'auto' as const,
      recent_docs_touched: ['implementation-summary.md'],
      recent_anchors_touched: ['what-built'],
      likely_phase_anchor: 'phase-2',
      session_id: 'session-123',
      ...overrides,
    },
  };
}

describe('content-router tier 1 classification', () => {
  const router = createContentRouter({
    embedText: makeEmbeddingFn(),
  });

  it('routes narrative progress observations to implementation-summary what-built', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-1',
      text: 'Implemented the routed save path, refactored the validator bridge, and all focused tests pass.',
      sourceField: 'observations',
    }, makeContext());

    expect(decision.category).toBe('narrative_progress');
    expect(decision.target).toMatchObject({
      docPath: 'implementation-summary.md',
      anchorId: 'what-built',
      mergeMode: 'append-as-paragraph',
    });
    expect(decision.tierUsed).toBe(1);
    expect(decision.confidence).toBeGreaterThanOrEqual(0.7);
  });

  it('routes rollout sequencing text to narrative delivery', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-2',
      text: 'Delivered behind a feature flag, ran shadow comparison, and kept rollout gated until verification stayed green.',
      sourceField: 'observations',
    }, makeContext());

    expect(decision.category).toBe('narrative_delivery');
    expect(decision.target.anchorId).toBe('how-delivered');
  });

  it('keeps delivery ahead of progress when implementation verbs coexist with sequencing and verification cues', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-2b',
      text: 'Implemented the writer update, then deployed it behind a gate, kept the release blocked by verification checks, and only then confirmed the final ship step.',
      sourceField: 'observations',
    }, makeContext());

    expect(decision.category).toBe('narrative_delivery');
    expect(decision.target.anchorId).toBe('how-delivered');
  });

  it('routes structured decisions to ADR insertion on L3+', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-3',
      text: 'We chose namespace reuse over a second graph system because it keeps persistence and queries stable.',
      sourceField: 'decisions',
      structuredType: 'decision',
    }, makeContext());

    expect(decision.category).toBe('decision');
    expect(decision.target).toMatchObject({
      docPath: 'decision-record.md',
      anchorId: 'adr-NNN',
      mergeMode: 'insert-new-adr',
    });
  });

  it('routes decision text to implementation-summary decisions on L2', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-4',
      text: 'We chose optional defaults over a mandatory migration to preserve backward compatibility.',
      sourceField: 'decisions',
      structuredType: 'decision',
    }, {
      ...makeContext(),
      packetLevel: 'L2' as const,
    });

    expect(decision.target).toMatchObject({
      docPath: 'implementation-summary.md',
      anchorId: 'decisions',
      mergeMode: 'update-in-place',
    });
  });

  it('routes handover state to handover session-log', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-5',
      text: 'Current state: validator compiled. Next session should restart the MCP server and rerun the focused query.',
      sourceField: 'exchanges',
    }, makeContext());

    expect(decision.category).toBe('handover_state');
    expect(decision.target.docPath).toBe('handover.md');
    expect(decision.target.mergeMode).toBe('append-section');
  });

  it('keeps handover state when soft operational commands coexist with stop-state language', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-5b',
      text: 'Current state: focused fix compiled. Current blockers are runtime restart verification and one final review. Next session should resume with git diff, list memories, and force re-index after the blocker clears.',
      sourceField: 'exchanges',
    }, makeContext());

    expect(decision.category).toBe('handover_state');
    expect(decision.target.docPath).toBe('handover.md');
    expect(decision.refusal).toBe(false);
  });

  it('routes research findings to research doc', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-6',
      text: 'Research finding: the upstream library has a race condition on concurrent reads, based on cited source analysis.',
      sourceField: 'observations',
    }, makeContext());

    expect(decision.category).toBe('research_finding');
    expect(decision.target.docPath).toBe('research/research.md');
  });

  it('routes explicit checkbox updates to tasks and keeps likely phase anchor', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-7',
      text: '- [x] T023 Complete the router implementation. - [ ] T024 Run focused verification.',
      sourceField: 'observations',
    }, makeContext());

    expect(decision.category).toBe('task_update');
    expect(decision.target).toMatchObject({
      docPath: 'tasks.md',
      anchorId: 'phase-2',
      mergeMode: 'update-in-place',
    });
  });

  it('infers phase-3 task updates from the routed chunk text when session hints are absent', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-7b',
      text: 'Phase 3 - [x] T125 Finalize the remediation packet evidence and verification.',
      sourceField: 'observations',
      structuredType: 'task_update',
    }, makeContext({
      likely_phase_anchor: null,
      recent_anchors_touched: [],
    }));

    expect(decision.category).toBe('task_update');
    expect(decision.target).toMatchObject({
      docPath: 'tasks.md',
      anchorId: 'phase-3',
      mergeMode: 'update-in-place',
    });
  });

  it('routes preflight state to metadata-only continuity target', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-8',
      text: 'preflight knowledgeScore 42 uncertaintyScore 71 contextScore 38 knowledgeGaps resume latency dedup key shape',
      sourceField: 'preflight',
    }, makeContext());

    expect(decision.category).toBe('metadata_only');
    expect(decision.target).toMatchObject({
      docPath: 'spec-frontmatter',
      anchorId: '_memory.continuity',
      mergeMode: 'update-in-place',
    });
  });

  it('routes transcript-like content to drop and refusal target', async () => {
    const decision = await router.classifyContent({
      id: 'chunk-9',
      text: '2026-04-11 user: continue anyway. 2026-04-11 assistant: applying targeted fix. 2026-04-11 tool: git diff --name-only.',
      sourceField: 'unknown',
    }, makeContext());

    expect(decision.category).toBe('drop');
    expect(decision.target.mergeMode).toBe('refuse-to-route');
    expect(decision.overrideable).toBe(false);
  });
});

describe('content-router tier 2 and tier 3 behavior', () => {
  it('uses Tier 2 when Tier 1 confidence is too weak', async () => {
    const router = createContentRouter({
      embedText: makeEmbeddingFn(),
    });

    const decision = await router.classifyContent({
      id: 'chunk-10',
      text: 'Packet-local changelog generation derives final changelog structure from packet docs rather than hand-assembling markdown.',
      sourceField: 'unknown',
    }, makeContext());

    expect([1, 2]).toContain(decision.tierUsed);
    expect(decision.category).toBe('narrative_progress');
    expect(decision.tier2TopK.length).toBeGreaterThan(0);
  });

  it('uses injected Tier 3 classifier for ambiguous content and caches successful decisions', async () => {
    const cache = {
      get: vi.fn(() => null),
      set: vi.fn(),
    };
    const classifyWithTier3 = vi.fn(async () => ({
      category: 'narrative_delivery',
      confidence: 0.83,
      target_doc: 'implementation-summary.md',
      target_anchor: 'how-delivered',
      merge_mode: 'append-as-paragraph',
      reasoning: 'Rollout and verification mechanics dominate.',
      alternatives: [{ category: 'narrative_progress', confidence: 0.41 }],
    }));

    const router = createContentRouter({
      embedText: () => [0, 0, 0, 0, 0, 0, 0, 0],
      classifyWithTier3,
      cache,
      now: () => 1_000,
    });

    const decision = await router.classifyContent({
      id: 'chunk-11',
      text: 'This packet note blends status, routing ambiguity, and operator guidance without naming a clear canonical destination.',
      sourceField: 'unknown',
    }, makeContext());

    expect(decision.tierUsed).toBe(3);
    expect(decision.category).toBe('narrative_delivery');
    expect(classifyWithTier3).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(2);
  });

  it('reuses a session-scoped Tier 3 cache hit before calling the classifier', async () => {
    const cache = {
      get: vi.fn((scope: string) => {
        if (scope === 'session') {
          return {
            promptVersion: 'tier3-router-v1',
            model: 'gpt-5.4',
            packetLevel: 'L3+',
            category: 'narrative_progress',
            confidence: 0.91,
            targetDoc: 'implementation-summary.md',
            targetAnchor: 'what-built',
            mergeMode: 'append-as-paragraph',
            reasoning: 'Cached progress decision.',
            alternatives: [],
            createdAt: '2026-04-11T00:00:00Z',
          };
        }
        return null;
      }),
      set: vi.fn(),
    };
    const classifyWithTier3 = vi.fn();
    const router = createContentRouter({
      embedText: () => [0, 0, 0, 0, 0, 0, 0, 0],
      classifyWithTier3,
      cache,
    });

    const decision = await router.classifyContent({
      id: 'chunk-12',
      text: 'Ambiguous content that forces escalation into Tier 3.',
      sourceField: 'unknown',
    }, makeContext());

    expect(decision.cacheHit).toBe(true);
    expect(decision.tierUsed).toBe(3);
    expect(classifyWithTier3).not.toHaveBeenCalled();
  });

  it('normalizes Tier 3 drop_candidate to final drop', async () => {
    const router = createContentRouter({
      embedText: () => [0, 0, 0, 0, 0, 0, 0, 0],
      classifyWithTier3: async () => ({
        category: 'drop_candidate',
        confidence: 0.88,
        target_doc: 'scratch/pending-route-hash.json',
        target_anchor: 'manual-review',
        merge_mode: 'refuse-to-route',
        reasoning: 'Transcript-like wrapper content.',
        alternatives: [{ category: 'metadata_only', confidence: 0.2 }],
      }),
    });

    const decision = await router.classifyContent({
      id: 'chunk-13',
      text: 'This wrapper note is mostly orchestration chatter and generic operator boilerplate, with no durable canonical destination.',
      sourceField: 'unknown',
    }, makeContext());

    expect(decision.category).toBe('drop');
    expect(decision.tierUsed).toBe(3);
  });

  it('refuses when Tier 3 stays below the 0.50 floor', async () => {
    const router = createContentRouter({
      embedText: () => [0, 0, 0, 0, 0, 0, 0, 0],
      classifyWithTier3: async () => ({
        category: 'research_finding',
        confidence: 0.42,
        target_doc: 'research/research.md',
        target_anchor: 'findings',
        merge_mode: 'append-section',
        reasoning: 'Signals remain mixed.',
        alternatives: [{ category: 'handover_state', confidence: 0.39 }],
      }),
    });

    const decision = await router.classifyContent({
      id: 'chunk-14',
      text: 'This note mixes two possible destinations without a dominant signal and leaves the final placement uncertain.',
      sourceField: 'unknown',
    }, makeContext());

    expect(decision.refusal).toBe(true);
    expect(decision.target).toMatchObject({
      anchorId: 'manual-review',
      mergeMode: 'refuse-to-route',
    });
    expect(decision.confidenceBand).toBe('refuse');
  });

  it('falls back to penalized Tier 2 when Tier 3 is unavailable and confidence stays above 0.50', async () => {
    const prototypes = {
      version: 1,
      embeddingProfile: 'routing-fallback-test',
      categories: {
        narrative_progress: [{ id: 'np', label: 'progress', sourceShape: 'test', tags: ['progress'], negativeHints: [], chunk: 'progress-prototype' }],
        narrative_delivery: [{ id: 'nd', label: 'delivery', sourceShape: 'test', tags: ['delivery'], negativeHints: [], chunk: 'delivery-prototype' }],
        decision: [{ id: 'de', label: 'decision', sourceShape: 'test', tags: ['decision'], negativeHints: [], chunk: 'decision-prototype' }],
        handover_state: [{ id: 'hs', label: 'handover', sourceShape: 'test', tags: ['handover'], negativeHints: [], chunk: 'handover-prototype' }],
        research_finding: [{ id: 'rf', label: 'research', sourceShape: 'test', tags: ['research'], negativeHints: [], chunk: 'research-prototype' }],
        task_update: [{ id: 'tu', label: 'task', sourceShape: 'test', tags: ['task'], negativeHints: [], chunk: 'task-prototype' }],
        metadata_only: [{ id: 'mo', label: 'metadata', sourceShape: 'test', tags: ['metadata'], negativeHints: [], chunk: 'metadata-prototype' }],
        drop: [{ id: 'dr', label: 'drop', sourceShape: 'test', tags: ['drop'], negativeHints: [], chunk: 'drop-prototype' }],
      },
    };
    const embedText = (text: string): number[] => {
      if (text.includes('ambiguous parity note')) {
        return [0.66, 0, 0, 0, 0, 0, 0, 0, 0.751265];
      }
      switch (text) {
        case 'delivery-prototype':
          return [1, 0, 0, 0, 0, 0, 0, 0, 0];
        case 'progress-prototype':
          return [0, 1, 0, 0, 0, 0, 0, 0, 0];
        case 'decision-prototype':
          return [0, 0, 1, 0, 0, 0, 0, 0, 0];
        case 'handover-prototype':
          return [0, 0, 0, 1, 0, 0, 0, 0, 0];
        case 'research-prototype':
          return [0, 0, 0, 0, 1, 0, 0, 0, 0];
        case 'task-prototype':
          return [0, 0, 0, 0, 0, 1, 0, 0, 0];
        case 'metadata-prototype':
          return [0, 0, 0, 0, 0, 0, 1, 0, 0];
        case 'drop-prototype':
          return [0, 0, 0, 0, 0, 0, 0, 1, 0];
        default:
          return [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
      }
    };
    const router = createContentRouter({
      embedText,
      classifyWithTier3: async () => null,
      prototypes,
    });

    const decision = await router.classifyContent({
      id: 'chunk-15',
      text: 'This ambiguous parity note talks about synchronized packet surfaces without naming a clear canonical destination.',
      sourceField: 'unknown',
    }, makeContext());

    expect(decision.category).toBe('narrative_delivery');
    expect(decision.warningMessage).toContain('Tier 3 unavailable');
    expect(decision.confidence).toBeGreaterThanOrEqual(TIER3_THRESHOLD);
  });

  it('fails open when the injected Tier 3 classifier throws and Tier 2 can still route safely', async () => {
    const prototypes = {
      version: 1,
      embeddingProfile: 'routing-throw-fallback-test',
      categories: {
        narrative_progress: [{ id: 'np', label: 'progress', sourceShape: 'test', tags: ['progress'], negativeHints: [], chunk: 'progress-prototype' }],
        narrative_delivery: [{ id: 'nd', label: 'delivery', sourceShape: 'test', tags: ['delivery'], negativeHints: [], chunk: 'delivery-prototype' }],
        decision: [{ id: 'de', label: 'decision', sourceShape: 'test', tags: ['decision'], negativeHints: [], chunk: 'decision-prototype' }],
        handover_state: [{ id: 'hs', label: 'handover', sourceShape: 'test', tags: ['handover'], negativeHints: [], chunk: 'handover-prototype' }],
        research_finding: [{ id: 'rf', label: 'research', sourceShape: 'test', tags: ['research'], negativeHints: [], chunk: 'research-prototype' }],
        task_update: [{ id: 'tu', label: 'task', sourceShape: 'test', tags: ['task'], negativeHints: [], chunk: 'task-prototype' }],
        metadata_only: [{ id: 'mo', label: 'metadata', sourceShape: 'test', tags: ['metadata'], negativeHints: [], chunk: 'metadata-prototype' }],
        drop: [{ id: 'dr', label: 'drop', sourceShape: 'test', tags: ['drop'], negativeHints: [], chunk: 'drop-prototype' }],
      },
    };
    const embedText = (text: string): number[] => {
      if (text.includes('ambiguous prototype progress note')) {
        return [0.66, 0, 0, 0, 0, 0, 0, 0, 0.751265];
      }
      switch (text) {
        case 'progress-prototype':
          return [1, 0, 0, 0, 0, 0, 0, 0, 0];
        case 'delivery-prototype':
          return [0, 1, 0, 0, 0, 0, 0, 0, 0];
        case 'decision-prototype':
          return [0, 0, 1, 0, 0, 0, 0, 0, 0];
        case 'handover-prototype':
          return [0, 0, 0, 1, 0, 0, 0, 0, 0];
        case 'research-prototype':
          return [0, 0, 0, 0, 1, 0, 0, 0, 0];
        case 'task-prototype':
          return [0, 0, 0, 0, 0, 1, 0, 0, 0];
        case 'metadata-prototype':
          return [0, 0, 0, 0, 0, 0, 1, 0, 0];
        case 'drop-prototype':
          return [0, 0, 0, 0, 0, 0, 0, 1, 0];
        default:
          return [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
      }
    };
    const router = createContentRouter({
      embedText,
      classifyWithTier3: async () => {
        throw new Error('simulated timeout');
      },
      prototypes,
    });

    const decision = await router.classifyContent({
      id: 'chunk-15b',
      text: 'This ambiguous prototype progress note avoids obvious heuristics while still landing nearest to the progress prototype.',
      sourceField: 'unknown',
    }, makeContext());

    expect(decision.category).toBe('narrative_progress');
    expect(decision.warningMessage).toContain('Tier 3 unavailable');
    expect(decision.refusal).toBe(false);
  });

  it('honors explicit route-as overrides even against a natural drop classification', async () => {
    const router = createContentRouter({
      embedText: makeEmbeddingFn(),
    });

    const decision = await router.classifyContent({
      id: 'chunk-16',
      text: '2026-04-11 assistant: Applying targeted fix. 2026-04-11 tool: git diff.',
      sourceField: 'unknown',
      routeAs: 'handover_state',
    }, makeContext());

    expect(decision.overrideApplied).toBe(true);
    expect(decision.category).toBe('handover_state');
    expect(decision.naturalDecision?.category).toBe('drop');
    expect(decision.warningMessage).toContain('Override accepted');
  });
});

describe('content-router helper contracts', () => {
  it('exports the default prototype library with all eight categories', () => {
    const library = getDefaultPrototypeLibrary();
    expect(library.version).toBe(1);
    expect(Object.keys(library.categories)).toHaveLength(8);
  });

  it('keeps the refreshed delivery, progress, and handover prototypes on their intended side of the boundary', async () => {
    const router = createContentRouter({
      embedText: makeEmbeddingFn(),
    });
    const library = getDefaultPrototypeLibrary();
    const expectations = [
      { category: 'narrative_delivery', id: 'ND-03' },
      { category: 'narrative_delivery', id: 'ND-04' },
      { category: 'narrative_progress', id: 'NP-05' },
      { category: 'handover_state', id: 'HS-01' },
      { category: 'handover_state', id: 'HS-04' },
    ] as const;

    for (const expectation of expectations) {
      const prototype = library.categories[expectation.category].find((entry) => entry.id === expectation.id);
      expect(prototype, `missing prototype ${expectation.id}`).toBeTruthy();
      const decision = await router.classifyContent({
        id: expectation.id,
        text: prototype?.chunk ?? '',
        sourceField: expectation.category === 'handover_state' ? 'exchanges' : 'observations',
      }, makeContext());
      expect(decision.category).toBe(expectation.category);
    }
  });

  it('builds the frozen Tier 3 prompt contract', () => {
    const { system, user } = buildTier3Prompt({
      chunk_id: 'chunk-17',
      chunk_hash: 'abc123',
      chunk_text: 'We chose namespace reuse over a new graph system.',
      chunk_text_normalized: 'we chose namespace reuse over a new graph system',
      chunk_char_count: 47,
      source_field: 'decisions',
      tier1: null,
      tier2_topk: [],
      tier2_trigger_reason: 'top1_below_0_70',
      context: {
        spec_folder: 'specs/example',
        packet_level: 'L3+',
        packet_kind: 'phase',
        save_mode: 'auto',
        recent_docs_touched: ['decision-record.md'],
        recent_anchors_touched: ['adr-001'],
        likely_phase_anchor: 'phase-1',
      },
    });

    expect(system).toContain('drop_candidate');
    expect(system).toContain('refuse-to-route');
    expect(system).toContain('Context: This system uses a 3-level resume ladder (handover.md -> _memory.continuity in implementation-summary.md -> canonical spec docs). metadata_only saves always target implementation-summary.md. The router classifies into 8 categories: narrative_progress, narrative_delivery, decision, handover_state, research_finding, task_update, metadata_only, drop.');
    expect(system).toContain('implementation-summary.md::_memory.continuity');
    expect(system).not.toContain('usually _memory.continuity');
    expect(user).toContain('PROMPT_VERSION: tier3-router-v1');
  });

  it('creates CR001 routing audit entries with normalized fields', async () => {
    const router = createContentRouter({
      embedText: makeEmbeddingFn(),
    });
    const chunk = {
      id: 'chunk-18',
      text: 'Implemented the routed save path and updated the validator bridge.',
      sourceField: 'observations' as const,
    };
    const context = makeContext();
    const decision = await router.classifyContent(chunk, context);
    const entry = createRoutingAuditEntry(decision, chunk, context, 42);

    expect(entry).toMatchObject({
      component: 'content-router',
      code: 'CR001',
      chunk_id: 'chunk-18',
      category: 'narrative_progress',
      target_doc: 'implementation-summary.md',
      target_anchor: 'what-built',
      decision_latency_ms: 42,
    });
  });

  it('exports the frozen Tier 3 model contract', () => {
    expect(getTier3Contract()).toMatchObject({
      promptVersion: 'tier3-router-v1',
      model: 'gpt-5.4',
      reasoningEffort: 'low',
      temperature: 0,
      maxOutputTokens: 200,
      timeoutMs: 2000,
    });
  });
});
