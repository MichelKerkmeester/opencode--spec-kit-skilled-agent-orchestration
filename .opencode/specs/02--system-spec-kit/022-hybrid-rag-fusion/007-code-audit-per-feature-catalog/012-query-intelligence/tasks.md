---
title: "Tasks: Code [02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/012-query-intelligence/tasks]"
description: "Task breakdown for auditing 11 Query Intelligence features"
trigger_phrases:
  - "tasks"
  - "query intelligence"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Code Audit — Query Intelligence

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

- [x] T000 Verify feature catalog currency for Query Intelligence
- [x] T000a [P] Identify source code root paths

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

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
