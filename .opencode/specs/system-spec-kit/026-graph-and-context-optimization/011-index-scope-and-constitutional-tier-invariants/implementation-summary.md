---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: Index Scope and Constitutional Tier Invariants"
description: "Working implementation summary for invariant enforcement, cleanup tooling, and verification. This file will be finalized after code, tests, and cleanup complete."
trigger_phrases:
  - "026/011 implementation summary"
  - "index scope implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Baseline captured"
    next_safe_action: "Replace placeholders with real command results after implementation and cleanup"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-index-scope-and-constitutional-tier-invariants |
| **Completed** | In progress |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is in progress, but the core documentation and evidence surfaces are already in place. The implementation packet now includes the specification at [`spec.md`](./spec.md), the execution plan at [`plan.md`](./plan.md), the task ledger at [`tasks.md`](./tasks.md), the investigation record at [`research/research.md`](./research/research.md), and the packet metadata at [`description.json`](./description.json) and [`graph-metadata.json`](./graph-metadata.json). The runtime helper, cleanup CLI, and verification results will replace this provisional summary once the code pass is complete.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first pass was read-only. I mapped the scanner and save paths, inspected the live Voyage-4 schema, and captured the pre-change counts that define success for the cleanup run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete `z_future` rows instead of downgrading them | The invariant is absolute: `z_future` must never be indexed |
| Downgrade invalid constitutional saves to `important` | It preserves the save while stopping polluted constitutional rows |
| Include `.opencode/skill/system-spec-kit/constitutional/README.md` | The constitutional overview doc belongs in the constitutional set |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-change constitutional count | `5700` total, `2` under `/constitutional/` |
| Pre-change `z_future` row count | `5947` |
| Pre-change `external` row count | `0` |
| Pre-change constitutional README count | `0` |
| Duplicate `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` rows | IDs `1` and `9868`; newer row is `9868` |
| `npm run typecheck` | Pending |
| `npm run build` | Pending |
| Focused Vitest | Pending |
| `npm run test:core` | Pending |
| Cleanup dry-run / apply / verify | Pending |
| Strict packet validate | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Final verification is pending.** This file will be updated after runtime changes, tests, cleanup, and packet validation complete.
<!-- /ANCHOR:limitations -->
