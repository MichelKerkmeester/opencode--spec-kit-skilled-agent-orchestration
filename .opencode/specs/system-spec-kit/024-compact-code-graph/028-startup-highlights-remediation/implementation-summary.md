---
title: "Implementation Summary: Startup Highlights Remediation [024/028]"
description: "Fixed 3 P1 findings in queryStartupHighlights(): deduplication, path exclusion, incoming-call heuristic."
trigger_phrases:
  - "028 summary"
  - "highlights fix"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-startup-highlights-remediation |
| **Completed** | 2026-04-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Fixed 3 P1 correctness findings from the deep review (2026-04-02) in `queryStartupHighlights()`:

1. **R1 — Deduplication**: Changed `GROUP BY n.symbol_id` to `GROUP BY fn.name, fn.kind, fn.file_path` with `SUM()` aggregation. Eliminates visual duplicates where multiple symbol_ids share the same display fields.

2. **R2 — Path Exclusion**: Added `filtered_nodes` CTE with 10 `NOT LIKE` patterns excluding `site-packages/`, `node_modules/`, `.venv/`, `vendor/`, `dist/`, `build/`, `__pycache__/`, `tests/`, `test_`, and `__tests__`. Non-project code no longer appears in highlights.

3. **R3 — Incoming-Call Heuristic**: Changed edge JOIN from `e.source_id = n.symbol_id` (outgoing calls) to `e.target_id = fn.symbol_id` (incoming calls). Now surfaces the most depended-upon symbols instead of the chattiest callers.

Additionally exposed `highlightCount` parameter through `buildStartupBrief()` for configurability.
<!-- /ANCHOR:what-built -->

**Files Modified**

| File | Change | LOC |
|------|--------|-----|
| `code-graph-db.ts` | Rewrote `queryStartupHighlights()` SQL with 3-CTE chain | ~+15 -10 |
| `startup-brief.ts` | Exposed `highlightCount` param in `buildStartupBrief()` | +1 -1 |
| `startup-brief.vitest.ts` | Added 3 tests (orientation note, empty highlights, custom count) | +15 |

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Verified the call-edge direction contract in the structural indexer before changing ranking logic.
2. Rewrote the startup-highlight SQL into a filtered, aggregated, and ranked pipeline so the output is deduplicated and cleaner.
3. Re-ran focused startup-brief verification and live-query checks to confirm the top results became project-relevant.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Used direct `NOT LIKE` exclusions rather than a new configurable exclusion system to keep the remediation small and reviewable.
- Kept the ranking change local to `queryStartupHighlights()` so the broader startup-brief contract remained untouched.
- Preserved the diversity rule to avoid swapping one noisy highlight shape for another.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- **Unit tests**: 6/6 pass (3 existing + 3 new) in `startup-brief.vitest.ts`
- **TypeScript**: Compiles cleanly (`tsc --noEmit`)
- **Build**: `npm run build` succeeds
- **Live test**: `queryStartupHighlights(5)` returns:
  1. normalizeWhitespace (function) — shared/parsing/ [calls: 10]
  2. getDb (function) — code-graph-db.ts [calls: 10]
  3. ensureSchema (function) — working-memory.ts [calls: 9]
  4. hasTable (function) — vector-index-schema.ts [calls: 9]
  5. Finding (class) — verify_alignment_drift.py [calls: 8]
  - **0 duplicates, 0 vendored/test files, all project code**
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- Path exclusion patterns are hardcoded. A configurable exclusion list would be more flexible but was scoped out per DR-017.
- The `test_` pattern may exclude legitimate project files starting with "test_" that aren't tests. Conservative choice accepted.
<!-- /ANCHOR:limitations -->
