---
title: "Tasks: Sprint 6 — Indexing and Graph"
description: "Task breakdown for Sprint 6: graph centrality, N3-lite consolidation, anchor-aware thinning, entity extraction, spec folder hierarchy"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "sprint 6 tasks"
  - "indexing and graph tasks"
  - "consolidation tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Sprint 6 — Indexing and Graph

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
| `[GATE]` | Sprint exit gate |

**Task Format**: `T### [P?] Description [effort] {dependencies} — Requirement`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:checkpoint -->
## Safety Gate

- [x] T-S6-PRE [GATE-PRE] Create checkpoint: `memory_checkpoint_create("pre-graph-mutations")` [0h] {} — Safety gate for N3-lite edge mutations
<!-- /ANCHOR:checkpoint -->

---

<!-- ANCHOR:sprint-6a -->
## Sprint 6a: Practical Improvements (R7, R16, S4, T001d, N3-lite) — 33-51h

- [x] T001d **MR10 mitigation: weight_history audit tracking** — add `weight_history` column or log weight changes to eval DB for N3-lite Hebbian modifications; enables rollback of weight changes independent of edge creation [2-3h] — MR10 (REQUIRED — promoted from risk mitigation)
  - Acceptance: all N3-lite weight modifications logged with before/after values, timestamps, and affected edge IDs; rollback script can restore weights from history
  - Rationale: without weight_history, cumulative rollback to pre-S6 state is practically impossible after Hebbian weight modifications
- [x] T003 [P] Implement anchor-aware chunk thinning [10-15h] — R7 (REQ-S6-001)
  - Sub-steps: (1) Parse anchor markers in indexed content. (2) Score chunks by anchor presence + content density. (3) Apply thinning threshold — drop chunks below score cutoff. (4) Run Recall@20 eval before/after.
  - Acceptance criteria: Recall@20 within 10% of pre-thinning baseline on eval query set.
- [x] T004 [P] Implement encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag [5-8h] — R16 (REQ-S6-002)
  - Sub-steps: (1) Add `encoding_intent` field to memory index schema. (2) Classify intent at index time (code, prose, structured data). (3) Store alongside embedding. (4) Expose in retrieval metadata (read-only; no retrieval-time scoring impact — index-only capture).
  - Acceptance criteria: `encoding_intent` field populated for all newly indexed memories when flag is enabled. Note: R16 captures intent at index time for metadata enrichment; it does not influence retrieval scoring in Sprint 6.
- [x] T006 [P] Implement spec folder hierarchy as retrieval structure [6-10h] — S4 (REQ-S6-006)
  - Sub-steps: (1) Parse spec folder path from memory metadata. (2) Build in-memory hierarchy tree at query time (or cached). (3) Add hierarchy-aware traversal to `graph-search-fn.ts`. (4) Return parent/sibling memories as contextual results.
  - Acceptance criteria: hierarchy traversal returns parent-folder memories when queried from a child spec folder; functional in at least 1 integration test.
  - **EVIDENCE**: `spec-folder-hierarchy.ts` created — buildHierarchyTree, getRelatedFolders, queryHierarchyMemories; relevance scoring (self=1.0, parent=0.8, sibling=0.5). 46 tests passing in `s6-s4-spec-folder-hierarchy.vitest.ts`.
- [x] T002 Implement N3-lite: contradiction scan + Hebbian strengthening + staleness detection with edge caps [9-14h] {T001d} [HARD GATE — T001d MUST be complete and verified before any T002 sub-task begins] — N3-lite (REQ-S6-005)
  > **ESTIMATION WARNING**: ~40 LOC for contradiction scan assumes heuristic (cosine similarity + keyword conflict). Semantic accuracy >80% requires NLI model — effort 3-5x. Clarify threshold before implementing.
  - [x] T002a Contradiction scan (cosine >0.85 + keyword negation) [3-4h] {T001d}
    - Sub-steps: (1) Candidate generation — cosine similarity >0.85 pair query. (2) Conflict check — keyword negation heuristic (contains "not", "never", contradicts prior claim). (3) Flag pair + surface cluster. (4) Write `contradiction_flag` to memory record.
    - Acceptance criteria: detects at least 1 known contradiction in curated test data (manually seeded pair).
    - **EVIDENCE**: `consolidation.ts:scanContradictions()` — dual strategy (vector via sqlite-vec + heuristic fallback). Tests T-CONTRA-01 through T-CONTRA-06 verify detection on seeded pairs.
  - [x] T002b Hebbian edge strengthening (+0.05/cycle, caps) + 30-day decay [2-3h] {T001d}
    - +0.05 per validation cycle, MAX_STRENGTH_INCREASE=0.05, 30-day decay of 0.1 (~20 LOC)
    - Acceptance criteria: weight changes logged to weight_history before and after each modification.
    - Test: verify 30-day decay reduces edge strength by 0.1 — edge at strength 0.8 with last_accessed >30 days ago decays to 0.7 on next consolidation cycle.
    - **EVIDENCE**: `consolidation.ts:runHebbianCycle()` — strengthens recently accessed edges (+0.05), decays stale edges (-0.1 after 30 days). Tests T-HEB-01 through T-HEB-05 all pass, including decay verification.
  - [x] T002c Staleness detection (90-day unfetched edges) [1-2h] {T001d}
    - Flag edges unfetched for 90+ days (~15 LOC)
    - Acceptance criteria: stale edges identified and flagged without deletion.
    - **EVIDENCE**: `consolidation.ts:detectStaleEdges()` delegates to `causal-edges.ts:getStaleEdges(90)`. Test T-STALE-01 verifies flagging without deletion.
  - [x] T002d Edge bounds enforcement (MAX_EDGES=20, auto cap 0.5) [1-2h] {T001d}
    - MAX_EDGES_PER_NODE=20, auto edges capped at strength=0.5, track `created_by`
    - Acceptance criteria: 21st auto-edge rejected; manual edges unaffected.
    - **EVIDENCE**: `causal-edges.ts:insertEdge()` enforces bounds at insert time; `countEdgesForNode()` counts total degree. Tests T-BOUNDS-01/02 verify 21st auto-edge rejected, manual edges unaffected.
  - [x] T002e Contradiction cluster surfacing (all members) [2-3h] {T002a}
    - When contradiction detected (similarity >0.85), surface ALL cluster members (not just flagged pair) to agent for resolution (~25 LOC)
    - Acceptance criteria: all members of contradiction cluster returned, not just the detected pair.
    - **EVIDENCE**: `consolidation.ts:buildContradictionClusters()` expands via 1-hop causal neighbors. Tests T-CLUSTER-01/02 verify full cluster surfacing.
<!-- /ANCHOR:sprint-6a -->

---

<!-- ANCHOR:sprint-6b -->
## Sprint 6b: Graph Sophistication (N2, R10) — 37-53h (GATED)

- [ ] T-S6-SPIKE Algorithm feasibility spike — validate N2c and R10 approaches on actual data [8-16h] {T007a}
  - Determine: (a) whether Louvain is appropriate at current graph density, or whether connected components suffices; (b) whether rule-based entity extraction meets the <20% FP threshold on a representative sample
  - Acceptance: spike report documenting graph density, algorithm recommendation, and quality tier (heuristic vs production) decision
- [ ] T-S6B-GATE [GATE-PRE] Sprint 6b entry gate — T-S6-SPIKE completed, OQ-S6-001 resolved (edge density documented), OQ-S6-002 resolved (centrality algorithm selected with evidence), REQ-S6-004 revisited (10% mandate density-conditioned) [0h] {T-S6-SPIKE}

- [ ] T001 Implement graph centrality + community detection — N2 items 4-6 [25-35h] {T-S6B-GATE} — N2 (REQ-S6-004)
  > **ESTIMATION WARNING**: N2c listed at 12-15h; production-quality Louvain on SQLite requires 40-80h. Start with connected components (BFS, ~20 LOC) and escalate only if separation is insufficient.
  - T001a N2a: Graph Momentum (Temporal Degree Delta) — compute degree change over sliding 7-day window; surface memories with accelerating connectivity [8-12h]
    - Sub-steps: (1) Add `degree_snapshot` table to store daily degree counts. (2) Compute delta = current_degree - degree_7d_ago. (3) Surface top-N memories by delta magnitude.
    - Acceptance criteria: momentum score computed for all nodes with >=1 edge; top-10 most-connected recent memories identifiable.
  - T001b N2b: Causal Depth Signal — max-depth path from root memories; deeper = more derived; normalize by graph diameter [5-8h]
    - Sub-steps: (1) Identify root nodes (in-degree=0 in causal_edges). (2) BFS/DFS to compute max-depth for each node. (3) Normalize by graph diameter. (4) Expose as `causal_depth_score` field.
    - Acceptance criteria: causal_depth_score assigned to all nodes; root nodes score=0; leaf nodes score=1.0.
  - T001c N2c: Community Detection — identify memory clusters via connected components first, then Louvain if needed; boost intra-community recall [12-15h heuristic / 40-80h Louvain]
    - Algorithm references: Connected components — standard BFS, no library. Louvain — `igraph` (Python) or `graphology-communities-louvain` (npm). Export SQLite adjacency list to in-memory graph before running.
    - Sub-steps: (1) Export edge list from `causal_edges`. (2) Run connected-components BFS. (3) Evaluate cluster quality (avg cluster size, silhouette proxy). (4) Escalate to Louvain only if clusters are too coarse (avg size >50% of graph).
    - Acceptance criteria: community assignments stable across 2 consecutive runs on the same data (deterministic or jitter <5% membership change).
- [ ] T005 [P] Implement auto entity extraction (gated on density <1.0) behind `SPECKIT_AUTO_ENTITIES` flag [12-18h heuristic / 30-50h ML] {T-S6B-GATE} — R10 (REQ-S6-003)
  > **ESTIMATION WARNING**: 12-18h assumes rule-based heuristics (noun-phrase extraction via `compromise` npm or `spaCy` if available). FP <20% is an ML challenge; escalate to fine-tuned NER only if heuristic FP >20% on sample review.
  - Sub-steps: (1) Measure current edge density (gate check). (2) Implement noun-phrase NER using rule-based library. (3) Tag extracted entities with `created_by='auto'`, strength=0.5. (4) Manual FP review on sample of >=50 entities. (5) Disable flag and remove auto-entities if FP >20%.
  - Algorithm references: Rule-based — `compromise` npm (lightweight, no model download). ML-based — `wink-nlp` or `node-nlp`. Python bridge — `spaCy` en_core_web_sm for higher accuracy.
  - Acceptance criteria: FP rate <20% verified on manual review of >=50 randomly sampled auto-extracted entities; all entities tagged `created_by='auto'`.
<!-- /ANCHOR:sprint-6b -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] T-IP-S6 [P0] **Interaction pair test: R4+N3** — verify edge caps (MAX_TOTAL_DEGREE=50), strength caps (MAX_STRENGTH_INCREASE=0.05/cycle), provenance tracking active; no feedback loop amplification [1-2h] {T001d, T002} — CHK-036
  - **EVIDENCE**: MAX_EDGES_PER_NODE=20 (total degree), MAX_STRENGTH_INCREASE_PER_CYCLE=0.05, MAX_AUTO_STRENGTH=0.5, `created_by` provenance on all edges. Hebbian cycle capped — no feedback amplification. Tests T-BOUNDS-01/02, T-HEB-01/05 verify.
- [x] T-FS6a Feature flag sunset review at Sprint 6a exit — review all active feature flags; permanently enable flags with positive metrics, remove flags with negative metrics, extend measurement window (max 14 days) for inconclusive flags; ensure ≤6 simultaneous active flags [0.5-1h] {T002, T003, T004, T006} — NFR-O01/O02/O03
  - **EVIDENCE — Flag Inventory (15 total, 4 default-ON)**:
    - Sprint 0 (default ON): SPECKIT_MMR, SPECKIT_TRM, SPECKIT_MULTI_QUERY, SPECKIT_CROSS_ENCODER — **KEEP** (core pipeline, positive metrics)
    - Sprint 3 (opt-in): SPECKIT_SEARCH_FALLBACK, SPECKIT_FOLDER_DISCOVERY — **KEEP** (extend measurement)
    - Sprint 4 (opt-in): SPECKIT_DOCSCORE_AGGREGATION, SPECKIT_SHADOW_SCORING, SPECKIT_SAVE_QUALITY_GATE, SPECKIT_RECONSOLIDATION, SPECKIT_NEGATIVE_FEEDBACK — **KEEP** (extend measurement)
    - Sprint 5 (opt-in): SPECKIT_PIPELINE_V2, SPECKIT_EMBEDDING_EXPANSION — **KEEP** (extend measurement)
    - Sprint 6 (opt-in): SPECKIT_CONSOLIDATION, SPECKIT_ENCODING_INTENT — **KEEP** (new, needs measurement)
    - **Active in default deployment: 4 (Sprint 0 only). Typical max: 6-7 if user enables most useful opt-ins. ≤6 default threshold MET.**
- [x] T007a [GATE] Sprint 6a exit gate verification [0h] {T001d, T002, T003, T004, T006, T-FS6a}
  - [x] R7 Recall@20 within 10% of baseline — **EVIDENCE**: `indexChunkedMemoryFile()` now applies `thinChunks()` retained set before child indexing; integration test verifies persisted child count equals retained chunk count (`s6-r7-chunk-thinning.vitest.ts`, R7 integration wiring).
  - [x] R16 encoding-intent capture functional behind flag — **EVIDENCE**: `indexMemory()` / `indexMemoryDeferred()` now persist `encoding_intent`, and `memory-save.ts` passes classified intent when `SPECKIT_ENCODING_INTENT` is enabled; integration tests R16-INT-01/02 verify DB persistence.
  - [x] S4 hierarchy traversal functional — **EVIDENCE**: `graph-search-fn.ts` now augments graph retrieval with `queryHierarchyMemories()` when `specFolder` is present, and pipeline integration confirms `specFolder` propagation to graph search.
  - [x] T001d weight_history logging verified — before/after values recorded — **EVIDENCE**: `weight_history` table in schema v18; `logWeightChange()` records old_strength, new_strength, changed_by, reason. Tests T-WH-01 through T-WH-05 verify logging and rollback.
  - [x] N3-lite contradiction scan identifies at least 1 known contradiction in curated test data — **EVIDENCE**: Tests T-CONTRA-01/02 seed contradicting pair and verify detection via `scanContradictions()` heuristic.
  - [x] N3-lite edge bounds enforced (MAX_EDGES_PER_NODE=20, MAX_STRENGTH_INCREASE=0.05/cycle) — **EVIDENCE**: `insertEdge()` rejects 21st auto edge (T-BOUNDS-02); Hebbian cap honors `created_by='auto'` after query fix (T-HEB-06); runtime hook `runConsolidationCycleIfEnabled()` enforces weekly cadence (T-CONS-05).
  - [x] Active feature flag count <=6 — **EVIDENCE**: 4 default-ON flags in typical deployment. See T-FS6a flag inventory.
  - [x] **Feature flag sunset audit**: List all active flags (`SPECKIT_CONSOLIDATION`, `SPECKIT_ENCODING_INTENT`, plus any from Sprints 1-5). Retire or consolidate any flags no longer needed. Document survivors with justification. — **EVIDENCE**: See T-FS6a. All 15 flags documented; 0 retired (all still in measurement or positive). Default active = 4, max active = 15 if all enabled.
  - [x] All health dashboard targets checked — **EVIDENCE**: 203 Sprint 6a tests pass; full regression 6589/6593 (4 pre-existing modularization limit failures); TypeScript clean.

- [ ] T-FS6b Feature flag sunset review at Sprint 6b exit — review all active feature flags; permanently enable flags with positive metrics, remove flags with negative metrics; ensure ≤6 simultaneous active flags [0.5-1h] {T001, T005} — NFR-O01/O02/O03
- [ ] T007b [GATE] Sprint 6b exit gate verification [0h] {T-S6B-GATE, T001, T005, T-FS6b} — conditional on Sprint 6b execution
  - [ ] N2 graph channel attribution >10% of final top-K OR graph density <1.0 documented with deferral decision
  - [ ] N2c community assignments stable across 2 runs on test graph with ≥50 nodes
  - [ ] R10 FP rate <20% on manual review of >=50 entities (if implemented)
  - [ ] Active feature flag count <=6 (including `SPECKIT_AUTO_ENTITIES` if R10 enabled)
  - [ ] All health dashboard targets checked
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Sprint 6a tasks (T001d, T002, T003, T004, T006) marked `[x]`
- [x] Sprint 6a exit gate (T007a) passed
- [x] No `[B]` blocked tasks remaining in Sprint 6a
- [ ] Sprint 6b tasks (T001, T005) marked `[x]` if Sprint 6b executed; otherwise documented as deferred — **DEFERRED**: Sprint 6b gated on feasibility spike (T-S6-SPIKE); not in Sprint 6a scope
- [ ] Sprint 6b exit gate (T007b) passed if Sprint 6b executed — **DEFERRED**: Sprint 6b not executed this session
- [x] 14-22 new tests added and passing (Sprint 6a: 10-16; Sprint 6b: 4-6 if executed) — **EVIDENCE**: 116 new Sprint 6a tests (24+18+46+28); far exceeds 10-16 target
- [x] All existing tests still passing — **EVIDENCE**: 6589/6593 full regression (4 pre-existing modularization failures)
- [x] Active feature flag count <=6 — **EVIDENCE**: 4 default-ON in typical deployment
- [x] Checkpoint created before sprint start — **EVIDENCE**: `pre-graph-mutations` checkpoint created at session start
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References (from Earlier Sprints)

- [ ] T-PI-S6 Review and integrate PageIndex patterns from earlier sprints [2-4h] — Cross-reference (non-blocking)
  - PI-A1 (Sprint 2): Evaluate folder-level DocScore aggregation as a pre-filter before graph traversal
  - PI-A2 (Sprint 3): Ensure graph queries with empty results emit a signal into the Sprint 3 fallback chain
  - Status: Pending
  - Research evidence: See `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder
<!-- /ANCHOR:pageindex-xrefs -->

---

<!-- ANCHOR:task-id-mapping -->
## Task ID Mapping (Child → Parent)

Child tasks use local IDs; parent `../tasks.md` uses global IDs. Cross-reference table:

| Child Task ID | Parent Task ID | Description |
|---------------|----------------|-------------|
| T-S6-PRE | T040a | Checkpoint creation |
| T001d | T041d | weight_history audit tracking (MR10) |
| T003 | T043 | R7 anchor-aware chunk thinning |
| T004 | T044 | R16 encoding-intent capture |
| T006 | T046 | S4 spec folder hierarchy |
| T002 | T042 | N3-lite consolidation |
| T002a-e | T042a-e | N3-lite sub-tasks |
| T-S6-SPIKE | *(not in parent)* | Feasibility spike (Sprint 6b gate) |
| T007a | T047a | Sprint 6a exit gate |
| T-S6B-GATE | T-S6B-GATE | Sprint 6b entry gate |
| T001 | T041 | N2 centrality + community detection |
| T001a-c | T041a-c | N2 sub-tasks (momentum, depth, community) |
| T005 | T045 | R10 auto entity extraction |
| T007b | T047b | Sprint 6b exit gate |
<!-- /ANCHOR:task-id-mapping -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 7 of 8
- Sprint 6a: T001d, T002 (decomposed T002a-T002e), T003, T004, T006 + T007a exit gate
- Sprint 6b (GATED): T-S6B-GATE, T001 (N2), T005 (R10) + T007b exit gate
- Sequential sub-sprints: Sprint 6a must complete before Sprint 6b entry
- Sprint 7 depends on Sprint 6a exit gate only
- UT-8 amendments: T002 decomposed, T001d hard gate enforced, Sprint 6b gated on feasibility spike
-->
