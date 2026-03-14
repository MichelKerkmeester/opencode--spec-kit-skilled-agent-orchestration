// TEST: MCP RESPONSE ENVELOPE
import { describe, expect, it } from 'vitest';

import {
  formatSearchResults,
  type MemoryResultEnvelope,
  type RawSearchResult,
} from '../formatters/search-results';
import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';

interface SearchEnvelopeData {
  count: number;
  results: MemoryResultEnvelope[];
  searchType?: string;
  constitutionalCount?: number;
  [key: string]: unknown;
}

function parseEnvelope(response: MCPResponse): MCPEnvelope<SearchEnvelopeData> {
  expect(Array.isArray(response.content)).toBe(true);
  expect(response.content.length).toBeGreaterThan(0);
  const firstContent = response.content[0];
  expect(firstContent).toBeDefined();
  if (!firstContent) {
    throw new Error('Missing MCP content payload');
  }
  expect(firstContent.type).toBe('text');
  expect(typeof firstContent.text).toBe('string');
  if (typeof firstContent.text !== 'string') {
    throw new Error('MCP content payload is not a JSON string');
  }

  return JSON.parse(firstContent.text) as MCPEnvelope<SearchEnvelopeData>;
}

function getFirstResult(envelope: MCPEnvelope<SearchEnvelopeData>): MemoryResultEnvelope {
  const firstResult = envelope.data.results[0];
  expect(firstResult).toBeDefined();
  if (!firstResult) {
    throw new Error('Expected at least one formatted result');
  }
  return firstResult;
}

function createMockResult(overrides: Partial<RawSearchResult> = {}): RawSearchResult {
  return {
    id: 101,
    spec_folder: 'specs/015-provenance',
    file_path: '/tmp/provenance.md',
    title: 'Provenance Result',
    similarity: 87.5,
    fts_score: 0.42,
    rrfScore: 0.68,
    intentAdjustedScore: 0.73,
    score: 0.55,
    rerankerScore: 0.88,
    attentionScore: 0.77,
    triggerPhrases: ['alpha', 'beta'],
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-02T00:00:00.000Z',
    memoryState: 'HOT',
    source: 'vector',
    sources: ['vector', 'fts'],
    anchorMetadata: [
      { id: 'state', type: 'section' },
      { id: 'next-steps', type: 'section' },
    ],
    traceMetadata: {
      queryComplexity: 'moderate',
      attribution: {
        vector: [101],
        fts: [101],
        graph: [999],
      },
    },
    ...overrides,
  };
}

describe('MCP Protocol Response Envelope (T536)', () => {
  it('T536-1: returns MCP content envelope with parseable JSON payload', async () => {
    const response = await formatSearchResults([createMockResult()], 'hybrid');
    const envelope = parseEnvelope(response);

    expect(response.isError).toBe(false);
    expect(envelope.meta.tool).toBe('memory_search');
    expect(envelope.data.count).toBe(1);
    expect(envelope.data.results).toHaveLength(1);
  });

  it('T536-2: includeTrace=false (default) omits scores/source/trace', async () => {
    const response = await formatSearchResults([createMockResult()], 'hybrid');
    const envelope = parseEnvelope(response);
    const result = getFirstResult(envelope);

    expect(result.scores).toBeUndefined();
    expect(result.source).toBeUndefined();
    expect(result.trace).toBeUndefined();
  });

  it('T536-3: includeTrace=true includes scores, source, and trace fields', async () => {
    const response = await formatSearchResults(
      [createMockResult()],
      'hybrid',
      false,
      null,
      null,
      null,
      {
        retrievalTrace: {
          stages: [
            {
              stage: 'candidate',
              metadata: {
                channel: 'vector',
                channels: ['vector', 'fts'],
                expandedTerms: ['alpha', 'beta'],
              },
            },
            {
              stage: 'fallback',
              metadata: {
                fallbackTier: 2,
                queryComplexity: 'moderate',
                budgetTruncated: true,
              },
            },
          ],
        },
        sessionTransition: {
          previousState: null,
          currentState: 'focused',
          confidence: 0.85,
          signalSources: ['intent-classifier'],
          reason: 'intent classifier selected focused mode',
        },
      },
      true
    );

    const envelope = parseEnvelope(response);
    const result = getFirstResult(envelope);

    expect(result.scores).toEqual(expect.objectContaining({
      semantic: 87.5,
      lexical: 0.42,
      fusion: 0.68,
      composite: 0.73,
      intentAdjusted: 0.73,
      rerank: 0.88,
      attention: 0.77,
    }));

    expect(result.source).toEqual({
      file: '/tmp/provenance.md',
      anchorIds: ['state', 'next-steps'],
      anchorTypes: ['section', 'section'],
      lastModified: '2026-01-02T00:00:00.000Z',
      memoryState: 'HOT',
    });

    expect(result.trace?.channelsUsed).toEqual(expect.arrayContaining(['vector', 'fts']));
    expect(result.trace?.pipelineStages).toEqual(['candidate', 'fallback']);
    expect(result.trace?.fallbackTier).toBe(2);
    expect(result.trace?.queryComplexity).toBe('moderate');
    expect(result.trace?.expansionTerms).toEqual(expect.arrayContaining(['alpha', 'beta']));
    expect(result.trace?.budgetTruncated).toBe(true);
    expect(result.trace?.scoreResolution).toBe('intentAdjusted');
    expect(result.trace?.sessionTransition).toEqual({
      previousState: null,
      currentState: 'focused',
      confidence: 0.85,
      signalSources: ['intent-classifier'],
      reason: 'intent classifier selected focused mode',
    });
  });

  it('T536-4: scoreResolution and composite follow fallback ordering', async () => {
    const response = await formatSearchResults(
      [
        createMockResult({
          intentAdjustedScore: undefined,
          rrfScore: 0.66,
          score: 0.52,
          similarity: 44,
        }),
      ],
      'hybrid',
      false,
      null,
      null,
      null,
      {},
      true
    );
    const envelope = parseEnvelope(response);
    const result = getFirstResult(envelope);

    expect(result.scores?.composite).toBe(0.66);
    expect(result.trace?.scoreResolution).toBe('fusion');
  });
});
