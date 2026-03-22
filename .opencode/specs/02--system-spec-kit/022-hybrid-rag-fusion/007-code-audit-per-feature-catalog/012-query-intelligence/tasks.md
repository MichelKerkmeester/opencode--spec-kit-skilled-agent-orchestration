---
title: "Tasks: Code Audit — Query Intelligence"
description: "Task breakdown for auditing 11 Query Intelligence features"
trigger_phrases:
  - "tasks"
  - "query intelligence"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Code Audit — Query Intelligence

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

- [x] T000 Verify feature catalog currency for Query Intelligence
- [x] T000a [P] Identify source code root paths

---

## Phase 2: Feature Audit

- [x] T001 [P] Audit: Query complexity router — MATCH (F01)
- [x] T002 [P] Audit: Relative score fusion in shadow mode — MATCH (F02)
- [x] T003 [P] Audit: Channel min-representation — MATCH (F03)
- [x] T004 [P] Audit: Confidence-based result truncation — MATCH (F04)
- [x] T005 [P] Audit: Dynamic token budget allocation — MATCH (F05)
- [x] T006 [P] Audit: Query expansion — MATCH (F06)
- [x] T007 [P] Audit: LLM query reformulation — PARTIAL (F07: `useQueryReformulation` flag header says default=FALSE, runtime guard inverts this and defaults ON)
- [x] T008 [P] Audit: HyDE (Hypothetical Document Embeddings) — PARTIAL (F08: same `useQueryReformulation` flag contradiction as F07; duplicate accessor definitions present)
- [x] T009 [P] Audit: Index-time query surrogates — PARTIAL (F09: `surrogate-storage.ts` unlisted in catalog source-file list; `matchSurrogates()` dead code at query time)
- [x] T010 [P] Audit: Query decomposition — MATCH (F10)
- [x] T011 [P] Audit: Graph concept routing — MATCH (F11)

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
