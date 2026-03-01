---
title: "Implementation Plan: Sprint 7 — Long Horizon"
description: "Memory summaries, smarter content generation, cross-document entity linking, full reporting with ablation studies, and R5 INT8 quantization evaluation."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases:
  - "sprint 7 plan"
  - "long horizon plan"
  - "R5 evaluation plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Sprint 7 — Long Horizon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Node.js MCP server |
| **Storage** | SQLite (better-sqlite3), FTS5, sqlite-vec |
| **Testing** | Vitest |

### Overview

This plan implements Sprint 7 — the final sprint addressing scale-dependent features and evaluation completion. All items are parallelizable with no internal dependencies: R8 memory summaries (gated on >5K memories), S1 smarter content generation, S5 cross-document entity linking, R13-S3 full reporting + ablation studies, and R5 INT8 quantization evaluation.

**Conditional Effort Scenarios:**

| Scenario | Scope | Effort |
|----------|-------|--------|
| Minimum viable (current scale) | R13-S3 + T005a + T005 + DEF-014 | 16-22h |
| Realistic (without R8) | All items except R8 | 33-48h |
| Full (R8 + S5 gates met) | All items | 48-68h |

> **GATING AND OPTIONALITY NOTE**: Sprint 7 is entirely P2/P3 priority and gated on >5K active memories with embeddings (current system estimate: <2K). All items are optional and should only be pursued if Sprint 0-6 metrics demonstrate clear need. R8 (PageIndex integration) is particularly conditional — the tree-navigation approach must be validated against the 500ms p95 latency hard limit before any R8 implementation begins. S5 (cross-document entity linking) is similarly gated — activates only if >1K active memories with embeddings OR >50 verified entities; below threshold, document as skipped. Do not plan Sprint 7 capacity unless scale thresholds are confirmed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sprint 6a graph deepening complete and exit gate passed (depends on S6a only, not S6b)
- [ ] Evaluation infrastructure fully operational (Sprint 0 + Sprint 4 enhancements)
- [ ] Memory count confirmed: `SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'` — R8 activates only if result >5K
- [ ] Search latency and embedding dimensions measured for R5 gating decisions
- [ ] S5 scale gate measured: active memory count (>1K threshold) and verified entity count (>50 threshold) — S5 activates only if either threshold met
- [ ] All prior sprint feature flags inventoried for sunset audit

### Definition of Done
- [ ] All Sprint 7 requirements verified
- [ ] R13-S3 full reporting operational with ablation framework
- [ ] R5 decision documented with measured activation criteria
- [ ] Program completion: all health dashboard targets reviewed
- [ ] Final feature flag audit: sunset all sprint-specific flags
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Independent parallel items — no internal dependencies

### Key Components
- **Summary generation module** (R8): New module for memory summary generation with pre-filter integration into search pipeline. Gated on >5K memories.
- **Content generation handlers** (S1): Enhanced markdown-to-memory content conversion with improved quality heuristics
- **Entity linking module** (S5): Cross-document entity resolution and linking, coordinates with R10 auto-extracted entities from Sprint 6
- **Eval infrastructure** (R13-S3): Full reporting dashboard + ablation study framework — enables per-channel and per-sprint attribution
- **R5 evaluation** (decision only): Measure activation criteria (memory count, latency, dimensions) — implement INT8 ONLY if criteria met

### Data Flow
1. **R8**: Memory index → summary generation → pre-filter integration → reduced candidate set for search
2. **S1**: Raw markdown → improved content extraction → higher-quality memory content
3. **S5**: Entity extraction (R10) → cross-document entity resolution → entity link graph
4. **R13-S3**: Eval DB → full reporting dashboard → ablation study framework → per-component attribution
5. **R5**: Metrics measurement → activation criteria check → decision documentation

### R5 INT8 Quantization Details
- **Activation criteria**: >10K memories OR >50ms search latency OR >1536 embedding dimensions
- **Implementation constraint**: Use custom quantized BLOB — NOT sqlite-vec's `vec_quantize_i8`
- **Calibration**: Preserve Spec 140's KL-divergence calibration note
- **Recall risk**: 5.32% recall loss documented — acceptable only if activation criteria met
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

All items are parallelizable — no dependencies between them.

### R8: Memory Summary Generation (gated on >5K active memories with embeddings) — 15-20h
> **Prerequisite**: Confirm scale gate before any implementation. Run `SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'`. If result <5K, document skip decision and do not proceed.
> **Risk note**: PageIndex tree-navigation must be validated against 500ms p95 latency limit before integration. Measure latency impact on a representative corpus before enabling `SPECKIT_MEMORY_SUMMARIES`.
- [ ] Confirm scale gate (memory count query above)
- [ ] Design summary generation algorithm (extractive summarization or TF-IDF key-sentence extraction)
- [ ] Implement summary generation module
- [ ] Validate pre-filter latency: p95 must remain <500ms
- [ ] Integrate pre-filter into search pipeline (only if latency constraint met)
- [ ] Gate: Skip if <5K memories — document decision with query result

### S1: Smarter Content Generation — 8-12h
- [ ] Analyze current markdown-to-content conversion limitations
- [ ] Implement improved content extraction heuristics
- [ ] Verify quality improvement via manual review

### S5: Cross-Document Entity Linking (gated on >1K active memories OR >50 verified entities) — 8-12h
> **Prerequisite**: Confirm scale gate before any implementation. Measure active memory count (`SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'`) and verified entity count. If neither threshold met (>1K memories OR >50 entities), document skip decision and do not proceed.
> **Feature flag**: `SPECKIT_ENTITY_LINKING` — all entity linking behavior gated behind this flag for rollback capability.
- [ ] Confirm scale gate (memory count + entity count queries above)
- [ ] Design entity resolution strategy (coordinates with R10 output)
- [ ] Implement cross-document entity matching behind `SPECKIT_ENTITY_LINKING` flag
- [ ] Create entity link graph connections
- [ ] Gate: Skip if thresholds not met — document decision with query results

### R13-S3: Full Reporting + Ablation Studies — 12-16h
- [ ] Implement full reporting dashboard
- [ ] Build ablation study framework (per-channel, per-sprint attribution)
- [ ] Integrate with existing eval infrastructure

### R5: INT8 Quantization Evaluation — 2h
- [ ] Measure current memory count, search latency, embedding dimensions
- [ ] Evaluate against activation criteria (>10K memories OR >50ms latency OR >1536 dimensions)
- [ ] Document decision with rationale (even if criteria NOT met — document the measurements)
- [ ] If criteria met: implement using custom quantized BLOB (not `vec_quantize_i8`); preserve original float vectors before quantization

### Final Feature Flag Sunset — included in R13-S3 or standalone
> **Flag sunset prerequisite**: Before program completion, inventory all feature flags from Sprints 0-7. Retire or consolidate flags that are no longer needed. Document survivors with justification. Target: zero sprint-specific temporary flags at program completion.
- [ ] Inventory all active flags across Sprints 0-7
- [ ] Retire or consolidate flags with no ongoing purpose
- [ ] Document final flag list with justification for each survivor
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R8 summary generation, gating logic | Vitest | 2-3 tests |
| Unit | S1 content extraction quality | Vitest | 1-2 tests |
| Unit | S5 entity matching, linking logic | Vitest | 2-3 tests |
| Unit | R13-S3 reporting, ablation framework | Vitest | 2-3 tests |
| Unit | R5 activation criteria evaluation | Vitest | 1-2 tests |
| Integration | R8 pre-filter in search pipeline | Vitest | 1-2 tests |
| Integration | R8 skip-path: verify no summary generation when <5K memories | Vitest | 1 test |
| Integration | R8 latency benchmark: p95 remains <500ms with pre-filter | Vitest | 1 test |
| Integration | S1 content generation in memory pipeline end-to-end | Vitest | 1-2 tests |
| Integration | S5 cross-document entity linking end-to-end (if scale gate met) | Vitest | 1-2 tests |
| Integration | R13-S3 full reporting end-to-end | Vitest | 1-2 tests |

**Total**: Sprint 7 testing per item (unit + integration)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 6a graph deepening (S6a only, not S6b) | Internal | Green (assumed) | Blocks Sprint 7 start |
| Evaluation infrastructure (Sprint 0/4) | Internal | Green (assumed) | R13-S3 cannot proceed |
| R10 auto entity extraction (Sprint 6) | Internal | Green (assumed) | S5 linking limited to manual entities |
| better-sqlite3 | Internal | Green | Required for all DB operations |
| sqlite-vec | Internal | Green | Required for R5 evaluation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R5 INT8 causes unacceptable recall loss, R8 overhead excessive, or quality regressions detected
- **Procedure**: Each item is independent — disable relevant feature flag and revert individual changes
- **Estimated time**: MEDIUM — each item can be individually reverted (2-4h per item)
- **Difficulty**: MEDIUM — items are independent; no cross-cutting dependencies
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
R8 (15-20h) ──────┐
S1 (8-12h) ───────┤
S5 (8-12h) ───────┼──► Program Completion Gate
R13-S3 (12-16h) ──┤
R5 eval (2h) ─────┤
T-PI-S7 (2-4h) ───┘
  (all parallelizable)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| R8 (Memory Summaries) | Sprint 6a exit gate | Program completion |
| S1 (Content Generation) | Sprint 6a exit gate | Program completion |
| S5 (Entity Linking) | Sprint 6a exit gate, R10 (Sprint 6) | Program completion |
| R13-S3 (Full Reporting) | Sprint 6a exit gate, Eval infra | Program completion |
| R5 (INT8 Evaluation) | Sprint 6a exit gate | Program completion |
| T-PI-S7 (PageIndex Review) | Sprint 6a exit gate | Program completion |

**Note**: All items are independent and can execute in parallel. S5 is additionally gated on >1K active memories OR >50 verified entities.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| R8 (Memory Summaries) | Medium | 15-20h |
| S1 (Content Generation) | Low-Medium | 8-12h |
| S5 (Entity Linking) | Low-Medium | 8-12h |
| R13-S3 (Full Reporting) | Medium | 12-16h |
| R5 (INT8 Evaluation) | Low | 2h |
| T-PI-S7 (PageIndex Review) | Low | 2-4h |
| DEF-014 (structuralFreshness) | Low | 1-2h |
| **Total** | | **48-68h** |

> **Effort reconciliation**: Parent spec lists 45-62h (core items only, excluding T-PI-S7 and DEF-014). This child total of 48-68h includes T-PI-S7 (2-4h) and DEF-014 (1-2h) which are cross-reference and deferred-item tasks not counted in the parent's per-sprint table.

**Conditional Effort Scenarios** (see summary for details):

| Scenario | Scope | Effort |
|----------|-------|--------|
| Minimum viable (current scale) | R13-S3 + T005a + T005 + DEF-014 | 16-22h |
| Realistic (without R8) | All items except R8 | 33-48h |
| Full (R8 + S5 gates met) | All items | 48-68h |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All existing tests verified passing before changes
- [ ] Feature flags configured: `SPECKIT_MEMORY_SUMMARIES` (R8), `SPECKIT_ENTITY_LINKING` (S5)
- [ ] Gating criteria measured: memory count (R8), latency/dimensions (R5)
- [ ] Prior sprint feature flags inventoried for sunset

### Rollback Procedure
1. **Immediate**: Disable `SPECKIT_MEMORY_SUMMARIES` flag if R8 causes issues
2. **Immediate**: Disable `SPECKIT_ENTITY_LINKING` flag if S5 causes issues
3. **R5 rollback**: Remove INT8 quantization, restore original embeddings (if implemented)
4. **Individual item revert**: Each item is independent — `git revert` per feature
5. **Verify rollback**: Run full test suite + eval metrics comparison

### Data Reversal
- **Has data migrations?** Potentially — R8 creates summary data; R5 may quantize embeddings
- **Reversal procedure**: R8 summaries can be deleted without impact. R5 INT8 requires re-embedding from original vectors (preserve originals before quantization).
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References

Builds on PageIndex integration from Sprints 0, 5 (PI-A5 quality verification, PI-B1 tree thinning).

- **PI-A5 (Sprint 0 — Verify-fix-verify)**: Long-horizon quality monitoring (particularly R13-S3 full reporting and the ablation framework) should incorporate the verify-fix-verify pattern. At scale, the R13-S3 reporting layer provides the "verify" phase; incorporating automated re-verification after fix cycles closes the loop for ongoing memory quality maintenance.
- **PI-B1 (Sprint 5 — Tree thinning)**: R8 memory summaries (gated on >5K memories) and the R13-S3 ablation framework both involve traversing large accumulated spec folders. The tree thinning pattern from Sprint 5 should inform how the summary generation module and the reporting dashboard scope their traversal to avoid loading unbounded context trees.

Research evidence: See research documents `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder.
<!-- /ANCHOR:pageindex-xrefs -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See `../plan.md`

---

<!--
LEVEL 2 PLAN — Phase 8 of 8 (FINAL)
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 7: Long horizon — scale-dependent optimizations + eval completion
- All items parallelizable — MEDIUM rollback difficulty
- R5 INT8: custom quantized BLOB, NOT vec_quantize_i8
-->
