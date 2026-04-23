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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix"
    last_updated_at: "2026-04-23T17:48:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed the code patch, regression coverage, and packet documentation"
    next_safe_action: "Restart MCP and rerun the packet scan in a network-enabled runtime"
    blockers:
      - "Operational packet scan acceptance remains environment-blocked in this sandbox."
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "A2 was chosen over A1 to preserve the existing similarity search surface and localize the safety rule to PE orchestration."
      - "B1 was chosen over B2 to fix scan self-interference without threading new save flags through the pipeline."
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
| **Completed** | 2026-04-23T17:48:00Z |
| **Level** | 2 |
| **Outcome** | Code complete; live packet scan acceptance still needs a network-enabled runtime |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `handlers/save/types.ts` now allows `SimilarMemory` to carry `canonical_file_path`.
- `handlers/pe-gating.ts` now preserves `canonical_file_path` from vector-search results.
- `handlers/save/pe-orchestration.ts` now compares the chosen candidate's canonical file path to the current save target and downgrades cross-file `UPDATE` and `REINFORCE` actions to `CREATE`.
- `handlers/memory-index.ts` now serializes `memory_index_scan` save batches by using `scanBatchSize = 1`.
- `tests/pe-orchestration.vitest.ts` proves a `tasks.md` save will not reuse a sibling `checklist.md` row for PE updates or reinforcements.
- `tests/handler-memory-index.vitest.ts` proves a scan-shaped sibling-doc batch never overlaps in flight and therefore cannot self-trigger `candidate_changed`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read the investigation artifact and the live save/index code paths.
2. Chose Fix A as A2 and Fix B as B1 to keep the patch local and low-risk.
3. Implemented the runtime changes first, then added the two focused regressions.
4. Ran the focused regressions, then `typecheck`, `build`, and the required core-suite commands.
5. Recorded the unrelated full-suite failure and the sandbox limitation on the operational acceptance scan instead of guessing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### Fix A choice: A2

Reason: it keeps candidate discovery unchanged and only blocks the unsafe mutation at the point where a lineage-bearing decision would otherwise be applied.

### Fix B choice: B1

Reason: it removes scan self-interference immediately with a one-line caller-side change and avoids introducing a new `fromScan` flag through the save and reconsolidation layers.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Focused regressions | `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` | passed (`25/25`) |
| Typecheck | `npm run typecheck` | passed (exit 0) |
| Build | `npm run build` | passed (exit 0) |
| Full core suite | `timeout 180 npm run test:core` | timed out (exit 124) after surfacing unrelated `tests/copilot-hook-wiring.vitest.ts` failure |
| Isolated unrelated failure | `npx vitest run tests/copilot-hook-wiring.vitest.ts` | failed (exit 1) in untouched code |
| Operational packet scan | direct CLI-style `memory_index_scan` attempt on `026/009-hook-daemon-parity` | blocked by repeated Voyage embedding retries in this sandbox |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The user-requested live acceptance run against `026/009-hook-daemon-parity` was attempted, but the sandboxed runtime repeatedly retried external Voyage embedding calls and could not complete the scan usefully.
- `npm run test:core` still has an unrelated failure in `tests/copilot-hook-wiring.vitest.ts`, which asserts an unexpected hook path in untouched code.
<!-- /ANCHOR:limitations -->
