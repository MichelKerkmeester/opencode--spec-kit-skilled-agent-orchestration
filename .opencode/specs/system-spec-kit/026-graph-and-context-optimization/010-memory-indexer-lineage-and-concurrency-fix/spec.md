---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
title: "Feature Specification: Memory Indexer Lineage and Concurrency Fix"
description: "Fix the spec-kit-memory indexer bugs behind E_LINEAGE and candidate_changed by preventing cross-file PE UPDATE/REINFORCE decisions and serializing scan-triggered saves."
trigger_phrases:
  - "026/010 memory indexer lineage fix"
  - "e_lineage fix"
  - "candidate_changed fix"
  - "spec-kit-memory batch concurrency"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix"
    last_updated_at: "2026-04-23T17:48:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented A2 lineage guard, B1 scan serialization, and focused regressions"
    next_safe_action: "Restart the MCP server, then rerun memory_index_scan on 026/009 in a network-enabled runtime"
    blockers:
      - "Live acceptance scan of 026/009 was not completed in this sandbox because scan-time embeddings retried against Voyage and stalled the run."
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Fix A uses A2: downgrade UPDATE/REINFORCE to CREATE when the chosen candidate is not the same canonical file."
      - "Fix B uses B1: force memory_index_scan batches to size 1 so scan writes cannot churn their own reconsolidation candidates."
---
# Feature Specification: Memory Indexer Lineage and Concurrency Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

This packet implements the two code-level remediations identified in `/tmp/codex-lineage-investigation-output.txt` for the spec-kit-memory indexer:

1. `E_LINEAGE` came from cross-file PE `UPDATE`/`REINFORCE` decisions choosing a sibling spec doc and then trying to append the new row onto the sibling's lineage chain.
2. `candidate_changed` came from `memory_index_scan` saving sibling docs concurrently inside the same batch, allowing one save to change another save's transactional reconsolidation candidate set.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-23 |
| **Parent** | `026-graph-and-context-optimization/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../009-hook-daemon-parity/spec.md` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The read-only investigation at `/tmp/codex-lineage-investigation-output.txt` found two distinct save-path failures in the memory indexer:

- `E_LINEAGE`: the PE gate could treat a sibling doc such as `checklist.md` as the best `UPDATE` or `REINFORCE` candidate for `tasks.md`, then attempt to record a lineage transition across different canonical file paths.
- `candidate_changed`: `memory_index_scan` processed save batches concurrently, so sibling saves could create or reinforce rows before another save finished its transactional reconsolidation recheck.

### Purpose

Land the smallest safe patch that fixes both issues without broad refactors:

- Fix A: prevent cross-file PE `UPDATE` and `REINFORCE` actions from reusing a sibling row.
- Fix B: prevent scan-triggered saves from racing each other inside the same batch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- Focused regressions under `.opencode/skill/system-spec-kit/mcp_server/tests/`
- This packet plus the 026 parent metadata files

### Out of Scope

- Changing reconsolidation semantics for normal `memory_save` calls
- Refactoring prediction-error thresholds or lineage-state invariants
- Any file outside `mcp_server/`, this new packet, and the 026 parent metadata

### Files Expected to Change

| Path | Change Type | Description |
|------|-------------|-------------|
| `handlers/save/pe-orchestration.ts` | Modify | Downgrade cross-file `UPDATE`/`REINFORCE` decisions to `CREATE` |
| `handlers/pe-gating.ts` | Modify | Preserve candidate canonical file path for PE arbitration |
| `handlers/save/types.ts` | Modify | Carry canonical file path through `SimilarMemory` |
| `handlers/memory-index.ts` | Modify | Force scan-triggered batch size to 1 |
| `tests/pe-orchestration.vitest.ts` | Add | Regression for `tasks.md` vs sibling `checklist.md` |
| `tests/handler-memory-index.vitest.ts` | Modify | Regression proving scan serialization prevents `candidate_changed` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix A must stop cross-file lineage reuse. | When PE picks a sibling candidate for `UPDATE` or `REINFORCE`, the save falls back to `CREATE` unless the candidate resolves to the same canonical file path as the current save target. |
| REQ-002 | Fix B must stop scan self-interference. | `memory_index_scan` saves sibling docs one at a time so a batch cannot trigger `candidate_changed` against itself. |
| REQ-003 | Regressions must cover both fixes. | New or updated tests reproduce the sibling-doc lineage case and the scan concurrency case. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Fix A choice must be documented. | Packet records why A2 was chosen over A1. |
| REQ-005 | Fix B choice must be documented. | Packet records why B1 was chosen over B2. |
| REQ-006 | Required build checks must run. | `npm run typecheck` and `npm run build` exit 0. |
| REQ-007 | Core suite outcome must be recorded honestly. | `npm run test:core` result is documented, including any unrelated existing failures. |
| REQ-008 | Parent topology must include this child packet. | `026/.../description.json` and `graph-metadata.json` both include the new child path. |

### P2 - Recommended

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Live packet acceptance rerun. | In an initialized MCP runtime with embedding access, `memory_index_scan` on `026/009-hook-daemon-parity` finishes with zero `E_LINEAGE` and zero `candidate_changed` failures. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

- **Given** a `tasks.md` save whose top PE candidate is sibling `checklist.md`, **when** the PE gate selects `UPDATE`, **then** orchestration downgrades the action to `CREATE`.
- **Given** a `tasks.md` save whose top PE candidate is sibling `checklist.md`, **when** the PE gate selects `REINFORCE`, **then** orchestration downgrades the action to `CREATE`.
- **Given** `memory_index_scan` is indexing several semantically similar sibling docs from one packet, **when** the scan runs after this patch, **then** only one save is in flight at a time.
- **Given** the packet docs are validated, **when** `validate.sh --strict --no-recursive` runs, **then** the packet passes without structural errors.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cross-file PE candidates remain visible for similarity scoring but no longer drive lineage-bearing `UPDATE` or `REINFORCE` saves.
- **SC-002**: Scan batches serialize sibling spec-doc saves and the regression test proves `maxInFlight === 1`.
- **SC-003**: `npm run typecheck` and `npm run build` pass.
- **SC-004**: Focused regressions pass.
- **SC-005**: The packet documents the operational acceptance rerun status instead of guessing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Tradeoff | A2 keeps similarity search unchanged but makes the downgrade at decision time | Low | It preserves candidate visibility and keeps the patch local to PE orchestration. |
| Tradeoff | B1 reduces scan throughput compared with concurrent batches | Medium | It is surgical, avoids threading a new save flag, and removes scan self-interference immediately. |
| Dependency | `npm run test:core` currently contains an unrelated failure in `tests/copilot-hook-wiring.vitest.ts` | Medium | Record it explicitly; it is outside the touched files and reproduced in isolation. |
| Dependency | Live acceptance scan depends on an initialized runtime and embedding availability | Medium | Record the attempted command and rerun steps for a proper environment. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the code change itself. The only remaining follow-up is an environment-backed rerun of `memory_index_scan` on `026/009-hook-daemon-parity`.
<!-- /ANCHOR:questions -->
