// ───────────────────────────────────────────────────────────────
// MODULE: F-011-C1-03 Cross-Encoder maxDocuments Cap Tests
// ───────────────────────────────────────────────────────────────
// Closes packet 046 finding F-011-C1-03: PROVIDER_CONFIG declared a
// per-provider maxDocuments cap (Voyage / Cohere = 100, local = 50) but the
// previous code never enforced it. The fix slices to maxDocuments BEFORE the
// API call, then appends the untouched tail with `scoringMethod:
// 'cross-encoder-tail'` so callers can audit which rows got a neural score
// and which kept their original ordering.

import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import * as crossEncoder from '../../lib/search/cross-encoder.js';
import type { RerankDocument } from '../../lib/search/cross-encoder.js';

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

function resetEnv(): void {
  delete process.env.VOYAGE_API_KEY;
  delete process.env.COHERE_API_KEY;
  delete process.env.RERANKER_LOCAL;
  crossEncoder.resetProvider();
  crossEncoder.resetSession();
}

function restoreAll(): void {
  process.env.VOYAGE_API_KEY = originalEnv.VOYAGE_API_KEY;
  process.env.COHERE_API_KEY = originalEnv.COHERE_API_KEY;
  process.env.RERANKER_LOCAL = originalEnv.RERANKER_LOCAL;
  if (!originalEnv.VOYAGE_API_KEY) delete process.env.VOYAGE_API_KEY;
  if (!originalEnv.COHERE_API_KEY) delete process.env.COHERE_API_KEY;
  if (!originalEnv.RERANKER_LOCAL) delete process.env.RERANKER_LOCAL;
  globalThis.fetch = originalFetch;
  crossEncoder.resetProvider();
  crossEncoder.resetSession();
}

/**
 * Mock the Voyage rerank API. Returns relevance_score = 1.0 / (index + 1) for
 * each document, in the same order received. Captures the request body so the
 * test can assert the provider received only the head (capped) slice.
 */
function mockVoyageFetch(captured: { body: unknown }): void {
  globalThis.fetch = vi.fn(async (_url: unknown, init?: RequestInit): Promise<Response> => {
    const body = init?.body ? JSON.parse(init.body as string) : null;
    captured.body = body;
    const documents = (body?.documents ?? []) as string[];
    const data = documents.map((_text: string, index: number) => ({
      index,
      relevance_score: 1 / (index + 1),
    }));
    return new Response(JSON.stringify({ data }), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;
}

function makeDocuments(count: number): RerankDocument[] {
  return Array.from({ length: count }, (_value, index) => ({
    id: `doc-${index}`,
    content: `content body for document ${index}`,
  }));
}

describe('F-011-C1-03 cross-encoder maxDocuments cap', () => {
  beforeEach(() => {
    resetEnv();
  });

  afterAll(() => {
    restoreAll();
  });

  it('Voyage provider receives at most maxDocuments candidates (cap = 100)', async () => {
    process.env.VOYAGE_API_KEY = 'test-key';
    const captured: { body: unknown } = { body: null };
    mockVoyageFetch(captured);

    // 150 documents — exceeds Voyage cap (100). Tail of 50 must be appended
    // un-reranked with `cross-encoder-tail` marker.
    const documents = makeDocuments(150);
    const results = await crossEncoder.rerankResults('query text', documents, {
      limit: 150,
      useCache: false,
    });

    // Cap was enforced: provider saw exactly 100 documents, not 150.
    const sentDocs = (captured.body as { documents?: string[] })?.documents ?? [];
    expect(sentDocs.length).toBe(100);

    // All 150 results returned (head + tail).
    expect(results.length).toBe(150);
    // First 100 came from the neural reranker; last 50 are the un-reranked
    // tail with the discriminator marker.
    const headCount = results.filter((row) => row.scoringMethod === 'cross-encoder').length;
    const tailCount = results.filter((row) => row.scoringMethod === 'cross-encoder-tail').length;
    expect(headCount).toBe(100);
    expect(tailCount).toBe(50);
  });

  it('cap is a no-op when document count is below the provider limit', async () => {
    process.env.VOYAGE_API_KEY = 'test-key';
    const captured: { body: unknown } = { body: null };
    mockVoyageFetch(captured);

    // 25 documents — well below Voyage cap (100). Provider sees all 25, no
    // tail, no cross-encoder-tail rows in the output.
    const documents = makeDocuments(25);
    const results = await crossEncoder.rerankResults('query text', documents, {
      limit: 25,
      useCache: false,
    });

    const sentDocs = (captured.body as { documents?: string[] })?.documents ?? [];
    expect(sentDocs.length).toBe(25);
    expect(results.length).toBe(25);
    expect(results.every((row) => row.scoringMethod === 'cross-encoder')).toBe(true);
  });

  it('tail rows preserve original ordering (cross-encoder-tail marker)', async () => {
    process.env.VOYAGE_API_KEY = 'test-key';
    const captured: { body: unknown } = { body: null };
    mockVoyageFetch(captured);

    const documents = makeDocuments(120);
    const results = await crossEncoder.rerankResults('query text', documents, {
      limit: 120,
      useCache: false,
    });

    const tailRows = results.filter((row) => row.scoringMethod === 'cross-encoder-tail');
    expect(tailRows.length).toBe(20);
    // Tail rows must keep their original ids in input order — doc-100..doc-119.
    const tailIds = tailRows.map((row) => String(row.id));
    expect(tailIds[0]).toBe('doc-100');
    expect(tailIds[tailIds.length - 1]).toBe('doc-119');
  });

  it('reduces external API payload size (quota guard)', async () => {
    // Net safety: provider receives FEWER documents after the fix, never more.
    // Asserting this contract protects against a future regression that would
    // remove the cap.
    process.env.VOYAGE_API_KEY = 'test-key';
    const captured: { body: unknown } = { body: null };
    mockVoyageFetch(captured);

    const documents = makeDocuments(500);
    await crossEncoder.rerankResults('query text', documents, {
      limit: 500,
      useCache: false,
    });

    const sentDocs = (captured.body as { documents?: string[] })?.documents ?? [];
    expect(sentDocs.length).toBeLessThanOrEqual(crossEncoder.PROVIDER_CONFIG.voyage.maxDocuments);
  });
});
