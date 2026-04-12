---
title: "018 / 011 — Graph metadata tasks"
description: "Ordered implementation tasks for graph-metadata.json across schema, save, index, backfill, and workflow adoption."
trigger_phrases: ["018 011 tasks", "graph metadata task ledger", "graph metadata rollout tasks"]
importance_tier: "critical"
contextType: "planning"
status: "planned"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rewrote the task ledger around the five-phase implementation plan"
    next_safe_action: "Start with T001 and T002 in the verified graph library"
    key_files: ["tasks.md", "plan.md", "checklist.md"]
---
# Tasks: 018 / 011 — Spec-folder graph metadata

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[P]` | Parallelizable after dependencies are met |
| `[B]` | Blocked |

**Rule:** Every task below references a verified existing repo path. When a task creates new files, it does so inside the verified parent directory listed in the `Paths` column.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Slice | Covered By | Notes |
|-------|------------|-------|
| Implementation Phase 1 — Schema + Parser | T001-T003 | Existing `mcp_server/lib/graph/` and `scripts/tests/` surfaces |
| Implementation Phase 2 — Save-Path Integration | T004-T006 | Canonical save workflow and save-path tests |
| Implementation Phase 3 — Index + Graph Integration | T007-T009 | Discovery, indexing, causal edges, and packet-query ranking |
| Implementation Phase 4 — Backfill | T010-T012 | Best-effort generation, dry-run reporting, warning-first validation |
| Implementation Phase 5 — Workflow Adoption | T013-T014 | Packet creation, completion, resume, and search adoption |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Implementation Phase 1 — Schema + Parser

- [ ] T001 Define the `graph-metadata.json` schema contract in `./../../../../../skill/system-spec-kit/mcp_server/lib/graph/`.
- [ ] T002 Build parser, validator, and merge helpers that preserve `manual.*` and regenerate `derived.*`.
- [ ] T003 Add unit coverage for schema validity, invalid payload rejection, merge behavior, and schema versioning.

| ID | Priority | Task | Paths | Done When | Reqs |
|----|----------|------|-------|-----------|------|
| [ ] T001 | P0 | Define the `graph-metadata.json` schema contract in the existing graph library. | `./../../../../../skill/system-spec-kit/mcp_server/lib/graph/`, `./spec.md`, `./research.md` | A versioned schema file under the verified `mcp_server/lib/graph/` directory matches the Iteration 4 shape, and any formalization divergence is documented in `spec.md`. | REQ-001, REQ-002 |
| [ ] T002 | P0 | Build parser, validator, and merge helpers for graph metadata. | `./../../../../../skill/system-spec-kit/mcp_server/lib/graph/`, `./../../../../../skill/system-spec-kit/scripts/core/memory-metadata.ts` | Helpers can read, validate, normalize, and merge graph metadata while preserving `manual.*` and rebuilding `derived.*`. | REQ-002, REQ-003 |
| [ ] T003 | P0 | Add unit coverage for valid schema, invalid schema, merge behavior, and schema versioning. | `./../../../../../skill/system-spec-kit/scripts/tests/` | New or updated tests in the verified `scripts/tests/` tree fail on invalid payloads and prove merge semantics for manual vs derived fields. | REQ-002, REQ-003 |

### Implementation Phase 2 — Save-Path Integration

- [ ] T004 Add deterministic derivation of packet graph fields in the canonical save path.
- [ ] T005 Hook graph metadata refresh into canonical save completion with atomic write and merge behavior.
- [ ] T006 Extend save-path tests for no-legacy-write behavior and manual-field preservation.

| ID | Priority | Task | Paths | Done When | Reqs |
|----|----------|------|-------|-----------|------|
| [ ] T004 | P0 | Add deterministic packet-field derivation for graph metadata refresh. | `./../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts`, `./../../../../../skill/system-spec-kit/scripts/core/workflow.ts`, `./../../../../../skill/system-spec-kit/scripts/core/memory-metadata.ts` | The save path can derive trigger phrases, key files, status, importance tier, hierarchy, timestamps, source docs, and causal summary from canonical docs plus folder structure. | REQ-004, REQ-005 |
| [ ] T005 | P0 | Hook graph metadata refresh into canonical save completion with atomic write and merge behavior. | `./../../../../../skill/system-spec-kit/scripts/core/workflow.ts`, `./../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts`, `./../../../../../skill/system-spec-kit/scripts/core/file-writer.ts` | Graph metadata refresh runs after canonical save completion even when `ctxFileWritten` is false, and writes preserve `manual.*` through an atomic update path. | REQ-003, REQ-004, REQ-005 |
| [ ] T006 | P0 | Extend save-path tests for no-legacy-write behavior and manual preservation. | `./../../../../../skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts`, `./../../../../../skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts`, `./../../../../../skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts` | Tests prove the refresh hook fires from canonical save authority, preserves manual relationship fields, and does not depend on a legacy `memory/` directory. | REQ-003, REQ-004, REQ-005 |

### Implementation Phase 3 — Index + Graph Integration

- [ ] T007 Extend discovery and indexing so each packet can emit one `document_type='graph_metadata'` row.
- [ ] T008 Resolve manual packet relationships into `causal_edges` using the agreed edge mapping.
- [ ] T009 Add packet-oriented ranking behavior and integration coverage for search and resume-adjacent flows.

| ID | Priority | Task | Paths | Done When | Reqs |
|----|----------|------|-------|-----------|------|
| [ ] T007 | P1 | Extend discovery and indexing for `graph_metadata` rows. | `./../../../../../skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`, `./../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`, `./../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Discovery finds `graph-metadata.json` in valid packet roots, and the index can store one `document_type='graph_metadata'` row per packet without new storage. | REQ-006, REQ-013 |
| [ ] T008 | P1 | Resolve manual packet relationships into `causal_edges`. | `./../../../../../skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`, `./../../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | `depends_on`, `supersedes`, and `related_to` packet refs resolve against indexed packet rows and upsert the agreed edge mappings. | REQ-007, REQ-013 |
| [ ] T009 | P1 | Add packet-oriented ranking behavior and integration coverage. | `./../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, `./../../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `./../../../../../skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`, `./../../../../../skill/system-spec-kit/scripts/tests/test-integration.vitest.ts` | Packet/dependency queries can privilege `graph_metadata` rows without polluting unrelated search intents, and integration tests lock the behavior. | REQ-006, REQ-007, REQ-008, REQ-013 |

### Implementation Phase 4 — Backfill

- [ ] T010 Create `scripts/graph/backfill-graph-metadata.ts` with dry-run reporting under the verified scripts tree.
- [ ] T011 Implement best-effort derivation and manual-review flags for existing packets.
- [ ] T012 Add warning-first graph metadata validation and rollout thresholds.

| ID | Priority | Task | Paths | Done When | Reqs |
|----|----------|------|-------|-----------|------|
| [ ] T010 | P1 | Create the backfill CLI and dry-run reporting flow under the verified scripts tree. | `./../../../../../skill/system-spec-kit/scripts/`, `./../../../../../skill/system-spec-kit/scripts/tests/`, `./research.md` | A new `scripts/graph/backfill-graph-metadata.ts` file can be created under the verified `scripts/` directory, supports dry-run mode, and reports coverage and review flags. | REQ-001, REQ-005, REQ-009, REQ-012 |
| [ ] T011 | P1 | Implement best-effort derivation and manual-review flags for existing packets. | `./../../../../../skill/system-spec-kit/scripts/`, `./../../../../../skill/system-spec-kit/scripts/tests/`, `./../../../../` for the canonical `.opencode/specs/` root | Backfill can derive identity, hierarchy, topics, key files, and status from canonical docs while explicitly flagging ambiguous relationship work for human review. | REQ-005, REQ-009, REQ-012 |
| [ ] T012 | P1 | Add warning-first graph metadata validation and rollout thresholds. | `./../../../../../skill/system-spec-kit/scripts/spec/validate.sh`, `./../../../../../skill/system-spec-kit/mcp_server/lib/validation/`, `./checklist.md` | Validation surfaces missing or invalid graph metadata as warning-first rollout gates and documents the threshold for promoting to error. | REQ-009, REQ-011 |

### Implementation Phase 5 — Workflow Adoption

- [ ] T013 Scaffold graph metadata for new packets at creation time.
- [ ] T014 Wire completion, resume, and packet-oriented search adoption.

| ID | Priority | Task | Paths | Done When | Reqs |
|----|----------|------|-------|-----------|------|
| [ ] T013 | P1 | Scaffold graph metadata for new packets at creation time. | `./../../../../../skill/system-spec-kit/scripts/spec/create.sh`, `./../../../../../command/spec_kit/plan.md` | Packet creation scaffolds an empty or minimally valid `graph-metadata.json` and the plan command docs describe the new behavior accurately. | REQ-001, REQ-010 |
| [ ] T014 | P1 | Wire completion, resume, and packet-oriented search adoption. | `./../../../../../command/spec_kit/complete.md`, `./../../../../../command/spec_kit/resume.md`, `./../../../../../command/memory/search.md`, `./../../../../../skill/system-spec-kit/mcp_server/handlers/session-resume.ts`, `./../../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Completion can update terminal packet state, resume can consult graph metadata for dependencies and key files, and search can expose packet graph rows for packet-oriented queries. | REQ-008, REQ-010, REQ-011 |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Close rollout parity and packet-lifecycle verification with strict packet validation evidence.

| ID | Priority | Task | Paths | Done When | Reqs |
|----|----------|------|-------|-----------|------|
| [ ] T015 | P1 | Close rollout parity and verification for the packet lifecycle. | `./../../../../../skill/system-spec-kit/scripts/spec/validate.sh`, `./spec.md`, `./plan.md`, `./tasks.md`, `./checklist.md`, `./decision-record.md`, `./implementation-summary.md` | Runtime behavior, command docs, and packet docs agree on the contract, and the final implementation packet can prove strict validation with real verification commands. | REQ-010, REQ-011 |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation-phase tasks are complete.
- [ ] No `[B]` blocked tasks remain.
- [ ] The implementation proves every requirement in [spec.md](./spec.md) through task completion and checklist evidence.
- [ ] `implementation-summary.md` is updated from shell status to implemented status with exact verification commands.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: [spec.md](./spec.md)
- Implementation plan: [plan.md](./plan.md)
- Verification checklist: [checklist.md](./checklist.md)
- Decisions: [decision-record.md](./decision-record.md)
- Research: [research.md](./research.md)
<!-- /ANCHOR:cross-refs -->
