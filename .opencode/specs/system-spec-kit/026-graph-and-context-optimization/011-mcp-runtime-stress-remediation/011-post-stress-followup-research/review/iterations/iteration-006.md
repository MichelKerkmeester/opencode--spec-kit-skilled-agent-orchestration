# Iteration 006 - Stabilization Coverage Audit (Q-TEST + Q-COV)

## Status
- Iteration: 6 / 10
- Focus: Q-TEST + Q-COV, with F-008 remediation-shape stabilization
- newFindingsRatio: 0.05
- Convergence trajectory: New finding rate is now at the configured noise floor. This pass did not find a new handler bug; it found one shared-contract test gap that would make the F-008 remediation easier to regress.
- Verdict signal so far: CONDITIONAL-leaning

## Q-CROSS - Cross-Packet Interactions

### Findings
See iteration 001 for the `code_graph_context` degraded-readiness metadata loss and status crash-action mismatch findings. See iteration 005 for F-008, which scopes those as one degraded-envelope parity workstream across query/context/status plus docs/playbooks.

### PASS / No New Cross-Packet Finding
This stabilization pass did not find a new packet 012/015 interaction. The tested surfaces remain separate: packet 012's authority helper rewrites Copilot prompt bodies, while packet 015's telemetry passthrough is confined to `code_graph_context` seed normalization and anchor emission. No real `cli-copilot` artifact was available, so Q-FLOW was not reopened.

## Q-REGRESS - Regression Risk on Unchanged Callers

### Findings
See iteration 002 for F-003 on `code_graph_status` losing the unavailable-readiness envelope before the snapshot helper runs. See iteration 005 for the finding that unchanged caller risk is concentrated in code-graph query/context/status degraded envelopes, not `memory_search` or `memory_save`.

### PASS / No New Regression Evidence
No additional unchanged-caller regression was found in this pass. The minimum remediation tests should stay scoped to the three code-graph handlers and their shared readiness vocabulary; broadening into memory surfaces would be scope creep unless a caller dependency is demonstrated.

## Q-FLOW - cli-copilot Dispatch Flow End-to-End

### Findings
See iteration 003 for F-004 on the stale cli-copilot dispatch regression harness.

### PASS / Artifact Caveat
No new Q-FLOW evidence was read. Iteration 005 already established that the current review run is `cli-codex`, so there is still no persisted `cli-copilot` `@PROMPT_PATH` artifact to inspect.

## Q-TEST - Test Brittleness Across 4 Vitest Files

### Findings
- **F-009 [P2] The shared readiness-contract test suite omits the `error -> unavailable` mapping that the degraded-envelope remediation relies on**
  - Evidence: The shared contract code explicitly maps readiness crashes to canonical missing/unavailable: `canonicalReadinessFromFreshness('error')` returns `'missing'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:87`, and `queryTrustStateFromFreshness('error')` returns `'unavailable'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:109` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:123`. `buildReadinessBlock()` then projects those fields into handler payloads at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:241` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:248`. The contract test fixture can construct any `ReadyResult['freshness']` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:28` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:35`, but the tests only assert `fresh`, `stale`, and `empty` for canonical readiness at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:37` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:49`, only loop those same three states for trust-state union coverage at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:64` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:78`, and only assert `buildReadinessBlock()` augmentation for `fresh`, `stale`, and `empty` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:115` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:141`.
  - Risk: F-008 recommends a shared degraded-envelope assertion helper, but the current lowest-level shared contract does not pin the crash state. Query's mocked fallback test asserts only `fallbackDecision` on readiness error at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:132` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:159`; status's mocked unavailable test asserts `readiness.freshness` and `readiness.action` but not `canonicalReadiness` or `trustState` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:191` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:204`; context has no readiness-crash test in its telemetry passthrough suite, whose default readiness mock is always fresh at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:29` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:39`.
  - Recommended remediation: Add one shared test helper or matcher for degraded envelopes with parameters for handler-specific next-action fields. The floor should assert `readiness.freshness === 'error'`, `canonicalReadiness === 'missing'`, `trustState === 'unavailable'`, and `graphAnswersOmitted === true` where applicable. Before adding handler tests, add explicit `error` cases to `readiness-contract.vitest.ts` for `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, and `buildReadinessBlock()` so the shared vocabulary cannot regress independently of handler shape.

### Minimum New Test Set
The cheapest useful set is four tests, not a broad matrix:

1. `readiness-contract.vitest.ts`: add `error` fixtures for canonical readiness, trust state, and `buildReadinessBlock()`.
2. `code-graph-status-readiness-snapshot.vitest.ts`: add a production-order failure test where `getStats()` throws before `getGraphReadinessSnapshot()` would run, then assert the remediated handler still returns the unavailable readiness envelope.
3. `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`: add a readiness-crash test with a CocoIndex seed carrying `raw_score`, `path_class`, and `rankingSignals`; assert a structured degraded/error envelope, not the current generic `code_graph_context failed`.
4. `code-graph-degraded-sweep.vitest.ts` or a small shared helper file: reuse the query crash case as the baseline for `fallbackDecision: { nextTool: 'rg', reason: 'scan_failed' }`, but also assert the canonical readiness/trust fields.

## Q-COV - Coverage Gaps Spanning Packets

### Findings
F-009 is the new coverage finding for this iteration. It does not supersede F-001/F-003/F-006; it explains why the remediation should start from the shared readiness vocabulary before adding handler-local envelope tests.

### Notes
The four packet vitest files are strong on their original packet-local promises: packet 013 exercises query degraded routing end-to-end, packet 014 covers action-level status snapshots without mutating write-side DB APIs, packet 015 covers telemetry passthrough without rank/score changes, and packet 012 covers Copilot authority preamble generation. The cross-packet gap is narrower: no single assertion currently pins the degraded crash vocabulary across the shared contract and the three handler envelopes.

## Q-DOC - Catalog/Playbook Drift

### Findings
See iteration 004 for F-005 and F-007. See iteration 005 for F-008's doc-parity framing: docs describe a more unified readiness/fallback surface than code currently emits.

### PASS / No New Doc Finding
No new catalog/playbook drift was raised. The doc fix should follow the implementation contract: first make query/context/status degraded envelopes real and tested, then update catalog/playbook wording so `fallbackDecision`, `requiredAction`, and `blockReason` are described per handler rather than implied as one universal field set.

## Q-MAINT - Maintainability / Code Smell

### Findings
F-009 is also a maintainability finding, but only at P2 severity. The missing `error` fixture makes future remediation less safe because each handler can keep hand-asserting a slightly different crash envelope.

### Notes
No new production-code smell was found beyond F-008. The maintainability path is clear: keep handler-specific payload assembly, but centralize the invariant degraded-envelope assertions in tests.

## Cross-Question Coverage Check
- Q-CROSS: F-001/F-002 from iteration 001 plus F-008 from iteration 005; no new finding here.
- Q-REGRESS: F-003 from iteration 002; unchanged memory surfaces remain PASS.
- Q-FLOW: Source-level PASS plus F-004 test/artifact gap; no cli-copilot artifact available.
- Q-TEST: F-003/F-004 plus new F-009.
- Q-COV: F-003/F-006/F-008 plus new F-009.
- Q-DOC: F-005/F-007 plus F-008 remediation framing.
- Q-MAINT: F-004/F-008 plus new F-009.

## Sources read this iteration
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/quick_reference.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-002.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-003.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-004.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-005.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-strategy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deltas/iter-005.jsonl`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph-degraded-sweep.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts`

## Suggested focus for iteration 007
Run a convergence/adversarial pass rather than another broad source sweep. Try to disprove F-009 by checking whether an existing handler or shared-contract test already pins `error -> unavailable` deeply enough; if it does not, treat Q-TEST/Q-COV as converged with the four-test minimum above. Only reopen Q-DOC if the remediation plan needs a precise catalog/playbook edit list.
