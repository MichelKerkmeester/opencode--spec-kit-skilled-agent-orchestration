# Iteration 001: Correctness baseline for the handover/drop heuristic split

## Focus
Correctness review of `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` and the focused router regression to verify the shipped seam matches the packet's stated scope.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings
No new correctness findings.

## Cross-Reference Results
Not run in this dimension-focused pass.

## Assessment
- The reviewed seam does what the packet says it should do: hard wrappers stay hard (`content-router.ts:409-411`), strong handover language lifts `handover_state` while soft operational cues are demoted (`content-router.ts:1001-1014`), and the mixed-signal regression still expects `handover_state` instead of `drop` (`content-router.vitest.ts:133-142`). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409-411] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001-1014] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:133-142]

## Ruled Out
- A runtime correctness regression inside the scoped handover/drop fix was not reproduced in the live implementation.

## Dead Ends
- Packet docs alone were insufficient for evidence because some anchors are stale; correctness judgment needed live code/test reads.

## Recommended Next Focus
Move to security and confirm the same scoped seam does not hide a new trust-boundary issue.
