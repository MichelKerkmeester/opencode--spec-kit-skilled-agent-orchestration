import type Database from 'better-sqlite3';
import type { CommunityResult } from './community-detection.js';
export interface CommunitySummary {
    communityId: number;
    summary: string;
    memberCount: number;
    memberIds: number[];
}
export declare function generateCommunitySummaries(db: Database.Database, communities: CommunityResult[]): CommunitySummary[];
//# sourceMappingURL=community-summaries.d.ts.map