---
title: "Tasks: Code Audit — Memory Quality and Indexing"
description: "Task breakdown for auditing 24 Memory Quality and Indexing features"
trigger_phrases:
  - "tasks"
  - "memory quality and indexing"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Code Audit — Memory Quality and Indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description`

---

## Phase 1: Preparation

- [x] T000 Verify feature catalog currency for Memory Quality and Indexing
- [x] T000a [P] Identify source code root paths

---

## Phase 2: Feature Audit

- [x] T001 [P] Audit: Verify-fix-verify memory quality loop — MATCH
- [x] T002 [P] Audit: Signal vocabulary expansion — MATCH
- [x] T003 [P] Audit: Pre-flight token budget validation — MATCH
- [x] T004 [P] Audit: Spec folder description discovery — MATCH
- [x] T005 [P] Audit: Pre-storage quality gate — MATCH
- [x] T006 [P] Audit: Reconsolidation-on-save — MATCH
- [x] T007 [P] Audit: Smarter memory content generation — MATCH
- [x] T008 [P] Audit: Anchor-aware chunk thinning — MATCH
- [x] T009 [P] Audit: Encoding-intent capture at index time — MATCH
- [x] T010 [P] Audit: Auto entity extraction — MATCH
- [x] T011 [P] Audit: Content-aware memory filename generation — PARTIAL (F11: logic present but resolves to wrong file in edge cases)
- [x] T012 [P] Audit: Duplicate and empty content prevention — PARTIAL (F12: guard present but dedup triggers a behavior change under concurrent writes)
- [x] T013 [P] Audit: Entity normalization consolidation — PARTIAL (F13: implementation found but source file reference missing from catalog)
- [x] T014 [P] Audit: Quality gate timer persistence — PARTIAL (F14: catalog lists more timer variants than are implemented; list is inflated)
- [x] T015 [P] Audit: Deferred lexical-only indexing — MATCH
- [x] T016 [P] Audit: Dry-run preflight for memory_save — MATCH
- [x] T017 [P] Audit: Outsourced agent handback protocol — MATCH
- [x] T018 [P] Audit: Session enrichment and alignment guards — MATCH
- [x] T019 [P] Audit: Post-save quality review — MATCH
- [x] T020 [P] Audit: Weekly batch feedback learning — MATCH
- [x] T021 [P] Audit: Assistive reconsolidation — MATCH
- [x] T022 [P] Audit: Implicit feedback log — MATCH
- [x] T023 [P] Audit: Hybrid decay policy — MATCH
- [x] T024 [P] Audit: Save quality gate exceptions — PARTIAL (F23: implementation exists but no named export; catalog references export that does not exist)

---

## Phase 3: Synthesis

- [x] T900 Cross-reference findings across features
- [x] T901 Compile audit summary report
- [x] T902 Update implementation-summary.md

---

## Completion Criteria

- [x] All feature audit tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Summary report completed

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
