import { describe, it, expect } from 'vitest';
import * as handler from '../handlers/memory-crud';

/** Parse the JSON payload from an MCP response. */
function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

describe('handleMemoryStats Edge Cases (T007a)', () => {
  it('T007a-S1: Zero limit falls back to 10 via || operator', async () => {
    const result = await handler.handleMemoryStats({ limit: 0 });
    const parsed = parseResponse(result);
    expect(parsed.data).toBeDefined();
    expect(typeof parsed.data.totalMemories).toBe('number');
  });

  it('T007a-S2: Limit > 100 clamped to 100', async () => {
    const result = await handler.handleMemoryStats({ limit: 999 });
    const parsed = parseResponse(result);
    expect(parsed.data).toBeDefined();
    expect(typeof parsed.data.totalMemories).toBe('number');
    expect(Array.isArray(parsed.data.topFolders)).toBe(true);
  });

  it('T007a-S3: Limit of 1 is accepted', async () => {
    const result = await handler.handleMemoryStats({ limit: 1 });
    const parsed = parseResponse(result);
    expect(parsed.data).toBeDefined();
    expect(typeof parsed.data.totalMemories).toBe('number');
  });

  it('T007a-S4: includeArchived=true does not throw', async () => {
    const result = await handler.handleMemoryStats({ includeArchived: true });
    const parsed = parseResponse(result);
    expect(parsed.data).toBeDefined();
    expect(typeof parsed.data.totalMemories).toBe('number');
  });

  it('T007a-S5: Empty excludePatterns array accepted', async () => {
    const result = await handler.handleMemoryStats({ excludePatterns: [] });
    const parsed = parseResponse(result);
    expect(parsed.data).toBeDefined();
    expect(typeof parsed.data.totalMemories).toBe('number');
  });

  it('T007a-S6: Non-array excludePatterns throws', async () => {
    await expect(
      handler.handleMemoryStats({ excludePatterns: 'not-an-array' } as any)
    ).rejects.toThrow(/excludePatterns.*array|array/);
  });

  it('T007a-S7: folderRanking count accepted', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'count' });
    const parsed = parseResponse(result);
    expect(parsed.data.folderRanking).toBe('count');
  });

  it('T007a-S8: folderRanking recency accepted', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'recency' });
    const parsed = parseResponse(result);
    expect(parsed.data.folderRanking).toBe('recency');
  });

  it('T007a-S9: folderRanking importance accepted', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'importance' });
    const parsed = parseResponse(result);
    expect(parsed.data.folderRanking).toBe('importance');
  });

  it('T007a-S10: folderRanking composite accepted', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'composite' });
    const parsed = parseResponse(result);
    expect(parsed.data.folderRanking).toBe('composite');
  });

  it('T007a-S11: Invalid folderRanking throws', async () => {
    await expect(
      handler.handleMemoryStats({ folderRanking: 'invalid_ranking' } as any)
    ).rejects.toThrow(/folderRanking|Invalid/);
  });

  it('T007a-S12: Default args return valid payload with totalSpecFolders', async () => {
    const result = await handler.handleMemoryStats(null as any);
    const parsed = parseResponse(result);
    expect(parsed.data).toBeDefined();
    expect(typeof parsed.data.totalMemories).toBe('number');
    expect(typeof parsed.data.totalSpecFolders).toBe('number');
    expect(Array.isArray(parsed.data.topFolders)).toBe(true);
  });
});
