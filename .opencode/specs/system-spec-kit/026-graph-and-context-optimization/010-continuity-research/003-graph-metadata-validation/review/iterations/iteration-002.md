# Iteration 002: Canonical Entity Preference Check

## Focus
Reviewed the entity dedup path-ranking logic and the root 003 metadata to confirm whether canonical packet-doc preference stays inside the packet boundary.

## Findings

### P0

### P1

### P2
- **F004**: Canonical packet-doc preference can point an entity at an unrelated packet — `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:478` — `isCanonicalEntityPath()` treats any path ending in `/spec.md` or similar as canonical, and `prefersCandidate()` then upgrades path-like matches over basename-only local docs, which is why root 003 now maps its `spec.md` entity to `00--ai-systems/001-global-shared/spec.md` instead of the packet-local doc. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:478] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:488] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/graph-metadata.json:78]

## Ruled Out
- Duplicate entity-slot inflation: the issue is path misattribution, not duplicate-name survival.

## Dead Ends
- The current test only checks local `specs/system-spec-kit/.../spec.md` vs `spec.md`, not unrelated cross-packet paths that share the same suffix.

## Recommended Next Focus
Run the broader corpus scan to quantify how often the parser defects already surfaced in iteration 001 appear across the actual graph-metadata tree.

## Assessment
- New findings ratio: 0.20
- Dimensions addressed: correctness, maintainability
- Novelty justification: This pass added a bounded accuracy advisory while confirming the higher-severity issue is still the command-string leak.
