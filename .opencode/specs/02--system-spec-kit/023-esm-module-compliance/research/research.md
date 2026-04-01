# Deep Research: Spec Kit Memory Feature Audit & Quality Verification

> **20 iterations | 19 research + 1 synthesis | All 10 key questions answered | 0 critical bugs | 14 actionable items**

---

## Executive Summary

This research audited the entire Spec Kit Memory system -- feature flags, search quality, fusion pipeline, UX automation, and cross-cutting infrastructure -- across specs 009 (reindex validator), 010 (retrieval quality), and 011 (indexing and adaptive fusion). The investigation spanned 20 iterations with progressive convergence from newInfoRatio 1.0 to 0.21.

**Key findings:**

1. **Feature completeness is high.** 50 of 56 features are enabled by default. Of the 6 opt-in features, 2 should be promoted to default-ON (RECONSOLIDATION, QUALITY_LOOP), 3 are correctly opt-in due to external dependencies, and 1 is dead code (NOVELTY_BOOST).

2. **No critical bugs exist.** The 4-stage fusion pipeline has comprehensive error handling: 5-tier graceful fallback, 25+ per-channel catch blocks, NaN/null guards, and 3-tier degradation (mandatory Stage 1, graceful Stages 2-4, cross-encoder circuit breaker).

3. **All spec fixes are working.** Spec 009 validator rules (V8/V12), spec 010 retrieval quality fixes (6 of 6), and spec 011 lexical score propagation are all verified present and functional.

4. **UX is fully hookless.** Auto-surface, progressive disclosure, session priming, and goal refinement all operate within the MCP server without external hook dependencies. Three improvement opportunities identified and designed.

5. **Three fusion refinements identified.** Recency signal is negligibly small in hybrid mode (max 0.02 effective), graph bonus cap mismatches adaptive weights, and doc-type weight shift is disproportionate. All three have complete designs ready for implementation.

6. **Implementation-ready roadmap.** 14 items across 5 phases: Phases A-D (~7.25h, LOW-to-ZERO risk) are ready to implement; Phase E (~8-14h, MEDIUM risk) covers infrastructure improvements.

---

## Table of Contents

1. [Feature Flag Audit (Q1, Q2)](#1-feature-flag-audit-q1-q2)
2. [Fusion Pipeline Analysis (Q5)](#2-fusion-pipeline-analysis-q5)
3. [Spec Fix Verification (Q6, Q7, Q8)](#3-spec-fix-verification-q6-q7-q8)
4. [UX/Auto-Utilization (Q4)](#4-uxauto-utilization-q4)
5. [Code Graph/CocoIndex Integration (Q10)](#5-code-graphcocoindex-integration-q10)
6. [Remaining Search Quality Issues (Q3)](#6-remaining-search-quality-issues-q3)
7. [Adaptive Fusion Refinements (Q9)](#7-adaptive-fusion-refinements-q9)
8. [Cross-Cutting Concerns](#8-cross-cutting-concerns)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Risk Assessment](#10-risk-assessment)
11. [Test Impact Matrix](#11-test-impact-matrix)
12. [Convergence Report](#12-convergence-report)

---

## 1. Feature Flag Audit (Q1, Q2)

### Current State

The Spec Kit Memory system uses `isFeatureEnabled()` in `search-flags.ts` as the canonical gating mechanism. The default behavior is feature-ON: if a flag is not explicitly disabled, it is treated as enabled.

[SOURCE: mcp_server/lib/search/search-flags.ts, rollout-policy.ts, capability-flags.ts]

- **50 features default ON** via `isFeatureEnabled()` -- includes session boost, causal boost, intent weights, feedback signals, graph signals, progressive disclosure, auto-surface, and all core pipeline stages
- **5 features opt-in** (require explicit `SPECKIT_*=true`): RECONSOLIDATION, FILE_WATCHER, RERANKER_LOCAL, QUALITY_LOOP, NOVELTY_BOOST
- **1 roadmap feature OFF**: ADAPTIVE_RANKING (intentional shadow/roadmap feature, not a bug)
- **Governance flags**: SCOPE_ENFORCEMENT and GOVERNANCE_GUARDRAILS show roadmap-ON / runtime-OFF discrepancy -- this is by design (standard feature graduation: roadmap -> shadow -> promoted -> default-on)

### Opt-In Feature Verdicts

| Feature | Current | Verdict | Risk | Rationale |
|---------|---------|---------|------|-----------|
| SPECKIT_RECONSOLIDATION | OFF (opt-in) | **ENABLE by default** | Medium | Full reconsolidation (similarity-based merge/conflict routing, thresholds: >=0.88 merge, 0.75-0.88 conflict, <0.75 complement). Assistive variant already ON. Requires auto-checkpoint guard -- `hasReconsolidationCheckpoint()` gate already exists in db-helpers.ts. Merge path IS destructive (archives old memory, creates merged record, generates causal edge, refreshes BM25+interference+cache). [SOURCE: reconsolidation.ts:212-300, db-helpers.ts] |
| SPECKIT_QUALITY_LOOP | OFF (opt-in) | **ENABLE by default** | Low | Pure algorithmic, bounded (max 2 retries), deterministic, synchronous, no I/O, no DB writes, no network calls. NUANCE: enabling enforcement means previously-warned low-quality saves will now be rejected -- this is desired behavior. [SOURCE: quality-loop.ts:581] |
| SPECKIT_FILE_WATCHER | OFF (opt-in) | KEEP OFF | High | Requires chokidar native dependency. Background resource consumption. Not portable across CI/containers. Uses double-gate pattern (explicit env check + isFeatureEnabled) signaling external dependency concerns. [SOURCE: search-flags.ts] |
| RERANKER_LOCAL | OFF (opt-in) | KEEP OFF | Very High | Requires node-llama-cpp + GGUF model file + sufficient RAM. Heavy native dependency. Also uses double-gate pattern. [SOURCE: search-flags.ts] |
| SPECKIT_NOVELTY_BOOST | OFF (inert) | **REMOVE (dead code)** | None | `calculateNoveltyBoost()` always returns 0 with underscore-prefixed unused param. JSDoc explicitly states "Eval complete. Marginal value confirmed." Env var is completely inert. [SOURCE: composite-scoring.ts:529-531] |
| SPECKIT_MEMORY_ADAPTIVE_RANKING | OFF (roadmap) | KEEP OFF | Low-Medium | Roadmap feature in shadow mode. Needs standard graduation process (shadow -> promoted -> default-on). [SOURCE: rollout-policy.ts, capability-flags.ts] |

### All Boost Signals Confirmed ON (Q2)

All five core boost signals are enabled by default via `isFeatureEnabled()`:
- Session boost (`isSessionBoostEnabled()`)
- Causal boost (`isCausalBoostEnabled()`)
- Intent weights (via `classifyIntent()` pipeline integration)
- Feedback signals (`isFeedbackSignalEnabled()`)
- Graph signals (`isGraphUnifiedEnabled()`)

[SOURCE: search-flags.ts, graph-flags.ts]

---

## 2. Fusion Pipeline Analysis (Q5)

### Architecture: 4-Stage Pipeline

| Stage | Module | Purpose | Failure Mode |
|-------|--------|---------|--------------|
| Stage 1 | `stage1-candidate-gen.ts` | Multi-channel candidate retrieval (vector, FTS5, BM25, graph) | **Mandatory** -- throws `PIPELINE_STAGE1_FAILED` |
| Stage 2 | `stage2-fusion.ts` | 12-step signal integration and score fusion | Graceful -- returns Stage 1 output with `degraded=true` |
| Stage 3 | `stage3-rerank.ts` | Cross-encoder reranking + MMR diversity | Graceful -- returns Stage 2 output with `degraded=true` |
| Stage 4 | `stage4-filter.ts` | Score invariant enforcement and quality filtering | Graceful -- returns Stage 3 output with `degraded=true` |

[SOURCE: mcp_server/lib/search/pipeline/]

### Bug Audit: No Critical Issues Found

The pipeline is well-defended with:
- **12-step signal order** with G2 double-weighting prevention (intent weights skipped in hybrid mode to avoid stacking with RRF channel weights)
- **Score clamping [0,1]** at multiple pipeline points
- **try/catch isolation** per step -- each of the 12 signal applications is individually wrapped
- **Compile-time + runtime score invariant enforcement** in Stage 4

[SOURCE: stage2-fusion.ts:715-1102, stage4-filter.ts]

### One Fragility (Non-Critical)

Stage 2 uses shallow-spread clone (`{...candidate}`) for candidate objects. Nested objects (`graphContribution`, `sourceScores`) share references across clones. This is safe TODAY because the pipeline avoids in-place nested mutation, but it creates a latent risk if future changes add nested writes.

[SOURCE: stage2-fusion.ts spread pattern analysis]

### Self-Corrections

Two iteration-2 findings were corrected with evidence in iteration 6:
- **causal-boost.ts `_isTypedTraversalEnabled` import**: NOT stale -- confirmed used at line 160 [SOURCE: causal-boost.ts:160]
- **session-boost.ts null safety**: IS comprehensive via `normalizeSessionId()`, `Number.isFinite()` guards, and `Math.max(0,...)` clamping [SOURCE: session-boost.ts]

---

## 3. Spec Fix Verification (Q6, Q7, Q8)

### Spec 009: Validator Rules (Q6) -- WORKING

**V8 (Cross-Spec Contamination)**
- Three-pronged detection: (a) frontmatter foreign spec mentions, (b) body content where foreign spec IDs dominate, (c) scattered foreign spec mentions
- Severity: high | blockOnWrite: true | blockOnIndex: true
- Contaminated memories are blocked at both write and index stages

[SOURCE: validator TypeScript source for V8 rule]

**V12 (Topical Coherence)**
- Reads parent spec's `spec.md` trigger_phrases, checks case-insensitive overlap with memory content
- Severity: medium | blockOnWrite: false | blockOnIndex: true
- Off-topic memories are written to disk but excluded from semantic index

[SOURCE: validator TypeScript source for V12 rule]

**V-Rule Bridge**: MCP server loads compiled validator via `createRequire(import.meta.filename)` with two candidate paths. Graceful fallback: returns error or bypasses (`SPECKIT_VRULE_OPTIONAL=true`).

### Spec 010: 6 Retrieval Quality Fixes (Q7) -- ALL PRESENT

| Fix | Status | Implementation | Source |
|-----|--------|---------------|--------|
| Intent propagation | PRESENT | `classifyIntent()` + `INTENT_LAMBDA_MAP` threaded through pipeline | hybrid-search.ts imports |
| Folder auto-narrowing | PRESENT | `folder-relevance.js` with `twoPhaseRetrieval()` | hybrid-search.ts imports |
| Token budget truncation | PRESENT | `dynamic-token-budget.js` with `evaluationMode` bypass | hybrid-search.ts imports |
| Folder discovery as boost | PRESENT | `isFolderScoringEnabled()` + `enrichResultsWithFolderScores()` | hybrid-search.ts imports |
| Two-tier response | PRESENT | Metadata default + content tier + trace tier | search-results.ts |
| Intent confidence floor | PRESENT | `confidence-truncation.ts` with `DEFAULT_MIN_RESULTS` | hybrid-search.ts imports |

[SOURCE: hybrid-search.ts import tracing, individual module files]

### Spec 011: Lexical Score Propagation (Q8) -- WORKING

- FTS5 uses weighted BM25 scoring: title 10x, trigger_phrases 5x, file_path 2x, content 1x
- Scores propagate through RRF fusion via `sourceScores` merge in `mergeRawCandidate()`
- Response formatter extracts lexical scores via 5-location fallback chain: `fts_score` -> `bm25_score` -> `sourceScores.keyword` -> `sourceScores.fts` -> `sourceScores.bm25`

[SOURCE: FTS5 schema, mergeRawCandidate(), search-results.ts formatter]

---

## 4. UX/Auto-Utilization (Q4)

All core UX features operate fully within the MCP server without requiring external hooks.

### Auto-Surface -- FULLY HOOKLESS

- Fires in `context-server.ts` dispatch middleware on every non-memory tool call
- Constitutional memories: cached 1-min TTL, max 10 results
- Trigger-matched memories: matched against current tool call text
- Dual-scope: `autoSurfaceAtToolDispatch()` for regular calls, `autoSurfaceAtCompaction()` for compaction events
- Token budget: 4000 tokens per scope, graceful truncation (triggered dropped first, then constitutional)

[SOURCE: hooks/memory-surface.ts, context-server.ts dispatch]

### Session Priming (T018 Prime Package) -- FULLY HOOKLESS

- `primeSessionIfNeeded()` fires automatically on first tool call of any session
- Returns structured `PrimePackage`: specFolder, currentTask, codeGraphStatus (fresh/stale/empty), cocoIndexAvailable, recommendedCalls
- Complete bootstrap without external hook dependency

[SOURCE: session-state.ts, context-server.ts]

### Progressive Disclosure -- ON BY DEFAULT

- Feature flag: `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` defaults true
- Summary layer: confidence distribution digest (e.g., "3 strong, 2 moderate")
- Snippet extraction: first 100 chars with `detailAvailable` flag
- Cursor pagination: 5 results/page, 5-min cursor TTL, max 1000 cursors, LRU eviction

[SOURCE: progressive-disclosure.ts]

### Goal Refinement -- WORKING WITH LIMITATIONS

- Goal set to `effectiveQuery` on every search call (resets each time, no persistent intent)
- Keyword overlap alignment: split goal words >2 chars, check substring in content
- Maximum boost: 1.2x for fully aligned results
- Cross-turn dedup: 0.3x score multiplier for previously-seen results

[SOURCE: session-state.ts updateGoal/markSeen/setAnchors]

### Session State Persistence (Corrected in Iteration 16)

**Correction**: Iterations 4 and 8 described the session system as "ephemeral by design." This is only partially accurate:
- **Durable (SQLite-backed)**: `session_state` table (specFolder, currentTask, lastAction, contextSummary, pendingWork, identity scopes, custom data JSON), `session_sent_memories` table (dedup hashes), 30-min TTL with periodic cleanup, `_recovered` flag for crash recovery
- **Ephemeral (in-process only)**: Working-memory attention signals (`cognitive/working-memory.ts`), specifically the `sessionModeRegistry` Map. SQLite `working_memory` rows (attention_score, event_counter, mention_count, focus_count, last_focused) DO persist.

[SOURCE: session-manager.ts init(), working-memory.ts schema]

### Designed Improvements

#### 1. Intent-to-Profile Auto-Routing (HIGHEST IMPACT, ~1h, ~85 lines)

The system has two disconnected features: intent classifier (`classifyIntent()`, 3-channel scoring: centroid 50%, keyword 35%, regex 15%) producing 7 `IntentType` values, and profile formatter (`applyResponseProfile()`) implementing 4 profiles. Both are called in the same handlers but not connected.

**Mapping table:**

| Intent | Auto-Profile | Rationale |
|--------|-------------|-----------|
| `fix_bug` | `debug` | Full trace, scores, signal breakdown |
| `security_audit` | `debug` | Complete evidence chain for audit trail |
| `understand` | `research` | Evidence digest + follow-up suggestions |
| `find_spec` | `research` | Digest + related specs |
| `find_decision` | `research` | Full result list + evidence |
| `add_feature` | `quick` | Most relevant result fast |
| `refactor` | `quick` | Targeted result, not broad exploration |

**Injection points:**
- `memory-search.ts`: After intent confidence floor (line 597), compute `effectiveProfile = profile ?? INTENT_TO_PROFILE[detectedIntent]`. Apply at line 1108.
- `memory-context.ts`: After intent detection (line 848), thread through options at lines 684, 715, 749.

**Override**: Explicit caller `profile` parameter always takes precedence. Env var: `SPECKIT_INTENT_AUTO_PROFILE=false` to disable.

[SOURCE: intent-classifier.ts, profile-formatters.ts, memory-search.ts:597/1108, memory-context.ts:848/684]

#### 2. Attention-Enriched Auto-Surface Hints (~30min, ~20 lines)

Use `getSessionPromptContext(sessionId, DECAY_FLOOR, 5)` to get top-N attention-weighted memories, then boost trigger-matched results that also appear in working memory (1.3x score multiplier).

[SOURCE: working-memory.ts getSessionPromptContext, memory-surface.ts]

#### 3. Cache Size Limit for Cross-Encoder (~30min)

Cache Map at `cross-encoder.ts:115` has no max size. Apply `enforceCacheBound()` pattern from `graph-signals.ts` with MAX_CACHE_ENTRIES=200.

[SOURCE: cross-encoder.ts:115, graph-signals.ts enforceCacheBound()]

#### Additional Opportunities (Lower Priority)

- **Prime Package enrichment**: Add memory health, recent session state, active spec detection
- **Dynamic progressive disclosure page size**: Based on confidence gap elbow detection
- **Auto-context for spec neighborhoods** (~200-300 lines, ~4-6h): Auto-discover related specs via causal graph aggregation -- significantly more work than other items

---

## 5. Code Graph/CocoIndex Integration (Q10)

### Architecture: Three Separate Systems

| System | Database | Purpose | Feeds into Memory Search? |
|--------|----------|---------|--------------------------|
| Causal Memory Graph | `memory_index.sqlite` (causal_edges table) | Decision lineage, memory relationships | **YES** -- primary graph signal source |
| Code Graph | `code-graph.sqlite` | Structural code navigation (functions, classes, imports, calls) | **NO** -- separate MCP tools |
| CocoIndex | External LMDB index | Semantic code search | **NO** -- completely external |

[SOURCE: Grep for graph/cocoindex across pipeline directory]

### Memory Search Graph Signals (from Causal Memory Graph)

The memory search pipeline uses 4 graph mechanisms, all gated by `isGraphUnifiedEnabled()` (SPECKIT_GRAPH_UNIFIED, defaults ON):

1. **Causal boost**: 2-hop traversal on `causal_edges`, controlled by `isCausalBoostEnabled()`
2. **Co-activation spreading**: Memories frequently retrieved together, gated by `isCoActivationEnabled() && isGraphUnifiedEnabled()`
3. **Community detection/injection**: Inject community co-members before graph signals
4. **N2a+N2b graph signals**: Momentum + causal depth adjustments via `applyGraphSignals()`

**Graph weight in fusion**: The 4th RRF channel (alongside semantic, keyword, recency) with `DEGREE_CHANNEL_WEIGHT = 0.15`. Stage 2 applies additional additive graph signals capped at `STAGE2_GRAPH_BONUS_CAP = 0.03` per row.

[SOURCE: graph-calibration.ts, causal-boost.ts, co-activation.ts, graph-signals.ts]

### Code Graph and CocoIndex Bridge

The `code_graph_context` MCP tool can accept CocoIndex search results as seeds (provider: `cocoindex`), bridging Code Graph structural navigation with CocoIndex semantic search. However, this bridge operates outside the memory search pipeline entirely.

---

## 6. Remaining Search Quality Issues (Q3)

### Verdict: No Critical Issues

The pipeline has comprehensive error handling and graceful degradation. After thorough investigation across iterations 6, 7, 8, and 9, no critical bugs or quality failures were found.

### Error Handling: 5-Tier Fallback Chain

1. **Hybrid search** (minSim=30) -- primary path with multi-channel fusion
2. **Retry** (minSim=17) -- lowered threshold for broader recall
3. **FTS-only** -- keyword fallback when vector search fails
4. **BM25-only** -- raw BM25 when FTS5 unavailable
5. **Structural** -- pure SQL by importance tier when all search fails

Non-empty databases always return results.

[SOURCE: hybrid-search.ts fallback chain]

### Result Truncation: 4-Layer Capping Architecture

1. **Per-channel limit**: Each channel independently caps at `limit` (default 10, max 100)
2. **Post-fusion `.slice(0, limit)`**: After RRF merge and scoring
3. **Confidence truncation**: Elbow heuristic (2x median gap threshold) with `DEFAULT_MIN_RESULTS = 3` floor
4. **Token budget truncation**: Dynamic tier-aware budget as final gate

[SOURCE: hybrid-search.ts, confidence-truncation.ts, dynamic-token-budget.ts]

### Edge Cases Confirmed Well-Handled

| Edge Case | Status | Evidence |
|-----------|--------|----------|
| Embedding model mismatch | HANDLED | 3-provider factory with startup dimension validation, FATAL on mismatch |
| Multi-query expansion | HANDLED | R12/R15 mutual exclusion for simple queries, well-gated |
| Document length bias | HANDLED | BM25 normalization + cross-encoder LENGTH_PENALTY (two-level mitigation) |
| Async race conditions | NOT A CONCERN | Pipeline is synchronous per-request, SQLite WAL isolation for background processes |
| NaN/null scores | HANDLED | 3-layer defense: `resolveEffectiveScore()` (4-step isFinite chain) -> `compareDeterministicRows` -> integer ID tiebreaker |

[SOURCE: Iterations 6, 9 edge case audit]

### Prioritized Refinement Backlog

#### Active P1 Items

| # | Item | Code Location | Effort | Status |
|---|------|---------------|--------|--------|
| P1-3 | Direct recency bonus in Stage 2 | `stage2-fusion.ts` step 1a | ~2h | FULLY DESIGNED (iter 11) |
| P1-4 | GRAPH_WEIGHT_CAP raise 0.05 -> 0.15 | `graph-calibration.ts:25` | ~30min | DESIGNED (iter 12) |

#### Active P2 Items

| # | Item | Code Location | Effort | Status |
|---|------|---------------|--------|--------|
| P2-4 | Doc-type proportional shift | `adaptive-fusion.ts:82-83` | ~30min | Use 20% of base weight instead of flat 0.1 |
| P2-NEW | Env var reference documentation | All 113 SPECKIT_* vars | ~4-6h | Catalog into central reference |
| P2-NEW | Cross-encoder cache limit | `cross-encoder.ts:115` | ~30min | Apply enforceCacheBound() pattern |

#### Closed Items (No Action Needed)

| # | Item | Verdict | Evidence |
|---|------|---------|----------|
| P1-2 | Constitutional injection cap | CLOSED | Already well-designed: limit=5 + dedup + contextType + scope + conditional trigger (5 guards) |
| P2-1 | Progressive disclosure statelessness | Working as designed | Standard cursor pagination with 5-min TTL |
| P2-2 | Goal refinement not persisted | Working as designed | Goal tracks current query intentionally |
| P2-3 | Session state is ephemeral | Partially corrected | Session state IS SQLite-persisted; only working-memory attention Map is ephemeral |
| P2-5 | Auto-surface trigger matching | Already sophisticated | 792-line trigger-matcher with Unicode boundary regex + n-gram indexing |
| P2-6 | Reranker NaN sort stability | Structurally impossible | 3-layer NaN defense proven |
| P2-NEW | hasTriggerMatch word-boundary | CLOSED | Different purposes by design (exact for complexity, boundary for retrieval) |

---

## 7. Adaptive Fusion Refinements (Q9)

### Weight Profiles (7 Intents + Default)

| Intent | Semantic | Keyword | Recency | Graph | GraphCausalBias |
|--------|----------|---------|---------|-------|-----------------|
| understand | 0.70 | 0.20 | 0.10 | 0.15 | 0.10 |
| find_spec | 0.70 | 0.20 | 0.10 | 0.30 | 0.10 |
| fix_bug | 0.40 | 0.40 | 0.20 | 0.10 | 0.15 |
| add_feature | 0.50 | 0.30 | 0.20 | 0.20 | 0.15 |
| refactor | 0.60 | 0.30 | 0.10 | 0.15 | 0.10 |
| security_audit | 0.30 | 0.50 | 0.20 | 0.15 | 0.10 |
| find_decision | 0.30 | 0.20 | 0.10 | 0.50 | 0.15 |
| **default** | **0.50** | **0.30** | **0.20** | **0.15** | **0.10** |

All profiles dynamically normalized to sum=1.0 by `getAdaptiveWeights()`. Document-type shift (+/-0.1) adjusts weights for decision/implementation/research docs before normalization.

[SOURCE: shared/algorithms/adaptive-fusion.ts (433 lines)]

### Three Refinement Opportunities

#### R1: Recency Boost is Negligibly Small

Maximum effective contribution in hybrid mode is ~0.02 (`recencyWeight=0.2 * freshness=1.0 * RECENCY_BOOST_SCALE=0.1`). At this magnitude, recency is functionally a tiebreaker -- decorative rather than influential. The real gap: in hybrid mode (the default and most common path), the G2 double-weighting guard skips step 4 (intent weights), which is the only recency entry point. This means hybrid searches have NO direct recency signal in Stage 2 fusion.

**Fix designed (P1-3):** See Section 9, Phase B.

[SOURCE: stage2-fusion.ts executeStage2(), adaptive-fusion.ts RECENCY_BOOST_SCALE]

#### R2: Graph Bonus Cap Mismatches Adaptive Weights

Three-cap architecture:
- **Layer A (per-mechanism)**: STAGE2_GRAPH_BONUS_CAP = 0.03 per row per mechanism (graph-walk, community)
- **Layer B (aggregate)**: GRAPH_WEIGHT_CAP = 0.05 total graph contribution across all mechanisms
- **Layer C (adaptive)**: graphWeight ranges 0.10 (fix_bug) to 0.50 (find_decision)

The mismatch: Layer B (0.05) prevents graph from reaching its intended influence under Layer C. For `find_decision` intent with graphWeight=0.50, graph can only contribute 0.05/0.50 = 10% of its intended weight. Theoretical max contribution across all mechanisms is 0.16 (0.03+0.03+0.05+0.05), so raising GRAPH_WEIGHT_CAP to 0.15 would sit just below theoretical max.

**Fix designed (P1-4):** See Section 9, Phase B.

[SOURCE: graph-calibration.ts:25, adaptive-fusion.ts weight profiles]

#### R3: Doc-Type Weight Shift is Not Proportional

A flat +/-0.1 shift causes disproportionate impact based on the base channel weight:
- Applied to a 0.2-base channel: +50% relative change
- Applied to a 0.4-base channel: +12.5% relative change
- Applied to a 0.8-base channel: +6.25% relative change

**Fix designed (P2-4):** See Section 9, Phase B.

[SOURCE: adaptive-fusion.ts:82-83, DOC_TYPE_WEIGHT_SHIFT]

### Feature Interaction Assessment

No dangerous interactions when multiple features are enabled simultaneously. The pipeline is well-ordered: each signal has its own application phase and independent capping. The G2 double-weighting guard prevents intent weight stacking in hybrid mode. The only interaction concern was P1-4 (intent weights expecting graph influence that caps prevent), resolved by the GRAPH_WEIGHT_CAP raise design.

[SOURCE: stage2-fusion.ts 12-step analysis, iteration 12]

### P1-3 Design: Direct Recency Fusion in Stage 2

**Problem**: Hybrid searches (default, most common) have NO direct per-result recency signal in Stage 2. Step 4 (intent weights) includes recency but is skipped for hybrid via G2 guard.

**Design**:
- **Injection point**: New step "1a" -- after session boost (step 1), before causal boost (step 2)
- **Function**: Reuse existing `computeRecencyScore()` from `folder-scoring.ts` (already imported at stage2-fusion.ts:80 but unused in hybrid path). Formula: `1 / (1 + days * 0.10)` -- constitutional tier exempt (always 1.0), invalid timestamp fallback (0.5)
- **Weight**: `RECENCY_FUSION_WEIGHT = 0.07` (env: `SPECKIT_RECENCY_FUSION_WEIGHT`)
- **Cap**: `RECENCY_FUSION_CAP = 0.10` (env: `SPECKIT_RECENCY_FUSION_CAP`)
- **Formula**: `bonus = min(cap, recencyScore * weight)`
- **Effect**: today +0.07, 7d +0.041, 30d +0.018
- **Additive** (not multiplicative): flat time bonus independent of base relevance, cap prevents runaway
- **Recency bias risk**: LOW -- max 7% boost cannot override strong semantic matches (0.85+0.07=0.92 vs 0.92 untouched)
- **Interaction with step 4**: For non-hybrid searches, memories get BOTH 1a (fusion recency) and step 4 (intent-weighted recency). Acceptable -- different concepts: "time freshness" vs "intent-relevance with recency as a dimension"

[SOURCE: stage2-fusion.ts:715-1102, folder-scoring.ts computeRecencyScore]

---

## 8. Cross-Cutting Concerns

### Performance and Timing Observability

Per-stage timing recorded for all 4 stages plus total, exposed via `PipelineResult.metadata.timing` with `includeTrace: true`. Channel-level tracking:
- Vector index: warns at >500ms (enriched) / >600ms (enhanced)
- Cross-encoder: last 100 latency samples with avg/P95/count, 5-minute result cache
- Local reranker: logs durationMs per batch with candidate counts
- Stage 1: records own durationMs in metadata

**Verdict**: Production-grade observability. No gaps.

[SOURCE: pipeline stages, cross-encoder.ts, vector-index-store.ts]

### Error Recovery: 3-Tier Degradation

| Tier | Scope | Behavior | Recovery Time |
|------|-------|----------|---------------|
| 1 -- Mandatory | Stage 1 (candidate gen) | Throws `PIPELINE_STAGE1_FAILED` | N/A |
| 2 -- Graceful | Stages 2/3/4 | Returns previous stage output with `degraded=true` | Immediate |
| 3 -- Circuit breaker | Cross-encoder API | Opens after 3 failures, 60s cooldown, positional fallback | 60 seconds |

Per-stage timeout: 10 seconds. Stages 2-4 are CPU-only (<100ms typical), so timeout is generous. Stage 1 is the heavy stage (embedding + multi-channel search).

**Gap identified**: No circuit breaker on embedding API path. If provider is down, every search waits full 10s timeout at Stage 1 before failing.

[SOURCE: pipeline/orchestrator.ts (195 lines)]

### Logging: Extensive but Unstructured

41+ `console.warn()` calls across pipeline with consistent `[module-name]` prefix. Every Stage 2 signal failure individually logged.

**Gaps**:
- No structured logging (JSON output, log levels, correlation IDs)
- No per-request summary log line
- No timing in signal failure warnings

[SOURCE: Grep for console.warn across search directory]

### SQLite Database Configuration

- WAL mode enforced on startup (T076 compliance)
- Foreign keys enabled via pragma
- `wal_checkpoint(FULL)` during checkpoint creation
- better-sqlite3 handles automatic WAL checkpointing
- Missing pragmas (cache_size, mmap_size, busy_timeout, synchronous) all use sensible SQLite defaults appropriate for database scale (<50MB, <500 memories)

[SOURCE: session-manager.ts init(), database setup]

### Environment Variable Documentation Gap

**113 unique SPECKIT_* env vars found across the codebase, only 4 documented in INSTALL_GUIDE.md (96% undocumented)**. The documented 4: ADAPTIVE_FUSION, EXTENDED_TELEMETRY, MEMORY_ROADMAP_PHASE, MEMORY_GRAPH_UNIFIED.

**Breakdown by domain (11 categories)**:

| Domain | Count | Examples |
|--------|-------|---------|
| Search Pipeline | 28 | SPECKIT_HYBRID_SEARCH, SPECKIT_CONFIDENCE_TRUNCATION |
| Cognitive/Adaptive | 14 | SPECKIT_RECONSOLIDATION, SPECKIT_SESSION_BOOST |
| Graph/Entity | 10 | SPECKIT_GRAPH_UNIFIED, SPECKIT_CAUSAL_BOOST |
| Feedback/Learning | 8 | SPECKIT_FEEDBACK_SIGNAL, SPECKIT_LEARNED_MODEL |
| UX/Response | 8 | SPECKIT_PROGRESSIVE_DISCLOSURE_V1, SPECKIT_INTENT_AUTO_PROFILE |
| Fusion/Ranking | 7 | SPECKIT_RECENCY_FUSION_WEIGHT, SPECKIT_GRAPH_WEIGHT_CAP |
| Query Processing | 7 | SPECKIT_QUERY_EXPANSION, SPECKIT_EMBEDDING_EXPANSION |
| Governance/Roadmap | 9 | SPECKIT_SCOPE_ENFORCEMENT, SPECKIT_GOVERNANCE_GUARDRAILS |
| Infrastructure/Config | 12 | SPECKIT_WAL_MODE, SPECKIT_VRULE_OPTIONAL |
| Indexing/Validation | 6 | SPECKIT_INDEX_SPEC_DOCS, SPECKIT_CONTENT_HASH |
| Reranker | 4 | SPECKIT_RERANKER_LOCAL, SPECKIT_CROSS_ENCODER |

Includes 2 deprecated vars: SPECKIT_EAGER_WARMUP, SPECKIT_LAZY_LOADING.

[SOURCE: Grep for SPECKIT_ across mcp_server with sort -u]

### Module-Level Cache Audit

12 module-level caches identified. 4 are unbounded (potential slow leak under high volume):

| Cache | Location | Bounded? | Fix |
|-------|----------|----------|-----|
| Cross-encoder result cache | `cross-encoder.ts:115` | NO | Apply enforceCacheBound(), MAX_CACHE_ENTRIES=200 |
| Co-activation cache | `co-activation.ts:80` | NO | Apply enforceCacheBound() |
| Tool cache | `tool-cache.ts:67` | NO | Audit and bound |
| Regex cache | Various | NO | Bounded by key space (finite patterns) |
| Graph signals cache | `graph-signals.ts` | YES | enforceCacheBound() already applied |
| Constitutional cache | WeakMap | YES | Automatically bounded |
| Session caches | WeakMap/TTL | YES | TTL-bounded |
| Spec folder cache | `Map<string>` | YES | Bounded by key space (finite folders) |

[SOURCE: Grep for cache/Map patterns across mcp_server, 12 modules]

---

## 9. Implementation Roadmap

### Phase A -- Feature Defaults (~1.5h, LOW risk)

| # | Item | Description | Effort |
|---|------|-------------|--------|
| DEF-2 | Enable QUALITY_LOOP default | Change `isQualityLoopEnabled()` to use `isFeatureEnabled()` in search-flags.ts. Verify `memory-save-ux-regressions.vitest.ts`. | ~30min |
| DEF-1 | Enable RECONSOLIDATION default | Change `isReconsolidationEnabled()` to use `isFeatureEnabled()`. Add auto-checkpoint creation in `reconsolidation-bridge.ts`. Update 3+ assertions in `search-flags.vitest.ts`, 3 in `reconsolidation.vitest.ts`. | ~1h |

**Rollback**: Set `SPECKIT_QUALITY_LOOP=false` or `SPECKIT_RECONSOLIDATION=false` via env var.

**User impact**: Quality enforcement may reject saves that previously got warnings only (desired behavior change). Test assertions will break (expected, update needed).

### Phase B -- Fusion Pipeline Refinements (~3h, LOW risk)

| # | Item | Description | Effort |
|---|------|-------------|--------|
| P1-4 | Raise GRAPH_WEIGHT_CAP | Change 0.05 to 0.15 in `graph-calibration.ts:25`. Per-mechanism caps (0.03, 0.05) remain as inner guards. Add 1-2 tests. Env-tunable via `SPECKIT_GRAPH_WEIGHT_CAP`. | ~30min |
| P2-4 | Proportional doc-type shift | Change flat +/-0.1 to 20% of base weight in `adaptive-fusion.ts:82-83`. Add 2-3 tests. | ~30min |
| P1-3 | Recency fusion signal | Add step 1a in `stage2-fusion.ts` (after session boost, before causal boost). Additive bonus using `computeRecencyScore()`, weight=0.07, cap=0.10. Env-tunable via SPECKIT_RECENCY_FUSION_WEIGHT/CAP. Add 3-4 tests. | ~2h |

**Rollback**: Set weight/cap env vars to 0, or revert constant changes.

**Dependency**: P1-3, P1-4, P2-4 all touch fusion scoring -- batch into one PR to minimize merge conflicts.

### Phase C -- UX Optimization (~2h, VERY LOW risk)

| # | Item | Description | Effort |
|---|------|-------------|--------|
| UX-1 | Intent-to-profile auto-routing | Connect `classifyIntent()` to `applyResponseProfile()` with 7-intent-to-4-profile mapping table. Injection at `memory-search.ts:597/1108`, `memory-context.ts:848/684`. Explicit profile param overrides. Env: SPECKIT_INTENT_AUTO_PROFILE. | ~1h |
| UX-2 | Attention-enriched auto-surface | Use `getSessionPromptContext()` top-N attention memories to 1.3x boost trigger-matched results in `memory-surface.ts`. | ~30min |
| CACHE-1 | Cross-encoder cache limit | Apply `enforceCacheBound()` pattern to Map at `cross-encoder.ts:115`. MAX_CACHE_ENTRIES=200. | ~30min |

**Rollback**: Env var toggle for UX-1/UX-2; revert for CACHE-1.

**Dependency**: UX-1 should precede UX-2 (attention hints benefit from auto-selected profiles).

### Phase D -- Cleanup (~45min, ZERO risk)

| # | Item | Description | Effort |
|---|------|-------------|--------|
| CLEAN-1 | Remove NOVELTY_BOOST dead code | Remove `calculateNoveltyBoost()` + 3 constants from `composite-scoring.ts`, ~200 lines of tests from `cold-start.vitest.ts`, env var from `search-flags.ts`, metadata fields (`noveltyBoostApplied`, `noveltyBoostValue`). | ~30min |
| CACHE-2 | Bound remaining caches | Bound co-activation cache (`co-activation.ts:80`) and tool-cache (`tool-cache.ts:67`) using enforceCacheBound() pattern. | ~15min |

**Rollback**: Re-add dead code (trivial).

### Phase E -- Infrastructure (~8-14h, MEDIUM risk)

| # | Item | Description | Effort |
|---|------|-------------|--------|
| INFRA-1 | Embedding API circuit breaker | Mirror cross-encoder circuit breaker pattern for embedding provider. Prevents 10s timeout per search when provider is down. | ~2h |
| INFRA-2 | Env var documentation | Catalog all 113 SPECKIT_* vars across 11 domains into central reference table (name, purpose, default, type). | ~4-6h |
| UX-3 | Spec neighborhood auto-loading | Auto-discover related specs via causal graph aggregation when specFolder provided. Requires spec-folder-level causal aggregation, summarization, integration into memory-context.ts. | ~4-6h |

**Rollback**: Feature flag for INFRA-1, documentation is additive for INFRA-2, feature flag for UX-3.

### Dependency Graph

```
Phase A (independent):
  DEF-2 ──> DEF-1 (shared test update pattern, batch for efficiency)

Phase B (batch into one PR):
  P1-4 ─┐
  P2-4 ─┼──> P1-3 (all touch fusion scoring)
         │
Phase C:
  UX-1 ──> UX-2 (attention hints benefit from auto-profiles)
  CACHE-1 (independent)

Phase D (independent):
  CLEAN-1, CACHE-2

Phase E (independent):
  INFRA-1, INFRA-2, UX-3
```

### Effort Summary

| Phase | Items | Effort | Risk | Rollback |
|-------|-------|--------|------|----------|
| A: Feature Defaults | 2 | ~1.5h | LOW | Env var override |
| B: Fusion Refinements | 3 | ~3h | LOW | Env var to 0 or revert constant |
| C: UX Optimization | 3 | ~2h | VERY LOW | Env var + explicit override |
| D: Cleanup | 2 | ~0.75h | ZERO | Re-add dead code |
| E: Infrastructure | 2-3 | ~8-14h | MEDIUM | Feature flag |
| **Phases A-D (ready)** | **10** | **~7.25h** | **LOW-to-ZERO** | |
| **Full backlog** | **13-14** | **~15-21h** | | |

---

## 10. Risk Assessment

### Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| RECONSOLIDATION merge corrupts data | Low | High | Auto-checkpoint guard ensures rollback point. `hasReconsolidationCheckpoint()` gate already exists. Test with checkpoint creation path. |
| QUALITY_LOOP rejects previously-accepted saves | Medium | Medium | Document behavior change. Users can opt-out via `SPECKIT_QUALITY_LOOP=false`. Monitor initial deployment for rejection rate. |
| Recency fusion biases toward recent memories | Low | Medium | Conservative parameters (weight=0.07, cap=0.10). Max 7% boost cannot override strong semantic matches. Env-tunable for adjustment. |
| GRAPH_WEIGHT_CAP raise causes ranking changes | Low | Low | Inner per-mechanism caps (0.03, 0.05) remain. Only affects high-graph-weight intents (find_decision). Env-tunable. |
| Test assertion breakage | Certain | Low | Expected and mapped. 5-8 assertions to update. Tracked in Test Impact Matrix. |
| Shallow clone fragility | Low | Medium | No current mutation of nested objects. Document as known fragility. Consider deep clone if Stage 2 grows. |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Unbounded cache memory growth | Medium (high volume) | Low-Medium | 4 unbounded caches identified. Fixes designed (Phases C-D). Graph-signals pattern available as template. |
| Embedding API outage blocks all search | Low-Medium | High | No circuit breaker on embedding path. Fix designed (Phase E, INFRA-1). Cross-encoder circuit breaker pattern available. |
| Env var misconfiguration | Medium | Low | 96% of vars undocumented. Fix designed (Phase E, INFRA-2). Module files have good inline comments as interim documentation. |

---

## 11. Test Impact Matrix

### Per-Change Test Impact

| Proposed Change | Existing Test? | Will Break? | Action Needed |
|----------------|---------------|-------------|---------------|
| P1-3: Recency fusion signal | NO | N/A | NEW: 3-4 tests in `stage2-fusion.vitest.ts` (varying timestamps, cap verification, interaction with graph bonus) |
| P1-4: GRAPH_WEIGHT_CAP 0.05->0.15 | PARTIAL (tests 0.03 cap, not 0.05) | NO | NEW: 1-2 tests for aggregate cap in graph-calibration |
| DEF-1: RECONSOLIDATION default-enable | YES (`search-flags.vitest.ts:77`) | YES (3+ assertions) | UPDATE: Change `toBe(false)` to `toBe(true)` in search-flags.vitest.ts lines 77, 117, 119-120; update reconsolidation.vitest.ts lines 228, 243, 248 |
| DEF-2: QUALITY_LOOP default-enable | INDIRECT (env setup/teardown) | POSSIBLY | VERIFY: Check if any assertion expects QUALITY_LOOP=false by default |
| P2-4: Doc-type proportional shift | NO | N/A | NEW: 2-3 tests for proportional shift in adaptive-fusion |
| CLEAN-1: NOVELTY_BOOST cleanup | YES (~200 lines) | YES (remove code) | REMOVE: Delete 2 describe blocks in cold-start.vitest.ts, remove metadata field assertions |
| UX-1: Intent-to-profile routing | NO | N/A | NEW: Tests for mapping table + override behavior |

### Key Test Files by Pipeline Stage

| Stage | Test File | Coverage Level |
|-------|-----------|---------------|
| Stage 1 (candidate gen) | `integration-search-pipeline.vitest.ts` | Module loading + input validation only |
| Stage 2 (fusion) | `stage2-fusion.vitest.ts` | Strong: feedback signals, graph rollout, degradation |
| Stage 3 (rerank) | `reranker.vitest.ts`, `cross-encoder.vitest.ts`, `mmr-reranker.vitest.ts` | Good: individual components |
| Stage 4 (filter) | No dedicated test file | Implicit via scoring/quality-filter tests |
| Feature flags | `search-flags.vitest.ts`, `graph-flags.vitest.ts`, `rollout-policy.vitest.ts` | Strong: defaults, toggles |
| Composite scoring | `composite-scoring.vitest.ts`, `five-factor-scoring.vitest.ts` | Strong: weight profiles |
| Reconsolidation | `reconsolidation.vitest.ts`, `assistive-reconsolidation.vitest.ts` | Strong: enable/disable, checkpoint |

### Integration Test Gap

The `integration-search-pipeline.vitest.ts` is a **module-loading smoke test only**. It does NOT exercise the full stage1->stage2->stage3->stage4 pipeline with fixture data. There is no integration test that sends a query through all 4 stages and verifies end-to-end score ordering. All proposed changes rely solely on unit-level tests for regression safety.

### Summary

- **NEW tests needed**: 3 suites (stage2 recency, graph-calibration cap, adaptive-fusion doc-type shift) + UX routing tests
- **EXISTING tests to UPDATE**: 5-8 assertions for default-enable changes
- **DEAD tests to REMOVE**: ~200 lines from `cold-start.vitest.ts` (NOVELTY_BOOST)

---

## 12. Convergence Report

### Research Trajectory

| Iteration | Focus | newInfoRatio | Status | Track |
|-----------|-------|-------------|--------|-------|
| 1 | Feature flag audit | 1.00 | complete | feature-flags |
| 2 | Fusion pipeline bugs | 0.83 | complete | pipeline-quality |
| 3 | Spec fix verification | 0.85 | complete | fix-verification |
| 4 | Hookless UX/auto-utilization | 0.91 | complete | ux-quality |
| 5 | Adaptive fusion + Code Graph/CocoIndex | 0.89 | complete | fusion-refinement |
| 6 | Edge case quality audit | 0.56 | complete | quality-audit |
| 7 | P1 refinement deep dive | 0.79 | complete | p1-refinement |
| 8 | P2 items deep dive | 0.57 | complete | p2-refinement |
| 9 | Search quality edge cases | 0.50 | complete | quality-edge-cases |
| 10 | Opt-in feature assessment | 0.64 | complete | feature-defaults |
| 11 | Stage 2 recency + default-enable design | 0.71 | complete | design-refinement |
| 12 | GRAPH_WEIGHT_CAP + feature interactions | 0.64 | complete | design-refinement |
| 13 | Test coverage analysis | 0.57 | complete | test-coverage |
| 14 | Cross-cutting concerns | 0.43 | complete | cross-cutting |
| 15 | Env var + cache audit | 0.43 | complete | optimization-audit |
| 16 | Hookless auto-utilization deep dive | 0.50 | complete | ux-optimization |
| 17 | Intent-to-profile + attention design | 0.57 | complete | ux-optimization |
| 18 | Implementation roadmap synthesis | 0.30 | thought | synthesis |
| 19 | Final validation | 0.21 | complete | validation |
| 20 | Final synthesis | -- | thought | synthesis |

### Key Metrics

- **Total iterations**: 20 (19 research + 1 synthesis)
- **Questions answered**: 10 of 10 original + 25+ sub-questions
- **Self-corrections**: 3 (causal-boost import, session-boost null safety, session state persistence)
- **Contradictions**: 0 remaining (all 3 self-corrections resolved with evidence)
- **Exhausted approaches**: 2 (null-pointer crash search, off-by-one filter errors)
- **Ruled out directions**: 2 (ADAPTIVE_RANKING=false as bug, governance flag discrepancy as bug)
- **Total findings**: ~130 across all iterations

### Convergence Pattern

The research followed a natural three-phase convergence:

1. **Discovery phase** (iterations 1-5): High newInfoRatio (0.83-1.00), answering core questions
2. **Refinement phase** (iterations 6-17): Variable ratio (0.43-0.79), deepening understanding and designing fixes
3. **Synthesis phase** (iterations 18-20): Low ratio (0.21-0.30), consolidating and validating

The spike at iteration 11 (0.71) represents the P1-3 recency fusion design breakthrough -- new synthesis from existing findings rather than new external information.

### Source Diversity

Research drew from multiple independent source types:
- **TypeScript source code**: Primary evidence for all technical claims (50+ files read)
- **Test files**: 100+ vitest files analyzed for coverage mapping
- **Configuration files**: opencode.json, search-flags.ts, rollout-policy.ts
- **Documentation**: INSTALL_GUIDE.md (env var audit)
- **Module headers**: I/O contracts, invariant documentation, JSDoc comments
- **Prior iteration findings**: Cross-referenced across 19 iterations for consistency

---

## Research Status

**COMPLETE.** All 10 key questions answered with evidence. All claims validated in iteration 19 verification pass. All P1/P2 items fully triaged. Edge case investigation complete. Test coverage mapped. Cross-cutting concerns audited. Hookless auto-utilization improvements identified and designed. No critical bugs found. Pipeline is functionally correct with comprehensive error handling.

**Ready for implementation**: 14 actionable items across 5 phases. Phases A-D (~7.25h, 10 items, LOW-to-ZERO risk) are fully designed with code locations, test updates, and rollback strategies.
