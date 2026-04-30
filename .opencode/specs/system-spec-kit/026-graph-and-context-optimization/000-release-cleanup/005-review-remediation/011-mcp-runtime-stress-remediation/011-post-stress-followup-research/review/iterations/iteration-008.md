# Iteration 008 - Convergence Rollup (Q-CROSS + Q-TEST + Q-COV)

## Status
- Iteration: 8 / 10
- Focus: Q-CROSS + Q-TEST + Q-COV convergence rollup
- newFindingsRatio: 0.00
- Convergence trajectory: No new findings. Current source still has the already-identified degraded-envelope gaps, so the remaining work should be planned as remediation rather than more discovery.
- Verdict signal so far: CONDITIONAL-leaning

## Q-CROSS - Cross-Packet Interactions

### Findings
No new Q-CROSS finding.

See iteration 001 for F-001/F-002 and iteration 005 for F-008. I re-checked current source for post-iteration remediation. The partial helper/comment changes do not close the cross-packet behavior:

- `code_graph_context` still treats only `readiness.action === 'full_scan'` as blocked at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:57` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:59`.
- The readiness crash catch now stores `freshness: 'error'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:132` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:143`, but that value still falls through to `buildContext()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:253`.
- If that downstream graph work fails, the handler still returns only generic `status: 'error'` / `code_graph_context failed` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:308` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:317`.

### Remediation Packet A - Degraded Code-Graph Envelope Parity
Scope estimate: small-to-moderate, roughly 70-120 LOC across production and tests if kept surgical.

Fix F-001/F-003/F-008/F-009 together as one packet. The operator-facing contract is one story: when the graph is unavailable or blocked, query/context/status should preserve `readiness`, `canonicalReadiness`, `trustState`, and a clear next action instead of letting each handler drift.

Production targets:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:57`: treat `freshness === 'error'` as a blocking/degraded read path before `buildContext()`.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:146` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166`: add the remediated crash envelope, likely `graphAnswersOmitted: true`, `requiredAction: 'rg'`, `blockReason: 'scan_failed'`, and either `fallbackDecision` or explicitly documented handler-specific equivalent.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:161` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:169`: move the read-only snapshot before `graphDb.getStats()`, or wrap stats separately so a stats failure still returns the unavailable readiness envelope instead of the generic catch at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:239` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:248`.

## Q-TEST - Test Brittleness Across 4 Vitest Files

### Findings
No new Q-TEST finding.

See iteration 003 for F-004 and iteration 006/007 for F-009. Current source still supports F-009:

- The shared helper already maps `error -> missing` and `error -> unavailable` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:87` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:109` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:123`.
- The shared helper projects those fields in `buildReadinessBlock()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:241` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:248`.
- The tests still cover only `fresh`, `stale`, and `empty` for canonical readiness at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:37` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:49`, only those three states in the trust-state loop at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:64` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:78`, and only those three states for `buildReadinessBlock()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:115` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:141`.

### Test Remediation Targets
Minimum useful test scope remains four tests, not a broad matrix:

1. Add explicit `error` cases to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts` for `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, the union loop, and `buildReadinessBlock()`.
2. Strengthen query crash tests at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:132` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:160` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:325` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:330` so `fallbackDecision` is asserted alongside `readiness.freshness`, `canonicalReadiness`, and `trustState`.
3. Add a status production-order test near `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:191` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:204`: simulate stats failure before snapshot would currently run, then assert the remediated unavailable envelope.
4. Add a context readiness-crash test near the fresh default mock at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:29` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:39`, using a CocoIndex seed with `raw_score`, `path_class`, and `rankingSignals`.

## Q-COV - Coverage Gaps Spanning Packets

### Findings
No new Q-COV finding.

Q-COV is converged enough for remediation. The current gaps are covered by F-003/F-006/F-008/F-009 and should be closed by the same Packet A test set above. Additional matrices across `memory_search` or `memory_save` remain unsupported by evidence; iteration 002 and iteration 005 both found those surfaces do not directly consume the code-graph readiness path.

## Q-FLOW - cli-copilot Dispatch Flow End-to-End

### Findings
No new Q-FLOW finding.

See iteration 003 for F-004. The live review config remains `cli-codex` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json:21` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json:25`, so there is still no real cli-copilot `@PROMPT_PATH` artifact to inspect.

### Remediation Packet B - cli-copilot Artifact/Call-Site Test
Scope estimate: small, roughly 30-60 test LOC.

Keep this separate from Packet A. The helper behavior and YAML source still look correct: the deep-review YAML writes `built.promptFileBody` before `spawnSync('copilot', built.argv, ...)` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:704` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:713`, and the helper sets `promptFileBody` for approved large prompts at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:304` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:321`.

The remaining problem is test drift: `cli-matrix.vitest.ts` still claims to mirror YAML dispatch at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:17` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:20`, but its cli-copilot branch still models the legacy `-p "$(cat '<promptPath>')"` / `resolveCopilotPromptArg()` command-string shape at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:40` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:56`.

## Q-DOC - Catalog/Playbook Drift

### Findings
No new Q-DOC finding.

See iteration 004 for F-005/F-007 and iteration 005 for F-008. Docs should follow code remediation, not lead it.

### Remediation Packet C - Catalog/Playbook Follow-Through
Scope estimate: small, roughly 20-50 doc LOC after Packet A lands.

Update docs after the public envelope is decided:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:15` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:23` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:41` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:42` still imply `fallbackDecision` applies to context today.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md:31` still uses `code_graph_context` as the example of a blocked payload with `fallbackDecision`.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:134` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:144` still call `rankingSignals` an object, while the shipped input schema accepts `rankingSignals: z.array(z.string())` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:482` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:492`.

## Q-REGRESS - Regression Risk on Unchanged Callers

### Findings
No new Q-REGRESS finding.

See iteration 002 for F-003 and iteration 005 for the unchanged-caller boundary. The only unchanged-caller regression still needing code is `code_graph_status` losing the unavailable envelope because stats are read before the snapshot.

## Q-MAINT - Maintainability / Code Smell

### Findings
No new Q-MAINT finding.

F-008/F-009 remain sufficient. The maintainable target is not one universal response type for every handler; it is one shared degraded-readiness vocabulary plus handler-specific payload fields, tested by common assertions.

## Cross-Question Closure
- Q-CROSS: Converged to Packet A; see F-001/F-002/F-008.
- Q-REGRESS: Converged to `code_graph_status` stats-before-snapshot; see F-003.
- Q-FLOW: Converged to Packet B test/artifact gap; see F-004.
- Q-TEST: Converged to Packet A shared error-fixture tests plus Packet B cli-copilot call-site test; see F-004/F-009.
- Q-COV: Converged to four-test minimum for Packet A; no broad matrix needed.
- Q-DOC: Converged to Packet C after Packet A; see F-005/F-007/F-008.
- Q-MAINT: Converged to shared vocabulary + handler-local payload assembly; see F-008/F-009.

## Sources read this iteration
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/quick_reference.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-002.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-003.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-004.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-005.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-006.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-007.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-strategy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deltas/iter-007.jsonl`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/prompts/iteration-008.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`

## Suggested focus for iteration 009
Run one narrow final verification pass over remediation prioritization, not source discovery. Check whether any of Packet A/B/C landed after this iteration; if not, prepare the final review report around a CONDITIONAL verdict with Packet A as required remediation, Packet B as a P2 test-hardening follow-up, and Packet C as post-code doc alignment.
