---
title: "Tasks: 018 / 011 — graph-metadata.json rollout"
description: "Completed implementation task ledger for the five-phase graph-metadata.json rollout."
trigger_phrases: ["018 011 tasks", "graph metadata tasks", "graph metadata rollout tasks", "canonical continuity graph task ledger"]
importance_tier: "critical"
contextType: "implementation"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/002-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Shipped rollout and verified packet"
    next_safe_action: "Checklist review"
    key_files: ["tasks.md", "checklist.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 018 / 011 — graph-metadata.json rollout

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

### Phase 1A: Schema + Parser

- [x] T001 Create new `graph-metadata-schema.ts` beside the existing graph library contract files. (`.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`) Done when every Iteration 4 top-level, `manual.*`, and `derived.*` field is typed and validated. Supports `REQ-001`, `REQ-002`. Research: Iterations 4 and 10.
- [x] T002 Add parser and merge helpers for graph metadata reads, writes, and manual-plus-derived reconciliation in the graph library module. (`.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`) Done when malformed files fail cleanly, schema version mismatches are handled explicitly, and merge logic preserves `manual.*` while rebuilding `derived.*`. Supports `REQ-002`, `REQ-004`, `REQ-012`. Research: Iterations 4, 5, and 10.
- [x] T003 Add unit coverage for valid schema, invalid schema, merge behavior, and version compatibility. (`.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`) Done when Phase 1 tests prove the parser contract before any save-path or discovery integration lands. Supports `REQ-002`, `REQ-004`. Research: Iteration 10.

### Phase 1B: Save-Path Integration

- [x] T004 Add a post-save graph-metadata refresh hook to `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` and `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`. (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`) Done when canonical save refreshes graph metadata even when no legacy context markdown file is written. Supports `REQ-003`, `REQ-004`. Research: Iterations 1, 5, 8, and 10.
- [x] T005 Derive packet metadata fields from canonical docs and save payload. (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`, `spec.md`, `implementation-summary.md`) Done when `trigger_phrases`, `key_files`, `status`, `importance_tier`, `parent_id`, `children_ids`, and `causal_summary` are generated from the sources specified in the spec. Supports `REQ-003`, `REQ-004`, `REQ-012`. Research: Iterations 4 and 5.
- [x] T006 Implement atomic read-merge-write behavior for `graph-metadata.json` so manual packet relationships survive every save. (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`) Done when existing `manual.depends_on`, `manual.supersedes`, and `manual.related_to` persist across repeated saves. Supports `REQ-004`. Research: Iterations 4, 5, and 10.
- [x] T007 Add save-path regression tests for canonical-save authority and workflow refresh behavior. (`.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-refresh.vitest.ts`) Done when tests cover the no-legacy-markdown case and the manual-field preservation case. Supports `REQ-003`, `REQ-004`. Research: Iteration 10.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 2A: Index + Graph Integration

- [x] T008 Extend spec-folder discovery to include `graph-metadata.json`. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`) Done when valid spec folders produce graph-metadata discovery candidates and excluded directories stay excluded. Supports `REQ-005`, `REQ-011`. Research: Iteration 6.
- [x] T009 Update vector-index schema and normalization logic for `document_type='graph_metadata'`. (`.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`) Done when graph-metadata rows store packet summaries, tiers, and document type cleanly. Supports `REQ-005`. Research: Iterations 6 and 10.
- [x] T010 Project packet relationships into `causal_edges` through the existing processor. (`.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`) Done when `depends_on`, `supersedes`, and `related_to` relationships become graph edges between packet rows. Supports `REQ-006`. Research: Iteration 6.
- [x] T011 Add packet-oriented ranking support for `graph_metadata` rows. (`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`) Done when packet, dependency, and resume-oriented queries can elevate graph metadata without suppressing canonical spec docs. Supports `REQ-007`, `REQ-011`. Research: Iterations 6, 8, and 10.
- [x] T012 Add integration coverage for discovery, indexing, causal-edge projection, and packet ranking. (`.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts`) Done when Phase 2 integration work can be verified independently of backfill and command-surface work. Supports `REQ-005`, `REQ-006`, `REQ-007`. Research: Iteration 10.

### Phase 2B: Backfill

- [x] T013 Create a backfill entry point under the existing scripts tree for packet graph metadata generation. (`.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`, `.opencode/skill/system-spec-kit/scripts/README.md`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`) Done when the script can walk valid spec folders and emit or preview `graph-metadata.json` files. Supports `REQ-008`, `REQ-009`. Research: Iteration 7.
- [x] T014 Read canonical packet docs and optional `description.json` inputs to derive best-effort packet metadata. (`.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`) Done when identity, status, topics, key files, and source docs can be reconstructed without requiring legacy memory folders. Supports `REQ-008`. Research: Iteration 7.
- [x] T015 Add dry-run output, coverage reporting, and manual-review flags for ambiguous packets. (`.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`) Done when the backfill can flag missing summaries, ambiguous status, and prose-only relationship hints instead of guessing. Supports `REQ-008`, `REQ-009`. Research: Iteration 7.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 3A: Workflow Adoption

- [x] T016 Scaffold empty graph metadata during packet creation. (`.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`) Done when new packets receive a valid starter file through `/spec_kit:plan`. Supports `REQ-010`. Research: Iterations 8 and 10.
- [x] T017 Finalize `status` and `last_save_at` during packet completion. (`.opencode/command/spec_kit/complete.md`, `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`) Done when `/spec_kit:complete` can close packet state without touching manual relationships. Supports `REQ-010`. Research: Iteration 8.
- [x] T018 Extend resume and retrieval command surfaces to read packet dependencies and key files from graph metadata. (`.opencode/command/spec_kit/resume.md`, `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`, `.opencode/command/memory/search.md`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`) Done when `/spec_kit:resume` and `/memory:search` can use graph metadata for packet-aware queries. Supports `REQ-007`, `REQ-010`, `REQ-011`. Research: Iterations 8 and 10.
- [x] T019 Add rollout-aware validation for graph metadata presence and schema correctness. (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-graph-metadata.sh`) Done when schema failures are hard errors and missing-file checks can stay warning-only until backfill coverage is acceptable. Supports `REQ-009`. Research: Iterations 8 and 10.

### Phase 3B: Evidence and Traceability

- [x] T020 Run implementation verification and packet validation for the rollout surfaces. (`.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-refresh.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`) Done when the implementation packet records the exact command strings needed to prove build, test, and validation closure. Supports `REQ-005` through `REQ-010`. Research: Iteration 10.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All five implementation phases are complete.
- [x] No `[B]` blocked tasks remain.
- [x] Requirement coverage matrix is still accurate after implementation.
- [x] Validation, test, and rollout evidence is recorded in `implementation-summary.md`.

### Requirement Traceability Matrix

| Requirement | Tasks | Checklist |
|-------------|-------|-----------|
| REQ-001 | T001 | CHK-001, CHK-040, CHK-100 |
| REQ-002 | T001, T002, T003 | CHK-001, CHK-010, CHK-020 |
| REQ-003 | T004, T005, T007 | CHK-002, CHK-011, CHK-021 |
| REQ-004 | T002, T006, T007 | CHK-011, CHK-022, CHK-031 |
| REQ-005 | T008, T009, T012 | CHK-003, CHK-012, CHK-020 |
| REQ-006 | T010, T012 | CHK-012, CHK-023, CHK-030 |
| REQ-007 | T011, T018 | CHK-013, CHK-021, CHK-110 |
| REQ-008 | T013, T014, T015 | CHK-020, CHK-022, CHK-123 |
| REQ-009 | T013, T015, T019 | CHK-021, CHK-120, CHK-123 |
| REQ-010 | T016, T017, T018, T019 | CHK-040, CHK-041, CHK-140 |
| REQ-011 | T008, T011, T018 | CHK-013, CHK-032, CHK-110 |
| REQ-012 | T002, T005 | CHK-011, CHK-031, CHK-132 |
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Research**: See `research.md`
<!-- /ANCHOR:cross-refs -->

---
