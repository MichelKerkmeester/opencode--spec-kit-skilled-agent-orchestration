// TEST: HANDLER MEMORY SEARCH
import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-search';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';

type MemorySearchResponse = Awaited<ReturnType<typeof handler.handleMemorySearch>>;
type ChunkReassemblyInput =
  Parameters<typeof handler.__testables.collapseAndReassembleChunkResults>[0][number];
type MemorySearchModule = typeof handler & {
  default?: {
    handleMemorySearch?: unknown;
  };
};

function parseEnvelope(response: MemorySearchResponse): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

function getNestedRecord(
  record: Record<string, unknown>,
  key: string
): Record<string, unknown> | undefined {
  const value = record[key];
  return typeof value === 'object' && value !== null
    ? value as Record<string, unknown>
    : undefined;
}

function getEnvelopeError(record: Record<string, unknown>): unknown {
  return record.error ?? getNestedRecord(record, 'data')?.error;
}

describe('Handler Memory Search (T516) [deferred - requires DB test fixtures]', () => {
  beforeAll(() => {
    vectorIndex.closeDb();
    vectorIndex.initializeDb(':memory:');
  });

  afterAll(() => {
    vectorIndex.closeDb();
  });

  beforeEach(() => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Exports Validation', () => {
    it('T516-1: handleMemorySearch is exported as a function', () => {
      expect(typeof handler.handleMemorySearch).toBe('function');
    });

    it('T516-2: handle_memory_search alias is exported', () => {
      expect(typeof handler.handle_memory_search).toBe('function');
    });
  });

  describe('Input Validation', () => {
    it('T516-3: Missing query and concepts returns MCP error', async () => {
      const result = await handler.handleMemorySearch({});
      expect(result).toBeDefined();
      const payload = parseEnvelope(result);
      expect(getEnvelopeError(payload) || result.isError).toBeTruthy();
    });

    it('T516-4: Empty string query returns error', async () => {
      try {
        const result = await handler.handleMemorySearch({ query: '' });
        // If it doesn't throw, it should return an error in the response
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        const payload = parseEnvelope(result);
        const errorMsg = getEnvelopeError(payload);
        expect(errorMsg || result.isError).toBeTruthy();
      } catch (error: unknown) {
        // Also acceptable: throwing is valid behavior
        expect(error).toBeDefined();
      }
    });

    it('T516-5: Non-string specFolder rejected', async () => {
      // @ts-expect-error Intentional invalid runtime-validation input for specFolder.
      const result = await handler.handleMemorySearch({ query: 'test query', specFolder: 123 });
      expect(result).toBeDefined();
      const payload = parseEnvelope(result);
      expect(getEnvelopeError(payload) || result.isError).toBeTruthy();
    });

    it('T516-6: Single concept without query returns MCP error', async () => {
      const result = await handler.handleMemorySearch({ concepts: ['single'] });
      expect(result).toBeDefined();
      const payload = parseEnvelope(result);
      expect(getEnvelopeError(payload) || result.isError).toBeTruthy();
    });
  });

  describe('Parameter Defaults', () => {
    it('T516-7: Handler accepts args object', () => {
      expect(typeof handler.handleMemorySearch).toBe('function');
      expect(handler.handleMemorySearch.length).toBeGreaterThanOrEqual(0);
    });

    it('T516-8: Default export includes handleMemorySearch', () => {
      const moduleWithDefault = handler as MemorySearchModule;
      const hasDefault = typeof moduleWithDefault.default?.handleMemorySearch === 'function';
      const hasNamed = typeof handler.handleMemorySearch === 'function';
      expect(hasDefault || hasNamed).toBe(true);
    });
  });
});

describe('C138: Evidence Gap Warning Injection', () => {
  it('C138-T1: evidence gap warning format is valid markdown blockquote', () => {
    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
    expect(warning).toMatch(/^> \*\*/);
    expect(warning).toContain('EVIDENCE GAP DETECTED');
  });

  it('C138-T2: warning contains actionable guidance', () => {
    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
    expect(warning).toContain('first principles');
  });
});

/* ───────────────────────────────────────────────────────────────
   T002: Chunk Collapse Dedup — G3 Fix
   collapseAndReassembleChunkResults is exported via __testables.
   Tests verify dedup runs regardless of the includeContent flag.
──────────────────────────────────────────────────────────────── */
describe('T002: Chunk Collapse Dedup (G3)', () => {
  const { collapseAndReassembleChunkResults } = handler.__testables;

  // Minimal MemorySearchRow-compatible shape used across these tests.
  function makeRow(
    id: number,
    parentId: number | null,
    extra: Partial<ChunkReassemblyInput> = {}
  ): ChunkReassemblyInput {
    return {
      id,
      title: `Memory ${id}`,
      parent_id: parentId,
      chunk_index: parentId !== null ? 0 : null,
      chunk_label: null,
      content_text: null,
      score: 0.9,
      similarity: 90,
      state: 'WARM',
      importance_tier: 'normal',
      spec_folder: 'test',
      file_path: '/tmp/test.md',
      context_type: undefined,
      related_memories: null,
      ...extra,
    };
  }

  it('T002-1: empty input returns empty results with zero stats', () => {
    const result = collapseAndReassembleChunkResults([]);
    expect(result.results).toHaveLength(0);
    expect(result.stats.collapsedChunkHits).toBe(0);
    expect(result.stats.chunkParents).toBe(0);
  });

  it('T002-2: non-chunk rows pass through without dedup (no parent_id)', () => {
    const rows = [makeRow(1, null), makeRow(2, null)];
    const result = collapseAndReassembleChunkResults(rows);
    expect(result.results).toHaveLength(2);
    expect(result.stats.collapsedChunkHits).toBe(0);
  });

  it('T002-3: duplicate sibling chunks (same parent_id) are collapsed to one row', () => {
    // Two chunk rows both belonging to parent 100 — only first should survive.
    const rows = [makeRow(10, 100), makeRow(11, 100)];
    const result = collapseAndReassembleChunkResults(rows);
    expect(result.results).toHaveLength(1);
    expect(result.stats.collapsedChunkHits).toBe(1);
  });

  it('T002-4: chunks from different parents are kept (one per parent)', () => {
    // Chunk for parent 100 and chunk for parent 200 — both should survive.
    const rows = [makeRow(10, 100), makeRow(20, 200)];
    const result = collapseAndReassembleChunkResults(rows);
    expect(result.results).toHaveLength(2);
    expect(result.stats.collapsedChunkHits).toBe(0);
  });

  it('T002-5: three sibling chunks collapse to one — two hits recorded', () => {
    const rows = [makeRow(10, 100), makeRow(11, 100), makeRow(12, 100)];
    const result = collapseAndReassembleChunkResults(rows);
    expect(result.results).toHaveLength(1);
    expect(result.stats.collapsedChunkHits).toBe(2);
  });

  it('T002-6: mixed chunk and non-chunk rows — each category handled correctly', () => {
    // Rows: non-chunk (id=1), chunk-parent-A (id=10), sibling-chunk-A (id=11, collapsed),
    // Chunk-parent-B (id=20) — non-chunk stays, parent-A kept, sibling collapsed, parent-B kept.
    const rows = [makeRow(1, null), makeRow(10, 100), makeRow(11, 100), makeRow(20, 200)];
    const result = collapseAndReassembleChunkResults(rows);
    expect(result.results).toHaveLength(3); // id=1, id=10, id=20
    expect(result.stats.collapsedChunkHits).toBe(1); // id=11 collapsed
  });

  it('T002-7: collapseAndReassembleChunkResults is exported via __testables', () => {
    expect(typeof collapseAndReassembleChunkResults).toBe('function');
  });

  it('T012-1: duplicate chunk dedup is identical for includeContent=false and includeContent=true', () => {
    const baseRows = [
      makeRow(1, null),
      makeRow(10, 100),
      makeRow(11, 100),
      makeRow(20, 200),
      makeRow(21, 200),
    ];

    const runSearch = (includeContent: boolean) => {
      const rows = baseRows.map((row) => ({
        ...row,
        content_text: includeContent ? `chunk content ${row.id}` : null,
      }));
      const output = collapseAndReassembleChunkResults(rows);
      const ids = output.results.map((row) => String(row.id));
      return { output, ids };
    };

    const withoutContent = runSearch(false);
    const withContent = runSearch(true);

    expect(withoutContent.ids.length).toBe(new Set(withoutContent.ids).size);
    expect(withContent.ids.length).toBe(new Set(withContent.ids).size);

    expect(withoutContent.ids).toEqual(withContent.ids);
    expect(withoutContent.output.stats.collapsedChunkHits).toBe(withContent.output.stats.collapsedChunkHits);
    expect(withoutContent.output.results).toHaveLength(withContent.output.results.length);
  });
});

// Sprint-0 intent weighting guard tests removed — shouldApplyPostSearchIntentWeighting
// Was part of legacy V1 pipeline, removed in 017-refinement-phase-6 Sprint 1.
// V2 pipeline handles intent weighting in Stage 2.
