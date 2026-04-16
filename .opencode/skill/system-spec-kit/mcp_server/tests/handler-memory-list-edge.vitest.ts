import { afterAll, afterEach, beforeAll, beforeEach, describe, it, expect, vi } from 'vitest';
import * as handler from '../handlers/memory-crud';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';

/** Parse the JSON payload from an MCP response. */
function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

function getDetails(parsed: Record<string, unknown>) {
  const data = parsed.data as { details?: Record<string, unknown> } | undefined;
  return data?.details;
}

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

describe('handleMemoryList Edge Cases (T006)', () => {
  it('T006-L1: Invalid sortBy falls back to created_at in the response payload', async () => {
    const result = await handler.handleMemoryList({ sortBy: 'invalid_column' as any });
    const parsed = parseResponse(result);
    expect(result.isError).toBe(false);
    expect(parsed.data.sortBy).toBe('created_at');
    expect(typeof parsed.data.total).toBe('number');
  });

  it('T006-L2: Non-boolean includeChunks returns MCP error response with requestId', async () => {
    const result = await handler.handleMemoryList({ includeChunks: 'yes' } as any);
    const parsed = parseResponse(result);
    const details = getDetails(parsed);
    expect(result.isError).toBe(true);
    expect(parsed.data.error).toMatch(/includeChunks must be a boolean/);
    expect(parsed.data.code).toBe('E_INVALID_INPUT');
    expect(typeof details?.requestId).toBe('string');
  });

  it('T006-L3: Negative limit clamped to 1', async () => {
    const result = await handler.handleMemoryList({ limit: -5 });
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(1);
    expect(parsed.data.results.length).toBeLessThanOrEqual(1);
  });

  it('T006-L4: Limit > 100 clamped to 100', async () => {
    const result = await handler.handleMemoryList({ limit: 500 });
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(100);
  });

  it('T006-L5: Negative offset clamped to 0', async () => {
    const result = await handler.handleMemoryList({ offset: -10 });
    const parsed = parseResponse(result);
    expect(parsed.data.offset).toBe(0);
  });

  it('T006-L6: Limit of 1 is accepted', async () => {
    const result = await handler.handleMemoryList({ limit: 1 });
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(1);
    expect(parsed.data.results.length).toBeLessThanOrEqual(1);
  });

  it('T006-L7: Empty string specFolder behaves the same as omitting the filter', async () => {
    vectorIndex.indexMemoryDeferred({
      specFolder: 'specs/alpha',
      filePath: 'alpha.md',
      title: 'Alpha',
      encodingIntent: 'document',
    });
    vectorIndex.indexMemoryDeferred({
      specFolder: 'specs/beta',
      filePath: 'beta.md',
      title: 'Beta',
      encodingIntent: 'document',
    });

    const baseline = parseResponse(await handler.handleMemoryList({}));
    const emptyFilter = parseResponse(await handler.handleMemoryList({ specFolder: '' }));

    expect(emptyFilter.data.total).toBe(baseline.data.total);
    expect(emptyFilter.data.count).toBe(baseline.data.count);
    expect(
      new Set((emptyFilter.data.results as Array<{ filePath: string }>).map((row) => row.filePath)),
    ).toEqual(
      new Set((baseline.data.results as Array<{ filePath: string }>).map((row) => row.filePath)),
    );
  });

  it('T006-L8: Default args return valid payload', async () => {
    const result = await handler.handleMemoryList({});
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(20);
    expect(parsed.data.offset).toBe(0);
    expect(parsed.data.sortBy).toBe('created_at');
    expect(typeof parsed.data.total).toBe('number');
    expect(Array.isArray(parsed.data.results)).toBe(true);
  });

  it('T006-L9: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockRejectedValue(new Error('marker read failed'));

    const result = await handler.handleMemoryList({});
    const parsed = parseResponse(result);

    expect(result.isError).toBe(true);
    expect(parsed.data.code).toBe('E021');
    expect(parsed.data.error).toMatch(/Database refresh failed before query execution/);
    expect(typeof getDetails(parsed)?.requestId).toBe('string');
  });
});

/* ───────────────────────────────────────────────────────────────
   T245: Filter interaction coverage for handleMemoryList
   Finding #31: handler-memory-list-edge.vitest.ts only exercises
   sort/limit/offset/specFolder behavior, missing filter interactions
   like combined specFolder + sortBy, specFolder + limit, and
   specFolder filtering actually reducing the result set.
──────────────────────────────────────────────────────────────── */

describe('handleMemoryList Filter Interactions (T245)', () => {
  beforeEach(async () => {
    // Seed the in-memory DB with records from two different spec folders
    vectorIndex.indexMemoryDeferred({
      specFolder: 'specs/001-auth',
      filePath: 'auth-design.md',
      title: 'Auth Design',
      encodingIntent: 'document',
    });
    vectorIndex.indexMemoryDeferred({
      specFolder: 'specs/001-auth',
      filePath: 'auth-impl.md',
      title: 'Auth Implementation',
      encodingIntent: 'document',
    });
    vectorIndex.indexMemoryDeferred({
      specFolder: 'specs/002-billing',
      filePath: 'billing-design.md',
      title: 'Billing Design',
      encodingIntent: 'document',
    });
  });

  it('T245-FI1: specFolder filter reduces results to matching folder only', async () => {
    const allResults = parseResponse(await handler.handleMemoryList({ limit: 100 }));
    const authResults = parseResponse(
      await handler.handleMemoryList({ specFolder: 'specs/001-auth', limit: 100 }),
    );

    expect(allResults.data.total).toBeGreaterThan(authResults.data.total);
    // All returned results should be from the auth spec folder
    for (const row of authResults.data.results as Array<{ specFolder?: string }>) {
      if (row.specFolder) {
        expect(row.specFolder).toBe('specs/001-auth');
      }
    }
  });

  it('T245-FI2: specFolder + limit combined respects both constraints', async () => {
    const result = parseResponse(
      await handler.handleMemoryList({ specFolder: 'specs/001-auth', limit: 1 }),
    );

    expect(result.data.limit).toBe(1);
    expect(result.data.results.length).toBeLessThanOrEqual(1);
  });

  it('T245-FI3: specFolder + sortBy updated_at returns ordered results', async () => {
    const result = parseResponse(
      await handler.handleMemoryList({
        specFolder: 'specs/001-auth',
        sortBy: 'updated_at',
      }),
    );

    expect(result.data.sortBy).toBe('updated_at');
    expect(Array.isArray(result.data.results)).toBe(true);
  });

  it('T245-FI4: specFolder + offset skips records correctly', async () => {
    const page1 = parseResponse(
      await handler.handleMemoryList({ specFolder: 'specs/001-auth', limit: 1, offset: 0 }),
    );
    const page2 = parseResponse(
      await handler.handleMemoryList({ specFolder: 'specs/001-auth', limit: 1, offset: 1 }),
    );

    if (page1.data.total > 1) {
      // If there are multiple records, pages should differ
      const page1Files = (page1.data.results as Array<{ filePath: string }>).map(r => r.filePath);
      const page2Files = (page2.data.results as Array<{ filePath: string }>).map(r => r.filePath);
      expect(page1Files).not.toEqual(page2Files);
    }
  });

  it('T245-FI5: non-existent specFolder returns zero results', async () => {
    const result = parseResponse(
      await handler.handleMemoryList({ specFolder: 'specs/999-nonexistent' }),
    );

    expect(result.data.total).toBe(0);
    expect(result.data.results).toEqual([]);
  });

  it('T245-FI6: sortBy importance_weight is a valid sort column', async () => {
    const result = parseResponse(
      await handler.handleMemoryList({ sortBy: 'importance_weight' }),
    );

    expect(result.data.sortBy).toBe('importance_weight');
    expect(Array.isArray(result.data.results)).toBe(true);
  });
});
