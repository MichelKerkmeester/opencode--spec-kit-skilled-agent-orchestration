# Iteration 12: Graph Weight Cap Fix Design, Constitutional Cap Design, and Dead Code Audit

## Focus
Deep dive into two P1 refinement items: (1) P1-4 GRAPH_WEIGHT_CAP=0.05 limits adaptive graphWeight=0.50 allocation, and (2) P1-2 constitutional injection has no count cap. Also investigated feature interaction risks when multiple opt-in features are enabled, hasTriggerMatch inconsistency verdict, and dead code beyond NOVELTY_BOOST.

## Findings

### 1. P1-4: Full Graph Signal Flow -- THREE-CAP Architecture Identified

The graph signal flow has THREE distinct capping layers, not two as previously understood:

**Layer A -- STAGE2_GRAPH_BONUS_CAP = 0.03** (ranking-contract.ts:14)
- Used in `graph-signals.ts:590`: `unclampedGraphWalkBonus = graphWalk.normalized * STAGE2_GRAPH_BONUS_CAP`
- Then clamped again via `clampStage2GraphBonus()` at line 592, which clamps to `[0, 0.03]`
- This caps the **graph-walk additive bonus** (local connectivity across candidate rows)
- Also applied: momentum bonus capped at 0.05, depth bonus at `depth * 0.05`
- All three bonuses are summed and added to the base score

**Layer B -- GRAPH_WEIGHT_CAP = 0.05** (graph-calibration.ts:25)
- Used in `applyCalibrationProfile()` at calibration time
- Applied in stage2-fusion.ts via `applyGraphCalibrationProfileToResults()` (lines 338-381)
- This caps the **total graph contribution** (graphSignalDelta + communityDelta) after calibration
- DEFAULT_PROFILE: graphWeightCap=0.05, n2aCap=0.10, n2bCap=0.10
- AGGRESSIVE_PROFILE: graphWeightCap=0.03, n2aCap=0.07, n2bCap=0.07
- Individual override available: `SPECKIT_GRAPH_WEIGHT_CAP` env var

**Layer C -- Adaptive graphWeight (0.10-0.50)** (adaptive-fusion.ts)
- This is the RRF **channel weight** for graph signals in the fusion formula
- `find_decision` intent gets graphWeight=0.50, `fix_bug` gets 0.10
- This weight determines how much the graph channel influences the final fused score

**The Mismatch Problem:**
Layer C allocates up to 50% of fusion weight to graph signals, but Layers A+B cap the actual additive contribution to at most 0.05 (or 0.03 for graph-walk specifically). The adaptive weight system "promises" graph signals influence but the caps prevent delivery.

**Concrete Impact Analysis:**
- For `find_decision` (graphWeight=0.50): the adaptive fusion formula expects graph to contribute ~50% of the score. But the actual graph bonus is capped at 0.05 (Layer B) on a [0,1] scale. So graph can only shift scores by 5% maximum, despite being weighted at 50%.
- For `understand` (graphWeight=0.15): graph allocation is modest and 0.05 cap is less constraining but still limits potential.

**Recommended Fix:**
The fix is NOT to raise GRAPH_WEIGHT_CAP to 0.50 -- that would allow graph signals to dominate. Instead, the caps and weights serve different purposes:
- **Caps** (Layers A, B) protect against runaway graph boosting from sparse/noisy graphs
- **Weights** (Layer C) express intent-specific importance of graph signals

The correct fix is to make GRAPH_WEIGHT_CAP **proportional to the adaptive graphWeight**:
```typescript
// In applyGraphCalibrationProfileToResults() or calibrateGraphWeight():
const effectiveCap = Math.min(
  profile.graphWeightCap,                    // Base cap (0.05)
  adaptiveProfile.graphWeight * 0.20         // Proportional: 20% of allocated weight
);
// find_decision: cap = min(0.05, 0.50*0.20) = min(0.05, 0.10) = 0.05 (unchanged)
// fix_bug:       cap = min(0.05, 0.10*0.20) = min(0.05, 0.02) = 0.02 (tighter)
// understand:    cap = min(0.05, 0.15*0.20) = min(0.05, 0.03) = 0.03 (tighter)
```

Actually, the intent-specific impact reveals the cap is MORE constraining for high-graph intents. A better approach: raise GRAPH_WEIGHT_CAP from 0.05 to **0.15** while keeping STAGE2_GRAPH_BONUS_CAP at 0.03. This allows:
- Graph signals to contribute up to 15% of score adjustment (vs. 5% today)
- Still well below the theoretical 50% from graphWeight
- STAGE2_GRAPH_BONUS_CAP (0.03) remains as the per-mechanism safeguard
- N2a/N2b caps (0.10) become the binding constraints for individual signals

**Recommended value: GRAPH_WEIGHT_CAP = 0.15 (3x current)**
- Conservative enough: 15% max is still a secondary signal
- Meaningful enough: allows `find_decision` graph signals to noticeably influence ranking
- Already tunable via `SPECKIT_GRAPH_WEIGHT_CAP` env var for per-deployment adjustment
- STAGE2_GRAPH_BONUS_CAP (0.03) remains unchanged as per-mechanism guard

[SOURCE: graph-calibration.ts:25, ranking-contract.ts:14, graph-signals.ts:585-598, stage2-fusion.ts:338-381]

### 2. P1-2: Constitutional Injection -- Current Architecture and Cap Design

**Current Behavior:**
- `CONSTITUTIONAL_INJECT_LIMIT = 5` (stage1-candidate-gen.ts:80)
- Constitutional injection only fires when `includeConstitutional=true` (default) AND no tier filter AND no constitutional results already exist in candidates (line 962-967)
- When it fires: vector search with `tier: 'constitutional'`, limit 5, useDecay false
- Dedup: filters out IDs already in candidate set (line 984-986)
- Post-injection: applies contextType filter and scope filtering (lines 991-1002)
- Final count tracked in `constitutionalInjectedCount` (line 1004)

**What's NOT capped:**
The 5-limit is per-injection-call, but the issue from iteration 4 (P1-2) was about the `includeConstitutional` parameter in memory_search which has a default `CONSTITUTIONAL_CACHE_LIMIT = 10` in the auto-surface middleware. These are two different caps:
1. **Stage 1 injection**: CONSTITUTIONAL_INJECT_LIMIT=5 (search pipeline)
2. **Auto-surface middleware**: Caches up to 10 constitutional memories for 1-minute TTL

However, there is a subtle issue: if the user has many constitutional memories (e.g., 50+), the stage1 vector search with limit=5 returns the 5 most similar to the query. This is actually GOOD design -- it provides relevance-filtered injection, not a blind dump.

**The Real Concern (refined):**
The concern is not about injection count (5 is reasonable) but about **token budget consumption**. Constitutional memories in HOT state include full content, and 5 large constitutional memories could consume 2000+ tokens of the 3500-4000 token budget, leaving little room for actual search results.

**Smart Cap Design:**
```typescript
// Token-aware constitutional cap
const CONSTITUTIONAL_TOKEN_BUDGET = 800;  // Max tokens for constitutionals
const CONSTITUTIONAL_MAX_COUNT = 5;       // Hard count cap (existing)

// After fetching constitutional results, estimate token cost:
let tokenBudgetRemaining = CONSTITUTIONAL_TOKEN_BUDGET;
const admitted: PipelineRow[] = [];
for (const row of sortedByImportance(uniqueConstitutional)) {
  const estimatedTokens = estimateTokens(row.content ?? row.title ?? '');
  if (tokenBudgetRemaining - estimatedTokens < 0 && admitted.length > 0) break;
  admitted.push(row);
  tokenBudgetRemaining -= estimatedTokens;
}
```

**Simpler Alternative (recommended for P1 scope):**
Just add a count cap that respects the existing CONSTITUTIONAL_INJECT_LIMIT and add a simple importance-tier ordering:
```typescript
// Sort constitutional results by importance_weight DESC before injection
uniqueConstitutional.sort((a, b) => (b.importance_weight ?? 0) - (a.importance_weight ?? 0));
// Existing limit of 5 is already applied via vectorSearch limit
```

This is already effectively in place because vectorSearch returns the most similar results. The P1-2 concern from iteration 4 ("constitutional limit of 10 may be too low") actually referred to the auto-surface cache, not the pipeline. **Verdict: The pipeline injection is already well-designed with limit=5 + dedup + contextType + scope filtering. The auto-surface cache limit of 10 is the only open concern, and 10 is reasonable for cached constitutional memories.**

[SOURCE: stage1-candidate-gen.ts:79-80, stage1-candidate-gen.ts:950-1012]

### 3. Feature Interaction Analysis -- Multiple Opt-in Features Enabled Simultaneously

**Question: Do the 5 opt-in features interact badly when multiple are enabled?**

Analyzed the interaction matrix:

| Feature A | Feature B | Interaction | Risk |
|-----------|-----------|-------------|------|
| SESSION_BOOST | CAUSAL_BOOST | Both add to score additively | LOW -- independent signals, each capped |
| SESSION_BOOST | GRAPH_SIGNALS | Session boosts before graph signals in pipeline | LOW -- ordered, no conflict |
| CAUSAL_BOOST | GRAPH_SIGNALS | Causal boost runs in stage2, graph signals run separately | LOW -- independent execution |
| INTENT_WEIGHTS | GRAPH_SIGNALS | Intent weights multiply; graph signals add | MEDIUM -- graph cap limits intent-intended influence |
| FEEDBACK_SIGNALS | all others | Validation multiplier (0.8-1.2) applies after all other signals | LOW -- multiplicative, bounded |

The only MEDIUM interaction is P1-4 (intent weights expecting graph influence that caps prevent) which is already addressed in Finding 1.

**Key safety mechanism:** The G2 double-weighting guard in stage2 prevents intent weights from being applied twice when search is hybrid. This was confirmed in iteration 2 and protects against the most dangerous interaction (multiplicative stacking of intent adjustments).

**Verdict: No dangerous feature interactions. The pipeline is well-ordered with each signal having its own application phase and independent capping.**

[SOURCE: stage2-fusion.ts:907-920 (graph signals phase), stage2-fusion.ts:746-756 (metadata tracking), INFERENCE: based on pipeline phase ordering from iteration 2]

### 4. hasTriggerMatch Inconsistency -- Final Verdict

**Two systems use "trigger matching" differently:**
1. **query-classifier.ts `hasTriggerMatch()`**: Exact full-string match (case-insensitive, trimmed). Tests confirm: `hasTriggerMatch('save context', phrases)` = true, `hasTriggerMatch('save context now', phrases)` = false. Purpose: classify query complexity tier.
2. **trigger-matcher.ts**: Sophisticated Unicode word-boundary regex + n-gram indexing. Purpose: match user prompts against memory trigger phrases for retrieval.

**Is the inconsistency worth fixing?**
- The query classifier uses exact match because its purpose is to detect when the user's entire query IS a trigger phrase (indicating a simple/known command). This is correct behavior -- "save context" should classify as simple, but "tell me about save context and other stuff" should not.
- The trigger matcher uses boundary matching because its purpose is to find trigger phrases WITHIN longer text. This is also correct.
- These serve fundamentally different purposes and the "inconsistency" is actually intentional design separation.

**Verdict: NOT worth fixing. The different matching strategies serve different purposes. Exact-match for complexity classification, boundary-match for memory retrieval. Changing either to match the other would break its intended use case.**

[SOURCE: query-classifier.vitest.ts:481-511 (exact match tests), INFERENCE: based on iteration 7 trigger-matcher.ts analysis + iteration 8 hasTriggerMatch assessment]

### 5. Dead Code Audit Beyond NOVELTY_BOOST

**NOVELTY_BOOST (confirmed dead, iteration 10):**
- `calculateNoveltyBoost()` always returns 0 (composite-scoring.ts:529-531)
- Constants retained: `NOVELTY_BOOST_MAX=0.15`, `NOVELTY_BOOST_HALF_LIFE_HOURS=12`, `NOVELTY_BOOST_SCORE_CAP=0.95` (lines 515-519)
- All marked with "Retained for test compatibility" comments
- Test file: cold-start.vitest.ts still imports and tests the function (lines 29-56)
- Cleanup scope: Remove function + 3 constants + test describe blocks + `noveltyBoostApplied`/`noveltyBoostValue` from composite scoring metadata

**Additional dead code candidates identified:**
- `SPECKIT_NOVELTY_BOOST` env var references in search-flags.ts -- the env var is read but the feature check always results in the function returning 0
- `noveltyBoostApplied: false` and `noveltyBoostValue: 0` hard-coded in composite-scoring.ts:587-588 -- always false/0, adding noise to metadata

**No other dead code found.** The ADAPTIVE_RANKING code is NOT dead -- it has shadow/promoted mode infrastructure for future graduation. The RECONSOLIDATION and QUALITY_LOOP code paths are live but gated behind opt-in flags.

[SOURCE: composite-scoring.ts:513-531, composite-scoring.ts:585-588, cold-start.vitest.ts:6,29-56]

### 6. STAGE2_GRAPH_BONUS_CAP vs GRAPH_WEIGHT_CAP -- Clarification of Relationship

These two caps operate at different levels:
- **STAGE2_GRAPH_BONUS_CAP = 0.03**: Per-mechanism cap on graph-walk additive bonus. Applied in graph-signals.ts before scores leave the graph module.
- **GRAPH_WEIGHT_CAP = 0.05**: Aggregate cap on total graph contribution (graphSignalDelta + communityDelta). Applied via calibration profile in stage2-fusion.ts.

The relationship: STAGE2_GRAPH_BONUS_CAP is a component-level guard; GRAPH_WEIGHT_CAP is a system-level guard. Raising GRAPH_WEIGHT_CAP to 0.15 does NOT bypass the per-mechanism 0.03 cap -- it just allows the aggregate of multiple graph mechanisms to contribute more.

Maximum possible graph contribution with recommended fix:
- Graph-walk: 0.03 (capped by STAGE2_GRAPH_BONUS_CAP)
- Momentum: 0.05 (capped internally)
- Depth: 0.05 (capped internally)
- Community: 0.03 (capped by COMMUNITY_SCORE_CAP)
- Theoretical max: 0.16 (but calibration would cap to GRAPH_WEIGHT_CAP=0.15)
- N2a/N2b caps: 0.10 each (applied in calibration)

This confirms GRAPH_WEIGHT_CAP=0.15 is the right value -- it is just below the theoretical maximum of uncapped graph signals, providing meaningful headroom while maintaining the safety guarantee.

[SOURCE: ranking-contract.ts:14, graph-calibration.ts:25-28, graph-signals.ts:585-598, graph-calibration.ts:145-160]

### 7. Summary: Revised Backlog After This Iteration

| Item | Status | Effort | Action |
|------|--------|--------|--------|
| P1-4 GRAPH_WEIGHT_CAP | DESIGNED | 30 min | Change 0.05 to 0.15 in graph-calibration.ts:25 |
| P1-2 Constitutional cap | CLOSED (well-designed) | N/A | Existing limit=5 + dedup + filters is sufficient |
| P1-3 Recency fusion | DESIGNED (iter 11) | 2 hours | Step 1a injection, weight=0.07, cap=0.10 |
| P2-4 Doc-type shift | Open | 30 min | Proportional shift |
| P3-3 NOVELTY_BOOST cleanup | DESIGNED | 30 min | Remove function + 3 constants + test blocks |
| hasTriggerMatch | CLOSED (by design) | N/A | Different purposes, not a bug |
| Feature interactions | CLOSED (safe) | N/A | G2 guard + independent capping sufficient |

## Ruled Out
- Raising GRAPH_WEIGHT_CAP to match graphWeight (0.50) -- would allow graph to dominate scoring
- Adding token-budget-aware constitutional capping -- overkill for P1, existing limit=5 is sufficient
- Fixing hasTriggerMatch inconsistency -- serves different purposes, not actually inconsistent

## Dead Ends
- Constitutional injection count concern (P1-2): the pipeline already has limit=5 + dedup + contextType filter + scope filter. The original concern was mislabeled -- the "10 limit" refers to auto-surface cache, not pipeline injection.

## Sources Consulted
- graph-calibration.ts (full file, 552 lines) -- three-cap architecture, calibration profiles, env overrides
- ranking-contract.ts:6-26 -- STAGE2_GRAPH_BONUS_CAP definition and clamp function
- graph-signals.ts:575-621 -- applyGraphSignals with momentum/depth/graph-walk bonuses
- stage2-fusion.ts:338-381 -- applyGraphCalibrationProfileToResults
- stage2-fusion.ts:907-920 -- graph signals application in pipeline
- stage1-candidate-gen.ts:79-80, 950-1012 -- constitutional injection code
- composite-scoring.ts:513-531, 585-588 -- NOVELTY_BOOST dead code
- cold-start.vitest.ts:6,29-56 -- NOVELTY_BOOST tests
- query-classifier.vitest.ts:481-511 -- hasTriggerMatch exact match tests

## Assessment
- New information ratio: 0.64
- Questions addressed: P1-4, P1-2, feature interactions, hasTriggerMatch verdict, dead code audit
- Questions answered: P1-4 (fix designed), P1-2 (closed -- already well-designed), feature interactions (closed -- safe), hasTriggerMatch (closed -- by design), dead code (NOVELTY_BOOST cleanup scoped)

## Reflection
- What worked and why: Reading graph-calibration.ts in full gave the complete three-cap architecture in one pass. The three layers (STAGE2_GRAPH_BONUS_CAP, GRAPH_WEIGHT_CAP, adaptive graphWeight) are clearly separated by concern level. Reading constitutional injection code showed it was already well-designed with 5 guard mechanisms, closing P1-2.
- What did not work and why: graph-calibration.ts was not at the path expected from iteration 7 (lib/graph/graph-calibration.ts does not exist -- it is at lib/search/graph-calibration.ts). Required a Glob to locate. Minor cost.
- What I would do differently: For future deep dives, read the full calibration/configuration module first rather than tracing from usage sites backward -- the module-level constants and profiles give the complete picture faster.

## Recommended Next Focus
All P1 items are now either designed (P1-3 recency, P1-4 graph cap) or closed (P1-1 trigger matcher, P1-2 constitutional). The remaining open items are P2-4 (doc-type proportional shift) and P3-3 (NOVELTY_BOOST cleanup). With 8 iterations remaining, recommend convergence assessment: synthesize all 12 iterations into a final research.md and determine if any new investigation threads have emerged.
