---
title: "Tasks: [02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/011-scoring-and-calibration/tasks]"
description: "Task breakdown for auditing 23 Scoring and Calibration features"
trigger_phrases:
  - "tasks"
  - "scoring and calibration"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Code Audit — Scoring and Calibration

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

**Task Format**: `T### [P?] Description`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Verify feature catalog currency for Scoring and Calibration
- [x] T000a [P] Identify source code root paths

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 [P] Audit: Score normalization — MATCH
- [x] T002 [P] Audit: Cold-start novelty boost — MATCH
- [x] T003 [P] Audit: Interference scoring — MATCH
- [x] T004 [P] Audit: Classification-based decay — MATCH
- [x] T005 [P] Audit: Folder-level relevance scoring — MATCH
- [x] T006 [P] Audit: Embedding cache — MATCH
- [x] T007 [P] Audit: Double intent weighting investigation — MATCH
- [x] T008 [P] Audit: RRF K-value sensitivity analysis — MATCH
- [x] T009 [P] Audit: Negative feedback confidence signal — MATCH
- [x] T010 [P] Audit: Auto-promotion on validation — MATCH
- [x] T011 [P] Audit: Scoring and ranking corrections — MATCH
- [x] T012 [P] Audit: Stage 3 effectiveScore fallback chain — MATCH
- [x] T013 [P] Audit: Scoring and fusion corrections — PARTIAL (path prefix mismatch; logic confirmed present)
- [x] T014 [P] Audit: Local GGUF reranker via node-llama-cpp — MATCH
- [x] T015 [P] Audit: Tool-level TTL cache — MATCH
- [x] T016 [P] Audit: Access-driven popularity scoring — MATCH
- [x] T017 [P] Audit: Temporal-structural coherence scoring — MATCH
- [x] T018 [P] Audit: Adaptive shadow ranking — MATCH
- [x] T019 [P] Audit: Learned Stage 2 weight combiner — MATCH
- [x] T020 [P] Audit: Shadow feedback holdout evaluation — MATCH
- [x] T021 [P] Audit: Calibrated overlap bonus — MATCH
- [x] T022 [P] Audit: RRF K experimental tuning — PARTIAL (wrong function name in catalog; implementation found under different name)
- [x] T023 [P] Audit: Fusion policy shadow evaluation V2 — PARTIAL (wrong flag location in catalog; flag confirmed in codebase at different path)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 Cross-reference findings across features
- [x] T901 Compile audit summary report
- [x] T902 Update implementation-summary.md

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All feature audit tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Summary report completed

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
