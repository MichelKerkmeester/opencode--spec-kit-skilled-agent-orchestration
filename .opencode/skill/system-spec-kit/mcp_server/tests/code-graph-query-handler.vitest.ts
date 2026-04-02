import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
  queryOutline: vi.fn(),
  ensureCodeGraphReady: vi.fn(async () => ({ action: 'none', reason: 'ok' })),
}));

vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getDb: mocks.getDb,
  queryEdgesFrom: mocks.queryEdgesFrom,
  queryEdgesTo: mocks.queryEdgesTo,
  queryOutline: mocks.queryOutline,
}));

vi.mock('../lib/code-graph/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
}));

import { handleCodeGraphQuery } from '../handlers/code-graph/query.js';

function createDb(symbolId = 'symbol-1') {
  return {
    prepare: vi.fn((sql: string) => ({
      get: vi.fn(() => {
        if (sql.includes('symbol_id = ?')) {
          return undefined;
        }
        if (sql.includes('fq_name = ?') || sql.includes('name = ?')) {
          return { symbol_id: symbolId };
        }
        return undefined;
      }),
    })),
  };
}

describe('code-graph-query handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDb.mockReturnValue(createDb());
    mocks.queryEdgesFrom.mockReturnValue([]);
    mocks.queryEdgesTo.mockReturnValue([]);
    mocks.queryOutline.mockReturnValue([]);
  });

  it('honors explicit edgeType for one-hop queries', async () => {
    await handleCodeGraphQuery({
      operation: 'imports_from',
      subject: 'SomeSymbol',
      edgeType: 'imports',
    });

    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(process.cwd(), { allowInlineIndex: false });
    expect(mocks.queryEdgesFrom).toHaveBeenCalledWith('symbol-1', 'IMPORTS');
  });

  it('includes the normalized edgeType in transitive responses', async () => {
    mocks.queryEdgesFrom.mockReturnValue([
      {
        edge: { targetId: 'symbol-2' },
        targetNode: { fqName: 'TargetSymbol', filePath: 'src/target.ts', startLine: 12 },
      },
    ]);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
      includeTransitive: true,
      edgeType: 'overrides',
      maxDepth: 2,
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.edgeType).toBe('OVERRIDES');
    expect(parsed.data.transitive).toBe(true);
    expect(mocks.queryEdgesFrom).toHaveBeenCalledWith('symbol-1', 'OVERRIDES');
  });
});
