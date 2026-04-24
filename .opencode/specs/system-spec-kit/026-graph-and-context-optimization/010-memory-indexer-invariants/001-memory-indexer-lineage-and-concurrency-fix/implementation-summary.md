---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: Memory Indexer Lineage and Concurrency Fix"
description: "Implemented the spec-kit-memory indexer fixes for cross-file PE lineage reuse and scan-triggered candidate_changed self-interference, with focused regressions and parent metadata updates."
trigger_phrases:
  - "026/010 implementation"
  - "memory indexer lineage concurrency implementation"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix"
    last_updated_at: "2026-04-23T18:07:07Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Readiness gate reset pending live rerun"
    next_safe_action: "Restart MCP, rerun memory_index_scan on 026/009, record counts"
    blockers:
      - "Live packet acceptance still requires an MCP restart plus a fresh scan of 026/009."
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "A2 was chosen over A1 to preserve the existing similarity search surface and localize the safety rule to PE orchestration."
      - "B2 replaced B1 after live acceptance showed the transactional reconsolidation recheck, not batch overlap, was the real source of candidate_changed."
---
# Implementation Summary: Memory Indexer Lineage and Concurrency Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-memory-indexer-lineage-and-concurrency-fix |
| **Completed** | 2026-04-23T18:07:07Z |
| **Level** | 2 |
| **Outcome** | B2 code landed, but readiness remains blocked until a live-capable packet scan rerun is recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `handlers/save/types.ts` now allows `SimilarMemory` to carry `canonical_file_path`.
- `handlers/pe-gating.ts` now preserves `canonical_file_path` from vector-search results.
- `handlers/save/pe-orchestration.ts` now compares the chosen candidate's canonical file path to the current save target and downgrades cross-file `UPDATE` and `REINFORCE` actions to `CREATE`.
- `handlers/memory-index.ts` now restores the default scan batch size and marks scan-originated saves with `fromScan: true`.
- `handlers/memory-save.ts` now skips the transactional reconsolidation recheck that raises `candidate_changed` when the save originated from `memory_index_scan`.
- `tests/pe-orchestration.vitest.ts` proves a `tasks.md` save will not reuse a sibling `checklist.md` row for PE updates or reinforcements.
- `tests/handler-memory-index.vitest.ts` now proves scan-originated saves pass `fromScan: true` and that non-scan saves still hit the normal guarded path.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read the investigation artifact and the live save/index code paths.
2. Preserved Fix A as A2 after live acceptance confirmed it removes `E_LINEAGE`.
3. Replaced Fix B1 with B2 once the transactional reconsolidation recheck proved to be the real `candidate_changed` source.
4. Implemented the runtime changes first, then updated the focused regressions to cover the scan-only guard.
5. Ran the focused regressions, then `typecheck`, `build`, and the required core-suite commands.
6. Recorded the unrelated full-suite failure and the remaining live acceptance step instead of guessing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### Fix A choice: A2

Reason: it keeps candidate discovery unchanged and only blocks the unsafe mutation at the point where a lineage-bearing decision would otherwise be applied.

### Fix B choice: B2

Reason: live acceptance showed B1 was fixing the wrong layer. Even with serialized batches, the save-time transactional recheck still compared planner-time vs commit-time candidates and rejected each later sibling as `candidate_changed`.

Acceptance summary:

| Mode | E_LINEAGE | candidate_changed | notes |
|---|---|---|---|
| Before fix | 68 | 58 | baseline |
| After A+B1 | 0 | 159 | B1 insufficient, A converted `E_LINEAGE` to `candidate_changed` |
| After A+B2 code/tests | not rerun | not rerun | focused regressions passed locally, but packet acceptance is still blocked until the live-capable rerun is recorded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Focused regressions | `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` | passed (`26/26`) |
| Typecheck | `npm run typecheck` | passed (exit 0) |
| Build | `npm run build` | passed (exit 0) |
| Full core suite | `timeout 240 npm run test:core` | timed out (exit 124) after surfacing unrelated `tests/copilot-hook-wiring.vitest.ts` failure |
| Isolated unrelated failure | `npx vitest run tests/copilot-hook-wiring.vitest.ts` | failed (exit 1) in untouched code |
| Operational packet scan | restart MCP in a live-capable runtime, then rerun `memory_index_scan` on `026/009-hook-daemon-parity` | blocked; until this rerun is recorded, packet readiness and scan counts are not authoritative |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The user-requested live acceptance run against `026/009-hook-daemon-parity` still must be rerun after the MCP restart in a live-capable runtime; until that proof is recorded here, readiness and scan/index counts are not authoritative.
- `npm run test:core` still has an unrelated failure in `tests/copilot-hook-wiring.vitest.ts`, which asserts an unexpected hook path in untouched code.
<!-- /ANCHOR:limitations -->
