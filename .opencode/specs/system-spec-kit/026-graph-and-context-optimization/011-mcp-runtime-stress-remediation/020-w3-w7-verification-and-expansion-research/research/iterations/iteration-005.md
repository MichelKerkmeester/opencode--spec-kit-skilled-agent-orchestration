---
iteration: 5
focus: RQ5 - W7 degraded-readiness coverage
newInfoRatio: 0.62
status: complete
---

# Iteration 005 - W7 Degraded-Readiness Coverage

## Focus

Read each `w7-*.vitest.ts` file and determine whether they exercise real fallback envelopes or higher-level static mocks.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w7-degraded-stale.vitest.ts:7` calls `runMeasurement` and reads the `w7-code-graph-stale` case.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w7-degraded-empty.vitest.ts:7` does the same for `w7-code-graph-empty`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w7-degraded-full-scan.vitest.ts:7` does the same for `w7-code-graph-full-scan-required`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w7-degraded-unavailable.vitest.ts:7` does the same for `w7-code-graph-unavailable`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:139` maps W7 cases to baseline static candidates.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:155` creates static runners for `memory_search`, `code_graph_query`, and `skill_graph_query`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:172` runs the harness with those static runners.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:151` classifies an empty graph as requiring full scan.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:166` checks stale tracked files.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787` blocks the read path when full scan is required.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:62` blocks context reads for readiness errors and full-scan-required states.
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:127` tests blocked envelopes with mocked readiness failures.

## Findings

### F-W7-001 - P1 - W7 stress files do not exercise real degraded runtime envelopes

Hunter: all four W7 stress files call `runMeasurement`, and the measurement runners are static fixture outputs.

Skeptic: there are separate code-graph degraded-readiness tests that validate handler envelopes with mocks.

Referee: W7 as shipped proves the search-quality harness can represent degraded cells; it does not prove real `code_graph_query` or `code_graph_context` behavior against stale/empty/unavailable graph states. The separate handler tests reduce risk but do not close the W7 charter gap.

## Wiring Verdict

W7 is useful coverage scaffolding, not a live degraded-readiness integration test suite.

## Opportunities

- Add an integration harness that creates an ephemeral graph DB and drives real `code_graph_query`/`code_graph_context` calls through stale, empty, full-scan-required, and unavailable states.
- Keep static fixture tests as fast regression tests, but label them as harness cells rather than runtime envelope proof.

## Next Focus

Iteration 006 should synthesize cross-W composition: W3 to W4, W5 to W3, and W6/W7 telemetry into a unified decision envelope.
