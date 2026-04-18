---
title: "Implementation Summary: Phase 017 Wave D — P2 Maintainability"
description: "Wave D shipped the exhaustiveness hardening, extraction helpers, YAML timing-note cleanup, and deployment guidance without touching the concurrent session-resume or Wave C files."
trigger_phrases:
  - "implementation summary"
  - "017 wave d"
  - "004 p2 maintainability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/005-p2-maintainability"
    last_updated_at: "2026-04-17T18:00:00Z"
    last_updated_by: "copilot-gpt-5.4"
    recent_action: "Wave D implemented"
    next_safe_action: "Optionally run post-ship deep-review x3"
    blockers: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-p2-maintainability |
| **Completed** | 2026-04-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Wave D now closes the six maintainability tasks that were intentionally left off the critical path. You can rely on typed exhaustiveness checks in the save and classifier paths, smaller helper-driven save-time enrichment and reconsolidation code, a deployment note for the shared-`/tmp` Docker pitfall, and a command asset that no longer puts prose timing under `when:`.

### D1 typing hardening

Commit `787bf4f88` introduced `mcp_server/lib/utils/exhaustiveness.ts` and wired `assertNever` across the eight requested unions. The post-insert lookup now uses a `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` contract and keeps the runtime warn-path for unexpected imported variants.

### D2 extraction refactors

Commit `0ac9cdcba` pulled the repeated enrichment error-handling into `runEnrichmentStep` and collapsed `runPostInsertEnrichment` down to a short coordinator that delegates the five lanes to focused helpers. The reconsolidation conflict path now reuses one atomic transaction helper so the distinct-id deprecate path and the legacy content-update path re-run the same stale-predecessor guards.

### D3 YAML and deployment docs

Commit `b26514cbc` closed both D3 tasks: it moved `post_save_indexing` in `spec_kit_complete_confirm.yaml` from a prose `when:` string to the canonical `after:` field, and it published the root `DEPLOYMENT.md` warning about the `-v /tmp:/tmp` anti-pattern. That same commit also documented Copilot concurrency limits, AsyncLocalStorage caller context, and strict-by-default session-resume auth in the deployment guidance.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/utils/exhaustiveness.ts` | Created | Centralize `assertNever` for typed exhaustiveness guards |
| `mcp_server/handlers/save/post-insert.ts` | Modified | Extract enrichment helpers and harden the skip-reason mapping |
| `mcp_server/lib/storage/reconsolidation.ts` | Modified | Reuse one atomic conflict transaction helper |
| `mcp_server/tests/exhaustiveness.vitest.ts` | Created | Pin `assertNever` behavior and consumer patterns |
| `mcp_server/tests/run-enrichment-step.vitest.ts` | Created | Pin helper gating and failure mapping |
| `mcp_server/tests/reconsolidation.vitest.ts` | Modified | Cover both conflict transaction modes |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modified | Move prose timing from `when:` to `after:` |
| `.opencode/skill/system-spec-kit/shared/predicates/boolean-expr.test.ts` | Modified | Assert the exact CP-004 call site stays on `after:` |
| `DEPLOYMENT.md` | Created | Publish deployment guidance at the repo root |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work landed as three cluster commits so the maintainability tasks stay easy to review and easy to revert. Each cluster reran focused Vitest coverage and `tsc --noEmit`, then the packet docs were updated once the final YAML and deployment changes were in place.

The only deliberate deviation from the packet scaffold is the CP-004 fix. The scaffold called for a typed BooleanExpr, but the repo's own grammar rejects that prose as predicate input and tells callers to move it into `after:` instead. Shipping `after:` keeps the behavior and matches the parser contract.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `assertNever` in `exhaustiveness.ts` instead of `assert-never.ts` | The user request and the mcp_server import surface already pointed at `exhaustiveness.ts`, so the helper name now matches the shipped path. |
| Reduce `runPostInsertEnrichment` with wrapper helpers, not one giant inline helper call chain | This keeps the coordinator short enough to review while preserving the lane-specific logs, retry handling, and skip reasons. |
| Use `after:` for CP-004 instead of forcing a fake BooleanExpr | `shared/predicates/boolean-expr.ts` explicitly treats this sentence as prose bleed and recommends `after:` as the canonical fix. |
| Put the deployment note at repo root | The user asked for `DEPLOYMENT.md` there, and the note is useful beyond the system-spec-kit folder. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `./node_modules/.bin/vitest run tests/exhaustiveness.vitest.ts tests/post-insert-deferred.vitest.ts tests/hook-state.vitest.ts tests/m8-trust-state-vocabulary.vitest.ts tests/readiness-contract.vitest.ts` | PASS |
| `./node_modules/.bin/vitest run tests/run-enrichment-step.vitest.ts tests/post-insert-deferred.vitest.ts tests/reconsolidation.vitest.ts tests/p0-b-reconsolidation-composite.vitest.ts` | PASS |
| `node ../../system-spec-kit/node_modules/typescript/bin/tsc --noEmit` | PASS after D1 and D2; rerun again after D3 closeout |
| `shared/predicates/boolean-expr.test.ts` call-site check | PASS after the CP-004 asset update |
| Packet validator | Pending final post-doc run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The optional light gate is still optional.** The packet text calls for post-ship deep-review x3, but that audit loop was not part of the code changes themselves.
2. **The broader prose-`when:` cleanup is still a parking-lot item.** This packet fixed only the CP-004 call site and left the wider migration for R55-P2-004.
<!-- /ANCHOR:limitations -->
