---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Code Graph System + Skill Advisor System refinement — investigate algorithm/correctness, performance, UX, observability, and evolution (RQ-01 through RQ-10 in spec.md)
- Started: 2026-04-24T19:52:59.013Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Session ID: dr-20260424T195254Z-72a5b0eb
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | architectural baseline: code-graph edge inventory + skill-advisor freshness/scorer/promotion | - | 0.88 | 0 | complete |
| undefined | RQ-01 depth (CALLS structurally regex-only) + RQ-03 depth (5-state trust-state, INV-F5 concurrency exposures) + RQ-04 groundwork (two-cycle magnitude-blind, 3/12 gates typed boolean) | - | 0.86 | 0 | complete |
| undefined | RQ-04 depth close (shadow-cycle + rollback + weight-delta-cap) + RQ-07 close (4-surface stale-state vocabulary + divergence matrix) | architecture+ux | 0.84 | 0 | complete |
| 4 | RQ-08 hook brief signal-to-noise + RQ-10 cross-runtime parity (both closed) | rq-08-signal-to-noise + rq-10-cross-runtime-parity | 0.85 | 9 | complete |
| undefined | RQ-05 close (scan throughput & incremental accuracy) + RQ-06 groundwork (query latency & cache hit ratio) | - | 0.74 | 0 | rq-05 resolved; rq-06 groundwork established |
| undefined | RQ-06 close + RQ-02 groundwork | - | 0.58 | 0 | rq-06 resolved; rq-02 lane topology grounded |
| 7 | RQ-02 close (lane-bias direction synthesis + AC-4 harness wiring defect) + RQ-09 close (8-benchmark coverage gap suite with effort estimates) | scorer-quality+benchmark-gaps | 0.55 | 4 | complete |
| 8 | Top-K risk/remediation synthesis + second-order findings | synthesis | 0.45 | 8 | insight |
| 9 | PR-ready pre-flight + INV-F5-V2 source binding + graph-emit seam check | depth-evidence-pr-ready | 0.55 | 6 | complete |
| 10 | Settings-rewrite PR-ready diff (F23.1/F37#1) + production caller-of-rollback grep (F47 follow-up) + F50 test-flakiness check | depth-evidence-pr-ready | 0.50 | 5 | complete |
| 11 | Test fixture skeleton (F56), promotion-orchestrate handler skeleton (F57), F37-v2 consolidated remediation table (F59), and second-order check on iter-10 dead-code finding (F60). Plus correction to iter-10 F55 arg names (F58). | settings-and-promotion-wiring | 0.55 | 5 | complete |
| 12 | F15 closure: 12-gate regression-category matrix + F37 #7 git-log archaeology | f15-closure | 0.65 | 14 | complete |
| 13 | F37 #7 delete-vs-wire decision memo for promotion subsystem | dead-code-disposition | 0.40 | 7 | complete |
| 14 | cross-packet preflight + delete plan actuation for promotion subsystem | delete-actuation | 0.50 | 8 | complete |
| 15 | build-config-validation + F40 vocabulary unification mapping | convergence-ratification + structural-refactor-mapping | 0.55 | 4 | complete |
| 16 | F43 instrumentation namespace design + library choice + synthesis validation | instrumentation | 0.60 | 5 | complete |
| 17 | F41 prompt-cache stale-after-rebuild race deep-dive (final deferred item) | prompt-cache-race-closure | 0.55 | 6 | complete |
| 18 | Unified remediation roadmap synthesis — 11-PR ranked plan with dependency graph + parallelism flags | synthesis-roadmap | 0.25 | 3 | complete |
| 19 | Per-PR rollback plan + monitoring criteria + revert SLO + implementation comms plan | risk-review | 0.30 | 3 | complete |
| 20 | AGENTS.md triad sync audit + final ship-readiness sign-off | final-audit | 0.55 | 6 | complete |

- iterationsCompleted: 20
- keyFindings: 589
- openQuestions: 10
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/10
- [ ] RQ-01: What AST edge types are currently missed by the code-graph detector? Where in the AST do edges get dropped, and what is the rate of edge loss per file/language?
- [ ] RQ-02: Does the skill-advisor scorer exhibit systematic bias toward certain lanes (bm25, phrase, embedding, graph-projection, semantic)? How well-calibrated is confidence against ground-truth labels?
- [ ] RQ-03: Are the four freshness states (live/stale/absent/fallback) invariant under concurrent writes, partial scans, and lock contention? What invariant violations exist?
- [ ] RQ-04: Is the 7-gate promotion bundle actually rigorous enough to block regressions? What categories of regressions slip through the two-consecutive-shadow-cycle rule?
- [ ] RQ-05: What is the scan throughput ceiling per language/file-size distribution? Where does incremental accuracy degrade (mtime-only vs content-hash)?
- [ ] RQ-06: What is the P50/P95/P99 query latency? What is the cache hit ratio across workspaceRoot + sourceSignature keys, and where do near-duplicate prompts miss?
- [ ] RQ-07: How consistent is stale-state messaging across the 4 tool surfaces (code_graph_status, code_graph_context, code_graph_query, startup brief)? Are there silent degraded-state paths?
- [ ] RQ-08: What is the signal-to-noise ratio of the advisor hook brief? Which fields are load-bearing vs decorative? What would minimal vs maximal briefs look like?
- [ ] RQ-09: Where are the benchmark coverage gaps? Is there an end-to-end benchmark for the code-graph → skill-advisor projection pipeline?
- [ ] RQ-10: What cross-runtime parity gaps exist (Claude, Codex, Gemini, Copilot, OpenCode plugin)? What extension points exist or are needed for multi-repo support?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.25 -> 0.30 -> 0.55
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.55
- coverageBySources: {"code":135,"memory":1,"other":147}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Not a flag/config issue for RQ-04 Cat A:** The per-lane-independent (iteration 3)
- **Not a single-source fix for RQ-07:** Because three of the five (iteration 3)
- None this iteration. Every action produced evidence. The one explicit (iteration 3)
- **Not a `.opencode/plugin/` issue:** The directory does not exist in (iteration 4)
- **Not a fix by adding more fields to the brief:** F21's maximal (iteration 4)
- **Not a fix via a runtime-branching macro in the library:** F24 (iteration 4)
- None this iteration. The dispatch hinted at `.opencode/skill/system-spec-kit/scripts/hooks/*.sh` — that directory does not exist either. Found the real path (`mcp_server/hooks/<runtime>/`) via `find` + `grep`. (iteration 4)
- **Empirical lane-ablation table this iteration**: blocked by F33 (corpus-path mismatch). Did not retry by copying the corpus into the legacy path because that would be a code mutation outside the research scope; instead recorded the wiring defect as a finding and resolved RQ-02 from static structure. (iteration 7)
- **Static-analysis-only confidence calibration**: tried, ruled out at F35 - confidence is rule-based but the only way to score calibration is empirical. (iteration 7)
- Treating `semantic_shadow` as a meaningful lane to ablate against top-1 accuracy: it is structurally a noop in the live scorer (`weights-config.ts:44-48`, `fusion.ts:223-230`). Any future ablation suite should treat it as raw-evidence-only and not include it in accuracy-delta assertions. (iteration 7)
- Trying to read query-latency percentiles from existing telemetry: confirmed in iter 6 F28 that the surface does not exist; no further iteration on this should look for it before instrumentation is added. (iteration 7)
- **Combining F37 #5 + #6 + #7 into one row:** considered (all are F15 promotion-bundle items). Kept separate because each maps to a distinct fix shape and a different sub-region of the closing benchmark. Combining would obscure the variance-metric vs L1/L2-norm vs cache-error-propagation distinction. (iteration 8)
- **Including iter-005 F23 (serial scan throughput) as a load-bearing defect:** ruled out. Serial scan is a perf characteristic with no correctness implication; a future spec can re-evaluate it as a perf phase, but it's not regression-protection-critical. Not in F37. (iteration 8)
- **Including iter-005 F26 (no per-language parser benchmark):** ruled out. Subsumed by F36 #1 (`bench/edge-precision-recall.bench.ts`) once that lands. (iteration 8)
- **Promoting F35 to P1:** considered but rejected. Calibration is a measurement gap, not a behavior bug, and the surgical remediation (F37 #11) is contingent on F33 (P0) landing first. P2 is correct severity. (iteration 8)
- **Trying to attribute INV-F5-V2 to a specific file:line:** iter-002 logged the invariant without a binding to a specific cache fan-out site. Re-reading iter-002 didn't surface the path. Recommend a future iteration grep the cache-invalidation surface to locate the consumer-fan-out gap concretely; this iteration treats it as a known-from-iter-2 invariant. (iteration 8)
- **Trying to derive an exact number-of-CI-checks-restored from F36 + F37:** the F36 benchmarks aren't currently CI-wired (only AC-4 is, and it's broken per F33). A precise "X checks restored" number isn't supportable until the wiring story is also surveyed. Not chasing. (iteration 8)
- **Hoping the legacy parity test would yield a 1-line fix:** ruled out by F46. The legacy file's surface area cannot reach the runtime-launcher; a new test file is the only correct shape. (iteration 9)
- **Patching `tests/legacy/advisor-runtime-parity.vitest.ts` to cover F23.1 wiring:** considered then rejected -- the file mocks `node:child_process` but does NOT mock the Claude Code hook-schema interpreter, which is where F23.1's bug actually resolves. A new file `tests/hooks/settings-driven-invocation-parity.vitest.ts` is the correct shape (F36 #1 already names it). (iteration 9)
- **Searching for a `generation` field in `prompt-cache.ts`:** zero hits. Iter-2 INV-F5-V2 should have been rebound to `sourceSignature` from the start; iter-9 fixes this by rebinding the invariant rather than chasing a phantom `generation` axis. (iteration 9)
- **Searching for code-graph imports in the scorer:** zero hits. The scorer/code-graph seam doesn't exist. Iter-6 F31 was a false cross-cutting connection. (iteration 9)
- **Treating `generation` as a real key axis:** `lib/prompt-cache.ts` has zero `generation` field. Iter-2's INV-F5-V2 wording was prescriptive (what should be), not descriptive (what is). Bind to `sourceSignature` instead. (iteration 9)
- **Treating iter-6 F31 as confirmed:** evidence chain in F48 falsifies it. The iter-6 grep that produced F31 must have inferred a connection that doesn't exist at the type/import level. (iteration 9)
- **Claiming F37 #7 must propagate to BOTH `rollbackPromotion` and `rollbackOnRegression`:** F55 evidence proves the latter is a 1-line wrapper, so the fix at `rollback.ts:48-51` covers both API surfaces. (iteration 10)
- **Hoping the F23.1 fix would mirror Gemini/Codex hook configs for parity:** F51 evidence (and earlier F46) prove there is no parallel `hooks` schema in `.gemini/settings.json`. The fix is Claude-only. The F46-recommended `tests/hooks/settings-driven-invocation-parity.vitest.ts` should drop the cross-runtime parity framing and assert ONLY against `.claude/settings.local.json`. (iteration 10)
- **Hypothesizing that vitest worker isolation rotates the HMAC secret:** F53 evidence proves the default vitest config preserves the secret per-file. Tests do not call `vi.resetModules()`. F50 is a real production invariant but does NOT manifest as test flakiness. (iteration 10)
- **Looking for `applyWeights` production callers:** like `invalidateCache`, `applyWeights` is also a callback parameter passed by `rollbackPromotion`'s caller. Since `rollbackPromotion` has no production caller, `applyWeights` also has no production binding. **The entire promotion subsystem is currently dead code outside tests.** (iteration 10)
- **Searching for a `handlers/promotion-orchestrate.ts` or similar:** confirmed it does not exist. The promotion subsystem has no production entry point. This is the F52 missing seam. (iteration 10)
- **Searching for a `vi.resetModules()` call in cache-hit assertion tests:** confirmed absent. F50 secret rotation does not manifest as test flakiness. (iteration 10)
- **Building `handlePromotionOrchestrate` as part of `handleAdvisorValidate`:** considered, rejected. `advisor-validate` is read-side; promotion is write-side. Separation of concerns matters for both testing and observability. (iteration 11)
- **Inlining `invalidateCache` as a caller-injected callback in F57:** considered, rejected. If callers can override the cache-invalidation callback, they can pass a no-op and silently skip cache invalidation on rollback. The handler binds `() => advisorPromptCache.clear()` internally to make this architectural commitment unskippable. (iteration 11)
- **Mocking Claude Code's hook-schema interpreter in the F56 test:** considered, ruled out. The interpreter is closed-source inside the Claude CLI binary; mocking its behavior would require re-implementing it in test infra. The cheaper, equally-valid contract is to **assert the JSON shape itself** (which is the input to that interpreter). F56 takes the JSON-shape route. (iteration 11)
- **Searching for inline-doc / TODO / FIXME wire-up intent in `lib/promotion/`:** zero hits. The 6-module subsystem has no documented intent for when/how it gets wired. F60 documents this as the "build-then-wire" pattern (not "speculative subsystem") based on the near-complete test coverage signal. (iteration 11)
- **Trying to derive a precise "X regression categories leak through" number for F15 in current state:** moot per F60 — current state has zero regression categories leaking through because the gates never run. The number is only meaningful in the post-F57 wired state. (iteration 11)
- **Hypothesis: F15 needs more leakage categories beyond Cat A/B/C.** Provisionally (iteration 12)
- **Hypothesis: gate-bundle is invoked from a sibling skill or top-level script (iteration 12)
- **Hypothesis: gate-bundle is wired via dynamic require/import or a string- (iteration 12)
- The "is the two-cycle rule wired into the gate bundle?" question definitively (iteration 12)
- "Wire-up is cheap because we already have the modules" framing — measured cost is (iteration 13)
- "Zero callers" framing from iter-10 F52 — partial truth, missed bench-layer (iteration 13)
- Removing `derived_tier` field — not actionable, field doesn't exist (F61). (iteration 13)
- Shadow-mode-by-default-forever — Option C without a hard cutover deadline (iteration 13)
- **"Just delete code, leave docs"** — Stale docs describing a non-existent subsystem are worse than no docs (iter-09 finding on docs decay). Docs scrub is non-optional for the same PR. (iteration 14)
- **"Keep schema for future re-introduction"** — YAGNI. If the subsystem returns it will need a re-design anyway (iter-13 reasoning). Keeping orphan schema costs maintenance and confuses readers. (iteration 14)
- **"Surgical delete keeping shadow-cycle + bench"** — F61 + iter-12 confirm shadow-cycle has no live caller and the gates around it are also dead code. Partial deletes leave dangling schema types and bench scripts that test nothing. (iteration 14)
- Behind-flag retention (eliminated in iter-13) (iteration 14)
- Cross-packet wiring (none exists; ruled out as a blocker for delete) (iteration 14)
- Re-implement-in-place strategies (already eliminated in iter-11/12) (iteration 14)
- **F41 INV-F5-V2 prompt-cache stale-after-rebuild deep-dive.** Deferred. The packet exists (`mcp_server/skill-advisor/lib/prompt-cache.ts`) but the question requires reading the cache key construction logic + the graph-scan trigger points — at least 2 file reads beyond the budget. Will fit better as a focused iter in a follow-up packet on cache invariants. (iteration 15)
- **F43 instrumentation namespace design.** Deferred. Would produce a metric-name catalog that is more useful AFTER the F40 unification lands (the metric names should reflect canonical vocabulary). Premature today. (iteration 15)
- **Re-running cross-packet preflight.** Iter-14 already produced PASSED preflight. No code changed since. Re-running would burn tool calls without new information. (iteration 15)
- None this iteration. Both tracks (build-config + F40) produced concrete deliverables. (iteration 15)
- **Adding `@opentelemetry/api` as a runtime dependency.** Rejected in F74. Operational cost > benefit for short-lived hook processes across 4 runtimes. (iteration 16)
- **Considered piggybacking on existing OpenCode `tracing` hooks.** Verified by structural inspection (no shared tracing module across runtimes). The four runtimes don't share a tracing primitive, so any cross-runtime metric must live in this skill's surface. Dead end ratified. (iteration 16)
- **Designing promotion metrics speculatively.** The promotion subsystem is on the iter-14 delete plan; designing metrics for code that's about to be deleted would invalidate immediately. Documented as a future-packet contingency only. (iteration 16)
- **Dotted on-disk metric names** (`spec_kit.advisor.score.lane_weighted`). Rejected because the existing `metrics.ts:101-132` uses `speckit_*` snake_case (Prometheus convention). Dotted names are kept as the **logical/documentation** namespace; the on-disk emission stays snake_case. Both forms map 1:1 in the catalog table. (iteration 16)
- **Cache key includes `generation`** — over-invalidates without correctness benefit (F82). (iteration 17)
- **Cross-process cache sharing** — per-process isolation is an intentional security/cost-benefit choice (F80). (iteration 17)
- **Mutex/lock between concurrent sessions** — sessions are disjoint processes; on-disk atomic rename handles cross-process consistency (F79). (iteration 17)
- **Pre-iteration hypothesis that `cache.get()` returns pre-scan answers when underlying graph has changed** — definitively eliminated by the freshness gating at `lib/freshness.ts:274-283` and by `invalidateSourceSignatureChange()` running at `skill-advisor-brief.ts:442` *before* every cache lookup. Promote to strategy.md "Exhausted Approaches" — do not re-investigate. (iteration 17)
- **The race characterization in dispatch context** ("during a scan, advisor sees OLD sourceSignature until generation is published") — falsified by `deriveFreshness()` requiring `generation.sourceSignature === snapshot.sourceSignature` for `live` (F77). (iteration 17)
- **Adding a docs-only PR for the doc scrub:** Folded into PR 3 per iter-14 BLOCKED reason ("Just delete code, leave docs" — stale docs about a non-existent subsystem are worse than no docs). (iteration 18)
- **Bundling PR 1 + PR 2 + PR 3 into a single "P0/P1 cleanup" PR:** Would tangle a 4-line wiring fix with a 1300-LOC delete sweep. Reviewer load + revert blast-radius too high. Kept separate. (iteration 18)
- **Including PR 11 (Option B) by default:** iter-13 F37-CLOSURE memo + iter-14 cross-packet preflight (zero callers) ratified Option A. Marking PR 11 as default would re-litigate a closed decision. (iteration 18)
- **Routing PR 6 (cache wireup) before PR 4 (state vocab):** cacheInvalidation event payload uses freshness state field; using non-canonical V1-V5 names would mean immediate re-patch after PR 4. Order kept. (iteration 18)
- **Treating F36 #1, #2, #3, #5, #6 as PRs in this roadmap:** Iter-7 F36 listed 8 missing benchmarks; only #4, #7, #8 are in scope here because they ride on the F43 metrics scaffold (PR 5). Benches #1 (graph-build correctness), #2 (edge-precision against golden), #3 (scorer-fusion stability), #5 (incremental scan accuracy), #6 (multi-language parity) are orthogonal benches not gated by PR 5; they belong to a separate "benchmark depth" packet. (iteration 18)
- **15-minute SLO for PR 3**: tempting because of blast radius, but operationally (iteration 19)
- **Database-migration revert plans**: NONE of the 10 PRs touch a database; all state is (iteration 19)
- **Per-PR feature flags as universal canary mechanism**: only PR 5 has emission surface (iteration 19)
- **Shadow-mode for PR 3**: deletion is binary; "shadow delete" is not a thing. (iteration 19)
- Re-validating sibling spec folder authority levels (spec.md vs research artifacts) — sampling one (002 spec.md = 10 hits, all local-domain) was sufficient to confirm classification. (iteration 20)
- Searching for indirect references via "advisor", "graph", "freshness" alone — too noisy, would dilute the audit. Stuck to specific subsystem identifiers per dispatch instructions. (iteration 20)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
N/A — this is iter 20/20. Loop transitions to Phase 3 synthesis.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
