---
title: "Tasks: Code Audit — Retrieval Enhancements"
description: "Task breakdown for auditing 9 Retrieval Enhancements features"
trigger_phrases:
  - "tasks"
  - "retrieval enhancements"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Code Audit — Retrieval Enhancements

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

- [x] T000 Verify feature catalog currency for Retrieval Enhancements
- [x] T000a [P] Identify source code root paths

---

## Phase 2: Feature Audit

- [x] T001 [P] Audit F01: Dual-scope memory auto-surface — MATCH
- [x] T002 [P] Audit F02: Constitutional memory as expert knowledge injection — MATCH
- [x] T003 [P] Audit F03: Spec folder hierarchy as retrieval structure — MATCH
- [x] T004 [P] Audit F04: Lightweight consolidation — MATCH
- [x] T005 [P] Audit F05: Memory summary search channel — MATCH
- [x] T006 [P] Audit F06: Cross-document entity linking — MATCH
- [x] T007 [P] Audit F07: Tier-2 fallback channel forcing — MATCH
- [x] T008 [P] Audit F08: Provenance-rich response envelopes — MATCH
- [x] T009 [P] Audit F09: Contextual tree injection — PARTIAL (source list bloated; primary file: `hybrid-search.ts`)

---

## Phase 3: Synthesis

- [x] T900 Cross-reference findings across features
- [x] T901 Compile audit summary report (spec.md §12)
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
