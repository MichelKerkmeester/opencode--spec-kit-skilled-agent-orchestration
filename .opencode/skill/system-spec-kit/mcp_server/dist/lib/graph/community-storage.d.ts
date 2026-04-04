import type Database from 'better-sqlite3';
import type { CommunityResult } from './community-detection.js';
import type { CommunitySummary } from './community-summaries.js';
export interface StoredCommunity extends CommunityResult {
    createdAt: string;
}
export declare function storeCommunities(db: Database.Database, communities: CommunityResult[]): void;
export declare function getCommunities(db: Database.Database): StoredCommunity[];
export declare function getCommunitySummaries(db: Database.Database): CommunitySummary[];
//# sourceMappingURL=community-storage.d.ts.map