import type Database from 'better-sqlite3';
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
export declare function searchCommunities(query: string, db: Database.Database, limit?: number): CommunitySearchOutput;
//# sourceMappingURL=community-search.d.ts.map