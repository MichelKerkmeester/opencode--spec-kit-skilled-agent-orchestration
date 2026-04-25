# Iteration 006: Group Contract Registry and Cross-Repo Impact

## Focus

Determine whether GitNexus group mode and Contract Registry patterns should inform Public cross-repo Code Graph and Skill Graph work.

## Actions Taken

- Read group-aware architecture notes and MCP resource definitions.
- Folded sidecar findings about implicit group-member anchoring.
- Classified Contract Registry as a cross-system pattern rather than a Code Graph-only feature.

## Findings

- GitNexus group mode lets `query`, `context`, and `impact` accept `repo: "@<groupName>"`, while group-level contracts/status are exposed as resources. [SOURCE: external/ARCHITECTURE.md:47]
- Contract Registry resources expose provider/consumer rows, cross-links, and group index staleness. [SOURCE: external/ARCHITECTURE.md:51] [SOURCE: external/gitnexus/src/mcp/resources.ts:88] [SOURCE: external/gitnexus/src/mcp/resources.ts:95]
- Sidecar evidence found a safety footgun: group impact with `@group` anchors to a default member, so Public impact/edit safety should require explicit `@group/member` selection. [SOURCE: external/gitnexus/src/mcp/tools.ts:311]
- Contract rows and cross-links are a reusable model for cross-repo APIs and for Skill Graph capability contracts between skills, commands, hooks, and tools. [SOURCE: external/gitnexus/src/core/group/types.ts:43]
- Cross-repo impact should remain opt-in and bounded; it is too risky to make implicit group-wide traversal part of ordinary local impact.

## Questions Answered

- Which GitNexus impact, detect-changes, rename, route-map, tool-map, shape-check, or group-contract mechanisms are worth adapting for graph safety?

## Questions Remaining

- Whether Skill Graph contracts should live in the existing skill graph metadata or in a new contract registry adjacent to it.

## Ruled Out

- Allowing implicit default group member selection for any edit-safety tool.

## Dead Ends

- Reintroducing separate `group_query` or `group_impact` tools; resources plus scoped parameters are a cleaner surface.

## Sources Consulted

- external/ARCHITECTURE.md:47
- external/ARCHITECTURE.md:51
- external/gitnexus/src/mcp/resources.ts:88
- external/gitnexus/src/mcp/resources.ts:95
- external/gitnexus/src/mcp/tools.ts:311
- external/gitnexus/src/core/group/types.ts:43

## Reflection

- What worked and why: The contract model generalized cleanly across Code Graph and Skill Graph.
- What did not work and why: Group defaults are convenient for exploration but unsafe for impact.
- What I would do differently: Require explicit member paths in any future implementation spec.

## Recommended Next Focus

Map GitNexus concepts to Spec Kit Memory's causal graph without duplicating Code Graph.
