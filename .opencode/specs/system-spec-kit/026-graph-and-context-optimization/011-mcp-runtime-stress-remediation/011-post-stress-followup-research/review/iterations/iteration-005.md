# Iteration 005 - Degraded Envelope Consolidation Audit (Q-CROSS + Q-REGRESS)

## Status
- Iteration: 5 / 10
- Focus: Q-CROSS + Q-REGRESS, with Q-COV/Q-DOC/Q-MAINT consolidation
- newFindingsRatio: 0.08
- Convergence trajectory: New finding rate continues to decay. This pass did not reopen the prior per-handler bugs; it found one remediation-shaping maintainability/traceability issue that explains why F-001, F-003, F-005, and F-006 should be fixed as one operator-facing workstream but not as a single code-site patch.
- Verdict signal so far: CONDITIONAL-leaning

## Q-CROSS - Cross-Packet Interactions

### Findings
- **F-008 [P2] The degraded-readiness remediation looks like one shared contract in docs, but the shipped behavior is split across three handler-local envelope paths**
  - Evidence: The readiness catalog presents a unified sibling-handler surface: commit propagation to `query.ts`, `scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, and `ccc-feedback.ts` is described at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md:27`, and the current example says `code_graph_context` returns `fallbackDecision: { nextTool, reason, retryAfter? }` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md:31`. The implementation is not unified at the degraded-envelope layer. `code_graph_query` owns a local `buildFallbackDecision()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:791` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:807`, and its readiness-crash catch returns `readiness`, `canonicalReadiness`, `trustState`, and `fallbackDecision` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1093` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1117`. `code_graph_context` uses a separate `shouldBlockReadPath()` that only blocks `action === 'full_scan'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:57` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:59`, emits a different blocked payload without `fallbackDecision` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:146` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166`, then falls through to `buildContext()` after a readiness crash at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:253` and can collapse to a generic error at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:308` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:317`. `code_graph_status` has a third path: it calls `graphDb.getStats()` before `getGraphReadinessSnapshot()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:161` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:169`, and its catch returns only `status: "error"` / `Code graph not initialized` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:239` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:248`.
  - Risk: A remediation packet could "fix the shared readiness contract" by editing `readiness-contract.ts` or catalog text, then still leave one of the handler-local degraded envelopes broken. Operator impact is one workstream: a DB-unavailable graph should give callers a consistent next action (`rg` for crash/unavailable, `code_graph_scan` for suppressed full scan) and preserve canonical readiness/trust fields. Implementation impact is multiple code sites: query already has the richest crash envelope, context needs crash-as-blocked/degraded parity, status needs snapshot-before-stats or stats-failure wrapping, and docs/playbooks need to stop promising fields before handlers actually emit them.
  - Recommended remediation: Track F-001, F-003, F-005, and F-006 as one remediation packet named around degraded code-graph envelope parity, but implement it as handler-specific changes plus shared test fixtures. Add a small shared test assertion helper for the degraded envelope fields, then call it from query/context/status tests rather than assuming `readiness-contract.ts` alone enforces the caller contract.

### Notes
F-001 and F-003 remain the implementation blockers. F-005 and F-006 are downstream traceability/coverage drift from the same operator-facing mismatch. This pass does not promote them into separate P1s because the user impact is one recovery story: "graph unavailable or not ready; tell me what to do next without losing trust metadata."

Packet 012/015 interaction was not re-opened. Packet 012's implementation summary states the large-prompt wrapper must put `## TARGET AUTHORITY` inside `promptFileBody` before Copilot reads the `@PROMPT_PATH` file, and the helper test verifies that at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts:207` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts:235`. Packet 015 telemetry is seed-local and additive; no evidence was found that the authority preamble changes seed shape or context schema behavior.

## Q-REGRESS - Regression Risk on Unchanged Callers

### Findings
See iteration 002 for F-003 on `code_graph_status` losing the unavailable-readiness envelope before the snapshot helper runs. F-008 adds the remediation boundary: the unchanged caller risk is not only status ordering, but the fact that status, context, and query each own their degraded response shape.

### PASS / No New Regression Evidence
No new regression was found for unchanged `memory_search` or `memory_save` callers in this pass. Iteration 002 already checked those surfaces and found they do not directly consume the code-graph readiness path. The current remediation should therefore stay scoped to code-graph query/context/status and their catalog/playbook coverage unless a new caller dependency is demonstrated.

## Q-FLOW - cli-copilot Dispatch Flow End-to-End

### Findings
See iteration 003 for F-004 on the stale cli-copilot dispatch regression harness.

### PASS / Artifact Caveat
No new authority leak was found. The currently running review is configured as `cli-codex`, not `cli-copilot`, at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json:21` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json:22`, so the available `review/prompts/iteration-005.md` is the review prompt artifact, not a persisted cli-copilot `@PROMPT_PATH` artifact with `## TARGET AUTHORITY`. The YAML call site still writes `built.promptFileBody` to `promptPath` before dispatch at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:704` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:713`; source-level confidence remains, live artifact confidence remains blocked by lack of a cli-copilot run.

## Q-TEST - Test Brittleness Across 4 Vitest Files

### Findings
See iteration 002 for the packet 014 over-mocked unavailable path (F-003) and iteration 003 for the stale cli-copilot dispatch harness (F-004). F-008 reinforces the test strategy: a shared degraded-envelope assertion helper would reduce future false confidence, but the tests still need to exercise production handler order per surface.

### PASS / No New Brittle-Test Finding
This pass did not find a new brittle-test issue beyond F-003/F-004. The packet 015 telemetry tests continue to protect additive/no-rerank behavior by checking schema acceptance, anchor emission, and score/order invariants; the remaining telemetry problem is playbook type drift from iteration 004's F-007, not a new vitest failure mode.

## Q-COV - Coverage Gaps Spanning Packets

### Findings
F-008 is also the coverage finding for this iteration. The coverage gap should be closed at the matrix level: status must cover DB-unavailable ordering, context must cover readiness crash with CocoIndex seed telemetry present, and query should remain the baseline for `fallbackDecision` crash/full-scan routing.

### Notes
See iteration 004 for F-006 on playbooks allowing `code_graph_status` to pass without the DB-unavailable state. The new workstream should turn that manual gap into automated coverage where possible, then leave the playbook as an operator replay rather than the only guard.

## Q-DOC - Catalog/Playbook Drift

### Findings
See iteration 004 for F-005 and F-007. F-008 explains why F-005 is not a wording-only issue: docs describe one shared readiness/fallback surface while code still uses handler-local degraded envelopes.

### PASS / Scope Note
No additional catalog/playbook drift was raised. The highest-value doc fix is to distinguish the shared readiness block (`canonicalReadiness`, `trustState`) from handler-specific routing fields (`fallbackDecision`, `requiredAction`, `blockReason`) until the implementation actually makes those fields consistent.

## Q-MAINT - Maintainability / Code Smell

### Findings
F-008 is the maintainability finding for this iteration.

### Notes
The code smell is not the existence of handler-specific payloads; that is reasonable because query, context, and status serve different callers. The smell is that the documentation and tests imply a unified degraded contract while the routing logic lives in three separate places with different failure ordering. A shared helper for "degraded next-action envelope" plus per-handler payload assembly would be a better boundary.

## Cross-Question Coverage Check
- Q-CROSS: F-001/F-002 from iteration 001 plus F-008 here.
- Q-REGRESS: F-003 from iteration 002; memory surfaces PASS from iteration 002 and this pass.
- Q-FLOW: Source-level PASS from iteration 001; test/artifact gap F-004 from iteration 003; no cli-copilot artifact available in this `cli-codex` run.
- Q-TEST: F-003/F-004 cover the brittle-test risk; no new issue here.
- Q-COV: F-003/F-006/F-008 cover degraded readiness; F-007 covers telemetry manual validation.
- Q-DOC: F-005/F-007 cover current drift; F-008 scopes the readiness-doc remediation.
- Q-MAINT: F-004 and F-008 cover stale test abstraction and split degraded envelope logic.

## Sources read this iteration
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/quick_reference.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-002.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-003.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-004.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-strategy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-state.jsonl`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-findings-registry.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-config.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-sweep.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/prompts/iteration-005.md`

## Suggested focus for iteration 006
Run a stabilization pass on Q-TEST + Q-COV with the F-008 remediation shape in mind. Specifically, inspect the existing packet vitest suites for the cheapest shared degraded-envelope assertion helper and identify the minimum new tests needed for `code_graph_context` readiness crash, `code_graph_status` stats-before-snapshot failure, and query/context/status doc parity. Avoid Q-FLOW unless a real cli-copilot artifact exists.
