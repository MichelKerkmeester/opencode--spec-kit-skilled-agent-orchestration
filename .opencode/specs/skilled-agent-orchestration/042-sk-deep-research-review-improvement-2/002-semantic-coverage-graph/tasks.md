---
title: "Tasks: Semantic Coverage Graph [042.002]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "042.002"
  - "tasks"
  - "semantic coverage graph"
  - "deep loop graph"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Semantic Coverage Graph

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

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the task maps to the concrete Phase 002 file list before editing.
- Confirm whether the task belongs to extraction, storage/MCP, reducer integration, or contract documentation.
- Confirm which graph ontology is in play: research, review, or shared.
- Confirm the verification artifact that proves behavior rather than just file existence.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `REQ-LINKED` | Every task must map to at least one named requirement from `spec.md`. |
| `REUSE-FIRST` | Prefer direct extraction first, then explicit adaptation from existing graph modules; do not label reducer/convergence work as plug-and-play reuse. |
| `ONTOLOGY-EXPLICIT` | Research and review kinds, relations, and weights must remain explicit and separate. |
| `TRACE-PRESERVING` | Graph convergence enriches the Phase 001 stop trace; it never bypasses it. |
| `FALLBACK-SAFE` | MCP failures must degrade to local graph persistence, not silent data loss. |

### Status Reporting Format
- `pending`: task is approved but not started.
- `in-progress`: implementation or verification is active.
- `blocked`: prerequisite extraction, schema behavior, or Phase 001 integration is unresolved.
- `completed`: implementation plus the listed verification step is done.

### Blocked Task Protocol
- If extraction requires breaking the current memory graph behavior, stop downstream tasks and fix the extraction seam first.
- If `tool-schemas.ts` and handlers disagree on a tool contract, keep all affected MCP tasks blocked until the contract is unified.
- If reducer stop decisions conflict with Phase 001 legal-stop rules, block graph convergence work until the trace shape is reconciled.
- If inherited weight values are being treated as final without calibration evidence, block convergence completion until calibration work lands.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T001 | Completed | REQ-001 | `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs` |
| T002 | Completed | REQ-001, REQ-003, REQ-004 | `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` |
| T003 | Completed | REQ-001 | `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs` |
| T004 | Completed | REQ-001 | `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs` |
| T005 | Completed | REQ-006 | `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` |

- [x] T001 Extract edge manager behavior from causal-graph patterns: insert, update, delete, weight clamping, self-loop prevention, and provenance traversal. (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs`)
- [x] T002 Encode the research and review relation maps, initial weight estimates, and allowed relation sets in the shared coverage layer, marking adapted semantics for later calibration. (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`)
- [x] T003 Extract shared signal logic for degree, depth, momentum, and cluster-ready metrics. (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs`)
- [x] T004 Extract CONTRADICTS-edge scanning and contradiction-pair reporting for deep-loop semantics. (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs`)
- [x] T005 Implement graph-aware convergence helpers that combine graph signals with Phase 001 stop-trace inputs, with `sourceDiversity` and `evidenceDepth` treated as STOP-blocking guards rather than soft votes. (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T006 | Completed | REQ-002 | `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` |
| T007 | Completed | REQ-002, REQ-003, REQ-004 | `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` |
| T008 | Completed | REQ-002, REQ-010 | `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts` |
| T009 | Completed | REQ-002, REQ-006 | `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts` |

- [x] T006 Create `deep-loop-graph.sqlite` bootstrap, schema versioning, migrations, indexes, and namespace isolation by `spec_folder + loop_type + session_id`. (`.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`)
- [x] T007 Implement node, edge, and snapshot persistence for the research and review ontologies defined in this phase. (`.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`)
- [x] T008 Implement structured query helpers for coverage gaps, contradictions, provenance chains, unverified claims, and hot-node ranking. (`.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts`)
- [x] T009 Implement server-side signal and snapshot generation for research and review convergence metrics. (`.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### Phase 2c: Add MCP Tools

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T010 | Completed | REQ-005 | `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` |
| T011 | Completed | REQ-005 | `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts` |
| T012 | Completed | REQ-005, REQ-010 | `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` |
| T014 | Completed | REQ-005 | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` |

- [x] T010 Add the idempotent upsert handler with self-loop rejection, clamped weights, and metadata updates on repeated IDs. (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts`)
- [x] T011 Add the structured query handler covering `uncovered_questions`, `unverified_claims`, `contradictions`, `provenance_chain`, `coverage_gaps`, and `hot_nodes`. (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts`)
- [x] T012 Add the status and convergence handlers that return grouped counts, signal values, blockers, and typed decision traces. (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`)
- [x] T014 Register the four phase-critical `deep_loop_graph_*` tools and their input schemas in the existing MCP server schema surface. (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`)

Visualization is deferred to a follow-up phase and is intentionally removed from the Phase 002 critical path.
<!-- /ANCHOR:phase-3 -->

---

### Phase 2d: Define Reducer/MCP Contract and Integrate Reducer

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T-CG-NEW-1 | Completed | REQ-007, REQ-010 | `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/convergence.md` |
| T015 | Completed | REQ-007 | `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |
| T-CG-NEW-2 | Completed | REQ-003, REQ-004, REQ-006 | `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |
| T016 | Completed | REQ-006, REQ-007 | `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |
| T-CG-NEW-3 | Completed | REQ-007 | `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md` |

- [x] T-CG-NEW-1 Define the explicit reducer/MCP integration contract: payload inputs/outputs, latency budget, replay semantics, and fallback behavior before writing integration code. (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/convergence.md`)
- [x] T015 Parse iteration `graphEvents`, normalize reducer graph payloads, and call `deep_loop_graph_upsert` after the contract-defined reducer pass is processed. (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`)
- [x] T-CG-NEW-2 Calibrate coverage-specific edge weights and guard thresholds so inherited memory weights are replaced by coverage-aware values before convergence is finalized. (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`)
- [x] T016 Query `deep_loop_graph_convergence`, merge graph blockers into `shouldContinue`, and preserve a local JSON graph fallback when MCP is unavailable. (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`)
- [x] T-CG-NEW-3 Implement the fallback authority chain `JSONL -> local JSON graph -> SQLite projection` so MCP loss degrades cleanly without changing truth ownership. (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`)

---

### Phase 2e: Agent and Convergence Integration

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T017 | Completed | REQ-008 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/convergence.md` |
| T018 | Completed | REQ-008 | `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/references/convergence.md` |
| T019 | Completed | REQ-008 | `.opencode/agent/deep-research.md` |
| T020 | Completed | REQ-008 | `.opencode/agent/deep-review.md` |

- [x] T017 Document the research `graphEvents` JSONL contract and the graph-aware research convergence model. (`.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/convergence.md`)
- [x] T018 Document the review `graphEvents` JSONL contract and the graph-aware review convergence model. (`.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/references/convergence.md`)
- [x] T019 Update the deep-research agent prompt so iterations emit question, finding, claim, and source graph events in structured form. (`.opencode/agent/deep-research.md`)
- [x] T020 Update the deep-review agent prompt so iterations emit dimension, file, finding, evidence, and remediation graph events in structured form. (`.opencode/agent/deep-review.md`)

---

<!-- ANCHOR:completion -->
## Phase 3: Verification

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T021 | Completed | REQ-009 | `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` |
| T022 | Completed | REQ-009, REQ-010 | `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts` |
| T023 | Completed | REQ-009 | Phase folder validation and targeted graph test command set |

- [x] T021 Create the shared-library unit tests for edge management, signals, and graph-aware convergence. (`.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts`)
- [x] T022 Create the MCP DB and tool integration tests for schema behavior, upsert/query/status/convergence behavior, and the deferred-visualization boundary. (`.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts`)
- [x] T023 Run strict phase validation and the targeted graph test suites before calling the phase implementation-ready. (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph --strict`; targeted `vitest` runs for the five named test files)

---

## Completion Criteria

- [x] Every task remains mapped to a named requirement and concrete file surface.
- [x] Extraction and integration tasks preserve the explicit `35-45%` direct reuse / `25-30%` adapted reuse posture instead of drifting into greenfield implementation or pretending reducer/convergence work is plug-and-play.
- [x] Reducer integration preserves Phase 001 stop-decision ownership.
- [x] Research and review contract docs both emit `graphEvents`.
- [x] The five named test files exist and are tied to explicit verification goals.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Implementation Plan**: See `plan.md`
- **Parent Packet**: See `../spec.md`
- **Predecessor Phase**: See `../001-runtime-truth-foundation/spec.md`
<!-- /ANCHOR:cross-refs -->
