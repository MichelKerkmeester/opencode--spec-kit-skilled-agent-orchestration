---
title: "Tasks: Ablation Benchmark Integrity [system-spec-kit/022-hybrid-rag-fusion/023-ablation-benchmark-integrity/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "ablation benchmark"
  - "benchmark integrity"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/023-ablation-benchmark-integrity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Ablation Benchmark Integrity

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm prior specs do not cover the required runtime benchmark fix (`021-ground-truth-id-remapping`, `022-spec-doc-indexing-bypass`)
- [x] T002 Reproduce the collapse and compare stored good, suspect, and clean CLI runs (`speckit-eval.db`)
- [x] T003 Identify the active DB mismatch, stale/chunk-backed ground truth, and truncation entry points (investigation notes)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add ground-truth alignment auditing and fail-fast validation (`mcp_server/lib/eval/ablation-framework.ts`)
- [x] T005 Add evaluation-only truncation bypass to the hybrid search pipeline (`mcp_server/lib/search/hybrid-search.ts`)
- [x] T006 Normalize parent IDs and enable eval mode in CLI/MCP ablation adapters (`scripts/evals/run-ablation.ts`, `handlers/eval-reporting.ts`)
- [x] T007 Make the mapping tool capable of refreshing the canonical relevance dataset (`scripts/evals/map-ground-truth-ids.ts`)
- [x] T008 Refresh `ground-truth.json` against the repo DB parent-memory universe (`mcp_server/lib/eval/data/ground-truth.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add targeted tests for alignment, parent normalization, and eval-mode truncation bypass (`mcp_server/tests/*.vitest.ts`)
- [x] T010 Run targeted tests and alignment checks (Vitest + SQLite queries)
- [x] T011 Rerun one full ablation and one focused `fts5` ablation on the aligned repo DB
- [x] T012 Update checklist evidence and final recommendation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
