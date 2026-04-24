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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix"
    last_updated_at: "2026-04-23T18:07:07Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Replaced Fix B1 with Fix B2 after live acceptance showed B1 insufficient"
    next_safe_action: "User restart MCP and run memory_index_scan on 009 to confirm zero candidate_changed"
    completion_pct: 90
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
- [x] **T-05** Roll back Fix B1 by removing the forced `scanBatchSize = 1` override. [EVIDENCE: `handlers/memory-index.ts` now uses `BATCH_SIZE`.]
- [x] **T-06** Implement Fix B2 by marking scan-originated saves with `fromScan: true` and skipping the transactional reconsolidation recheck only for those saves. [EVIDENCE: `handlers/memory-index.ts`, `handlers/memory-save.ts`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-07** Preserve the Fix A regression for `tasks.md` vs sibling `checklist.md`. [EVIDENCE: `tests/pe-orchestration.vitest.ts`.]
- [x] **T-08** Replace the old B1 scan serialization test with B2 coverage for `fromScan` propagation and the non-scan control path. [EVIDENCE: `tests/handler-memory-index.vitest.ts`.]
- [x] **T-09** Run the focused regression pair and confirm both pass after the B2 patch. [EVIDENCE: `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` returned `26 passed (26)`.]
- [x] **T-10** Run `npm run typecheck` after the B2 patch. [EVIDENCE: exit 0.]
- [x] **T-11** Run `npm run build` after the B2 patch. [EVIDENCE: exit 0.]
- [x] **T-12** Run `timeout 240 npm run test:core` and isolate any unrelated failures. [EVIDENCE: full run exited 124 after surfacing untouched `tests/copilot-hook-wiring.vitest.ts`; isolated repro exits 1 with the same assertion.]
- [x] **T-13** Validate this packet with `validate.sh --strict --no-recursive` after the B2 doc update. [EVIDENCE: exit 0.]
- [ ] **T-14** Restart MCP, rerun `memory_index_scan` on `026/009-hook-daemon-parity`, and confirm zero `E_LINEAGE` plus zero `candidate_changed`. [BLOCKED: requires user restart / live runtime acceptance.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Code fixes landed for both root causes
- Regression coverage added for both failure classes
- Required compile/build commands passed
- Packet docs updated for B2
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
