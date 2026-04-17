---
title: "Phase 017 maintainability extracts"
description: "Phase 017 added the shared assertNever helper, helper-driven post-insert extraction, the shared reconsolidation transaction helper, and the advisoryPreset rename to keep pipeline contracts explicit."
---

# Phase 017 maintainability extracts

## 1. OVERVIEW

Phase 017 added the shared `assertNever` helper, helper-driven post-insert extraction, the shared reconsolidation transaction helper, and the `advisoryPreset` rename to keep pipeline contracts explicit.

This is a pipeline-architecture entry because the changes reshape the internal coordination surfaces without changing the public tool count. The goal was to make the save and routing paths easier to reason about while tightening exhaustiveness guarantees around the same typed unions the runtime already depends on.

---

## 2. CURRENT REALITY

Wave D split the Phase 017 maintainability work across three commits.

- Commit `787bf4f88` introduced `mcp_server/lib/utils/exhaustiveness.ts` and wired `assertNever()` into the Phase 017 target unions, including post-insert enrichment state, shared payload trust-state handling, reconsolidation conflict status, and Gate 3 trigger categorization.
- Commit `0ac9cdcba` extracted `runEnrichmentStep()` inside `mcp_server/handlers/save/post-insert.ts`, reducing `runPostInsertEnrichment()` to a short coordinator while preserving lane-specific logging, retry handling, and skip reasons. The same commit also extracted `executeAtomicReconsolidationTxn()` so reconsolidation conflict handling reuses one atomic transaction helper.
- Commit `ad02986fe` renamed `StructuralRoutingNudgeMeta.readiness` to `advisoryPreset` in `mcp_server/handlers/memory-context.ts`. The field was always the literal `'ready'`, so the new name matches its actual role as a static routing hint instead of implying live readiness state.

Taken together, the Phase 017 pass made the pipeline contracts more explicit without widening the external tool surface: impossible states now fail through one shared helper, the save-time enrichment path is built from named helper lanes, reconsolidation conflict handling shares one transaction envelope, and the graph-first routing hint now uses a name that matches the data it actually carries.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/utils/exhaustiveness.ts` | Lib | Shared `assertNever()` helper for typed exhaustiveness failures |
| `mcp_server/handlers/save/post-insert.ts` | Handler | Defines `runEnrichmentStep()` and the short coordinator form of `runPostInsertEnrichment()` |
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | Defines `executeAtomicReconsolidationTxn()` for shared conflict-path transactions |
| `mcp_server/handlers/memory-context.ts` | Handler | Renames the structural routing hint field from `readiness` to `advisoryPreset` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/exhaustiveness.vitest.ts` | `assertNever()` coverage across representative unions |
| `mcp_server/tests/run-enrichment-step.vitest.ts` | Extracted post-insert helper behavior |
| `mcp_server/tests/reconsolidation.vitest.ts` | Shared conflict transaction behavior |
| `mcp_server/tests/graph-first-routing-nudge.vitest.ts` | `advisoryPreset` rename coverage |

---

## 4. SOURCE METADATA

- Group: Pipeline Architecture
- Source feature title: Phase 017 maintainability extracts
- Phase 017 commits: `787bf4f88`, `0ac9cdcba`, `ad02986fe`
- Current reality source: `026-graph-and-context-optimization/017-review-findings-remediation/004-p2-maintainability/implementation-summary.md`
