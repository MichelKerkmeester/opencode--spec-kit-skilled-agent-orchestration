# Agent 15 - Graph/scoring perfection

## Scope

- Fixed causal-depth scoring drift in `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`.
- Added targeted cyclic-graph coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts`.
- Updated `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md` so docs describe the shipped graph-signal surface and rooted-cycle behavior.

## Implementation

The drift came from `computeCausalDepthScores()` revisiting already-seen nodes whenever it found a deeper path. In rooted cyclic graphs, that let loops keep increasing stored depths until `maxTraversalDepth`, so normalized scores depended on revisit opportunities rather than stable structure.

I changed the traversal to true multi-source BFS semantics:

- keep the first discovered depth for each node,
- enqueue each node once,
- continue normalizing by the maximum discovered root distance,
- preserve the existing `0` result for graphs with no roots.

This makes causal depth deterministic for rooted cycles while keeping the existing DAG behavior unchanged.

## Tests and checks

- `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root ".opencode/skill/system-spec-kit/mcp_server"` -> PASS
- `npx vitest run tests/graph-signals.vitest.ts` -> PASS (38 tests)

## Notes

- Initial Copilot invocation timed out after exploration; local implementation completed the task.
- An initial verifier run from the wrong working directory failed because the relative script path resolved under `mcp_server/`; reran from repo root with the correct path.
