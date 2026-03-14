// ───────────────────────────────────────────────────────────────
// 1. TEST - TRACE PROPAGATION CHAIN (CHK-038)
// ───────────────────────────────────────────────────────────────
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as hybridSearch from '../lib/search/hybrid-search';
import * as bm25Index from '../lib/search/bm25-index';
import { formatSearchResults } from '../formatters/search-results';

type InitDb = Parameters<typeof hybridSearch.init>[0];
type VectorSearchFn = NonNullable<Parameters<typeof hybridSearch.init>[1]>;

const FEATURE_FLAG = 'SPECKIT_COMPLEXITY_ROUTER';
const savedFlag = process.env[FEATURE_FLAG];

interface MockDoc {
  id: number;
  content: string;
  spec_folder: string;
}

const MOCK_DOCS: MockDoc[] = [
  {
    id: 1,
    content: 'Authentication module implementation details for secure user login and session management.',
    spec_folder: 'specs/auth',
  },
  {
    id: 2,
    content: 'Database refactor notes covering connection retry logic and transactional recovery behavior.',
    spec_folder: 'specs/db',
  },
  {
    id: 3,
    content: 'Security guidance for OAuth refresh handling and token lifecycle coordination across systems.',
    spec_folder: 'specs/security',
  },
];

function createMockDb(): InitDb {
  return {
    prepare(sql: string) {
      return {
        get() {
          if (sql.includes('memory_fts')) {
            return { count: 1 };
          }
          return null;
        },
        all() {
          return MOCK_DOCS.map((doc, index) => ({
            ...doc,
            fts_score: 10 - index,
          }));
        },
      };
    },
  } as InitDb;
}

const mockVectorSearch: VectorSearchFn = (_embedding, options = {}) => {
  const limit = typeof options.limit === 'number' ? options.limit : 10;
  return MOCK_DOCS.slice(0, limit).map((doc, index) => ({
    ...doc,
    similarity: 0.95 - index * 0.1,
  }));
};

async function runQuery(query: string) {
  const results = await hybridSearch.hybridSearchEnhanced(query, new Float32Array(384).fill(0.2), {
    limit: 5,
  });
  expect(results.length).toBeGreaterThan(0);
  return results;
}

function parseFirstResultTraceText(payload: Awaited<ReturnType<typeof formatSearchResults>>) {
  const text = payload.content[0];
  expect(text?.type).toBe('text');
  if (!text || text.type !== 'text') {
    throw new Error('Expected text payload');
  }

  const envelope = JSON.parse(text.text) as {
    data: {
      results: Array<{
        trace?: {
          queryComplexity?: string | null;
        };
      }>;
    };
  };

  return envelope.data.results[0]?.trace ?? null;
}

describe('CHK-038: Trace propagation uses the production path', () => {
  beforeEach(() => {
    process.env[FEATURE_FLAG] = 'true';
    hybridSearch.init(createMockDb(), mockVectorSearch, null);
    bm25Index.resetIndex();
    const bm25 = bm25Index.getIndex();
    for (const doc of MOCK_DOCS) {
      bm25.addDocument(String(doc.id), doc.content);
    }
  });

  afterEach(() => {
    bm25Index.resetIndex();
    if (savedFlag === undefined) {
      delete process.env[FEATURE_FLAG];
    } else {
      process.env[FEATURE_FLAG] = savedFlag;
    }
  });

  it.each([
    ['fix bug', 'simple'],
    ['refactor the database connection module', 'moderate'],
    [
      'explain how the authentication module integrates with the external OAuth provider and handles token refresh',
      'complex',
    ],
  ] as const)('writes queryComplexity=%s tier into runtime trace metadata', async (query, expectedTier) => {
    const results = await runQuery(query);
    expect(results[0]?.traceMetadata).toMatchObject({
      queryComplexity: expectedTier,
    });
  });

  it('surfaces runtime queryComplexity through formatSearchResults trace fallback', async () => {
    const results = await runQuery('refactor the database connection module');
    const formatted = await formatSearchResults(results, 'semantic', false, null, null, null, {}, true);
    const trace = parseFirstResultTraceText(formatted);

    expect(trace?.queryComplexity).toBe('moderate');
  });
});
