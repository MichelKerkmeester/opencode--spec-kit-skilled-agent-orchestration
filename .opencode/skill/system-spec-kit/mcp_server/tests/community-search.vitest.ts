// TEST: Phase B T023 — Community Search Fallback
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

const {
  mockIsCommunitySearchFallbackEnabled,
  mockIsCommunitySummariesEnabled,
} = vi.hoisted(() => ({
  mockIsCommunitySearchFallbackEnabled: vi.fn(() => true),
  mockIsCommunitySummariesEnabled: vi.fn(() => true),
}));

vi.mock('../lib/search/search-flags', () => ({
  isCommunitySearchFallbackEnabled: mockIsCommunitySearchFallbackEnabled,
  isCommunitySummariesEnabled: mockIsCommunitySummariesEnabled,
}));

import { searchCommunities } from '../lib/search/community-search';

let db: InstanceType<typeof Database>;

interface SeedCommunityRow {
  id: number;
  summary: string;
  memberIds: number[];
  count: number;
}

function createCommunitySummariesTable(): void {
  db.exec(`
    CREATE TABLE community_summaries (
      community_id INTEGER PRIMARY KEY,
      summary TEXT NOT NULL,
      member_ids TEXT NOT NULL,
      member_count INTEGER NOT NULL
    )
  `);
}

function seedCommunities(rows: SeedCommunityRow[]): void {
  createCommunitySummariesTable();

  const insertStatement = db.prepare(`
    INSERT INTO community_summaries (community_id, summary, member_ids, member_count)
    VALUES (?, ?, ?, ?)
  `);

  for (const row of rows) {
    insertStatement.run(row.id, row.summary, JSON.stringify(row.memberIds), row.count);
  }
}

describe('searchCommunities()', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    mockIsCommunitySearchFallbackEnabled.mockReturnValue(true);
    mockIsCommunitySummariesEnabled.mockReturnValue(true);
  });

  afterEach(() => {
    db.close();
    vi.restoreAllMocks();
  });

  it('returns empty when feature flag disabled', () => {
    mockIsCommunitySearchFallbackEnabled.mockReturnValue(false);
    seedCommunities([
      { id: 1, summary: 'search retrieval pipeline', memberIds: [1, 2], count: 2 },
    ]);

    expect(searchCommunities('search', db)).toEqual({
      results: [],
      totalMemberIds: [],
      source: 'community_fallback',
    });
  });

  it('returns empty when no community_summaries table exists', () => {
    expect(searchCommunities('search', db)).toEqual({
      results: [],
      totalMemberIds: [],
      source: 'community_fallback',
    });
  });

  it('scores and ranks communities by keyword match', () => {
    seedCommunities([
      { id: 1, summary: 'vector embeddings and search', memberIds: [1, 2], count: 2 },
      { id: 2, summary: 'graph retrieval search quality', memberIds: [3, 4, 5], count: 3 },
      { id: 3, summary: 'branch workflow automation', memberIds: [6], count: 1 },
    ]);

    const result = searchCommunities('search quality', db);

    expect(result.results.map((community) => community.communityId)).toEqual([2, 1]);
    expect(result.results[0]).toMatchObject({
      communityId: 2,
      memberCount: 3,
      matchScore: 1,
    });
    expect(result.results[1]).toMatchObject({
      communityId: 1,
      matchScore: 0.5,
    });
  });

  it('respects limit parameter', () => {
    seedCommunities([
      { id: 1, summary: 'search one', memberIds: [1], count: 1 },
      { id: 2, summary: 'search two', memberIds: [2], count: 1 },
      { id: 3, summary: 'search three', memberIds: [3], count: 1 },
    ]);

    const result = searchCommunities('search', db, 2);

    expect(result.results).toHaveLength(2);
    expect(result.totalMemberIds).toHaveLength(2);
  });

  it('deduplicates member IDs across communities', () => {
    seedCommunities([
      { id: 1, summary: 'search pipeline alpha', memberIds: [1, 2, 3], count: 3 },
      { id: 2, summary: 'search pipeline beta', memberIds: [2, 3, 4], count: 3 },
    ]);

    const result = searchCommunities('search pipeline', db);

    expect(result.totalMemberIds).toEqual([1, 2, 3, 4]);
  });
});
