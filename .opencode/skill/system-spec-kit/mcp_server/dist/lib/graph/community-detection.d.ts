import type Database from 'better-sqlite3';
export interface CommunityResult {
    communityId: number;
    memberIds: number[];
    size: number;
    density: number;
}
type WeightedAdjacencyList = Map<number, Map<number, number>>;
type LegacyAdjacencyList = Map<string, Set<string>>;
type AssignmentInput = Map<string, number> | CommunityResult[];
export declare function resetCommunityDetectionState(): void;
declare function buildAdjacencyList(db: Database.Database): WeightedAdjacencyList;
declare function mergeSmallCommunities(groups: Map<number, number[]>, adjacency: WeightedAdjacencyList): Map<number, number[]>;
declare function computeDensity(memberIds: number[], adjacency: WeightedAdjacencyList): number;
declare function buildCommunitiesFromAssignments(db: Database.Database, assignments: Map<string, number>): CommunityResult[];
export declare function detectCommunitiesBFS(db: Database.Database): Map<string, number>;
export declare function shouldEscalateToLouvain(components: Map<string, number>): boolean;
export declare function detectCommunitiesLouvain(adjacency: LegacyAdjacencyList): Map<string, number>;
export declare function detectCommunities(db: Database.Database): CommunityResult[];
export declare function storeCommunityAssignments(db: Database.Database, assignmentsOrCommunities: AssignmentInput): {
    stored: number;
};
export declare function getCommunityMembers(db: Database.Database, memoryId: number): number[];
export declare function applyCommunityBoost(rows: Array<{
    id: number;
    score?: number;
    [key: string]: unknown;
}>, db: Database.Database): Array<{
    id: number;
    score?: number;
    [key: string]: unknown;
}>;
export declare const __testables: {
    buildAdjacencyList: typeof buildAdjacencyList;
    buildCommunitiesFromAssignments: typeof buildCommunitiesFromAssignments;
    computeDensity: typeof computeDensity;
    mergeSmallCommunities: typeof mergeSmallCommunities;
};
export {};
//# sourceMappingURL=community-detection.d.ts.map