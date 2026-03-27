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
