# Iteration 25: Post-remediation scratch prompt and handler verification

## Focus
Re-read the packet-local scratch prompts plus the live `code_graph_status` and `code_graph_scan` surfaces to confirm the detector-provenance guidance now matches the implemented API boundaries.

## Findings

### P0
- None.

### P1
- None.

### P2
- None.

## Ruled Out
- Residual scratch guidance that expects detector provenance from `code_graph_status`: ruled out because the prompt now directs operators to inspect the `code_graph_scan` response for detector provenance, while the status handler remains count-and-health only and the scan handler plus tests expose the summary explicitly. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/scratch/test-prompts-all-clis.md:41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/scratch/test-prompts-all-clis.md:44] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:18] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:31] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:247] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:258] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:110]
- Stale packet-number guidance in the scratch prompts: ruled out because packet `005-code-graph-upgrades` explicitly documents itself as side-branch packet `014`, and the implementation summary continues to use that numbering intentionally. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:34] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:103] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md:44] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md:109]

## Dead Ends
- Treating the handler split itself as ambiguous: the implementation and tests still make a clean ownership split between status health output and scan-time provenance summaries, so there is no remaining packet-local operator ambiguity. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:18] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:258] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:110]

## Recommended Next Focus
Completed. No active findings remain in packet `005` after the scratch-prompt and handler recheck.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: The prompt-level fix landed cleanly, and the runtime surfaces still align with the documented side-branch packet boundary.
