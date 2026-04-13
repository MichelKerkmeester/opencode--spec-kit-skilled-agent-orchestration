# Iteration 8: Merge Legality And Failure Modes

## Focus
Map the legal anchor shapes and the concrete merge-operation error conditions so the routing recommendations can distinguish correct categories from safe writes.

## Findings
1. `spec-doc-structure.ts` enforces a shape contract: `append-as-paragraph` only on prose or section anchors, `insert-new-adr` only on ADR anchors, `append-table-row` only on table anchors, `update-in-place` only on checklist anchors, and `append-section` only on section-like anchors or research docs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:627] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:688]
2. `anchorMergeOperation()` adds further failure conditions beyond the legality pre-checks: missing anchors, duplicated target lines, missing checklist markers for checked updates, row-width mismatches for tables, nested anchors in non-ADR merges, unresolved conflict markers, and anchor-graph corruption. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:265] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:569]
3. `append-as-paragraph` and `append-section` are relatively forgiving because they dedupe by fingerprint or normalized content and can no-op safely when the paragraph or section already exists. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:292] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:522]
4. `insert-new-adr` is safe only when the anchor body is already a valid ADR container; otherwise the merge validator or anchor-graph validation will reject it. This makes `decision` robust on healthy `L3/L3+` packets but brittle on malformed packets. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:319] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:665]
5. A correct classification can still be rejected in `memory-save.ts` if the routed merge mode conflicts with an explicit `mergeModeHint` or if the target document is missing. Those rejections are routing-surface failures, not merge-operation bugs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1053] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1069]

## Ruled Out
- Assuming merge safety is fully captured by the router's category-to-target map.

## Dead Ends
- Treating `append-section` and `update-in-place` as equally tolerant operations.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:627`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:688`
- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:265`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1053`

## Assessment
- New information ratio: 0.66
- Questions addressed: RQ-5
- Questions answered: RQ-5

## Reflection
- What worked and why: The legality validator and merge operation complement each other, so reading both produced a reliable failure map.
- What did not work and why: Router target selection alone could not explain write failures because several rejections happen after routing.
- What I would do differently: Bring the override and threshold questions back together next, because both interact with these write-path constraints.

## Recommended Next Focus
Simulate threshold changes and inspect `routeAs` override semantics so the final recommendation accounts for both classification gains and write-path risk.
