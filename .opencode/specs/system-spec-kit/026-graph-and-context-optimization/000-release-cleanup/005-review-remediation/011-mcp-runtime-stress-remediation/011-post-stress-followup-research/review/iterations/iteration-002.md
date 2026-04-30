# Iteration 002 - Regression + Coverage Audit (Q-REGRESS + Q-COV)

## Status
- Iteration: 2 / 10
- Focus: Q-REGRESS + Q-COV
- newFindingsRatio: 0.30
- Convergence trajectory: New finding count decayed from iteration 001. This pass found one status-path coverage/regression gap and did not find evidence that unchanged `memory_search` / `memory_save` callers are affected by packets 012-015.
- Verdict signal so far: CONDITIONAL-leaning

## Q-CROSS - Cross-Packet Interactions

See iteration 001 for the `code_graph_context` degraded-readiness metadata loss and `code_graph_status` crash-action mismatch findings. This iteration did not re-cover those paths except where they intersected Q-REGRESS/Q-COV.

## Q-REGRESS - Regression Risk on Unchanged Callers

### Findings
- **F-003 [P1] `code_graph_status` can lose packet 014's unavailable-readiness envelope before the snapshot helper runs**
  - Evidence: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:161` reads `graphDb.getStats()` before `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:169` calls `getGraphReadinessSnapshot(process.cwd())`. `getStats()` immediately calls `getDb()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:734` and then performs DB queries at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:735` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:748`. If the graph DB is locked or unavailable, the handler's outer catch returns only `status: "error"` / `error: "Code graph not initialized: ..."` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:239` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:248`. That bypasses the packet 014 snapshot branch even though `getGraphReadinessSnapshot()` is specifically designed to convert probe crashes into `{ freshness: "error", action: "none", reason }` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:508` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:523`.
  - Risk: An unchanged caller using `code_graph_status` as the safe diagnostic surface for a degraded graph can receive a generic initialization error instead of the readiness block, `canonicalReadiness`, and `trustState` packet 014 added. This is not the same as iteration 001's action-field mismatch: this path loses the entire packet 014 readiness envelope when the earlier stats read fails.
  - Recommended remediation: In `handleCodeGraphStatus()`, obtain the read-only snapshot before stats, or wrap `graphDb.getStats()` separately and return a minimal degraded status payload when stats fails. Add an unmocked or spy-based test where `graphDb.getStats()` / `getDb()` throws and assert the response still includes `data.readiness.freshness === "error"`, `canonicalReadiness`, and `trustState: "unavailable"`.

### Notes
`memory_search` and `memory_save` do not appear to consume the code-graph readiness path directly. The reviewed memory surfaces use their own recovery/refusal contracts: `memory_search` derives `citationPolicy` and conditional `responsePolicy` in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:273` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:300`, then reasserts those fields after extra data merging at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:1069` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:1087`. No new memory-surface regression was found in this iteration.

## Q-COV - Coverage Gaps Spanning Packets

### Findings
F-003 is also a coverage finding. The packet 014 status test covers an unavailable snapshot only by injecting a successful `getGraphReadinessSnapshot()` return with `freshness: "error"` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:191` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:203`; the side-effect tests prove the handler avoids `ensureCodeGraphReady()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:284` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:294`. They do not cover the production ordering where stats access can fail before the snapshot branch.

### Notes
The packet 015 telemetry passthrough tests cover the healthy-path additive contract well: schema acceptance at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:482` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:492`, context normalization/emission at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:175` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:208` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:273` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:296`, and score/order invariants at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:310` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:347`. The degraded interaction remains covered by iteration 001's F-001 rather than a new finding here.

## Q-FLOW - cli-copilot Dispatch Flow End-to-End

See iteration 001. No new Q-FLOW evidence was re-read in this iteration.

## Sources read this iteration
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-strategy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-state.jsonl`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-findings-registry.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/009-memory-search-response-policy/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/009-memory-search-response-policy/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/277-code-graph-fast-fail.md`

## Suggested focus for iteration 003
Deepen Q-TEST + Q-MAINT. The main pattern to test is mock false-confidence: packet 014's unavailable-path test mocked the helper after `getStats()` succeeded, so inspect the other new vitest files for similarly over-mocked assertions that prove a helper contract without exercising the production call order. Prioritize `executor-config-copilot-target-authority.vitest.ts` and the YAML prompt-file-body call sites next, because Q-FLOW has source-level confidence but still lacks a persisted prompt artifact check.
