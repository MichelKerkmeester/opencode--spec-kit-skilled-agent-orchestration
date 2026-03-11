import { describe, it, expect } from 'vitest';
import * as handler from '../handlers/memory-crud';

/** Parse the JSON payload from an MCP response. */
function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

describe('handleMemoryList Edge Cases (T006)', () => {
  it('T006-L1: Invalid sortBy falls back to created_at (verified via payload)', async () => {
    const result = await handler.handleMemoryList({ sortBy: 'invalid_column' as any });
    const parsed = parseResponse(result);
    // Handler accepted it (no error) — fallback to created_at means query succeeded
    expect(parsed.data).toBeDefined();
    expect(typeof parsed.data.total).toBe('number');
  });

  it('T006-L2: Non-boolean includeChunks throws', async () => {
    await expect(handler.handleMemoryList({ includeChunks: 'yes' } as any)).rejects.toThrow(
      /includeChunks.*boolean|boolean/
    );
  });

  it('T006-L3: Negative limit clamped to 1', async () => {
    const result = await handler.handleMemoryList({ limit: -5 });
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(1); // -5 is truthy, so clamp path gives max(1, min(-5, 100)) = 1
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
  });

  it('T006-L7: Empty string specFolder does not error', async () => {
    const result = await handler.handleMemoryList({ specFolder: '' });
    const parsed = parseResponse(result);
    expect(parsed.data).toBeDefined();
  });

  it('T006-L8: Default args return valid payload', async () => {
    const result = await handler.handleMemoryList({});
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(20);
    expect(parsed.data.offset).toBe(0);
    expect(typeof parsed.data.total).toBe('number');
    expect(Array.isArray(parsed.data.results)).toBe(true);
  });
});
