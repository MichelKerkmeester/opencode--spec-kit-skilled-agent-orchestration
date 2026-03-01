---
title: "Tasks: Sprint 3 — Query Intelligence"
description: "Task breakdown for query complexity routing, RSF evaluation, and channel min-representation."
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "sprint 3 tasks"
  - "query intelligence tasks"
  - "complexity router tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Sprint 3 — Query Intelligence

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

**Task Format**: `T### [P?] Description (file path) [effort] — requirement`

**Dependency Format**: `{T###}` = depends on task T###
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: R15 Query Complexity Router

### R15 Subtask Decomposition

- [x] T001a [P] Define classifier boundaries and feature design — query length (chars), term count (whitespace-split), trigger phrase presence (exact match), semantic complexity heuristic (stop-word ratio). Classification boundaries: simple (≤3 terms OR trigger match), complex (>8 terms AND no trigger), moderate (interior). Config-driven thresholds. [2-4h] — R15
  - **Acceptance**: Classifier correctly assigns 10+ test queries per tier

- [x] T001b Implement tier-to-channel-subset routing and flag wiring — map classification tiers to channel subsets (simple=2, moderate=3-4, complex=5), enforce minimum 2 channels, add `SPECKIT_COMPLEXITY_ROUTER` flag [3-4h] {T001a} — R15
  - **Acceptance**: Routing table is config-driven, not hardcoded; min-2-channel invariant holds

- [x] T001c Integrate classifier into pipeline entry point — wire classifier+router into the existing pipeline, ensure both full pipeline and routed pipeline can run simultaneously [2-4h] {T001b} — R15
  - **Acceptance**: Pipeline accepts classifier output and routes to correct channel subset

- [x] T001d Shadow comparison run and p95 latency verification — run both full pipeline and routed pipeline simultaneously, compare results, verify p95 <30ms for simple queries [1-2h] {T001c} — R15
  - **Acceptance**: Shadow-run confirms no recall degradation; p95 <30ms verified
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: R14/N1 Relative Score Fusion

- [x] T002a [P] Implement RSF single-pair variant — foundation implementation of Relative Score Fusion for a single pair of ranked lists, behind `SPECKIT_RSF_FUSION` flag [4-5h] — R14/N1
  - **Acceptance**: Single-pair RSF produces valid fused ranking; output clamped to [0,1]

- [x] T002b Implement RSF multi-list variant — extend RSF to handle multiple ranked lists simultaneously [3-5h] {T002a} — R14/N1
  - **Acceptance**: Multi-list variant produces consistent results with single-pair on 2-list input

- [x] T002c Implement RSF cross-variant variant — cross-variant RSF for comparing results across different fusion strategies [3-4h] {T002b} — R14/N1
  - **Acceptance**: Cross-variant RSF runs in shadow mode alongside RRF; results logged
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: R2 Channel Min-Representation

- [x] T003a [P] Implement post-fusion channel representation check — scan top-k results for channel diversity, identify under-represented channels that returned results [2-4h] {T001d} — R2
  - **Acceptance**: Representation check correctly identifies channels with <1 result in top-k

- [x] T003b Implement quality floor enforcement and flag wiring — promote under-represented channel results only if score >= 0.2, add `SPECKIT_CHANNEL_MIN_REP` flag, skip enforcement for channels that returned no results [2-4h] {T003a} — R2
  - **Acceptance**: Quality floor prevents low-quality promotion; flag gates all R2 behavior; empty channels excluded

- [x] T003c Verify R2 precision impact — measure top-3 precision with R2 enabled vs baseline, confirm within 5% [2-3h] {T003b} — R2
  - **Acceptance**: Top-3 precision within 5% of baseline; regression test added
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-3b -->
## Phase 3b: Query Optimization

- [x] T006 Implement confidence-based result truncation — adaptive top-K cutoff based on score confidence gap between consecutive results [5-8h] {T001d} — R15 extension
  - Score gap threshold: if gap between rank N and N+1 exceeds 2x median gap, truncate at N
  - Must respect minimum result count (3) regardless of confidence
- [x] T007 [P] Implement dynamic token budget allocation — adjust returned context size by query complexity tier [3-5h] {T001d} — R15 extension (FUT-7)
  - Simple: 1500 tokens | Moderate: 2500 tokens | Complex: 4000 tokens
  - Budget applies to total returned content, not per-result
<!-- /ANCHOR:phase-3b -->

---

<!-- ANCHOR:pageindex -->
## PageIndex Tasks

- [ ] ~~T008~~ **DEFERRED** — PI-A2 search strategy degradation fallback chain deferred from Sprint 3. Will be re-evaluated after Sprint 3 using measured frequency of low-result (<3) and low-similarity (<0.4) query outcomes from Sprint 0-3 data. See UT review R1.
- [x] T009 [P] [P2] Implement PI-B3 description-based spec folder discovery — generate 1-sentence descriptions from spec.md per folder, cache in descriptions.json, integrate lookup into memory_context orchestration layer before vector queries [4-8h] — PI-B3
<!-- /ANCHOR:pageindex -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Shadow Comparison + Verification

- [x] T004 Run shadow comparison: RSF vs RRF on 100+ queries, compute Kendall tau [included] {T002c}
- [x] T-IP-S3 [P0] **Interaction pair test: R15+R2** — verify R15 minimum = 2 channels even for "simple" tier; R2 channel-minimum representation not violated by R15 routing [1-2h] {T001d, T003c} — CHK-037
- [x] T-FS3 Feature flag sunset review at Sprint 3 exit — review all active feature flags; permanently enable flags with positive metrics, remove flags with negative metrics, extend measurement window (max 14 days) for inconclusive flags; ensure ≤6 simultaneous active flags [0.5-1h] {T004} — NFR-O01/O02/O03
- [x] T005 [GATE] Sprint 3 exit gate + off-ramp evaluation [0h] {T001d, T002c, T003c, T004, T006, T007, T-FS3}
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P1 tasks T001a-T001d, T002a-T002c, T003a-T003c, T004-T007 marked `[x]`
- [x] P2 task T009 (PI-B3) completed or deferred with documented reason
- [x] No `[B]` blocked tasks remaining
- [x] R15 p95 <30ms for simple queries verified
- [x] RSF Kendall tau computed (tau <0.4 = reject RSF)
- [x] R2 top-3 precision within 5% of baseline verified
- [x] Off-ramp evaluated: MRR@5 >= 0.7, constitutional >= 95%, cold-start >= 90%
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:task-id-mapping -->
## Task ID Mapping (Child → Parent)

Child tasks use local IDs; parent `../tasks.md` uses global IDs. Cross-reference table:

| Child Task ID | Parent Task ID | Description |
|---------------|----------------|-------------|
| T001a-d | T021 | Query complexity router (R15) |
| T002a-c | T022 | RSF fusion variants (R14/N1) |
| T003a-c | T023 | Channel min-representation (R2) |
| T004 | T024 | Shadow comparison RSF vs RRF |
| T006 | T025a | Confidence-based result truncation (R15 ext) |
| T007 | T025b | Dynamic token budget allocation (FUT-7) |
| T008 | PI-A2 | DEFERRED — search strategy fallback (PI-A2) |
| T009 | PI-B3 | Description-based spec folder discovery (PI-B3) |
| T-IP-S3 | *(not in parent)* | Interaction pair test R15+R2 (CHK-037) |
| T-FS3 | T-FS3 | Feature flag sunset review (Sprint 3 exit) |
| T005 | T025 | Sprint 3 exit gate + off-ramp evaluation |
<!-- /ANCHOR:task-id-mapping -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 4 of 8
- Sprint 3: Query Intelligence
- 16 active tasks (T001a-d, T002a-c, T003a-c, T004-T007, T009, T-IP-S3, T-FS3) across 5 phases + PageIndex section (T008/PI-A2 deferred)
-->
