---
title: Deep Research Strategy — Code Graph + Skill Advisor Refinement
description: Runtime state tracking for the 20-iteration deep-research session on code-graph and skill-advisor systems.
---

# Deep Research Strategy — Session Tracking

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Serves as the persistent brain for this deep research session. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- **Init:** Orchestrator populated Topic, Key Questions, Known Context, Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, machine-owned sections rewritten by reducer.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Code Graph System + Skill Advisor System refinement — investigate algorithm/correctness, performance, UX, observability, and evolution across both systems. Scoped by 10 research questions (RQ-01 through RQ-10) defined in `spec.md`:
- RQ-01 AST Edge Detection Gaps
- RQ-02 Scorer Lane Bias and Confidence Calibration
- RQ-03 Freshness Invariant Correctness
- RQ-04 Promotion Gate Rigor
- RQ-05 Scan Throughput and Incremental Accuracy
- RQ-06 Query Latency and Cache Hit Ratio
- RQ-07 Stale-State Messaging Consistency
- RQ-08 Hook Brief Signal-to-Noise
- RQ-09 Benchmark Coverage Gaps
- RQ-10 Cross-Runtime Parity and Extension Points

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
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

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Re-implementing or replacing either system from scratch
- Proposing alternative scoring algorithms without empirical evidence
- Making decisions requiring external stakeholder input (Anthropic pricing, infra)
- Expanding scope beyond code-graph and skill-advisor (e.g., smart-router, deep-research loop)

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 10 research questions answered with evidence AND actionable recommendations documented
- Convergence threshold (0.05) reached with rolling average + MAD noise floor + question-entropy vote
- Max iterations (20) reached regardless of convergence state
- Stuck threshold (3 consecutive no-progress iterations) triggers recovery branch
- Explicit user pause via `.deep-research-pause` sentinel

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Wire-up is cheap because we already have the modules" framing — measured cost is -- BLOCKED (iteration 13, 1 attempts)
- What was tried: "Wire-up is cheap because we already have the modules" framing — measured cost is
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Wire-up is cheap because we already have the modules" framing — measured cost is

### "Zero callers" framing from iter-10 F52 — partial truth, missed bench-layer -- BLOCKED (iteration 13, 1 attempts)
- What was tried: "Zero callers" framing from iter-10 F52 — partial truth, missed bench-layer
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Zero callers" framing from iter-10 F52 — partial truth, missed bench-layer

### **"Just delete code, leave docs"** — Stale docs describing a non-existent subsystem are worse than no docs (iter-09 finding on docs decay). Docs scrub is non-optional for the same PR. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **"Just delete code, leave docs"** — Stale docs describing a non-existent subsystem are worse than no docs (iter-09 finding on docs decay). Docs scrub is non-optional for the same PR.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Just delete code, leave docs"** — Stale docs describing a non-existent subsystem are worse than no docs (iter-09 finding on docs decay). Docs scrub is non-optional for the same PR.

### **"Keep schema for future re-introduction"** — YAGNI. If the subsystem returns it will need a re-design anyway (iter-13 reasoning). Keeping orphan schema costs maintenance and confuses readers. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **"Keep schema for future re-introduction"** — YAGNI. If the subsystem returns it will need a re-design anyway (iter-13 reasoning). Keeping orphan schema costs maintenance and confuses readers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Keep schema for future re-introduction"** — YAGNI. If the subsystem returns it will need a re-design anyway (iter-13 reasoning). Keeping orphan schema costs maintenance and confuses readers.

### **"Surgical delete keeping shadow-cycle + bench"** — F61 + iter-12 confirm shadow-cycle has no live caller and the gates around it are also dead code. Partial deletes leave dangling schema types and bench scripts that test nothing. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **"Surgical delete keeping shadow-cycle + bench"** — F61 + iter-12 confirm shadow-cycle has no live caller and the gates around it are also dead code. Partial deletes leave dangling schema types and bench scripts that test nothing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Surgical delete keeping shadow-cycle + bench"** — F61 + iter-12 confirm shadow-cycle has no live caller and the gates around it are also dead code. Partial deletes leave dangling schema types and bench scripts that test nothing.

### **15-minute SLO for PR 3**: tempting because of blast radius, but operationally -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **15-minute SLO for PR 3**: tempting because of blast radius, but operationally
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **15-minute SLO for PR 3**: tempting because of blast radius, but operationally

### **Adding `@opentelemetry/api` as a runtime dependency.** Rejected in F74. Operational cost > benefit for short-lived hook processes across 4 runtimes. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **Adding `@opentelemetry/api` as a runtime dependency.** Rejected in F74. Operational cost > benefit for short-lived hook processes across 4 runtimes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding `@opentelemetry/api` as a runtime dependency.** Rejected in F74. Operational cost > benefit for short-lived hook processes across 4 runtimes.

### **Adding a docs-only PR for the doc scrub:** Folded into PR 3 per iter-14 BLOCKED reason ("Just delete code, leave docs" — stale docs about a non-existent subsystem are worse than no docs). -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **Adding a docs-only PR for the doc scrub:** Folded into PR 3 per iter-14 BLOCKED reason ("Just delete code, leave docs" — stale docs about a non-existent subsystem are worse than no docs).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a docs-only PR for the doc scrub:** Folded into PR 3 per iter-14 BLOCKED reason ("Just delete code, leave docs" — stale docs about a non-existent subsystem are worse than no docs).

### **Building `handlePromotionOrchestrate` as part of `handleAdvisorValidate`:** considered, rejected. `advisor-validate` is read-side; promotion is write-side. Separation of concerns matters for both testing and observability. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Building `handlePromotionOrchestrate` as part of `handleAdvisorValidate`:** considered, rejected. `advisor-validate` is read-side; promotion is write-side. Separation of concerns matters for both testing and observability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Building `handlePromotionOrchestrate` as part of `handleAdvisorValidate`:** considered, rejected. `advisor-validate` is read-side; promotion is write-side. Separation of concerns matters for both testing and observability.

### **Bundling PR 1 + PR 2 + PR 3 into a single "P0/P1 cleanup" PR:** Would tangle a 4-line wiring fix with a 1300-LOC delete sweep. Reviewer load + revert blast-radius too high. Kept separate. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **Bundling PR 1 + PR 2 + PR 3 into a single "P0/P1 cleanup" PR:** Would tangle a 4-line wiring fix with a 1300-LOC delete sweep. Reviewer load + revert blast-radius too high. Kept separate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Bundling PR 1 + PR 2 + PR 3 into a single "P0/P1 cleanup" PR:** Would tangle a 4-line wiring fix with a 1300-LOC delete sweep. Reviewer load + revert blast-radius too high. Kept separate.

### **Cache key includes `generation`** — over-invalidates without correctness benefit (F82). -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **Cache key includes `generation`** — over-invalidates without correctness benefit (F82).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cache key includes `generation`** — over-invalidates without correctness benefit (F82).

### **Claiming F37 #7 must propagate to BOTH `rollbackPromotion` and `rollbackOnRegression`:** F55 evidence proves the latter is a 1-line wrapper, so the fix at `rollback.ts:48-51` covers both API surfaces. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Claiming F37 #7 must propagate to BOTH `rollbackPromotion` and `rollbackOnRegression`:** F55 evidence proves the latter is a 1-line wrapper, so the fix at `rollback.ts:48-51` covers both API surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claiming F37 #7 must propagate to BOTH `rollbackPromotion` and `rollbackOnRegression`:** F55 evidence proves the latter is a 1-line wrapper, so the fix at `rollback.ts:48-51` covers both API surfaces.

### **Combining F37 #5 + #6 + #7 into one row:** considered (all are F15 promotion-bundle items). Kept separate because each maps to a distinct fix shape and a different sub-region of the closing benchmark. Combining would obscure the variance-metric vs L1/L2-norm vs cache-error-propagation distinction. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Combining F37 #5 + #6 + #7 into one row:** considered (all are F15 promotion-bundle items). Kept separate because each maps to a distinct fix shape and a different sub-region of the closing benchmark. Combining would obscure the variance-metric vs L1/L2-norm vs cache-error-propagation distinction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Combining F37 #5 + #6 + #7 into one row:** considered (all are F15 promotion-bundle items). Kept separate because each maps to a distinct fix shape and a different sub-region of the closing benchmark. Combining would obscure the variance-metric vs L1/L2-norm vs cache-error-propagation distinction.

### **Considered piggybacking on existing OpenCode `tracing` hooks.** Verified by structural inspection (no shared tracing module across runtimes). The four runtimes don't share a tracing primitive, so any cross-runtime metric must live in this skill's surface. Dead end ratified. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **Considered piggybacking on existing OpenCode `tracing` hooks.** Verified by structural inspection (no shared tracing module across runtimes). The four runtimes don't share a tracing primitive, so any cross-runtime metric must live in this skill's surface. Dead end ratified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Considered piggybacking on existing OpenCode `tracing` hooks.** Verified by structural inspection (no shared tracing module across runtimes). The four runtimes don't share a tracing primitive, so any cross-runtime metric must live in this skill's surface. Dead end ratified.

### **Cross-process cache sharing** — per-process isolation is an intentional security/cost-benefit choice (F80). -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **Cross-process cache sharing** — per-process isolation is an intentional security/cost-benefit choice (F80).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cross-process cache sharing** — per-process isolation is an intentional security/cost-benefit choice (F80).

### **Database-migration revert plans**: NONE of the 10 PRs touch a database; all state is -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **Database-migration revert plans**: NONE of the 10 PRs touch a database; all state is
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Database-migration revert plans**: NONE of the 10 PRs touch a database; all state is

### **Designing promotion metrics speculatively.** The promotion subsystem is on the iter-14 delete plan; designing metrics for code that's about to be deleted would invalidate immediately. Documented as a future-packet contingency only. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **Designing promotion metrics speculatively.** The promotion subsystem is on the iter-14 delete plan; designing metrics for code that's about to be deleted would invalidate immediately. Documented as a future-packet contingency only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Designing promotion metrics speculatively.** The promotion subsystem is on the iter-14 delete plan; designing metrics for code that's about to be deleted would invalidate immediately. Documented as a future-packet contingency only.

### **Dotted on-disk metric names** (`spec_kit.advisor.score.lane_weighted`). Rejected because the existing `metrics.ts:101-132` uses `speckit_*` snake_case (Prometheus convention). Dotted names are kept as the **logical/documentation** namespace; the on-disk emission stays snake_case. Both forms map 1:1 in the catalog table. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **Dotted on-disk metric names** (`spec_kit.advisor.score.lane_weighted`). Rejected because the existing `metrics.ts:101-132` uses `speckit_*` snake_case (Prometheus convention). Dotted names are kept as the **logical/documentation** namespace; the on-disk emission stays snake_case. Both forms map 1:1 in the catalog table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Dotted on-disk metric names** (`spec_kit.advisor.score.lane_weighted`). Rejected because the existing `metrics.ts:101-132` uses `speckit_*` snake_case (Prometheus convention). Dotted names are kept as the **logical/documentation** namespace; the on-disk emission stays snake_case. Both forms map 1:1 in the catalog table.

### **Empirical lane-ablation table this iteration**: blocked by F33 (corpus-path mismatch). Did not retry by copying the corpus into the legacy path because that would be a code mutation outside the research scope; instead recorded the wiring defect as a finding and resolved RQ-02 from static structure. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Empirical lane-ablation table this iteration**: blocked by F33 (corpus-path mismatch). Did not retry by copying the corpus into the legacy path because that would be a code mutation outside the research scope; instead recorded the wiring defect as a finding and resolved RQ-02 from static structure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Empirical lane-ablation table this iteration**: blocked by F33 (corpus-path mismatch). Did not retry by copying the corpus into the legacy path because that would be a code mutation outside the research scope; instead recorded the wiring defect as a finding and resolved RQ-02 from static structure.

### **F41 INV-F5-V2 prompt-cache stale-after-rebuild deep-dive.** Deferred. The packet exists (`mcp_server/skill-advisor/lib/prompt-cache.ts`) but the question requires reading the cache key construction logic + the graph-scan trigger points — at least 2 file reads beyond the budget. Will fit better as a focused iter in a follow-up packet on cache invariants. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **F41 INV-F5-V2 prompt-cache stale-after-rebuild deep-dive.** Deferred. The packet exists (`mcp_server/skill-advisor/lib/prompt-cache.ts`) but the question requires reading the cache key construction logic + the graph-scan trigger points — at least 2 file reads beyond the budget. Will fit better as a focused iter in a follow-up packet on cache invariants.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **F41 INV-F5-V2 prompt-cache stale-after-rebuild deep-dive.** Deferred. The packet exists (`mcp_server/skill-advisor/lib/prompt-cache.ts`) but the question requires reading the cache key construction logic + the graph-scan trigger points — at least 2 file reads beyond the budget. Will fit better as a focused iter in a follow-up packet on cache invariants.

### **F43 instrumentation namespace design.** Deferred. Would produce a metric-name catalog that is more useful AFTER the F40 unification lands (the metric names should reflect canonical vocabulary). Premature today. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **F43 instrumentation namespace design.** Deferred. Would produce a metric-name catalog that is more useful AFTER the F40 unification lands (the metric names should reflect canonical vocabulary). Premature today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **F43 instrumentation namespace design.** Deferred. Would produce a metric-name catalog that is more useful AFTER the F40 unification lands (the metric names should reflect canonical vocabulary). Premature today.

### **Hoping the F23.1 fix would mirror Gemini/Codex hook configs for parity:** F51 evidence (and earlier F46) prove there is no parallel `hooks` schema in `.gemini/settings.json`. The fix is Claude-only. The F46-recommended `tests/hooks/settings-driven-invocation-parity.vitest.ts` should drop the cross-runtime parity framing and assert ONLY against `.claude/settings.local.json`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Hoping the F23.1 fix would mirror Gemini/Codex hook configs for parity:** F51 evidence (and earlier F46) prove there is no parallel `hooks` schema in `.gemini/settings.json`. The fix is Claude-only. The F46-recommended `tests/hooks/settings-driven-invocation-parity.vitest.ts` should drop the cross-runtime parity framing and assert ONLY against `.claude/settings.local.json`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping the F23.1 fix would mirror Gemini/Codex hook configs for parity:** F51 evidence (and earlier F46) prove there is no parallel `hooks` schema in `.gemini/settings.json`. The fix is Claude-only. The F46-recommended `tests/hooks/settings-driven-invocation-parity.vitest.ts` should drop the cross-runtime parity framing and assert ONLY against `.claude/settings.local.json`.

### **Hoping the legacy parity test would yield a 1-line fix:** ruled out by F46. The legacy file's surface area cannot reach the runtime-launcher; a new test file is the only correct shape. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Hoping the legacy parity test would yield a 1-line fix:** ruled out by F46. The legacy file's surface area cannot reach the runtime-launcher; a new test file is the only correct shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping the legacy parity test would yield a 1-line fix:** ruled out by F46. The legacy file's surface area cannot reach the runtime-launcher; a new test file is the only correct shape.

### **Hypothesis: F15 needs more leakage categories beyond Cat A/B/C.** Provisionally -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Hypothesis: F15 needs more leakage categories beyond Cat A/B/C.** Provisionally
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hypothesis: F15 needs more leakage categories beyond Cat A/B/C.** Provisionally

### **Hypothesis: gate-bundle is invoked from a sibling skill or top-level script -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Hypothesis: gate-bundle is invoked from a sibling skill or top-level script
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hypothesis: gate-bundle is invoked from a sibling skill or top-level script

### **Hypothesis: gate-bundle is wired via dynamic require/import or a string- -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Hypothesis: gate-bundle is wired via dynamic require/import or a string-
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hypothesis: gate-bundle is wired via dynamic require/import or a string-

### **Hypothesizing that vitest worker isolation rotates the HMAC secret:** F53 evidence proves the default vitest config preserves the secret per-file. Tests do not call `vi.resetModules()`. F50 is a real production invariant but does NOT manifest as test flakiness. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Hypothesizing that vitest worker isolation rotates the HMAC secret:** F53 evidence proves the default vitest config preserves the secret per-file. Tests do not call `vi.resetModules()`. F50 is a real production invariant but does NOT manifest as test flakiness.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hypothesizing that vitest worker isolation rotates the HMAC secret:** F53 evidence proves the default vitest config preserves the secret per-file. Tests do not call `vi.resetModules()`. F50 is a real production invariant but does NOT manifest as test flakiness.

### **Including iter-005 F23 (serial scan throughput) as a load-bearing defect:** ruled out. Serial scan is a perf characteristic with no correctness implication; a future spec can re-evaluate it as a perf phase, but it's not regression-protection-critical. Not in F37. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Including iter-005 F23 (serial scan throughput) as a load-bearing defect:** ruled out. Serial scan is a perf characteristic with no correctness implication; a future spec can re-evaluate it as a perf phase, but it's not regression-protection-critical. Not in F37.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Including iter-005 F23 (serial scan throughput) as a load-bearing defect:** ruled out. Serial scan is a perf characteristic with no correctness implication; a future spec can re-evaluate it as a perf phase, but it's not regression-protection-critical. Not in F37.

### **Including iter-005 F26 (no per-language parser benchmark):** ruled out. Subsumed by F36 #1 (`bench/edge-precision-recall.bench.ts`) once that lands. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Including iter-005 F26 (no per-language parser benchmark):** ruled out. Subsumed by F36 #1 (`bench/edge-precision-recall.bench.ts`) once that lands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Including iter-005 F26 (no per-language parser benchmark):** ruled out. Subsumed by F36 #1 (`bench/edge-precision-recall.bench.ts`) once that lands.

### **Including PR 11 (Option B) by default:** iter-13 F37-CLOSURE memo + iter-14 cross-packet preflight (zero callers) ratified Option A. Marking PR 11 as default would re-litigate a closed decision. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **Including PR 11 (Option B) by default:** iter-13 F37-CLOSURE memo + iter-14 cross-packet preflight (zero callers) ratified Option A. Marking PR 11 as default would re-litigate a closed decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Including PR 11 (Option B) by default:** iter-13 F37-CLOSURE memo + iter-14 cross-packet preflight (zero callers) ratified Option A. Marking PR 11 as default would re-litigate a closed decision.

### **Inlining `invalidateCache` as a caller-injected callback in F57:** considered, rejected. If callers can override the cache-invalidation callback, they can pass a no-op and silently skip cache invalidation on rollback. The handler binds `() => advisorPromptCache.clear()` internally to make this architectural commitment unskippable. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Inlining `invalidateCache` as a caller-injected callback in F57:** considered, rejected. If callers can override the cache-invalidation callback, they can pass a no-op and silently skip cache invalidation on rollback. The handler binds `() => advisorPromptCache.clear()` internally to make this architectural commitment unskippable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Inlining `invalidateCache` as a caller-injected callback in F57:** considered, rejected. If callers can override the cache-invalidation callback, they can pass a no-op and silently skip cache invalidation on rollback. The handler binds `() => advisorPromptCache.clear()` internally to make this architectural commitment unskippable.

### **Looking for `applyWeights` production callers:** like `invalidateCache`, `applyWeights` is also a callback parameter passed by `rollbackPromotion`'s caller. Since `rollbackPromotion` has no production caller, `applyWeights` also has no production binding. **The entire promotion subsystem is currently dead code outside tests.** -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Looking for `applyWeights` production callers:** like `invalidateCache`, `applyWeights` is also a callback parameter passed by `rollbackPromotion`'s caller. Since `rollbackPromotion` has no production caller, `applyWeights` also has no production binding. **The entire promotion subsystem is currently dead code outside tests.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for `applyWeights` production callers:** like `invalidateCache`, `applyWeights` is also a callback parameter passed by `rollbackPromotion`'s caller. Since `rollbackPromotion` has no production caller, `applyWeights` also has no production binding. **The entire promotion subsystem is currently dead code outside tests.**

### **Mocking Claude Code's hook-schema interpreter in the F56 test:** considered, ruled out. The interpreter is closed-source inside the Claude CLI binary; mocking its behavior would require re-implementing it in test infra. The cheaper, equally-valid contract is to **assert the JSON shape itself** (which is the input to that interpreter). F56 takes the JSON-shape route. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Mocking Claude Code's hook-schema interpreter in the F56 test:** considered, ruled out. The interpreter is closed-source inside the Claude CLI binary; mocking its behavior would require re-implementing it in test infra. The cheaper, equally-valid contract is to **assert the JSON shape itself** (which is the input to that interpreter). F56 takes the JSON-shape route.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Mocking Claude Code's hook-schema interpreter in the F56 test:** considered, ruled out. The interpreter is closed-source inside the Claude CLI binary; mocking its behavior would require re-implementing it in test infra. The cheaper, equally-valid contract is to **assert the JSON shape itself** (which is the input to that interpreter). F56 takes the JSON-shape route.

### **Mutex/lock between concurrent sessions** — sessions are disjoint processes; on-disk atomic rename handles cross-process consistency (F79). -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **Mutex/lock between concurrent sessions** — sessions are disjoint processes; on-disk atomic rename handles cross-process consistency (F79).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Mutex/lock between concurrent sessions** — sessions are disjoint processes; on-disk atomic rename handles cross-process consistency (F79).

### **Not a `.opencode/plugin/` issue:** The directory does not exist in -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Not a `.opencode/plugin/` issue:** The directory does not exist in
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Not a `.opencode/plugin/` issue:** The directory does not exist in

### **Not a fix by adding more fields to the brief:** F21's maximal -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Not a fix by adding more fields to the brief:** F21's maximal
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Not a fix by adding more fields to the brief:** F21's maximal

### **Not a fix via a runtime-branching macro in the library:** F24 -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Not a fix via a runtime-branching macro in the library:** F24
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Not a fix via a runtime-branching macro in the library:** F24

### **Not a flag/config issue for RQ-04 Cat A:** The per-lane-independent -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Not a flag/config issue for RQ-04 Cat A:** The per-lane-independent
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Not a flag/config issue for RQ-04 Cat A:** The per-lane-independent

### **Not a single-source fix for RQ-07:** Because three of the five -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Not a single-source fix for RQ-07:** Because three of the five
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Not a single-source fix for RQ-07:** Because three of the five

### **Patching `tests/legacy/advisor-runtime-parity.vitest.ts` to cover F23.1 wiring:** considered then rejected -- the file mocks `node:child_process` but does NOT mock the Claude Code hook-schema interpreter, which is where F23.1's bug actually resolves. A new file `tests/hooks/settings-driven-invocation-parity.vitest.ts` is the correct shape (F36 #1 already names it). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Patching `tests/legacy/advisor-runtime-parity.vitest.ts` to cover F23.1 wiring:** considered then rejected -- the file mocks `node:child_process` but does NOT mock the Claude Code hook-schema interpreter, which is where F23.1's bug actually resolves. A new file `tests/hooks/settings-driven-invocation-parity.vitest.ts` is the correct shape (F36 #1 already names it).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Patching `tests/legacy/advisor-runtime-parity.vitest.ts` to cover F23.1 wiring:** considered then rejected -- the file mocks `node:child_process` but does NOT mock the Claude Code hook-schema interpreter, which is where F23.1's bug actually resolves. A new file `tests/hooks/settings-driven-invocation-parity.vitest.ts` is the correct shape (F36 #1 already names it).

### **Per-PR feature flags as universal canary mechanism**: only PR 5 has emission surface -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **Per-PR feature flags as universal canary mechanism**: only PR 5 has emission surface
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Per-PR feature flags as universal canary mechanism**: only PR 5 has emission surface

### **Pre-iteration hypothesis that `cache.get()` returns pre-scan answers when underlying graph has changed** — definitively eliminated by the freshness gating at `lib/freshness.ts:274-283` and by `invalidateSourceSignatureChange()` running at `skill-advisor-brief.ts:442` *before* every cache lookup. Promote to strategy.md "Exhausted Approaches" — do not re-investigate. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **Pre-iteration hypothesis that `cache.get()` returns pre-scan answers when underlying graph has changed** — definitively eliminated by the freshness gating at `lib/freshness.ts:274-283` and by `invalidateSourceSignatureChange()` running at `skill-advisor-brief.ts:442` *before* every cache lookup. Promote to strategy.md "Exhausted Approaches" — do not re-investigate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pre-iteration hypothesis that `cache.get()` returns pre-scan answers when underlying graph has changed** — definitively eliminated by the freshness gating at `lib/freshness.ts:274-283` and by `invalidateSourceSignatureChange()` running at `skill-advisor-brief.ts:442` *before* every cache lookup. Promote to strategy.md "Exhausted Approaches" — do not re-investigate.

### **Promoting F35 to P1:** considered but rejected. Calibration is a measurement gap, not a behavior bug, and the surgical remediation (F37 #11) is contingent on F33 (P0) landing first. P2 is correct severity. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Promoting F35 to P1:** considered but rejected. Calibration is a measurement gap, not a behavior bug, and the surgical remediation (F37 #11) is contingent on F33 (P0) landing first. P2 is correct severity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Promoting F35 to P1:** considered but rejected. Calibration is a measurement gap, not a behavior bug, and the surgical remediation (F37 #11) is contingent on F33 (P0) landing first. P2 is correct severity.

### **Re-running cross-packet preflight.** Iter-14 already produced PASSED preflight. No code changed since. Re-running would burn tool calls without new information. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **Re-running cross-packet preflight.** Iter-14 already produced PASSED preflight. No code changed since. Re-running would burn tool calls without new information.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running cross-packet preflight.** Iter-14 already produced PASSED preflight. No code changed since. Re-running would burn tool calls without new information.

### **Routing PR 6 (cache wireup) before PR 4 (state vocab):** cacheInvalidation event payload uses freshness state field; using non-canonical V1-V5 names would mean immediate re-patch after PR 4. Order kept. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **Routing PR 6 (cache wireup) before PR 4 (state vocab):** cacheInvalidation event payload uses freshness state field; using non-canonical V1-V5 names would mean immediate re-patch after PR 4. Order kept.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Routing PR 6 (cache wireup) before PR 4 (state vocab):** cacheInvalidation event payload uses freshness state field; using non-canonical V1-V5 names would mean immediate re-patch after PR 4. Order kept.

### **Searching for a `generation` field in `prompt-cache.ts`:** zero hits. Iter-2 INV-F5-V2 should have been rebound to `sourceSignature` from the start; iter-9 fixes this by rebinding the invariant rather than chasing a phantom `generation` axis. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Searching for a `generation` field in `prompt-cache.ts`:** zero hits. Iter-2 INV-F5-V2 should have been rebound to `sourceSignature` from the start; iter-9 fixes this by rebinding the invariant rather than chasing a phantom `generation` axis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for a `generation` field in `prompt-cache.ts`:** zero hits. Iter-2 INV-F5-V2 should have been rebound to `sourceSignature` from the start; iter-9 fixes this by rebinding the invariant rather than chasing a phantom `generation` axis.

### **Searching for a `handlers/promotion-orchestrate.ts` or similar:** confirmed it does not exist. The promotion subsystem has no production entry point. This is the F52 missing seam. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Searching for a `handlers/promotion-orchestrate.ts` or similar:** confirmed it does not exist. The promotion subsystem has no production entry point. This is the F52 missing seam.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for a `handlers/promotion-orchestrate.ts` or similar:** confirmed it does not exist. The promotion subsystem has no production entry point. This is the F52 missing seam.

### **Searching for a `vi.resetModules()` call in cache-hit assertion tests:** confirmed absent. F50 secret rotation does not manifest as test flakiness. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Searching for a `vi.resetModules()` call in cache-hit assertion tests:** confirmed absent. F50 secret rotation does not manifest as test flakiness.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for a `vi.resetModules()` call in cache-hit assertion tests:** confirmed absent. F50 secret rotation does not manifest as test flakiness.

### **Searching for code-graph imports in the scorer:** zero hits. The scorer/code-graph seam doesn't exist. Iter-6 F31 was a false cross-cutting connection. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Searching for code-graph imports in the scorer:** zero hits. The scorer/code-graph seam doesn't exist. Iter-6 F31 was a false cross-cutting connection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for code-graph imports in the scorer:** zero hits. The scorer/code-graph seam doesn't exist. Iter-6 F31 was a false cross-cutting connection.

### **Searching for inline-doc / TODO / FIXME wire-up intent in `lib/promotion/`:** zero hits. The 6-module subsystem has no documented intent for when/how it gets wired. F60 documents this as the "build-then-wire" pattern (not "speculative subsystem") based on the near-complete test coverage signal. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Searching for inline-doc / TODO / FIXME wire-up intent in `lib/promotion/`:** zero hits. The 6-module subsystem has no documented intent for when/how it gets wired. F60 documents this as the "build-then-wire" pattern (not "speculative subsystem") based on the near-complete test coverage signal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for inline-doc / TODO / FIXME wire-up intent in `lib/promotion/`:** zero hits. The 6-module subsystem has no documented intent for when/how it gets wired. F60 documents this as the "build-then-wire" pattern (not "speculative subsystem") based on the near-complete test coverage signal.

### **Shadow-mode for PR 3**: deletion is binary; "shadow delete" is not a thing. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **Shadow-mode for PR 3**: deletion is binary; "shadow delete" is not a thing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shadow-mode for PR 3**: deletion is binary; "shadow delete" is not a thing.

### **Static-analysis-only confidence calibration**: tried, ruled out at F35 - confidence is rule-based but the only way to score calibration is empirical. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Static-analysis-only confidence calibration**: tried, ruled out at F35 - confidence is rule-based but the only way to score calibration is empirical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Static-analysis-only confidence calibration**: tried, ruled out at F35 - confidence is rule-based but the only way to score calibration is empirical.

### **The race characterization in dispatch context** ("during a scan, advisor sees OLD sourceSignature until generation is published") — falsified by `deriveFreshness()` requiring `generation.sourceSignature === snapshot.sourceSignature` for `live` (F77). -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **The race characterization in dispatch context** ("during a scan, advisor sees OLD sourceSignature until generation is published") — falsified by `deriveFreshness()` requiring `generation.sourceSignature === snapshot.sourceSignature` for `live` (F77).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The race characterization in dispatch context** ("during a scan, advisor sees OLD sourceSignature until generation is published") — falsified by `deriveFreshness()` requiring `generation.sourceSignature === snapshot.sourceSignature` for `live` (F77).

### **Treating `generation` as a real key axis:** `lib/prompt-cache.ts` has zero `generation` field. Iter-2's INV-F5-V2 wording was prescriptive (what should be), not descriptive (what is). Bind to `sourceSignature` instead. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Treating `generation` as a real key axis:** `lib/prompt-cache.ts` has zero `generation` field. Iter-2's INV-F5-V2 wording was prescriptive (what should be), not descriptive (what is). Bind to `sourceSignature` instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `generation` as a real key axis:** `lib/prompt-cache.ts` has zero `generation` field. Iter-2's INV-F5-V2 wording was prescriptive (what should be), not descriptive (what is). Bind to `sourceSignature` instead.

### **Treating F36 #1, #2, #3, #5, #6 as PRs in this roadmap:** Iter-7 F36 listed 8 missing benchmarks; only #4, #7, #8 are in scope here because they ride on the F43 metrics scaffold (PR 5). Benches #1 (graph-build correctness), #2 (edge-precision against golden), #3 (scorer-fusion stability), #5 (incremental scan accuracy), #6 (multi-language parity) are orthogonal benches not gated by PR 5; they belong to a separate "benchmark depth" packet. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **Treating F36 #1, #2, #3, #5, #6 as PRs in this roadmap:** Iter-7 F36 listed 8 missing benchmarks; only #4, #7, #8 are in scope here because they ride on the F43 metrics scaffold (PR 5). Benches #1 (graph-build correctness), #2 (edge-precision against golden), #3 (scorer-fusion stability), #5 (incremental scan accuracy), #6 (multi-language parity) are orthogonal benches not gated by PR 5; they belong to a separate "benchmark depth" packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating F36 #1, #2, #3, #5, #6 as PRs in this roadmap:** Iter-7 F36 listed 8 missing benchmarks; only #4, #7, #8 are in scope here because they ride on the F43 metrics scaffold (PR 5). Benches #1 (graph-build correctness), #2 (edge-precision against golden), #3 (scorer-fusion stability), #5 (incremental scan accuracy), #6 (multi-language parity) are orthogonal benches not gated by PR 5; they belong to a separate "benchmark depth" packet.

### **Treating iter-6 F31 as confirmed:** evidence chain in F48 falsifies it. The iter-6 grep that produced F31 must have inferred a connection that doesn't exist at the type/import level. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Treating iter-6 F31 as confirmed:** evidence chain in F48 falsifies it. The iter-6 grep that produced F31 must have inferred a connection that doesn't exist at the type/import level.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating iter-6 F31 as confirmed:** evidence chain in F48 falsifies it. The iter-6 grep that produced F31 must have inferred a connection that doesn't exist at the type/import level.

### **Trying to attribute INV-F5-V2 to a specific file:line:** iter-002 logged the invariant without a binding to a specific cache fan-out site. Re-reading iter-002 didn't surface the path. Recommend a future iteration grep the cache-invalidation surface to locate the consumer-fan-out gap concretely; this iteration treats it as a known-from-iter-2 invariant. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Trying to attribute INV-F5-V2 to a specific file:line:** iter-002 logged the invariant without a binding to a specific cache fan-out site. Re-reading iter-002 didn't surface the path. Recommend a future iteration grep the cache-invalidation surface to locate the consumer-fan-out gap concretely; this iteration treats it as a known-from-iter-2 invariant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Trying to attribute INV-F5-V2 to a specific file:line:** iter-002 logged the invariant without a binding to a specific cache fan-out site. Re-reading iter-002 didn't surface the path. Recommend a future iteration grep the cache-invalidation surface to locate the consumer-fan-out gap concretely; this iteration treats it as a known-from-iter-2 invariant.

### **Trying to derive a precise "X regression categories leak through" number for F15 in current state:** moot per F60 — current state has zero regression categories leaking through because the gates never run. The number is only meaningful in the post-F57 wired state. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Trying to derive a precise "X regression categories leak through" number for F15 in current state:** moot per F60 — current state has zero regression categories leaking through because the gates never run. The number is only meaningful in the post-F57 wired state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Trying to derive a precise "X regression categories leak through" number for F15 in current state:** moot per F60 — current state has zero regression categories leaking through because the gates never run. The number is only meaningful in the post-F57 wired state.

### **Trying to derive an exact number-of-CI-checks-restored from F36 + F37:** the F36 benchmarks aren't currently CI-wired (only AC-4 is, and it's broken per F33). A precise "X checks restored" number isn't supportable until the wiring story is also surveyed. Not chasing. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Trying to derive an exact number-of-CI-checks-restored from F36 + F37:** the F36 benchmarks aren't currently CI-wired (only AC-4 is, and it's broken per F33). A precise "X checks restored" number isn't supportable until the wiring story is also surveyed. Not chasing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Trying to derive an exact number-of-CI-checks-restored from F36 + F37:** the F36 benchmarks aren't currently CI-wired (only AC-4 is, and it's broken per F33). A precise "X checks restored" number isn't supportable until the wiring story is also surveyed. Not chasing.

### Behind-flag retention (eliminated in iter-13) -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Behind-flag retention (eliminated in iter-13)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Behind-flag retention (eliminated in iter-13)

### Cross-packet wiring (none exists; ruled out as a blocker for delete) -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Cross-packet wiring (none exists; ruled out as a blocker for delete)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-packet wiring (none exists; ruled out as a blocker for delete)

### None this iteration. Both tracks (build-config + F40) produced concrete deliverables. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: None this iteration. Both tracks (build-config + F40) produced concrete deliverables.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. Both tracks (build-config + F40) produced concrete deliverables.

### None this iteration. Every action produced evidence. The one explicit -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None this iteration. Every action produced evidence. The one explicit
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. Every action produced evidence. The one explicit

### None this iteration. The dispatch hinted at `.opencode/skill/system-spec-kit/scripts/hooks/*.sh` — that directory does not exist either. Found the real path (`mcp_server/hooks/<runtime>/`) via `find` + `grep`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None this iteration. The dispatch hinted at `.opencode/skill/system-spec-kit/scripts/hooks/*.sh` — that directory does not exist either. Found the real path (`mcp_server/hooks/<runtime>/`) via `find` + `grep`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. The dispatch hinted at `.opencode/skill/system-spec-kit/scripts/hooks/*.sh` — that directory does not exist either. Found the real path (`mcp_server/hooks/<runtime>/`) via `find` + `grep`.

### Re-implement-in-place strategies (already eliminated in iter-11/12) -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Re-implement-in-place strategies (already eliminated in iter-11/12)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-implement-in-place strategies (already eliminated in iter-11/12)

### Re-validating sibling spec folder authority levels (spec.md vs research artifacts) — sampling one (002 spec.md = 10 hits, all local-domain) was sufficient to confirm classification. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Re-validating sibling spec folder authority levels (spec.md vs research artifacts) — sampling one (002 spec.md = 10 hits, all local-domain) was sufficient to confirm classification.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-validating sibling spec folder authority levels (spec.md vs research artifacts) — sampling one (002 spec.md = 10 hits, all local-domain) was sufficient to confirm classification.

### Removing `derived_tier` field — not actionable, field doesn't exist (F61). -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Removing `derived_tier` field — not actionable, field doesn't exist (F61).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing `derived_tier` field — not actionable, field doesn't exist (F61).

### Searching for indirect references via "advisor", "graph", "freshness" alone — too noisy, would dilute the audit. Stuck to specific subsystem identifiers per dispatch instructions. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Searching for indirect references via "advisor", "graph", "freshness" alone — too noisy, would dilute the audit. Stuck to specific subsystem identifiers per dispatch instructions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for indirect references via "advisor", "graph", "freshness" alone — too noisy, would dilute the audit. Stuck to specific subsystem identifiers per dispatch instructions.

### Shadow-mode-by-default-forever — Option C without a hard cutover deadline -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Shadow-mode-by-default-forever — Option C without a hard cutover deadline
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shadow-mode-by-default-forever — Option C without a hard cutover deadline

### The "is the two-cycle rule wired into the gate bundle?" question definitively -- BLOCKED (iteration 12, 1 attempts)
- What was tried: The "is the two-cycle rule wired into the gate bundle?" question definitively
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The "is the two-cycle rule wired into the gate bundle?" question definitively

### Treating `semantic_shadow` as a meaningful lane to ablate against top-1 accuracy: it is structurally a noop in the live scorer (`weights-config.ts:44-48`, `fusion.ts:223-230`). Any future ablation suite should treat it as raw-evidence-only and not include it in accuracy-delta assertions. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating `semantic_shadow` as a meaningful lane to ablate against top-1 accuracy: it is structurally a noop in the live scorer (`weights-config.ts:44-48`, `fusion.ts:223-230`). Any future ablation suite should treat it as raw-evidence-only and not include it in accuracy-delta assertions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `semantic_shadow` as a meaningful lane to ablate against top-1 accuracy: it is structurally a noop in the live scorer (`weights-config.ts:44-48`, `fusion.ts:223-230`). Any future ablation suite should treat it as raw-evidence-only and not include it in accuracy-delta assertions.

### Trying to read query-latency percentiles from existing telemetry: confirmed in iter 6 F28 that the surface does not exist; no further iteration on this should look for it before instrumentation is added. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Trying to read query-latency percentiles from existing telemetry: confirmed in iter 6 F28 that the surface does not exist; no further iteration on this should look for it before instrumentation is added.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to read query-latency percentiles from existing telemetry: confirmed in iter 6 F28 that the surface does not exist; no further iteration on this should look for it before instrumentation is added.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
N/A — this is iter 20/20. Loop transitions to Phase 3 synthesis.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Prior work (from memory_context + code graph startup snapshot)

- Code graph currently indexes 1,428 files, 52,431 nodes, 30,451 edges across the repo. Detector: AST (tree-sitter + regex fallback). Edge-enrichment: direct_call (1.00 coverage).
- Highlighted high-call-count nodes from startup brief: `isString` (21 calls across nodejs/react/react-native validation_patterns), `getDb` (18 calls in code-graph-db, 17 in coverage-graph-db).
- Spec packet `026-graph-and-context-optimization/` contains sibling packets `003-code-graph-package/`, `006-search-routing-advisor/`, `009-hook-package/` with prior findings on code-graph scan-scope, search-routing tuning, skill-advisor hook surface — review these for lessons learned.
- Skill-advisor scorer has a shadow-only semantic lane (weight 0.00) per recon; full-corpus accuracy 80.5%, holdout 77.5%, 7-gate promotion bundle with two consecutive shadow cycle requirement.
- Freshness state machine in `lib/freshness.ts` has four states (live/stale/absent/fallback) plus prompt-cache keyed on workspaceRoot + sourceSignature.

### Resource map

resource-map.md not present at `{spec_folder}/resource-map.md`; skipping coverage gate for this session. Reducer will emit `{artifact_dir}/resource-map.md` at convergence.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7–11
- Canonical pause sentinel: `research/015-code-graph-advisor-refinement-pt-01/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Current generation: 1
- Started: 2026-04-24T19:52:59.013Z
<!-- /ANCHOR:research-boundaries -->
