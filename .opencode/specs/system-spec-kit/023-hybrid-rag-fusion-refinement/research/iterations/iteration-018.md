# Iteration 18: Comprehensive Implementation Roadmap Synthesis

## Focus
Compile all findings from iterations 1-17 into a comprehensive implementation roadmap with prioritized backlog, dependency graph, phased execution plan, risk assessment, and test impact. This is a synthesis/thought iteration -- no new external evidence gathering, consolidating 17 iterations of research into an actionable plan.

## Findings

### 1. Complete Backlog Inventory (19 Items)

Across 17 iterations, 19 distinct work items were identified. After triage, 14 are actionable and 5 are closed:

**Actionable (14 items, ~19-23 hours total):**

| ID | Item | Priority | Effort | Status |
|----|------|----------|--------|--------|
| P1-3 | Recency fusion signal in Stage 2 | P1 | ~2h | DESIGNED (iter 11) |
| P1-4 | GRAPH_WEIGHT_CAP 0.05 -> 0.15 | P1 | ~30min | DESIGNED (iter 12) |
| DEF-1 | Enable RECONSOLIDATION by default | P1 | ~1h | DESIGNED (iter 11) |
| DEF-2 | Enable QUALITY_LOOP by default | P1 | ~30min | DESIGNED (iter 11) |
| P2-4 | Proportional doc-type weight shift | P2 | ~30min | DESIGNED (iter 8) |
| UX-1 | Intent-to-profile auto-routing | P2 | ~1h | DESIGNED (iter 17) |
| UX-2 | Attention-enriched auto-surface hints | P2 | ~30min | DESIGNED (iter 17) |
| CACHE-1 | Cross-encoder cache size limit | P2 | ~30min | DESIGNED (iter 15) |
| CLEAN-1 | NOVELTY_BOOST dead code cleanup | P3 | ~30min | SCOPED (iter 12) |
| CLEAN-2 | hasTriggerMatch word-boundary alignment | P3 | ~15min | SCOPED (iter 8) |
| INFRA-1 | Embedding API circuit breaker | P3 | ~2h | IDENTIFIED (iter 14) |
| INFRA-2 | Env var documentation (113 vars) | P3 | ~4-6h | CATALOGED (iter 15) |
| UX-3 | Spec neighborhood auto-loading | P3 | ~4-6h | ASSESSED (iter 17) |
| CACHE-2 | co-activation + tool-cache bounds | P3 | ~30min | IDENTIFIED (iter 15) |

**Closed (5 items, no action):**
- P1-2: Constitutional cap (already well-designed, 5 guards)
- P2-1/P2-2/P2-3: Working as designed (cursor pagination, goal tracking, ephemeral by design)
- P2-5: Already sophisticated (trigger matcher Unicode boundary regex)
- P2-6: Structurally impossible (3-layer NaN defense)
- hasTriggerMatch inconsistency: Different purposes by design

[SOURCE: strategy.md sections 6, 11 -- consolidated from iterations 1-17]

### 2. Dependency Graph

```
                    +-----------+
                    | DEF-1     |     +-----------+
                    | RECON     |---->| DEF-2     |
                    | default   |     | QUALITY   |
                    +-----------+     | default   |
                         |            +-----------+
                         |                 |
                         v                 v
                    +-----------+    +-----------+
                    | Test      |    | Test      |
                    | updates   |    | updates   |
                    | (3+ asrt) |    | (verify)  |
                    +-----------+    +-----------+

+-----------+    +-----------+    +-----------+
| P1-3      |    | P1-4      |    | P2-4      |
| Recency   |    | GRAPH_CAP |    | Doc-type  |
| fusion    |    | raise     |    | prop.shift|
+-----------+    +-----------+    +-----------+
     |                |                |
     v                v                v
+-----------+    +-----------+    +-----------+
| NEW test  |    | NEW test  |    | NEW test  |
| stage2    |    | graph-cal |    | adaptive  |
+-----------+    +-----------+    +-----------+

+-----------+    +-----------+    +-----------+
| UX-1      |--->| UX-2      |    | CACHE-1   |
| Intent-   |    | Attention |    | XEncoder  |
| profile   |    | hints     |    | cache cap |
+-----------+    +-----------+    +-----------+

+-----------+    +-----------+    +-----------+
| CLEAN-1   |    | INFRA-1   |    | INFRA-2   |
| NOVELTY   |    | Embed CB  |    | Env docs  |
| cleanup   |    |           |    | (113 vars)|
+-----------+    +-----------+    +-----------+
```

**Dependency relationships:**
- DEF-1 (RECONSOLIDATION) and DEF-2 (QUALITY_LOOP) are independent but share a test update pattern; doing them together reduces context-switching cost.
- P1-3 (recency), P1-4 (GRAPH_CAP), and P2-4 (doc-type shift) are all Stage 2 fusion changes -- they can be batched into one PR to minimize merge conflicts in `stage2-fusion.ts` and `adaptive-fusion.ts`.
- UX-1 (intent-to-profile) should precede UX-2 (attention hints) because UX-2's auto-surface optimization benefits from having profiles already auto-selected.
- CLEAN-1 (NOVELTY_BOOST) is independent of all other items.
- CACHE-1 (cross-encoder) and CACHE-2 (co-activation/tool-cache) are independent.
- INFRA-1 (embedding circuit breaker) and INFRA-2 (env var docs) are independent.
- UX-3 (spec neighborhoods) has no dependencies but requires the most design work.

[INFERENCE: based on code location analysis from iterations 5, 7, 8, 11, 12, 15, 17 showing which items touch the same files]

### 3. Phased Execution Plan

#### Phase A: Feature Defaults (2 items, ~1.5h, 0 risk)
**Goal**: Activate already-built features that are currently opt-in without justification.

| Item | File Changes | Test Changes | Risk |
|------|-------------|-------------|------|
| DEF-1: RECONSOLIDATION default | `search-flags.ts` (change gating), `reconsolidation-bridge.ts` (auto-checkpoint) | UPDATE 3+ assertions in `search-flags.vitest.ts`, 3 in `reconsolidation.vitest.ts` | LOW -- assistive variant already ON; auto-checkpoint guard prevents data loss |
| DEF-2: QUALITY_LOOP default | `search-flags.ts` (change gating) | VERIFY `memory-save-ux-regressions.vitest.ts` | VERY LOW -- pure algorithmic, bounded (max 2 retries) |

**Why first**: These are the lowest-risk, highest-certainty changes. Enabling features already built and tested. Breaking test assertions are known and enumerated.

#### Phase B: Fusion Pipeline Refinements (3 items, ~3h, low-medium risk)
**Goal**: Improve search result quality through tuned scoring signals.

| Item | File Changes | Test Changes | Risk |
|------|-------------|-------------|------|
| P1-3: Recency fusion | `stage2-fusion.ts` (new step 1a, ~40 lines) | NEW 3-4 tests in `stage2-fusion.vitest.ts` | LOW -- additive bonus capped at 0.10, env-tunable, existing computeRecencyScore reused |
| P1-4: GRAPH_WEIGHT_CAP raise | `graph-calibration.ts:25` (constant change) | NEW 1-2 tests for aggregate cap | VERY LOW -- per-mechanism caps (0.03, 0.05) remain as inner guards |
| P2-4: Doc-type proportional shift | `adaptive-fusion.ts:82-83` (~10 lines) | NEW 2-3 tests for proportional behavior | LOW -- change is mathematically well-defined (20% of base weight) |

**Why together**: All three touch the fusion pipeline's scoring logic. A single PR minimizes merge conflicts and allows holistic validation of score distribution changes. Combined, these represent the highest-impact quality improvements identified.

**Recommended PR order within phase**: P1-4 (smallest, most isolated) -> P2-4 (small, different file) -> P1-3 (largest, new code path). Or batch all three in one PR.

#### Phase C: UX Optimization (2-3 items, ~1.5-2h, low risk)
**Goal**: Improve auto-utilization and response quality without hooks.

| Item | File Changes | Test Changes | Risk |
|------|-------------|-------------|------|
| UX-1: Intent-to-profile routing | `memory-search.ts` (~30 lines), `memory-context.ts` (~15 lines), mapping constant | NEW ~40 lines of tests | VERY LOW -- explicit profile param overrides, env var kill-switch |
| UX-2: Attention-enriched hints | `memory-surface.ts` (~20 lines) | NEW 2-3 tests | LOW -- additive 1.3x multiplier, only affects auto-surface ranking |
| CACHE-1: Cross-encoder cache limit | `cross-encoder.ts` (~15 lines) | NEW 1-2 tests | VERY LOW -- applies proven enforceCacheBound() pattern |

**Why after Phase B**: Profiles are format changes (response shape), while Phase B is scoring changes (result order). Keeping them separate makes rollback simpler if either causes issues.

#### Phase D: Cleanup and Hygiene (2 items, ~45min, zero risk)
**Goal**: Remove dead code and close minor gaps.

| Item | File Changes | Test Changes | Risk |
|------|-------------|-------------|------|
| CLEAN-1: NOVELTY_BOOST removal | `composite-scoring.ts` (~15 lines remove), `search-flags.ts` (env var) | REMOVE ~200 lines from `cold-start.vitest.ts` | ZERO -- code is permanently inert (always returns 0) |
| CLEAN-2: hasTriggerMatch word-boundary | `query-classifier.ts:82-86` (~5 lines) | OPTIONAL | VERY LOW -- only affects query complexity classification, not retrieval |
| CACHE-2: co-activation + tool-cache bounds | `co-activation.ts:80`, `tool-cache.ts:67` | NEW 1-2 tests | VERY LOW -- proven pattern |

**Why last among early phases**: Cleanup has no user-visible benefit. It reduces tech debt and improves maintainability but does not change behavior.

#### Phase E: Infrastructure (2-3 items, ~7-10h, low-medium risk)
**Goal**: Address longer-term operational gaps.

| Item | File Changes | Test Changes | Risk |
|------|-------------|-------------|------|
| INFRA-1: Embedding circuit breaker | `vector-index-store.ts` or embedding factory (~50-80 lines) | NEW integration tests | MEDIUM -- circuit breaker state management, timeout calibration, degraded-mode UX |
| INFRA-2: Env var documentation | Documentation only (~4-6 hours) | N/A | ZERO -- no code changes |
| UX-3: Spec neighborhood auto-loading | `memory-context.ts` + new module (~200-300 lines) | NEW tests | MEDIUM -- new feature, requires causal graph aggregation at spec level |

**Why last**: These are the largest items with the least immediate impact. Env var docs are important but purely informational. The embedding circuit breaker is a resilience improvement for degraded-network scenarios. Spec neighborhoods is the most ambitious item and requires additional design work.

[INFERENCE: phasing derived from dependency analysis, risk assessment, and effort-to-impact ratio across all iterations]

### 4. Risk Assessment Matrix

| Item | Implementation Risk | Regression Risk | Rollback Difficulty | Mitigation |
|------|-------------------|-----------------|---------------------|------------|
| DEF-1 | LOW | MEDIUM (3+ test assertions break) | EASY (env var override) | Auto-checkpoint creation prevents data loss |
| DEF-2 | VERY LOW | LOW (verify 1 test file) | EASY (env var override) | Already bounded (max 2 retries) |
| P1-3 | LOW | LOW (new code, no existing paths changed) | EASY (env var 0 disables) | Additive bonus, capped at 0.10 |
| P1-4 | VERY LOW | LOW (constant change, inner caps remain) | EASY (env var override) | Per-mechanism caps are inner guards |
| P2-4 | LOW | LOW (math change in weight normalization) | EASY (revert to flat 0.1) | Still normalizes to sum=1.0 |
| UX-1 | LOW | VERY LOW (opt-out via env var + explicit override) | EASY (env var false) | Profile is format-only, not scoring |
| UX-2 | LOW | VERY LOW (multiplier in auto-surface only) | EASY (remove boost line) | Auto-surface is advisory, not search core |
| CACHE-1 | VERY LOW | VERY LOW (proven pattern) | EASY (remove bound) | Uses existing enforceCacheBound() |
| CLEAN-1 | ZERO | ZERO (dead code removal) | EASY (re-add if needed) | Code always returns 0 already |
| INFRA-1 | MEDIUM | LOW (new resilience layer) | MEDIUM (state management) | Mirror cross-encoder circuit breaker pattern |
| UX-3 | MEDIUM | LOW (new feature) | EASY (feature flag) | New module, no existing code modification |

**Overall risk profile**: The first 4 phases (A-D) carry consistently LOW-to-ZERO risk with EASY rollback via env vars. Phase E items have MEDIUM implementation risk due to new code paths.

[INFERENCE: based on rollback mechanism analysis from iterations 1 (env var gating), 11 (design specifications), and 12 (cap architecture)]

### 5. Total Effort Estimate

| Phase | Items | Est. Code Hours | Est. Test Hours | Total |
|-------|-------|----------------|----------------|-------|
| A: Feature Defaults | 2 | 1.0h | 0.5h | 1.5h |
| B: Fusion Refinements | 3 | 2.0h | 1.0h | 3.0h |
| C: UX Optimization | 3 | 1.5h | 0.5h | 2.0h |
| D: Cleanup | 3 | 0.5h | 0.25h | 0.75h |
| E: Infrastructure | 2-3 | 7.0-12.0h | 1.0-2.0h | 8.0-14.0h |
| **Total** | **13-14** | **12.0-17.0h** | **3.25-4.25h** | **~15.25-21.25h** |

**Phases A-D** (the actionable, well-designed items): **~7.25 hours** total
**Phase E** (infrastructure, longer-term): **~8-14 hours** additional

[INFERENCE: effort estimates aggregated from per-item estimates in iterations 8, 11, 12, 14, 15, 17]

### 6. Recommended Implementation Order

**Sprint 1 (Quick Wins, ~2.5h):**
1. DEF-2: Enable QUALITY_LOOP default (30min) -- smallest, safest change, builds confidence
2. DEF-1: Enable RECONSOLIDATION default (1h) -- slightly more complex, auto-checkpoint needed
3. CLEAN-1: NOVELTY_BOOST dead code removal (30min) -- pure cleanup, no behavior change
4. CACHE-1: Cross-encoder cache limit (30min) -- proven pattern, prevents memory leak

**Sprint 2 (Fusion Quality, ~3h):**
5. P1-4: GRAPH_WEIGHT_CAP raise (30min) -- simple constant change, high impact for graph-heavy queries
6. P2-4: Doc-type proportional shift (30min) -- mathematical correction, improves weight fairness
7. P1-3: Recency fusion signal (2h) -- highest-impact single change, fully designed

**Sprint 3 (UX, ~1.5h):**
8. UX-1: Intent-to-profile auto-routing (1h) -- connects two existing systems, highest UX impact
9. UX-2: Attention-enriched auto-surface (30min) -- depends on UX-1 conceptually

**Sprint 4 (Cleanup + Minor, ~30min):**
10. CLEAN-2: hasTriggerMatch word-boundary (15min) -- optional micro-fix
11. CACHE-2: co-activation/tool-cache bounds (30min) -- proven pattern

**Sprint 5 (Infrastructure, as capacity allows):**
12. INFRA-1: Embedding circuit breaker (2h) -- resilience improvement
13. INFRA-2: Env var docs (4-6h) -- documentation project, can be incremental
14. UX-3: Spec neighborhood auto-loading (4-6h) -- requires additional design

### 7. Gaps and Inconsistencies Found in Prior Iterations

Reviewing all 17 iterations for internal consistency, I found:

**Corrected findings (iterations self-corrected):**
- Iteration 2 claimed causal-boost import was stale and session-boost had null safety gaps. Iteration 6 corrected both with evidence.
- Iteration 4 called trigger matching "naive substring." Iteration 7 corrected this -- trigger-matcher.ts uses 792-line Unicode boundary regex with n-gram indexing.
- Iterations 4/8 described session state as "ephemeral by design." Iteration 16 corrected this -- session_state IS SQLite-durable; only the working-memory attention Map is ephemeral.

**No unresolved contradictions remain.** All corrections are reflected in the strategy.md and research.md.

**Remaining uncertainty:**
- P1-3 recency weight (0.07) is a reasonable starting point but may need tuning in production. The design is env-var-tunable for this reason.
- P1-4 GRAPH_WEIGHT_CAP of 0.15 is derived from theoretical max analysis (0.16) but real-world graph signal distributions are untested at this cap level.
- UX-3 (spec neighborhoods) effort estimate has widest range (4-6h) due to undetermined causal graph aggregation complexity.

[SOURCE: Cross-iteration analysis of strategy.md sections 7, 8, 9, 10 -- "What Worked," "What Failed," "Ruled Out"]

## Ruled Out
- No new approaches tried -- this is a synthesis iteration consolidating prior findings.

## Dead Ends
- None identified in this iteration. All dead ends from prior iterations are documented in strategy.md section 9.

## Sources Consulted
- research/deep-research-state.jsonl (17 iteration records)
- research/deep-research-strategy.md (full strategy document)
- research/research.md (current synthesis, 460 lines)

## Assessment
- New information ratio: 0.30 (simplification bonus +0.10 applied)
- Calculation: 7 findings total. 0 fully new external facts. 3 partially new (dependency graph, phased plan, and implementation order represent novel synthesis). 4 consolidation (backlog inventory, risk matrix, effort totals, gap analysis restate known info in new structure). Base: (0 + 0.5*3) / 7 = 0.21. Simplification bonus: +0.10 (resolves ordering ambiguity, reduces 19 items to 5 sequential sprints, provides definitive execution plan). Final: 0.31, rounded to 0.30.
- Questions addressed: implementation-roadmap, dependency-ordering, phase-grouping, risk-assessment, test-impact, effort-totals, gap-analysis
- Questions answered: implementation-roadmap (comprehensive), dependency-ordering (complete), recommended-execution-order (complete)

## Reflection
- What worked and why: Reading strategy.md and research.md sequentially provided complete context for synthesis without needing any additional code investigation. All 17 iterations had been thorough enough that no verification round-trips were needed.
- What did not work and why: N/A -- synthesis iteration, no external tool failures.
- What I would do differently: In hindsight, this synthesis could have been attempted one iteration earlier (iteration 17 findings were incremental). The data was ready for consolidation after iteration 16.

## Recommended Next Focus
The roadmap is now complete. The remaining iterations (19-20) could be used for:
1. A final convergence verification pass -- re-read research.md and verify every claim has a source citation
2. Memory save -- persist findings for future sessions
3. Final research.md polish -- ensure the document is self-contained and actionable
