# Deep Review Iteration 7 - Final Synthesis

Final synthesis pass for the 015 code-graph advisor refinement review packet.

Scope:
- Read iterations 001-006 and deltas 001-006.
- Applied iteration-6 dedupe and reseverity decisions.
- Produced the authoritative remediation roadmap for synthesis.

## Master Findings Table

| Finding ID | Severity | Dimension | PR source | Title | File:line evidence | Recommended fix | Effort | Dedupe note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1-P1-001 | P1 | Correctness | PR-4 | Startup brief collapses graph probe errors into absent trust | `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:245` | Preserve unavailable/error trust semantics in startup provenance instead of mapping probe errors through missing/absent. | S, 1-2h | None |
| R1-P1-002 | P1 | Traceability | PR-3 | Delete sweep left a task-listed promotion test file on disk | `.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:1` | Reconcile the PR-3 delete inventory by deleting the residual test or correcting the packet evidence. | S, 1-2h | Absorbs R1-P2-001 stale manual evidence. |
| R1-P1-003 | P1 | Security | PR-5 | Metrics cardinality envelope is not enforced for caller-provided labels | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:320` | Enforce declared metric label policies at the collector/emission boundary and bucket or reject unknown env/runtime/skill labels. | M, 4-6h | Absorbs R4-P1-001 skill_id cardinality evidence. |
| R2-P1-001 | P1 | Correctness | PR-1 | PR-1 corpus repair missed a live legacy parity test and the requested export contract | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts:27` | Export a shared corpus path helper/constant and repoint the legacy parity suite to the live corpus. | S, 1-2h | None |
| R2-P1-002 | P1 | Correctness | PR-9 | PR-9 query-latency bench fail-softs missing baselines and internal bench errors as passing skips | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:153` | Treat missing/malformed baselines, zero samples, and extraction errors as benchmark failures, not accepted skips. | M, 3-4h | Related to bench gating but distinct from R5-P1-001. |
| R2-P1-003 | P1 | Correctness | PR-4/PR-5 | PR-5 query-latency freshness metric maps recent structural context to absent | `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:176` | Map recent structural context to the intended live/stale freshness bucket and reserve absent for no graph data. | S, 1h | None |
| R3-P1-001 | P1 | Traceability | PR-4 | PR-4 T-027 compatibility alias surface is not actually centralized in trust-state.ts | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:59` | Either implement the promised compatibility aliases in trust-state.ts or update the PR evidence to state old exports remain owned elsewhere. | M, 2-4h | None |
| R3-P1-002 | P1 | Maintainability | PR-7 | PR-7 settings parity can pass by skipping every assertion in the default non-Claude test environment | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:135` | Split runtime-independent settings JSON assertions into an always-on test and keep only live Claude execution behind the runtime guard. | M, 2-3h | Pairs naturally with R4-P1-002 and R3-P2-001. |
| R3-P1-003 | P1 | Traceability | Cross | Spec close-out summary still says the packet is planned and research-only | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/implementation-summary.md:4` | Update implementation-summary.md with implemented PRs, validation evidence, current verdict, and open remediation state. | S, 1h | None |
| R4-P1-002 | P1 | Security | PR-2/PR-7 | Claude hook commands execute a repo-relative hook selected by ambient cwd and PATH | `.claude/settings.local.json:31` | Anchor hook commands to the canonical project root or settings location and use a pinned or validated Node executable contract. | M, 3-5h | Distinct from stale README guidance. |
| R5-P1-001 | P1 | Correctness | PR-8/PR-10 | Benchmark files are now on the default test path and one parse fixture depends on untracked build output | `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:17` | Remove benches from the default Vitest include or replace the dist fixture dependency with a tracked source fixture and explicit bench workflow. | M, 3-5h | Related to R2-P1-002 bench reliability, separate default-test blast radius. |
| R3-P2-001 | P2 | Maintainability | PR-7 | Copilot hook README still documents the deleted mixed .claude/settings.local.json top-level bash wrapper shape | `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27` | Rewrite the Copilot registration docs to match the current supported hook/settings surface. | S, 1h | Pair with R3-P1-002/R4-P1-002 docs and test updates. |
| R5-P1-002 | P2 | Correctness | PR-8/PR-9/PR-10 | Benchmark suites force SPECKIT_METRICS_ENABLED=true and do not restore the prior environment | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts:59` | Snapshot and restore SPECKIT_METRICS_ENABLED in every bench, paired with metrics reset. | S, 1-2h | Downgraded from P1 to P2 in iteration 6. |
| R5-P2-001 | P2 | Maintainability | PR-10 | The signal/noise bench only asserts signal presence and manually emits the metric it claims to verify | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts:52` | Add negative/noise fixtures and drive the production recommendation metric path instead of manually incrementing it. | M, 2-3h | None |

## Final Verdict

FINAL VERDICT: CONDITIONAL.

Counts after iteration-6 consolidation:
- P0: 0
- P1: 11
- P2: 3
- hasAdvisories: true

The review has no P0 blockers, but it has more than two active P1 findings. Per the deep-review contract, that is CONDITIONAL: merge only after P1 remediation, with P2s carried as advisories.

Dimensions covered:
- Correctness
- Security
- Traceability
- Maintainability

Convergence reason: threshold_met. Iteration 6 produced zero new findings after a falling sequence of new-findings ratios: 1.00 -> 0.50 -> 0.40 -> 0.33 -> 0.27 -> 0.00. Iteration 7 is the final synthesis pass and adds no new findings.

JSONL integrity spot-check: all delta files iter-001 through iter-007 parse cleanly after the iteration-7 write.

## Phase 7 Fix-Up Plan

### B1 - Trust-state and freshness semantics

Findings: R1-P1-001, R2-P1-003, R3-P1-001

Effort: 5-7h.

Fix startup brief error/unavailable provenance, query-latency freshness mapping for recent graph data, and the PR-4 compatibility alias/evidence mismatch. R2-P1-003 is the clearest one-line surgical edit; R1-P1-001 and R3-P1-001 need small contract/test updates.

### B2 - Metrics label policy and benchmark harness reliability

Findings: R1-P1-003, R2-P1-002, R5-P1-001, R5-P1-002, R5-P2-001

Effort: 13-20h.

Add collector-side metric label policy enforcement, make query benchmark invariants fail closed, isolate benchmarks from the default Vitest path or tracked fixtures, restore env state in benches, and add negative/production-path coverage for the signal/noise bench. R5-P1-002 is surgical; R1-P1-003 is the largest multi-file refactor.

### B3 - Deleted promotion scope and packet close-out traceability

Findings: R1-P1-002, R3-P1-003

Effort: 2-3h.

Reconcile the residual promotion test and stale manual evidence with PR-3, then update implementation-summary.md so future agents resume from the implemented/reviewed state. Both are surgical edits.

### B4 - Hook settings execution and parity coverage

Findings: R3-P1-002, R4-P1-002, R3-P2-001

Effort: 6-9h.

Anchor Claude hook commands to a trusted root/runtime contract, add always-on static settings assertions, and update Copilot hook documentation to match current supported wiring. R3-P2-001 is surgical documentation cleanup; R4-P1-002 is the multi-file behavior/test change.

### B5 - Legacy corpus parity repair

Findings: R2-P1-001

Effort: 1-2h.

Export or centralize the live corpus path and repoint the legacy parity suite. This is a small, focused test/helper edit.

Total estimated effort: 27-41h.

## Surgical vs Refactor Classification

One-line or surgical edits:
- R2-P1-003
- R3-P1-003
- R5-P1-002
- R3-P2-001
- R2-P1-001
- R1-P1-002, if the intended outcome is deletion of the residual file

Small-to-medium multi-file changes:
- R1-P1-001
- R2-P1-002
- R3-P1-001
- R3-P1-002
- R4-P1-002
- R5-P1-001
- R5-P2-001

Largest refactor:
- R1-P1-003, because the correct fix should be collector-side policy enforcement plus emission-site tests for env-derived and repo-derived labels.

## New Findings

None. Iteration 7 is synthesis-only.
