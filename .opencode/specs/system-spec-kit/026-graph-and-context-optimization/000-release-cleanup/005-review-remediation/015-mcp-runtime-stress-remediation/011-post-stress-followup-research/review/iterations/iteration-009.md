# Iteration 009 - Final Remediation Priority Check

## Status
- Iteration: 9 / 10
- Focus: remediation-priority verification for Packet A / Packet B / Packet C
- newFindingsRatio: 0.00
- Convergence trajectory: No new findings. The current source still matches iteration 008's remediation split, so this pass should feed the final report rather than reopen source discovery.
- Verdict signal so far: CONDITIONAL

## Q-CROSS - Cross-Packet Interactions

### Findings
No new Q-CROSS finding.

See iteration 001 for F-001/F-002 and iteration 005 for F-008. I re-checked whether Packet A landed after iteration 008. It has not: `code_graph_context` still blocks only `readiness.action === 'full_scan'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:57` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:59`, while the readiness crash path still records `freshness: 'error'` / `action: 'none'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:132` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:143`.

That error state still falls through to `buildContext()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:253`, and a downstream failure still collapses to generic `status: 'error'` / `code_graph_context failed` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:308` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:317`.

### Final remediation sketch
Packet A remains the required remediation before a PASS verdict. Scope estimate stays small-to-moderate, roughly 70-120 LOC if kept surgical.

Production targets:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:57`: make readiness `freshness === 'error'` block the read path before `buildContext()`.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:146` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166`: return a structured degraded envelope for the crash path, preserving `readiness`, `canonicalReadiness`, `trustState`, `graphAnswersOmitted: true`, and an `rg`-oriented recovery signal.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:161` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:169`: move or isolate the readiness snapshot from `graphDb.getStats()` so stats failure cannot prevent the unavailable-readiness envelope.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:239` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:248`: avoid routing DB-unavailable status into the generic uninitialized error when the snapshot can still describe readiness.

## Q-REGRESS - Regression Risk on Unchanged Callers

### Findings
No new Q-REGRESS finding.

See iteration 002 for F-003. The unchanged-caller regression is still the same `code_graph_status` ordering issue: current status reads `graphDb.getStats()` before `getGraphReadinessSnapshot()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:161` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:169`. If stats fails first, the handler still returns only `Code graph not initialized: ...` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:239` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:248`.

## Q-TEST - Test Brittleness Across 4 Vitest Files

### Findings
No new Q-TEST finding.

See iteration 003 for F-004 and iteration 006/007 for F-009. The shared readiness helper already maps `error -> missing` and `error -> unavailable` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:87` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:109` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:123`, and `buildReadinessBlock()` projects those fields at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:241` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:248`.

The test gap remains unchanged: `readiness-contract.vitest.ts` still covers `fresh`, `stale`, and `empty`, but not `error`, for canonical readiness at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:37` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:49`, trust-state mapping at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:51` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:78`, and readiness-block augmentation at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:115` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:142`.

### Final test scope
Packet A should carry the readiness-contract `error` fixture tests, the context readiness-crash test, and the status stats-before-snapshot test. Packet B can remain separate because its risk is test/artifact drift, not production behavior: the YAML dispatch writes `built.promptFileBody` before `spawnSync('copilot', built.argv, ...)` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:704` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:713`, while `cli-matrix.vitest.ts` still claims to mirror YAML at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:17` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:20` but models the legacy `-p "$(cat ...)"` / `resolveCopilotPromptArg()` shape at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:40` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:56`.

## Q-FLOW - cli-copilot Dispatch Flow End-to-End

### Findings
No new Q-FLOW finding.

See iteration 003 for F-004. There is still no live cli-copilot run artifact in this review lineage to inspect: the review config uses `cli-codex` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json:21` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json:25`. Keep Packet B as P2 test hardening unless a future cli-copilot replay produces an authority-bypass artifact.

## Q-DOC - Catalog/Playbook Drift

### Findings
No new Q-DOC finding.

See iteration 004 for F-005/F-007 and iteration 005 for F-008. Packet C should wait for Packet A because the public degraded envelope is not yet finalized. Current docs still get ahead of current code: the auto-trigger catalog says both `code_graph_query` and `code_graph_context` return `fallbackDecision`, including readiness-crash `nextTool:"rg"`, at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:15` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:23` and repeats the context `fallbackDecision` claim at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:41` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:42`.

The readiness-contract catalog uses `code_graph_context` as the blocked-path example with `fallbackDecision` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md:31`. The CocoIndex playbook still calls `rankingSignals` an object at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:133` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:144`, while the shipped schema accepts `rankingSignals: z.array(z.string())` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:482` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:492`.

## Q-COV - Coverage Gaps Spanning Packets

### Findings
No new Q-COV finding.

See iteration 008. The minimum coverage set remains Packet A's shared readiness `error` fixtures plus targeted status/context degraded tests. I found no evidence supporting a broader matrix over `memory_search` or `memory_save`.

## Q-MAINT - Maintainability / Code Smell

### Findings
No new Q-MAINT finding.

See iteration 005 for F-008 and iteration 006/007 for F-009. The final maintainability recommendation stays narrow: centralize the degraded-readiness vocabulary through shared helpers and shared assertions, but keep handler-specific response payloads local.

## Cross-Question Closure
- Q-CROSS: Converged to required Packet A; see F-001/F-002/F-008.
- Q-REGRESS: Converged to Packet A status ordering; see F-003.
- Q-FLOW: Converged to Packet B P2 test/artifact gap; see F-004.
- Q-TEST: Converged to Packet A `error` fixtures plus Packet B cli-copilot call-site test; see F-004/F-009.
- Q-COV: Converged to the Packet A four-test minimum; see iteration 008.
- Q-DOC: Converged to Packet C after Packet A; see F-005/F-007/F-008.
- Q-MAINT: Converged to shared vocabulary plus handler-local payload assembly; see F-008/F-009.

## Final Report Seed
- Verdict: CONDITIONAL.
- Required remediation: Packet A, because active P1 behavior remains in degraded code-graph envelope parity.
- Follow-up remediation: Packet B as P2 test hardening for cli-copilot dispatch parity.
- Post-code alignment: Packet C docs/playbooks after Packet A decides the final context degraded envelope.
- No P0 surfaced across this loop. No new findings in iterations 007, 008, or 009.

## Sources read this iteration
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/quick_reference.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-002.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-003.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-004.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-005.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-006.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-007.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-008.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-strategy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`

## Suggested focus for iteration 010
Write the final review synthesis, not another source sweep. The report should use a CONDITIONAL verdict: Packet A is required remediation, Packet B is P2 test-hardening follow-up, and Packet C is documentation/playbook alignment after Packet A lands.
