---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
title: "Implementation Plan: Memory Indexer Lineage and Concurrency Fix"
description: "Focused pass across PE orchestration, scan batching, and targeted regressions for the E_LINEAGE and candidate_changed failures."
trigger_phrases:
  - "026/010 plan"
  - "memory indexer lineage concurrency plan"
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
# Implementation Plan: Memory Indexer Lineage and Concurrency Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Keep the patch narrow:

1. Preserve canonical file path on PE candidates.
2. Downgrade cross-file `UPDATE` and `REINFORCE` decisions to `CREATE`.
3. Mark scan-originated saves with `fromScan: true` and skip only the save-time transactional reconsolidation recheck.
4. Prove both behaviors with targeted regressions before writing the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Pass Criteria |
|------|---------------|
| Fix A | `tasks.md` vs sibling `checklist.md` regression falls through to `CREATE` and never calls `updateExistingMemory` or `reinforceExistingMemory` |
| Fix B | Scan regression proves `maxInFlight === 1` and zero `candidate_changed` failures |
| Type safety | `npm run typecheck` exits 0 |
| Build | `npm run build` exits 0 |
| Core suite | `npm run test:core` result recorded with exact failure scope |
| Packet validation | `validate.sh --strict --no-recursive` exits 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Technical Context

`memory_index_scan` and `memory_save` share the same save pipeline. The lineage fix had to stay close to PE orchestration so it could see both the candidate identity and the current target path, while the concurrency fix had to stay at the scan caller so normal `memory_save` behavior remained untouched.

### Fix A choice: A2

Chosen path: post-filter at decision time inside `handlers/save/pe-orchestration.ts`.

Reason:

- It preserves the existing candidate search and scoring behavior.
- It avoids changing vector-search filtering semantics for other consumers.
- It makes the lineage safety rule explicit at the exact point where `UPDATE` and `REINFORCE` would otherwise reuse an existing row.

Implementation shape:

- Extend `SimilarMemory` to carry `canonical_file_path`.
- Preserve `canonical_file_path` in `findSimilarMemories()`.
- After `evaluateMemory()` chooses a candidate, compare the candidate's canonical path with the current save target.
- If the paths differ, rewrite the PE decision to `CREATE`.

### Fix B choice: B2

Chosen path: keep the normal scan batch size, but mark scan-originated saves and skip the transactional reconsolidation recheck that compares planner-time vs commit-time candidates.

Reason:

- Live acceptance proved B1 was ineffective because the failure happened inside the save transaction, not in outer batch overlap.
- It keeps normal `memory_save` behavior unchanged.
- It removes the scan-only false positive without touching Fix A or broadening PE behavior.

Implementation shape:

- Restore `memory_index_scan` to the default `BATCH_SIZE`.
- Thread `fromScan: true` from `handlers/memory-index.ts` into `indexMemoryFile()`.
- Guard the `candidate_changed` transactional recheck in `handlers/memory-save.ts` with `!fromScan`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research and exact-path confirmation

- Read `/tmp/codex-lineage-investigation-output.txt`.
- Read the existing PE gating, prediction-error gate, reconsolidation bridge, memory-save transaction path, and scan batch code.
- Confirm the least invasive fix points before editing.

### Phase 2: Code changes

- Add canonical path plumbing to `SimilarMemory`.
- Add the A2 downgrade guard in PE orchestration.
- Revert the forced scan batch size override.
- Thread `fromScan: true` through scan-originated saves.
- Skip the save-time transactional reconsolidation recheck for scan-originated saves only.

### Phase 3: Regression coverage

- Add a PE orchestration regression for `tasks.md` vs sibling `checklist.md`.
- Replace the old scan serialization regression with a scan-originated `fromScan` propagation test and a non-scan control.

### Phase 4: Verification and docs

- Run targeted Vitest first.
- Run `npm run typecheck`, `npm run build`, and `npm run test:core`.
- Attempt the operational acceptance scan and record the exact blocker if the sandbox cannot complete it.
- Write packet docs and update the 026 parent metadata.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Asserts |
|------|---------|
| `tests/pe-orchestration.vitest.ts` | A sibling `checklist.md` candidate cannot drive `UPDATE` or `REINFORCE` for `tasks.md` |
| `tests/handler-memory-index.vitest.ts` | Scan-originated saves pass `fromScan: true`, avoid the fake transactional `candidate_changed` abort, and keep non-scan saves on the normal path |
| `npm run typecheck` | New typings and mocks compile cleanly |
| `npm run build` | Dist output rebuilds cleanly |
| `npm run test:core` | Full suite result recorded exactly, including unrelated failures |
| CLI acceptance attempt | Operational packet scan status recorded honestly |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| `/tmp/codex-lineage-investigation-output.txt` | Read and used as the root-cause source |
| Existing PE gating and lineage invariants | Preserved |
| Existing `SPEC_KIT_BATCH_SIZE` default | Restored as the effective `memory_index_scan` batch size after rolling back B1 |
| External embedding access for live packet acceptance | Blocked in this sandbox |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the four runtime edits plus the two regression changes. The patch is localized to `mcp_server`, so rollback does not require spec-folder migration or data cleanup.
<!-- /ANCHOR:rollback -->
