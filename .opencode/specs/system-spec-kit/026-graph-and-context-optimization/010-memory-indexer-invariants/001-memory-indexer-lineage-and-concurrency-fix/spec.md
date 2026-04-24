---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
title: "Feature Specification: Memory Indexer Lineage and Concurrency Fix"
description: "Fix the spec-kit-memory indexer bugs behind E_LINEAGE and candidate_changed by preventing cross-file PE UPDATE/REINFORCE decisions and bypassing the scan-originated transactional recheck with fromScan."
trigger_phrases:
  - "026/010 memory indexer lineage fix"
  - "e_lineage fix"
  - "candidate_changed fix"
  - "spec-kit-memory fromScan recheck bypass"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix"
    last_updated_at: "2026-04-23T18:55:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Refreshed B2 guard regressions and metadata"
    next_safe_action: "Restart the MCP server, then rerun memory_index_scan on 026/009 in a network-enabled runtime"
    blockers:
      - "Live acceptance scan of 026/009 was not completed in this sandbox because scan-time embeddings retried against Voyage and stalled the run."
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Fix A uses A2: downgrade UPDATE/REINFORCE to CREATE when the chosen candidate is not the same canonical file."
      - "Fix B uses B2: thread fromScan from memory_index_scan into memory_save so scan-originated saves skip the transactional complement recheck."
---
# Feature Specification: Memory Indexer Lineage and Concurrency Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

This packet implements the two code-level remediations identified in `/tmp/codex-lineage-investigation-output.txt` for the spec-kit-memory indexer:

1. `E_LINEAGE` came from cross-file PE `UPDATE`/`REINFORCE` decisions choosing a sibling spec doc and then trying to append the new row onto the sibling's lineage chain.
2. `candidate_changed` came from the save-time transactional reconsolidation recheck rerunning candidate selection for scan-originated saves after planner-time decisions were already made.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-23 |
| **Parent** | `010-memory-indexer-invariants/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None (first child of `010-memory-indexer-invariants`) |
| **Successor** | `../002-index-scope-and-constitutional-tier-invariants/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The read-only investigation at `/tmp/codex-lineage-investigation-output.txt` found two distinct save-path failures in the memory indexer:

- `E_LINEAGE`: the PE gate could treat a sibling doc such as `checklist.md` as the best `UPDATE` or `REINFORCE` candidate for `tasks.md`, then attempt to record a lineage transition across different canonical file paths.
- `candidate_changed`: live acceptance showed the save-time transactional reconsolidation recheck could surface a non-complement candidate for later scan-originated sibling saves even after outer batch serialization, aborting those writes with `candidate_changed`.

### Purpose

Land the smallest safe patch that fixes both issues without broad refactors:

- Fix A: prevent cross-file PE `UPDATE` and `REINFORCE` actions from reusing a sibling row.
- Fix B: keep normal `memory_save` behavior unchanged while letting `memory_index_scan` mark scan-originated saves with `fromScan: true`, so `memory-save.ts:2367-2391` skips only the transactional complement recheck for those saves.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
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
| `handlers/memory-index.ts` | Modify | Thread `fromScan: true` for scan-originated saves while restoring the default batch size |
| `handlers/memory-save.ts` | Modify | Guard the transactional complement recheck so scan-originated saves skip it |
| `tests/pe-orchestration.vitest.ts` | Add | Regression for `tasks.md` vs sibling `checklist.md` |
| `tests/handler-memory-index.vitest.ts` | Modify | Regressions proving the real `memory-save` guard stays active for normal saves and is bypassed only for `fromScan` saves |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix A must stop cross-file lineage reuse. | When PE picks a sibling candidate for `UPDATE` or `REINFORCE`, the save falls back to `CREATE` unless the candidate resolves to the same canonical file path as the current save target. |
| REQ-002 | Fix B must stop scan-originated false positives at the save-time recheck layer. | `memory_index_scan` threads `fromScan: true` into `memory_save`, and `memory-save.ts:2367-2391` skips the transactional complement recheck only for those saves. |
| REQ-003 | Regressions must cover both fixes. | New or updated tests reproduce the sibling-doc lineage case and the scan concurrency case. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Fix A choice must be documented. | Packet records why A2 was chosen over A1. |
| REQ-005 | Fix B choice must be documented. | Packet records why B2 replaced B1 after live acceptance showed B1 fixed the wrong layer, including the `E_LINEAGE 68→0` and `candidate_changed 58→159` evidence. |
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
- **Given** `memory_index_scan` invokes `memory_save` for a packet doc, **when** the save runs with `fromScan: true`, **then** the transactional complement recheck is skipped and the write commits.
- **Given** the same save path is invoked without `fromScan`, **when** a non-complement candidate appears during the transactional recheck, **then** the save still returns `candidate_changed`.
- **Given** the packet docs are validated, **when** `validate.sh --strict --no-recursive` runs, **then** the packet passes without structural errors.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cross-file PE candidates remain visible for similarity scoring but no longer drive lineage-bearing `UPDATE` or `REINFORCE` saves.
- **SC-002**: Scan-originated saves bypass the transactional complement recheck while non-scan saves still surface `candidate_changed`.
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
| Tradeoff | B2 adds a scan-only flag path inside `memory_save` | Medium | The guard is limited to the transactional complement recheck, normal `memory_save` calls keep their existing behavior, and `withSpecFolderLock` already serializes writes per spec folder so B1 was addressing the wrong layer. |
| Tradeoff | B1 was cheaper conceptually but proved insufficient in live acceptance | Medium | The packet documents the observed `E_LINEAGE 68→0` and `candidate_changed 58→159` results so the choice to replace it with B2 stays evidence-based. |
| Dependency | `npm run test:core` currently contains an unrelated failure in `tests/copilot-hook-wiring.vitest.ts` | Medium | Record it explicitly; it is outside the touched files and reproduced in isolation. |
| Dependency | Live acceptance scan depends on an initialized runtime and embedding availability | Medium | Record the attempted command and rerun steps for a proper environment. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the code change itself. The only remaining follow-up is an environment-backed rerun of `memory_index_scan` on `026/009-hook-daemon-parity`.
<!-- /ANCHOR:questions -->
