---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Task Breakdown: Memory Indexer Lineage and Concurrency Fix"
description: "Tasks for the PE lineage guard, scan serialization, targeted regressions, verification, and packet bookkeeping."
trigger_phrases:
  - "026/010 tasks"
  - "memory indexer lineage concurrency tasks"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix"
    last_updated_at: "2026-04-23T17:48:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed code changes and recorded verification outcomes"
    next_safe_action: "Rerun the live packet scan after restarting the MCP runtime"
    completion_pct: 95
---
# Task Breakdown: Memory Indexer Lineage and Concurrency Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending
- `[x]` complete with evidence in `checklist.md` or `implementation-summary.md`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-01** Read `/tmp/codex-lineage-investigation-output.txt` and confirm both root causes. [EVIDENCE: investigation summary matches the PE lineage path and the scan batch race path.]
- [x] **T-02** Read the live code paths before editing: PE gating, prediction-error decision logic, scan batching, reconsolidation recheck, and save-time transaction flow. [EVIDENCE: `pe-gating.ts`, `prediction-error-gate.ts`, `memory-index.ts`, `reconsolidation-bridge.ts`, `memory-save.ts`.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-03** Add canonical path plumbing to `SimilarMemory` so PE orchestration can reason about same-file identity. [EVIDENCE: `handlers/save/types.ts`, `handlers/pe-gating.ts`.]
- [x] **T-04** Implement Fix A with A2: downgrade cross-file `UPDATE` and `REINFORCE` decisions to `CREATE`. [EVIDENCE: `handlers/save/pe-orchestration.ts`.]
- [x] **T-05** Implement Fix B with B1: force `memory_index_scan` batch size to 1. [EVIDENCE: `handlers/memory-index.ts`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-06** Add a PE regression for `tasks.md` vs sibling `checklist.md`. [EVIDENCE: `tests/pe-orchestration.vitest.ts`.]
- [x] **T-07** Add a scan regression that would throw `candidate_changed` if sibling saves overlapped. [EVIDENCE: `tests/handler-memory-index.vitest.ts`.]
- [x] **T-08** Run the focused regression pair and confirm both pass. [EVIDENCE: `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` returned 25 passed.]
- [x] **T-09** Run `npm run typecheck`. [EVIDENCE: exit 0.]
- [x] **T-10** Run `npm run build`. [EVIDENCE: exit 0.]
- [x] **T-11** Run `npm run test:core` and isolate any unrelated failures. [EVIDENCE: full run timed out under `timeout 180`; isolated repro shows unrelated `tests/copilot-hook-wiring.vitest.ts` assertion failure.]
- [x] **T-12** Attempt the operational acceptance scan on `026/009-hook-daemon-parity` and record the environment blocker. [EVIDENCE: direct CLI-style run hit external Voyage embedding retries and could not finish usefully in this sandbox.]
- [x] **T-13** Create this packet and update the 026 parent metadata. [EVIDENCE: packet docs plus parent `description.json` and `graph-metadata.json` include `010-memory-indexer-lineage-and-concurrency-fix`.]
- [ ] **T-14** Rerun `memory_index_scan` on `026/009-hook-daemon-parity` in a network-enabled MCP runtime and confirm zero `E_LINEAGE` and zero `candidate_changed` failures. [BLOCKED: not achievable in this sandbox without live embedding access and a fully initialized runtime.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Code fixes landed for both root causes
- Regression coverage added for both failure classes
- Required compile/build commands passed
- Packet and parent metadata updated
- Remaining live acceptance rerun is documented, not hidden
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Implementation summary: `implementation-summary.md`
- Investigation source: `/tmp/codex-lineage-investigation-output.txt`
<!-- /ANCHOR:cross-refs -->
