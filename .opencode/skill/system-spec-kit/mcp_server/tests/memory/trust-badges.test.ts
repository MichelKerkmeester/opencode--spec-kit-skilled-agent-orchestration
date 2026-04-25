import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import {
  fetchTrustBadgeSnapshots,
  formatSearchResults,
  toTrustBadges,
  type MemoryResultEnvelope,
  type RawSearchResult,
} from '../../formatters/search-results';
import type { MCPEnvelope, MCPResponse } from '../../lib/response/envelope';
import { formatAgeString } from '../../lib/utils/format-helpers';

interface SearchResultsResponseData {
  count: number;
  results: MemoryResultEnvelope[];
}

type SearchResultsEnvelope = MCPEnvelope<SearchResultsResponseData>;

function parseEnvelope(response: MCPResponse): SearchResultsEnvelope {
  const firstContent = response.content[0];
  if (!firstContent || firstContent.type !== 'text') {
    throw new Error('Expected text response envelope');
  }
  return JSON.parse(firstContent.text) as SearchResultsEnvelope;
}

function createDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      source_anchor TEXT,
      target_anchor TEXT,
      extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT
    );

    CREATE TABLE weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      reason TEXT
    );
  `);
  return db;
}

// 010/007 R-007-13: previously skipped due to a vitest mock-resolution path
// mismatch — `requireDb` is re-exported through `utils/index` and the mock
// layer did not intercept the formatter's resolved path reliably. The
// formatter now exposes a `dbGetter` injection seam on
// `fetchTrustBadgeSnapshots` (default = production `requireDb`); tests pass
// their own getter pointing at an in-memory better-sqlite3 instance and
// verify the SQL-derivation pipeline directly via `fetchTrustBadgeSnapshots`
// + `toTrustBadges`. The explicit-pass-through test continues to exercise
// the public `formatSearchResults` envelope path because it does not depend
// on the database.
describe('memory trust badges', () => {
  let activeDb: Database.Database | null = null;

  beforeEach(() => {
    activeDb = createDb();
  });

  afterEach(() => {
    if (activeDb) {
      activeDb.close();
    }
    activeDb = null;
  });

  // Test getter that returns the per-test in-memory DB. The cast is safe
  // because the production `requireDb` returns a `better-sqlite3` Database
  // instance and the test creates one of the same type.
  function testDbGetter(): ReturnType<typeof Database> {
    if (!activeDb) throw new Error('test db not initialized');
    return activeDb;
  }

  it('derives trust badges from connected causal-edge metadata', () => {
    const extractedAt = new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)).toISOString();
    const lastAccessed = new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString();

    activeDb?.prepare(`
      INSERT INTO causal_edges (
        source_id, target_id, relation, strength, extracted_at, last_accessed
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run('99', '11', 'caused', 0.82, extractedAt, lastAccessed);

    activeDb?.prepare(`
      INSERT INTO weight_history (edge_id, old_strength, new_strength, reason)
      VALUES (?, ?, ?, ?)
    `).run(1, 0.5, 0.82, 'promoted');

    const rawResults: RawSearchResult[] = [
      {
        id: 11,
        spec_folder: 'specs/011-trust',
        file_path: '/tmp/11.md',
        title: 'Trust Target',
      },
    ];

    const fetchResult = fetchTrustBadgeSnapshots(
      rawResults,
      testDbGetter as unknown as () => ReturnType<typeof Database>,
    );
    const badges = toTrustBadges(fetchResult.snapshots.get(11) ?? null);

    expect(fetchResult.attempted).toBe(true);
    expect(fetchResult.derivedCount).toBeGreaterThan(0);
    expect(badges).toEqual({
      confidence: 0.82,
      extractionAge: formatAgeString(extractedAt),
      lastAccessAge: formatAgeString(lastAccessed),
      orphan: false,
      weightHistoryChanged: true,
    });
  });

  it('marks results as orphaned when they have no incoming edges', () => {
    const extractedAt = new Date(Date.now() - (4 * 24 * 60 * 60 * 1000)).toISOString();

    activeDb?.prepare(`
      INSERT INTO causal_edges (
        source_id, target_id, relation, strength, extracted_at
      ) VALUES (?, ?, ?, ?, ?)
    `).run('12', '13', 'supports', 0.4, extractedAt);

    const rawResults: RawSearchResult[] = [
      {
        id: 12,
        spec_folder: 'specs/012-trust',
        file_path: '/tmp/12.md',
        title: 'Orphan Candidate',
      },
    ];

    const fetchResult = fetchTrustBadgeSnapshots(
      rawResults,
      testDbGetter as unknown as () => ReturnType<typeof Database>,
    );
    const badges = toTrustBadges(fetchResult.snapshots.get(12) ?? null);

    expect(fetchResult.attempted).toBe(true);
    expect(badges).toEqual({
      confidence: 0.4,
      extractionAge: formatAgeString(extractedAt),
      lastAccessAge: 'never',
      orphan: true,
      weightHistoryChanged: false,
    });
  });

  it('preserves explicit trust badges when callers precompute them', async () => {
    // This case exercises the explicit-badges pass-through path on
    // `formatSearchResults`. It does not depend on the database — the
    // formatter's internal `fetchTrustBadgeSnapshots` call is allowed to
    // fall through (its try/catch returns an empty Map when `requireDb`
    // throws), and the explicit `trustBadges` value wins regardless.
    const response = await formatSearchResults([
      {
        id: 20,
        spec_folder: 'specs/020-trust',
        file_path: '/tmp/20.md',
        title: 'Explicit Badges',
        trustBadges: {
          confidence: 0.55,
          extractionAge: '1 week ago',
          lastAccessAge: 'today',
          orphan: false,
          weightHistoryChanged: true,
        },
      },
    ], 'semantic');

    const result = parseEnvelope(response).data.results[0];
    expect(result.trustBadges).toEqual({
      confidence: 0.55,
      extractionAge: '1 week ago',
      lastAccessAge: 'today',
      orphan: false,
      weightHistoryChanged: true,
    });
  });
});
