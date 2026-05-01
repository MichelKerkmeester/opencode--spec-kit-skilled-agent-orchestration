// ───────────────────────────────────────────────────────────────
// MODULE: Community Graph Shared Types
// ───────────────────────────────────────────────────────────────
// F-017-D2-02: Type-only seam shared by community-detection,
// community-storage, and community-summaries. Previously these three modules
// formed a triangular type cycle: community-summaries imported
// `CommunityResult` from community-detection, community-storage imported
// `CommunitySummary` from community-summaries, and community-detection used
// `getCommunities`/`storeCommunities` from community-storage. Extracting the
// shared types into this neutral module breaks the value-level cycle: each
// module depends inward on this type seam plus the runtime functions it
// actually needs.

export interface CommunityResult {
  communityId: number;
  memberIds: number[];
  size: number;
  density: number;
}

export interface CommunitySummary {
  communityId: number;
  summary: string;
  memberCount: number;
  memberIds: number[];
}
