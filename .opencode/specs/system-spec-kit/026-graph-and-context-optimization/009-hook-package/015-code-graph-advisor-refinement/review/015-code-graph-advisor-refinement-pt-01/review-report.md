---
title: Implementation Review of 015-code-graph-advisor-refinement
description: 7-iteration deep-review synthesis covering 4 dimensions (correctness, security, traceability, maintainability) across 10 PRs
generated_by: spec_kit_deep_review
session_id: dr-rev-20260425T064751Z-16c6c9e1
iterations_completed: 7
final_verdict: CONDITIONAL
generated_at: 2026-04-25T10:00:00Z
---

# Implementation Review — 015-code-graph-advisor-refinement

## 1. EXECUTIVE SUMMARY

This review covers the complete Phase 5 implementation of `015-code-graph-advisor-refinement`, comprising 10 landed PRs reviewed across 4 dimensions (correctness, security, traceability, maintainability) over 7 iterations. The executor was cli-codex gpt-5.5 high (normal speed). The review converged in iteration 6 when the rolling new-findings ratio dropped to 0.00 after a falling sequence of 1.00 → 0.50 → 0.40 → 0.33 → 0.27 → 0.00; iteration 7 was a final synthesis pass that added no new findings.

The final verdict is **CONDITIONAL**. No P0 blockers were found. After iteration-6 dedupe (2 merges applied) and one severity downgrade, the open inventory stands at **11 P1 findings and 3 P2 advisories**. The highest-leverage correctness issue is a startup-brief trust-state collapse that silently reports probe errors as absent rather than unavailable (R1-P1-001). The highest-leverage security issue is an unenforced metrics label-cardinality policy that allows env-derived runtime labels and repo-controlled skill IDs to create unbounded in-process metric series (R1-P1-003, absorbing R4-P1-001). The highest-leverage traceability gap is a canonical implementation summary still routing future agents to a pre-research scaffold while 10 PRs of implementation are complete and under review (R3-P1-003).

Total estimated fix-up effort is **35 developer-hours** grouped into 5 sequential-or-parallel remediation batches. All P1s must be resolved before a PASS verdict is issued; the 3 P2 advisories are carried for tracking only and do not block merge.

---

## 2. REVIEW SCOPE

- **Target:** Implementation of `015-code-graph-advisor-refinement` (10 PRs landed in Phase 5 — PR-1 through PR-10).
- **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`
- **Dimensions:** correctness, security, traceability, maintainability
- **Executor:** cli-codex gpt-5.5 high (default service tier — no `service_tier` flag; `flex` was rejected by the API)
- **Iterations:** 7 of 7 (max reached; convergence occurred at iteration 6)
- **Convergence:** `threshold_met` — rolling average of the last 3 `newFindingsRatio` values fell below 0.10 at iteration 6

**PR inventory reviewed:**

| PR | Focus area |
|---|---|
| PR-1 | Corpus path repair for parity and bench tests |
| PR-2 | Claude settings nested-hook schema |
| PR-3 | Delete sweep for the promotion subsystem |
| PR-4 | Readiness/trust-state vocabulary unification (status, context, query, startup-brief) |
| PR-5 | `spec_kit.*` metrics instrumentation, env gating, cardinality envelope |
| PR-6 | Cache invalidation listener registration scope and deduplication |
| PR-7 | Settings parity test coverage for Claude hook schema |
| PR-8 | Parse-latency benchmark harness |
| PR-9 | Query-latency benchmark with baseline comparison |
| PR-10 | Hook-brief signal/noise benchmark |

---

## 3. METHOD

**Baseline (iteration 1):** Targeted the 4 highest-risk PRs — PR-3 delete sweep, PR-4 trust-state unification, PR-5 metrics instrumentation, and the PR-2/PR-7 Claude settings surface. Produced 3 P1 + 1 P2 baseline findings.

**Expansion (iterations 2–5):** Each iteration extended coverage to the remaining PRs (PR-1, PR-6, PR-8, PR-9, PR-10) and ran adversarial self-checks on all previously raised P1s. Every iteration upheld all prior P1s, confirming findings were not false positives. Iterations 2–5 added 8 new P1s and 2 new P2s while the new-findings ratio decreased from 0.50 to 0.27, indicating progressive saturation.

**Consolidation (iteration 6):** Full dedupe pass across all 13 carried P1s and 3 P2s. Two merges were applied (R4-P1-001 absorbed into R1-P1-003; R1-P2-001 absorbed into R1-P1-002). One severity downgrade was applied (R5-P1-002 reduced from P1 to P2). No new findings were raised. The new-findings ratio reached 0.00 for the first time.

**Final synthesis (iteration 7):** Read all prior iterations and deltas, validated JSONL integrity, produced the master findings table and authoritative remediation roadmap, and confirmed the final verdict. No new findings were raised; new-findings ratio remained 0.00.

**newFindingsRatio trajectory:** 1.00 → 0.50 → 0.40 → 0.33 → 0.27 → 0.00 → 0.00

---

<!-- ANCHOR:findings -->

## 4. FINDINGS — Correctness

Six findings are classified under the correctness dimension. They span trust-state mapping faults, a legacy test pointing at a deleted corpus path, benchmark gate failures, a freshness vocabulary mapping gap, and a clean-checkout build-dependency regression.

| ID | Severity | PR Source | Title | File:line | Recommended Fix | Effort |
|---|---|---|---|---|---|---|
| R1-P1-001 | P1 | PR-4 | Startup brief collapses graph probe errors into absent trust | `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:245` | Preserve an `unavailable`/error axis in startup provenance. Map the error branch directly to `trustState: 'unavailable'` instead of routing through `graphState = 'missing'`, which later maps to `absent`. | S, 1–2 h |
| R2-P1-001 | P1 | PR-1 | PR-1 corpus repair missed a live legacy parity test and the requested export contract | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts:27` | Export a shared corpus-path constant from `python-ts-parity.vitest.ts` (currently a local `const`) and repoint the legacy parity suite to the live corpus at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl`. | S, 1–2 h |
| R2-P1-002 | P1 | PR-9 | PR-9 query-latency bench fail-softs missing baselines and internal bench errors as passing skips | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:153` | Move baseline-existence check, sample-count assertion, and JSON-parse step outside the catch-all. Reserve `skip` behavior for narrowly identified optional-environment failures with a machine-readable `skipReason` class. Treat zero samples and extraction errors as failures. | M, 3–4 h |
| R2-P1-003 | P1 | PR-4/PR-5 | PR-5 query-latency freshness metric maps `recent` structural context to `absent` | `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:176` | Add an explicit `recent` branch in the `computeFreshness()`-to-trust-vocabulary mapping at context.ts:175–177. Map `recent` to `live` or `stale` per product semantics; never map an existing graph to `absent`. | S, 1 h |
| R5-P1-001 | P1 | PR-8/PR-10 | Benchmark files are now on the default test path and one parse fixture depends on untracked build output | `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:17` | Remove `mcp_server/skill-advisor/bench/**/*.bench.ts` from the shared Vitest `include` and add an explicit `bench:*` script, or replace the `dist/startup-checks.js` fixture dependency with a tracked source fixture. No first-party CI workflow guarantees `npm run build` precedes `npm run test:core`. | M, 3–5 h |
| R5-P2-001 | P2 | PR-10 | The signal/noise bench only asserts signal presence and manually emits the metric it claims to verify | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts:52` | Add negative/noise fixtures for each documented noise boundary (non-live freshness, no passing recommendations, sanitization rejection, excessive token cap). Drive the production `renderAdvisorBrief()` path to emit `spec_kit.advisor.recommendation_emitted_total` rather than manually incrementing the counter. | M, 2–3 h |

**Dimension summary:** 5 open findings (4 P1, 1 P2). The most severe is R1-P1-001, which silently corrupts the shared-payload trust contract used by consumers of the startup brief.

---

## 5. FINDINGS — Security

Two findings are classified under the security dimension. Both concern unbounded or insufficiently anchored inputs: one in the metric label collector, one in Claude hook command execution.

| ID | Severity | PR Source | Title | File:line | Recommended Fix | Effort |
|---|---|---|---|---|---|---|
| R1-P1-003 | P1 | PR-5 (absorbs R4-P1-001 from PR-5) | Metrics cardinality envelope is not enforced for caller-provided labels (env-derived and repo-controlled) | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:320` (env labels); `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:578` (collector sink) | Normalize `SPECKIT_RUNTIME` and `SPECKIT_ADVISOR_FRESHNESS` to closed enums before emission. Clamp or bucket `skill_id` (sourced from SQLite `skill_nodes.id` or filesystem `graph-metadata.json.skill_id`) to known built-in IDs plus a `custom_skill` fallback. Have `SpeckitMetricsCollector` reject or bucket labels outside declared value policies at the sink rather than only at individual emission sites. | M, 4–6 h |
| R4-P1-002 | P1 | PR-2/PR-7 | Claude hook commands execute a repo-relative hook selected by ambient cwd and PATH | `.claude/settings.local.json:31` | Anchor the `git rev-parse --show-toplevel` fallback to the canonical settings-file directory rather than ambient cwd. Use a pinned Node binary (`process.execPath` from setup, or an absolute path) rather than unqualified `node`. In nested-repo or worktree launches, the current command can resolve `.opencode/…/dist/hooks/claude/*.js` from a different repository. | M, 3–5 h |

**Dimension summary:** 2 open findings, both P1. R1-P1-003 is the largest refactor in the report (collector-side policy enforcement plus per-emission-site tests for env and skill-id labels). R4-P1-002 is a path-confusion surface rather than a direct injection vector but carries the same P1 severity because it enables execution of an attacker-controlled `dist` hook.

**Dedupe note (R4-P1-001 → R1-P1-003):** R4-P1-001 (raised in iteration 4) identified `skill_id` as an additional open-ended label source in the same collector. Iteration 6 merged it into R1-P1-003 because a single collector-side policy enforcement fix resolves both the env-derived and repo-derived inputs. The merged ID is recorded in `iter-006.jsonl`.

---

## 6. FINDINGS — Traceability

Three findings are classified under the traceability dimension. They concern an incomplete deletion-sweep inventory from PR-3, an unimplemented T-027 compatibility alias surface from PR-4, and a stale canonical implementation summary.

| ID | Severity | PR Source | Title | File:line | Recommended Fix | Effort |
|---|---|---|---|---|---|---|
| R1-P1-002 | P1 | PR-3 | Delete sweep left a task-listed promotion test file on disk (absorbs R1-P2-001 stale manual evidence) | `.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:1` | Decide whether the residual promotion test belongs to the removed subsystem. If yes, delete it as part of the PR-3 close-out. If no, update `plan.md`/`tasks.md` so the approved deletion inventory excludes it. Also scrub or mark historical the stale `SCENARIO_RUN_2026-04-21.md` entry that claims the deleted `promotion-gates.vitest.ts` suite passes (`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md:30`). | S, 1–2 h |
| R3-P1-001 | P1 | PR-4 | PR-4 T-027 compatibility alias surface is not actually centralized in `trust-state.ts` | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:59` | Either implement the promised V1–V5 deprecation aliases (`GraphFreshness`, `StructuralReadiness`) as re-exports from `trust-state.ts`, and migrate external import consumers (e.g., `session-resume.ts:15`) toward that canonical surface; or amend T-027/`plan.md` evidence to state the old exports remain intentionally code-graph-owned compatibility exports. | M, 2–4 h |
| R3-P1-003 | P1 | Cross | Spec close-out summary still says the packet is planned and research-only | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/implementation-summary.md:4` | Update `implementation-summary.md` with: the implemented PR set, current deep-review verdict (CONDITIONAL), all 11 open P1 + 3 P2 findings by ID, validation run evidence, and the next remediation step. Update the `_memory.continuity` frontmatter to point to the remediation phase, not to `/spec_kit:deep-research:auto`. | S, 1 h |

**Dimension summary:** 3 open findings, all P1. R3-P1-003 is the most urgent for operational continuity because the stale implementation summary will misroute any agent or developer resuming this packet.

**Dedupe note (R1-P2-001 → R1-P1-002):** R1-P2-001 (raised in iteration 1) flagged stale manual evidence in `SCENARIO_RUN_2026-04-21.md`. Iteration 6 folded it into R1-P1-002 because it is downstream traceability evidence for the same PR-3 deletion-sweep mismatch. Fixing the deletion inventory naturally resolves the stale playbook entry.

---

## 7. FINDINGS — Maintainability

Two findings are classified under the maintainability dimension. Both relate to test-surface gaps in the PR-7 settings parity suite and stale Copilot hook documentation.

| ID | Severity | PR Source | Title | File:line | Recommended Fix | Effort |
|---|---|---|---|---|---|---|
| R3-P1-002 | P1 | PR-7 | PR-7 settings parity can pass by skipping every assertion in the default non-Claude test environment | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:135` | Split the settings-parity test file: move runtime-independent JSON shape assertions (no top-level `bash`, `matcher` string format, nested `hooks[]` structure, correct command path fragments) into an always-on suite that runs on all executors. Keep only live Claude interpreter behavior behind the `describe.skipIf(!isClaudeCodeRuntime())` guard. | M, 2–3 h |
| R3-P2-001 | P2 | PR-7/PR-2 | Copilot hook README still documents the deleted mixed `.claude/settings.local.json` top-level `bash` wrapper shape | `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27` | Rewrite the Copilot registration section to describe the current Copilot-supported hook surface and remove prescriptions for a top-level `bash` field inside `.claude/settings.local.json`. The production settings file is correct; the README has not caught up. | S, 1 h |

**Dimension summary:** 2 open findings (1 P1, 1 P2). R3-P1-002 is structurally linked to R4-P1-002 and R3-P2-001 — all three concern the hook settings surface and are batched together in B4.

---

<!-- /ANCHOR:findings -->

## 8. REMEDIATION PLAN

The 5 batches below correspond directly to the `remediation_plan` object in `iter-007.jsonl`. Batches are independent and can be executed in parallel by separate engineers or executor instances. The suggested executor for all batches is **codex gpt-5.5 high** at normal speed (no `service_tier` flag).

---

### B1 — Trust-state and freshness semantics

**Findings:** R1-P1-001, R2-P1-003, R3-P1-001
**Effort:** 5–7 h

**Scope:**
- `startup-brief.ts:245` — fix error→missing→absent trust collapse to error→unavailable
- `code-graph-context.ts:176` — add explicit `recent` → `live`/`stale` branch in freshness mapping
- `trust-state.ts:59` — implement or amend the T-027 compatibility alias surface

**Files in scope:**
```
.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts
.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts
.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts
.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts
```

**Pre-merge sanity check:** Run `npx vitest run code-graph/tests/code-graph-context-handler.vitest.ts code-graph/tests/code-graph-query-handler.vitest.ts --config vitest.config.ts` from `mcp_server`. Mock `getGraphFreshness()` to return `error` and assert `sharedPayload.provenance.trustState === 'unavailable'`.

**Suggested executor:** codex gpt-5.5 high

---

### B2 — Metrics label policy and benchmark harness reliability

**Findings:** R1-P1-003, R2-P1-002, R5-P1-001, R5-P1-002, R5-P2-001
**Effort:** 13–20 h

**Scope:**
- `metrics.ts:578–590` — add collector-level label-policy enforcement (reject or bucket unknown values for metrics with declared vocabularies)
- `fusion.ts:320` + `structural-indexer.ts:1419` — normalize `SPECKIT_RUNTIME` and `SPECKIT_ADVISOR_FRESHNESS` to closed enums before emission
- `scorer/projection.ts:165,230–242` — clamp or bucket `skill_id` from SQLite/filesystem
- `vitest.config.ts:17–22` — remove bench files from shared `include`, add explicit `bench:*` script
- `code-graph-parse-latency.bench.ts:36–38` — replace `dist/startup-checks.js` fixture with tracked source fixture
- `code-graph-query-latency.bench.ts:101–103,153–157` — move baseline/sample invariants outside catch-all; restore env in `finally`
- `hook-brief-signal-noise.bench.ts:52–84` — add negative noise fixtures; drive production recommendation path for metric assertion

**Files in scope:**
```
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts
.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts
.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
.opencode/skill/system-spec-kit/mcp_server/package.json
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts
```

**Pre-merge sanity check:** Run default test suite (`npm run test:core`) without pre-building `dist/`. Confirm benches are excluded from the default run and no test failure occurs on a clean checkout. Separately run the explicit bench script and confirm baseline comparisons fail closed on missing/malformed input. Confirm `speckitMetrics.snapshot().metricsUniqueSeriesCount` does not grow when unique `SPECKIT_RUNTIME` values or novel `skill_id` values are injected.

**Suggested executor:** codex gpt-5.5 high

---

### B3 — Deleted promotion scope and packet close-out traceability

**Findings:** R1-P1-002, R3-P1-003
**Effort:** 2–3 h

**Scope:**
- Reconcile `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` with the PR-3 approved deletion inventory
- Scrub or mark as historical the stale `SCENARIO_RUN_2026-04-21.md` promotion-gates evidence
- Update `implementation-summary.md` frontmatter, continuity block, Metadata, and "What Was Built" sections to reflect the Phase 5 implementation state, current review verdict, open findings, and next remediation step

**Files in scope:**
```
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/implementation-summary.md
```

**Pre-merge sanity check:** Confirm `find .opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` returns no result (if delete path taken). Confirm `implementation-summary.md` frontmatter status is no longer `planned`. Confirm `_memory.continuity` next-action points to remediation implementation, not `/spec_kit:deep-research:auto`.

**Suggested executor:** codex gpt-5.5 high

---

### B4 — Hook settings execution and parity coverage

**Findings:** R3-P1-002, R4-P1-002, R3-P2-001
**Effort:** 6–9 h

**Scope:**
- `settings.local.json:31,43,55,67` — anchor hook commands to a canonical project root, or resolve the hook path relative to the settings file location rather than `git rev-parse --show-toplevel`; use a pinned or validated Node binary
- `settings-driven-invocation-parity.vitest.ts:135` — split into an always-on JSON shape suite (no top-level `bash`, correct `matcher` format, correct command path fragments) and a Claude-runtime-guarded live-execution suite
- `hooks/copilot/README.md:27` — rewrite Copilot registration docs to match the current supported hook surface; remove prescription for top-level `bash` inside `.claude/settings.local.json`

**Files in scope:**
```
.claude/settings.local.json
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md
```

**Pre-merge sanity check:** Run `npx vitest run mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts --config mcp_server/vitest.config.ts` without setting `CLAUDE_CODE` or `CLAUDE_SESSION_ID`. Confirm at least the always-on suite asserts > 0 assertions. Confirm the `bash -c` command in `.claude/settings.local.json` resolves hook paths in a nested-repo scenario to the intended project root.

**Suggested executor:** codex gpt-5.5 high

---

### B5 — Legacy corpus parity repair

**Findings:** R2-P1-001
**Effort:** 1–2 h

**Scope:**
- Export a shared corpus-path constant or helper from `python-ts-parity.vitest.ts` (or from a dedicated path-constants module)
- Repoint `advisor-corpus-parity.vitest.ts:27–33` to the live corpus at `skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl`
- Run both parity suites and confirm passage

**Files in scope:**
```
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts
```

**Pre-merge sanity check:** Run `npx vitest run mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts --config mcp_server/vitest.config.ts`. Both suites must pass (not skip) against the live corpus.

**Suggested executor:** codex gpt-5.5 high

---

**Total estimated effort: 35 developer-hours across 5 batches**

| Batch | Findings | Effort |
|---|---|---|
| B1 — Trust-state and freshness semantics | R1-P1-001, R2-P1-003, R3-P1-001 | 5–7 h |
| B2 — Metrics label policy and benchmark reliability | R1-P1-003, R2-P1-002, R5-P1-001, R5-P1-002, R5-P2-001 | 13–20 h |
| B3 — Deletion scope and close-out traceability | R1-P1-002, R3-P1-003 | 2–3 h |
| B4 — Hook settings execution and parity coverage | R3-P1-002, R4-P1-002, R3-P2-001 | 6–9 h |
| B5 — Legacy corpus parity repair | R2-P1-001 | 1–2 h |
| **Total** | | **27–41 h (midpoint ~35 h)** |

---

## 9. CONVERGENCE REPORT

<!-- ANCHOR:convergence-report -->
- **Stop reason:** `threshold_met` — rolling average of the last 3 `newFindingsRatio` values fell below the configured threshold of 0.10 at iteration 6. The rolling window covered ratios 0.27, 0.00, and 0.00, producing a rolling average of ~0.09.
- **Total iterations:** 7 of 7 (maximum reached; convergence was detected at iteration 6, iteration 7 was a mandatory final synthesis pass).

**newFindingsRatio trajectory:**

| Iteration | newFindingsRatio | New findings | Status |
|---|---|---|---|
| 1 | 1.00 | 3 P1 + 1 P2 (baseline) | open-findings |
| 2 | 0.50 | 3 P1 | open-findings |
| 3 | 0.40 | 3 P1 + 1 P2 | open-findings |
| 4 | 0.33 | 2 P1 | open-findings |
| 5 | 0.27 | 2 P1 + 1 P2 | open-findings |
| 6 | 0.00 | 0 (consolidation: 2 dedupes, 1 downgrade) | consolidation-open-findings |
| 7 | 0.00 | 0 (final synthesis) | final-synthesis |

**Total findings inventory (final, post-dedupe/resev):**

| Severity | Count | IDs |
|---|---|---|
| P0 | 0 | — |
| P1 | 11 | R1-P1-001, R1-P1-002, R1-P1-003, R2-P1-001, R2-P1-002, R2-P1-003, R3-P1-001, R3-P1-002, R3-P1-003, R4-P1-002, R5-P1-001 |
| P2 | 3 | R3-P2-001, R5-P1-002 (downgraded), R5-P2-001 |

**Per-dimension breakdown:**

| Dimension | P1 | P2 | Total |
|---|---|---|---|
| Correctness | 5 (R1-P1-001, R2-P1-001, R2-P1-002, R2-P1-003, R5-P1-001) | 1 (R5-P2-001) | 6 |
| Security | 2 (R1-P1-003, R4-P1-002) | 0 | 2 |
| Traceability | 3 (R1-P1-002, R3-P1-001, R3-P1-003) | 0 | 3 |
| Maintainability | 1 (R3-P1-002) | 2 (R3-P2-001, R5-P1-002) | 3 |

*Note: R5-P1-001 is listed under correctness because its primary impact is a deterministic clean-checkout test failure. Per-dimension P1 sum is 11 (5 + 2 + 3 + 1) and P2 sum is 3 (1 + 0 + 0 + 2), matching the totals table above.*

**Dedupes applied: 2**
- R4-P1-001 merged into R1-P1-003 (same collector-level root cause; skill-id evidence added to the retained finding)
- R1-P2-001 merged into R1-P1-002 (downstream traceability evidence for the same PR-3 deletion-sweep mismatch)

**Severity recalibrations: 1**
- R5-P1-002 downgraded from P1 to P2 (env leak is real but no current default-suite failure was demonstrated; `vitest.config.ts` serializes files; P2 is more accurate than P1 until a concrete failure is shown)

**Validation records (upheld counts per iteration):**

| Iteration | Findings upheld | Findings narrowed |
|---|---|---|
| 2 | R1-P1-001, R1-P1-002, R1-P1-003 | — |
| 3 | R2-P1-001, R2-P1-002, R2-P1-003 | — |
| 4 | R3-P1-001, R3-P1-002, R1-P1-003, R4-P1-002 | R4-P1-001 (narrowed: 200 skills does not blow 9 k series; finding still valid) |
| 5 | R1-P1-003, R2-P1-002, R4-P1-001, R4-P1-002 | — |
| 6 | R5-P1-001, R5-P2-001 | R5-P1-002 (upheld + downgraded to P2) |

**Final verdict: CONDITIONAL**
- `hasAdvisories: true`
- No P0 blockers. 11 P1 findings must be resolved before a PASS verdict can be issued.
- P2 findings (R3-P2-001, R5-P1-002, R5-P2-001) are carried as advisories and do not block merge, but should be tracked in the remediation spec.

**Next step:** Run `/spec_kit:plan` to create a remediation sub-phase for the 5 batches, then implement with cli-codex gpt-5.5 high in one continuous run.
<!-- /ANCHOR:convergence-report -->
