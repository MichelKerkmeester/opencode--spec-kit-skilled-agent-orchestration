---
title: "018 / 011 — Graph metadata tasks"
description: "Task ledger for the per-spec-folder graph metadata research packet."
trigger_phrases: ["018 011 tasks", "graph metadata tasks", "per spec folder graph metadata ledger"]
importance_tier: "critical"
contextType: "research"
status: "complete"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed the research packet and passed strict packet validation"
    next_safe_action: "Open implementation phase"
    key_files: ["tasks.md", "research.md", "implementation-summary.md"]
---
# Tasks: 018 / 011 — Per-spec-folder graph metadata

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

- [x] T001 Re-anchor on the parent `018-canonical-continuity-refactor` packet and prior design findings. (`../spec.md`, `../plan.md`, `../research/research.md`)
- [x] T002 Audit the current graph/runtime sources named by the operator. (`../../../../../skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`, `../../../../../skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`, `../../../../../skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`)
- [x] T003 Measure current coverage for `_memory.continuity`, `description.json`, and index-like spec folders. (`../../../../../skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`, repo-wide `find` and `rg` checks)
- [x] T004 Create the `011-spec-folder-graph-metadata` phase folder and Level 3 packet docs. (`spec.md`, `plan.md`, `tasks.md`, `research.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write Iteration 1: current graph data-source audit. (`research.md`)
- [x] T006 Write Iteration 2: minimum graph metadata needs. (`research.md`)
- [x] T007 Write Iteration 3: file-format and location comparison. (`research.md`)
- [x] T008 Write Iteration 4: concrete schema design. (`research.md`)
- [x] T009 Write Iteration 5: save-time auto-generation strategy. (`research.md`)
- [x] T010 Write Iteration 6: indexing and graph integration plan. (`research.md`)
- [x] T011 Write Iteration 7: retroactive population plan and repo counts. (`research.md`)
- [x] T012 Write Iteration 8: workflow impact assessment. (`research.md`)
- [x] T013 Write Iteration 9: `description.json` comparison and separation-of-concerns verdict. (`research.md`)
- [x] T014 Write Iteration 10: recommendation, implementation phases, migration, and risk assessment. (`research.md`)
- [x] T015 Encode the final recommendation in `spec.md`. (`spec.md`)
- [x] T016 Encode the future execution sequence in `plan.md`. (`plan.md`)
- [x] T017 Record the architectural decision in `decision-record.md`. (`decision-record.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Add Level 3 validation scaffolding so the packet structure matches repo expectations. (`checklist.md`, `implementation-summary.md`)
- [x] T019 Reconcile packet docs with template headers, anchors, and required sections after the first strict-validation pass. (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`)
- [x] T020 Run final strict packet validation and capture the result in `implementation-summary.md`. (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All requested research iterations are documented in `research.md`.
- [x] No `[B]` blocked tasks remain.
- [x] Manual verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
