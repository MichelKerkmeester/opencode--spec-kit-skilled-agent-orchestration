// ───────────────────────────────────────────────────────────────
// MODULE: Community Search
// ───────────────────────────────────────────────────────────────
// Phase B T018: Community-level search as fallback channel.
//
// When primary search returns weak or zero results, this module
// searches community summaries by keyword matching and returns
// matching community member IDs for injection into the pipeline.
//
// FEATURE FLAG: SPECKIT_COMMUNITY_SEARCH_FALLBACK (default ON, graduated)

import type Database from 'better-sqlite3';

import { isCommunitySearchFallbackEnabled, isCommunitySummariesEnabled } from './search-flags.js';

// -- Types --

export interface CommunitySearchResult {
  communityId: number;
  summary: string;
  memberIds: number[];
  memberCount: number;
  matchScore: number;
}

export interface CommunitySearchOutput {
  results: CommunitySearchResult[];
  totalMemberIds: number[];
  source: 'community_fallback';
}

// -- Internal helpers --

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(tableName) as { name?: string } | undefined;
  return row?.name === tableName;
}

function parseMemberIds(memberIdsJson: string): number[] {
  try {
    const parsed = JSON.parse(memberIdsJson) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-search] parseMemberIds failed (fail-open): ${message}`);
    return [];
  }
}

/**
 * Score a community summary against query terms.
 * Returns 0-1 based on fraction of query terms found in the summary.
 */
function scoreSummary(summary: string, queryTerms: string[]): number {
  if (queryTerms.length === 0) return 0;
  const lowerSummary = summary.toLowerCase();
  let matches = 0;
  for (const term of queryTerms) {
    if (lowerSummary.includes(term)) matches++;
  }
  return matches / queryTerms.length;
}

/**
 * Extract meaningful search terms from a query string.
 * Filters out common stop words.
 */
function extractQueryTerms(query: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'and', 'or', 'not', 'is', 'are', 'was', 'were',
    'be', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that',
    'it', 'its', 'my', 'your', 'our', 'their', 'all', 'any', 'some',
  ]);
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
}

// -- Public API --

/**
 * Search community summaries by keyword matching.
 *
 * Returns communities whose summaries match the query terms, sorted by match
 * score. Used as a fallback channel when primary search returns weak results.
 *
 * @param query - The search query string
 * @param db - SQLite database instance
 * @param limit - Maximum communities to return (default 5)
 * @returns Community search results with member IDs for pipeline injection
 */
export function searchCommunities(
  query: string,
  db: Database.Database,
  limit: number = 5,
): CommunitySearchOutput {
  const emptyOutput: CommunitySearchOutput = {
    results: [],
    totalMemberIds: [],
    source: 'community_fallback',
  };

  if (!isCommunitySearchFallbackEnabled() || !isCommunitySummariesEnabled()) {
    return emptyOutput;
  }

  try {
    if (!tableExists(db, 'community_summaries')) {
      return emptyOutput;
    }

    const queryTerms = extractQueryTerms(query);
    if (queryTerms.length === 0) return emptyOutput;

    const rows = db.prepare(`
      SELECT community_id, summary, member_ids, member_count
      FROM community_summaries
      ORDER BY community_id ASC
    `).all() as Array<{
      community_id: number;
      summary: string;
      member_ids: string;
      member_count: number;
    }>;

    if (rows.length === 0) return emptyOutput;

    // Score and rank communities by query-term match
    const scored: CommunitySearchResult[] = [];
    for (const row of rows) {
      const matchScore = scoreSummary(row.summary, queryTerms);
      if (matchScore > 0) {
        scored.push({
          communityId: row.community_id,
          summary: row.summary,
          memberIds: parseMemberIds(row.member_ids),
          memberCount: row.member_count,
          matchScore,
        });
      }
    }

    // Sort by match score descending, then by member count descending
    scored.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return b.memberCount - a.memberCount;
    });

    const topResults = scored.slice(0, limit);

    // Collect unique member IDs across all matched communities
    const memberIdSet = new Set<number>();
    for (const r of topResults) {
      for (const id of r.memberIds) {
        memberIdSet.add(id);
      }
    }

    return {
      results: topResults,
      totalMemberIds: Array.from(memberIdSet),
      source: 'community_fallback',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-search] searchCommunities failed (fail-open): ${message}`);
    return emptyOutput;
  }
}
