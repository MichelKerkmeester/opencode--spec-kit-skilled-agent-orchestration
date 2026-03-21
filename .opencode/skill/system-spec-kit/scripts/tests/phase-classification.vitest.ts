// ───────────────────────────────────────────────────────────────────
// MODULE: Phase Classification Tests
// ───────────────────────────────────────────────────────────────────
import { describe, expect, it } from 'vitest';

import { extractConversations } from '../extractors/conversation-extractor';
import { detectObservationType } from '../extractors/file-extractor';
import {
  classifyConversationExchanges,
  classifyConversationPhase,
} from '../lib/phase-classifier';

describe('phase classification', () => {
  it('resolves grep in debug output to Debugging', () => {
    expect(classifyConversationPhase([{ tool: 'Grep' }], 'grep in debug output while fixing the error')).toBe('Debugging');
  });

  it('normalizes Copilot view tool names to canonical read scoring', () => {
    expect(classifyConversationPhase([{ tool: 'View' }], 'Okay')).toBe('Research');

    const result = classifyConversationExchanges([
      {
        id: 'exchange-1',
        messageIndexes: [0],
        observationIndexes: [],
        prompt: 'Okay',
        narratives: [],
        factTexts: [],
        toolNames: ['View'],
        observationTypes: [],
        startTimestamp: '2026-03-16T10:00:00.000Z',
        endTimestamp: '2026-03-16T10:00:01.000Z',
      },
    ]);

    expect(result.phases[0]?.PHASE_NAME).toBe('Research');
  });

  it('prefers Implementation when edit/write tools are present despite research-heavy wording', () => {
    expect(
      classifyConversationPhase(
        [{ tool: 'Edit' }, { tool: 'Write' }],
        'Research explore analyze compare the implementation details and update the files',
      ),
    ).toBe('Implementation');
  });

  it('keeps non-contiguous phase returns as separate timeline segments', () => {
    const result = classifyConversationExchanges([
      {
        id: 'exchange-1',
        messageIndexes: [0],
        observationIndexes: [0],
        prompt: 'Research adapter patterns',
        narratives: ['Investigated current extractor behavior'],
        factTexts: ['Tool: Read scripts/extractors/conversation-extractor.ts'],
        toolNames: ['Read', 'Grep'],
        observationTypes: ['research'],
        startTimestamp: '2026-03-16T10:00:00.000Z',
        endTimestamp: '2026-03-16T10:00:30.000Z',
      },
      {
        id: 'exchange-2',
        messageIndexes: [1],
        observationIndexes: [1],
        prompt: 'Implement phase classifier',
        narratives: ['Implemented the clustering logic'],
        factTexts: ['Tool: Edit scripts/lib/phase-classifier.ts'],
        toolNames: ['Edit', 'Write'],
        observationTypes: ['feature'],
        startTimestamp: '2026-03-16T10:06:00.000Z',
        endTimestamp: '2026-03-16T10:06:30.000Z',
      },
      {
        id: 'exchange-3',
        messageIndexes: [2],
        observationIndexes: [2],
        prompt: 'Research tie-break behavior again',
        narratives: ['Investigated ranking tie breaks'],
        factTexts: ['Tool: Read docs/tie-breaks.md'],
        toolNames: ['Read'],
        observationTypes: ['research'],
        startTimestamp: '2026-03-16T10:12:00.000Z',
        endTimestamp: '2026-03-16T10:12:30.000Z',
      },
    ]);

    expect(result.phases.map((phase) => phase.PHASE_NAME)).toEqual(['Research', 'Implementation', 'Research']);
    expect(result.uniquePhaseCount).toBe(2);
    expect(result.flowPattern).toBe('Iterative Loop');
  });

  it('recognizes test, documentation, and performance observations', () => {
    expect(detectObservationType({ type: 'observation', narrative: 'Ran Vitest assertions and checked coverage' })).toBe('test');
    expect(detectObservationType({ type: 'observation', narrative: 'Updated README markdown guide' })).toBe('documentation');
    expect(detectObservationType({ type: 'observation', narrative: 'Optimized performance benchmark latency' })).toBe('performance');
  });

  // Branching Investigation requires non-adjacent clusters with semantic overlap
  // (cosine >= 0.45 or overlap >= 0.5). Repeated "adapter cache" terms across
  // exchanges 1 and 3 produce the adjacency-graph edge that triggers this pattern.
  it('derives each supported flow pattern', () => {
    const branching = classifyConversationExchanges([
      {
        id: 'exchange-1',
        messageIndexes: [0],
        observationIndexes: [],
        prompt: 'Implement adapter cache tradeoffs adapter cache',
        narratives: ['Built adapter cache tradeoffs adapter cache'],
        factTexts: ['adapter cache tradeoffs', 'Tool: Edit scripts/cache-adapter.ts'],
        toolNames: ['Edit', 'Write'],
        observationTypes: ['feature'],
        startTimestamp: '2026-03-16T10:00:00.000Z',
        endTimestamp: '2026-03-16T10:00:20.000Z',
      },
      {
        id: 'exchange-2',
        messageIndexes: [1],
        observationIndexes: [],
        prompt: 'Verify assertion coverage',
        narratives: ['Checked Vitest assertions'],
        factTexts: ['Tool: Read tests/cache.spec.ts'],
        toolNames: ['Read'],
        observationTypes: ['test'],
        startTimestamp: '2026-03-16T10:05:00.000Z',
        endTimestamp: '2026-03-16T10:05:20.000Z',
      },
      {
        id: 'exchange-3',
        messageIndexes: [2],
        observationIndexes: [],
        prompt: 'Research adapter cache tradeoffs adapter cache',
        narratives: ['Investigated adapter cache tradeoffs adapter cache'],
        factTexts: ['adapter cache tradeoffs', 'Tool: Read docs/cache-adapter.md'],
        toolNames: ['Read'],
        observationTypes: ['research'],
        startTimestamp: '2026-03-16T10:10:00.000Z',
        endTimestamp: '2026-03-16T10:10:20.000Z',
      },
    ]);
    expect(branching.flowPattern).toBe('Branching Investigation');

    const exploratory = classifyConversationExchanges([
      {
        id: 'exchange-1',
        messageIndexes: [0],
        observationIndexes: [],
        prompt: 'Research and plan auth',
        narratives: ['Investigate approach options'],
        factTexts: [],
        toolNames: [],
        observationTypes: ['research'],
        startTimestamp: '2026-03-16T10:00:00.000Z',
        endTimestamp: '2026-03-16T10:00:20.000Z',
      },
      {
        id: 'exchange-2',
        messageIndexes: [1],
        observationIndexes: [],
        prompt: 'Plan and verify cleanup',
        narratives: ['Discussed options and checks'],
        factTexts: [],
        toolNames: [],
        observationTypes: ['decision'],
        startTimestamp: '2026-03-16T10:05:00.000Z',
        endTimestamp: '2026-03-16T10:05:20.000Z',
      },
      {
        id: 'exchange-3',
        messageIndexes: [2],
        observationIndexes: [],
        prompt: 'Fix and verify failing test',
        narratives: ['Debug and validate the patch'],
        factTexts: [],
        toolNames: [],
        observationTypes: ['bugfix'],
        startTimestamp: '2026-03-16T10:10:00.000Z',
        endTimestamp: '2026-03-16T10:10:20.000Z',
      },
      {
        id: 'exchange-4',
        messageIndexes: [3],
        observationIndexes: [],
        prompt: 'Document and verify rollout',
        narratives: ['Write guide and check output'],
        factTexts: [],
        toolNames: [],
        observationTypes: ['documentation'],
        startTimestamp: '2026-03-16T10:15:00.000Z',
        endTimestamp: '2026-03-16T10:15:20.000Z',
      },
    ]);
    expect(exploratory.flowPattern).toBe('Exploratory Sweep');

    const linear = classifyConversationExchanges([
      {
        id: 'exchange-1',
        messageIndexes: [0],
        observationIndexes: [],
        prompt: 'Plan release',
        narratives: ['Discussed rollout approach'],
        factTexts: [],
        toolNames: [],
        observationTypes: ['decision'],
        startTimestamp: '2026-03-16T10:00:00.000Z',
        endTimestamp: '2026-03-16T10:00:20.000Z',
      },
      {
        id: 'exchange-2',
        messageIndexes: [1],
        observationIndexes: [],
        prompt: 'Implement release notes',
        narratives: ['Updated the docs'],
        factTexts: ['Tool: Edit README.md'],
        toolNames: ['Edit'],
        observationTypes: ['documentation'],
        startTimestamp: '2026-03-16T10:05:00.000Z',
        endTimestamp: '2026-03-16T10:05:20.000Z',
      },
    ]);
    expect(linear.flowPattern).toBe('Linear Sequential');
  });

  it('falls back to Discussion for low-signal exchanges without crashing', () => {
    const result = classifyConversationExchanges([{
      id: 'exchange-1',
      messageIndexes: [0],
      observationIndexes: [],
      prompt: 'Okay',
      narratives: [],
      factTexts: [],
      toolNames: [],
      observationTypes: [],
      startTimestamp: '2026-03-16T10:00:00.000Z',
      endTimestamp: '2026-03-16T10:00:00.000Z',
    }]);

    expect(result.phases[0]?.PHASE_NAME).toBe('Discussion');
    expect(result.topicClusters[0]?.confidence).toBe(0.35);
  });

  it('exposes richer phase metadata through conversation extraction', async () => {
    const result = await extractConversations({
      userPrompts: [
        { prompt: 'Research adapter patterns', timestamp: '2026-03-16T10:00:00.000Z' },
        { prompt: 'Implement the phase classifier', timestamp: '2026-03-16T10:06:00.000Z' },
        { prompt: 'Research tie-break behavior again', timestamp: '2026-03-16T10:12:00.000Z' },
      ],
      observations: [
        {
          timestamp: '2026-03-16T10:00:30.000Z',
          narrative: 'Researched adapter patterns with Read and Grep.',
          facts: ['Tool: Read docs/phase-classifier.md', 'Tool: Grep phase classifier'],
          type: 'research',
        },
        {
          timestamp: '2026-03-16T10:06:30.000Z',
          narrative: 'Implemented the classifier with Edit and Write tools.',
          facts: ['Tool: Edit scripts/lib/phase-classifier.ts', 'Tool: Write scripts/extractors/conversation-extractor.ts'],
          type: 'feature',
        },
        {
          timestamp: '2026-03-16T10:12:30.000Z',
          narrative: 'Researched tie-break handling after implementation.',
          facts: ['Tool: Read docs/tie-breaks.md'],
          type: 'research',
        },
      ],
    });

    expect(result.PHASES).toHaveLength(3);
    expect(result.UNIQUE_PHASE_COUNT).toBe(2);
    expect(result.TOPIC_CLUSTERS).toHaveLength(3);
    expect(result.PHASES[0]).toHaveProperty('CLUSTER_ID');
    expect(result.PHASES[0]).toHaveProperty('CONFIDENCE');
    expect(result.FLOW_PATTERN).toBe('Iterative Loop');
  });
});
