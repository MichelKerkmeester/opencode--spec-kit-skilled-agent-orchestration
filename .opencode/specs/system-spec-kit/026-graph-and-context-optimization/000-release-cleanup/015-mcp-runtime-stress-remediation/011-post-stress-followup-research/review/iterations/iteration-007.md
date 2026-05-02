# Iteration 007 - Adversarial Convergence Audit (Q-TEST + Q-COV)

## Status
- Iteration: 7 / 10
- Focus: Q-TEST + Q-COV adversarial validation of F-009
- newFindingsRatio: 0.00
- Convergence trajectory: No new finding. F-009 was not disproved, but it is now narrowly scoped: broader trust-state tests pin `error -> unavailable`, while the packet-local readiness-contract and handler crash tests still do not pin the shared degraded envelope deeply enough.
- Verdict signal so far: CONDITIONAL-leaning

## Q-CROSS - Cross-Packet Interactions

### Findings
See iteration 001 for F-001/F-002 and iteration 005 for F-008. This pass did not reopen packet 012/015 or cli-copilot artifact interactions.

### PASS / No New Cross-Packet Finding
No new cross-packet behavior was found. The remaining cross-packet risk is still the already-identified degraded-readiness envelope mismatch across query/context/status. In current source, `code_graph_context` still blocks only `action === 'full_scan'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:57` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:59`, while readiness crashes are represented as `freshness: 'error'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:132` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:143`. That supports the existing F-001/F-008 workstream; it is not a new finding.

## Q-REGRESS - Regression Risk on Unchanged Callers

### Findings
See iteration 002 for F-003 and iteration 005 for the consolidation that unchanged-caller risk is concentrated in code-graph degraded envelopes, not memory surfaces.

### PASS / No New Regression Evidence
No additional unchanged-caller regression was found. The regression floor should stay limited to the code-graph query/context/status crash and blocked-read contracts. Broadening back into `memory_search` or `memory_save` would add noise without new evidence.

## Q-FLOW - cli-copilot Dispatch Flow End-to-End

### Findings
See iteration 003 for F-004 on stale cli-copilot dispatch regression coverage.

### PASS / Artifact Caveat
No new cli-copilot artifact was available to inspect. The source-level authority flow remains covered by earlier iterations; the only remaining Q-FLOW work is still a real `cli-copilot` `@PROMPT_PATH` artifact check when such an artifact exists.

## Q-TEST - Test Brittleness Across 4 Vitest Files

### Findings
No new Q-TEST finding.

### Adversarial Check on F-009
F-009 survives the adversarial pass, but with an important caveat: there is partial contrary evidence outside the packet-local readiness tests.

Contrary evidence:
- The older M8 vocabulary test already pins `trustStateFromGraphState('error')` to `'unavailable'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/m8-trust-state-vocabulary.vitest.ts:56` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/m8-trust-state-vocabulary.vitest.ts:65`.
- The OpenCode transport test already renders structural availability as `unavailable` when graph freshness is `error` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:136` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:147`.

Why that does not disprove F-009:
- The packet-local shared readiness contract is the helper used by query/context/status. Its implementation maps `canonicalReadinessFromFreshness('error')` to `'missing'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:87`, maps `queryTrustStateFromFreshness('error')` to `'unavailable'` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:109` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:123`, and projects both fields through `buildReadinessBlock()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:241` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:248`.
- The corresponding unit tests still cover only `fresh`, `stale`, and `empty` for canonical readiness at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:37` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:49`, only those three states for trust-state union coverage at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:64` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:78`, and only those three states for `buildReadinessBlock()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:115` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:141`.
- Handler-level tests are still too shallow for the crash envelope. Query crash tests assert `fallbackDecision` but not the canonical readiness fields at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:132` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:160` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:325` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:330`. Status asserts `freshness` and `action` for `error`, but not `canonicalReadiness` or `trustState`, at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:191` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:204`. Context telemetry tests default readiness to fresh at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:29` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:39`.

### Remediation Sketch
Minimum code/test scope is small-to-moderate: about 50-80 test LOC plus 20-35 production LOC if the already-open F-001/F-008 context/status envelope work is implemented in the same packet.

1. Add explicit `error` assertions to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts` near the existing helper tests:
   - Add `canonicalReadinessFromFreshness('error') === 'missing'` after lines 37-49.
   - Add `queryTrustStateFromFreshness('error') === 'unavailable'`, and include `'error'` in the canonical union loop after lines 64-78.
   - Add `buildReadinessBlock(makeReadiness('error'))` asserting `canonicalReadiness: 'missing'` and `trustState: 'unavailable'` after lines 137-141.
2. Strengthen query crash tests in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:132` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:160` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:325` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:330` so `fallbackDecision` is asserted alongside `readiness.freshness`, `canonicalReadiness`, and `trustState`.
3. Add a status crash-envelope assertion in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` near lines 191-204. The low-cost version adds canonical/trust assertions to the existing mocked `error` case. The stronger regression test should also simulate `graphDb.getStats()` throwing before `getGraphReadinessSnapshot()` runs, because `handleCodeGraphStatus()` still calls `graphDb.getStats()` before the readiness snapshot at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:160` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:170`.
4. Add a context readiness-crash + CocoIndex telemetry test in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` near the existing fresh default at lines 29-39. This should force `ensureCodeGraphReady()` to reject, pass a CocoIndex seed with `raw_score`, `path_class`, and `rankingSignals`, and assert the remediated degraded envelope instead of the current generic `code_graph_context failed` path.
5. Production fix target for the context half of F-008: expand `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:57` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:59` so `freshness === 'error'` blocks before `buildContext()`, then add a handler-specific fallback field in the blocked payload at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:146` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:164`.

## Q-COV - Coverage Gaps Spanning Packets

### Findings
No new Q-COV finding. F-009 is confirmed as a valid coverage gap, not a duplicate of the older global vocabulary tests.

### Coverage Closure
The four-test minimum from iteration 006 still looks right:

1. Shared readiness-contract `error` fixture.
2. Status stats-before-snapshot crash envelope.
3. Context readiness-crash with CocoIndex telemetry seed.
4. Query degraded baseline asserting canonical readiness and trust state, not only `fallbackDecision`.

This closes Q-COV enough for convergence. More matrix coverage would be diminishing returns unless the implementation changes the public degraded envelope vocabulary.

## Q-DOC - Catalog/Playbook Drift

### Findings
See iteration 004 for F-005/F-007 and iteration 005 for F-008's doc-parity framing. No new doc finding was opened here.

### Precise Doc Targets If Remediation Lands
The docs should be updated after the degraded-envelope implementation, not before. The likely edit list is:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:15` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:23` for the query/context blocked and crash routing vocabulary.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md:29` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md:33` for the shared readiness surface and handler-specific fallback fields.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md:17` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md:30` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md:94` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md:119` for the context blocked/crash manual validation steps.
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md:16` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md:50` for explicit `error -> canonicalReadiness: missing / trustState: unavailable` acceptance criteria.

## Q-MAINT - Maintainability / Code Smell

### Findings
No new maintainability finding.

### Notes
F-009 remains P2 maintainability support for the existing F-008 remediation. The maintainable shape is still: keep production payload assembly handler-local, but centralize test assertions for shared degraded readiness vocabulary. That gives each handler room for different action fields without letting `freshness: 'error'`, `canonicalReadiness: 'missing'`, and `trustState: 'unavailable'` drift independently.

## Cross-Question Coverage Check
- Q-CROSS: See F-001/F-002 from iteration 001 and F-008 from iteration 005; no new finding.
- Q-REGRESS: See F-003 from iteration 002; unchanged memory surfaces remain PASS.
- Q-FLOW: See F-004 from iteration 003; no cli-copilot artifact available.
- Q-TEST: F-009 survives adversarial validation; no new finding.
- Q-COV: F-009 coverage gap converged; four-test minimum remains sufficient.
- Q-DOC: F-005/F-007/F-008 already cover current drift; precise doc edit targets identified for remediation.
- Q-MAINT: F-008/F-009 cover the remaining maintainability concern.

## Sources read this iteration
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-002.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-003.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-004.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-005.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-006.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-strategy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deltas/iter-006.jsonl`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/m8-trust-state-vocabulary.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md`

## Suggested focus for iteration 008
Run a final convergence rollup on Q-CROSS/Q-TEST/Q-COV only. Do not do another broad sweep. Confirm whether the current source already contains any remediation after this iteration's timestamp; if not, synthesize one prioritized remediation packet: F-001/F-003/F-008/F-009 as one degraded-envelope parity fix, F-004 as a separate cli-copilot artifact test gap, and F-005/F-007 as doc follow-through after code lands.
