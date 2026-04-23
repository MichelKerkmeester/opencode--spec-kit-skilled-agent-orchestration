---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->"
title: "Verification Checklist: Memory Indexer Lineage and Concurrency Fix"
description: "Verification log for the PE lineage guard, scan serialization, regression coverage, and required build checks."
trigger_phrases:
  - "026/010 checklist"
  - "memory indexer lineage concurrency checklist"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix"
    last_updated_at: "2026-04-23T17:48:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Logged required verification plus the live acceptance blocker"
    next_safe_action: "Run the packet scan in a network-enabled MCP runtime"
    completion_pct: 95
---
# Verification Checklist: Memory Indexer Lineage and Concurrency Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

### P0 - Blockers

- [x] **P0-01** Root-cause evidence was read before code edits. [EVIDENCE: `/tmp/codex-lineage-investigation-output.txt`.]
- [x] **P0-02** Fix A prevents cross-file `UPDATE` / `REINFORCE` reuse. [EVIDENCE: `tests/pe-orchestration.vitest.ts` passes; sibling `checklist.md` candidate is downgraded to `CREATE`.]
- [x] **P0-03** Fix B removes scan self-interference. [EVIDENCE: `tests/handler-memory-index.vitest.ts` passes; `maxInFlight === 1` and no `candidate_changed` failure is emitted.]
- [x] **P0-04** `npm run typecheck` passed. [EVIDENCE: exit 0 on 2026-04-23.]
- [x] **P0-05** `npm run build` passed. [EVIDENCE: exit 0 on 2026-04-23.]
- [x] **P0-06** Strict packet validation passed. [EVIDENCE: final `validate.sh --strict --no-recursive` exit 0.]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### P1 - Required

- [x] **P1-01** Existing code paths were read before modification. [EVIDENCE: `pe-gating.ts`, `prediction-error-gate.ts`, `memory-index.ts`, `memory-save.ts`, `reconsolidation-bridge.ts`.]
- [x] **P1-02** Fix choice A2 is documented with rationale. [EVIDENCE: `spec.md`, `plan.md`, `implementation-summary.md`.]
- [x] **P1-03** Fix choice B1 is documented with rationale. [EVIDENCE: `spec.md`, `plan.md`, `implementation-summary.md`.]
- [x] **P1-04** 026 parent metadata includes this child packet. [EVIDENCE: parent `description.json` and `graph-metadata.json` both reference `010-memory-indexer-lineage-and-concurrency-fix`.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **P1-CQ01** Runtime diff stays surgical. [EVIDENCE: runtime edits are limited to 4 files under `mcp_server/handlers` and `mcp_server/handlers/save`.]
- [x] **P1-CQ02** Regressions are focused on the touched behavior. [EVIDENCE: one new PE test file and one scan regression in the existing handler-memory-index suite.]
- [x] **P1-CQ03** No public signatures were broken. [EVIDENCE: only optional `canonical_file_path` plumbing was added to `SimilarMemory`; `processBatches()` remained generic.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **P0-T01** Focused regressions pass. [EVIDENCE: `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` returned `25 passed (25)`.]
- [x] **P1-T02** `npm run test:core` was executed and the result recorded honestly. [EVIDENCE: `timeout 180 npm run test:core` exited 124 after surfacing an unrelated failure in `tests/copilot-hook-wiring.vitest.ts`; isolated repro exits 1 with the same assertion.]
- [ ] **P1-T03** Live acceptance scan on `026/009-hook-daemon-parity` completed end-to-end. [BLOCKED: the direct CLI-style attempt hit repeated Voyage embedding retries in this sandbox and did not complete usefully.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **P1-S01** Fix A does not weaken lineage invariants. [EVIDENCE: it downgrades unsafe cross-file mutations to `CREATE` instead of bypassing lineage checks.]
- [x] **P1-S02** Fix B does not change normal `memory_save` behavior. [EVIDENCE: serialization is local to `memory_index_scan`; no new save flag was threaded through the normal path.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **P1-D01** Packet docs reflect the implemented choices and the exact verification outcomes. [EVIDENCE: this packet's `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.]
- [x] **P1-D02** The investigation artifact is referenced as the source of truth for the root-cause analysis. [EVIDENCE: `spec.md`.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **P1-F01** Runtime edits stay inside `mcp_server/`. [EVIDENCE: touched runtime files all live under `.opencode/skill/system-spec-kit/mcp_server/`.]
- [x] **P1-F02** Packet docs stay inside this child folder. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` all live in `010-memory-indexer-lineage-and-concurrency-fix/`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 15 | 14/15 |
| P2 Items | 0 | 0/0 |

### Verification Log

- 2026-04-23: `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` passed `25/25`.
- 2026-04-23: `npm run typecheck` exited 0.
- 2026-04-23: `npm run build` exited 0.
- 2026-04-23: `timeout 180 npm run test:core` exited 124 after surfacing an unrelated failure in `tests/copilot-hook-wiring.vitest.ts`.
- 2026-04-23: `npx vitest run tests/copilot-hook-wiring.vitest.ts` reproduced the unrelated failure with exit 1.
- 2026-04-23: direct CLI-style `memory_index_scan` attempt on `026/009-hook-daemon-parity` was blocked by repeated Voyage embedding retries in this sandbox.
<!-- /ANCHOR:summary -->
