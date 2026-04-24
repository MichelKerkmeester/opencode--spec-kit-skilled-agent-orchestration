# Iteration 3: Depends-On Edge Validation

## Focus
Answer RQ-1 by resolving every declared `manual.depends_on` edge against real spec folders on disk.

## Findings
1. Only four declared `depends_on` edges exist across the full corpus, concentrated in two packet folders under Phase 006 of packet 026. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. All four resolve successfully to real spec folders, so the observed broken-edge rate is 0.0%. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. The currently used manual dependency shape is string-based rather than object-based in at least the active Phase 006 examples, despite the schema expecting packet-reference objects for canonical JSON. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/013-dead-code-and-architecture-audit/graph-metadata.json:7-15] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:8-30]

## Ruled Out
- Assuming the corpus currently has a dense dependency graph.

## Dead Ends
- Looking for broken `depends_on` targets before verifying how many edges actually exist.

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/013-dead-code-and-architecture-audit/graph-metadata.json:7-15`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:8-30`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.8`
- Questions addressed: `RQ-1`, `RQ-2`
- Questions answered: `RQ-1`

## Reflection
- What worked and why: Resolving against metadata-normalized spec-folder strings avoided false broken edges.
- What did not work and why: A schema-only expectation of object references did not match current stored reality.
- What I would do differently: Pair edge counts with sparsity analysis immediately, because integrity alone looks healthier than coverage.

## Recommended Next Focus
Validate `children_ids` and run cycle detection on the resolved dependency graph.
