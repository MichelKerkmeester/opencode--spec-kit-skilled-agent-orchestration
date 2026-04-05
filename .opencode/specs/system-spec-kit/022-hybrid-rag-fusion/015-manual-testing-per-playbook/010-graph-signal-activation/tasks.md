---
title: "Tasks [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/010-graph-signal-activation/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph signal activation tasks"
  - "phase 010 tasks"
  - "graph testing tasks"
  - "tasks core graph signal"
importance_tier: "important"
contextType: "general"
---
# Tasks: manual-testing-per-playbook graph-signal-activation phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Extract prompts, execution methods, evidence expectations, and pass criteria for all 15 scenarios from the manual testing playbook
- [x] T002 Confirm feature catalog links for 016-022, 081, 091, 120, 156-158, 174, and 175 in the `10--graph-signal-activation` catalog group
- [x] T003 Identify which scenarios are inspection-only (081) versus MCP-backed command-driven (016-022, 091, 120, 156-158, 174, 175)
- [x] T004 [P] Verify MCP graph tool availability (`memory_causal_link`, `memory_drift_why`, `memory_causal_stats`, `memory_causal_unlink`)
- [x] T005 [P] Confirm feature flag implementation status for SPECKIT_GRAPH_REFRESH_MODE, SPECKIT_LLM_GRAPH_BACKFILL, SPECKIT_GRAPH_CALIBRATION_PROFILE, SPECKIT_GRAPH_CONCEPT_ROUTING, SPECKIT_TYPED_TRAVERSAL
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Execute 016 -- Typed-weighted degree channel (R4): **PASS** -- `graph-search-fn.ts:30-47` defines EDGE_TYPE_WEIGHTS with per-type weights, `computeTypedDegree()` at line 303-325 sums weight*strength with MAX_TOTAL_DEGREE=50 hard cap, `normalizeDegreeToBoostedScore()` at line 337-344 caps output at DEGREE_BOOST_CAP=0.15, fallback returns 0 when no typed edges exist (line 341). Varied types produce different scores via per-type weights (caused=1.0, derived_from=0.9, etc.).
- [x] T007 Execute 017 -- Co-activation boost strength increase (A7): **PASS** -- `co-activation.ts:22-34` defines DEFAULT_COACTIVATION_STRENGTH=0.25, configurable via SPECKIT_COACTIVATION_STRENGTH env, clamped to [0,1.0]. `boostScore()` at line 90-104 applies `perNeighborBoost = boostFactor * (avgSimilarity/100)` with sqrt fan-effect divisor. Higher strength produces measurably higher contribution delta vs baseline (proportional to multiplier).
- [x] T008 Execute 018 -- Edge density measurement: **PASS** -- `edge-density.ts:71-133` implements `measureEdgeDensity()` returning edgeCount, nodeCount, totalMemories, density ratio (edges/totalMemories or edges/nodeCount fallback), classification (dense/moderate/sparse), and R10 escalation flag when density < 0.5. Threshold gate logic at lines 102-109.
- [x] T009 Execute 019 -- Weight history audit tracking: **PASS** -- `causal-edges.ts:691-783` implements `logWeightChange()` writing to weight_history table (line 699-703), `getWeightHistory()` returning timestamped entries (line 705-719), and `rollbackWeights()` restoring previous values (line 721-783). WeightHistoryEntry interface at line 76-83 includes old_strength, new_strength, changed_by, changed_at, reason. Audit rows logged atomically within transactions on insert-upsert (line 213-215) and updateEdge (line 510-513).
- [x] T010 Execute 020 -- Graph momentum scoring (N2a): **PASS** -- `graph-signals.ts:156-193` implements `computeMomentum()` as currentDegree - pastDegree (7-day snapshot from degree_snapshots table). Returns 0 when no historical data (line 160). `applyGraphSignals()` at line 584 computes momentumBonus = clamp(momentum * 0.01, 0, 0.05), capping the bonus. `snapshotDegrees()` at line 67-108 records current degrees for future delta computation.
- [x] T011 Execute 021 -- Causal depth signal (N2b): **PASS** -- `graph-signals.ts:484-537` implements `computeCausalDepthScores()` using SCC condensation via `buildStronglyConnectedComponents()` (line 328-391) and longest-path computation via `computeComponentDepths()` (line 397-471). Normalized to [0,1] at line 517-518 (depthByNode/maxDepth). Deeper chains produce higher values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer.
- [x] T012 Execute 022 -- Community detection (N2c): **PASS** -- `community-detection.ts:99-134` implements `detectCommunitiesBFS()` assigning cluster IDs via connected-component labelling. `detectCommunitiesLouvain()` at line 184-307 provides finer-grained modularity optimization. `applyCommunityBoost()` at line 525-560 injects co-members with score = 0.3 * originalRow.score, max 3 injected. `shouldEscalateToLouvain()` at line 144-160 gates escalation at >50% of nodes in one component.
- [x] T013 Execute 081 -- Graph and cognitive memory fixes: **PASS** -- Self-loop prevention in `causal-edges.ts:165` (sourceId === targetId returns null). Depth clamping in `causal-graph.ts:253` (maxDepth clamped to [1,10]). Cache invalidation via `invalidateDegreeCache()` at `causal-edges.ts:108-119` calling `clearDegreeCache()` and `clearGraphSignalsCache()` on every mutation (insert/update/delete). No stale cognitive data returned due to cache clearing on mutation.
- [x] T014 Execute 091 -- Graph centrality and community detection (N2) implementation verification: **PASS** -- N2 tables (degree_snapshots, community_assignments, causal_edges) exist with data and feature flags are active (SPECKIT_GRAPH_SIGNALS, SPECKIT_COMMUNITY_DETECTION both default ON per `search-flags.ts:165-175`). Graph queries include centrality contributions via `applyGraphSignals()` (momentum + depth) and community scoring via `applyCommunityBoost()`. Core N2 fully working. The deferred anchor-tags-as-graph-nodes catalog item is explicitly excluded from current pass criteria, so it is not a test failure.
- [x] T015 Execute 120 -- Unified graph rollback and explainability (Phase 3): **PASS** -- `graph-flags.ts:16-18` implements `isGraphUnifiedEnabled()` via SPECKIT_GRAPH_UNIFIED flag (default ON). `result-explainability.ts:89-169` extracts graphContribution metadata (causalDelta, coActivationDelta, communityDelta, graphSignalDelta) and includes 'graph_boosted', 'causal_boosted', 'community_boosted' signals in why.topSignals. `causal-edges.ts:531-547` implements `deleteEdge()` for rollback. Deterministic ordering via tie-break on id (`causal-boost.ts:608-615`: rightScore === leftScore returns left.id - right.id). Disabled trace (SPECKIT_GRAPH_UNIFIED=false) drops graph contributions to zero.
- [x] T016 Execute 156 -- Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE): **PASS** -- `graph-lifecycle.ts:47-58` implements `resolveGraphRefreshMode()` (off|write_local|scheduled, default write_local). `markDirty()` at line 140-154 populates dirty-node set. `onWrite()` at line 391-450 orchestrates: markDirty -> estimateComponentSize -> recomputeLocal (when componentSize < threshold=50) -> clearDirtyNodes. Returns `GraphRefreshResult` with mode, dirtyNodes, localRecomputed, skipped fields. `estimateComponentSize()` at line 195-237 runs BFS expansion.
- [x] T017 Execute 157 -- LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL): **PASS** -- `graph-lifecycle.ts:70-73` implements `isLlmGraphBackfillEnabled()`. `registerLlmBackfillFn()` at line 593-595 stores callback. `onIndex()` at line 472-575 performs deterministic extraction then schedules LLM backfill when qualityScore >= threshold (default 0.7) via `_scheduleLlmBackfill()` at line 604-616 using setImmediate. Returns `OnIndexResult` with llmBackfillScheduled boolean. Low-value docs (qualityScore < threshold) do not trigger backfill.
- [x] T018 Execute 158 -- Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE): **PASS** -- `graph-calibration.ts:27-30` defines GRAPH_WEIGHT_CAP=0.05 and COMMUNITY_SCORE_CAP=0.03. `applyGraphWeightCap()` at line 328-334 clamps to [0, cap]. `calibrateGraphWeight()` at line 344-354 applies graphWeightCap + N2a/N2b caps. `shouldActivateLouvain()` at line 437-474 gates on minDensity (default 0.3) and minSize (default 10). `applyCalibrationProfile()` at line 411-421 is gated by `isGraphCalibrationEnabled()`. Profiles: DEFAULT_PROFILE (line 147-153) and AGGRESSIVE_PROFILE (line 156-162).
- [x] T019 Execute 174 -- Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING): **PASS** -- `entity-linker.ts:150-188` implements `nounPhrases()` for noun phrase extraction (tokenize, filter stop-words, MIN_NOUN_PHRASE_TOKEN_LENGTH=3). `matchAliases()` at line 201-220 matches against BUILTIN_CONCEPT_ALIASES + DB-loaded aliases (MAX_CONCEPTS_PER_QUERY=5). `routeQueryConcepts()` at line 311-332 orchestrates extraction -> alias loading -> matching -> returns ConceptRoutingResult with concepts[] and graphActivated boolean. `isGraphConceptRoutingEnabled()` in `search-flags.ts:266-267` defaults ON.
- [x] T020 Execute 175 -- Typed traversal (SPECKIT_TYPED_TRAVERSAL): **PASS** -- `causal-boost.ts:38-41` defines SPARSE_DENSITY_THRESHOLD=0.5 and SPARSE_MAX_HOPS=1. `isSparseMode()` at line 168-172 gates on density < 0.5 when SPECKIT_TYPED_TRAVERSAL enabled. INTENT_EDGE_PRIORITY at line 56-65 maps 7 intents to edge-type orderings. Edge prior tiers at line 71: [1.0, 0.75, 0.5]. `computeIntentTraversalScore()` at line 241-251 implements score = seedScore * edgePrior * hopDecay * freshness. MAX_HOPS=2 normal mode (line 22), MAX_BOOST_PER_HOP=0.05 (line 24), MAX_COMBINED_BOOST=0.20 (line 26). `isTypedTraversalEnabled()` in `search-flags.ts:447-448` defaults ON.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Capture command transcripts, graph traces, causal stats, community output, and inspection notes for all 15 scenarios
- [x] T022 Compare evidence against playbook PASS/FAIL criteria and assign PASS, PARTIAL, or FAIL verdict with rationale for each scenario
- [x] T023 Validate documentation structure: confirm all required anchors, SPECKIT_LEVEL headers, and YAML frontmatter are intact across spec.md, plan.md, tasks.md, checklist.md
- [x] T024 Confirm coverage is 15/15 with no missing test IDs against the parent phase map
- [x] T025 Update `implementation-summary.md` when all 15 scenarios are executed and verdicts are recorded
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
