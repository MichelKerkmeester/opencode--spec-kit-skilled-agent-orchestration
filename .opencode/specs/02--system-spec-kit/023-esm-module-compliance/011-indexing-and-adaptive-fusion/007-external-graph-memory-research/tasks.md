---
title: "Tasks: External Graph Memory Research [02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/007-external-graph-memory-research]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph memory research tasks"
  - "external graph survey checklist"
  - "phase 007 tasks"
importance_tier: "important"
contextType: "research"
---
# Tasks: External Graph Memory Research

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Capture current-state graph facts in `research/research.md`
- [x] T002 Define the comparison rubric for all seven external systems in `research/research.md`
- [x] T003 Confirm citation format and confidence labels for every external claim in `research/research.md`
- [x] T004 [P] Create section stubs for recommendations, UX transparency, automatic use, and gap analysis in `research/research.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Review Zep and capture retrieval, UX, and graph automation patterns in `research/research.md`
- [x] T006 [P] Review Mem0 and capture retrieval, UX, and graph automation patterns in `research/research.md`
- [x] T007 [P] Review GraphRAG and capture retrieval, UX, and graph automation patterns in `research/research.md`
- [x] T008 [P] Review LightRAG and capture retrieval, UX, and graph automation patterns in `research/research.md`
- [x] T009 [P] Review Memoripy and capture retrieval, UX, and graph automation patterns in `research/research.md`
- [x] T010 [P] Review Cognee and capture retrieval, UX, and graph automation patterns in `research/research.md`
- [x] T011 [P] Review Graphiti and capture retrieval, UX, and graph automation patterns in `research/research.md`
- [x] T012 Build the cross-system gap analysis table in `research/research.md`
- [x] T013 Rank at least eight improvement ideas in `research/research.md`
- [x] T014 Draft at least one ADR in `decision-record.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify that every surveyed system includes citations and confidence notes in `research/research.md` [EVIDENCE: All 7 system reviews include source citations; confidence notes added per review iteration]
- [x] T016 Verify that backlog items are concrete, non-duplicative, and scoped for follow-on phases in `research/research.md`
- [x] T017 Run `validate.sh --strict` for the phase folder and fix any errors
- [x] T018 Save research context with `generate-context.js` after findings are complete [EVIDENCE: memory/01-04-26_11-16__phase-007-external-graph-memory-research-is.md created, quality 100/100, indexed as memory #69]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Research output is honest about unknowns and evidence gaps
- [x] No code files were changed during the phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Research Output**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

---
