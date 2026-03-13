import { afterAll, afterEach, beforeAll, beforeEach, describe, it, expect, vi } from 'vitest';
import * as handler from '../handlers/memory-crud';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';

const seededSpecFolders = new Set<string>();

/** Parse the JSON payload from an MCP response. */
function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

function getErrorMessage(parsed: Record<string, unknown>) {
  const data = parsed.data as { error?: unknown } | undefined;
  return typeof data?.error === 'string' ? data.error : undefined;
}

function getDetails(parsed: Record<string, unknown>) {
  const data = parsed.data as { details?: Record<string, unknown> } | undefined;
  return data?.details;
}

async function insertStatsRows(specFolders: string[], repeat = 1) {
  const database = vectorIndex.getDb();
  if (!database) {
    throw new Error('Database not initialized');
  }

  const now = new Date().toISOString();
  const insert = database.prepare(`
    INSERT INTO memory_index (spec_folder, file_path, title, created_at, updated_at, embedding_status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const [index, specFolder] of specFolders.entries()) {
    seededSpecFolders.add(specFolder);
    const safeFolder = specFolder.replace(/[^a-zA-Z0-9/_-]/g, '-');
    for (let occurrence = 0; occurrence < repeat; occurrence += 1) {
      insert.run(
        specFolder,
        `/tmp/${safeFolder}-${index}-${occurrence}.md`,
        `Stats Edge ${index}-${occurrence}`,
        now,
        now,
        'pending',
      );
    }
  }
}

function cleanupSeededStatsRows(): void {
  if (seededSpecFolders.size === 0) {
    return;
  }

  const database = vectorIndex.getDb();
  if (!database) {
    seededSpecFolders.clear();
    return;
  }

  const deleteBySpecFolder = database.prepare('DELETE FROM memory_index WHERE spec_folder = ?');
  for (const specFolder of seededSpecFolders) {
    deleteBySpecFolder.run(specFolder);
  }
  seededSpecFolders.clear();
}

afterEach(() => {
  vi.restoreAllMocks();
  cleanupSeededStatsRows();
});

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

describe('handleMemoryStats Edge Cases (T007a)', () => {
  it('T007a-S1: Zero limit falls back to 10', async () => {
    const result = await handler.handleMemoryStats({ limit: 0 });
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(10);
    expect(parsed.data.topFolders.length).toBeLessThanOrEqual(10);
  });

  it('T007a-S2: Limit > 100 clamps to 100', async () => {
    const result = await handler.handleMemoryStats({ limit: 999 });
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(100);
    expect(parsed.data.topFolders.length).toBeLessThanOrEqual(100);
  });

  it('T007a-S3: Limit of 1 is accepted', async () => {
    const result = await handler.handleMemoryStats({ limit: 1 });
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(1);
    expect(parsed.data.topFolders.length).toBeLessThanOrEqual(1);
  });

  it('T007a-S4: includeArchived=true can surface archived folders in count mode', async () => {
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await insertStatsRows([
      `specs/z_archive/${runId}-archived`,
      `specs/${runId}-active`,
    ], 250);

    const result = await handler.handleMemoryStats({ folderRanking: 'count', includeArchived: true, limit: 100 });
    const parsed = parseResponse(result);
    expect(parsed.data.topFolders.some((folder: { folder: string }) => folder.folder.includes(`${runId}-archived`))).toBe(true);
  });

  it('T007a-S5: excludePatterns filters matching folder names', async () => {
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await insertStatsRows([
      `specs/${runId}-keep`,
      `specs/${runId}-scratch`,
    ], 250);

    const result = await handler.handleMemoryStats({
      folderRanking: 'count',
      excludePatterns: ['scratch'],
      limit: 100,
    });
    const parsed = parseResponse(result);
    expect(parsed.data.topFolders.some((folder: { folder: string }) => folder.folder.includes(`${runId}-scratch`))).toBe(false);
    expect(parsed.data.topFolders.some((folder: { folder: string }) => folder.folder.includes(`${runId}-keep`))).toBe(true);
  });

  it('T007a-S6: Non-array excludePatterns returns MCP error response with requestId', async () => {
    const result = await handler.handleMemoryStats({ excludePatterns: 'not-an-array' } as any);
    const parsed = parseResponse(result);
    const details = getDetails(parsed);
    expect(result.isError).toBe(true);
    expect(getErrorMessage(parsed)).toMatch(/excludePatterns must be an array/);
    expect(parsed.data.code).toBe('E_INVALID_INPUT');
    expect(typeof details?.requestId).toBe('string');
  });

  it('T007a-S7: folderRanking count accepted', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'count' });
    const parsed = parseResponse(result);
    expect(parsed.data.folderRanking).toBe('count');
    expect(Array.isArray(parsed.data.topFolders)).toBe(true);
  });

  it('T007a-S8: folderRanking recency accepted', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'recency' });
    const parsed = parseResponse(result);
    expect(parsed.data.folderRanking).toBe('recency');
    expect(Array.isArray(parsed.data.topFolders)).toBe(true);
  });

  it('T007a-S9: folderRanking importance accepted', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'importance' });
    const parsed = parseResponse(result);
    expect(parsed.data.folderRanking).toBe('importance');
    expect(Array.isArray(parsed.data.topFolders)).toBe(true);
  });

  it('T007a-S10: folderRanking composite accepted and exposes score data', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'composite', includeScores: true });
    const parsed = parseResponse(result);
    expect(parsed.data.folderRanking).toBe('composite');
    expect(Array.isArray(parsed.data.topFolders)).toBe(true);
    if (parsed.data.topFolders.length > 0) {
      expect(parsed.data.topFolders[0]).toHaveProperty('score');
    }
  });

  it('T007a-S11: Invalid folderRanking returns MCP error response with requestId', async () => {
    const result = await handler.handleMemoryStats({ folderRanking: 'invalid_ranking' } as any);
    const parsed = parseResponse(result);
    const details = getDetails(parsed);
    expect(result.isError).toBe(true);
    expect(getErrorMessage(parsed)).toMatch(/Invalid folderRanking/);
    expect(parsed.data.code).toBe('E_INVALID_INPUT');
    expect(typeof details?.requestId).toBe('string');
  });

  it('T007a-S12: Default args return valid payload with totalSpecFolders', async () => {
    const result = await handler.handleMemoryStats(null as any);
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(10);
    expect(typeof parsed.data.totalMemories).toBe('number');
    expect(typeof parsed.data.totalSpecFolders).toBe('number');
    expect(Array.isArray(parsed.data.topFolders)).toBe(true);
  });

  it('T007a-S13: totalSpecFolders remains greater than topFolders length when limit truncates', async () => {
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await insertStatsRows(Array.from({ length: 5 }, (_, index) => `spec-${runId}-${index}`));

    const result = await handler.handleMemoryStats({ folderRanking: 'count', limit: 2 });
    const parsed = parseResponse(result);
    expect(parsed.data.limit).toBe(2);
    expect(Array.isArray(parsed.data.topFolders)).toBe(true);
    expect(parsed.data.topFolders.length).toBe(2);
    expect(parsed.data.totalSpecFolders).toBeGreaterThan(parsed.data.topFolders.length);
  });

  it('T007a-S14: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockRejectedValue(new Error('marker read failed'));

    const result = await handler.handleMemoryStats({ folderRanking: 'count' });
    const parsed = parseResponse(result);
    const details = getDetails(parsed);

    expect(result.isError).toBe(true);
    expect(getErrorMessage(parsed)).toMatch(/Database refresh failed before query execution/);
    expect(parsed.data.code).toBe('E021');
    expect(typeof details?.requestId).toBe('string');
  });
});
