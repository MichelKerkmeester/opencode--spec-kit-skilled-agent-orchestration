import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

let activeDb: Database.Database | null = null;

vi.mock('../../lib/search/vector-index.js', () => ({
  getDb: () => activeDb,
}));

import {
  formatSearchResults,
  type MemoryResultEnvelope,
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

describe('memory trust badges', () => {
  beforeEach(() => {
    activeDb = createDb();
  });

  afterEach(() => {
    if (activeDb) {
      activeDb.close();
    }
    activeDb = null;
  });

  it('derives trust badges from connected causal-edge metadata', async () => {
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

    const response = await formatSearchResults([
      {
        id: 11,
        spec_folder: 'specs/011-trust',
        file_path: '/tmp/11.md',
        title: 'Trust Target',
      },
    ], 'semantic');

    const result = parseEnvelope(response).data.results[0];
    expect(result.trustBadges).toEqual({
      confidence: 0.82,
      extractionAge: formatAgeString(extractedAt),
      lastAccessAge: formatAgeString(lastAccessed),
      orphan: false,
      weightHistoryChanged: true,
    });
  });

  it('marks results as orphaned when they have no incoming edges', async () => {
    const extractedAt = new Date(Date.now() - (4 * 24 * 60 * 60 * 1000)).toISOString();

    activeDb?.prepare(`
      INSERT INTO causal_edges (
        source_id, target_id, relation, strength, extracted_at
      ) VALUES (?, ?, ?, ?, ?)
    `).run('12', '13', 'supports', 0.4, extractedAt);

    const response = await formatSearchResults([
      {
        id: 12,
        spec_folder: 'specs/012-trust',
        file_path: '/tmp/12.md',
        title: 'Orphan Candidate',
      },
    ], 'semantic');

    const result = parseEnvelope(response).data.results[0];
    expect(result.trustBadges).toEqual({
      confidence: 0.4,
      extractionAge: formatAgeString(extractedAt),
      lastAccessAge: 'never',
      orphan: true,
      weightHistoryChanged: false,
    });
  });

  it('preserves explicit trust badges when callers precompute them', async () => {
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
