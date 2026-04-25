# Iteration 006

## Focus

Cross-cutting consolidation and adversarial review of the open finding set:

- Dedupe pass across 13 P1 and 3 P2 carried findings.
- Severity recalibration for all P1s.
- Coverage map across PRs 1-10.
- Cross-finding interaction scan.
- Final adversarial pass on R5-P1-001, R5-P1-002, and R5-P2-001.
- Remaining high-leverage review surface not yet covered.

## Files Reviewed

Prior review artifacts:

- `review/015-code-graph-advisor-refinement-pt-01/iterations/iteration-001.md`
- `review/015-code-graph-advisor-refinement-pt-01/iterations/iteration-002.md`
- `review/015-code-graph-advisor-refinement-pt-01/iterations/iteration-003.md`
- `review/015-code-graph-advisor-refinement-pt-01/iterations/iteration-004.md`
- `review/015-code-graph-advisor-refinement-pt-01/iterations/iteration-005.md`
- `review/015-code-graph-advisor-refinement-pt-01/deltas/iter-001.jsonl`
- `review/015-code-graph-advisor-refinement-pt-01/deltas/iter-002.jsonl`
- `review/015-code-graph-advisor-refinement-pt-01/deltas/iter-003.jsonl`
- `review/015-code-graph-advisor-refinement-pt-01/deltas/iter-004.jsonl`
- `review/015-code-graph-advisor-refinement-pt-01/deltas/iter-005.jsonl`
- `review/015-code-graph-advisor-refinement-pt-01/deep-review-state.jsonl`
- `review/015-code-graph-advisor-refinement-pt-01/findings-registry.json`

Implementation files rechecked for R5 and coverage:

- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/`
- `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/`
- `.github/hooks/`

Checks performed:

- Compared all prior delta finding records and iteration narratives for duplicate root causes.
- Re-read `tasks.md` PR 1-10 inventory to map planned PR surfaces to reviewed files.
- Checked `git ls-files` for `mcp_server/dist/startup-checks.js` and the Claude `dist/hooks/claude/*.js` entrypoints; no tracked paths were returned.
- Searched first-party `.github` and local YAML surfaces for a CI build-before-test guarantee; no first-party workflow file was found, only hook scripts under `.github/hooks/`.

## Dedupe Pass

### Merge: R4-P1-001 into R1-P1-003

R1-P1-003 and R4-P1-001 are the same collector-level defect from two inputs:

- R1-P1-003 covers env-derived `runtime` and `freshness_state` labels.
- R4-P1-001 covers repo-derived `skill_id` labels.

The shared root cause is that `SpeckitMetricsCollector` keys caller-provided labels without enforcing declared label policies or bounded buckets. R4-P1-001 should be merged into R1-P1-003 as additional evidence, with the retained finding broadened from "env-derived labels" to "unbounded caller-provided metric labels." This is not merely same-file overlap: a single collector-side enforcement fix would resolve both env and skill-id paths.

### Downstream: R1-P2-001 under R1-P1-002

R1-P2-001 is downstream traceability evidence for the same PR-3 deletion-sweep mismatch as R1-P1-002. The manual scenario run still claiming a deleted promotion suite passed is a consequence of the delete inventory not being reconciled. Keep the P1 root finding and fold the P2 evidence into it rather than carrying a separate open P2.

### Keep Separate

- R2-P1-002 and R5-P1-001 both concern benchmark gates, but they fail differently: R2-P1-002 converts invariant failures into passing skips, while R5-P1-001 puts benches on the default test path and depends on generated `dist` fixtures.
- R3-P1-002 and R3-P2-001 both touch settings parity/documentation, but one is executable test coverage and the other is stale Copilot README guidance.
- R4-P1-002 and R3-P2-001 both mention hook wiring, but path-confusion execution risk and stale README adapter shape are distinct concerns.
- R5-P1-002 and R1-P1-003 both touch metrics env state, but one is test process pollution while the other is production metric cardinality.

## Severity Recalibration

### Downgrade: R5-P1-002 to P2

R5-P1-002 is valid but does not look merge-blocking after adversarial review. The benches do force `SPECKIT_METRICS_ENABLED=true` without restoring the previous value, but `vitest.config.ts` sets `fileParallelism: false`, the focused iteration-5 run passed, and no reviewed regular test currently demonstrated a post-bench metrics-gate failure. This remains an order-sensitive test-hygiene issue and should be fixed, especially because the benches are in the default include path, but P2 is a better severity unless a concrete default-suite failure is shown.

### P1s Retained

- R1-P1-001 remains P1 because it corrupts the startup shared-payload trust-state contract for graph probe errors.
- R1-P1-002 remains P1 because it contradicts the approved PR-3 deletion inventory.
- R1-P1-003 remains P1 after absorbing R4-P1-001 because the metrics namespace still has no runtime label-policy enforcement.
- R2-P1-001 remains P1 because the legacy parity suite points at a missing corpus path and is in the default Vitest include.
- R2-P1-002 remains P1 because a benchmark release gate can pass while baseline/sample invariants are broken.
- R2-P1-003 remains P1 because a live/recent graph can be emitted as `freshness_state=absent`.
- R3-P1-001 remains P1 because T-027's compatibility alias acceptance path is not implemented as specified.
- R3-P1-002 remains P1 because the checked-in `.claude/settings.local.json` contract can regress on non-Claude CI with zero assertions.
- R3-P1-003 remains P1 because the canonical implementation summary still routes future agents to a pre-research state.
- R4-P1-002 remains P1 because the checked-in hook commands execute repo-relative `dist` hooks selected by ambient cwd and PATH.
- R5-P1-001 remains P1 because the default test path can fail on a clean checkout without generated `dist/startup-checks.js`.

After consolidation, the recommended open count is 11 P1 and 3 P2 if no implementation remediation has landed.

## Coverage Map

Every PR from 1-10 has at least one reviewed file in iterations 1-5.

| PR | Reviewed Surface | Assessment |
|---|---|---|
| PR 1 | `python-ts-parity.vitest.ts`, `advisor-corpus-parity.vitest.ts`, corpus path behavior | Covered, but `scorer-bench.ts` itself was not deeply re-read in the later adversarial passes. |
| PR 2 | `.claude/settings.local.json`, hook command strings, docs interaction | Covered. |
| PR 3 | residual promotion test file, manual playbook evidence, implementation summary/doc drift | Covered for traceability; full deleted-file inventory was not exhaustively rechecked in iteration 6. |
| PR 4 | startup/context/query/status readiness and trust-state paths, alias surface | Covered repeatedly. |
| PR 5 | metric definitions, collector sink, env labels, skill labels, cardinality math | Covered repeatedly. |
| PR 6 | cache invalidation listener and uniqueness test | Lightly covered; no adversarial lifecycle/concurrency check beyond listener uniqueness. |
| PR 7 | settings parity test, `.claude/settings.local.json`, stale Copilot docs | Covered. |
| PR 8 | parse-latency bench, Vitest inclusion, generated fixture dependency | Covered. |
| PR 9 | query-latency bench, baseline JSON, fail-soft behavior | Covered. |
| PR 10 | hook-brief signal/noise bench | Covered, but production renderer negative/noise cases remain under-reviewed outside the bench. |

Under-reviewed surfaces for iteration 7: PR 1 `scorer-bench.ts`, PR 6 lifecycle/concurrency behavior around cache invalidation, PR 10 production renderer negative cases, and generated `dist` hook parity.

## Cross-Finding Interactions

- Fixing collector label-policy enforcement resolves the merged R1-P1-003/R4-P1-001 cluster. Normalizing only env labels would leave the skill-id input open; bucket or reject labels at the collector boundary.
- Removing benches from the default Vitest include would directly address R5-P1-001's default-test blast radius and reduce R5-P1-002's leakage risk, but explicit bench runs still need env restoration.
- Splitting benchmark config from regular tests also narrows R2-P1-002 by making fail-soft behavior a bench-only policy choice, but it does not fix the false-pass baseline invariant.
- Anchoring `.claude/settings.local.json` hook commands to a canonical root and adding always-on static settings assertions would jointly reduce R4-P1-002 and R3-P1-002. Updating hook docs then resolves R3-P2-001.
- Updating `implementation-summary.md` does not fix individual stale docs, but it reduces resume misrouting and should reference all remaining open findings so future remediation does not lose the review state.

## Final Adversarial Pass on R5

### R5-P1-001 upheld

Counterargument tested: perhaps benches are only explicit/manual and clean checkout always builds `dist` before tests.

Evidence still supports the finding. `vitest.config.ts` includes `mcp_server/skill-advisor/bench/**/*.bench.ts` in the shared include list. `package.json` runs `test:core` as plain `vitest run --exclude tests/file-watcher.vitest.ts`, and `check:full` runs `check` plus `test`, not `build` plus `test`. The parse bench asserts existence for `.opencode/skill/system-spec-kit/mcp_server/dist/startup-checks.js`, and `git ls-files` returned no tracked file for that path. I found no first-party workflow file proving a build step always precedes default tests. Local generated files existing under `dist/` do not falsify the clean-checkout risk.

### R5-P1-002 upheld but downgraded to P2

Counterargument tested: perhaps the env mutation is harmless because these are benches and the collector reset is enough.

The env mutation is real: all three bench files set `process.env.SPECKIT_METRICS_ENABLED = 'true'`, and none restores the previous value. The query bench exports `runQueryLatencyBench()`, so callers outside the bench file can inherit the mutation too. However, this pass did not find an existing regular test that fails because of the leak, and the current Vitest config serializes files. That makes P2 more accurate than P1 while preserving the fix requirement.

### R5-P2-001 upheld

Counterargument tested: perhaps "rendered string exists" is the intended signal/noise boundary and manual metric emission is acceptable collector-shape coverage.

The current bench still only constructs positive `freshness: 'live'` renderables with passing recommendations, then manually increments `spec_kit.advisor.recommendation_emitted_total`. It never asserts that documented noisy inputs return `null`, and it does not prove the production recommendation path emits the metric. P2 remains correct: useful bench fixture, weak signal/noise gate.

## Remaining High-Leverage Areas

- Generated `dist` artifacts: `.claude/settings.local.json` and several docs execute `mcp_server/dist/hooks/claude/*.js`, and local `dist/hooks/claude/` exists, but `git ls-files` returned no tracked Claude hook dist entrypoints. Iteration 7 should compare source hook behavior to built output or decide whether build artifacts are intentionally untracked operational prerequisites.
- First-party CI/build order: no first-party workflow was found under `.github/workflows`; only `.github/hooks/` scripts are present. The review still cannot prove whether default tests run after build in automation.
- Root/workspace package scripts: iteration 6 re-read the MCP server `package.json`, but not the root package orchestration surface. That matters for whether `npm test`, workspace filtering, or install scripts implicitly build `mcp_server/dist`.
- PR 10 renderer negatives: the bench constructs only happy-path renderables. Production `renderAdvisorBrief()` and advisor emission paths deserve a negative/noise fixture pass.
- PR 6 cache invalidation lifecycle: listener uniqueness has coverage, but stale prompt-cache behavior across repeated invalidations and module reload boundaries was not adversarially reviewed.

## Verdict-So-Far

Conditional. No P0 found in iteration 6 and no new finding is added. Consolidation reduces the carried set by merging one P1 into another and one P2 into its root P1, and downgrades one R5 P1 to P2. Recommended open count after consolidation: 11 P1 + 3 P2.

